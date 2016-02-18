// make the form work
$('#url_form').submit(function() {

  //disable the form
  $('#url_form :input').attr('disabled', true);

  //remove alert
  $('[data-formerror]').css({display: 'none'});

  //check for empty values
  if(!$('#school').val() || !$('#username').val() || !$('#password').val()) {
    $('#error-fields').css({display: 'block'});
    $('#url_form :input').attr('disabled', false);
    return;
  }

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
      $('#error-connection').css({display: 'block'});
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

//school auto suggestions
$('#school').on('input propertychange paste', function() {
  //the current value of the school text input
  var value = $(this).val();

  //check if the length of text is larger or equel to 3
  if(value.length >= 3) {

    //perform ajax request
    $.ajax("./schools?name="+value).then(function(data) {

      //check if the suggestionbox should still update
      if(value.length <= $('#school').val().length) {

        //remove all current suggestions
        $('#suggestions').empty();

        //add current suggestions
        var hasadded = false;
        for(var i = 0; i < 5 && i < data.schools.length; i++) {
          var url = data.schools[i].url.replace('https://', '').replace('.magister.net', '');
          if(url != value) {
            $('#suggestions').append('<div class="school" data-value="'+url+'">'+data.schools[i].name+'</div>');
            hasadded = true;
          }
        }

        //add click functionality for all current suggestions
        $('.school[data-value]').click(function() {
          $('#school').val($(this).attr('data-value'));
          $('#suggestions').empty();
          $('#suggestions').addClass('invisible');
          $('#school').removeClass('suggesting');
        });

        //make suggestionbox visible if needed otherwise make it invisible
        if(hasadded) {
          $('#suggestions').removeClass('invisible');
          $('#school').addClass('suggesting');
        } else {
          $('#suggestions').addClass('invisible');
          $('#school').removeClass('suggesting');
          $('#suggestions').empty();
        }
      }
    });
  } else {
    //empty the suggestionbox
    $('#suggestions').addClass('invisible');
    $('#school').removeClass('suggesting');
    $('#suggestions').empty();
  }
});
