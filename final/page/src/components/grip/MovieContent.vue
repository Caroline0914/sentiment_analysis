<template>
  <div class="wrapper">
    <InputCmp place="请输入电影名" @startGrip="gripMovieContent"/>
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
      }
    },
    mounted() {
      if(this.$route.params.id) {
        this.$store.dispatch('gripMovieContent', {inp: '', id: this.$route.params.id, fn: () => {
          this.$router.push('/dataGrip/movieContentGrip/' + this.movieContent.id)
        } });
      }
    },
    methods: {
      gripMovieContent(inp) {
        this.$store.dispatch('gripMovieContent', {inp: inp, id: '', fn: () => {
          this.$router.push('/dataGrip/movieContentGrip/' + this.movieContent.id)
        } });
      },
    }
  }
</script>

<style scoped>
.wrapper{
  font-size: 14px;
}
.wrapper .content{
  margin-top: 15px;
}
.wrapper .content .top{
  position: relative;
  height: 240px;
}
.wrapper .content .top .img{
  margin-left: 5px;
  width: 150px;
}
.wrapper .content .top .serious{
  position: absolute;
  left: 170px;
  top: 0;
}
.wrapper .content .top .serious .item{
  margin: 0 0 3px 0;
}
.wrapper .content .top .serious .item span{
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
</style>