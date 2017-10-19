var moment = require('moment')

module.exports = {
    format: function(el, f, options) {
        return f + el
    },
    formatDate: function(d, fmt) {
        return moment(d).format(fmt)
    },
    formatPhone: function(phone) {
        if(!phone || phone == "")
            return "";
        return phone.replace(/^(\d{0,3})(\d{3})(\d{4})$/, '($1)$2-$3');
    },
    formatRich: function(richText) {
        if(!richText || richText == "")
            return "";
        return richText.replace(/\r\n/g, '\<br /\>');
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
