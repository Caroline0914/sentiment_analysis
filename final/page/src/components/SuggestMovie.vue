<template>
  <div class="wrapper">
    <div class="movie" v-for="item in recommendMovie">
      <div class="box">
        <div class="img"><img :src="item.image" alt=""></div>
        <div class="content">
          <div class="name">电影：{{item.mName}}</div>
          <div class="director">导演：{{item.director}}</div>
          <div class="author">编剧：{{item.author}}</div>
          <div class="coreActor">主演：{{item.coreActor}}</div>
          <div class="genre">类型：{{item.genre}}</div>
          <div class="country">制片国家/地区：{{item.country}}</div>
          <div class="language">语言：{{item.language}}</div>
          <div class="date">上映时间：{{item.datePublished}}</div>
          <div class="time">片长：{{item.time}}</div>
        </div>
      </div>
      <div class="title">{{item.mName}}剧情简介</div>
      <div class="plot" v-for="ele in item.plot">
        <p>{{ele}}</p>
      </div>
    </div>
    <div class="noData" v-if="!recommendMovie.length">暂无数据</div>
  </div>
</template>

<script>
  import api from '@/api/index';
  import { mapState } from 'vuex';

  export default {
    name: "SuggestMovie",
    mounted() {
      if(this.isMag) {
        this.$router.replace({path: '/notfound'});
      }
      this.getData();
    },
    computed: {
      ...mapState(['username', 'isMag'])
    },
    data() {
      return {
        recommendMovie: []
      }
    },
    methods: {
      getData() {
        api.getRecommendMovie({
          username: this.username
        }).then(res => {
          let data = res.data;
          typeof data == "object" && data.forEach(ele => {
            let obj = {};
            obj.mName = ele.mName;
            obj.image = 'https://images.weserv.nl/?url=' + ele.image.substring(7);
            obj.director = ele.director.split(';').join('/').replace(/\/$/, '');
            obj.author = ele.author.split(';').join('/').replace(/\/$/, '');
            obj.coreActor = ele.coreActor.split(';').join('/').replace(/\/$/, '');
            obj.genre = ele.mType.split(';').join('/').replace(/\/$/, '');
            obj.language = ele.language;
            obj.time = ele.mTime;
            obj.country = ele.country;
            obj.datePublished = ele.mDate;
            obj.plot = ele.plot.split('a\ta');
            this.recommendMovie.push(obj);
          });
        }, err => {
            console.log(err);
        })
      }
    }
  }
</script>

<style scoped>
  .wrapper{
    padding: 10px;
    font-size: 14px;
  }
  .wrapper .movie{
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 5px;
    margin-bottom: 5px;
  }
  .wrapper .movie .box{
    height: 150px;
    display: flex;
  }
  .wrapper .movie .box .img{
    width: 150px;
    height: 150px;
  }
  .wrapper .movie .box .img img{
    height: 150px;
  }
  .wrapper .movie .box .content{
    height: 150px;
    margin-left: 5px;
    width: 930px;
  }
  .wrapper .movie .box .content div{
    overflow: hidden;
    height: 16px;
    line-height: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .wrapper .movie .title{
    font-size: 16px;
    color: #007722;
    margin: 5px 0;
  }
  .wrapper .movie .plot{

  }
  .wrapper .movie .plot p{
    text-indent: 2em;
  }
  .wrapper .noData{
    font-size: 20px;
    margin: 100px auto;
    width: 100px;
  }
</style>