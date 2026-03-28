const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/integration/**/*.spec.js',
    baseUrl: 'http://localhost:3000',
    supportFile: false
  }
})
