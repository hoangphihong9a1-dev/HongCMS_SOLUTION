using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers.Api
{
    /// <summary>
    /// API upload file ảnh lên server
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class UploadApiController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadApiController(IWebHostEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// Upload một file ảnh, lưu vào wwwroot/uploads/
        /// </summary>
        /// <param name="file">File ảnh (jpg, jpeg, png, gif, webp)</param>
        /// <returns>URL tương đối của ảnh đã upload</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Không có file được gửi lên.");

            // Kiểm tra loại file
            var allowedExts = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExts.Contains(ext))
                return BadRequest($"Chỉ cho phép file ảnh: {string.Join(", ", allowedExts)}");

            // Giới hạn 10MB
            if (file.Length > 10 * 1024 * 1024)
                return BadRequest("File quá lớn. Giới hạn 10MB.");

            // Tạo tên file duy nhất
            var uniqueName = $"{Guid.NewGuid():N}{ext}";
            var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
            Directory.CreateDirectory(uploadsDir);

            var filePath = Path.Combine(uploadsDir, uniqueName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativeUrl = $"/uploads/{uniqueName}";
            return Ok(new { url = relativeUrl, fileName = uniqueName });
        }
    }
}
