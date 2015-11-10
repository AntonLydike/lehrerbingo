rndMinMax = function (min,max) {
  return Math.round(Math.random() * (max - min)) + min;
}

rndInts = function (i,min,max) {
  if (max-min < i) {
    throw new Meteor.Error("parameters are not valid - max-min should be bigger then length");
  }

  var r = [],id;
  for (;i>0;i--) {
    do {
      id = rndMinMax(min,max);
    } while (r.indexOf(id) > -1)
    r.push(id);
  }
  return r;
}
