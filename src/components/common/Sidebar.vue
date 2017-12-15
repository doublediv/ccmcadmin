<template>
    <div class="sidebar">
        <Menu class="nav" ref="sidebarMenu" :active-name="siActiveName" :open-names="siOpenNames" @on-select="menuSelect" @on-open-change="menuOpen" :accordion="true" width="auto">
            <Submenu name="vipdata">
                <template slot="title"><Icon type="clipboard"></Icon>会员档案管理</template>
                <MenuItem name="/vipdata/addvip">新增会员</MenuItem>
                <MenuItem name="/vipdata/vip">会员信息</MenuItem>
                <MenuItem name="/vipdata/healthdata">健康档案管理</MenuItem>
            </Submenu>
            <Submenu name="vipaccount">
                <template slot="title"><Icon type="ios-people"></Icon>会员卡账户管理</template>
                <MenuItem name="/vipaccount/recharge">会员卡充值</MenuItem>
                <MenuItem name="/vipaccount/consume">会员卡消费</MenuItem>
                <MenuItem name="/vipaccount/change">会员卡变更</MenuItem>
                <MenuItem name="/vipaccount/viplist">会员账户列表</MenuItem>
            </Submenu>
            <Submenu name="finance">
                <template slot="title"><Icon type="social-usd"></Icon>财务管理</template>
                <MenuItem name="/finance/rechargerecord">会员卡充值记录</MenuItem>
                <MenuItem name="/finance/goodsrecord">商品消费记录</MenuItem>
                <MenuItem name="/finance/servicerecord">服务消费记录</MenuItem>
            </Submenu>
            <Submenu name="service">
                <template slot="title"><Icon type="medkit"></Icon>服务管理</template>
                <MenuItem name="/service/consume">服务消费</MenuItem>
                <MenuItem name="/service/addwaiter">新增服务人员</MenuItem>
                <MenuItem name="/service/type">服务类型管理</MenuItem>
                <MenuItem name="/service/facilitator">服务商管理</MenuItem>
            </Submenu>
            <Submenu name="goods">
                <template slot="title"><Icon type="android-cart"></Icon>商品管理</template>
                <MenuItem name="/goods/type">商品类别管理</MenuItem>
                <MenuItem name="/goods/addname">新增商品名录</MenuItem>
                <MenuItem name="/goods/library">商品库</MenuItem>
                <MenuItem name="/goods/addgoods">商品入库</MenuItem>
                <MenuItem name="/goods/inventory">库存列表</MenuItem>
            </Submenu>
            <Submenu name="integral">
                <template slot="title"><Icon type="waterdrop"></Icon>积分管理</template>
                <MenuItem name="/integral/exchange">积分兑换</MenuItem>
                <MenuItem name="/integral/exchangerecord">兑换记录</MenuItem>
            </Submenu>
            <Submenu name="system">
                <template slot="title"><Icon type="gear-b"></Icon>系统配置</template>
                <MenuItem name="">账号管理</MenuItem>
                <MenuItem name="/system/role">角色管理</MenuItem>
                <MenuItem name="/system/organization">机构类型管理</MenuItem>
                <MenuItem name="/system/viplevel">会员卡级别</MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>

<script>
export default {
  data() {
    return {
      siActiveName: "",
      siOpenNames: []
    };
  },
  computed: {
    // onRoutes() {
    //   return this.$route.path.replace("/", "");
    // }
  },
  methods: {
    menuSelect() {
      const self = this;
    },
    menuOpen() {
      const self = this;
    }
  }
};
</script>

<style lang="less" scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 250px;
  left: 0;
  top: 70px;
  bottom: 0;
  background: #0b9595;

  .nav {
    height: 100%;
    color: #fff;
    font-size: 16px;
    background-color: transparent;

    .ivu-menu-submenu-title {
      padding: 22px 20px;
    }

    .ivu-menu-item :hover,
    .ivu-menu-opened,
    .ivu-menu-submenu :hover {
      background-color: #097e7e;
    }

    .ivu-menu-item {
      font-size: 16px;
      color: #fff;

      &:hover {
        background-color: #086868;
      }
    }
  }
}
</style>
