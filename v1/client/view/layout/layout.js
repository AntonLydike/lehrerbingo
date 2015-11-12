Template.layout.onRendered(function() {
  this.find('.yield')._uihooks = {
	  insertElement: function(node, next) {
	    $(node)
	      .css({opacity:0,position:'absolute'})
	      .insertBefore(next)
	      .transition({opacity:1,position:'relative',delay:100},500,'ease', function () {
	        // listFadeInHold.release();
	      }).css({transform:'',position:"",opacity:""});
	  },
	  removeElement: function(node) {
	    $(node)
	      .transition({opacity:0,position:'absolute'},500,'ease', function () {
	        $(this).remove();
	      });
	  }
  };
});

Template.layout.events({
  "click .js-toggle-sidebar": function(event, template){
    Session.set('sidebarOpen', !Session.get('sidebarOpen'));
  },
  "click .js-logout": function () {
    Meteor.logout();
  },
  "click .js-leave-lobby": function () {
    Meteor.call('leaveLobby',Meteor.user().lobby);
    Router.go('/');
  }
});
