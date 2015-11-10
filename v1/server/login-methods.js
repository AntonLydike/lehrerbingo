Meteor.methods({
  createUserByUsername:function(username,password){

    var uid = Accounts.createUser({username,password});

    this.setUserId(uid)

    console.log(uid);

    return {success:true,uid};
  }
});
