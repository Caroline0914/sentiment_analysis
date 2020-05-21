<template>
  <div class="wrapper">
    <el-row class="wrapper">
      <el-col :span="10">
        <div class="title">影评</div>
        <textarea class="comment" v-model="content" readonly></textarea>
      </el-col>
      <el-col :span="3" class="btns">
        <el-button type="primary" round @click="refresh">更新影评</el-button>
        <el-button type="primary" round @click="save">保存分词</el-button>
      </el-col>
      <el-col :span="11">
        <div class="title">关键词</div>
        <div class="box">
          <div v-for="(item, i) in allWord" class="items">
            <span class="word">{{ item }}</span>
            <i class="el-icon-close" @click="deleteWord(i)"></i>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from '@/api/index';
  import axios from 'axios';

  export default {
    name: "KeyWords",
    data() {
      return {
        content: '',
        commentId: '',
        mName: '',
        cName: '',
        cTime: '',
        allWord: []
      }
    },
    mounted() {
      if(this.isMag) {
        this.$router.replace({path: '/notfound'});
      }
      this.refresh();
    },
    methods: {
      refresh() {
        api.getRandomCommentAndwords().then(res => {
          this.commentId = res.data.commentId;
          this.allWord = [...res.data.words];
          this.mName = res.data.mName;
          this.cName = res.data.cName;
          this.cTime = res.data.cTime;
          this.content = res.data.content.split('a\ta').join('\n');
        }, err => {
          console.log(err);
        })
      },
      save() {
          axios.post('http://127.0.0.1:8000/api/setWord', {
              id: this.commentId,
              mName: this.mName,
              cName: this.cName,
              cTime: this.cTime,
              allWord: this.allWord
          }).then(res => {
              console.log(res);
          }, err => {
              console.log(err);
          })
        // api.setWord({
        //   id: this.commentId,
        //   mName: this.mName,
        //   cName: this.cName,
        //   cTime: this.cTime,
        //   allWord: this.allWord
        // }).then(res => {
        //   console.log(res);
        // }, err => {
        //   console.log(err);
        // })
      },
      deleteWord(i) {
        this.allWord.splice(i, 1);
      }
    }
  }
</script>

<style scoped>
  .wrapper{
    font-size: 14px;
    height: 100%;
  }
  .wrapper .title{
    text-align: center;
    font-size: 18px;
    font-weight: bolder;
    margin-top: 10px;
  }
  .wrapper .comment,
  .wrapper .box{
    margin: 10px 20px;
    width: 400px;
    height: 450px;
    resize: none;
    padding: 5px;
    outline: none;
  }
  .wrapper .btns{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .wrapper .btns button{
    width: 120px;
    margin: 20px auto;
  }
  .wrapper .box{
    border: 1px solid #999;
    overflow-y: auto;
  }
  .wrapper .box .items{
    float: left;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 5px;
    margin: 0 3px;
  }
  .wrapper .box .items .word{
    margin-right: 5px;
  }
  .wrapper .box .el-icon-close{
    border: 1px solid transparent;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
  }
  .wrapper .box .el-icon-close:hover{
    background-color: #f40;
    color: #fff;
  }
</style>