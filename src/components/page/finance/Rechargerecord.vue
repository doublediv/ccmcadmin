<template>
    <div>
        <Form :model="searchData" inline :label-width="70">
            <FormItem label="会员姓名:">
                <Input v-model="searchData.realName" placeholder="按会员姓名搜索"></Input>
            </FormItem>
            <FormItem label="付款方式:">
                <Select v-model="searchData.paidType" placeholder="按付款方式搜索" style="width:164px">
                    <Option value="">请选择</Option>
                    <Option value="0">现金</Option>
                    <Option value="1">刷卡</Option>
                </Select>
            </FormItem>
            <FormItem label="所属基站:">
                <Select v-model="searchData.companyId" placeholder="按所属基站" style="width:164px">
                    <Option value="">请选择</Option>
                </Select>
            </FormItem>
            <FormItem label="充值时间:">
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
        paidType: "",
        startTime: "",
        endTime: "",
        companyId: "",
        limit: 10,
        page: 0
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "姓名", key: "realName", align: "center" },
        { title: "会员卡号", key: "vipCard", align: "center" },
        { title: "所属基站", key: "companyName", align: "center" },
        { title: "充值前余额", key: "beforeQuota", align: "center" },
        { title: "充值金额", key: "rechargeQuota", align: "center" },
        { title: "充值后余额", key: "afterQuota", align: "center" },
        { title: "充值时间", key: "paidTime", align: "center" },
        { title: "付款方式", key: "paidType", align: "center" },
        { title: "销售人员", key: "seller", align: "center" },
        { title: "会员卡状态", key: "vipCardStatus", align: "center" }
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
        .post("/VIP_card_recharge_list", jsonData)
        .then(function(res) {
          //   console.log(res);
          _this.tableData = res.data.record;
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
          _this.defaultText = "数据获取失败"
          _this.$Notice.error({ title: "会员卡充值记录获取失败！" });
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
        this.getData({limit: 10, page: pageNum});
    },
    // 导出数据
    exportData() {
      this.$refs.table.exportCsv({filename: "会员卡充值记录"})
    }
  }
};
</script>
<style lang="less" scoped>

</style>
