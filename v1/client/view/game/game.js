Template.game.events({
  'click .toggle[_id]':function () {
    Meteor.call('wordState',this.word._id,!this.done);
  }
})
