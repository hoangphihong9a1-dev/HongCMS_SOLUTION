using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    /// <summary>
    /// API quản lý Danh mục Sản phẩm (Product Categories)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ProductCategoriesApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductCategoriesApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy tất cả danh mục sản phẩm
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CategoryProduct>>> GetAll()
        {
            var categories = await _context.CategoriesProducts
                .OrderBy(c => c.Name)
                .ToListAsync();
            return Ok(categories);
        }

        /// <summary>
        /// Lấy danh mục sản phẩm theo Id
        /// </summary>
        /// <param name="id">Id danh mục sản phẩm</param>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CategoryProduct>> GetById(int id)
        {
            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        /// <summary>
        /// Tạo danh mục sản phẩm mới
        /// </summary>
        /// <param name="model">Thông tin danh mục</param>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CategoryProduct>> Create(CategoryProduct model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.CategoriesProducts.Add(model);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        /// <summary>
        /// Cập nhật danh mục sản phẩm
        /// </summary>
        /// <param name="id">Id danh mục cần cập nhật</param>
        /// <param name="model">Thông tin danh mục mới</param>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, CategoryProduct model)
        {
            if (id != model.Id) return BadRequest("Id không khớp.");

            var existing = await _context.CategoriesProducts.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = model.Name;
            existing.Description = model.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Xóa danh mục sản phẩm
        /// </summary>
        /// <param name="id">Id danh mục cần xóa</param>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoriesProducts
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null) return NotFound();

            if (category.Products != null && category.Products.Any())
                return Conflict($"Không thể xóa danh mục '{category.Name}' vì đang có {category.Products.Count} sản phẩm.");

            _context.CategoriesProducts.Remove(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
