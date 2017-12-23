<template>
  <div>
    <Form :model="searchData" inline :label-width="80">
        <FormItem label="商品编码:">
            <Input type="text" v-model="searchData.productNo" placeholder="按商品编码搜索" @on-enter="search"></Input>
        </FormItem>
        <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
    </Form>
    <Button class="singlebutton"  type="primary" @click="exportData"><Icon type="ios-download-outline"></Icon> 导出数据</Button>
    <Table ref="table" :columns="tableColumns" :data="tableData" :no-data-text="defaultText" border></Table>
    <Page class="page" v-if="isPage" :total="totalPage" :page-size="10" @on-change="changePage"></Page>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchData: {
        productNo: "",
        limit: 10,
        page: 0
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "商品类型", key: "productStockId", align: "center" },
        { title: "商品名称", key: "productName", align: "center" },
        { title: "商品编码", key: "productNo", align: "center" },
        { title: "分公司", key: "companyName", align: "center" },
        { title: "库存量", key: "stock", align: "center" }
      ],
      tableData: [],
      defaultText: "加载中...",
      isPage: false,
      totalPage: 0
    };
  },
  // 监听表格数据
  // computed: {
  //   setDefaultText: function() {
  //     if(this.tableData.length < 1) {
  //       this.defaultText = "暂无数据"
  //     } else {
  //       this.defaultText = "加载完毕"
  //     }
  //     return this.defaultText
  //     console.log(this.defaultText)
  //   }
  // },
  mounted() {
    this.$nextTick(function() {
      this.getData({ limit: 10, page: 0 });
    });
  },
  methods: {
    //   获取数据
    getData(jsonData) {
      this.tableData = [];
      this.$http
        .post("/product_stock_list", jsonData)
        .then(res => {
          console.log(res);
          this.tableData = res.data.product_stock;
          //   分页
          this.totalPage = res.data.paginator.totalCount;
          if (res.data.paginator.totalPages > 1) {
            this.isPage = true;
          } else {
            this.isPage = false;
          }
          if (this.isSearch) {
            this.isSearch = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "商品库存获取失败！" });
          this.defaultText = "数据获取失败";
          if (this.isSearch) {
            this.isSearch = false;
          }
        });
    },
    // 搜索
    search() {
      this.isSearch = true;
      if (this.isPage) {
        this.isPage = false;
      }
      this.getData(this.searchData);
    },
    // 选页
    changePage(pageNum) {
      this.getData({ limit: 10, page: pageNum });
    },
    // 导出数据
    exportData() {
      this.$refs.table.exportCsv({ filename: "商品库存" });
    }
  }
};
</script>
<style lang="less">
.goodskey {
  margin-right: 10px;
}
</style>
