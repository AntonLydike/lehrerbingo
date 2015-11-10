Rooms = new Meteor.Collection("rooms");
Rooms.before.insert(function(uid, doc){
  doc.owner = uid;
});

Words = new Mongo.Collection("words");
