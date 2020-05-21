import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: '',
    isMag: 0,
    movieContent: {//电影相关信息集合
      id: '',
      name: '',
      image: '',
      director: [],
      author:[],
      actor: [],
      type: [],
      country: '',
      language: '',
      datePublished: '',
      mTime: '',
      plot: [],
      prize: [],
      hasContent: false
    },
    actorContent: {//演员相关信息集合
      id: '',
      actName: '',
      actImage: '',
      actSex: '',
      constellation: '',
      birthday: '',
      birthplace: '',
      job: '',
      introduction: [],
      honor: [],
      recentProd: [],
      famousProd: [],
      hasContent: false
    },
    movieComment: {//电影影评
      id: '',
      comment: [],
      hasContent: false
    },
    //影评信息
    max: 1,
    startIndex: 0,
    //有用性
    useful: {
      flag: 1,
      movieName: ''
    }
  },
  mutations: {
    addUsername(state, username){
      state.username = username;
    },
    addMag(state, isMag){
      state.isMag = isMag;
    },
    handlePage(state, flag){
      if(flag == "prev" && state.startIndex >= state.max){
        state.startIndex = Math.floor( state.startIndex / state.max ) * state.max - state.max;
      } else if(flag == "next") {
        state.startIndex = Math.floor( state.startIndex / state.max ) * state.max + state.max;
      }
    },
    setStart(state, newStart) {
      state.startIndex = newStart;
    },
    setFlag(state, flag) {
      state.useful.flag = flag;
    },
    setMovieName(state, movieName) {
      state.useful.movieName = movieName;
    },
    setMovieContent(state, content) {
      state.movieContent.hasContent = true;
      state.movieContent.id = content.id;
      state.movieContent.name = content.name;
      state.movieContent.image = 'https://images.weserv.nl/?url=' + content.image.substring(7);
      state.movieContent.country = content.country;
      state.movieContent.mTime = content.mTime;
      state.movieContent.language = content.language;
      state.movieContent.prize = content.prize;
      state.movieContent.plot = content.plot;
      state.movieContent.datePublished = content.datePublished;
      state.movieContent.type = content.genre;
      state.movieContent.director = content.director.map(ele => {
        return ele.name.split(' ')[0];
      });
      state.movieContent.author = content.author.map(ele => {
        return ele.name.split(' ')[0];
      });
      state.movieContent.actor = content.actor.map(ele => {
        return ele.name.split(' ')[0];
      });
    },
    setActorContent(state, data) {
      state.actorContent.hasContent = true;
      state.actorContent.id = data.id;
      state.actorContent.actName = data.actName;
      state.actorContent.actImage = 'https://images.weserv.nl/?url=' + data.actImage.substring(7);
      state.actorContent.actSex = data.actSex;
      state.actorContent.birthday = data.birthday;
      state.actorContent.birthplace = data.birthplace;
      state.actorContent.constellation = data.constellation;
      state.actorContent.job = data.job;
      state.actorContent.introduction = data.introduction;
      state.actorContent.honor = data.honor;
      state.actorContent.famousProd = data.famousProd;
      state.actorContent.recentProd = data.recentProd;
    },
    setMovieComment(state, data) {
      state.movieComment.hasContent = true;
      state.movieComment.id = data.id;
      // state.movieComment.comment = state.movieComment.comment ? state.movieComment.comment : [];
      state.movieComment.comment = [];
      data.allContent.forEach((item, i) => {
        // state.movieComment.comment = [...state.movieComment.comment];
        // state.movieComment.comment[state.startIndex + i] = item;
        state.movieComment.comment.push(item);
      });
    }
  },
  actions: {
    gripMovieContent({commit}, {inp, id, fn}) {
      if(inp || id) {
        api.setMovieContent({
          "movieName": inp,
          "id": id
        }).then(res => {
          if(res.data == "noData"){
            this.state.movieContent.hasContent = false;
            this.state.movieContent.name = '';
            fn();
          } else {
            commit('setMovieContent', res.data);
            fn();
            if(inp){
              api.setHistory({
                username: this.state.username,
                word: this.state.movieContent.name,
                flag: 1
              }).then(res => {
                console.log(res);
              }, err => {
                console.log(err);
              })
            }
          }
        }).catch(err => {
          console.log(err);
          this.state.movieContent.hasContent = false;
          this.state.movieContent.name = '';
        })
      } else {
        this.state.movieContent.hasContent = false;
        this.state.movieContent.name = '';
      }
    },
    gripActorContent({commit}, {inp, id, fn}) {
      if(inp || id) {
        api.setActorContent({
          "actName": inp,
          "id": id
        }).then(res => {
          if(res.data == 'noData') {
            this.state.actorContent.hasContent = false;
            this.state.actorContent.actName = '';
            fn();
          } else {
            commit('setActorContent', res.data);
            fn();
            if(inp){
              api.setHistory({
                username: this.state.username,
                word: this.state.actorContent.actName,
                flag: 2
              }).then(res => {
                console.log(res);
              }, err => {
                console.log(err);
              })
            }
          }
        }).catch(err => {
          console.log(err);
          this.state.actorContent.hasContent = false;
          this.state.actorContent.actName = '';
        })
      } else {
        this.state.actorContent.hasContent = false;
        this.state.actorContent.actName = '';
      }
    },
    gripMovieComment({commit}, {inp, id, start, fn}) {
      if(inp || id || start) {
        api.setComment({
          mName: inp,
          id: id,
          start: start > 0 ? this.state.startIndex : 0
        }).then(res => {
          if(res.data == 'noData') {
            this.state.movieComment.hasContent = false;
            this.state.movieComment.movieName = '';
            fn();
          } else {
            commit('setMovieComment', res.data);
            fn();
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
        this.state.movieComment.hasContent = false;
        this.state.movieComment.movieName = '';
      }
    }
  },
  modules: {
  }
})
