function login () {
  var username = $('input#username').val(),
        passwd = $('input#password').val();

  if (!username || !passwd) {
    formError('Bitte alle Felder füllen',true);
    return;
  }

  Meteor.loginWithPassword({username},passwd,function (e) {
    if (e) {
      console.log(e);
      formError(e.reason);
    }
  });
}

function register () {
  var username = $('input#username').val(),
      password = $('input#password').val();

  if (!username || !password) {
    formError('Bitte alle Felder füllen',true);
    return;
  }

  Meteor.call('createUserByUsername',username,password,function (e,r) {
      if (e) {
        console.log(e);
        formError(e.reason);
      } else if(r.success) {
        Meteor.loginWithPassword({username},password,function (e) {
          if (e) {
            console.log(e);
            formError(e.reason);
          }
        });
      }
  });
}

function formError (msg,r) {
  if (msg == "error.accounts.Login forbidden") msg = "Falsches Passwort";
  if (msg == "Username already exists.") msg = "Username vergeben";

  Materialize.toast(msg,6000,'err');
  console.log(msg,r);
  if (!r) $('input#password').val('').focus();
}


Template.loginMD.onRendered(function () {
  $('.login-container').css({
		overflow:'auto'
	})

  $('.login-container input').on('keyup',function (e) {
    if (e.keyCode == 13) {
      login();
    }
  })

  $('.js-login').click(login);

  $('.js-register').click(register);
})
