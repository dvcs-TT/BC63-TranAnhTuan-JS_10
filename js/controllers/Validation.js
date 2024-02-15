function Validation() {
    this.kiemRong = function (value, elementErrorId, messagError) {
        if (value === '') {
            getElement(elementErrorId).innerHTML = messagError
            return false
        }

        getElement(elementErrorId).innerHTML = ''
        return true
    }

    this.kiemDoDai = function (value, elementErrorId, messagError, min, max) {
        if (value.length < min || value.length > max) {
            getElement(elementErrorId).innerHTML = messagError
            return false
        }

        getElement(elementErrorId).innerHTML = ''
        return true
    }

    this.kiemSo = function (value, elementErrorId, messagError) {
        var pattern = /^[0-9]+$/
        var stringifiedValue = value.toString()

        if (stringifiedValue.match(pattern)) {
            getElement(elementErrorId).innerHTML = ''
            return true
        }

        getElement(elementErrorId).innerHTML = messagError
        return false
    }

    this.kiemKhoangGtri = function (value, elementErrorId, messagError, min, max) {
        if (value < min || value > max) {
            getElement(elementErrorId).innerHTML = messagError
            return false
        }

        getElement(elementErrorId).innerHTML = ''
        return true
    }

    this.kiemPattern = function (value, elementErrorId, messagError, pattern) {
        if (value.match(pattern)) {
            getElement(elementErrorId).innerHTML = ''
            return true
        }

        getElement(elementErrorId).innerHTML = messagError
        return false
    }

    this.kiemTrungTk = function (taiKhoan, nhansuDS, elementErrorId, messagError) {
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

    this.kiemChucVu = function (idSelect, elementErrorId, messagError) {
        var selectedIndex = getElement(idSelect).selectedIndex

        if (!selectedIndex) {
            getElement(elementErrorId).innerHTML = messagError
            return false
        }

        getElement(elementErrorId).innerHTML = ''
        return true
    }
}
