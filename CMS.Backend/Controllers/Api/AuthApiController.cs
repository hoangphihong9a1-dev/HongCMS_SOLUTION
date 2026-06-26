using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CMS.Backend.Controllers.Api
{
    /// <summary>
    /// API xác thực tài khoản quản trị (Admin / Editor)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Đăng nhập tài khoản quản trị
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] AdminLoginRequest model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest("Tên đăng nhập và mật khẩu không được để trống.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
            if (user != null)
            {
                var hasher = new PasswordHasher<User>();
                var result = hasher.VerifyHashedPassword(user, user.PasswordHash, model.Password);

                bool isPasswordValid = false;
                if (result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded)
                {
                    isPasswordValid = true;
                }
                else if (user.PasswordHash == model.Password) // Fallback cho admin mật khẩu thường
                {
                    isPasswordValid = true;
                }

                if (isPasswordValid)
                {
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.Username),
                        new Claim("FullName", user.FullName ?? ""),
                        new Claim(ClaimTypes.Role, user.Role ?? "Admin")
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    var authProperties = new AuthenticationProperties
                    {
                        IsPersistent = model.RememberMe
                    };

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

                    return Ok(new
                    {
                        user.Id,
                        user.Username,
                        user.FullName,
                        user.Role
                    });
                }
            }

            return Unauthorized("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }

        /// <summary>
        /// Đăng xuất tài khoản quản trị
        /// </summary>
        [HttpPost("logout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { Message = "Đăng xuất thành công." });
        }

        /// <summary>
        /// Lấy thông tin tài khoản đang đăng nhập hiện tại
        /// </summary>
        [HttpGet("me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult GetCurrentUser()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                var username = User.Identity.Name;
                var fullName = User.FindFirst("FullName")?.Value ?? "";
                var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "";

                return Ok(new
                {
                    Username = username,
                    FullName = fullName,
                    Role = role
                });
            }

            return Unauthorized("Chưa đăng nhập.");
        }
    }

    public class AdminLoginRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public bool RememberMe { get; set; }
    }
}
