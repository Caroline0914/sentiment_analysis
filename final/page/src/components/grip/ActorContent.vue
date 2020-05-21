<template>
  <div class="wrapper">
    <InputCmp place="请输入演员名" @startGrip="gripActorContent"/>
    <div class="content" v-show="actorContent.actName">
      <div class="top">
        <img class="img" :src="actorContent.actImage" :alt="actorContent.actName">
        <div class="serious">
          <div class="item">姓名: <span>{{actorContent.actName}}</span></div>
          <div class="item">性别: <span>{{actorContent.actSex}}</span></div>
          <div class="item">星座: <span>{{actorContent.constellation}}</span></div>
          <div class="item">出生日期: <span>{{actorContent.birthday}}</span></div>
          <div class="item">出生地: <span>{{actorContent.birthplace}}</span></div>
          <div class="item">职业: <span>{{actorContent.job}}</span></div>
        </div>
      </div>
      <div class="introduction">
        <div class="introTitle">影人简介</div>
        <div class="introDetail" v-for="item in actorContent.introduction">{{item}}</div>
      </div>
      <div class="prize">
        <div class="prizeTitle">获奖情况</div>
        <div class="prizeDetail" v-for="item in actorContent.honor">
          <span v-for="cont in item">{{cont}} </span>
        </div>
      </div>
      <div class="recent" v-if="actorContent.recentProd">
        <div class="recentTitle">最近作品</div>
        <div class="recentDetail" v-for="item in actorContent.recentProd">
          <img :src="'https://images.weserv.nl/?url=' + item.img.substring(7)" :alt="item.name">
          <span>{{item.name}}</span>
        </div>
      </div>
      <div class="famous" v-if="actorContent.famousProd">
        <div class="famousTitle">热门作品</div>
        <div class="famousDetail" v-for="item in actorContent.famousProd">
          <img :src="'https://images.weserv.nl/?url=' + item.img.substring(7)" :alt="item.name">
          <span>{{item.name}}</span>
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
    name: "ActorContent",
    components: {
      InputCmp
    },
    computed: {
      ...mapState(["actorContent"])
    },
    data() {
      return {
        showNoData: false
      }
    },
    mounted() {
      if(this.$route.params.id) {
        this.$store.dispatch('gripActorContent', {inp: '', id: this.$route.params.id, fn: () => {
          this.showNoData = !this.actorContent.hasContent;
          if(!this.showNoData) {
            this.$router.push('/dataGrip/actorContentGrip/' + this.actorContent.id);
          }
        } })
      } else {
        this.actorContent.actName = '';
      }
    },
    methods: {
      gripActorContent(inp) {
        this.$store.dispatch('gripActorContent', {inp: inp, id: '', fn: () => {
          this.showNoData = !this.actorContent.hasContent;
          if(!this.showNoData) {
            this.$router.push('/dataGrip/actorContentGrip/' + this.actorContent.id);
          } else {
            this.$router.push('/dataGrip/actorContentGrip');
          }
        } })
      },
    }
  }
</script>

<style scoped>
.wrapper {
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
  margin: 0 0 5px 0;
}
.wrapper .content .top .serious .item span{
  margin: 0 2px;
}
.wrapper .content .introduction{
  margin: 10px;
}
.wrapper .content .prize,
.wrapper .content .recent,
.wrapper .content .famous{
  margin: 20px 10px;
}
.wrapper .content .introduction .introTitle,
.wrapper .content .prize .prizeTitle,
.wrapper .content .recent .recentTitle,
.wrapper .content .famous .famousTitle{
  font-size: 20px;
  margin: 5px 0;
  color: #007722;
}
.wrapper .content .introduction .introDetail,
.wrapper .content .prize .prizeDetail{
  margin-bottom: 5px;
}
.wrapper .content .introduction .introDetail{
  text-indent: 2em;
}
.wrapper .content .prize .prizeDetail span{
  margin-right: 10px;
}
.wrapper .content .prize .prizeDetail span:first-child{
  color: rgb(51, 119, 170);
}
.wrapper .content .recent{
  overflow: hidden;
}
.wrapper .content .recent .recentDetail,
.wrapper .content .famous .famousDetail{
  float: left;
  width: 180px;
  height: 300px;
  margin: 0 5px;
}
.wrapper .content .recent .recentDetail img,
.wrapper .content .famous .famousDetail img{
  width: 180px;
  height: 280px;
}
.wrapper .content .recent .recentDetail span,
.wrapper .content .famous .famousDetail span{
  display: block;
  text-align: center;
}
.wrapper .noData{
  font-size: 20px;
  text-align: center;
  margin: 100px;
  color: #666;
}
</style>