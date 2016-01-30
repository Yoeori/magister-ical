$('#url_form').submit(function() {
  $('#url_form :input').attr('disabled', true);
  var url = location.href.substring(0, location.href.lastIndexOf("/")+1) + $('#school').val() + "/" + $('#username').val() + "/";
  $.post("./generate", { password: $('#password').val()} , function(enc) {
    url += enc;
    $('#url').val(url);
    $('#url_form :input').attr('disabled', false);
    $('#url-box').removeClass('invisible');
  });
});

$("#copy").click(function() {
  var field = $('#url');
  field.select();
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  return false;
})
