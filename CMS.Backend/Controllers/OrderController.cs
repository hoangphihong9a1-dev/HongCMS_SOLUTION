using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
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
                // Hoàn lại số lượng tồn kho cho sản phẩm
                if (detail.Product != null)
                {
                    detail.Product.StockQuantity += detail.Quantity;
                    _context.Products.Update(detail.Product);
                }

                _context.OrderDetails.Remove(detail);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đã xóa sản phẩm khỏi đơn hàng và hoàn lại số lượng tồn kho.";
            }
            else
            {
                TempData["ErrorMessage"] = "Không tìm thấy chi tiết sản phẩm cần xóa.";
            }

            return RedirectToAction(nameof(Edit), new { id = orderId });
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
