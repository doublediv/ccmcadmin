<template>
    <Breadcrumb class="crumbs" separator=">">
        <BreadcrumbItem to="/home"><Icon type="android-home"></Icon> 首页</BreadcrumbItem>
        <BreadcrumbItem v-for="(item, index) in setCrumb" :key="index">{{ item.name }}</BreadcrumbItem>
    </Breadcrumb>
</template>
<script>
export default {
  data() {
    return {
      crumbData: []
    };
  },
  computed: {
    setCrumb() {
      var crumbData = [];
      if (this.$route.matched[1].meta.ParentNmame) {
        crumbData.push(
          { name: this.$route.matched[1].meta.ParentNmame },
          { name: this.$route.matched[1].name }
        );
      } else {
        crumbData.push({ name: this.$route.matched[1].name });
      }
      return crumbData;
    }
  },
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


