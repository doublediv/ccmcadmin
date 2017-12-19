<template>
    <div class="sidebar">
      <Menu class="nav" ref="sidebarMenu" :active-name="siActiveName" :open-names="siOpenNames" @on-select="menuSelect" :accordion="true" width="auto">
        <Submenu v-for="submenu in sidebarNav" :name="submenu.permission_parent_url">
            <template slot="title"><Icon :type="submenu.icon"></Icon>{{ submenu.permission_parent_name }}</template>
            <MenuItem v-for="menuitem in submenu.permission_child" :name="menuitem.permission_child_url">{{ menuitem.permission_child_name }}</MenuItem>
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
  watch: {
    $route() {
      if (this.$route.path === "/home") {
        this.$nextTick(function() {
          this.siActiveName = "";
          this.siOpenNames = [];
          this.$refs.sidebarMenu.updateActiveName();
          this.$refs.sidebarMenu.updateOpened();
        });
      }
    }
  },
  created() {
    if (this.$route.path !== "/home") {
      this.siActiveName = this.$route.path;
      this.siOpenNames = [this.$route.path.match(/\w+/)[0]];
    }
  },
  computed: {
    sidebarNav() {
      let sidebarNav = JSON.parse(localStorage.getItem("sidebarnav"));
      return sidebarNav;
    }
  },
  methods: {
    // 侧边导航选择
    menuSelect(name) {
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

