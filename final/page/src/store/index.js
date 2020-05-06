import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: 'panda',
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
      famousProd: []
    },
    movieComment: {//电影影评
      id: '',
      comment: []
    },
    max: 1,
    startIndex: 0
  },
  mutations: {
    addUsername(state, username){
      state.username = username;
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
    setMovieContent(state, content) {
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
      state.movieComment.id = data.id;
      // state.movieComment.comment = state.movieComment.comment ? state.movieComment.comment : [];
      state.movieComment.comment = [];
      data.allContent.forEach((item, i) => {
        // state.movieComment.comment = [...state.movieComment.comment];
        // state.movieComment.comment[state.startIndex + i] = item;
        state.movieComment.comment.push(item);
      });
      // console.log(state.movieComment)
    }
  },
  actions: {
    gripMovieContent({commit}, {inp, id, fn}) {
      api.setMovieContent({
        "movieName": inp,
        "id": id
      }).then(res => {
        commit('setMovieContent', res.data);
        fn();
      }).catch(err => {
        console.log(err);
      })
    },
    gripActorContent({commit}, {inp, id, fn}) {
      api.setActorContent({
        "actName": inp,
        "id": id
      }).then(res => {
        commit('setActorContent', res.data);
        fn();
      }).catch(err => {
        console.log(err);
      })
    },
    gripMovieComment({commit}, {inp, id, start, fn}) {
      api.setComment({
        mName: inp,
        id: id,
        start: start > 0 ? this.state.startIndex : 0
      }).then(res => {
        commit('setMovieComment', res.data);
        fn();
      }).catch(err => {
        console.log(err);
      })
    }
  },
  modules: {
  }
})
