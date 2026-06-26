using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class OrdersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        public OrdersApiController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAll(
            [FromQuery] int? customerId = null,
            [FromQuery] int? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            var query = _context.Orders.AsQueryable();

            if (customerId.HasValue)
            {
                query = query.Where(o => o.CustomerId == customerId.Value);
            }

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            var orders = await query
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetByCustomerId(int customerId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)!
                    .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)!
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
            return order == null ? NotFound() : Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> Create(Order model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (model.OrderDate == default) model.OrderDate = DateTime.Now;

            // Trừ số lượng tồn kho sản phẩm trong database
            if (model.OrderDetails != null)
            {
                foreach (var detail in model.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(detail.ProductId);
                    if (product != null)
                    {
                        if (product.StockQuantity >= detail.Quantity)
                        {
                            product.StockQuantity -= detail.Quantity;
                        }
                        else
                        {
                            product.StockQuantity = 0; // Đặt về 0 nếu mua vượt quá tồn kho
                        }
                        _context.Products.Update(product);
                    }
                }
            }

            _context.Orders.Add(model);
            await _context.SaveChangesAsync();

            // Load đầy đủ thông tin Product trong OrderDetails để hiển thị tên sản phẩm trong email
            var fullOrder = await _context.Orders
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == model.Id);

            var customer = await _context.Customers.FindAsync(model.CustomerId);
            if (customer != null && !string.IsNullOrEmpty(customer.Email) && fullOrder != null)
            {
                // Chạy ngắt quãng (Background task) để không làm chậm response của khách hàng khi đặt hàng
                _ = Task.Run(() => SendOrderConfirmationEmail(fullOrder, customer));
            }

            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        private async Task SendOrderConfirmationEmail(Order order, Customer customer)
        {
            try
            {
                var smtpHost = _configuration["EmailSettings:SmtpHost"] ?? "smtp.gmail.com";
                var smtpPortStr = _configuration["EmailSettings:SmtpPort"] ?? "587";
                var smtpPort = int.Parse(smtpPortStr);
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderPassword = _configuration["EmailSettings:SenderPassword"];

                if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
                {
                    Console.WriteLine("CẢNH BÁO: EmailSettings chưa được cấu hình đầy đủ trong appsettings.json. Bỏ qua gửi email.");
                    return;
                }

                using (var client = new System.Net.Mail.SmtpClient(smtpHost, smtpPort))
                {
                    client.EnableSsl = true;
                    client.UseDefaultCredentials = false;
                    client.Credentials = new System.Net.NetworkCredential(senderEmail, senderPassword);

                    var mailMessage = new System.Net.Mail.MailMessage();
                    mailMessage.From = new System.Net.Mail.MailAddress(senderEmail, "HongCMS Shop");
                    mailMessage.To.Add(customer.Email);
                    mailMessage.Subject = $"[HongCMS] Đặt hàng thành công - Đơn hàng #{order.Id}";
                    mailMessage.IsBodyHtml = true;

                    var sb = new System.Text.StringBuilder();
                    sb.Append("<html><body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>");
                    sb.Append("<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>");
                    sb.Append("<h2 style='color: #0d9488; text-align: center; margin-bottom: 20px;'>🎉 ĐẶT HÀNG THÀNH CÔNG!</h2>");
                    sb.Append($"<p>Xin chào <strong>{customer.FullName}</strong>,</p>");
                    sb.Append("<p>Cảm ơn bạn đã mua sắm tại <strong>HongCMS</strong>. Đơn hàng của bạn đã được ghi nhận hệ thống và đang chờ xét duyệt.</p>");
                    sb.Append("<hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;'/>");
                    
                    sb.Append("<h3 style='color: #334155;'>📍 Thông tin nhận hàng:</h3>");
                    sb.Append($"<p style='margin: 4px 0;'><strong>Người nhận:</strong> {customer.FullName}</p>");
                    sb.Append($"<p style='margin: 4px 0;'><strong>Số điện thoại:</strong> {customer.Phone}</p>");
                    sb.Append($"<p style='margin: 4px 0;'><strong>Địa chỉ giao hàng:</strong> {customer.Address}</p>");
                    sb.Append($"<p style='margin: 4px 0;'><strong>Ngày đặt hàng:</strong> {order.OrderDate:dd/MM/yyyy HH:mm}</p>");

                    sb.Append("<hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;'/>");
                    sb.Append("<h3 style='color: #334155;'>📦 Chi tiết sản phẩm mua:</h3>");
                    sb.Append("<table style='width: 100%; border-collapse: collapse;'>");
                    sb.Append("<thead style='background-color: #f8fafc;'>");
                    sb.Append("<tr><th style='padding: 8px; border: 1px solid #cbd5e1; text-align: left;'>Sản phẩm</th>");
                    sb.Append("<th style='padding: 8px; border: 1px solid #cbd5e1; text-align: center;'>Số lượng</th>");
                    sb.Append("<th style='padding: 8px; border: 1px solid #cbd5e1; text-align: right;'>Đơn giá</th>");
                    sb.Append("<th style='padding: 8px; border: 1px solid #cbd5e1; text-align: right;'>Thành tiền</th></tr>");
                    sb.Append("</thead><tbody>");

                    decimal totalAmount = 0;
                    if (order.OrderDetails != null)
                    {
                        foreach (var detail in order.OrderDetails)
                        {
                            var productName = detail.Product?.Name ?? $"Sản phẩm #{detail.ProductId}";
                            var subtotal = detail.Quantity * detail.UnitPrice;
                            totalAmount += subtotal;

                            sb.Append("<tr>");
                            sb.Append($"<td style='padding: 8px; border: 1px solid #cbd5e1;'>{productName}</td>");
                            sb.Append($"<td style='padding: 8px; border: 1px solid #cbd5e1; text-align: center;'>{detail.Quantity}</td>");
                            sb.Append($"<td style='padding: 8px; border: 1px solid #cbd5e1; text-align: right;'>{detail.UnitPrice:N0}đ</td>");
                            sb.Append($"<td style='padding: 8px; border: 1px solid #cbd5e1; text-align: right;'>{subtotal:N0}đ</td>");
                            sb.Append("</tr>");
                        }
                    }
                    sb.Append("</tbody></table>");

                    sb.Append($"<h3 style='text-align: right; color: #0d9488; margin-top: 20px;'>Tổng thanh toán: {totalAmount:N0}đ</h3>");
                    
                    sb.Append("<hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;'/>");
                    sb.Append("<p style='font-size: 11px; color: #64748b; text-align: center;'>Đây là email tự động từ hệ thống cửa hàng HongCMS. Vui lòng không phản hồi email này.</p>");
                    sb.Append("</div></body></html>");

                    mailMessage.Body = sb.ToString();

                    await client.SendMailAsync(mailMessage);
                    Console.WriteLine($"[EmailService] Gửi email xác nhận đặt hàng thành công tới: {customer.Email}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EmailService] LỖI KHI GỬI EMAIL: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Order model)
        {
            if (id != model.Id) return BadRequest();
            
            var existing = await _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.Id == id);
                
            if (existing == null) return NotFound();
            
            // Chỉ cho phép sửa nếu đơn hàng đang ở trạng thái Chờ duyệt (0)
            // Ngoại lệ: Cho phép hủy đơn hàng (đổi trạng thái sang 4) bất kỳ lúc nào nếu chưa giao
            if (existing.Status != 0 && model.Status != 4)
            {
                return BadRequest("Không thể sửa đơn hàng đã được duyệt hoặc đang vận chuyển.");
            }
            
            existing.Notes = model.Notes;
            existing.Status = model.Status;

            if (model.Customer != null && existing.Customer != null && existing.Status == 0)
            {
                existing.Customer.FullName = model.Customer.FullName;
                existing.Customer.Email = model.Customer.Email;
                existing.Customer.Phone = model.Customer.Phone;
                existing.Customer.Address = model.Customer.Address;
            }
            
            if (model.OrderDetails != null && existing.Status == 0)
            {
                // Xóa chi tiết không còn xuất hiện trong model gửi lên
                var detailsToRemove = existing.OrderDetails
                    .Where(od => !model.OrderDetails.Any(mod => mod.ProductId == od.ProductId))
                    .ToList();
                foreach (var detail in detailsToRemove)
                {
                    _context.OrderDetails.Remove(detail);
                }

                // Thêm mới hoặc cập nhật chi tiết đơn hàng
                foreach (var detail in model.OrderDetails)
                {
                    var existingDetail = existing.OrderDetails
                        .FirstOrDefault(od => od.ProductId == detail.ProductId);
                    if (existingDetail != null)
                    {
                        existingDetail.Quantity = detail.Quantity;
                        existingDetail.UnitPrice = detail.UnitPrice;
                    }
                    else
                    {
                        existing.OrderDetails.Add(new OrderDetail
                        {
                            OrderId = id,
                            ProductId = detail.ProductId,
                            Quantity = detail.Quantity,
                            UnitPrice = detail.UnitPrice
                        });
                    }
                }
            }
            
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            if (await _context.OrderDetails.AnyAsync(od => od.OrderId == id))
                return Conflict("Khong the xoa don hang vi co chi tiet.");
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
