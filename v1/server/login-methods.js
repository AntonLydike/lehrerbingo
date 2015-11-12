Meteor.methods({
  createUserByUsername:function(username,password){
    var uid = Accounts.createUser({username,password});

    this.setUserId(uid)

    return {success:true,uid};
  }
});
