<template>
    <div>
        <Form :model="searchData" inline :label-width="70">
            <FormItem label="会员姓名:">
                <Input v-model="searchData.realName" placeholder="按会员姓名搜索"></Input>
            </FormItem>
            <FormItem label="会员手机:">
                <Input v-model="searchData.tel" placeholder="按会员姓名搜索"></Input>
            </FormItem>
            <FormItem label="消费时间:">
                <DatePicker @on-change="setSearchDate" type="daterange" placement="bottom-end" placeholder="按充值时间搜索" style="width: 200px"></DatePicker>
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
        realName: "",
        tel: "",
        startTime: "",
        endTime: "",
        limit: 10,
        page: 0
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "订单号", key: "refNo", align: "center" },
        { title: "会员姓名", key: "realName", align: "center" },
        { title: "会员手机", key: "phone", align: "center" },
        { title: "会员卡号", key: "vipcard", align: "center" },
        { title: "所属基站", key: "companyName", align: "center" },
        { title: "消费总金额", key: "totalPrice", align: "center" },
        { title: "所得积分", key: "generateScore", align: "center" },
        { title: "消费时间", key: "createTime", align: "center" }
      ],
      tableData: [],
      defaultText: "加载中...",
      isPage: false,
      totalPage: 0
    };
  },
  created() {
    this.getData(this.searchData);
  },
  methods: {
    // 获取数据
    getData(jsonData) {
      const _this = this;
      this.tableData = [];
      this.$http
        .post("/product_order_list", jsonData)
        .then(function(res) {
          console.log(res);
          _this.tableData = res.data.product_record;
          //   分页
          _this.totalPage = res.data.paginator.totalCount;
          if (res.data.paginator.totalPages > 1) {
            _this.isPage = true;
          } else {
            _this.isPage = false;
          }
          if (_this.isSearch) {
            _this.isSearch = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.defaultText = "数据获取失败";
          _this.$Notice.error({ title: "商品消费记录获取失败！" });
          if (_this.isSearch) {
            _this.isSearch = false;
          }
        });
    },
    // 设置搜索时间
    setSearchDate(dateArr) {
      this.searchData.startTime = Date.parse(new Date(dateArr[0]));
      this.searchData.endTime = Date.parse(new Date(dateArr[1]));
    },
    // 搜索
    search() {
      this.isSearch = true;
      this.isPage = false;
      this.getData(this.searchData);
    },
    // 选页
    changePage(pageNum) {
      this.getData({ limit: 10, page: pageNum });
    },
    // 导出数据
    exportData() {
      this.$refs.table.exportCsv({ filename: "商品消费记录" });
    }
  }
};
</script>
<style lang="less" scoped>

</style>
