Session.setDefault("sidebarOpen", false);

Template.sidebar.helpers({
  isOpen: function () {
    return Session.get('sidebarOpen');
  }
})

Template.sidebar.events({
  'click .sidebar-bg,.sidebar': function () {
    Session.set('sidebarOpen',false)
  }
})
