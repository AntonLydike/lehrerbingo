
Template.lobby.onRendered(function(){
  Session.set('room',this.data.name)
});
Template.lobby.onDestroyed(function(){
  Session.set("room", false);
});


Template.game.onRendered(function(){
  Session.set('room',this.data.name)
});
Template.game.onDestroyed(function(){
  Session.set("room", false);
});

Template.lobby.events({
  'click .start':function () {
    Meteor.call('startGame',this._id);
  }
})

Template.lobby.helpers({
  isAdmin: function () {
    return this.admin_id == Meteor.userId();
  }
})
