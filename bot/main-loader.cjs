const Module = require('module');
const fs = require('fs');

Module._extensions['.js'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  module._compile(content, filename);
};

require('./main.js');
