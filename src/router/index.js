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
        },
        {
          path: '/finance/servicerecord',
          name: '服务消费记录',
          component: resolve => require(['../components/page/finance/Servicerecord.vue'], resolve),
          meta: { ParentNmame: "财务管理" }
        },
        // 服务管理
        {
          path: '/service/consume',
          name: '服务消费',
          component: resolve => require(['../components/page/service/Consume.vue'], resolve),
          meta: { ParentNmame: "服务管理" }
        },
        {
          path: '/service/addwaiter',
          name: '新增服务人员',
          component: resolve => require(['../components/page/service/AddWaiter.vue'], resolve),
          meta: { ParentNmame: "服务管理" }
        },
        {
          path: '/service/type',
          name: '服务类型管理',
          component: resolve => require(['../components/page/service/Type.vue'], resolve),
          meta: { ParentNmame: "服务管理" }
        },
        {
          path: '/service/facilitator',
          name: '服务商管理',
          component: resolve => require(['../components/page/service/Facilitator.vue'], resolve),
          meta: { ParentNmame: "服务管理" }
        },
        // 商品管理
        {
          path: '/goods/type',
          name: '商品类别管理',
          component: resolve => require(['../components/page/goods/Type.vue'], resolve),
          meta: { ParentNmame: "商品管理" }
        },
        {
          path: '/goods/addname',
          name: '新增商品名录',
          component: resolve => require(['../components/page/goods/AddName.vue'], resolve),
          meta: { ParentNmame: "商品管理" }
        },
        {
          path: '/goods/library',
          name: '商品库',
          component: resolve => require(['../components/page/goods/Library.vue'], resolve),
          meta: { ParentNmame: "商品管理" }
        },
        {
          path: '/goods/addgoods',
          name: '商品入库',
          component: resolve => require(['../components/page/goods/Addgoods.vue'], resolve),
          meta: { ParentNmame: "商品管理" }
        },
        {
          path: '/goods/inventory',
          name: '库存列表',
          component: resolve => require(['../components/page/goods/Inventory.vue'], resolve),
          meta: { ParentNmame: "商品管理" }
        },
        // 会员账户管理
        {
          path: '/vipaccount/recharge',
          name: '会员卡充值',
          component: resolve => require(['../components/page/vipaccount/Recharge.vue'], resolve),
          meta: { ParentNmame: "会员账户管理" }
        },
        {
          path: '/vipaccount/change',
          name: '会员卡变更',
          component: resolve => require(['../components/page/vipaccount/Change.vue'], resolve),
          meta: { ParentNmame: "会员账户管理" }
        },
        {
          path: '/vipaccount/consume',
          name: '会员卡消费',
          component: resolve => require(['../components/page/vipaccount/Consume.vue'], resolve),
          meta: { ParentNmame: "会员账户管理" }
        },
        {
          path: '/vipaccount/viplist',
          name: '会员账户列表',
          component: resolve => require(['../components/page/vipaccount/Viplist.vue'], resolve),
          meta: { ParentNmame: "会员账户管理" }
        },
        // 积分管理
        {
          path: '/integral/exchangerecord',
          name: '兑换记录',
          component: resolve => require(['../components/page/integral/Exchangerecord.vue'], resolve),
          meta: { ParentNmame: "积分管理" }
        },
        {
          path: '/integral/exchange',
          name: '积分兑换',
          component: resolve => require(['../components/page/integral/Exchange.vue'], resolve),
          meta: { ParentNmame: "积分管理" }
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
