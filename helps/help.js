
function changeFormat(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
}



module.exports = {changeFormat}