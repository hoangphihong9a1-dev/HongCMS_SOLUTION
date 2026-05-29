namespace CMS.Backend.Models
{
    public class DashboardViewModel
    {
        public int TotalPosts { get; set; }
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public int TotalUsers { get; set; }
        public int TotalCategories { get; set; }
        public int TotalCustomers { get; set; }
        public List<CMS.Data.Entities.Post> LatestPosts { get; set; } = new List<CMS.Data.Entities.Post>();
        public List<CMS.Data.Entities.Category> LatestCategories { get; set; } = new List<CMS.Data.Entities.Category>();
    }
}
