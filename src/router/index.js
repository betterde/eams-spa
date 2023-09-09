import Vue from 'vue'
import store from '../store'
import Router from 'vue-router'
import register from "./register";

Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

const routes = [
  {
    path: '/signup',
    name: 'signup',
    meta: {
      rules: [],
      requiresAuth: false
    },
    component: () => import('../views/rules/guest/SignUp.vue')
  },
  {
    path: '/signin',
    name: 'signin',
    meta: {
      rules: [],
      requiresAuth: false
    },
    component: () => import('../views/rules/guest/SignIn.vue')
  },
  {
    path: '/forgot',
    name: 'forgot',
    meta: {
      rules: [],
      requiresAuth: false
    },
    component: () => import('../views/rules/guest/ForgotPassword.vue')
  },
  {
    path: '/reset',
    name: 'reset',
    meta: {
      rules: [],
      requiresAuth: false,
    },
    component: () => import('../views/rules/guest/ResetPassword.vue')
  },
  {
    path: '*',
    name: 'notfound',
    meta: {
      rules: [],
      requiresAuth: false
    },
    component: () => import('../views/rules/guest/NotFound.vue')
  }
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
});


if (store.state.account.access_token && store.state.account.profile.guard) {
  router.addRoutes(register())
}

/**
 * Routing to intercept
 */
router.beforeEach((to, from, next) => {
  // 如果跳转到NotFound页面则提前设置视图的Layout 为 guest
  if (to.name === 'notfound') {
    store.commit('SET_LAYOUT_CURRENT', 'guest');
  }

  // 避免因为用户未登录访问首页被跳转到 404 页面
  if (to.fullPath === '/' && to.name === 'notfound') {
    next({
      path: '/signin'
    })
  }

  // 如果从NotFound 页面返回，并且需要认证的话，则设置视图的Layout 为 backend
  if (from.name === 'notfound' && to.meta.requiresAuth === true) {
    store.commit('SET_LAYOUT_CURRENT', 'backend')
  }

  if (store.state.account.access_token && to.path === '/signin') {
    next({
      path: '/'
    })
  }

  // 验证路由是否需要用户认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Determine whether the user has logged in by access token
    if (store.state.account.access_token === null) {
      next({
        path: '/signin'
      })
    } else {
      next();
    }
  } else {
    next()
  }
});

export default router;
