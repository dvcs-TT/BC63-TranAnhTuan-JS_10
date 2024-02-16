// DOM tới 1 thẻ
function getElement(id) {
  return document.getElementById(id);
}

// Khởi tạo đối tượng nhansuQL từ lớp NhanSuQL
var nhansuQL = new NhanSuQL();

// Khởi tạo đối tượng validation từ lớp Validation
var validation = new Validation();

// Lưu xuống local storage
function setLocalStorage() {
  // Lưu danh sách nhân sự vào local storage
  //B1: chuyển data về string
  var dtString = JSON.stringify(nhansuQL.nhansuDS);
  //B2: Lưu vào local storage
  localStorage.setItem("nhansuDS", dtString);
}

function getLocalStorage() {
  //B1: lấy data dưới local storage
  var data = localStorage.getItem("nhansuDS");

  //B2: Parse data về kiểu dữ liệu ban đầu
  if (data !== null) {
    var dataParse = JSON.parse(data);

    // Hiển thị danh sách nhân sự đã lưu ra UI
    nhansuQL.nhansuDS = dataParse;

    renderNhanSuDS();
  }
}

getLocalStorage();

// reset form
function resetForm() {
  getElement("formNS").reset();
}

// Lấy thông tin từ UI
function layThongTinNS(isAdd) {
  // isAdd = true => thêm nhân sự
  // isAdd = false => cập nhập nhân sự

  // Hiện các span thông báo
  thongbaoHtmlClt = document.getElementsByClassName("sp-thongbao");
  for (let i = 0; i < thongbaoHtmlClt.length; i++) {
    const thongbaoSpan = thongbaoHtmlClt[i];
    thongbaoSpan.style.display = "block";
  }

  var taiKhoan = getElement("tknv").value;
  var hoTen = getElement("name").value;
  var eMail = getElement("email").value;
  var matKhau = getElement("password").value;
  var ngayLam = getElement("datepicker").value;
  var luongCB = getElement("luongCB").value * 1;
  var chucVu = getElement("chucvu").value;
  var gioLam = getElement("gioLam").value * 1;
  var isValid = true;

  // Kiểm tra tài khoản nhân sự
  if (isAdd) {
    isValid &=
      validation.kiemRong(
        taiKhoan,
        "tbTKNV",
        "Tài khoản không được bỏ trống"
      ) &&
      validation.kiemPattern(
        taiKhoan,
        "tbTKNV",
        "Tài khoản phải là số",
        /^[0-9]+$/
      ) &&
      validation.kiemDoDai(
        taiKhoan,
        "tbTKNV",
        "Tài khoản từ 4 đến 6 ký tự",
        4,
        6
      ) &&
      validation.kiemTrungTk(
        taiKhoan,
        nhansuQL.nhansuDS,
        "tbTKNV",
        "Tài khoản đã tồn tại"
      );
  }

  // Kiểm tra họ tên nhân sự
  isValid &=
    validation.kiemRong(hoTen, "tbTen", "Họ tên không được bỏ trống") &&
    validation.kiemPattern(
      hoTen,
      "tbTen",
      "Họ tên phải là chữ",
      /^[a-zA-Z ]*$/
    );

  //Kiểm tra email
  isValid &=
    validation.kiemRong(eMail, "tbEmail", "Email không được bỏ trống") &&
    validation.kiemPattern(
      eMail,
      "tbEmail",
      "Email không đúng định dạng",
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    );

  // Kiểm tra mật khẩu
  isValid &=
    validation.kiemRong(matKhau, "tbMatKhau", "Mật khẩu không được bỏ trống") &&
    validation.kiemPattern(
      matKhau,
      "tbMatKhau",
      "Mật khẩu phải có từ 6-10 ký tự (chứa ít nhất 1 chữ số, 1 chữ cái in hoa, 1 ký tự đặc biệt)",
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*\W)(?!.*\s).{6,10}$/
    );

  // Kiểm tra ngày làm
  isValid &=
    validation.kiemRong(ngayLam, "tbNgay", "Ngày làm không được bỏ trống") &&
    validation.kiemPattern(
      ngayLam,
      "tbNgay",
      "Ngày làm không đúng định dạng",
      /^\d{2}\/\d{2}\/\d{4}$/
    );

  // Kiểm tra lương cơ bản
  isValid &=
    validation.kiemRong(
      luongCB,
      "tbLuongCB",
      "Lương cơ bản không được bỏ trống"
    ) &&
    validation.kiemSo(luongCB, "tbLuongCB", "Lương cơ bản phải là số") &&
    validation.kiemKhoangGtri(
      luongCB,
      "tbLuongCB",
      "Lương cơ bản từ 1000000 đến 20000000 ký tự",
      1000000,
      20000000
    );

  // Kiểm tra chức vụ
  isValid &= validation.kiemChucVu(
    "chucvu",
    "tbChucVu",
    "Vui lòng chọn chức vụ"
  );

  // Kiểm tra giờ làm
  isValid &=
    validation.kiemRong(gioLam, "tbGiolam", "Số giờ làm không được bỏ trống") &&
    validation.kiemSo(gioLam, "tbGiolam", "Giờ làm phải là số") &&
    validation.kiemKhoangGtri(
      gioLam,
      "tbGiolam",
      "Số giờ làm phải từ 80 đến 200 giờ",
      80,
      200
    );

  // Tạo một đối tượng nhân sự từ lớp đối tượng Nhân Sự
  if (!isValid) {
    return null;
  }

  var nhanSu = new NhanSu(
    taiKhoan,
    hoTen,
    eMail,
    matKhau,
    ngayLam,
    luongCB,
    chucVu,
    gioLam
  );

  // Tính lương tháng
  nhanSu.tinhLuongThang();
  // Xếp loại nhân sự
  nhanSu.xepLoai();

  return nhanSu;
}

// Render danh sách sinh viên
function renderNhanSuDS(arrNS = nhansuQL.nhansuDS) {
  var content = "";
  for (var i = 0; i < arrNS.length; i++) {
    var nhanSu = arrNS[i];
    content += `
            <tr>
                <td>${nhanSu.taiKhoan}</td>
                <td>${nhanSu.hoTen}</td>
                <td>${nhanSu.eMail}</td>
                <td>${nhanSu.ngayLam}</td>
                <td>${nhanSu.chucVu}</td>
                <td>${nhanSu.luongThang}</td>
                <td>${nhanSu.loaiNV}</td>
                <td>
                    <button 
                        class="btn btn-danger" 
                        onclick="deleteStaff('${nhanSu.taiKhoan}')"
                    >
                        Delete
                    </button>
                    <button 
                        class="btn btn-success ml-3" data-toggle="modal" data-target="#myModal"
                        onclick="editStaff('${nhanSu.taiKhoan}')"
                    >
                        Edit
                    </button>
                </td>
            </tr>
        `;
  }
  getElement("tableDanhSach").innerHTML = content;
}

// btn Thêm
getElement("btnThem").onclick = function () {
  // Kích hoạt ô nhập tài khoản
  getElement("tknv").disabled = false;

  // Hiện button thêm nhân sự
  getElement("btnThemNV").style.display = "inline-block";

  // Ẩn button cập nhật
  getElement("btnCapNhat").style.display = "none";
};

// btn Thêm nhân sự
getElement("btnThemNV").onclick = function () {
  // B1: lấy thông tin nhân sự từ hàm layThongTinNS
  var nhanSu = layThongTinNS(true);

  if (nhanSu) {
    //B2: Thêm nhanSu vào trong nhansuDS
    nhansuQL.themNS(nhanSu);

    // Hiển thị danh sách nhân sự ra ngoài UI
    renderNhanSuDS();

    // Lưu danh sách nhân sự vào local storage
    setLocalStorage();

    // reset form
    resetForm();
  }
};

// Xóa nhân sự
function deleteStaff(taiKhoan) {
  nhansuQL.xoaNS(taiKhoan);

  // Cập nhật lại hiển thị sau khi xóa nhân sự thành công
  renderNhanSuDS();

  //  Lưu lại danh sách nhân sự vào local storage
  setLocalStorage();
}

// Cập nhật sinh viên
function editStaff(taiKhoan) {
  // Ẩn button thêm nhân sự
  getElement("btnThemNV").style.display = "none";

  // Hiện button cập nhật
  getElement("btnCapNhat").style.display = "inline-block";

  // Vô hiệu hóa ô nhập tài khoản
  getElement("tknv").disabled = true;

  //Tìm index của nhân sự
  var index = nhansuQL.timViTriNS(taiKhoan);

  // Lấy thông tin nhân sự
  var nhanSu = nhansuQL.nhansuDS[index];

  //Hiển thị thông tin SV lên form
  getElement("tknv").value = nhanSu.taiKhoan;
  getElement("name").value = nhanSu.hoTen;
  getElement("email").value = nhanSu.eMail;
  getElement("password").value = nhanSu.matKhau;
  getElement("datepicker").value = nhanSu.ngayLam;
  getElement("luongCB").value = nhanSu.luongCB;
  getElement("chucvu").value = nhanSu.chucVu;
  getElement("gioLam").value = nhanSu.gioLam;
}

getElement("btnCapNhat").onclick = function () {
  //Lấy lại thông tin mới của SV sau chỉnh sửa
  var newStaff = layThongTinNS(false);

  if (newStaff) {
    nhansuQL.capNhatNS(newStaff);

    // cập nhật lại hiển thị ui
    renderNhanSuDS();

    // lưu lại danh sách nhân sự mới vào local storage
    setLocalStorage();

    // Hiển thị lại btn thêm sinh viên
    getElement("btnThemSV").style.display = "inline-block";

    // Ẩn btn cập nhật
    getElement("btnCapNhat").style.display = "none";

    // Kích hoạt ô nhập tài khoản
    getElement("tknv").disabled = false;

    // reset form
    resetForm();
  }
};

// Tìm kiếm nhân sự theo loại
getElement("btnTimNV").onclick = function () {
  var searchedValue = getElement("searchName").value;

  // chuyển searchedValue về lowercase
  var searchedValueLowerCase = searchedValue.toLowerCase();

  var searchedNhanSuDS = [];

  for (var i = 0; i < nhansuQL.nhansuDS.length; i++) {
    var nhanSu = nhansuQL.nhansuDS[i];

    // chuyển tên nhân sự về dạng lowercase
    var loaiNVLowerCase = nhanSu.loaiNV.toLowerCase();

    // Nếu tên sv chứa toàn bộ ký tự của value search
    if (loaiNVLowerCase.indexOf(searchedValueLowerCase) !== -1) {
      searchedNhanSuDS.push(nhanSu);
    }
  }

  // render UI lại danh sách nhân sự theo kết quả tìm kiếm
  renderNhanSuDS(searchedNhanSuDS);
};
