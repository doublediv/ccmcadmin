<template>
  <div>
    <Form :model="searchData" inline :label-width="80">
        <FormItem label="商品编码:">
            <Input type="text" v-model="searchData.number" placeholder="按商品编码搜索" @on-enter="search"></Input>
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
        number: "",
        limit: 10,
        page: 0
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "商品类型", key: "productCategoryName", align: "center" },
        { title: "商品名称", key: "name", align: "center" },
        { title: "商品编码", key: "number", align: "center" },
        { title: "录入时间", key: "createTime", align: "center" },
        { title: "进价", key: "purchasePrice", align: "center" },
        { title: "售价", key: "originalPrice", align: "center" },
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
                      //   this.isEditTwo = true;
                      //   this.editTwoData = JSON.parse(JSON.stringify(params.row));
                      this.$Modal.info({
                        title: "商品信息",
                        content: `<p><span class="goodskey">商品类型：</span>${params
                          .row.productCategoryName}</p>
                                  <p><span class="goodskey">商品名称：</span>${params
                                    .row.name}</p>
                                  <p><span class="goodskey">商品编码：</span>${params
                                    .row.number}</p>
                                  <p><span class="goodskey">进价：</span>${params
                                    .row.purchasePrice} 元</p>
                                  <p><span class="goodskey">售价：</span>${params
                                    .row.originalPrice} 元</p>
                                  <p><span class="goodskey">参与积分兑换：</span>${params
                                    .row.isScore}</p>
                                  <p><span class="goodskey">所需积分：</span>${params
                                    .row.score} 积分</p>
                                  <p><span class="goodskey">参与会员优惠：</span>${params
                                    .row.isVip}</p>
                                  <p><span class="goodskey">金卡折扣：</span>${params
                                    .row.goldDiscount} 折</p>
                                  <p><span class="goodskey">银卡折扣：</span>${params
                                    .row.silverDiscount} 折</p>
                                  <p><span class="goodskey">普卡折扣：</span>${params
                                    .row.commonDiscount} 折</p>
                                  <p><span class="goodskey">创建时间：</span>${params
                                    .row.createTime}</p>`
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
      this.getData(this.searchData);
    });
  },
  methods: {
    //   获取数据
    getData(jsonData) {
      this.tableData = [];
      this.$http
        .post("/product_list", jsonData)
        .then(res => {
          // console.log(res);
          this.tableData = res.data.customers.map(function(e) {
            if (e.isScore === 1) {
              e.isScore = "是";
            } else {
              e.isScore = "否";
            }
            if (e.isVip === 1) {
              e.isVip = "是";
            } else {
              e.isVip = "否";
            }
            return e;
          });
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
          this.$Notice.error({ title: "商品库获取失败！" });
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
      this.$refs.table.exportCsv({ filename: "商品库" });
    }
  }
};
</script>
<style lang="less">
.goodskey {
  margin-right: 10px;
}
</style>
