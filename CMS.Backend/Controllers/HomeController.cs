using Microsoft.AspNetCore.Authorization;
using CMS.Backend.Models;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            var viewModel = new DashboardViewModel
            {
                TotalPosts = _context.Posts.Count(),
                TotalProducts = _context.Products.Count(),
                TotalOrders = _context.Orders.Count(),
                TotalUsers = _context.Users.Count(),
                TotalCategories = _context.Categories.Count(),
                TotalCustomers = _context.Customers.Count(),
                LatestPosts = _context.Posts
                    .Include(p => p.Category)
                    .OrderByDescending(p => p.CreatedDate)
                    .Take(5)
                    .ToList(),
                LatestCategories = _context.Categories
                    .OrderByDescending(c => c.Id)
                    .Take(5)
                    .ToList()
            };

            return View(viewModel);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

