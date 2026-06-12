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
    public class CustomersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CustomersApiController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetAll()
        {
            return Ok(await _context.Customers.OrderBy(c => c.FullName).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetById(int id)
        {
            var c = await _context.Customers.FindAsync(id);
            return c == null ? NotFound() : Ok(c);
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> Create(Customer customer)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (await _context.Customers.AnyAsync(c => c.Email == customer.Email))
                return Conflict("Email da duoc su dung.");
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Customer customer)
        {
            if (id != customer.Id) return BadRequest();
            var existing = await _context.Customers.FindAsync(id);
            if (existing == null) return NotFound();
            existing.FullName = customer.FullName;
            existing.Email = customer.Email;
            existing.Phone = customer.Phone;
            existing.Address = customer.Address;
            existing.Password = customer.Password;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _context.Customers.FindAsync(id);
            if (c == null) return NotFound();
            if (await _context.Orders.AnyAsync(o => o.CustomerId == id))
                return Conflict("Khong the xoa vi da co don hang.");
            _context.Customers.Remove(c);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult<Customer>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email và mật khẩu không được trống.");
            }
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == request.Email && c.Password == request.Password);
            if (customer == null)
            {
                return Unauthorized("Email hoặc mật khẩu không chính xác.");
            }
            return Ok(customer);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
