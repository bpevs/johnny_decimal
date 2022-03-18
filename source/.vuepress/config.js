const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Johnny•Decimal•JS',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'https://github.com/ivebencrazy/johnny_decimal',
    editLinks: true,
    docsDir: 'source',
    docsBranch: 'docs',
    editLinkText: 'Edit this page',
    lastUpdated: true,
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'Documentation',
        link: 'https://doc.deno.land/https/deno.land/x/johnny_decimal/mod.ts',
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Home',
          collapsable: false,
          children: [
            '',
            'setup',
            'setup_manually'
          ]
        },
        {
          title: 'Plugins',
          collapsable: false,
          children: [
            'plugins/plugin_usage',
            'plugins/plugin_development'
          ]
        }
      ],
    }
  },

  theme: 'yuu',

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
