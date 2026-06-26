using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductCategoryController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductCategoryController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: /ProductCategory
        public IActionResult Index()
        {
            var categories = _context.CategoriesProducts
                .OrderBy(c => c.Name)
                .ToList();
            return View(categories);
        }

        // GET: /ProductCategory/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /ProductCategory/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CategoryProduct model, IFormFile? ImageFile)
        {
            if (ImageFile != null && ImageFile.Length > 0)
            {
                var allowedExts = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var ext = Path.GetExtension(ImageFile.FileName).ToLowerInvariant();
                if (allowedExts.Contains(ext))
                {
                    var uniqueName = $"{Guid.NewGuid():N}{ext}";
                    var uploadsDir = Path.Combine(_env.WebRootPath, "uploads", "categories");
                    Directory.CreateDirectory(uploadsDir);

                    var filePath = Path.Combine(uploadsDir, uniqueName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        ImageFile.CopyTo(stream);
                    }

                    model.ImageUrl = $"/uploads/categories/{uniqueName}";
                }
            }

            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // GET: /ProductCategory/Edit/5
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        // POST: /ProductCategory/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, CategoryProduct model, IFormFile? ImageFile)
        {
            if (id != model.Id) return NotFound();

            if (ImageFile != null && ImageFile.Length > 0)
            {
                var allowedExts = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var ext = Path.GetExtension(ImageFile.FileName).ToLowerInvariant();
                if (allowedExts.Contains(ext))
                {
                    var uniqueName = $"{Guid.NewGuid():N}{ext}";
                    var uploadsDir = Path.Combine(_env.WebRootPath, "uploads", "categories");
                    Directory.CreateDirectory(uploadsDir);

                    var filePath = Path.Combine(uploadsDir, uniqueName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        ImageFile.CopyTo(stream);
                    }

                    model.ImageUrl = $"/uploads/categories/{uniqueName}";
                }
            }
            else
            {
                var existing = _context.CategoriesProducts.AsNoTracking().FirstOrDefault(c => c.Id == model.Id);
                if (existing != null)
                {
                    model.ImageUrl = existing.ImageUrl;
                }
            }

            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // POST: /ProductCategory/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts
                .Include(c => c.Products)
                .FirstOrDefault(c => c.Id == id);

            if (category == null) return NotFound();

            // Kiểm tra khóa ngoại
            if (category.Products != null && category.Products.Any())
            {
                TempData["ErrorMessage"] = $"Không thể xóa danh mục '{category.Name}' vì đang có {category.Products.Count} sản phẩm thuộc danh mục này.";
                return RedirectToAction(nameof(Index));
            }

            _context.CategoriesProducts.Remove(category);
            _context.SaveChanges();
            TempData["SuccessMessage"] = $"Đã xóa danh mục '{category.Name}'.";
            return RedirectToAction(nameof(Index));
        }
    }
}
