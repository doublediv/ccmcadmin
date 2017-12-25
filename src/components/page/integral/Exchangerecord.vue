<template>
    <div>
        <Form :model="searchData" inline :label-width="70">
            <FormItem label="会员手机:">
                <Input v-model="searchData.phone" placeholder="按会员手机搜索"></Input>
            </FormItem>
            <FormItem label="兑换类型:">
                <Select v-model="searchData.exchangeType" placeholder="按兑换类型搜索" style="width:164px">
                    <Option value="">请选择</Option>
                    <Option value="1">商品兑换</Option>
                    <Option value="2">服务兑换</Option>
                </Select>
            </FormItem>
            <FormItem label="兑换时间:">
                <DatePicker @on-change="setSearchDate" type="daterange" placement="bottom-end" placeholder="按兑换时间搜索" style="width: 200px"></DatePicker>
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
        phone: "",
        exchangeType: "",
        startTime: "",
        endTime: "",
        limit: 10,
        page: 0
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "兑换单号", key: "refNo", align: "center" },
        { title: "会员姓名", key: "realName", align: "center" },
        { title: "会员手机", key: "tel", align: "center" },
        { title: "兑换类型", key: "exchangeTypeString", align: "center" },
        { title: "兑换数量", key: "quantity", align: "center" },
        { title: "积分消费", key: "paidScore", align: "center" },
        { title: "操作员", key: "userName", align: "center" },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: { type: "primary", size: "small" },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      // console.log(params.row);
                      this.$http
                        .post("/exchange_score_detail", {
                          exchangeOrderId: params.row.id
                        })
                        .then(res => {
                          // console.log(res);
                          var detailContent;
                          if (params.row.exchangeTypeString === "商品兑换") {
                            detailContent = `<p><span class="goodskey">兑换商品：</span>${res
                              .data.exchangeDetail.otherName}</p>
                              <p><span class="goodskey">所需积分：</span>${res.data
                                .exchangeDetail.score}</p>`;
                          } else {
                            var costType;
                            switch (res.data.exchangeDetail.costType) {
                              case 1:
                                costType = " 积分 / 天";
                                break;
                              case 2:
                                costType = " 积分 / 小时";
                                break;
                              case 3:
                                costType = " 积分 / 次数";
                                break;

                              default:
                                break;
                            }
                            detailContent = `<p><span class="goodskey">服务类型：</span>${res
                              .data.exchangeDetail.serviceCategory}</p>
                              <p><span class="goodskey">服务项目：</span>${res.data
                                .exchangeDetail.otherName}</p>
                              <p><span class="goodskey">所需积分：</span>${res.data
                                .exchangeDetail.score}${costType}</p>`;
                          }
                          this.$Modal.info({
                            title: "积分兑换信息",
                            content: `<p><span class="goodskey">兑换单号：</span>${res
                              .data.exchangeDetail.refNO}</p>
                              <p><span class="goodskey">会员姓名：</span>${res.data
                                .exchangeDetail.realName}</p>
                              <p><span class="goodskey">会员手机：</span>${res.data
                                .exchangeDetail.phone}</p>
                              <p><span class="goodskey">兑换类型：</span>${res.data
                                .exchangeDetail.exchangeType}</p>
                              ${detailContent}
                              <p><span class="goodskey">兑换数量：</span>${res.data
                                .exchangeDetail.quantity}</p>
                              <p><span class="goodskey">总消费积分：</span>${res.data
                                .exchangeDetail.total_score}</p>
                              <p><span class="goodskey">兑换日期：</span>${res.data
                                .exchangeDetail.createTime}</p>
                              <p><span class="goodskey">操作员：</span>${res.data
                                .exchangeDetail.userName}</p>`
                          });
                        })
                        .catch(err => {
                          console.log(err);
                          this.$Notice.error({ title: "更多兑换记录获取失败！" });
                        });
                    }
                  }
                },
                "查看更多"
              )
            ]);
          }
        }
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
        .post("/exchange_score_list", jsonData)
        .then(function(res) {
            // console.log(res);
          _this.tableData = res.data.exchange_record.map(function(e) {
            if (e.exchangeType == "1") {
              e.exchangeTypeString = "商品兑换";
            } else {
              e.exchangeTypeString = "服务兑换";
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
          _this.$Notice.error({ title: "兑换记录获取失败！" });
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
      this.$refs.table.exportCsv({ filename: "兑换记录" });
    }
  }
};
</script>
<style lang="less" scoped>

</style>
