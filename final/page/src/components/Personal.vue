<template>
  <div class="wrapper">
    <el-form :label-position="labelPosition" ref="dynamicValidateForm" label-width="70px" :model="userInfo">
      <el-form-item
              prop="username"
              label="用户名">
        <el-input v-model="userInfo.username" class="inp" ref="onInput" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="userInfo.sex" :disabled="flag">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
              prop="phone"
              label="绑定手机"
              :rules="{
                validator: checkPhone,
                trigger: ['blur', 'change']
              }">
        <el-input v-model="userInfo.phone" class="inp" ref="onInput" :disabled="flag"></el-input>
      </el-form-item>
      <el-form-item
              prop="email"
              label="绑定邮箱"
              :rules = "{
                type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']
              }">
        <el-input v-model="userInfo.email" class="inp" ref="onInput" :disabled="flag"></el-input>
      </el-form-item>
      <el-form-item
              prop="userId"
              label="身份证号"
              :rules="{
                validator: checkId,
                trigger: ['blur', 'change']
              }">
        <el-input v-model="userInfo.userId" class="inp" ref="onInput" :disabled="flag"></el-input>
      </el-form-item>
      <el-button type="primary" round @click="edit">编辑</el-button>
      <el-button type="primary" round @click="complete('dynamicValidateForm')">完成</el-button>
    </el-form>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import api from '@/api/index';

  export default {
    name: "Personal",
    data() {
      return {
        labelPosition: 'right',
        flag: true,
        userInfo: {
          username: '',
          sex: '',
          phone: '',
          email: '',
          userId: ''
        }
      }
    },
    computed: {
      ...mapState(['username', 'isMag'])
    },
    mounted() {
      if(this.isMag) {
        this.$router.replace({path: '/notfound'});
      }
      this.getUserInfo();
    },
    methods: {
      edit() {
        this.flag = false;
      },
      complete(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.flag = true;
            api.updateUser(this.userInfo).then(res => {
              console.log(res);
            }, err => {
              console.log(err);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getUserInfo() {
        api.getUserInfo({
          username: this.username
        }).then(res => {
          this.userInfo = {
            ...res.data[0],
            sex: res.data[0].sex == 0 ? '男' : res.data[0].sex == 1 ? '女' : ''
          };
        }, err => {
          console.log(err);
        })
      },
      checkPhone(rule, value, callback) {
        if(value == ''){
          callback(new Error('请输入手机号'));
        } else if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
          callback('请输入正确的手机号')
        } else {
          callback()
        }
      },
      checkId(rule, value, callback) {
        if(value != '' && value != null) {
          if(!this.checkIDCard(value)){
            callback('请输入正确的身份证号');
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      checkIDCard(idcode) {
        // 加权因子
        let weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        // 校验码
        let check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        let code = idcode + "";
        let last = idcode[17];//最后一位
        let seventeen = code.substring(0, 17);
        // 判断最后一位校验码是否正确
        let arr = seventeen.split("");
        let len = arr.length;
        let num = 0;
        for (let i = 0; i < len; i++) {
            num = num + arr[i] * weight_factor[i];
        }
        // 获取余数
        let resisue = num % 11;
        let last_no = check_code[resisue];
        /*
          第一位不可能是0
          第二位到第六位可以是0-9
          第七位到第十位是年份，所以七八位为19或者20
          十一位和十二位是月份，这两位是01-12之间的数值
          十三位和十四位是日期，是从01-31之间的数值
          十五，十六，十七都是数字0-9
          十八位可能是数字0-9，也可能是X
        */
        let idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
        // 判断格式是否正确
        let format = idcard_patter.test(idcode);
        // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
        return last === last_no && format ? true : false;
      },
    }
  }
</script>

<style scoped>
.wrapper {
  width: 400px;
  margin: 50px;
}
</style>