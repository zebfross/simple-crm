$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function ProfileFormValidator(){
	$('#profile-form').bootstrapValidator({
		message: 'This value is not valid',
		fields: {
			email: {
				validators: {
					emailAddress: {
						message: 'The input is not a valid email address'
					}
				}
			},
			password: {
				validators: {
					identical: {
						field: 'confirmPassword',
						message: 'The password and its confirm are not the same'
					}
				}
			},
			confirmPassword: {
				validators: {
					identical: {
						field: 'password',
						message: 'The password and its confirm are not the same'
					}
				}
			}
		}
	});
}

$.cookie.json = true;
var User = function() {
	$this = this;
	
	this.setCurrent = function(usr) {
		$.cookie('token', usr.token, {path: '/'});
		$.cookie('user', usr, {expires: 1, path: '/'});
	};

	this.getCurrent = function() {
		var usr = $.cookie("user");
		return usr;
	};

	this.login = function(username, password) {
		var token = $.cookie('token');
		if(token) {
			window.location = "/";
		} else {
			$.post("/users/login", {'username': username, 'password': password}, function(res) {}, 'json').always(function(usr) {
				usr = usr.responseJSON || usr;
				if(usr.error) {
					alert(usr.error);
				} else {
					console.log(usr.token);
					setCurrentUser(usr);
					window.location = "/";
				}
			});
			return false;
		}
	};

	this.logout = function() {
		$.removeCookie('token');
		$.removeCookie('user');
		window.location = "/pages/login.html";
	};

	this.register = function(obj) {
		$.post("/users/register", obj, function(resp) {}, 'json').always(function(usr) {
			usr = usr.responseJSON || usr;
			if(usr.error) {
				alert(usr.error);
			} else {
				confirm("Registration successful!  Please continue to login.");
				window.location = "/pages/login.html";
			}
		});
	};

	this.authenticate = function(done) {
		$.post("/users/authenticate", {access_token: $.cookie("token")}, function(resp) {
			done(true);
		}).fail(function() {
			if(confirm("authentication failed")){
				done(false);
				window.location = "/pages/login.html";
			}
			done(true);
		});
	};
	
	this.save = function(usr) {
		usr.id = $this.getCurrent().id;
		$.post("/users/user/
	};
};