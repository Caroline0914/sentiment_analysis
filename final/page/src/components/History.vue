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
        history: []
      }
    },
    computed: {
      ...mapState(['username', 'isMag'])
    },
    mounted() {
      if(this.isMag) {
        this.$router.replace({path: '/notfound'});
      }
      api.getSearchWord({
        username: this.username
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
    methods: {
      handleDelete(index, row) {
        api.deleteHistory({
          username: this.username,
          searchTime: row.time
        }).then(res => {
            console.log(res);
        }, err => {
            console.log(err);
        });
        this.history.splice(index, 1);
      }
    }
  }
</script>

<style scoped>
.wrapper{
  margin: 20px;
}
</style>