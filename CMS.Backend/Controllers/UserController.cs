using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /User
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // GET: /User/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /User/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model, string password)
        {
            // Kiểm tra tên đăng nhập đã tồn tại chưa
            var exists = _context.Users.Any(u => u.Username == model.Username);
            if (exists)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
            }

            if (string.IsNullOrWhiteSpace(password))
            {
                ModelState.AddModelError("PasswordHash", "Mật khẩu không được để trống!");
            }

            if (ModelState.IsValid)
            {
                var hasher = new PasswordHasher<User>();
                model.PasswordHash = hasher.HashPassword(model, password);
                
                _context.Users.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            return View(model);
        }

        // GET: /User/Edit/5
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        // POST: /User/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, User model, string? newPassword)
        {
            if (id != model.Id) return NotFound();

            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            // Loại bỏ kiểm tra PasswordHash khỏi ModelState vì nó không được bind trực tiếp từ form
            ModelState.Remove("PasswordHash");

            if (ModelState.IsValid)
            {
                user.FullName = model.FullName;
                user.Role = model.Role;

                // Nếu nhập mật khẩu mới thì băm và đổi, nếu để trống thì giữ mật khẩu cũ
                if (!string.IsNullOrWhiteSpace(newPassword))
                {
                    var hasher = new PasswordHasher<User>();
                    user.PasswordHash = hasher.HashPassword(user, newPassword);
                }

                _context.SaveChanges();
                TempData["SuccessMessage"] = "Cập nhật thành viên thành công!";
                return RedirectToAction(nameof(Index));
            }

            return View(model);
        }

        // POST: /User/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
