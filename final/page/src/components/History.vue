<template>
  <div class="wrapper">
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
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import api from '@/api/index';
  import { mapState } from 'vuex';

  export default {
    name: "History",
    data () {
      return {
        history: [{
          word: '',
          time: ''
        }]
      }
    },
    computed: {
      ...mapState(['username'])
    },
    mounted() {
      api.getSearchWord({
        username: this.username
      }).then(res => {
        console.log(res);
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
    methods: {
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
  }
</script>

<style scoped>
.wrapper{
  margin: 20px;
}
</style>