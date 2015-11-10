// if (Bills.findOne() == undefined) {
//   var r = function (m) {
//     var r = Math.floor((Math.random() * m))
//     return (r < 10?"0":"") + r;
//   },
//   fakeTime = function () {
//     return r(24) + ":" + r(60) + ' Uhr';
//   },
//   fakeDate = function () {
//     return r(30) + '.' + r(12) + '.15';
//   };
//
//   for (var i = 0;i<20;i++) {
//     Bills.insert({
//       comment:Fake.sentence(),
//       dayText:fakeDate(),
//       fromText:fakeTime(),
//       toText:fakeTime(),
//       fee:1000,
//       work:(i<10?'Putzen':Fake.word()),
//       time:{
//         h:Math.floor((Math.random() * 12)),
//         m:Math.floor((Math.random() * 60)),
//       }
//     })
//   }
//
//   console.log('setUp successfull')
// }


// Meteor.users.update({_id:"jJ64SWRsc8wjN6fsc"},{$set:{name:"Anton"}})
// Rooms.remove({});
