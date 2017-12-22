<template>
    <div>
        <Table ref="table" :columns="tableColumns" :data="tableData" :no-data-text="defaultText" border></Table>
        <Page class="page" v-if="isPage" :total="totalPage" :page-size="10" @on-change="changePage"></Page>
    </div>
</template>

<script>
export default {
  props: ["tableColumns", "tableData", "totalPage", "isPage"],

  data() {
    return {
      defaultText: "加载中..."
    };
  },

  //   改变表格默认提示
  mounted() {
    this.$nextTick(() => {
      this.$on("getErr", () => {
        this.defaultText = "数据获取失败";
      });
    });
  },

  methods: {
    //   改变页数
    changePage(pageNum) {
      this.$emit("getPage", pageNum);
    }
  }
};
</script>

<style lang="less" scoped>

</style>

