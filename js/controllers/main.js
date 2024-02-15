// DOM tới 1 thẻ
function getElement(id) {
  return document.getElementById(id);
}

// Khởi tạo đối tượng nhansuQL từ lớp NhanSuQL
var nhansuQL = new NhanSuQL();

// Khởi tạo đối tượng validation từ lớp Validation
var validation = new Validation();

// Lấy thông tin từ UI
function layThongTinNS(isAdd) {
  // isAdd = true => thêm nhân sự
  // isAdd = false => cập nhập nhân sự

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
      validation.kiemDoDai(
        taiKhoan,
        "tbTKNV",
        "Tài khoản từ 4 đến 6 ký tự",
        4,
        6
      ) &&
      validation.kiemPattern(
        taiKhoan,
        "tbTKNV",
        "Tài khoản phải là số",
        /^[0-9]+$/
      ) &&
      validation.kiemTrungTk(
        taiKhoan,
        nhansuQL.nhansuDS,
        "tbTKNV",
        "Tài khoản đã tồn tại"
      );
  }

  // Kiểm tra họ tên nhân sự
  isValid &= validation.kiemRong(hoTen, "tbTen", "Họ tên không được bỏ trống");

  //Kiểm tra email
  isValid &=
    validation.kiemRong(eMail, "tbEmail", "Email không được bỏ trống") &&
    validation.kiemPattern(
      eMail,
      "tbEmail",
      "Email không đúng định dạng",
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    );

  // Kiểm tra lương cơ bản
  isValid &= validation.kiemSo(luongCB, "tbLuongCB", "Lương cơ bản phải là số");

  // Kiểm tra giờ làm
  isValid &= validation.kiemSo(gioLam, "tbGiolam", "Giờ làm phải là số");

  // Kiểm tra chức vụ
  isValid &= validation.kiemChucVu(
    "chucvu",
    "tbChucVu",
    "Vui lòng chọn chức vụ"
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

  // Tính điểm TB của SV
  nhanSu.tinhLuongThang();
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
                        class="btn btn-success ml-3" 
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


// btn Thêm nhân sự
getElement("btnThem").onclick = function () {
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
  // Ẩn button thêm sinh viên
  getElement("btnThemNV").style.display = "none";

  // Hiển thị lại button cập nhật nhân sự
  getElement("btnCapNhat").classList.remove("d-none");

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

getElement("btnUpdate").onclick = function () {
  //Lấy lại thông tin mới của SV sau chỉnh sửa
  var newStaff = layThongTinNS(false);

  if (newStaff) {
    nhansuQL.capNhatNS(newStaff);

    // cập nhật lại hiển thị ui
    renderNhanSuDS();

    // lưu lại danh sách nhân sự mới vào local storage
    setLocalStorage();

    // Hiển thị lại btn thêm nhân sự
    getElement("btnThemNV").style.display = "inline-block";

    // Ẩn btn cập nhật
    getElement("btnCapNhat").classList.add("d-none");

    // Kích hoạt ô nhập tài khoản
    getElement("tknv").disabled = false;

    // reset form
    resetForm();
  }
};

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

// Tìm kiếm sinh viên theo tên
getElement("txtSearch").onkeyup = function () {
  var valueSearch = getElement("txtSearch").value;

  // chuyển valueSearch về lowercase
  var valueSearchLowerCase = valueSearch.toLowerCase();

  // Duyệt mảng danh sách nhân sự
  var nhansuDSSearch = [];

  for (var i = 0; i < nhansuQL.nhansuDS.length; i++) {
    var nhanSu = nhansuQL.nhansuDS[i];

    // chuyển tên sinh Viên về dạng lowercase
    var tenSVLowerCase = nhanSu.hoTen.toLowerCase();

    // Nếu tên sv chứa toàn bộ ký tự của value search
    if (tenSVLowerCase.indexOf(valueSearchLowerCase) !== -1) {
      nhansuDSSearch.push(nhanSu);
    }
  }

  // render UI lại danh sách nhân sự theo kết quả tìm kiếm
  renderNhanSuDS(nhansuDSSearch);
};

getElement("btnSearch").onclick = function () {
  var valueSearch = getElement("txtSearch").value;

  // chuyển valueSearch về lowercase
  var valueSearchLowerCase = valueSearch.toLowerCase();

  var nhansuDSSearch = [];

  for (var i = 0; i < nhansuQL.listSV.length; i++) {
    var sv = nhansuQL.listSV[i];

    // chuyển tên sinh Viên về dạng lowercase
    var tenSVLowerCase = sv.tenSV.toLowerCase();

    // Nếu tên sv chứa toàn bộ ký tự của value search
    if (tenSVLowerCase.indexOf(valueSearchLowerCase) !== -1) {
      nhansuDSSearch.push(nhanSu);
    }
  }

  // render UI lại danh sách nhân sự theo kết quả tìm kiếm
  renderNhanSuDS(nhansuDSSearch);
};
