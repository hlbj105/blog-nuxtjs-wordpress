<!--
 * @Autor: Jason
 * @Date: 2021-05-25 15:34:59
 * @LastEditors: Jason
 * @LastEditTime: 2021-05-25 15:34:59
 * @FilePath: /pages/article/_id.vue
 * @description: description
-->
<template>
  <div class="container article-list-wrap m-t-0px">
    <ul class="header">
      <li class="list">所有文章</li>
    </ul>
    <article class="article-list" v-for="item in articleList" :key="item.key">
      <nuxt-link v-if="item.articleInfor.thumbnail" :to="{ name: 'id', params: { id: item.id } }" class="thumbnail-wrap">
        <img :src="item.articleInfor.thumbnail" class="thumbnail" alt="">
      </nuxt-link>
      <div class="list-content">
        <h2 class="title">
          <span class="classify" v-html="item.articleInfor.classify[0].name"></span>
          <nuxt-link :to="{ name: 'id', params: { id: item.id } }" class="vertical-middle" v-html="item.title.rendered"></nuxt-link>
        </h2>
        <p class="summary">{{ item.articleInfor.summary }}</p>
        <div class="opeartion">
          <div class="information">
            <span><x-icon type="icon-date"></x-icon>{{ item.date }}</span>
            <span><x-icon type="icon-hot1"></x-icon>{{ item.articleInfor.viewCount }}</span>
            <span><x-icon type="icon-message"></x-icon>{{ item.articleInfor.commentCount }}</span>
            <span><x-icon type="icon-good"></x-icon>{{ item.articleInfor.xmLike.very_good }}</span>
          </div>
          <nuxt-link class="details-btn" :to="{ name: 'id', params: { id: item.id } }">阅读详情</nuxt-link>
        </div>
      </div>
    </article>
    <!-- more btn start -->
    <el-pagination
      small
      :page-size="12"
      layout="prev, pager, next, jumper"
      :current-page="currentPage"
      @current-change="_changePagination"
      :total="totalPage">
    </el-pagination>
    <!-- more btn end -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Article',
  fetch ({ params, store }) {
    store.commit('article/SET_CURRENT_PAGE', +params.id)
    return store.dispatch('article/getArticleList', {
      page: params.id,
      per_page: 12,
      _embed: true
    })
  },
  computed: {
    ...mapState(['info']),
    ...mapState('article', ['articleList', 'totalPage', 'currentPage'])
  },
  methods: {
    _changePagination (id) {
      this.$store.commit('article/SET_CURRENT_PAGE', id)
      this.$router.push({
        name: 'article-id-title',
        params: { id }
      })
    }
  }
}
</script>
