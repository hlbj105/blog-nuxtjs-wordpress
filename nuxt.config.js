export default {
  mode: 'universal',

  head: {
    title: '黄良钵博客 - Huang Liangbo Blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { hid: 'prism', rel: 'stylesheet', href: '/css/prism.css' }
    ],
    script: [
      { src: '//at.alicdn.com/t/font_556506_8c5mvyqjye4.js' },
      { src: '/js/prism.js' },
      // 百度主推文章收录用
      { src: 'https://zz.bdstatic.com/linksubmit/push.js' },
      // 加入百度统计js，使用时自行添加为自己的
      { src: 'https://hm.baidu.com/hm.js?ed39b2fcb397fae01afebcfc68c6e903' }
    ]
  },

  loading: './components/Loading',

  router: {
    middleware: 'global',
    scrollBehavior (to, from, savedPosition) {
      return {
        x: 0,
        y: 0
      }
    }
  },

  css: [
    'element-ui/lib/theme-chalk/index.css',
    './assets/scss/global.scss'
  ],

  styleResources: {
    scss: ['./assets/scss/variable.scss']
  },

  plugins: [
    '~/plugins/axios',
    { src: '~/plugins/element-ui', ssr: true },
    { src: '~/plugins/message', ssr: false },
    { src: '~/plugins/icon', ssr: true }
    // { src: '~/plugins/common', ssr: false }
  ],

  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/proxy'
  ],

  axios: {
    proxy: true
  },

  build: {
    transpile: [/^element-ui/],
    extractCSS: true,
    vendors: ['@nuxtjs/axios', 'element-ui']
    // extend(config, ctx) {
    // }
  },

  // 将此处2个地址改为自己的地址
  proxy: {
    '/api': {
      target: 'https://blog.huangliangbo.com',
      // target: 'http://localhost:8888',
      pathRewrite: {
        '^/api': '/'
      }
    },
    '/wp-content': {
      target: 'https://blog.huangliangbo.com'
      // target: 'http://localhost:8888'
    }
  },

  env: {
    baseUrl: '/api'
  }
}
