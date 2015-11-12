Meteor.publish("lobby_list", function(){
  return Lobbys.find({},{fields: {name:1,admin:1,started:1,user:1}});
});

Meteor.publish("userinfo", function() {
  return Meteor.users.find({_id:this.userId},{fields: {words:1,username:1,lobby:1}});
});

Meteor.publish("playerinfo", function(_id) {
  return Meteor.users.find({lobby:_id},{fields: {words:1,username:1}});
});

Meteor.publish("lobby_view", function(_id){
  return Lobbys.find({_id:_id});
});
