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

var setReminders = function(reminders) {
	if(reminders > 0) {
		$(function() {
			$(".reminder-badge").text("" + reminders);
		});
	}
};
var usr = User.getCurrent();
if(usr) {
  var reminders = {};
	// var reminders = User.getCurrent().reminders.length;
	// User.recentEvents(User.getCurrent()._id, function(err, events) {
		// if(events && events.length > 0) {
			// reminders += events.length;
			// setReminders(reminders);
		// }
	// });
}

/*var initAjaxContent = function() {
	if(usr) {
		$(".display-name").text(User.getCurrent().display_name);
	}
};
$(function() {
	initAjaxContent();
	if(usr) {
		var hash = User.getCurrent().email;
		if(hash) {
			hash = md5(hash.trim().toLowerCase());
			var avatar = "http://www.gravatar.com/avatar/" + hash;
			$(".avatar").html('<img src="' + avatar + '" class="img-rounded" alt="avatar" />');
		}
		var alerts = User.getCurrent().alerts.length;
		if(alerts > 0)
			$(".alert-badge").text("" + alerts);
		setReminders(reminders);
	}
});*/
var initUserPicture = function(email, selector) {
    if(!selector)
        selector = ".avatar";
    if(!email)
        email = "";
    var hash = md5(email.trim().toLowerCase());
    var avatar = "http://www.gravatar.com/avatar/" + hash;
    var img = '<img src="' + avatar + '" class="img-rounded" alt="avatar" />';
    $(img).load(function() {
        $(selector).html(img);
    });
    //$(selector).html("<i class='fa fa-user' style='margin-top:4px' />");
};
$(".clickable").on("click", function(e) {
    var url = $(this).data("url");
    if(url != undefined)
        window.location = $(this).data("url");
});
