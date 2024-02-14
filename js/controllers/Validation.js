function Validation() {
    this.kiemTraRong = function (value, elementErrorId, messagError) {
        if (value === '') {
            getElement(elementErrorId).innerHTML = messagError
            return false
        }

        getElement(elementErrorId).innerHTML = ''
        return true
    }

    this.kiemTraDoDai = function (value, elementErrorId, messagError, min, max) {
        if (value.length < min || value.length > max) {
            getElement(elementErrorId).innerHTML = messagError
            return false
        }

        getElement(elementErrorId).innerHTML = ''
        return true
    }

    this.kiemTraSo = function (value, elementErrorId, messagError) {
        var pattern = /^[0-9]+$/
        var stringifiedValue = value.toString()

        if (stringifiedValue.match(pattern)) {
            getElement(elementErrorId).innerHTML = ''
            return true
        }

        getElement(elementErrorId).innerHTML = messagError
        return false
    }

    this.kiemTraPattern = function (value, elementErrorId, messagError, pattern) {
        if (value.match(pattern)) {
            getElement(elementErrorId).innerHTML = ''
            return true
        }

        getElement(elementErrorId).innerHTML = messagError
        return false
    }

    this.kiemTrMaSVTrung = function (taiKhoan, nhansuDS, elementErrorId, messagError) {
        var index = -1

        for (var i = 0; i < nhansuDS.length; i++) {
            var nhanSu = nhansuDS[i]
            if (nhanSu.taiKhoan === taiKhoan) {
                index = i
                break
            }
        }

        if (index === -1) {
            getElement(elementErrorId).innerHTML = ''
            return true
        }

        getElement(elementErrorId).innerHTML = messagError
        return false
    }

    this.kiemTraChucVu = function (idSelect, elementErrorId, messagError) {
        var selectedIndex = getElement(idSelect).selectedIndex

        if (!selectedIndex) {
            getElement(elementErrorId).innerHTML = messagError
            return false
        }

        getElement(elementErrorId).innerHTML = ''
        return true
    }
}
