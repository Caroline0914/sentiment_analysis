<template>
  <div class="main">
    <div class="top">
      <div class="left">
        <img src="../assets/logo.png" alt="电影可视化系统">
        <div class="sysName">电影可视化系统</div>
      </div>
      <div class="right">
        <div class="welcome">
          你好，{{$store.state.username}}！
        </div>
        <div class="exit"><span @click="handleExit">退出</span></div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <el-menu
            style="height: 100%;border: none;"
            :default-active="$route.meta.key"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            unique-opened="unique-opened"
            @close="handleClose"
            background-color="#444"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <span>电影数据获取</span>
            </template>
            <el-menu-item index="1-1"><router-link :to="($store.state.movieContent.id ? {name: 'MovieContentGrip', params: {id: $store.state.movieContent.id}} : {name: 'MovieContentGrip'})" tag="li">电影简介获取</router-link></el-menu-item>
            <el-menu-item index="1-2"><router-link :to="($store.state.actorContent.id ? {name: 'ActorContentGrip', params: {id: $store.state.actorContent.id}} : {name: 'ActorContentGrip'})" tag="li">演员简介获取</router-link></el-menu-item>
            <el-menu-item index="1-3"><router-link :to="($store.state.movieComment.id ? {name: 'MovieCommentGrip', params: {id: $store.state.movieComment.id}, query: {start: $store.state.start}} : {name: 'MovieCommentGrip'})" tag="li">影评获取</router-link></el-menu-item>
          </el-submenu>
          <el-submenu index="2" v-if="isMag">
            <template slot="title">
              <span>影评信息分析</span>
            </template>
            <el-menu-item index="2-1"><router-link :to="($store.state.useful.movieName ? {name: 'Useful', query: {flag: $store.state.useful.flag, movieName: $store.state.useful.movieName}} : {name: 'Useful'})" tag="li">有用性分析</router-link></el-menu-item>
            <el-menu-item index="2-2"><router-link to="/review/keyWords" tag="li">关键词提取</router-link></el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <span>可视化展示</span>
            </template>
            <el-menu-item index="3-1"><router-link to="/visualization/wordCloud" tag="li">词云图</router-link></el-menu-item>
            <el-menu-item index="3-2"><router-link to="/visualization/sentimentChart" tag="li">情感分析</router-link></el-menu-item>
          </el-submenu>
          <el-menu-item index="4" v-if="!isMag">
            <span><router-link to="/history" tag="li">历史记录</router-link></span>
          </el-menu-item>
          <el-menu-item index="5" v-if="!isMag">
            <span><router-link to="/personal" tag="li">个人中心</router-link></span>
          </el-menu-item>
          <el-menu-item index="6" v-if="isMag">
            <span><router-link to="/userCenter" tag="li">用户中心</router-link></span>
          </el-menu-item>
          <el-menu-item index="7" v-if="!isMag">
            <span><router-link to="/suggestMovie" tag="li">猜你喜欢</router-link></span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import vuex, { mapState, mapMutations } from 'vuex';

  export default {
    name: "Main",
    data() {
      return {
      }
    },
    computed: {
      ...mapState(['username', 'isMag'])
    },
    mounted() {
      console.log(this.username, this.isMag);
    },
    created(){
        //在页面加载时读取sessionStorage里的状态信息
        if (sessionStorage.getItem("store") ) {
            this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
        }

        //在页面刷新时将vuex里的信息保存到sessionStorage里
        window.addEventListener("beforeunload",()=>{
            sessionStorage.setItem("store",JSON.stringify(this.$store.state))
        })
    },
    methods: {
      ...mapMutations(['addUsername']),
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleExit() {//退出删除cookie
        let now = new Date().getTime();
        let expiresTime = new Date(now - 24 * 60 * 60 * 1000);
        document.cookie = `username=${this.username}; expires=${expiresTime}`;
        this.addUsername("");
        this.$router.push('/login');
      }
    }
  }
</script>

<style scoped>
.main{
  position: fixed;
  width: 100%;
  height: 100%;
  font-family: Arial, serif;
}
.main .top{
  position: absolute;
  width: 100%;
  height: 60px;
  background-color: #272727;
  color: #fff;
}
.main .top .left{
  float: left;
  width: 201px;
}
.main .top .left img{
  position: absolute;
  width: 50px;
  left: 15px;
  top: 12px;
}
.main .top .left .sysName{
  position: absolute;
  left: 70px;
  line-height: 60px;
  font-size: 18px;
}
.main .top .right{
  float: right;
  display: flex;
  align-items: center;
  height: 60px;
}
.main .top .right .exit{
  cursor: pointer;
  margin: 0 20px;
}
.main .content{
  height: 100%;
  width: 100%;
  padding-top: 60px;
  box-sizing: border-box;
}
.main .content .left{
  float: left;
  height: 100%;
  width: 206px;
  overflow: auto;
}
.main .content .right{
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}
</style>