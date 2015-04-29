var moment = require('moment')

module.exports = {
    format: function(el, f, options) {
        return f + el
    },
    formatDate: function(d, fmt) {
        return moment(d).format(fmt)
    }
}
