Template.registerHelper('logInHidden', function () {
  return {'fade-out':!Meteor.userId()};
});
Template.registerHelper('inLobby', function () {
  return Meteor.user() && !!Meteor.user().lobby;
});
Template.registerHelper("anzahl", function(v1) {
    return v1.count()||v1.length;
});

Meteor.subscribe('userinfo');

Session.setDefault("lobby", false);
