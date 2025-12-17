## Fake Run – Hướng dẫn nhanh

### 1. Cài đặt

```bash
npm install
```

Yêu cầu:
- Đã cài **Node.js**.
- Đã cài **Genymotion** và chạy được `genyshell` (hoặc `genyshell.exe` trên Windows) từ terminal / CMD.

### 2. Cách chạy

- **Chạy mặc định (random 30 ± 5 phút)**:

```bash
npm run start
# hoặc
node run.js
```

- **Chạy với thời gian tự chọn (vẫn buffer ±5 phút)**  
  Ví dụ muốn chạy khoảng 45 phút (thực tế sẽ random trong khoảng 40–50 phút):

```bash
node run.js 45
```

Tham số:
- **Tham số thứ nhất**: số phút mong muốn (kiểu số, > 0).
- Script sẽ random thời gian theo **giây** trong khoảng:  
  \((phút - 5) \times 60\) → \((phút + 5) \times 60\), sau đó chia đều cho các điểm trong file `run.gpx`.

### 3. Lưu ý

- Đặt file `run.gpx` cùng thư mục với `run.js`, đúng tên `run.gpx` (hoặc chỉnh lại trong file `run.js`).
- **Windows**:
  - Đảm bảo `genyshell.exe` có trong `PATH`, hoặc sửa lại lệnh `spawn` trong `run.js` để trỏ đúng đường dẫn Genymotion trên máy bạn.
  - Nên chạy CMD/PowerShell với quyền đủ để Genymotion điều khiển GPS.


