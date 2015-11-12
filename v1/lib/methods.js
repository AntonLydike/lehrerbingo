Meteor.methods({
  createLobby:function(name) {
    check(name, String);

    var user = Meteor.users.findOne({
        _id:this.userId
      },{
        fields:{username:1}
      });

    if (!user.username || !Meteor.userId()) {
      throw new Meteor.Error("not-authorized - " + user.username);
    }

    if (Lobbys.find({name:name}).count() > 0) {
      return {success:false,err:"Raum existiert bereits!"};
    }

    var id = Lobbys.insert({
      name,
      admin:user.username,
      user:[user],
      admin_id:user._id,
      started:false,
      winner:0
    })

    Meteor.users.update({_id:this.userId},{
      $set:{lobby:id}
    })

    return {success:true, id:id};
  },
  enterLobby:function(_id) {
    check(_id, String);

    var user = Meteor.users.findOne({
        _id:this.userId
      },{
        fields:{username:1}
      });

    if (!user.username || !this.userId) {
      throw new Meteor.Error("not-authorized - " + user.username);
    }

    var Lobby = Lobbys.findOne({_id:_id});

    if (!Lobby) {
      return {success:false,err:"Raum nicht gefunden!"};
    }

    if (Lobby.started) {
      return {success:false,err:"Raum hat bereits gestartet!"};
    }

    if (!!_.find(Lobby.user,function (v) {return v._id == user._id})) {
      return {success:true,already:true};
    }

    Lobbys.update({_id}, {$push:{
      user:user
    }});

    Meteor.users.update({_id:this.userId},{
      $set:{lobby:_id}
    })

    return {success:true};

  },
  leaveLobby:function (_id) {
    check(_id, String);

    var user = Meteor.users.findOne({
        _id:this.userId
      },{
        fields:{username:1}
      });

    if (!user.username || !this.userId) {
      throw new Meteor.Error("not-authorized - " + user.username);
    }

    var lobby = Lobbys.findOne({_id});

    if (!lobby) {
      return {success:false,err:"Raum nicht gefunden!"};
    }

    if (!_.find(lobby.user,function (v) {return v._id == user._id})) {
      return {success:true,already:true};
    }

    if (lobby.admin_id == this.userId) {
      Lobbys.remove({_id});
    } else {
      Lobbys.update({_id}, {$pull:{
        user:user
      }});
    }

    Meteor.users.update({_id:this.userId},{$set:{
      lobby:false,
      words:[]
    }})

    return {success:true};
  },
  cleanUser:function () {
    if (!this.userId) return;

    Meteor.users.update({_id:this.userId},{$set:{
      lobby:false
    }})
  },
  startLobby:function(_id) {
    check(_id, String);

    if (Meteor.isClient) {
      return {success:true};
    }

    var user = Meteor.user();

    if (!user.username || !this.userId) {
      throw new Meteor.Error("not-authorized - " + user.username);
    }

    var lobby = Lobbys.findOne({_id});

    if (!lobby) {
      return {success:false,err:"Raum nicht gefunden!"};
    }

    if (lobby.user.length < 3) {
      return {success:false,err:"Es werden mindestens 3 Spieler benötigt!"}
    }

    if (lobby.admin_id !== user._id) {
      return {success:false,err:"Sie sind nicht admin!"};
    }

    Lobbys.update({_id},{$set:{started:true,winner:false}});

    var user = lobby.user,
           w = Words.find(),
     wlength = w.count(),
       words = w.fetch();

    _.each(user,function (v) {
      var random = rndInts(4,0,wlength - 1),
            list = _.map(random,function (v) {
              return {word:words[v],done:false};
            });

      Meteor.users.update({_id:v._id},{$set:{
        lobby:_id,
        words:list
      }});

    });

    return {success:true};

  },
  wordState:function (_id,state) {
    check(_id, String);
    check(state, Boolean);

    var user = Meteor.user();

    if (!user.username || !this.userId) {
      throw new Meteor.Error("not-authorized - " + user.username);
    }

    var lobby = Lobbys.findOne({_id:user.lobby});

    if (!lobby.started) {
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
      Lobbys.update({_id:user.lobby},{$set:{
        started:false,
        winner:user.username
      }})
    }


  },
  reset:function () {
    if (Meteor.user().username != "anton") throw new Meteor.Error("not-authorized - " + user.username);

    if (Meteor.isClient) return;

    Meteor.users.update({},{$set:{
      lobby:false,
      words:[]
    }});

    Lobbys.remove({});

    Words.remove({});

    a = "Alphabet,Arbeitsagentur,Altenheim,Amulett,Anlage,Arm,Aufkleber,Auspuff,Auto,Ball,Bar,Baum,Bestellliste,Betttuch,Biokraftstoff,Blatt,Buch,Callcenter,Castingshow,Chinese,Clip,Computer,Dach,Dichtung,Disco,Dollar,Dorfschule,Dorfdisco,Eimer,Eisenbahn,Engel,Erdoel,Fahrrad,Feuerloescher,Film,Foto,Freiheit,Gehirn,Gehweg,Grundgesetz,Grundstueck,Gymnasium,Hafen,Haus,Heimatland,Holz,Horn,Igel,Impfstoff,Information,Infusion,Insel,Jachthafen,Jacke,Jaeger,Jobcenter,Jugendclub,Kaktus,Kamm,Kammer,Keller,Kugel,Leber,Leiste,Leiter,Liebe,Locher,Maus,Monat,Monitor,Musikstueck,Muskel,Nabelschnur,Nachbar,Nagel,Nase,Natur,Nonne,Notunterkunft,Obst,Ochse,Offizier,Orgel,Osterei,Paket,Papier,Passwort,Politiker,Poster,Quader,Quark,Quecksilber,Quelle,Quastenflosser,Rabe,Radio,Rakete,Reifen,Rettungswagen,Rechtsanwaltsgehilfe,Ritter,Sand,Scanner,Schloss,Stein,Strauch,Tasche,Taschenrechner,Tastatur,Taste,Tieger,Tisch,Turnschuh,Uhr,Ulme,Umschlagplatz,Umwelt,Unwetter,Vanille,Vater,Verdauung,Verkehr,Versicherung,Vogel,Waage,Waggon,Waschzeug,Wasser,Wort,Xylophon,Yogalehrer,Zahn,Zeichen,Zeitung,Zentrum,Eidechse,Taube,Waffel,Schlittschuhe,Satan,Apfel,Affe,Giraffe,Promenade,Defenestration,Staffellauf,Muecke,Brotbuechse,Tuerklinke,Wegbegrenzungslinie,Regelwerk,Sammelheft".split(',');

    for (i=0;i<a.length;i++) {
      Words.insert({
        word:a[i]
      })
    }
  }
})
