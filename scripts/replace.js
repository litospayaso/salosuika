const fs = require('fs')
fs.readFile('www/index.html', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace('<base href="/" />', '<base href="https://litospayaso.github.io/salosuika/" />');

  fs.writeFile('www/index.html', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});