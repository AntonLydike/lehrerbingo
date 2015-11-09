Template.lobbyList.events({
  'click .join-room': function(e,t){
    var _id = $(this).attr('_id');

    Meteor.call('enterRoom',_id,function (e,r) {
      if (e) {
        // handle it!
      } else if (r.success) {
        Router.go('/' + _id);
      } else {
        alert(r.err);
      }
    });
  },
  'click .add-room':function () {
    var name = prompt('Raumname:');
    while (name == "" || Rooms.findOne({name})) {
      name = prompt('Name ist bereits vergeben - Anderer Raumname:');
    }

    Meteor.call('createRoom',name,function (e,r) {
      console.log(e,r);
      if (e) {
      } else if (r.success) {
        Router.go('/' + r.id);
      } else {
        alert(r.err);
      }
    })
  }
});
