const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.cjs',
  workers: 1,
  use: { channel: 'chrome', baseURL: 'http://127.0.0.1:4325', viewport: {width:1440,height:1000} },
  webServer: { command: 'node tests/serve.cjs', url: 'http://127.0.0.1:4325/dist/index.html' },
});
