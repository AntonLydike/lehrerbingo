Template.lobbyList.events({
  'click .join-lobby': function(e,t){
    var _id = $(this).attr('_id');

    Meteor.call('enterLobby',_id,function (e,r) {
      if (e) {
        // handle it!
      } else if (r.success) {
        Router.go('/' + _id);
      } else {
        alert(r.err);
      }
    });
  },
  'click .add-lobby':function () {
    var name = prompt('Raumname:');
    if (!name) return;

    while (name == "" || Lobbys.findOne({name})) {
      name = prompt('Name ist bereits vergeben - Anderer Raumname:');
    }

    Meteor.call('createLobby',name,function (e,r) {
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

Template.lobbyList.helpers({
  noLobbys:function () {
    return this.lobbys.count() == 0;
  },
  anzahlUser:function () {
    return this.user.length;
  }
})
