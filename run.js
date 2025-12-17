const fs = require('fs');
const xml2js = require('xml2js');
const { spawn } = require('child_process');

// === CÀI ĐẶT THỜI GIAN HOÀN THÀNH TẠI ĐÂY ===
const TOTAL_MINUTES = 1;
const TOTAL_DURATION_SECONDS = 60 * TOTAL_MINUTES;

// Thay bằng tên file GPX thực tế của bạn
const gpxFilePath = 'run.gpx'; // Đặt file GPX vào cùng folder và sửa tên ở đây

const parser = new xml2js.Parser();

fs.readFile(gpxFilePath, (err, data) => {
  if (err) {
    console.error('Lỗi đọc file GPX:', err);
    return;
  }

  parser.parseString(data, (err, result) => {
    if (err) {
      console.error('Lỗi parse GPX:', err);
      return;
    }

    // Lấy danh sách track points từ <trkpt>
    const trackpoints = result.gpx.trk[0].trkseg[0].trkpt;

    if (!trackpoints || trackpoints.length === 0) {
      console.error('Không tìm thấy điểm nào trong file GPX');
      return;
    }

    console.log(`Tìm thấy ${trackpoints.length} điểm. Sẽ hoàn thành trong ${TOTAL_DURATION_SECONDS / 60} phút.`);

    // Tính delay giữa mỗi điểm (giây)
    const numSegments = trackpoints.length - 1; // Số đoạn = số điểm - 1
    const delayMs = (TOTAL_DURATION_SECONDS * 1000) / numSegments;

    console.log(`Delay giữa mỗi điểm: ${delayMs.toFixed(2)} ms (${(delayMs / 1000).toFixed(2)} giây)`);

    // Khởi động Genymotion Shell
    const gsmProcess = spawn('/home/son7122/Genymotion/genymotion/genyshell', [], { stdio: ['pipe', 'pipe', 'pipe'], shell: true });

    gsmProcess.stdout.on('data', (data) => console.log(`GSM: ${data}`));
    gsmProcess.stderr.on('data', (data) => console.error(`GSM error: ${data}`));

    // Bật GPS emulation
    gsmProcess.stdin.write('gps setstatus enabled\n');
    gsmProcess.stdin.write('gps setstatus enabled\r\n');

    let index = 0;

    const sendNextPoint = () => {
      if (index >= trackpoints.length) {
        // Hoàn thành
        gsmProcess.stdin.write('gps setstatus disabled\n');
        gsmProcess.stdin.end();
        gsmProcess.kill(1);
        console.log('Hoàn thành lộ trình!');
        return;
      }

      const point = trackpoints[index];
      const lat = parseFloat(point.$.lat);
      const lon = parseFloat(point.$.lon);

      // Gửi vị trí mới
      gsmProcess.stdin.write(`gps setlatitude ${lat}\n`);
      gsmProcess.stdin.write(`gps setlongitude ${lon}\n`);

      console.log(`Điểm ${index + 1}/${trackpoints.length}: (${lat}, ${lon})`);

      index++;

      if (index < trackpoints.length) {
        // Lên lịch gửi điểm tiếp theo
        setTimeout(sendNextPoint, delayMs);
      } else {
        // Điểm cuối cùng → kết thúc sau delay cuối
        setTimeout(sendNextPoint, delayMs);
      }
    };

    // Bắt đầu gửi điểm đầu tiên ngay lập tức
    sendNextPoint();
  });
});