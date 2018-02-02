<template>
    <div>
        <Table ref="table" :columns="tableColumns" :data="tableData" no-data-text="暂无数据" @on-row-click="selectRow" border></Table>
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
  // 监听表格数据
  // computed: {
  //   setDefaultText: function() {
  //     if(tableData.length < 1) {
  //       this.defaultText = "暂无数据"
  //     } else {
  //       this.defaultText = "加载完毕"
  //     }
  //     return this.defaultText
  //     console.log(this.defaultText)
  //   }
  // },
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
    },
    //   单击某一行
    selectRow(rowData) {
      this.$emit("getRow", rowData);
    }
  }
};
</script>

<style lang="less" scoped>

</style>

