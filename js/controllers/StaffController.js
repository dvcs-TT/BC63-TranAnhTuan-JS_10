function NhanSuQL() {
  this.nhansuDS = [];

  this.themNS = function (nhanSu) {
    this.nhansuDS.push(nhanSu);
  };

  this.timViTriNS = function (taiKhoan) {
    var index = -1;

    for (var i = 0; i < this.nhansuDS.length; i++) {
      var nhanSu = this.nhansuDS[i];
      if (taiKhoan === nhanSu.taiKhoan) {
        index = i;
        break;
      }
    }
    return index;
  };

  this.xoaNS = function (taiKhoan) {
    var index = this.timViTriNS(taiKhoan);

    if (index !== -1) {
      this.nhansuDS.splice(index, 1);
    }
  };

  this.capNhatNS = function (nhanSu) {
    // Tìm index nhân sự
    var index = this.timViTriSV(nhanSu.maSV);

    // Tiến hành cập nhật nhân sự
    if (index !== -1) {
      this.nhansuDS[index] = nhanSu;
    }
  };
}
