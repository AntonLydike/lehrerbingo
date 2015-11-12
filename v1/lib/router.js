Router.configure({
  layoutTemplate:"layout",
  notFoundTemplate:"notFound",
  loadingTemplate:"loading",
  onBeforeAction: function(){
    if ( Meteor.userId() ){
      if (Meteor.user().lobby) {
        this.next();

        if (Lobbys.find({_id:Meteor.user().lobby}).count() < 1) {
          Meteor.call('cleanUser');
          alert('Die Lobby wurde vom Admin abgebrochen!');
        } else {
          Router.go('/' + Meteor.user().lobby);
        }
      } else {
        this.next();
      }
    } else this.render('loginMD');
  }
});


Router.route('/',{
  name:'home',
  template:'lobbyList',
  waitOn: function () {return [Meteor.subscribe('lobby_list')]},
  data: function () {
    return {lobbys:Lobbys.find({})};
  }
});


Router.route('/:_id',function () {
  var lobby = Lobbys.findOne({_id:this.params._id});

  if (!lobby || Meteor.user().lobby !== this.params._id) {
    Router.go('/');
    return;
  }
  if (lobby.started) {
    this.render('game',{
      data:_.extend(lobby,{
        words:Meteor.user().words,
        players:Meteor.users.find({})
      })
    })
  } else {
    this.render('lobby',{
      data:lobby
    })
  }
},{
  name:'game',
  waitOn: function () {
    return [
      Meteor.subscribe('lobby_view',this.params._id),
      Meteor.subscribe('playerinfo',this.params._id),
      Meteor.subscribe('userinfo')
    ]}
});
