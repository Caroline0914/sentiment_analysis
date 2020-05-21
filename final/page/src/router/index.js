import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter);
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

const routes = [
  {
    path: '/',
    // redirect: '/dataGrip/movieContentGrip',
    redirect: '/login',
    component: () => import('../views/Main.vue'),
    children: [{
      path: "history",
      name: 'History',
      meta: {
        key: '4'
      },
      component: () => import('../components/History.vue')
    },{
      path: 'personal',
      name: 'Personal',
      meta: {
        key: '5'
      },
      component: () => import('../components/Personal.vue')
    },{
      path: 'userCenter',
      name: 'UserCenter',
      meta: {
        key: '6'
      },
      component: () => import('../components/UserCenter.vue')
    },{
      path: 'suggestMovie',
      name: 'SuggestMovie',
      meta: {
        key: '7'
      },
      component: () => import('../components/SuggestMovie.vue')
    }]
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }, {
    path: '/notfound',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }, {
    path: '/dataGrip',
    name: 'DataGrip',
    redirect: '/dataGrip/movieContentGrip',
    component: () => import('../views/Main.vue'),
    children: [{
      path: 'movieContentGrip/:id?',
      name: 'MovieContentGrip',
      meta: {
        key: '1-1'
      },
      component: () => import('../components/grip/MovieContent.vue')
    },{
      path: 'actorContentGrip/:id?',
      name: 'ActorContentGrip',
      meta: {
        key: '1-2'
      },
      component: () => import('../components/grip/ActorContent.vue')
    }, {
      path: 'movieCommentGrip/:id?',
      name: 'MovieCommentGrip',
      meta: {
        key: '1-3'
      },
      component: () => import('../components/grip/MovieComment.vue')
    }]
  }, {
    path: '/review',
    name: 'Review',
    redirect: '/review/useful',
    component: () => import('../views/Main.vue'),
    children: [{
      path: 'useful',
      name: 'Useful',
      meta: {
        key: '2-1'
      },
      component: () => import('../components/filmReview/Useful.vue')
    }, {
      path: 'keyWords',
      name: 'KeyWords',
      meta: {
        key: '2-2'
      },
      component: () => import('../components/filmReview/KeyWords.vue')
    }]
  }, {
    path: '/visualization',
    name: 'Visualization',
    redirect: '/visualization/wordCloud',
    component: () => import('../views/Main.vue'),
    children: [{
      path: 'wordCloud',
      name: 'WordCloud',
      meta: {
        key: '3-1'
      },
      component: () => import('../components/visualization/WordCloud.vue')
    }, {
      path: 'sentimentChart',
      name: 'SentimentChart',
      meta: {
        key: '3-2'
      },
      component: () => import('../components/visualization/SentimentChart.vue')
    }]
  },{
    path: '*',
    redirect: '/notfound'
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 拦截
router.beforeEach((to, from, next) => {
  let flag = false;
  document.cookie.split("; ").forEach(item => {
    let key = item.split("=")[0];
    let value = item.split("=")[1];
    if(key == "username" && value.length > 0) {
      flag = true;
    }
  });
  if(flag || to.name == "Register" || to.name == "Login") {
    next()
  } else {
    next({
      path: '/login'
    });
  }
});

export default router
