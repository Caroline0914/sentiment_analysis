<template>
  <div class="box">
    <div class="search">
      <input v-model="inp" :placeholder="place" class="inp" @input="handleInput"></input>
      <el-button type="primary" round @click="handleClick" class="btn">开始爬取</el-button>
    </div>
    <ul v-show="suggests.length && flag" class="sugList">
      <li v-for="item in suggests" @click="getItem(item)">{{item}}</li>
    </ul>
  </div>
</template>

<script>
  import vuex, { mapState } from 'vuex';
  import $ from 'jquery';
  import api from '@/api/index';

  export default {
    name: "inputCmp",
    props: ['place', 'startGrip'],
    data() {
      return {
        inp: '',
        suggests: [],
        flag: true
      }
    },
    computed: {
      ...mapState(['username'])
    },
    mounted() {
      document.onkeydown = (e) => {
        let flag = this.inp;
        if ((document.activeElement.tagName == "INPUT" || flag) && e.key == "Enter") {
          this.handleClick();
        }
      };
      window.addEventListener('click', (e) => {
        if(!(e.target.className == 'inp' || e.target.className == 'sugList')){
          this.flag = false;
        }
      })
    },
    methods: {
      handleClick() {
        if(this.inp) {
          this.$emit('startGrip', this.inp);
          api.setHistory({
            username: this.username,
            word: this.inp
          }).then(res => {
            console.log(res);
          }, err => {
            console.log(err);
          })
        }
      },
      handleInput(e) {
        this.flag = true;
        this.getData(this.inp);
      },
      getData(value) {
        if(value) {
          $.ajax({
            type: 'GET',
            url: 'http://video.360kan.com/suggest.php',
            data: `kw=${value}&fmt=jsonp&ac=richsug`,
            dataType: 'jsonp',
            success: (res) => {
              let arr = [];
              res.data && res.data.suglist.forEach(item => arr.push(item.word));
              this.suggests = arr;
            },
            jsonp: 'cb',
          })
        }
      },
      getItem(val) {
        this.inp = val;
        this.suggests = [];
      },
      handleScroll() {
          console.log(1)
      }
    }
  }
</script>

<style scoped>
  .box{
    position: relative;
  }
  .search{
    width: 520px;
    height: 40px;
    margin-top: 10px;
    margin-left: 250px;
    border: 1px solid #555;
    border-radius: 20px;
    overflow: hidden;
  }
  .search .inp{
    width: 400px;
    margin-left: 20px;
    border: none;
    outline: none;
    height: 38px;
  }
  .search .btn{
    display: inline-block;
    width: 100px;
    height: 40px;
    border-radius: 0px;
    background-color: #555;
    border-color: #555;
  }
  .box ul{
    position: absolute;
    margin-left: 250px;
    width: 420px;
    border: 1px solid #eee;
    background-color: #fff;
    z-index: 1;
  }
  .box ul li{
    cursor: pointer;
    height: 15px;
    padding: 3px;
  }
  .box ul li:hover{
    background-color: #eee;
  }
</style>