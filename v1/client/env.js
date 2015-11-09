Template.registerHelper('logInHidden', function () {
    return {'fade-out':!Meteor.userId()};
  }
)
Template.registerHelper('inRoom', function () {
    return Meteor.user() && !!Meteor.user().room;
  }
)

Meteor.subscribe('userinfo');

Session.setDefault("room", false);
