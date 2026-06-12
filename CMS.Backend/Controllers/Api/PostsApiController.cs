using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    /// <summary>
    /// API quản lý Bài viết (Posts)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class PostsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy tất cả bài viết, có thể lọc theo danh mục
        /// </summary>
        /// <param name="categoryId">Id danh mục để lọc (tùy chọn)</param>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Post>>> GetAll([FromQuery] int? categoryId)
        {
            var query = _context.Posts
                .Include(p => p.Category)
                .AsQueryable();

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId.Value);

            var posts = await query
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();

            return Ok(posts);
        }

        /// <summary>
        /// Lấy bài viết theo Id
        /// </summary>
        /// <param name="id">Id bài viết</param>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Post>> GetById(int id)
        {
            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return NotFound();
            return Ok(post);
        }

        /// <summary>
        /// Tạo bài viết mới
        /// </summary>
        /// <param name="post">Thông tin bài viết</param>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Post>> Create(Post post)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
        }

        /// <summary>
        /// Cập nhật bài viết
        /// </summary>
        /// <param name="id">Id bài viết cần cập nhật</param>
        /// <param name="post">Thông tin bài viết mới</param>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, Post post)
        {
            if (id != post.Id) return BadRequest("Id không khớp.");

            var existing = await _context.Posts.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = post.Title;
            existing.Content = post.Content;
            existing.ImageUrl = post.ImageUrl;
            existing.CategoryId = post.CategoryId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Xóa bài viết
        /// </summary>
        /// <param name="id">Id bài viết cần xóa</param>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
