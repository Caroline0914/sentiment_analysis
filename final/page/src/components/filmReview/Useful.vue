<template>
  <div class="wrapper">
    <input-cmp place="请输入电影名" @startGrip="start"/>
    <div class="content" v-for="(item, i) in movieComment.comment">
      <div class="top">
        <div class="name">{{item.cName}}</div>
        <div class="grade">{{item.grade}}</div>
        <div class="time">{{item.time}}</div>
      </div>
      <div class="title">{{item.title}}</div>
      <div class="comment" v-for="ele in item.content">
        <p>{{ele}}</p>
      </div>
    </div>
    <template v-if="movieComment.comment.length">
      <button @click="handleClick('prev')">上一条</button>
      <button @click="handleClick('next')">下一条</button>
    </template>
    <div class="noData" v-if="!movieComment.comment.length">暂无数据</div>
  </div>
</template>

<script>
  import InputCmp from '../grip/component/inputCmp';
  import api from '@/api/index';
  import { mapState, mapMutations } from 'vuex';

  export default {
    name: "Useful",
    components: {
      InputCmp
    },
    data() {
      return {
        movieComment: {
          movieName: '',
          flag: 1,
          comment: []
        }
      }
    },
    computed: {
      ...mapState(['useful'])
    },
    mounted() {
      if(this.isMag) {
        this.$router.replace({path: '/notfound'});
      }
      if(this.$route.query.movieName) {
        this.getData(this.$route.query.movieName, this.$route.query.flag);
      }
    },
    watch: {
      //监听路由中的query字段
      $route(to, from) {
        if(to.query.movieName != from.query.movieName || to.query.flag != from.query.flag) {
          this.getData(to.query.movieName, to.query.flag);
        }
      }
    },
    methods: {
      ...mapMutations(['setMovieName', 'setFlag']),
      start(inp) {
        this.getData(inp, 1);
        this.setMovieName(inp);
      },
      getData(mName, flag) {
        api.getCommentByFlag({
          mName,
          flag
        }).then(res => {
          this.movieComment.movieName = mName;
          this.movieComment.flag = +flag;
          this.movieComment.comment = [];
          res.data.forEach(item => {
            this.movieComment.comment.push({
              cName: item.cName,
              grade: item.grade,
              time: item.cTime,
              title: item.cTitle,
              content: item.content.split('a\ta')
            })
          });
          this.$router.push(`/review/useful?movieName=${mName}&flag=${flag}`);
        }, err => {
          console.log(err);
        })
      },
      handleClick(way){
        if(way == 'next'){
          this.movieComment.flag += 1;
          // this.setFlag(this.movieContent.flag);
          this.getData(this.movieComment.movieName, this.movieComment.flag);
        } else if(way == 'prev') {
          this.movieComment.flag -= 1;
          // this.setFlag(this.movieComment.flag);
          this.getData(this.movieComment.movieName, this.movieComment.flag);
        }
      }
    }
  }
</script>

<style scoped>
  .wrapper{
    font-size: 14px;
  }
  .wrapper .content{
    margin: 10px;
  }
  .wrapper .content .top{
    display: flex;
    margin-bottom: 5px;
  }
  .wrapper .content .top div{
    margin-right: 5px;
  }
  .wrapper .content .top div.name{
    color: #37a;
  }
  .wrapper .content .title{
    font-weight: bold;
    margin-bottom: 5px;
    color: #37a;
  }
  .wrapper .content .comment{
    text-indent: 2em;
  }
  .wrapper button{
    margin: 20px;
    cursor: pointer;
    border-radius: 3px;
    padding: 3px;
    color: #fff;
    background-color: #37a;
    border: 1px solid #37a;
    outline: none;
  }
  .wrapper .noData{
    font-size: 20px;
    text-align: center;
    margin: 100px;
    color: #666;
  }
</style>