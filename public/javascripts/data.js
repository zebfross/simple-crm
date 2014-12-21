var $;
if(typeof $ === 'undefined' && typeof exports !== 'undefined' && this.exports !== exports) {
	isNode = true;
	$ = {}
}

var Data = function(rootUrl) {
  this.root = rootUrl || "/";
  this.post = function(url, data, done) {
    $.post(this.root + url, data, function(res) {
      done(null, res);
    }, 'json')
    .fail(function(xhr, status, err) {
      done(err, null);
    });
  };
  this.get = function(url, done) {
    $.getJSON(this.root + url, function(res) {
      done(null, res);
    })
    .fail(function(xhr, status, err) {
      done(err, null);
    });
  };
  this.put = function(url, data, done) {
    $.ajax({
      url: this.root + url,
      data: data,
      type: 'PUT',
      success: function(res) {
        done(null, res);
      },
      fail: function(xhr, status, err) {
        done(err, null);
      }
    })
  };
};