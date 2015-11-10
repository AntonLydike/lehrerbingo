
Template.nav.helpers({
  animated: function(){
     return Session.get('sidebarOpen')?'anim':'';
  },
  room: function () {
    var r = Session.get('room');
    if (r) {
      return "<span class='small'>- <span class='light'>" + r + '</span></span>';
    } else {
      return "";
    }
  }
});
