/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    redirect:'/home'
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['../views/login/login.vue'], resolve)
  },
  {
    path: '/home',
    name: 'home',
    component: resolve => require(['../views/Home.vue'], resolve),
    children: [
      {
        path: '/',
        component: resolve =>
          require(['../views/readme.vue'], resolve)
      },
      {
        path: '/readme',
        component: resolve =>
          require(['../views/readme.vue'], resolve)
      },
      {
        path: '/wareHouseInformation',
        name: 'wareHouseInformation',
        meta: {
            title: '企业查询',
            icon: 'el-icon-s-order'
        },
        component: resolve => require(['../views/wareHouseInformation/index.vue'], resolve)
      },
      // 企业数据授权
      {
        path: '/orgRolesManage',
        name: 'orgRolesManage',
        meta: {
          title: "添加企业",
        },
        component: resolve => require(['../views/orgRolesManage/index.vue'], resolve)
      },
      // 企业数据授权
      {
        path: '/authorization',
        name: 'authorization',
        meta: {
          title: "企业授权",
        },
        component: resolve => require(['../views/authorization/index.vue'], resolve)
      },
      {
        path: '/contractQuery',
        name: 'contractQuery',
        meta: {
            title: '合同查询',
        },
        component: resolve => require(['../views/assetContract/contractQuery.vue'], resolve)
    },
      {
        path: '/commonAsset/:assetType',
        name: 'commonAsset',
        meta: {
            title: '公共的资产组件',
        },
        component: resolve => require(['../views/commonAsset/index.vue'], resolve)
      },
    ]
  },
  
];

// 点击重复菜单报错
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return {
      x: 0,
      y: 0
    };
  }
});
router.beforeEach((to, from, next) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (to.path=='/login'){
      next();
      sessionStorage.clear();
    }else{
      if (!user) {
        next('/login');
        return;
      }
      else {
        next();
      }
    }
});
export default router;
/* eslint-enable */
