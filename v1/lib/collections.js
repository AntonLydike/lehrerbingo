Lobbys = new Meteor.Collection("lobbys");
Lobbys.before.insert(function(uid, doc){
  doc.owner = uid;
});

Words = new Mongo.Collection("words");
