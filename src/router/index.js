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
      path: '/',
      name: '登录',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '/home',
      name: '主页',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      // meta: {
      //     requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      // }
      children: [
        {
          path: '/vipdata/addvip',
          name: '新增会员',
          component: resolve => require(['../components/page/vipFiles/AddVip.vue'], resolve)
        },
        {
          path: '/vipdata/vip',
          name: '会员信息',
          component: resolve => require(['../components/page/vipFiles/Vip.vue'], resolve)
        },
        {
          path: '/vipdata/healthdata',
          name: '健康档案管理',
          component: resolve => require(['../components/page/vipFiles/HealthData.vue'], resolve)
        }
      ]

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
