Quy cách đặt tên API theo RESTful
❌ Không dùng động từ trong URL
❌ Chốt không dùng số nhiều (ví dụ get all classes thì cũng viết thành GET /api/class)
✅ Động từ thể hiện qua HTTP Method (GET, POST, PUT, DELETE, PATCH)

Ví dụ:
| Chức năng             | Endpoint (`URL`) | HTTP Method | Mô tả chức năng                 |
| --------------------- | ---------------- | ----------- | ------------------------------- |
| Lấy danh sách lớp     | `/classes`       | GET         | Lấy tất cả các lớp              |
| Lấy lớp theo ID       | `/classes/:id`   | GET         | Lấy thông tin lớp theo ID       |
| Tạo mới lớp           | `/classes`       | POST        | Tạo một lớp mới                 |
| Cập nhật toàn bộ lớp  | `/classes/:id`   | PUT         | Ghi đè toàn bộ dữ liệu lớp      |
| Cập nhật một phần lớp | `/classes/:id`   | PATCH       | Cập nhật một phần thông tin lớp |
| Xóa lớp theo ID       | `/classes/:id`   | DELETE      | Xóa lớp theo ID                 |

Cách trả về:
✅ format:
{
      error: true/false,
      message: "Tạo thành công/ Không tìm thấy ID ứng với phụ huynh này/ Thiếu các trường thông tin cần thiết"
      data (nếu có): {
            id,
            ....
      }
}
✅ chốt đặt tiếng Việt hết