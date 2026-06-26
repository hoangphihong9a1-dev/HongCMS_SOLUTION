# 🚀 HongCMS - Hệ Thống Quản Lý Nội Dung & Bán Hàng Công Nghệ Premium

Hệ thống **HongCMS** là một giải pháp e-commerce và quản trị nội dung hoàn chỉnh được xây dựng trên mô hình phân lớp hiện đại với hiệu năng cao, bảo mật chặt chẽ và giao diện trực quan, thu hút.

---

## 🏗️ Kiến Trúc Hệ Thống (Three-Tier Architecture)

Dự án được phát triển theo cấu trúc 3 phân tầng chuẩn hóa:
1. **`CMS.Data`**: Lớp quản lý dữ liệu. Chứa các thực thể dữ liệu (Entities), cấu hình mối quan hệ cơ sở dữ liệu qua Entity Framework Core (Fluent API) và các bản thiết kế Migration.
2. **`CMS.Backend`**: Lớp xử lý nghiệp vụ & Quản trị. Phát triển bằng **ASP.NET Core MVC (Web App)** kết hợp **Web API**.
   - Cung cấp trang Admin Dashboard chuyên nghiệp dành cho Admin/Editor thực hiện nghiệp vụ CRUD sản phẩm, bài viết, khách hàng, đơn hàng.
   - Cung cấp hệ thống Web API phục vụ dữ liệu bảo mật cho các ứng dụng client.
3. **`CMS.Frontend`**: Lớp giao diện khách hàng. Phát triển bằng **ReactJS + Vite**, mang lại trải nghiệm SPA siêu mượt mà, phản hồi tức thì và tương thích mọi thiết bị (Responsive).

---

## 🌟 Các Tính Năng Nổi Bật Đã Tích Hợp

### 1. Phân Quyền Bảo Mật (Role-Based Access Control - RBAC)
* Phân chia rõ ràng 2 nhóm quyền quản trị trong hệ thống Admin:
  * **Admin**: Có toàn quyền kiểm soát toàn bộ hệ thống, bao gồm xem thống kê tổng quan và truy cập module quản lý thành viên (Users/Staffs).
  * **Editor**: Chỉ được quyền chỉnh sửa nội dung bài viết, quản lý sản phẩm, đơn hàng và không được phép xem các thông tin thống kê người dùng nhạy cảm.

### 2. Gửi Email Xác Nhận Đơn Hàng Tự Động (Real-time Email SMTP)
* Hệ thống được cấu hình tự động kích hoạt tiến trình chạy ngầm gửi Email xác nhận bằng tài khoản Gmail bảo mật (sử dụng **App Password**).
* Khi khách hàng đặt hàng thành công trên Frontend, một email được thiết kế HTML đẹp mắt sẽ gửi thẳng tới hòm thư của khách hàng để hiển thị đầy đủ: danh sách sản phẩm mua, đơn giá, tổng tiền, thông tin giao hàng và ghi chú.

### 3. Tài Liệu Hóa API Tương Tác Với Swagger (OpenAPI)
* Tích hợp **Swashbuckle.AspNetCore (OpenAPI v3)** hiển thị trực quan toàn bộ tài liệu API tại `/swagger`.
* Hỗ trợ cấu hình **XML Comments** giúp tự động map trực tiếp các mô tả, ghi chú từ mã nguồn C# lên giao diện Swagger UI.

### 4. Hệ Thống Tìm Kiếm, Lọc & Phân Trang Toàn Diện
* Bổ sung đầy đủ các tham số lọc nâng cao cho phương thức `GET` của tất cả các bảng dữ liệu trên Swagger:
  * **`ProductsApi`**: Lọc theo danh mục (`categoryProductId`), khoảng giá (`minPrice` - `maxPrice`), từ khóa tìm kiếm (`keyword`), phân trang (`page`, `pageSize`).
  * **`OrdersApi`**: Lọc theo khách hàng (`customerId`), trạng thái (`status`), phân trang.
  * **`CustomersApi`, `CategoriesApi`, `PostsApi`, `UsersApi`**: Hỗ trợ tìm kiếm từ khóa đa thuộc tính và phân trang động.

---

## 🛠️ Hướng Dẫn Khởi Chạy Hệ Thống

### 1. Yêu Cầu Cài Đặt
* **.NET SDK**: Phiên bản 8.0 trở lên.
* **Node.js**: Phiên bản 18 trở lên.
* **SQL Server**: Phiên bản LocalDB hoặc SQL Express.

### 2. Thiết Lập Cơ Sở Dữ Liệu & Chạy Backend
1. Cấu hình chuỗi kết nối SQL Server và tài khoản SMTP gửi mail tại `CMS.Backend/appsettings.json`.
2. Mở Terminal tại thư mục gốc và chạy lệnh cập nhật database:
   ```powershell
   dotnet ef database update --project CMS.Data --startup-project CMS.Backend
   ```
3. Khởi chạy Backend bằng launch profile HTTPS:
   ```powershell
   cd CMS.Backend
   dotnet run --launch-profile https
   ```
   * Cổng HTTPS mặc định: `https://localhost:7296`
   * Cổng HTTP mặc định: `http://localhost:5188`

### 3. Khởi Chạy Frontend (ReactJS)
1. Mở Terminal mới tại thư mục gốc và di chuyển vào `CMS.Frontend`:
   ```powershell
   cd CMS.Frontend
   ```
2. Cài đặt các gói thư viện phụ thuộc (nếu là lần đầu):
   ```powershell
   npm install
   ```
3. Chạy môi trường phát triển:
   ```powershell
   npm run dev
   ```
   * Địa chỉ truy cập cửa hàng: `http://localhost:5173`

---

## 🧪 Hướng Dẫn Sử Dụng Swagger UI Để Test API

1. Truy cập địa chỉ tài liệu API: **[https://localhost:7296/swagger](https://localhost:7296/swagger)**.
2. Chọn một Endpoint cần test (ví dụ: `GET /api/ProductsApi`).
3. Click vào nút **`Try it out`** ở góc phải tiêu đề API.
4. Điền các tham số bạn muốn test:
   - Nhập từ khóa cần tìm kiếm vào ô `keyword`.
   - Nhập khoảng giá cần lọc vào `minPrice` hoặc `maxPrice`.
   - Để trống các tham số nếu muốn lấy toàn bộ dữ liệu.
5. Nhấn nút **`Execute`** (Màu xanh dương) ở phía dưới.
6. Xem kết quả dữ liệu trả về dạng JSON và mã phản hồi HTTP Code (Ví dụ: `200 OK`) ở mục **`Responses`**.

---

## 💾 Hướng Dẫn Đẩy Code Lên GitHub

Sau khi hoàn thành cập nhật dự án, bạn có thể chạy các lệnh sau trong Git để lưu trữ và đẩy code lên kho lưu trữ GitHub cá nhân:

```powershell
# 1. Kiểm tra trạng thái các file thay đổi
git status

# 2. Thêm tất cả các file thay đổi vào khu vực chuẩn bị (Staging)
git add .

# 3. Commit code kèm thông điệp tóm tắt
git commit -m "Tích hợp gửi mail đặt hàng thực tế, phân trang tìm kiếm Swagger toàn diện và tài liệu hóa dự án"

# 4. Đẩy code lên nhánh chính trên GitHub
git push origin master
# (hoặc 'git push origin main' tùy thuộc vào tên nhánh chính của bạn)
```

---
*Chúc bạn có trải nghiệm tuyệt vời cùng HongCMS!*
