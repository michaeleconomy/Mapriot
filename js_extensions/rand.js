global.rand = function(size) {
  if (!size) {
    return Math.random()
  }
  return Math.floor(Math.random() * size)
}