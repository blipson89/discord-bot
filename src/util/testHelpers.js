function isTesting() {
  return process.env['NODE_DEV'] == 'TEST';
}
function setTesting() {
  process.env['NODE_DEV'] = 'TEST';
}

module.exports = {
  isTesting,
  setTesting
}