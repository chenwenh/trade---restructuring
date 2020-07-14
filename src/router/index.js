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
        path: '/orderQuery',
        name: 'orderQuery',
        meta: {
            title: '订单查询',
        },
        component: resolve => require(['../views/assetOrder/orderQuery.vue'], resolve)
    },
    {
        path: '/invoiceQuery',
        name: 'invoiceQuery',
        meta: {
            title: '发票查询',
        },
        component: resolve => require(['../views/assetInvoice/invoiceQuery.vue'], resolve)
    },
    {
        path: '/aviationServiceQuery',
        name: 'aviationServiceQuery',
        meta: {
            title: '航空服务费管理',
        },
        component: resolve => require(['../views/aviationServicefee/index.vue'], resolve)
    },
    {
        path: '/aviationOilQuery',
        name: 'aviationOilQuery',
        meta: {
            title: '航空服务费管理',
        },
        component: resolve => require(['../views/aviationOilData/index.vue'], resolve)
    },
    {
        path: '/mountainEagleCoin',
        name: 'mountainEagleCoin',
        meta: {
            title: '航空服务费管理',
        },
        component: resolve => require(['../views/mountainEagleCoin/index.vue'], resolve)
    },
    {
        path: '/ticketSales',
        name: 'ticketSales',
        meta: {
            title: '航空服务费管理',
        },
        component: resolve => require(['../views/ticketSales/index.vue'], resolve)
    },
    {
        path: '/delvgoodsQuery',
        name: 'delvgoodsQuery',
        meta: {
            title: '发货单查询',
        },
        component: resolve => require(['../views/assetDelvgoods/index.vue'], resolve)
    },
    {
        path: '/revcgoodsQuery',
        name: 'revcgoodsQuery',
        meta: {
            title: '发货单查询',
        },
        component: resolve => require(['../views/assetRevcgoods/index.vue'], resolve)
    },
    {
        path: '/settlementQuery',
        name: 'settlementQuery',
        meta: {
            title: '结算单查询',
        },
        component: resolve => require(['../views/assetSettlement/index.vue'], resolve)
    },
    ]
  },
  
];

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
