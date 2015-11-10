Meteor.publish("Room_list", function(){
  return Rooms.find({},{fields: {name:1,admin:1,started:1,user:1}});
});

Meteor.publish("userinfo", function() {
  return Meteor.users.find({_id:this.userId},{fields: {words:1,username:1,room:1}});
});

Meteor.publish("playerinfo", function(_id) {
  return Meteor.users.find({room:_id},{fields: {words:1,username:1}});
});

Meteor.publish("Room_view", function(_id){
  return Rooms.find({_id:_id});
});
