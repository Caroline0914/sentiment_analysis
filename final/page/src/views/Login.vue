<template>
  <div class="home">
    <div class="wrapper">
      <el-form :label-position="labelPosition" label-width="70px" :model="userMsg">
        <h2>用户登录</h2>
        <el-form-item label="用户名">
          <el-input v-model="userMsg.username" class="inp" placeholder="请输入用户名" ref="onInput"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="userMsg.password" class="inp" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="checkInp" class="checkInp" placeholder="请输入验证码"></el-input>
          <div class="checkContent">
            <canvas class="canvas" width="100" height="40" ref="canvas" @click="draw"></canvas>
          </div>
        </el-form-item>
        <el-form-item >
          <el-checkbox v-model="autoLogin">下次自动登录</el-checkbox>
          <el-link href="/register" :underline="false" class="toRegister">立即注册</el-link>
        </el-form-item>
        <el-form-item class="checkError" v-if="errorContent != ''">
          <i class="el-icon-remove">{{errorContent}}</i>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit" @click="handleClick">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import api from "@/api/index";
import { mapState, mapMutations } from 'vuex';


export default {
  components: {
  },
  mounted() {
    this.draw();
    this.$refs.onInput.focus();
    document.onkeydown = (e) => {
      let flag = this.userMsg.username || this.userMsg.password || this.userMsg.checkInp;
      if((document.activeElement.tagName == "INPUT" || flag) && e.key == "Enter") {
        this.handleClick();
      }
    }
  },
  data() {
    return {
      labelPosition: 'right',
      autoLogin: true,//记录是否选择下次自动登陆
      errorContent: '',//错误信息内容
      checkInp: '',//验证码
      userMsg: {//表单用户名和密码
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapState(['username'])
  },
  methods: {
    ...mapMutations(['addUsername']),
    /**
     * 提交表单
     */
    handleClick: function () {
      //输入框有空，不能提交
      if(this.userMsg.username == ""){
        this.errorContent = '请输入用户名';
        return;
      } else if(this.userMsg.password == ""){
        this.errorContent = '请输入密码';
        return;
      } else if(this.checkInp == ""){
        this.errorContent = '请输入验证码';
        return;
      }
      axios.all([
        axios.post('http://127.0.0.1:8000/api/doLogin', JSON.stringify(this.userMsg)),//提交用户名和密码
        axios.post('http://127.0.0.1:8000/api/checkVerificationCode', {verificationCode: this.checkInp})//提交验证码
      ]).then(axios.spread((loginResp, veificResp) => {
        if(loginResp.data == 'success' && veificResp.data == "success"){
          this.addUsername(this.userMsg.username);
          // login success
          //设置cookie，时间为1天
          console.log(this.username);
          let now = new Date().getTime();
          let expiresTime = new Date(now + 24 * 60 * 60 * 1000);
          document.cookie = `username=${this.userMsg.username}; expires=${expiresTime}`;
          this.$router.push('/dataGrip/movieContentGrip');
        } else if(loginResp.data == 'fail') {
          // login fail
          this.errorContent = '用户名或密码错误，请重新输入';
        } else if(veificResp.data == "fail"){
          this.errorContent = "验证码错误，请重新输入";
        }
      })).catch(err => {
        console.log(err);
      })
    },
    /**
     * 获取随机颜色，用于canvas验证码
     */
    randomColor: function () {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      return "rgb(" + r + "," + g + "," + b + ")";
    },
    /**
     * canvas画验证码
     */
    draw: function () {
      let canvas = this.$refs.canvas;
      let canvas_width = canvas.width;
      let canvas_height = canvas.height;
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas_width, canvas_height);
      api.getVerificationCode().then(res => {
        let verificationCode = res.data.split('');
        verificationCode.forEach((ele, item) => {
          let deg = Math.random() - 0.5; //产生一个随机弧度
          let x = 10 + item * 20;//文字在canvas上的x坐标
          let y = 20 + Math.random() * 8;//文字在canvas上的y坐标
          context.font = "bold 23px 微软雅黑";
          context.translate(x, y);
          context.rotate(deg);
          context.fillStyle = this.randomColor();
          context.fillText(ele, 0, 0);
          context.rotate(-deg);
          context.translate(-x, -y);
        })
      })
      .catch(err => {
          console.log(err);
      });
      for (let i = 0; i <= 5; i++) { //验证码上显示线条
        context.strokeStyle = this.randomColor();
        context.beginPath();
        context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.stroke();
      }
      for (let i = 0; i <= 30; i++) { //验证码上显示小点
        context.strokeStyle = this.randomColor();
        context.beginPath();
        let x = Math.random() * canvas_width;
        let y = Math.random() * canvas_height;
        context.moveTo(x, y);
        context.lineTo(x + 1, y + 1);
        context.stroke();
      }
    }
  }
}
</script>

<style scoped>
  .wrapper{
    width: 500px;
    height: 400px;
    margin: 100px auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    font-family: Arial;
  }
  .wrapper h2{
    margin-top: 20px;
    color: #424242;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
  .wrapper .inp{
    width: 300px;
  }
  .wrapper .checkInp{
    width: 180px;
  }
  .wrapper .checkContent{
    margin-left: 10px;
    width: 100px;
    height: 40px;
    display: inline-block;
  }
  .wrapper .checkContent .canvas{
    border: 1px solid #ddd;
    vertical-align: bottom;
    cursor: pointer;
  }
  .wrapper .toRegister{
    position: absolute;
    right: 0;
  }
  .wrapper .checkError{
    position: absolute;
    margin-top: -35px;
    color: red;
  }
  .wrapper .submit{
    width: 100%;
  }
</style>
