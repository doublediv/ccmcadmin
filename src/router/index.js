import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// 页面刷新时，重新赋值token
//token： 5188c5187d48df67b0c8953813791f25ed4e367c
// if (window.localStorage.getItem('token')) {
//   store.commit(types.LOGIN, window.localStorage.getItem('token'))
// }

// 路由配置
export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '/home',
      name: '首页',
      component: resolve => require(['../components/common/Home.vue'], resolve),

      children: [
        {
          path: '/',
          name: '基站概况',
          component: resolve => require(['../components/page/Index.vue'], resolve),
        },
        // 健康档案管理
        {
          path: '/vipdata/addvip',
          name: '新增会员',
          component: resolve => require(['../components/page/vipFiles/AddVip.vue'], resolve),
          meta: { ParentNmame: "会员档案管理" }
        },
        {
          path: '/vipdata/vip',
          name: '会员信息',
          component: resolve => require(['../components/page/vipFiles/Vip.vue'], resolve),
          meta: { ParentNmame: "会员档案管理" }
        },
        {
          path: '/vipdata/healthdata',
          name: '健康档案管理',
          component: resolve => require(['../components/page/vipFiles/HealthData.vue'], resolve),
          meta: { ParentNmame: "会员档案管理" }
        },
        // 系统配置
        {
          path: '/system/account',
          name: '帐号管理',
          component: resolve => require(['../components/page/system/Account.vue'], resolve),
          meta: { ParentNmame: "系统配置" }
        },
        {
          path: '/system/role',
          name: '角色管理',
          component: resolve => require(['../components/page/system/Role.vue'], resolve),
          meta: { ParentNmame: "系统配置" }
        },
        {
          path: '/system/organization',
          name: '机构类型管理',
          component: resolve => require(['../components/page/system/Organization.vue'], resolve),
          meta: { ParentNmame: "系统配置" }
        },
        {
          path: '/system/viplevel',
          name: '会员卡级别',
          component: resolve => require(['../components/page/system/Viplevel.vue'], resolve),
          meta: { ParentNmame: "系统配置" }
        },
        // 财务管理
        {
          path: '/finance/rechargerecord',
          name: '会员卡充值记录',
          component: resolve => require(['../components/page/finance/Rechargerecord.vue'], resolve),
          meta: { ParentNmame: "财务管理" }
        },
        {
          path: '/finance/goodsrecord',
          name: '商品消费记录',
          component: resolve => require(['../components/page/finance/Goodsrecord.vue'], resolve),
          meta: { ParentNmame: "财务管理" }
        }
      ]
    },
    // 路由重定向
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

// 路由拦截
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(r => r.meta.requireAuth)) {
//       if (store.state.token) {
//           next();
//       }
//       else {
//           next({
//               path: '/login',
//               query: {redirect: to.fullPath}
//           })
//       }
//   }
//   else {
//       next();
//   }
// })
