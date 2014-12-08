var clean = function(props, validProps) {
	var res = {}
	for(var prop in props) {
		if(validProps.indexOf("" + prop) > -1 && props[prop])
			res[prop] = props[prop]
	}
	return res
}

module.exports = {
	clean: clean
}