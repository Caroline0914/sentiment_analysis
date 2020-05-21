<template>
  <div class="wrapper">
    <InputCmp place="请输入电影名" @startGrip="gripMovieContent"/>
    <div class="watch" v-show="movieContent.name">
      <div class="word">电影跳转观看：</div>
      <div class="pic">
        <a :href="`https://so.youku.com/search_video/q_${movieContent.name}`" title="优酷" target="_blank">
          <img src="../../assets/youku.png" alt="">
        </a>
      </div>
      <div class="pic">
        <a :href="`https://so.iqiyi.com/so/q_${movieContent.name}`" title="爱奇艺" target="_blank">
          <img src="../../assets/iqiyi.jpg" alt="">
        </a>
      </div>
      <div class="pic">
        <a :href="`https://search.bilibili.com/all?keyword=${movieContent.name}`" title="bilibili" target="_blank">
          <img src="../../assets/bilibili.jpg" alt="">
        </a>
      </div>
    </div>
    <div class="content" v-show="movieContent.name">
      <div class="top">
        <img class="img" :src="movieContent.image">
        <div class="serious">
          <div class="item">电影: <span>{{movieContent.name}}</span></div>
          <div class="item">导演: <span v-for="(item, i) in movieContent.director">{{item}}<template v-if="i < movieContent.director.length - 1">&nbsp;/</template></span></div>
          <div class="item">编剧: <span v-for="(item, i) in movieContent.author">{{item}}<template v-if="i < movieContent.author.length - 1">&nbsp;/</template></span></div>
          <div class="item">主演: <span v-for="(item, i) in movieContent.actor">{{item}}<template v-if="i < movieContent.actor.length - 1">&nbsp;/</template></span></div>
          <div class="item">类型: <span v-for="(item, i) in movieContent.type">{{item}}<template v-if="i < movieContent.type.length - 1">&nbsp;/</template></span></div>
          <div class="item">制片国家/地区: <span>{{movieContent.country}}</span></div>
          <div class="item">语言: <span>{{movieContent.language}}</span></div>
          <div class="item">上映时间: <span>{{movieContent.datePublished}}</span></div>
          <div class="item">片长: <span>{{movieContent.mTime}}</span></div>
        </div>
      </div>
      <div class="plot">
        <div class="plotTitle">{{movieContent.name}}的剧情简介</div>
        <div class="plotDetail" v-for="item in movieContent.plot">{{item}}</div>
      </div>
      <div class="prize" v-if="movieContent.prize.length">
        <div class="prizeTitle">{{movieContent.name}}的获奖情况</div>
        <div class="prizeDetail" v-for="item in movieContent.prize">
          <span v-for="cont in item">{{cont}}</span>
        </div>
      </div>
    </div>
    <div class="noData" v-if="showNoData">暂无数据</div>
  </div>
</template>

<script>
  import InputCmp from './component/inputCmp';
  import { mapState, mapActions } from 'vuex';

  export default {
    name: "MovieContent",
    components: {
      InputCmp
    },
    computed: {
      ...mapState(['movieContent'])
    },
    data() {
      return {
        showNoData: false
      }
    },
    mounted() {
      if(this.$route.params.id) {
        this.$store.dispatch('gripMovieContent', {inp: '', id: this.$route.params.id, fn: () => {
          this.showNoData = !this.movieContent.hasContent;
          if(!this.showNoData){
            this.$router.push('/dataGrip/movieContentGrip/' + this.movieContent.id)
          }
        } });
      } else {
        this.movieContent.name = '';
      }
    },
    methods: {
      gripMovieContent(inp) {
        this.$store.dispatch('gripMovieContent', {inp: inp, id: '', fn: () => {
          this.showNoData = !this.movieContent.hasContent;
          if(!this.showNoData) {
            this.$router.push('/dataGrip/movieContentGrip/' + this.movieContent.id)
          } else {
            this.$router.push('/dataGrip/movieContentGrip');
          }
        } });
      },
    }
  }
</script>

<style scoped>
.wrapper{
  font-size: 14px;
  position: relative;
}
.wrapper .watch{
  display: flex;
  position: absolute;
  left: 800px;
  top: 60px;
}
.wrapper .watch .word{
  color: #3a8ee6;
  font-size: 18px;
  font-weight: bold;
  margin-top: 8px;
}
.wrapper .watch .pic{
  width: 30px;
  height: 30px;
  margin: 5px;
}
.wrapper .watch .pic img{
  width: 30px;
}
.wrapper .content{
  margin-top: 15px;
}
.wrapper .content .top{
  display: flex;
}
.wrapper .content .top .img{
  margin-left: 5px;
  width: 200px;
}
.wrapper .content .top .serious{
  margin-left: 10px;
}
.wrapper .content .top .serious .item{
  color: #666666;
  margin: 0 0 3px 0;
}
.wrapper .content .top .serious .item span{
  color: #111;
  margin: 0 2px;
}
.wrapper .content .plot,
.wrapper .content .prize{
  margin: 10px;
}
.wrapper .content .plot .plotTitle,
.wrapper .content .prize .prizeTitle{
  font-size: 20px;
  margin: 5px 0;
  color: #007722;
}
.wrapper .content .plot .plotDetail{
  text-indent: 2em;
  margin-bottom: 5px;
}
.wrapper .content .prize .prizeDetail{
  margin-bottom: 3px;
}
.wrapper .content .prize .prizeDetail span{
  margin-right: 10px;
}
.wrapper .content .prize .prizeDetail span:first-child{
  color: rgb(51, 119, 170);
}
.wrapper .noData{
  font-size: 20px;
  text-align: center;
  margin: 100px;
  color: #666;
}
</style>