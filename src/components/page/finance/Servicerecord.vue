<template>
    <div>
        <Form :model="searchData" inline :label-width="70">
            <FormItem label="会员姓名:">
                <Input v-model="searchData.customerName" placeholder="按会员姓名搜索"></Input>
            </FormItem>
            <FormItem label="服务类型:">
                <Select placeholder="按服务类型搜索" style="width:164px" @on-change="getServiceItem">
                    <Option value="">请选择</Option>
                    <Option v-for="item in serviceType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="服务项目:">
                <Select v-model="searchData.projectName" placeholder="按服务项目搜索" :loading="isGetServiceItem" style="width:164px">
                    <Option value="">请选择</Option>
                    <Option v-for="item in serviceItem" :value="item.name" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="服务时间:">
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
      serviceType: [],
      serviceItem: [],
      isGetServiceItem: false,
      searchData: {
        customerName: "",
        projectName: "",
        startTime: "",
        endTime: "",
        limit: 10,
        page: 0
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "客户ID", key: "customerId", align: "center" },
        { title: "客户姓名", key: "customerName", align: "center" },
        { title: "联系方式", key: "phone", align: "center" },
        { title: "所属基站", key: "companyName", align: "center" },
        { title: "服务项目", key: "serviceProjectName", align: "center" },
        { title: "完成时间", key: "paidTime", align: "center" },
        { title: "收费标准", key: "originalPrice", align: "center" },
        { title: "数量", key: "quantity", align: "center" },
        { title: "金额", key: "totalPrice", align: "center" },
        { title: "所得积分", key: "generateScore", align: "center" },
        { title: "服务人员", key: "serviceUserName", align: "center" }
      ],
      tableData: [],
      defaultText: "加载中...",
      isPage: false,
      totalPage: 0
    };
  },
  created() {
    this.getServiceType();
    this.getData(this.searchData);
  },
  methods: {
    // 获取服务类型
    getServiceType() {
      this.$http
        .post("/service_category_list")
        .then(res => {
          // console.log(res);
          this.serviceType = res.data.serviceCategory;
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "服务类型列表获取失败！" });
        });
    },
    // 获取服务项目
    getServiceItem(serviceTypeId) {
      this.serviceItem = [];
      this.isGetServiceItem = true;
      this.$http
        .post("/get_service_project", { serviceCategoryId: serviceTypeId })
        .then(res => {
          // console.log(res);
          this.isGetServiceItem = false;
          this.serviceItem = res.data.serviceCategory;
        })
        .catch(err => {
          console.log(err);
          this.isGetServiceItem = false;
          this.$Notice.error({ title: "服务项目列表获取失败！" });
        });
    },
    // 获取数据
    getData(jsonData) {
      const _this = this;
      this.tableData = [];
      this.$http
        .post("/get_service_record", jsonData)
        .then(function(res) {
          // console.log(res);
          _this.tableData = res.data.serviceRecord.map(function(e) {
            switch (e.serviceType) {
              case "1":
                e.originalPrice = e.originalPrice + " / 天";
                break;
              case "2":
                e.originalPrice = e.originalPrice + " / 小时";
                break;
              case "3":
                e.originalPrice = e.originalPrice + " / 次";
                break;

              default:
                break;
            }
            return e;
          });
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
          _this.$Notice.error({ title: "服务消费记录获取失败！" });
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
      this.$refs.table.exportCsv({ filename: "服务消费记录" });
    }
  }
};
</script>
<style lang="less" scoped>

</style>
