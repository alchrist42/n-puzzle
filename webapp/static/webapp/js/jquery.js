
$(document).on('submit', '#login_form', function(e) {
  e.preventDefault();
  //clear alerts
  $('.alert').remove();
  var username = $('#id_username').val()
  var password = $('#id_password').val()

  $.ajax({
    type: 'POST',
    url: '/login/',
    data: {
      "username": username,
      "password": password,
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success:function(response) {
      console.log(response)
      if (response["logged"]) {
        $('#login_form').parent().append("<p>You already logged</p>")
        $('#login_form').remove()
        // $('#login').attr("href", "/logout_ajax/")
        $('#login').text("Logout")
        $('#top_username').text(username)
        $('#palka').text(" | ")
      }
      else {
        var $alert = $("<div>", {role: "alert", "class": "alert alert-danger"});
        $alert.text(response['msg']);
        $('#login_form').prepend($alert)
      }
  }
  })
})

$('#login').click(function(e) {
  alert("!!!")
  e.preventDefault();
  $.ajax({
    type: 'POST',
    url: '/logout_ajax/',
    success:function (response) {
      alert("done")
    }
  })
})

function like() {
  // e.preventDefault();
  $.ajax({
    type: 'POST',
    url: '/logout_ajax/',
    success:function (response) {
      // alert(response['form'])
      var $alert = $("<div>", {role: "alert", "class": "alert alert-info"});
        $alert.text(response['msg']);
        $('#form_place').children().remove()
        $('#form_place').append($alert)
        $('#login_form').parent().append("<strong>Success</strong>")

        // $('#login_form').remove()
        $('#login').attr("href", "/account/")
        $('#login').text("Login")
        $('#top_username').text("")
        $('#palka').text("")
    }
  })
  return false;
}