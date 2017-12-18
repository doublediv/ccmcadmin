<template>
    <Breadcrumb class="crumbs" separator=">">
        <BreadcrumbItem to="/"><Icon type="android-home"></Icon> 首页</BreadcrumbItem>
        <BreadcrumbItem to="/">会员档案管理</BreadcrumbItem>
        <BreadcrumbItem>健康档案</BreadcrumbItem>
    </Breadcrumb>
</template>
<script>
export default {};
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


