
Template.nav.helpers({
  animated: function(){
     return Session.get('sidebarOpen')?'anim':'';
  },
  lobby: function () {
    var r = Session.get('lobby');
    if (r) {
      return "<span class='small'>- <span class='light'>" + r + '</span></span>';
    } else {
      return "";
    }
  }
});
