using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CMS.Backend.Data
{
    public static class DbInitializer
    {
        public static void Seed(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // Clear old data to rebuild a clean tech store
            if (context.OrderDetails.Any())
            {
                context.OrderDetails.RemoveRange(context.OrderDetails);
            }
            if (context.Orders.Any())
            {
                context.Orders.RemoveRange(context.Orders);
            }
            if (context.Products.Any())
            {
                context.Products.RemoveRange(context.Products);
            }
            if (context.CategoriesProducts.Any())
            {
                context.CategoriesProducts.RemoveRange(context.CategoriesProducts);
            }
            if (context.Posts.Any())
            {
                context.Posts.RemoveRange(context.Posts);
            }
            if (context.Categories.Any())
            {
                context.Categories.RemoveRange(context.Categories);
            }
            context.SaveChanges();

            // 1. Seed Blog Categories
            var blogCategories = new List<Category>
            {
                new Category { Name = "Đánh giá công nghệ", Description = "Đánh giá chi tiết smartphone, laptop, phụ kiện." },
                new Category { Name = "Tin tức & Sự kiện", Description = "Tin tức mới nhất về thế giới công nghệ." },
                new Category { Name = "Thủ thuật & Hướng dẫn", Description = "Chia sẻ mẹo vặt, thủ thuật công nghệ hữu ích." }
            };
            context.Categories.AddRange(blogCategories);
            context.SaveChanges();

            // 2. Seed Blog Posts
            var posts = new List<Post>
            {
                new Post
                {
                    Title = "Đánh giá iPhone 15 Pro Max sau 6 tháng sử dụng thực tế",
                    Content = "Sau nửa năm ra mắt, iPhone 15 Pro Max vẫn khẳng định vị thế dẫn đầu nhờ thiết kế titan siêu nhẹ, chip A17 Pro chơi game mượt mà và camera zoom quang học 5x cực kỳ chất lượng. Thời lượng pin cực tốt đáp ứng trọn vẹn một ngày dài làm việc cường độ cao.",
                    ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
                    CategoryId = blogCategories[0].Id,
                    CreatedDate = DateTime.Now.AddDays(-5)
                },
                new Post
                {
                    Title = "Sự kiện Apple WWDC 2026: Những đột phá AI được kỳ vọng",
                    Content = "Sự kiện WWDC 2026 sắp diễn ra hứa hẹn sẽ mang đến những cải tiến lớn về trí tuệ nhân tạo (AI) tích hợp sâu vào iOS 20 và macOS mới. Apple đang tập trung mạnh mẽ vào các mô hình ngôn ngữ lớn chạy trực tiếp trên thiết bị để đảm bảo tính riêng tư.",
                    ImageUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
                    CategoryId = blogCategories[1].Id,
                    CreatedDate = DateTime.Now.AddDays(-2)
                },
                new Post
                {
                    Title = "5 thủ thuật giúp tăng gấp đôi thời lượng pin trên Windows 11",
                    Content = "Để kéo dài thời gian sử dụng laptop Windows 11, bạn nên kích hoạt chế độ Battery Saver, giới hạn các ứng dụng chạy nền không cần thiết, giảm tần số quét màn hình xuống 60Hz và chuyển các ứng dụng sang giao diện tối (Dark mode).",
                    ImageUrl = "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
                    CategoryId = blogCategories[2].Id,
                    CreatedDate = DateTime.Now.AddDays(-1)
                }
            };
            context.Posts.AddRange(posts);

            // 3. Seed Product Categories
            var productCategories = new List<CategoryProduct>
            {
                new CategoryProduct 
                { 
                    Name = "Điện thoại", 
                    Description = "Điện thoại thông minh chính hãng từ Apple, Samsung, Xiaomi...",
                    ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&q=80"
                },
                new CategoryProduct 
                { 
                    Name = "Laptop", 
                    Description = "Máy tính xách tay văn phòng, học tập, đồ họa, gaming mỏng nhẹ...",
                    ImageUrl = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=150&q=80"
                },
                new CategoryProduct 
                { 
                    Name = "Đồng hồ thông minh", 
                    Description = "Smartwatch theo dõi sức khỏe, thể thao chuyên nghiệp...",
                    ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=150&q=80"
                },
                new CategoryProduct 
                { 
                    Name = "Phụ kiện", 
                    Description = "Bàn phím cơ, chuột không dây, tai nghe chống ồn...",
                    ImageUrl = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=150&q=80"
                }
            };
            context.CategoriesProducts.AddRange(productCategories);
            context.SaveChanges();

            // 4. Seed Tech Products
            var products = new List<Product>
            {
                // Category 1: Điện thoại
                new Product
                {
                    Name = "iPhone 15 Pro Max 256GB - Titan Tự Nhiên",
                    Price = 29990000,
                    StockQuantity = 50,
                    ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
                    Description = "Thiết kế titan bền bỉ và nhẹ nhất từ trước đến nay của Apple. Nút Action tùy chỉnh tiện lợi. Hệ thống camera zoom 5x đỉnh cao và chip A17 Pro mang lại hiệu năng đỉnh phong.",
                    CategoryProductId = productCategories[0].Id
                },
                new Product
                {
                    Name = "Samsung Galaxy S24 Ultra 12GB/512GB",
                    Price = 28490000,
                    StockQuantity = 40,
                    ImageUrl = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
                    Description = "Dẫn đầu kỷ nguyên trí tuệ nhân tạo (Galaxy AI). Khung viền titan sang trọng, bút S Pen đa năng tích hợp, màn hình phẳng 6.8 inch 120Hz siêu sáng và camera 200MP zoom 100x cực đỉnh.",
                    CategoryProductId = productCategories[0].Id
                },
                new Product
                {
                    Name = "Xiaomi 14 Ultra 16GB/512GB",
                    Price = 21990000,
                    StockQuantity = 25,
                    ImageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
                    Description = "Đột phá nhiếp ảnh với cụm 4 camera Leica chuyên nghiệp cảm biến 1 inch thế hệ mới. Màn hình cong tràn cạnh All Around Liquid siêu mượt và sạc siêu nhanh 90W.",
                    CategoryProductId = productCategories[0].Id
                },

                // Category 2: Laptop
                new Product
                {
                    Name = "Apple MacBook Pro 14 inch M3 (8GB RAM / 512GB SSD)",
                    Price = 39990000,
                    StockQuantity = 20,
                    ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
                    Description = "Sức mạnh từ vi xử lý M3 kiến trúc 3nm thế hệ mới. Màn hình Liquid Retina XDR tuyệt đẹp, thời lượng pin ấn tượng lên đến 22 giờ sử dụng liên tục.",
                    CategoryProductId = productCategories[1].Id
                },
                new Product
                {
                    Name = "ASUS ROG Zephyrus G14 OLED Gaming Laptop",
                    Price = 34490000,
                    StockQuantity = 15,
                    ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
                    Description = "Laptop gaming mỏng nhẹ tối thượng sở hữu màn hình OLED 120Hz màu sắc chuẩn xác, card đồ họa RTX 4060 mạnh mẽ cân mọi tựa game AAA hiện nay.",
                    CategoryProductId = productCategories[1].Id
                },
                new Product
                {
                    Name = "Dell XPS 13 9340 Core Ultra 7",
                    Price = 36990000,
                    StockQuantity = 10,
                    ImageUrl = "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
                    Description = "Vẻ đẹp tinh tế từ thiết kế nhôm nguyên khối siêu nhẹ. Bộ vi xử lý Intel Core Ultra tích hợp AI NPU thông minh, màn hình cảm ứng viền siêu mỏng InfinityEdge.",
                    CategoryProductId = productCategories[1].Id
                },

                // Category 3: Đồng hồ thông minh
                new Product
                {
                    Name = "Apple Watch Ultra 2 GPS + Cellular Titan",
                    Price = 19990000,
                    StockQuantity = 30,
                    ImageUrl = "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=600&q=80",
                    Description = "Đồng hồ thám hiểm bền bỉ đỉnh cao với vỏ titan 49mm chống va đập cực tốt, màn hình sáng nhất lịch sử Apple Watch và pin dùng đến 3 ngày ở chế độ tiết kiệm.",
                    CategoryProductId = productCategories[2].Id
                },
                new Product
                {
                    Name = "Garmin Fenix 7 Pro Solar Edition",
                    Price = 17490000,
                    StockQuantity = 15,
                    ImageUrl = "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
                    Description = "Đồng hồ GPS thể thao cao cấp hỗ trợ sạc pin bằng năng lượng mặt trời. Tích hợp bản đồ trực quan, đèn pin LED siêu sáng, đo chỉ số tim mạch và VO2 Max chính xác.",
                    CategoryProductId = productCategories[2].Id
                },

                // Category 4: Phụ kiện
                new Product
                {
                    Name = "Bàn phím cơ Keychron Q1 Pro Knob Alu",
                    Price = 4290000,
                    StockQuantity = 100,
                    ImageUrl = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
                    Description = "Bàn phím cơ Layout 75% núm xoay đa năng, chế tác từ nhôm CNC nguyên khối đầm chắc, hỗ trợ kết nối không dây Bluetooth 5.1 và hotswap switch dễ dàng.",
                    CategoryProductId = productCategories[3].Id
                },
                new Product
                {
                    Name = "Chuột không dây Logitech MX Master 3S",
                    Price = 2390000,
                    StockQuantity = 80,
                    ImageUrl = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
                    Description = "Chuột công thái học hàng đầu cho dân văn phòng và lập trình viên. Cảm biến 8000 DPI hoạt động trên mọi bề mặt, nút cuộn điện từ MagSpeed siêu nhanh không tiếng ồn.",
                    CategoryProductId = productCategories[3].Id
                },
                new Product
                {
                    Name = "Tai nghe chụp tai Sony WH-1000XM5",
                    Price = 6990000,
                    StockQuantity = 45,
                    ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
                    Description = "Công nghệ chống ồn chủ động (ANC) xuất sắc nhất thế giới nhờ bộ xử lý kép tích hợp. Chất lượng đàm thoại vượt trội, thời lượng pin bền bỉ đến 30 giờ nghe nhạc.",
                    CategoryProductId = productCategories[3].Id
                }
            };
            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
