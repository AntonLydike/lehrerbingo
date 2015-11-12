
Template.lobby.onRendered(function(){
  Session.set('lobby',this.data.name);
});
Template.lobby.onDestroyed(function(){
  Session.set("lobby", false);
});


Template.game.onRendered(function(){
  Session.set('lobby',this.data.name)
});
Template.game.onDestroyed(function(){
  Session.set("lobby", false);
});

Template.lobby.events({
  'click .start.waves-effect':function () {
    Meteor.call('startLobby',this._id,function (e,r) {
      if (e) {
        // handle it!
      } else if (r.success) {

      } else {
        Materialize.toast(r.err,6000,'err');
      }
    });
  }
})

Template.lobby.helpers({
  isAdmin: function () {
    return this.admin_id == Meteor.userId();
  },
  startable: function () {
    return this.user.length > 2;
  },
  user:function () {
    var uid = Meteor.userId(),
       self = this;

    return _.map(this.user,function (v) {
      return {
        username:v.username,
        admin:(v._id == self.admin_id),
        you:(v._id == uid),
        winner:(v.username == self.winner)
      }
    })
  }
})
