Các bước viết một danh mục
- 1.Tạo model 
    - Tạo file model trong thư mục app\models\filename.js (tên tương ứng với table là tốt nhất)
    - Copy nội dung file mẫu app\models\senobject.js dán vào và chỉnh sửa lại theo nhu cầu (có thể tự viết mới nếu cần)
- 2.Tạo controller
    - Tạo file controller trong thư mục app\controller\filenamecontroller.js (tên tương ứng với table+controller là tốt nhất)
    - Copy nội dung file mẫu app\controller\senobjectcontroller.js dán vào và chỉnh sửa lại theo nhu cầu (có thể tự viết mới nếu cần)
- 3.Khai báo routes
    - Mở file app\routes\routes.js khai báo controller để nhận dạng đường dẫn trỏ về controller
    - ví dụ khai báo cho đối tượng app\controller\senobjectcontroller.js:
        - const senobjectcontroller = require("../controllers/senobjectcontroller.js");
        - route.use("/senobject", senobjectcontroller);
- 4.Tạo view
    - Tạo file view liệt kê danh sách trong thư mục app\views\page\filename.ejs (tên tương ứng với table là tốt nhất)
        - Copy nội dung file mẫu app\views\page\senobject.ejs dán vào và chỉnh sửa lại theo nhu cầu (có thể tự viết mới nếu cần)
    - Tạo file view form cập nhật trong thư mục app\views\page\filenameupdate.ejs (tên tương ứng với table+update là tốt nhất)
        - Copy nội dung file mẫu app\views\page\senobjectupdate.ejs dán vào và chỉnh sửa lại theo nhu cầu (có thể tự viết mới nếu cần)
    - Tạo file view nhu cầu khác nếu cần trong thư mục app\views\page\filenametêntheonhucầu.ejs (tên tương ứng với table+têntheonhucầu là tốt nhất)

Các bước viết một Master-Detail
- 1.Tạo danh mục Master (Dùng các bước tạo danh mục)
- 2.Tạo danh mục Detail (Dùng các bước tạo danh mục)
- 3.Tạo view 
    - Tạo file view liệt kê danh sách trong thư mục app\views\page\filenamemaster.ejs (tên tương ứng với table+master là tốt nhất)
        - Copy nội dung file mẫu app\views\page\senobjectmaster.ejs dán vào và chỉnh sửa lại theo nhu cầu (có thể tự viết mới nếu cần)
        - View này tương tự view liệt kê danh sách của Master nhưng bổ sung các tính năng cần thiết của Detail như:
            - Thêm cột hiển thị số dòng Detail nếu có. Khi click vào liệt kê Detail
            - Cho phép thêm, xóa, sửa trực tiếp Detail trên lưới
    - Tạo file view form cập nhật trong thư mục app\views\page\filenamemasterupdate.ejs (tên tương ứng với table+master+update là tốt nhất)
        - Copy nội dung file mẫu app\views\page\senobjectmasterupdate.ejs dán vào và chỉnh sửa lại theo nhu cầu (có thể tự viết mới nếu cần)
