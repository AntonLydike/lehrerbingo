Meteor.methods({
  createRoom:function(name) {
    check(name, String);

    var user = Meteor.users.findOne({
        _id:this.userId
      },{
        fields:{username:1}
      });

    if (!user.username || !Meteor.userId()) {
      throw new Meteor.Error("not-authorized - " + user.username);
    }

    if (Rooms.find({name:name}).count() > 0) {
      return {success:false,err:"Raum existiert bereits!"};
    }

    var id = Rooms.insert({
      name,
      admin:user.username,
      user:[user],
      admin_id:user._id,
      started:false,
      winner:0
    })

    Meteor.users.update({_id:this.userId},{
      $set:{room:id}
    })

    return {success:true, id:id};
  },
  enterRoom:function(_id) {
    check(_id, String);

    var user = Meteor.users.findOne({
        _id:this.userId
      },{
        fields:{username:1}
      });

    if (!user.username || !this.userId) {
      throw new Meteor.Error("not-authorized - " + user.username);
    }

    var room = Rooms.findOne({_id:_id});

    if (!room) {
      return {success:false,err:"Raum nicht gefunden!"};
    }

    if (room.started) {
      return {success:false,err:"Raum hat bereits gestartet!"};
    }

    if (!!_.find(room.user,function (v) {return v._id == user._id})) {
      return {success:true,already:true};
    }

    Rooms.update({_id}, {$push:{
      user:user
    }});

    Meteor.users.update({_id:this.userId},{
      $set:{room:_id}
    })

    return {success:true};

  },
  leaveRoom:function (_id) {
    check(_id, String);

    var user = Meteor.users.findOne({
        _id:this.userId
      },{
        fields:{username:1}
      });

    if (!user.username || !this.userId) {
      throw new Meteor.Error("not-authorized - " + user.username);
    }

    var room = Rooms.findOne({_id});

    if (!room) {
      return {success:false,err:"Raum nicht gefunden!"};
    }

    if (!_.find(room.user,function (v) {return v._id == user._id})) {
      return {success:true,already:true};
    }

    if (room.admin_id == this.userId) {
      Rooms.remove({_id});
    } else {
      Rooms.update({_id}, {$pull:{
        user:user
      }});
    }

    Meteor.users.update({_id:this.userId},{$set:{
      room:false,
      words:[]
    }})

    return {success:true};
  },
  cleanUser:function () {
    if (!this.userId) return;

    Meteor.users.update({_id:this.userId},{$set:{
      room:false
    }})
  },
  startGame:function(_id) {
    check(_id, String);

    if (Meteor.isClient) {
      return {success:true};
    }

    var user = Meteor.user();

    if (!user.username || !this.userId) {
      throw new Meteor.Error("not-authorized - " + user.username);
    }

    var room = Rooms.findOne({_id});

    if (!room) {
      return {success:false,err:"Raum nicht gefunden!"};
    }

    if (room.user.length < 3) {
      return {success:false,err:"Es werden mindestens 3 Spieler benötigt!"}
    }

    if (room.admin_id !== user._id) {
      return {success:false,err:"Sie sind nicht admin!"};
    }

    Rooms.update({_id},{$set:{started:true,winner:false}});

    var user = room.user,
           w = Words.find(),
     wlength = w.count(),
       words = w.fetch();

    _.each(user,function (v) {
      var random = rndInts(4,0,wlength - 1),
            list = _.map(random,function (v) {
              return {word:words[v],done:false};
            });

      Meteor.users.update({_id:v._id},{$set:{
        room:_id,
        words:list
      }});
    })

    return {success:true};

  },
  wordState:function (_id,state) {
    check(_id, String);
    check(state, Boolean);

    var user = Meteor.user();

    if (!user.username || !this.userId) {
      throw new Meteor.Error("not-authorized - " + user.username);
    }

    var room = Rooms.findOne({_id:user.room});

    if (!room.started) {
      return {success:false,err:"Game hasn't started yet!"};
    }

    Meteor.users.update({_id:this.userId,'words.word._id':_id},{
      $set:{'words.$.done': state}
    })

    var done = true;
    _.each(Meteor.user().words,function (v) {
      if (v.done == false) done = false;
    });

    if (done) {
      Rooms.update({_id:user.room},{$set:{
        started:false,
        winner:user.username
      }})
    }


  },
  reset:function () {
    if (Meteor.user().username != "anton") throw new Meteor.Error("not-authorized - " + user.username);

    if (Meteor.isClient) return;

    Meteor.users.update({},{$set:{
      room:false,
      words:[]
    }});

    Rooms.remove({});

    Words.remove({});

    a = "Alphabet,Arbeitsagentur,Altenheim,Amulett,Anlage,Arm,Aufkleber,Auspuff,Auto,Ball,Bar,Baum,Bestellliste,Betttuch,Biokraftstoff,Blatt,Buch,Callcenter,Castingshow,Chinese,Clip,Computer,Dach,Dichtung,Disco,Dollar,Dorfschule,Dorfdisco,Eimer,Eisenbahn,Engel,Erdoel,Fahrrad,Feuerloescher,Film,Foto,Freiheit,Gehirn,Gehweg,Grundgesetz,Grundstueck,Gymnasium,Hafen,Haus,Heimatland,Holz,Horn,Igel,Impfstoff,Information,Infusion,Insel,Jachthafen,Jacke,Jaeger,Jobcenter,Jugendclub,Kaktus,Kamm,Kammer,Keller,Kugel,Leber,Leiste,Leiter,Liebe,Locher,Maus,Monat,Monitor,Musikstueck,Muskel,Nabelschnur,Nachbar,Nagel,Nase,Natur,Nonne,Notunterkunft,Obst,Ochse,Offizier,Orgel,Osterei,Paket,Papier,Passwort,Politiker,Poster,Quader,Quark,Quecksilber,Quelle,Quastenflosser,Rabe,Radio,Rakete,Reifen,Rettungswagen,Rechtsanwaltsgehilfe,Ritter,Sand,Scanner,Schloss,Stein,Strauch,Tasche,Taschenrechner,Tastatur,Taste,Tieger,Tisch,Turnschuh,Uhr,Ulme,Umschlagplatz,Umwelt,Unwetter,Vanille,Vater,Verdauung,Verkehr,Versicherung,Vogel,Waage,Waggon,Waschzeug,Wasser,Wort,Xylophon,Yogalehrer,Zahn,Zeichen,Zeitung,Zentrum,Eidechse,Taube,Waffel,Schlittschuhe,Satan,Apfel,Affe,Giraffe,Promenade,Defenestration,Staffellauf,Muecke,Brotbuechse,Tuerklinke,Wegbegrenzungslinie,Regelwerk,Sammelheft".split(',');
    for (i=0;i<a.length;i++) {
      Words.insert({
        word:a[i]
      })
    }
  }
})
