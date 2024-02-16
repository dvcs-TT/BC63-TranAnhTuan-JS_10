function NhanSu(
  taiKhoan,
  hoTen,
  eMail,
  matKhau,
  ngayLam,
  luongCB,
  chucVu,
  gioLam
) {
  this.taiKhoan = taiKhoan;
  this.hoTen = hoTen;
  this.eMail = eMail;
  this.matKhau = matKhau;
  this.ngayLam = ngayLam;
  this.luongCB = luongCB;
  this.chucVu = chucVu;
  this.gioLam = gioLam;
  this.luongThang = 0;
  this.loaiNV = "";

  // method
  this.tinhLuongThang = function () {
    var lgThg = 0;
    switch (this.chucVu) {
      case "Giám đốc":
        lgThg = this.luongCB * 3;
        break;
      case "Trưởng phòng":
        lgThg = this.luongCB * 2;
        break;
      default:
        lgThg = this.luongCB * 1;
        break;
    }

    this.luongThang = lgThg;

    return lgThg;
  };

  this.xepLoai = function () {
    var loaiNvien = ""
    if (this.gioLam >= 192) {
        loaiNvien = "xuất sắc"
    } else if (this.gioLam >= 176 && this.gioLam < 192) {
        loaiNvien = "giỏi"
    } else if (this.gioLam >= 160 && this.gioLam < 176) {
        loaiNvien = "khá"
    } else {
        loaiNvien = "trung bình"
    }
    
    this.loaiNV = loaiNvien;
    
    return loaiNvien;
  };
}
