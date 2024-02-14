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

  this.capNhatNS = function () {};
}
