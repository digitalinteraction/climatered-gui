//
// @vue/cli-service configuration
// see: https://cli.vuejs.org/config/#global-cli-config
//

// Push the package version into the vue app with an environment variable
process.env.VUE_APP_NAME = require('./package.json').name
process.env.VUE_APP_VERSION = require('./package.json').version

// Add an extra import to all sass imports
module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "~@/scss/common.scss";'
      }
    }
  },
  chainWebpack: config => {
    config.resolve.extensions.add('.yml').add('.yaml')

    // Clear the existing svg rule and load as a component instead
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')

    // prettier-ignore
    config.module
      .rule('mdx')
      .test(/.mdx?$/)
      .use('babel-loader')
        .loader('babel-loader')
        .end()
      .use('@mdx-js/vue-loader')
        .loader('@mdx-js/vue-loader')
        .end()

    // prettier-ignore
    config.module
      .rule('yaml')
      .test(/\.ya?ml?$/)
      .use('json-loader')
        .loader('json-loader')
        .end()
      .use('yaml-loader')
        .loader('yaml-loader')
        .end()

    // prettier-ignore
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('raw-loader')
        .loader('raw-loader')
        .end()
      .use('markdown-loader')
        .loader('markdown-loader')
        .end()

    config.resolve.alias.set(
      'socket.io-client',
      process.env.NODE_ENV === 'development'
        ? 'socket.io-client'
        : 'socket.io-client/dist/socket.io.slim.js'
    )
  }
}
