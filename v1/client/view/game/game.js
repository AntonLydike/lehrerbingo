Template.game.events({
  'click .toggle[_id]':function () {
    Meteor.call('wordState',this.word._id,!this.done);
  }
})

Template.game.helpers({
  players:function () {
    var uid = Meteor.userId(),
       self = this;

    return _.map(this.players.fetch(),function (v) {
      return {
        username:v.username,
        admin:(v._id == self.admin_id),
        you:(v._id == uid),
        words:_.reduce(v.words,function (m,v) {return m + (m==""?'':', ') + v.word.word},""),
        stats: "" + _.reduce(v.words,function (memo, v) {return memo + (v.done == true?1:0)},0) + "/" + v.words.length
      }
    })
  }
})
