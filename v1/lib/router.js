Router.configure({
  layoutTemplate:"layout",
  notFoundTemplate:"notFound",
  loadingTemplate:"loading",
  onBeforeAction: function(){
    if ( Meteor.userId() ){
      if (Meteor.user().room) {
        this.next();

        if (Rooms.find({_id:Meteor.user().room}).count() < 1) {
          Meteor.call('cleanUser');
          alert('Die Lobby wurde vom Admin abgebrochen!');
        } else {
          Router.go('/' + Meteor.user().room);
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
  waitOn: function () {return [Meteor.subscribe('Room_list')]},
  data: function () {
    return {lobbys:Rooms.find({})};
  }
});


Router.route('/:_id',function () {
  var room = Rooms.findOne({_id:this.params._id});
  
  if (!room || Meteor.user().room !== this.params._id) {
    Router.go('/');
    return;
  }
  if (room.started) {
    this.render('game',{
      data:_.extend(room,{
        words:Meteor.user().words,
        players:Meteor.users.find({})
      })
    })
  } else {
    this.render('lobby',{
      data:room
    })
  }
},{
  name:'game',
  waitOn: function () {
    return [
      Meteor.subscribe('Room_view',this.params._id),
      Meteor.subscribe('playerinfo',this.params._id),
      Meteor.subscribe('userinfo')
    ]}
});
