<template>
  <div class="wrapper">
    <el-table
            :data="allUsers"
            border
            style="width: 100%">
      <el-table-column
              label="用户名"
              prop="username"
              align="center">
      </el-table-column>
      <el-table-column
              label="性别"
              prop="sex"
              align="center">
      </el-table-column>
      <el-table-column
              label="手机"
              prop="phone"
              align="center">
      </el-table-column>
      <el-table-column
              label="邮箱"
              prop="email"
              align="center">
      </el-table-column>
      <el-table-column
              label="身份证号"
              prop="userId"
              align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="历史记录" align="center">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  @click="handleHistory(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="用户编辑" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
      <el-form :model="userInfo" ref="checkInfo">
        <el-form-item
                prop="username"
                label="用户名"
                :label-width="formLabelWidth">
          <el-input v-model="userInfo.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="userInfo.sex">
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
                }"
                :label-width="formLabelWidth">
          <el-input v-model="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item
                prop="email"
                label="绑定邮箱"
                :rules = "{
                  type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']
                }"
                :label-width="formLabelWidth">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item
                prop="userId"
                label="身份证号"
                :rules="{
                  validator: checkId,
                  trigger: ['blur', 'change']
                }"
                :label-width="formLabelWidth">
          <el-input v-model="userInfo.userId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('checkInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="历史记录" :visible.sync="dialogTableVisible" :modal-append-to-body="false">
      <el-table
              :data="history"
              border
              style="width: 100%">
        <el-table-column
                label="搜索词"
                prop="word"
                align="center">
        </el-table-column>
        <el-table-column
                label="时间"
                prop="time"
                align="center">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/api/index';

  export default {
    name: "UserCenter",
      data() {
        return {
          allUsers: [],
          userInfo: {
            username: '',
            sex: '',
            phone: '',
            email: '',
            userId: ''
          },
          dialogFormVisible: false,
          dialogTableVisible: false,
          formLabelWidth: '120px',
          curIndex: 0,
          history: []
        }
      },
      mounted() {
        if(this.isMag) {
          this.$router.replace({path: '/notfound'});
        }
        this.getAllUsers();
      },
      methods: {
        handleEdit(index, row) {
          this.curIndex = index;
          this.userInfo = {...row};
          this.dialogFormVisible = true;
        },
        handleDelete(index, row) {
          api.deleteUser({
            username: row.username
          }).then(res => {
            if(res.data == 'success'){
              this.allUsers.splice(index, 1);
            }
          }, err => {
            console.log(err);
          });
        },
        handleSubmit(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.dialogFormVisible = false;
              api.updateUser(this.userInfo).then(res => {
                console.log(res);
              }, err => {
                console.log(err);
              });
              this.allUsers.splice(this.curIndex, 1, this.userInfo);
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        getAllUsers() {
          api.getAllUsers().then(res => {
            this.allUsers = res.data.map(item => {
              return {
                ...item,
                sex: item.sex == 0 ? '男' : item.sex == 1 ? '女' : ''
              }
            });
          }, err => {
            console.log(err);
          })
        },
        handleHistory(index, row) {
          this.dialogTableVisible = true;
          api.getSearchWord({
            username: row.username
          }).then(res => {
            this.history = [];
            res.data.forEach(item => {
              this.history.push({
                word: item.searchWord,
                time: item.searchTime
              })
            })
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
        }
      }
  }
</script>

<style scoped>
.wrapper{
  margin: 10px;
}
</style>