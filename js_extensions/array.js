Array.prototype.detect = function(matcher){
  for(var i = 0; i < this.length; i++){
    var item = this[i]
    if(matcher(item)) {
      return item
    }
  }
  return null
}

Array.prototype.delete_at = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
}

Array.prototype.delete_if = function(matcher){
  for(var i = 0; i < this.length; i++){
    if(matcher(this[i])) {
      this.delete_at(i)
      i--
    }
  }
}

Array.prototype.delete_unless = function(matcher){
  this.delete_if(function(item){
    return !matcher(item)
  })
}