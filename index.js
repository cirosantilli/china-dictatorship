const fs = require('fs');
const path = require('path');
const PACKAGE_PATH = path.dirname(require.resolve(path.join('china-dictatorship', 'package.json')));
const README_PATH = path.join(PACKAGE_PATH, 'README.html');

function get_data() {
  return fs.readFileSync(README_PATH, 'utf8');
}
exports.get_data = get_data;
