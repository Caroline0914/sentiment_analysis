<template>
  <div class="wrapper">
    <InputCmp place="请输入电影名" @startGrip="gripMovieComment"/>
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
      <div class="bottom">
        <div class="up">
          <img src="../../assets/up.png">
          {{item.upNum}}
        </div>
        <div class="down">
          <img src="../../assets/down.png">
          {{item.downNum}}
        </div>
        <div class="recall">{{item.recallNum}}回应</div>
      </div>
    </div>
    <template v-if="movieComment.comment.length">
      <button @click="handleClick('prev')">上一页</button>
      <button @click="handleClick('next')">下一页</button>
    </template>
  </div>
</template>

<script>
  import InputCmp from './component/inputCmp';
  import {mapState, mapMutations, mapActions} from 'vuex';

  export default {
    name: "MovieComment",
    components: {
      InputCmp
    },
    data() {
      return {
      }
    },
    mounted(){
      if(this.$route.query.start && this.startIndex != this.$route.query.start) {
          this.setStart(this.$route.query.start);
      }
      if(this.$route.params.id) {
        this.$store.dispatch('gripMovieComment', {inp: '', id: this.$route.params.id, start: this.$route.query.start, fn: () => {
          this.$router.push(`/dataGrip/movieCommentGrip/${this.movieComment.id}?start=${this.$route.query.start}`)
        } });
      }
    },
    computed: {
      ...mapState(['movieComment', "startIndex", 'max'])
    },
    methods: {
      ...mapMutations(['handlePage', 'setStart']),
      gripMovieComment(inp) {
        this.$store.dispatch('gripMovieComment', {inp: inp, id: '', start: -1, fn: () => {
          this.$router.push(`/dataGrip/movieCommentGrip/${this.movieComment.id}?start=${this.startIndex}`)
        } });
      },
      handleClick(flag) {
        this.handlePage(flag);
        this.$store.dispatch('gripMovieComment', {inp: '', id: this.movieComment.id, start: this.startIndex, fn: () => {
          this.$router.push(`/dataGrip/movieCommentGrip/${this.movieComment.id}?start=${this.startIndex}`)
        } });
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
.wrapper .content .bottom{
  display: flex;
  margin-top: 5px;
  color: #37a;
}
.wrapper .content .bottom .up,
.wrapper .content .bottom .down{
  background-color: #f0f7f9;
  margin-right: 10px;
  padding: 3px;
}
.wrapper .content .bottom img{
  width: 14px;
  vertical-align: -1px;
}
.wrapper .content .bottom .recall{
  margin-top: 3px;
}
.wrapper button{
  margin: 20px;
  cursor: pointer;
  border-radius: 3px;
  border-style: none;
  padding: 3px;
  border: 1px solid #37a;
  outline: none;
}
</style>
