/*
 * @Author: hlb
 * @Date: 2019-10-19 15:55:57
 * @LastEditors: hlb
 * @LastEditTime: 2020-08-22 15:14:03
 * @Description: file content
 */
const axios = require('axios');
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
      { rel: 'stylesheet', href: 'https://blog.huangliangbo.com/wp-includes/css/dist/block-library/style.min.css' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { hid: 'prism', rel: 'stylesheet', href: '/css/prism.css' }
    ],
    script: [
      { src: 'https://blog.huangliangbo.com/wp-includes/js/comment-reply.min.js' },
      { src: '//at.alicdn.com/t/font_556506_8c5mvyqjye4.js' },
      { src: '/js/prism.js' },
      // 百度主推文章收录用
      { src: 'https://zz.bdstatic.com/linksubmit/push.js' },
      // 加入百度统计js，使用时自行添加为自己的
      { src: 'https://hm.baidu.com/hm.js?218865cc9b0917378dd4e17ad27fde22' }
    ]
  },

  loading: './components/Loading',

  router: {
    middleware: 'global'
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
    '@nuxtjs/proxy',
    '@nuxtjs/sitemap'
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
  },

  sitemap: {
    path: '/sitemap.xml', // sitemap名稱，不用改
    hostname: 'https://huangliangbo.com/', // 網址
    cacheTime: 1000 * 60 * 60 * 24, // 站點路由更新頻率，只在 generate: false有用
    gzip: true, // 生成 .xml.gz 檔的 sitemap
    generate: false, // 允許使用 nuxt generate 生成
    // 排除不要的頁面路由
    exclude: [
      '/404'
    ],
    // 靜態頁面路徑
    routes (callback) {
      axios.all([
        // blog 分类
        axios.get('https://blog.huangliangbo.com/wp-json/xm-blog/v1/menu'),
        // 文章列表
        axios.get('https://blog.huangliangbo.com/wp-json/wp/v2/posts', {
          params: {
            page: 1,
            per_page: 100,
            _embed: true
          },
          data: { progress: false }
        }),
        // 标签
        axios.get('https://blog.huangliangbo.com/wp-json/xm-blog/v1/info')

      ]).then(axios.spread(function (menu, posts, info) {
        const now = new Date();
        now.setHours(now.getHours(), now.getMinutes() - now.getTimezoneOffset());
        const indexRoutes = [
          {
            url: '/',
            changefreq: 'daily',
            priority: 1,
            lastmodISO: now.toISOString()
          }
        ]
        const menuRoutes = menu.data.mainMenu.map((data) => {
          let url = ''
          if (data.object === 'category') {
            url = '/category/1?type=' + data.object_id + '&title=' + data.title
          }
          if (data.object === 'page') {
            url = '/page/' + data.object_id
          }
          if (data.object === 'post_tag') {
            url = '/tags/1?type=' + data.term_id + '&title=' + data.name
          }
          if (data.object === 'custom') {
            url = data.url
          }
          return {
            url: url,
            changefreq: 'monthly',
            priority: 0.8,
            lastmodISO: data.post_modified
          }
        });
        const postsRoutes = posts.data.map((data) => {
          return {
            url: '/' + data.id,
            changefreq: 'daily',
            priority: 0.9,
            lastmodISO: data.modified
          }
        });
        const tagsRoutes = info.data.tagCloud.map((data) => {
          return {
            url: `/tags/1?type=${data.term_id}&title=${data.name}`,
            changefreq: 'weekly',
            priority: 0.7,
            lastmodISO: now
          }
        })
        // 用 concat 進行合併
        callback(null, indexRoutes.concat(menuRoutes, postsRoutes, tagsRoutes));
      }), function (err) {
        throw (err);
      });
    }
  }
}
