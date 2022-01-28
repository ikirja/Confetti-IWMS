const { readdirSync } = require('fs');

module.exports = function getConnections() {
  let folders = readdirSync('./server/lib/marketplace', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
  folders.unshift('default');
  
  return folders;
}