var moment = require('moment')

module.exports = {
    format: function(el, f, options) {
        return f + el
    },
    formatDate: function(d, fmt) {
        return moment(d).format(fmt)
    },
    debug: function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
         
        if (optionalValue) {
            console.log("Value");
            console.log("====================");
            console.log(optionalValue);
        }
    },
    commaSplit: function(str) {
        return str.split(",");
    }
}
