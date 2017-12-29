<template>
  <Row :gutter="24">
    <Col span="10">
        <Form :model="searchData" inline :label-width="70">
            <FormItem label="商品编码:">
                <Input type="text" v-model="searchData.productNo" placeholder="按商品编码搜索" @on-enter="search"></Input>
            </FormItem>
            <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
        </Form>
        <p class="tip">请选择要入库的商品</p>
        <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" @getRow="preSelection" :totalPage="totalPage" :isPage="isPage" @getPage="selectPage"></v-table>
    </Col>
    <Col span="14">
        <p class="tip">准备入库的商品</p>
        <Table ref="addTable" :columns="addGoodsColumns" :data="addGoodsData" height="400" border></Table>
        <div class="buttonbox">
            <Button class="singlebutton" :loading="isKeep" type="primary" @click="addGoods">确定入库</Button>
            <Button class="singlebutton" type="ghost" @click="cancelAdd">取消入库</Button>
        </div>
    </Col>
  </Row>
</template>
<script>
import vTable from "../../common/Table.vue";
export default {
  components: { vTable },
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
        { title: "商品名称", key: "productName", align: "center" },
        { title: "商品条码", key: "productNo", align: "center", width: "200" },
        { title: "参考进价", key: "purchasePrice", align: "center" },
        { title: "库存", key: "stock", align: "center" }
      ],
      tableData: [],
      totalPage: 0,
      isPage: false,
      addGoodsColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "商品名称", key: "productName", align: "center" },
        { title: "商品条码", key: "productNo", align: "center", width: "200" },
        { title: "入库价格", key: "purchasePrice", align: "center" },
        {
          title: "数量",
          key: "count",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  size: "small",
                  min: 1,
                  value: this.addGoodsData[params.index].count
                },
                on: {
                  "on-blur": event => {
                    if (event.target.value < 1) {
                      this.$Notice.error({ title: "商品入库数量最小为1！" });
                      this.addGoodsData[params.index].count = 1;
                    } else {
                      this.addGoodsData[params.index].count =
                        event.target.value;
                    }
                  }
                }
              })
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: { type: "error", size: "small" },
                  on: {
                    click: () => {
                      this.addGoodsData.splice(params.index, 1);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      addGoodsData: [],
      isKeep: false
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getData(this.searchData);
    });
  },
  methods: {
    // 获取数据
    getData(jsonData) {
      const _this = this;
      this.tableData = [];
      this.$http
        .post("/get_product", jsonData)
        .then(function(res) {
          // console.log(res)
          _this.tableData = res.data.product;
          if (_this.isSearch) {
            if (_this.tableData.length > 0 && _this.tableData.length < 2) {
              _this.preSelection(res.data.product[0]);
            }
            _this.isSearch = false;
          }
          //   分页
          _this.totalPage = res.data.paginator.totalCount;
          if (res.data.paginator.totalPages > 1) {
            _this.isPage = true;
          } else {
            _this.isPage = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.$refs.vTable.$emit("getErr");
          _this.$Notice.error({ title: "商品获取失败！" });
          if (_this.isSearch) {
            _this.isSearch = false;
          }
        });
    },
    //   搜索
    search() {
      this.isSearch = true;
      this.isPage = false;
      this.tableData = [];
      this.getData(this.searchData);
    },
    // 选页
    selectPage(pageNum) {
      this.getData({ limit: 10, page: pageNum });
    },
    // 预挑选商品
    preSelection(goodData) {
      if (this.addGoodsData.length == 0) {
        goodData.count = 1;
        this.addGoodsData.push(goodData);
      } else {
        let isNewGood = true;
        this.addGoodsData.forEach(function(e) {
          if (e.productNo === goodData.productNo) {
            e.count++;
            isNewGood = false;
          }
        }, this);
        if (isNewGood) {
          goodData.count = 1;
          this.addGoodsData.push(goodData);
        }
      }
    },
    // 取消入库
    cancelAdd() {
      this.addGoodsData = [];
    },
    // 确定入库
    addGoods() {
      //   console.log(this.addGoodsData);
      var addGoodsDataForAdmin = this.addGoodsData.map(function(e) {
        return {
          productNo: e.productNo,
          count: e.count
        };
      });
    //   console.log(addGoodsDataForAdmin);
      this.isKeep = true;
      this.$http
        .post("/add_product_stock", addGoodsDataForAdmin)
        .then(res => {
          this.addGoodsData = [];
          this.isKeep = false;
          this.$Message.success("商品入库成功！");
          this.getData(this.searchData);
        })
        .catch(err => {
          console.log(err);
          this.isKeep = false;
          this.$Notice.error({ title: "商品入库失败！" });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.tip {
  color: #e6451e;
  margin-bottom: 10px;
}
.buttonbox {
  margin-top: 24px;
}
</style>
