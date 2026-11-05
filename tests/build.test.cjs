const fs = require('node:fs');
const assert = require('node:assert/strict');
const test = require('node:test');

test('builds every template and copies binary assets unchanged', () => {
  for (const file of fs.readdirSync('src/pages')) {
    if (file.endsWith('.hbs')) assert.ok(fs.statSync('dist/' + file.replace('.hbs','.html')).size > 0);
  }
  for (const file of ['Flaticon.ttf','Flaticon.woff','Flaticon.eot']) {
    assert.deepEqual(fs.readFileSync('dist/fonts/flaticon/'+file),fs.readFileSync('src/fonts/flaticon/'+file));
  }
  assert.ok(fs.statSync('dist/css/application.min.css').size > 0);
  const map = JSON.parse(fs.readFileSync('dist/css/maps/application.min.css.map','utf8'));
  assert.ok(map.sources.some(source => source.endsWith('application.scss')));
});

test('Sass failures exit unsuccessfully and include the compiler error', context => {
  const source = 'src/sass/security-error-' + require('node:crypto').randomUUID() + '.scss';
  fs.writeFileSync(source, '@error "security-compiler-probe";');
  context.after(() => {
    fs.rmSync(source);
    require('node:child_process').execFileSync(process.execPath, ['node_modules/gulp/bin/gulp.js', 'build'], {stdio:'pipe'});
  });
  const result = require('node:child_process').spawnSync(process.execPath, ['node_modules/gulp/bin/gulp.js', 'styles'], {encoding:'utf8'});
  assert.notEqual(result.status, 0);
  assert.match(result.stdout + result.stderr, /security-compiler-probe/);
});
