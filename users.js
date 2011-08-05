exports.watchers = []

exports.list = []
exports.version = 0
exports.watch = function(watcher){
  this.watchers.push(watcher)
}

exports.get_user = function(uid) {
  return this.list.detect(function(user) {
    return user.uid == uid
  })
}
exports.notify_watchers = function(evt, data) {
  this.version ++
  while(this.watchers.length > 0) {
    this.watchers.pop()(evt, data, this.version)
  }
}

exports.add = function(name, uid){
  var user = {
      name: name
    , uid: uid
    , last_seen: new Date()
    , x: rand(500) + 50
    , y: rand(300) + 50
  }
  this.list.push(user)
  this.notify_watchers("add", user)
}
exports.remove = function(uid) {
  var user = this.get_user(uid)
  if (user) {
    this.notify_watchers("remove", uid)
  }
}
exports.move = function(uid, x, y) {
  var user = this.get_user(uid)
  if (user) {
    user.x = x
    user.y = y
    this.notify_watchers("move", user)
  }
}