<template>
  <div class="register">
    <div class="head">
      <span>注册系统账号</span>
      <div>
        我已注册，现在就
        <a href="/login">登录</a>
      </div>
    </div>
    <div class="underline">
      <img src="https://passport.baidu.com/static/passpc-account/img/reg/reg_hr.png">
    </div>
    <div class="wrapper">
      <el-form :label-position="labelPosition" label-width="70px" :model="userMsg">
        <el-form-item label="用户名">
          <el-input v-model="userMsg.username" class="inp" placeholder="请输入用户名"
            @focus="() => {clickUserMsg.username = false; checkUser = false}" ref="onInput"
            @blur="checkHasUser"></el-input>
          <i class="el-icon-error" v-if="userMsg.username =='' && clickUserMsg.username">请输入用户名</i>
          <i class="el-icon-error" v-else-if="userMsg.username !='' && checkUser">该用户名已被使用</i>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="userMsg.password" class="inp" placeholder="请输入密码" @focus="() => {clickUserMsg.password = false}"></el-input>
          <i class="el-icon-error" v-if="userMsg.password == '' && clickUserMsg.password">请输入密码</i>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="checkPassword" class="inp" placeholder="请输入密码" @focus="() => {clickUserMsg.checkPassword = false}"></el-input>
          <i class="el-icon-error" v-if="checkPassword == '' && clickUserMsg.checkPassword">请输入确认密码</i>
          <i class="el-icon-error" v-else-if="checkPassword != '' && userMsg.password != '' && checkPassword != userMsg.password">两次密码输入不一致</i>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userMsg.phone" class="inp" placeholder="请输入手机号" @focus="() => {clickUserMsg.phone = false; checkPhone = false}" @blur="() => {checkPhone = true}"></el-input>
          <i class="el-icon-error" v-if="userMsg.phone == '' && clickUserMsg.phone">请输入手机号</i>
          <i class="el-icon-error" v-else-if="!/^[1][3,4,5,7,8][0-9]{9}$/.test(userMsg.phone) && userMsg.phone != '' && checkPhone">手机号格式不正确</i>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit" @click="handleClick">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import api from '@/api/index';

export default {
    name: "Register",
    mounted() {
      this.$refs.onInput.focus();
      document.onkeydown = (e) => {
        let flag = this.userMsg.username || this.userMsg.password || this.userMsg.phone || this.checkPassword;
        if ((document.activeElement.tagName == "INPUT" || flag) && e.key == "Enter") {
          this.handleClick();
        }
      }
    },
    watch: {
      'userMsg.phone'(newValue) {
        this.userMsg.phone = newValue.replace(/\D/g, '').slice(0, 11);
      }
    },
    data() {
      return {
        labelPosition: 'right',
        checkPassword: '',//确认密码
        checkPhone: false,//判断是否验证手机号
        checkUser: false,//判断用户名是否已经被使用
        userMsg: {//表单用户名，密码和手机号
          username: '',
          password: '',
          phone: ''
        },
        clickUserMsg: {//记录是否是提交点击状态
          username: false,
          password: false,
          checkPassword: false,
          phone: false
        }
      }
    },
    methods: {
      handleClick: function () {
        this.clickUserMsg = {//改变输入框点击状态
          username: true,
          password: true,
          checkPassword: true,
          phone: true
        };
        let flag = false;//记录是否有提示信息
        let domList = document.getElementsByClassName('el-icon-error');
        this.$nextTick(() => {
          flag = domList.length;
          if(!flag) {
            axios.post('http://127.0.0.1:8000/api/doRegister', JSON.stringify(this.userMsg))
              .then(res => {
                if(res.data === "success") {
                  this.$router.push({path: '/login'});
                }
              })
              .catch(err => {
                console.log(err);
              })
          }
        })
      },
      checkHasUser: function () {
        if(this.userMsg.username != ''){
          api.checkHasUser({
              username: this.userMsg.username
          }).then(res => {
            if(res.data == "fail") {
              this.checkUser = true;
            }
          }).catch(err => {
            console.log(err);
          })
        }
      }
    }
}
</script>

<style scoped>
  .head{
    position: relative;
    width: 900px;
    margin: 50px auto 10px;
    color: #424242;
  }
  .head span{
    font-size: 20px;
    font-family: Arial;
  }
  .head div{
    position: absolute;
    top: 5px;
    right: 0;
    color: #666;
    font-family: Tahoma, Helvetica, "Microsoft Yahei", 微软雅黑, Arial, STHeiti;
    font-size: 12px;
  }
  .head div a{
    border: 1px solid #ddd;
    background: #eee;
    padding: 5px 15px;
    cursor: pointer;
    text-decoration: none;
    border-radius: 5px;
  }
  .underline{
    display: flex;
    justify-content: center;
  }
  .underline img{
  }
  .wrapper{
    position: relative;
    margin: 50px 200px;
    font-family: Arial;
  }
  .wrapper .inp{
    width: 300px;
  }
  .wrapper i{
    margin-left: 5px;
    color: red;
  }
  .wrapper .submit{
    width: 300px;
  }
</style>