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
    public class OrdersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public OrdersApiController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
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
            _context.Orders.Add(model);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Order model)
        {
            if (id != model.Id) return BadRequest();
            var existing = await _context.Orders.FindAsync(id);
            if (existing == null) return NotFound();
            existing.CustomerId = model.CustomerId;
            existing.Status = model.Status;
            existing.Notes = model.Notes;
            existing.OrderDate = model.OrderDate;
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
