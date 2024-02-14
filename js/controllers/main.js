// DOM tới 1 thẻ
function getElement(id) {
    return document.getElementById(id)
}

// Khởi tạo đối tượng nhansuQL từ lớp NhanSuQL
var nhansuQL = new NhanSuQL()

// Khởi tạo đối tượng validation từ lớp Validation
var validation = new Validation()


// Lấy thông tin từ UI
function layThongTinNS(isAdd) {
    // isAdd = true => thêm nhân sự
    // isAdd = false => cập nhập nhân sự

    var maSV = getElement('txtMaSV').value
    var tenSV = getElement('txtTenSV').value
    var email = getElement('txtEmail').value
    var matKhau = getElement('txtPass').value
    var ngaySinh = getElement('txtNgaySinh').value
    var khoaHoc = getElement('khSV').value
    var diemToan = getElement('txtDiemToan').value * 1
    var diemHoa = getElement('txtDiemHoa').value * 1
    var diemLy = getElement('txtDiemLy').value * 1
    var isValid = true

    // Kiểm tra tài khoản nhân sự
    if (isAdd) {
        isValid &=
            validation.kiemTraRong(maSV, 'spanMaSV', 'Mã sinh viên không được bỏ trống') && // false
            validation.kiemTraDoDai(maSV, 'spanMaSV', 'Mã sinh viên từ 6 đến 10 ký tự', 6, 10) &&
            // validation.kiemTraSo(maSV, 'spanMaSV', 'Mã sinh viên phải là số')
            validation.kiemTraPattern(maSV, 'spanMaSV', 'Mã sinh viên phải là số', /^[0-9]+$/) &&
            validation.kiemTrMaSVTrung(maSV, nhansuQL.listSV, 'spanMaSV', 'Mã sinh viên đã tồn tại')
    }

    // Kiểm tra họ tên nhân sự
    isValid &= validation.kiemTraRong(tenSV, 'spanTenSV', 'Tên sinh viên không được bỏ trống') // false

    //Kiểm tra email
    isValid &=
        validation.kiemTraRong(email, 'spanEmailSV', 'Email không được bỏ trống') &&
        validation.kiemTraPattern(
            email,
            'spanEmailSV',
            'Email không đúng định dạng',
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        )

    // Kiểm tra điểm toán
    isValid &= validation.kiemTraSo(diemToan, 'spanToan', 'Điểm toán phải là số')

    // Kiểm tra khóa học

    isValid &= validation.kiemTraKhoaHoc('khSV', 'spanKhoaHoc', 'Vui lòng chọn khóa học')

    // Tạo một đối tượng sv từ lớp đối tượng sv
    // check isValid => nếu false => return về null
    if (!isValid) {
        return null
    }

    var sinhVien = new SinhVien(
        maSV,
        tenSV,
        email,
        matKhau,
        ngaySinh,
        khoaHoc,
        diemToan,
        diemLy,
        diemHoa
    )

    // Tính điểm TB của SV
    sinhVien.tinhDiemTB()

    // console.log('sinhVien', sinhVien)
    return sinhVien
}

// Render danh sách sinh viên
function renderDSSV(arrSV = nhansuQL.listSV) {
    // duyệt mảng listSV
    var content = ''
    for (var i = 0; i < arrSV.length; i++) {
        var sinhVien = arrSV[i]
        content += `
            <tr>
                <td>${sinhVien.maSV}</td>
                <td>${sinhVien.tenSV}</td>
                <td>${sinhVien.email}</td>
                <td>${sinhVien.ngaySinh}</td>
                <td>${sinhVien.khoaHoc}</td>
                <td>${sinhVien.dtb.toFixed(2)}</td>
                <td>
                    <button 
                        class="btn btn-danger" 
                        onclick="deleteSV('${sinhVien.maSV}')"
                    >
                        Delete
                    </button>
                    <button 
                        class="btn btn-success ml-3" 
                        onclick="editSV('${sinhVien.maSV}')"
                    >
                        Edit
                    </button>
                </td>
            </tr>
        `
    }
    
    getElement('tbodySinhVien').innerHTML = content
}

// renderDSSV()

// btn Thêm sinh viên
getElement('btnThemSV').onclick = function () {
    // B1: lấy thông tin sinh viên từ hàm layThongTinSV
    var sinhVien = layThongTinSV(true)
    
    if (sinhVien) {
        //B2: Thêm sinhVien vào trong nhansuQL
        nhansuQL.themSV(sinhVien)
        
        // Hiển thị danh sách nhân sự ra ngoài UI
        renderDSSV()

        // Lưu danh sách nhân sự vào local storage
        setLocalStorage()

        // reset form
        resetForm()
    }
}

// Xóa sinh viên
function deleteSV(maSV) {
    nhansuQL.xoaSV(maSV)

    // Cập nhật lại hiển thị sau khi xóa sv thành công
    renderDSSV()

    //  Lưu lại danh sách nhân sự vào local storage
    setLocalStorage()
}

// Cập nhật sinh viên
function editSV(maSV) {
    // Ẩn button thêm sinh viên
    getElement('btnThemSV').style.display = 'none'

    // Hiển thị lại button cập nhật sinh viên
    getElement('btnUpdate').classList.remove('d-none')

    // disabled input mã SV
    getElement('txtMaSV').disabled = true

    //Tìm index của SV
    var index = nhansuQL.timViTriSV(maSV)

    // Lấy thông tin SV
    var sinhVien = nhansuQL.listSV[index]

    //Hiển thị thông tin SV lên form
    getElement('txtMaSV').value = sinhVien.maSV
    getElement('txtTenSV').value = sinhVien.tenSV
    getElement('txtEmail').value = sinhVien.email
    getElement('txtPass').value = sinhVien.matKhau
    getElement('txtNgaySinh').value = sinhVien.ngaySinh
    getElement('khSV').value = sinhVien.khoaHoc
    getElement('txtDiemToan').value = sinhVien.diemToan
    getElement('txtDiemHoa').value = sinhVien.diemHoa
    getElement('txtDiemLy').value = sinhVien.diemLy
}


getElement('btnUpdate').onclick = function () {
    //Lấy lại thông tin mới của SV sau chỉnh sửa
    var newSV = layThongTinSV(false)

    if (newSV) {
        nhansuQL.capNhatSV(newSV)

        // cập nhật lại hiển thị ui
        renderDSSV()

        // lưu lại danh sách nhân sự mới vào local storage
        setLocalStorage()

        // Hiển thị lại btn thêm sinh viên
        getElement('btnThemSV').style.display = 'inline-block'

        // Ẩn btn cập nhật
        getElement('btnUpdate').classList.add('d-none')

        // enabled input mã SV
        getElement('txtMaSV').disabled = false

        // reset form
        resetForm()
    }
}

// Lưu local storage
function setLocalStorage() {
    // Lưu danh sách nhân sự vào local storage
    //B1: chuyển data về string
    var dtString = JSON.stringify(nhansuQL.listSV)
    //B2: Lưu vào local storage
    localStorage.setItem('nhansuDS', dtString)
}

function getLocalStorage() {
    //B1: lấy data dưới local storage
    var data = localStorage.getItem('nhansuDS')

    //B2: Parse data về kiểu dữ liệu ban đầu
    if (data !== null) {
        var dataParse = JSON.parse(data)

        // Hiển thị danh sách nhân sự đã lưu ra UI
        nhansuQL.listSV = dataParse

        renderDSSV()
    }
}

getLocalStorage()

// reset form

function resetForm() {
    getElement('formQLSV').reset()
}

// Tìm kiếm sinh viên theo tên
getElement('txtSearch').onkeyup = function () {
    var valueSearch = getElement('txtSearch').value

    // chuyển valueSearch về lowercase
    var valueSearchLowerCase = valueSearch.toLowerCase()
    
    // Duyệt mảng danh sách nhân sự
    var nhansuDSSearch = []

    for (var i = 0; i < nhansuQL.listSV.length; i++) {
        var sv = nhansuQL.listSV[i]

        // chuyển tên sinh Viên về dạng lowercase
        var tenSVLowerCase = sv.tenSV.toLowerCase()

        // Nếu tên sv chứa toàn bộ ký tự của value search
        if (tenSVLowerCase.indexOf(valueSearchLowerCase) !== -1) {
            nhansuDSSearch.push(sv)
        }
    }

    // render UI lại danh sách nhân sự theo kết quả tìm kiếm
    renderDSSV(nhansuDSSearch)
}

getElement('btnSearch').onclick = function () {
    var valueSearch = getElement('txtSearch').value

    // chuyển valueSearch về lowercase
    var valueSearchLowerCase = valueSearch.toLowerCase()
    
    var nhansuDSSearch = []

    for (var i = 0; i < nhansuQL.listSV.length; i++) {
        var sv = nhansuQL.listSV[i]

        // chuyển tên sinh Viên về dạng lowercase
        var tenSVLowerCase = sv.tenSV.toLowerCase()
        console.log('tenSVLowerCase: ', tenSVLowerCase)

        // Nếu tên sv chứa toàn bộ ký tự của value search
        if (tenSVLowerCase.indexOf(valueSearchLowerCase) !== -1) {
            nhansuDSSearch.push(sv)
        }
    }

    // render UI lại danh sách nhân sự theo kết quả tìm kiếm
    renderDSSV(nhansuDSSearch)
}