# 🚀 HongCMS - Hệ Thống Quản Lý Nội Dung & Bán Hàng Công Nghệ Premium

**HongCMS** là một giải pháp e-commerce và quản trị nội dung hoàn chỉnh, xây dựng trên mô hình phân lớp chuẩn doanh nghiệp với ASP.NET Core (.NET 8) làm Backend, SQL Server làm Cơ sở dữ liệu và ReactJS + Vite làm Frontend.

---

## 📂 Sơ Đồ Cấu Trúc Thư Mục Dự Án (Directory Layout)

```text
HongCMS_SOLUTION/
├── HongCMS_SOLUTION.sln         # File Solution chính của dự án
├── README.md                     # Tài liệu hướng dẫn dự án (File này)
│
├── CMS.Data/                     # Lớp Quản lý dữ liệu (Class Library)
│   ├── Entities/                 # Định nghĩa các thực thể (Entities)
│   │   ├── Category.cs           # Danh mục bài viết
│   │   ├── CategoryProduct.cs    # Danh mục sản phẩm
│   │   ├── Customer.cs           # Khách hàng
│   │   ├── Order.cs              # Đơn hàng
│   │   ├── OrderDetail.cs        # Chi tiết đơn hàng
│   │   ├── Post.cs               # Bài viết
│   │   ├── Product.cs            # Sản phẩm
│   │   └── User.cs               # Tài khoản quản trị
│   ├── ApplicationDbContext.cs   # DbContext cấu hình EF Core & Fluent API
│   └── Migrations/               # Thư mục chứa lịch sử migrations database
│
├── CMS.Backend/                  # Lớp Xử lý nghiệp vụ & Admin Dashboard (ASP.NET Core Web MVC)
│   ├── Controllers/              # MVC Controllers (Quản lý Admin)
│   │   ├── Api/                  # Web API Controllers (Cung cấp dữ liệu cho Frontend)
│   │   │   ├── ProductsApiController.cs
│   │   │   ├── OrdersApiController.cs
│   │   │   ├── CustomersApiController.cs
│   │   │   ├── CategoriesApiController.cs
│   │   │   └── ...
│   ├── Views/                    # Giao diện quản trị Admin (Razor HTML)
│   ├── Program.cs                # Điểm khởi chạy cấu hình Service & Middleware
│   └── appsettings.json          # File cấu hình database, email SMTP, logging
│
└── CMS.Frontend/                 # Giao diện khách hàng (ReactJS + Vite)
    ├── src/
    │   ├── api/                  # Cấu hình Axios client kết nối API
    │   ├── components/           # Các component dùng chung (Header, Footer, ProductCard...)
    │   ├── context/              # Quản lý State toàn cục (AuthContext, CartContext...)
    │   ├── pages/                # Các trang chính (Home, Shop, Cart, Profile, Auth...)
    │   ├── services/             # Lớp gọi API (productService, orderService, authService...)
    │   ├── App.jsx               # Cấu hình định tuyến (React Router)
    │   └── main.jsx              # Điểm khởi chạy của ứng dụng React
    ├── package.json              # Quản lý dependencies (npm)
    └── vite.config.js            # Cấu hình đóng gói Vite
```

---

## 🛠️ Công Nghệ Sử Dụng (Technology Stack)

### Backend
* **Runtime**: .NET 8.0 SDK
* **Framework**: ASP.NET Core MVC (Web App) & Web API
* **ORM**: Entity Framework Core 8.0
* **Database**: Microsoft SQL Server
* **API Documentation**: Swagger/OpenAPI v3 (Swashbuckle.AspNetCore 10.2.3)
* **Email Service**: System.Net.Mail (Gmail SMTP với mật khẩu ứng dụng App Password)

### Frontend
* **Core**: ReactJS 18+
* **Build tool**: Vite
* **Routing**: React Router DOM v6
* **HTTP Client**: Axios
* **Styling**: Vanilla CSS (tối ưu hóa tùy chỉnh layout mượt mà)

---

## 🗄️ Thiết Kế Cơ Sở Dữ Liệu (Database Schema)

Dự án bao gồm 8 bảng dữ liệu quan hệ chặt chẽ với nhau:

| Tên Bảng | Mô Tả | Thuộc Tính Chính |
| :--- | :--- | :--- |
| **`Users`** | Tài khoản Quản trị viên/Biên tập viên | `Id`, `Username`, `PasswordHash`, `FullName`, `Role` (Admin/Editor) |
| **`Customers`** | Tài khoản Khách hàng mua sắm | `Id`, `FullName`, `Email`, `Phone`, `Address`, `Password` |
| **`Products`** | Thông tin sản phẩm | `Id`, `Name`, `Description`, `Price`, `StockQuantity`, `ImageUrl`, `CategoryProductId` |
| **`CategoriesProducts`**| Danh mục phân loại sản phẩm | `Id`, `Name`, `Description`, `ImageUrl` |
| **`Orders`** | Hóa đơn đặt hàng | `Id`, `CustomerId`, `OrderDate`, `Status` (0: Chờ duyệt, 1: Đã giao...), `Notes` |
| **`OrderDetails`** | Chi tiết các sản phẩm trong hóa đơn | `Id`, `OrderId`, `ProductId`, `Quantity`, `UnitPrice` |
| **`Posts`** | Bài viết tin tức công nghệ | `Id`, `Title`, `Content`, `ImageUrl`, `CreatedDate`, `CategoryId` |
| **`Categories`** | Danh mục bài viết | `Id`, `Name`, `Description` |

---

## 🔌 Danh Sách Web API Endpoints

### 📦 1. Sản Phẩm (`ProductsApi`)
* `GET /api/ProductsApi` - Lấy danh sách sản phẩm (Hỗ trợ lọc theo `categoryProductId`, `minPrice`, `maxPrice`, `keyword` và phân trang `page`, `pageSize`).
* `GET /api/ProductsApi/{id}` - Lấy chi tiết một sản phẩm theo ID.
* `POST /api/ProductsApi` - Thêm mới sản phẩm.
* `PUT /api/ProductsApi/{id}` - Cập nhật thông tin sản phẩm.
* `DELETE /api/ProductsApi/{id}` - Xóa sản phẩm (Ngăn chặn xóa nếu đã có trong đơn hàng).

### 🛒 2. Đơn Hàng (`OrdersApi`)
* `GET /api/OrdersApi` - Lấy danh sách đơn hàng (Hỗ trợ lọc theo `customerId`, `status` và phân trang).
* `GET /api/OrdersApi/customer/{customerId}` - Lấy lịch sử đơn hàng của một khách hàng cụ thể.
* `GET /api/OrdersApi/{id}` - Xem chi tiết một đơn hàng.
* `POST /api/OrdersApi` - Tạo đơn hàng mới (Tự động kích hoạt luồng gửi Email xác nhận).
* `PUT /api/OrdersApi/{id}` - Cập nhật trạng thái đơn hàng.

### 👤 3. Khách Hàng (`CustomersApi`)
* `GET /api/CustomersApi` - Lấy danh sách khách hàng (Hỗ trợ tìm kiếm từ khóa `keyword` và phân trang).
* `POST /api/CustomersApi` - Đăng ký tài khoản khách hàng mới.
* `POST /api/CustomersApi/login` - Đăng nhập tài khoản khách hàng.
* `PUT /api/CustomersApi/{id}` - Cập nhật thông tin khách hàng (Họ tên, Email, SĐT, Địa chỉ).

### 📝 4. Bài Viết & Danh Mục (`PostsApi` & `CategoriesApi`)
* `GET /api/PostsApi` - Lấy danh sách bài viết (Hỗ trợ lọc theo `categoryId`, tìm kiếm `keyword` và phân trang).
* `GET /api/CategoriesApi` - Lấy danh mục tin tức (Hỗ trợ tìm kiếm và phân trang).

---

## ⚙️ Cấu Hình File `appsettings.json` (Backend)

Đảm bảo cấu hình đúng kết nối Database và thông tin SMTP để gửi mail:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HongCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "hoangphihong9a1@gmail.com",
    "SenderPassword": "uixp daqz clyt iyom"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```
> [!IMPORTANT]
> Phần `SenderPassword` là mật khẩu ứng dụng (App Password) được tạo từ tài khoản Google của bạn, không phải mật khẩu đăng nhập Gmail thông thường để bảo đảm an toàn bảo mật.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Hệ Thống

### 1. Chuẩn Bị Database
Mở Terminal tại thư mục gốc của solution và chạy lệnh cập nhật database từ EF Core:
```powershell
dotnet ef database update --project CMS.Data --startup-project CMS.Backend
```

### 2. Khởi Chạy Backend
```powershell
cd CMS.Backend
dotnet run --launch-profile https
```
* **Cổng HTTPS**: `https://localhost:7296`
* **Cổng HTTP**: `http://localhost:5188`
* **Trang tài liệu API Swagger**: `https://localhost:7296/swagger`

### 3. Khởi Chạy Frontend
```powershell
cd ../CMS.Frontend
npm install
npm run dev
```
* **Cổng truy cập cửa hàng**: `http://localhost:5173`

---

## 🧪 Hướng Dẫn Test API trên Swagger UI

1. Truy cập **`https://localhost:7296/swagger`**.
2. Click mở rộng endpoint **`GET /api/ProductsApi`**.
3. Bấm vào nút **`Try it out`** ở góc phải.
4. Nhập các tham số mẫu:
   - Ô `keyword`: Nhập `Laptop`
   - Ô `minPrice`: Nhập `15000000`
   - Ô `maxPrice`: Nhập `30000000`
5. Bấm nút **`Execute`** (Màu xanh dương).
6. Kéo xuống mục **`Responses`** để xem chuỗi dữ liệu JSON trả về với mã code thành công `200`.

---

## ⚠️ Khắc Phục Lỗi Thường Gặp (Troubleshooting)

### 1. Lỗi Cổng Mạng Bị Chiếm (Port Already In Use)
* **Triệu chứng**: Giao diện Swagger không cập nhật tham số mới mặc dù đã build backend thành công. Do có tiến trình cũ chạy ngầm.
* **Cách sửa**: Chạy lệnh Windows PowerShell sau để tắt sạch tiến trình cũ trước khi chạy lại `dotnet run`:
  ```powershell
  taskkill /f /im dotnet.exe
  taskkill /f /im CMS.Backend.exe
  ```

### 2. Lỗi Trình Duyệt Lưu Cache Swagger cũ
* **Cách sửa**: Nhấn tổ hợp phím **`Ctrl` + `F5`** (Windows) hoặc **`Cmd` + `Shift` + `R`** (Mac) tại trang Swagger để buộc trình duyệt tải lại tệp tin JSON cấu hình API mới nhất.

---

## 💾 Hướng Dẫn Git để Lưu Trữ

Chạy chuỗi lệnh này trong thư mục gốc để đẩy các chỉnh sửa lên GitHub:
```powershell
git status
git add .
git commit -m "Cập nhật tài liệu README chi tiết và đầy đủ nhất"
git push origin master  # Hoặc git push origin main tùy tên nhánh chính
```
