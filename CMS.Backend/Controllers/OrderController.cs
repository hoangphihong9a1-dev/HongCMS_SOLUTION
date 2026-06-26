using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public OrderController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: /Order
        public IActionResult Index()
        {
            var orders = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToList();

            return View(orders);
        }

        // GET: /Order/Create
        public IActionResult Create()
        {
            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName");
            return View();
        }

        // POST: /Order/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Order model)
        {
            if (ModelState.IsValid)
            {
                if (model.OrderDate == default)
                {
                    model.OrderDate = DateTime.Now;
                }
                _context.Orders.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName", model.CustomerId);
            return View(model);
        }

        // GET: /Order/Edit/5
        public IActionResult Edit(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);
            if (order == null) return NotFound();

            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName", order.CustomerId);
            return View(order);
        }

        // POST: /Order/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Order model, string customerEmail)
        {
            if (id != model.Id) return NotFound();

            // Loại bỏ kiểm tra hợp lệ của các thực thể liên kết (Customer, OrderDetails)
            ModelState.Remove("Customer");
            ModelState.Remove("OrderDetails");

            if (ModelState.IsValid)
            {
                // Cập nhật email khách hàng nếu có thay đổi
                var customer = _context.Customers.Find(model.CustomerId);
                if (customer != null && !string.IsNullOrEmpty(customerEmail))
                {
                    customer.Email = customerEmail;
                    _context.Customers.Update(customer);
                }

                _context.Orders.Update(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName", model.CustomerId);
            return View(model);
        }

        // POST: /Order/RemoveDetail
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult RemoveDetail(int orderId, int detailId)
        {
            var detail = _context.OrderDetails
                .Include(od => od.Product)
                .FirstOrDefault(od => od.Id == detailId);

            if (detail != null)
            {
                var productName = detail.Product?.Name ?? $"Sản phẩm #{detail.ProductId}";
                var quantity = detail.Quantity;
                var unitPrice = detail.UnitPrice;

                // Hoàn lại số lượng tồn kho cho sản phẩm
                if (detail.Product != null)
                {
                    detail.Product.StockQuantity += detail.Quantity;
                    _context.Products.Update(detail.Product);
                }

                _context.OrderDetails.Remove(detail);
                _context.SaveChanges();

                // Lấy thông tin đơn hàng và khách hàng để gửi email thông báo
                var order = _context.Orders
                    .Include(o => o.Customer)
                    .FirstOrDefault(o => o.Id == orderId);

                if (order != null && order.Customer != null && !string.IsNullOrEmpty(order.Customer.Email))
                {
                    _ = Task.Run(() => SendProductRemovedEmail(order, order.Customer, productName, quantity, unitPrice));
                }

                TempData["SuccessMessage"] = "Đã xóa sản phẩm khỏi đơn hàng và hoàn lại số lượng tồn kho.";
            }
            else
            {
                TempData["ErrorMessage"] = "Không tìm thấy chi tiết sản phẩm cần xóa.";
            }

            return RedirectToAction(nameof(Edit), new { id = orderId });
        }

        private async Task SendProductRemovedEmail(Order order, Customer customer, string productName, int quantity, decimal unitPrice)
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
                    mailMessage.Subject = $"[HongCMS] Cập nhật đơn hàng #{order.Id} - Sản phẩm đã bị xóa";
                    mailMessage.IsBodyHtml = true;

                    var sb = new System.Text.StringBuilder();
                    sb.Append("<html><body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>");
                    sb.Append("<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>");
                    sb.Append("<h2 style='color: #dc2626; text-align: center; margin-bottom: 20px;'>⚠️ THÔNG BÁO THAY ĐỔI ĐƠN HÀNG</h2>");
                    sb.Append($"<p>Xin chào <strong>{customer.FullName}</strong>,</p>");
                    sb.Append($"<p>Chúng tôi xin thông báo đơn hàng <strong>#{order.Id}</strong> của bạn đã có sự thay đổi từ phía quản trị viên hệ thống.</p>");
                    sb.Append("<p><strong>Sản phẩm sau đây đã được xóa khỏi đơn hàng của bạn:</strong></p>");
                    
                    sb.Append("<div style='background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;'>");
                    sb.Append($"<p style='margin: 4px 0;'><strong>Tên sản phẩm:</strong> {productName}</p>");
                    sb.Append($"<p style='margin: 4px 0;'><strong>Số lượng đã xóa:</strong> {quantity}</p>");
                    sb.Append($"<p style='margin: 4px 0;'><strong>Đơn giá:</strong> {unitPrice:N0}đ</p>");
                    sb.Append($"<p style='margin: 4px 0;'><strong>Tổng tiền giảm:</strong> {(quantity * unitPrice):N0}đ</p>");
                    sb.Append("</div>");

                    sb.Append("<p>Cửa hàng đã tự động hoàn lại số lượng tồn kho tương ứng cho sản phẩm này.</p>");
                    sb.Append("<p>Nếu bạn không thực hiện yêu cầu này hoặc có bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi ngay lập tức.</p>");
                    
                    sb.Append("<hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;'/>");
                    sb.Append("<p style='font-size: 11px; color: #64748b; text-align: center;'>Đây là email tự động từ hệ thống cửa hàng HongCMS. Vui lòng không phản hồi email này.</p>");
                    sb.Append("</div></body></html>");

                    mailMessage.Body = sb.ToString();

                    await client.SendMailAsync(mailMessage);
                    Console.WriteLine($"[EmailService] Gửi email thông báo xóa sản phẩm thành công tới: {customer.Email}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EmailService] LỖI KHI GỬI EMAIL THÔNG BÁO XÓA SẢN PHẨM: {ex.Message}");
            }
        }

        // POST: /Order/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            // Kiểm tra khóa ngoại từ OrderDetails
            var hasDetails = _context.OrderDetails.Any(od => od.OrderId == id);
            if (hasDetails)
            {
                TempData["ErrorMessage"] = $"Không thể xóa đơn hàng #{order.Id} vì có chứa chi tiết đơn hàng (sản phẩm).";
                return RedirectToAction(nameof(Index));
            }

            _context.Orders.Remove(order);
            _context.SaveChanges();
            TempData["SuccessMessage"] = $"Đã xóa đơn hàng #{order.Id}.";
            return RedirectToAction(nameof(Index));
        }
    }
}
