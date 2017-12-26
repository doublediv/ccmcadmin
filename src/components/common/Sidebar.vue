<template>
    <div class="sidebar">
      <Menu class="nav" ref="sidebarMenu" :active-name="setActiveName" :open-names="setOpenName" @on-select="menuSelect" :accordion="true" width="auto">
        <Submenu v-for="(submenu, index) in sidebarNav" :name="submenu.permission_parent_url" :key="index">
            <template slot="title"><Icon :type="submenu.icon"></Icon>{{ submenu.permission_parent_name }}</template>
            <MenuItem v-for="(menuitem, index) in submenu.permission_child" :name="menuitem.permission_child_url" :key="index">{{ menuitem.permission_child_name }}</MenuItem>
        </Submenu>
      </Menu>
    </div>
</template>

<script>
export default {
  computed: {
    // 获取侧边栏
    sidebarNav() {
      let sidebarNav = JSON.parse(localStorage.getItem("sidebarnav"));
      return sidebarNav;
    },
    // 设置侧边展开栏
    setOpenName() {
      if (this.$route.path == "/home") {
        this.$nextTick(() => {
          this.$refs.sidebarMenu.$children.forEach(item => {
            item.opened = false;
          });
        });
        return [];
      } else {
        let openName = this.$route.path.match(/\w+/)[0];
        return [openName];
      }
    },
    // 设置侧边选中栏
    setActiveName() {
      // 清除会员Id
      var removeReg = /^\/vipdata\/vip\/edit/
      if(!removeReg.test(this.$route.path)){
        localStorage.removeItem("vipId");
      }
      // 清除会员卡号
      localStorage.removeItem("vipnumber")

      if (this.$route.path == "/home") {
        return "";
      } else {
        let activeName = this.$route.path;
        return activeName;
      }
    }
  },
  methods: {
    // 侧边导航选择
    menuSelect(name) {
      // 清除新增会员默认模版
      localStorage.removeItem("isTemp")
      localStorage.removeItem("isOn")
      this.$router.push(name);
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

    &:after {
      width: 0;
    }

    .ivu-menu-item-active,
    .ivu-menu-opened,
    .ivu-menu-submenu :hover {
      background-color: #097e7e;
    }

    .ivu-menu-item.ivu-menu-item-selected {
      border-right: none;
      background-color: #086868;
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

