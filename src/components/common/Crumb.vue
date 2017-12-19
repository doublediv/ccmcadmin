<template>
    <Breadcrumb class="crumbs" separator=">">
        <BreadcrumbItem to="/home"><Icon type="android-home"></Icon> 首页</BreadcrumbItem>
        <BreadcrumbItem to="#">会员档案管理</BreadcrumbItem>
        <BreadcrumbItem>健康档案</BreadcrumbItem>
    </Breadcrumb>
</template>
<script>
export default {
  data() {
    return {
      crumbData: []
    };
  },
  created() {
    console.log(1, this.$route);
    this.setCrumb(this.$route.matched);
  },
  watch: {
    $route() {
      console.log(1, this.$route);
      this.setCrumb(this.$route.matched);
    }
  },
  methods: {
    // 设置面包屑
    setCrumb(routeMatched) {
      this.crumbData = routeMatched.map(function(e) {
        return {
          crumbName: e.name,
          crumbPath: e.path
        };
      });
      console.log(this.crumbData);
    }
  }
};
</script>
<style lang="less" scoped>
.crumbs {
  font-size: 14px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  padding-left: 20px;

  > span:last-child {
    color: #8a8a8a;
    font-weight: 400;
  }
}
</style>


