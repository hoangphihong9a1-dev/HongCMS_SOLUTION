using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class OrderDetailsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public OrderDetailsApiController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetAll()
        {
            var details = await _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .OrderByDescending(od => od.OrderId)
                .ToListAsync();
            return Ok(details);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetail>> GetById(int id)
        {
            var detail = await _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .FirstOrDefaultAsync(od => od.Id == id);
            return detail == null ? NotFound() : Ok(detail);
        }

        [HttpPost]
        public async Task<ActionResult<OrderDetail>> Create(OrderDetail model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _context.OrderDetails.Add(model);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, OrderDetail model)
        {
            if (id != model.Id) return BadRequest();
            var existing = await _context.OrderDetails.FindAsync(id);
            if (existing == null) return NotFound();
            existing.OrderId = model.OrderId;
            existing.ProductId = model.ProductId;
            existing.Quantity = model.Quantity;
            existing.UnitPrice = model.UnitPrice;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var detail = await _context.OrderDetails.FindAsync(id);
            if (detail == null) return NotFound();
            _context.OrderDetails.Remove(detail);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
