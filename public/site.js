// make the form work
$('#url_form').submit(function() {

  //disable the form
  $('#url_form :input').attr('disabled', true);

  //remove alert
  $('#error').css({display: 'none'});

  //check the supplied credentials and if correct receive the encrypted version of the user's password
  $.post("./test", {
    school: $('#school').val(),
    username: $('#username').val(),
    password: $('#password').val()
  }, function(response) {

    //check if no error has occured
    if(response.error == false) {
      $('#url').val(location.href.substring(0, location.href.lastIndexOf("/")+1) + $('#school').val() + "/" + $('#username').val() + "/" + response.password);
      $('#url-box').removeClass('invisible');
    } else {
      $('#error').css({display: 'block'});
    }

    //re-enable the form
    $('#url_form :input').attr('disabled', false);
  });
});

//the copy button to copy the iCal url
$("#copy").click(function() {

  //select and copy the url text
  $('#url').select();
  document.execCommand('copy');

  //deselect all the text
  window.getSelection().removeAllRanges();

  //return false to cancal all other default behaviour
  return false;
});
