<template>
  <footer :class="['footer', errorInformation.code && 'is-error', menuStatus && 'is-show-menu']">
    <div class="wrap">
      <div class="link-wrap" v-if="$route.name === 'index'">
        <a
          v-for="(item, index) in links"
          :key="index"
          :href="item.url"
          :target="item.target"
          :title="item.description"
        >
          {{ item.text }}
        </a>
      </div>
      <div class="copyright">
        <div class="left">
          <ul class="footer-menu">
            <li class="list" v-for="item in subMenu" :key="item.key">
              <nuxt-link
                v-if="item.object === 'category'"
                :to="{
                  name: 'category-id',
                  params: { id: 1 },
                  query: { type: item.object_id, title: item.title }
                }"
              >
                {{ item.title }}
              </nuxt-link>
              <nuxt-link
                v-else-if="item.object === 'page'"
                :to="{ name: 'page-id', params: { id: item.object_id } }"
              >
                {{ item.title }}
              </nuxt-link>
              <a v-else-if="item.object === 'custom'" :href="item.url">{{ item.title }}</a>
            </li>
          </ul>
          <!-- 版权文字 -->
          <div class="copyright-text" v-html="copyright"></div>
          <span id="site-run-time">{{ siteRunTimeAllDay }}</span>
        </div>
        <p class="right">Theme by <a target="_blank" href="https://www.xuanmo.xin">Xuanmo</a></p>
      </div>
    </div>
    <div class="back-top" ref="backTop" @click="backTop" :class="{ show: isShowBackTop }">
      <x-icon class="icon-back-top"></x-icon>
    </div>
  </footer>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'AppFooter',
  data () {
    return {
      isShowBackTop: false,
      siteRunTimeAllDay: '',
      setTimeout: null
    }
  },
  computed: {
    ...mapState(['menuStatus', 'links', 'subMenu', 'errorInformation']),
    ...mapState({
      copyright: state => state.info.copyright
    })
  },
  mounted () {
    let self = this
    window.addEventListener('scroll', function () {
      self.isShowBackTop = this.scrollY > 300
    })
    this.countDown()
  },
  destroyed () {
    clearTimeout(this.setTimeout)
  },
  methods: {
    backTop () {
      window.scrollTo(0, 0)
    },
    countDown () {
      let seconds = 1000
      let minutes = seconds * 60
      let hours = minutes * 60
      let days = hours * 24
      let years = days * 365
      const today = new Date()
      let todayYear = today.getFullYear()
      let todayMonth = today.getMonth()
      let todayDate = today.getDate()
      let todayHour = today.getHours()
      let todayMinute = today.getMinutes()
      let todaySecond = today.getSeconds()
      /* 修改下面的t1数值为网站建成时间（年，月，日，时，分，秒） */
      let t1 = Date.UTC(2013, 11, 9, 0, 0, 0)
      let t2 = Date.UTC(
        todayYear,
        todayMonth,
        todayDate,
        todayHour,
        todayMinute,
        todaySecond
      )
      let diff = t2 - t1
      let diffYears = Math.floor(diff / years)
      let diffDays = Math.floor(diff / days - diffYears * 365)
      let diffDaysAll = Math.floor(diff / days)
      let diffHours = Math.floor(
        (diff - (diffYears * 365 + diffDays) * days) / hours
      )
      let diffMinutes = Math.floor(
        (diff - (diffYears * 365 + diffDays) * days - diffHours * hours) /
          minutes
      )
      let diffSeconds = Math.floor(
        (diff -
          (diffYears * 365 + diffDays) * days -
          diffHours * hours -
          diffMinutes * minutes) /
          seconds
      )
      if (diffHours < 10) {
        diffHours = '0' + diffHours
      }
      if (diffMinutes < 10) {
        diffMinutes = '0' + diffMinutes
      }
      if (diffSeconds < 10) {
        diffSeconds = '0' + diffSeconds
      }

      // let siteRunTime = `网站稳定运行 : ${diffYears}年 零 ${diffDays}天 ${diffHours} 小时 ${diffMinutes} 分钟 ${diffSeconds} 秒`
      this.siteRunTimeAllDay = `网站稳定运行 : ${diffDaysAll}天 ${diffHours} 小时 ${diffMinutes} 分钟 ${diffSeconds} 秒`

      this.setTimeout = setTimeout(() => {
        this.countDown()
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  margin-top: $container-margin;
  padding: 30px 0;
  background: #2d3237;
  transition: .5s;

  &.is-show-menu {
    transform: translateX(-240px);
  }

  &.is-error {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}

.link-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #3b424a;
  line-height: 2;

  &:after {
    content: "";
    flex: auto;
  }

  >>> a {
    display: block;
    margin-right: $container-margin;
    font-size: $font-size-large;
    color: #9295a2;

    &:hover {
      color: $color-theme;
    }
  }
}

.copyright {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: $font-size-small;

  .footer-menu {
    display: flex;
    flex-wrap: wrap;

    .list {
      margin-right: 15px;
      line-height: 1.8;

      a {
        padding-right: 15px;
        border-right: 1px solid #666;
        font-size: $font-size-base;
      }

      &:last-child {
        a {
          border: 0;
        }
      }
    }
  }

  img {
    vertical-align: baseline;
  }

  .right {
    align-self: flex-end;
  }
}

.back-top {
  position: fixed;
  z-index: 99;
  right: 30px;
  bottom: 40px;
  transition: .5s;
  transform: translateX(100px);
  cursor: pointer;

  &.show {
    transform: translateX(0px);
  }

  .iconfont {
    font-size: 40px;
    color: $color-theme;
  }
}

@media screen and (max-width:1024px) {
  .copyright {
    flex-wrap: wrap;
  }

  .left {
    width: 100%;
  }

  .right {
    width: 100%;
    margin-top: $container-margin;
    text-align: right;
  }
}
</style>
