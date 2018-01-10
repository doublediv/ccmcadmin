<template>
  <div>
    <Row :gutter="24">
      <Col span="10">
          <Form :model="searchVipData" inline :label-width="80">
              <FormItem label="会员搜索:">
                  <Input type="text" v-model="searchVipData.content" placeholder="请读取卡号或输入手机号"></Input>
              </FormItem>
              <Button class="singlebutton" type="primary" @click="linkDevice">连接设备</Button>
              <Button class="singlebutton" type="primary" @click="toFindTheCard">双击读卡</Button>
              <Button class="singlebutton" icon="ios-search" :loading="isSearchVip" type="primary" @click="searchVip">搜索</Button>
          </Form>
          <Form :model="vipData" inline :label-width="82">
              <FormItem label="姓名:">
                  <Input disabled type="text" v-model="vipData.realName" placeholder="请先搜索相关会员"></Input>
              </FormItem>
              <FormItem label="会员级别:">
                  <Input disabled type="text" v-model="vipData.viplevel" placeholder="请先搜索相关会员"></Input>
              </FormItem>
              <FormItem label="账户余额:">
                  <Input disabled type="text" v-model="vipData.totalDeposits" placeholder="请先搜索相关会员"></Input>
              </FormItem>
              <FormItem label="积分:">
                  <Input disabled type="text" v-model="vipData.score" placeholder="请先搜索相关会员"></Input>
              </FormItem>
          </Form>
          <p class="tip">请选择要购买的商品</p>
          <Form :model="searchData" inline :label-width="70">
              <FormItem label="商品编码:">
                  <Input type="text" v-model="searchData.productNo" placeholder="按商品编码搜索" @on-enter="search"></Input>
              </FormItem>
              <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
          </Form>
          <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" @getRow="preSelection" :totalPage="totalPage" :isPage="isPage" @getPage="selectPage"></v-table>
      </Col>
      <Col span="14">
          <p class="tip">准备购买的商品</p>
          <Table ref="addTable" :columns="addGoodsColumns" :data="addGoodsData" height="400" border></Table>
          <p class="tip">&nbsp;</p>
          <p class="tip">订单信息</p>
          <Form :model="orderData" inline :label-width="90">
              <Row>
                <Col span="24">
                  <FormItem label="消费总金额:">
                      <Input disabled type="text" v-model="orderData.totalConsumption"></Input>
                  </FormItem>
                  <FormItem label="折后总金额:">
                      <Input disabled type="text" v-model="orderData.afterDiscount"></Input>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="所得积分总额:">
                      <Input disabled type="text" v-model="orderData.afterDiscount"></Input>
                  </FormItem>
                  <FormItem label="销售人员:">
                      <Input type="text" v-model="orderData.seller" placeholder="请输入销售人员"></Input>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem>
                      <Button class="singlebutton" :loading="isKeep" type="primary" @click="buyGoods">确定购买</Button>
                      <Button class="singlebutton" type="ghost" @click="cancelBuy">取消购买</Button>
                      <Button class="singlebutton" :disabled="isRefNo" type="primary" @click="showPrint(refNo)">打印小票</Button>
                  </FormItem>
                </Col>
              </Row>
          </Form>
      </Col>
    </Row>
    <!-- 打印小票 -->
    <Modal 
        v-model="isPrint"
        :closable="false"
        :mask-closable="false"
        :width="350"
        class-name="eidthform">
        <p slot="header">小票信息</p>
        <div style="font-size: 14px; line-height: 28px;" id="receipt">
          <h3 style="font-size: 16px; text-align: center; margin-bottom: 10px; font-weight: 700">CCMC-{{printData.companyName}}</h3>
          <hr style="height: 2px; border: none; border-top: 2px dashed #333; margin: 10px 0" />
          <p>No.{{refNo}}</p>
          <p>{{printData.createTime}}</p>
          <hr style="height: 2px; border: none; border-top: 2px dashed #333; margin: 10px 0" />
          <p>
            <span style="display: inline-block; width: 19%; text-align: center">商品名</span>
            <span style="display: inline-block; width: 19%; text-align: center">单价</span>
            <span style="display: inline-block; width: 19%; text-align: center">数量</span>
            <span style="display: inline-block; width: 19%; text-align: center">优惠</span>
            <span style="display: inline-block; width: 19%; text-align: center">小计</span>
          </p>
          <p v-for="(item, index) in printData.date" :key="index">
            <span style="display: inline-block; width: 19%; text-align: center">{{item.productName}}</span>
            <span style="display: inline-block; width: 19%; text-align: center">{{item.original_price}}</span>
            <span style="display: inline-block; width: 19%; text-align: center">{{item.quantity}}</span>
            <span style="display: inline-block; width: 19%; text-align: center">{{item.cut_price}}</span>
            <span style="display: inline-block; width: 19%; text-align: center">{{item.discount_price}}</span>
          </p>
          <hr style="height: 2px; border: none; border-top: 2px dashed #333; margin: 10px 0" />
          <p>
            <span style="display: inline-block; width: 24%; text-align: center">总计</span>
            <span style="display: inline-block; width: 24%; text-align: center">优惠</span>
            <span style="display: inline-block; width: 24%; text-align: center">应收</span>
            <span style="display: inline-block; width: 24%; text-align: center">获得积分</span>
          </p>
          <p>
            <span style="display: inline-block; width: 24%; text-align: center">{{printData.totalPrice}}</span>
            <span style="display: inline-block; width: 24%; text-align: center">{{printData.cutPrice}}</span>
            <span style="display: inline-block; width: 24%; text-align: center">{{printData.discountPrice}}</span>
            <span style="display: inline-block; width: 24%; text-align: center">{{printData.generateScore}}</span>
          </p>
          <hr style="height: 2px; border: none; border-top: 2px dashed #333; margin: 10px 0" />
          <p style="text-align: center; font-size: 16px; margin: 10px 0 24px">谢谢惠顾</p>
        </div>
        <div slot="footer" class="button-box">
            <Button type="primary" :loading="isKeep"  @click="print('receipt')">打印</Button>
            <Button type="ghost" @click="closePrint">关闭</Button>
        </div>
    </Modal> 
  </div>
</template>
<script>
import vTable from "../../common/Table.vue";
export default {
  components: { vTable },
  data() {
    return {
      searchVipData: {
        content: ""
      },
      isSearchVip: false,
      vipData: {
        customerId: "",
        realName: "",
        viplevel: "",
        totalDeposits: "",
        score: ""
      },
      isDiscount: "",
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
        { title: "商品单价", key: "productPrice", align: "center" },
        { title: "库存", key: "stock", align: "center" }
      ],
      tableData: [],
      totalPage: 0,
      isPage: false,
      oldValue: 0,
      addGoodsColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "商品名称", key: "productName", align: "center" },
        { title: "商品条码", key: "productNo", align: "center" },
        { title: "商品单价", key: "productPrice", align: "center" },
        { title: "折扣", key: "discount", align: "center" },
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
                  "on-focus": event => {
                    this.oldValue = event.target.value;
                  },
                  "on-blur": event => {
                    if (event.target.value < 1) {
                      this.$Notice.error({ title: "商品兑换数量最小为1！" });
                      this.addGoodsData[params.index].count = 1;
                    } else if (event.target.value > params.row.stock) {
                      this.$Notice.warning({ title: "该商品库存不足！" });
                      this.addGoodsData[params.index].count = params.row.stock;
                    } else {
                      this.addGoodsData[params.index].count =
                        event.target.value;
                    }
                    this.addGoodsData[params.index].singleTotal =
                      this.addGoodsData[params.index].count *
                      params.row.discount *
                      params.row.productPrice;
                    if (this.addGoodsData[params.index].count > this.oldValue) {
                      this.orderData.totalConsumption =
                        parseFloat(this.orderData.totalConsumption) +
                        params.row.productPrice *
                          (this.addGoodsData[params.index].count -
                            this.oldValue);
                      this.orderData.afterDiscount =
                        parseFloat(this.orderData.afterDiscount) +
                        params.row.productPrice *
                          (this.addGoodsData[params.index].count -
                            this.oldValue) *
                          params.row.discount;
                    } else {
                      this.orderData.totalConsumption =
                        parseFloat(this.orderData.totalConsumption) -
                        params.row.productPrice *
                          (this.oldValue -
                            this.addGoodsData[params.index].count);
                      this.orderData.afterDiscount =
                        parseFloat(this.orderData.afterDiscount) -
                        params.row.productPrice *
                          (this.oldValue -
                            this.addGoodsData[params.index].count) *
                          params.row.discount;
                    }
                  }
                }
              })
            ]);
          }
        },
        {
          title: "单项合计",
          key: "singleTotal",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  size: "small",
                  min: 1,
                  disabled: true,
                  value: this.addGoodsData[params.index].singleTotal
                },
                on: {
                  "on-change": event => {
                    this.addGoodsData[params.index].singleTotal =
                      event.target.value;
                  }
                }
              })
            ]);
          }
        },
        { title: "所得积分", key: "singleTotal", align: "center" },
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
                      this.orderData.totalConsumption =
                        parseFloat(this.orderData.totalConsumption) -
                        params.row.productPrice * params.row.count;
                      this.orderData.afterDiscount =
                        parseFloat(this.orderData.afterDiscount) -
                        params.row.productPrice *
                          params.row.count *
                          params.row.discount;
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
      orderData: {
        totalConsumption: 0,
        afterDiscount: 0,
        seller: ""
      },
      isKeep: false,
      orderDataForAdmin: [],
      isRefNo: true,
      refNo: "",
      isPrint: false,
      printData: {
        totalPrice: "",
        discountPrice: "",
        generateScore: "",
        companyName: "",
        createTime: "",
        cutPrice: "",
        date: []
      }
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getData(this.searchData);
    });
  },
  methods: {
    //   链接设备
    linkDevice() {
      this.$layout.linkDevice();
    },
    // 读卡
    toFindTheCard() {
      this.$layout.toFindTheCard();
      this.searchVipData.content = JSON.parse(
        localStorage.getItem("vipnumber")
      );
    },
    //   搜索会员
    searchVip() {
      localStorage.removeItem("vipnumber");
      this.isSearchVip = true;
      this.$http
        .post("/get_VIP_card_base", this.searchVipData)
        .then(res => {
          //   console.log(res);
          switch (res.data.status) {
            case 3001:
              this.$Notice.error({ title: "会员卡号不存在" });
              for (var key in this.vipData) {
                this.vipData[key] = "";
              }
              break;
            case 3002:
              this.$Notice.error({ title: "会员卡号已被挂失" });
              break;
            case 3003:
              this.$Notice.error({ title: "会员卡号已被禁用或者注销" });
              break;

            default:
              this.vipData = res.data.vipcustomer;
              switch (this.vipData.viplevel) {
                case "普卡":
                  this.isDiscount = "commonDiscount";
                  break;
                case "银卡":
                  this.isDiscount = "silverDiscount";
                  break;
                case "金卡":
                  this.isDiscount = "goldDiscount";
                  break;

                default:
                  break;
              }
              break;
          }
          this.isSearchVip = false;
        })
        .catch(err => {
          console.log(err);
          this.isSearchVip = false;
          this.$Notice.error({ title: "会员信息获取失败！" });
        });
    },
    // 获取数据
    getData(jsonData) {
      this.tableData = [];
      this.$http
        .post("/get_product", jsonData)
        .then(res => {
          // console.log(3,res);
          this.tableData = res.data.product;
          if (this.isSearch) {
            if (this.tableData.length > 0 && this.tableData.length < 2) {
              this.preSelection(res.data.product[0]);
            }
            this.isSearch = false;
          }
          //   分页
          this.totalPage = res.data.paginator.totalCount;
          if (res.data.paginator.totalPages > 1) {
            this.isPage = true;
          } else {
            this.isPage = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$refs.vTable.$emit("getErr");
          this.$Notice.error({ title: "商品获取失败！" });
          if (this.isSearch) {
            this.isSearch = false;
          }
        });
    },
    //   搜索商品
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
      if (this.isDiscount === "") {
        this.$Modal.warning({
          title: "消费提示",
          content: "<p>请先搜索相关会员！</p>"
        });
      } else if (goodData.stock < 1) {
        this.$Notice.warning({ title: "该商品库存不足！" });
      } else {
        if (this.addGoodsData.length == 0) {
          goodData.discount = goodData[this.isDiscount];
          goodData.singleTotal =
            goodData.productPrice * goodData[this.isDiscount];
          goodData.count = 1;
          this.orderData.totalConsumption =
            parseFloat(this.orderData.totalConsumption) + goodData.productPrice;
          this.orderData.afterDiscount =
            parseFloat(this.orderData.afterDiscount) + goodData.singleTotal;
          this.addGoodsData.push(goodData);
        } else {
          let isNewGood = true;
          this.addGoodsData.forEach(function(e) {
            if (e.productNo === goodData.productNo) {
              if (e.count + 1 > e.stock) {
                this.$Notice.warning({ title: "该商品库存不足！" });
              } else {
                e.count++;
                e.singleTotal = e.productPrice * e.count * e.discount;
                this.orderData.totalConsumption =
                  parseFloat(this.orderData.totalConsumption) + e.productPrice;
                this.orderData.afterDiscount =
                  parseFloat(this.orderData.afterDiscount) +
                  e.productPrice * e.discount;
              }
              isNewGood = false;
            }
          }, this);
          if (isNewGood) {
            goodData.count = 1;
            goodData.discount = goodData[this.isDiscount];
            goodData.singleTotal =
              goodData.productPrice * goodData[this.isDiscount];
            this.orderData.totalConsumption =
              parseFloat(this.orderData.totalConsumption) +
              goodData.productPrice;
            this.orderData.afterDiscount =
              parseFloat(this.orderData.afterDiscount) + goodData.singleTotal;
            this.addGoodsData.push(goodData);
          }
        }
      }
    },
    // 取消购买
    cancelBuy() {
      this.addGoodsData = [];
      this.orderData.totalConsumption = 0;
      this.orderData.afterDiscount = 0;
    },
    // 确定购买
    buyGoods() {
      if (this.orderData.afterDiscount > this.vipData.totalDeposits) {
        this.$Modal.warning({
          title: "兑换信息",
          content: "<p>该用户余额不足！</p>"
        });
      } else {
        //   console.log(this.addGoodsData);

        let orderDataForAdmin = this.addGoodsData.map(e => {
          return {
            customerId: this.vipData.customerId,
            productId: e.productId,
            quantity: e.count,
            seller: this.orderData.seller
          };
        });

        //   console.log(orderDataForAdmin);
        this.isKeep = true;
        // 用并发请求来改变请求头content-type
        this.$http
          .all([
            this.$http.post("/add_product_order", orderDataForAdmin),
            this.$http.post("/get_product", this.searchData)
          ])
          .then(
            this.$http.spread((acct, perms) => {
              // 两个请求现在都执行完成
              // console.log(acct, perms);
              this.orderData.totalConsumption = 0;
              this.orderData.afterDiscount = 0;
              this.isKeep = false;
              this.addGoodsData = [];
              this.$Message.success("订单提交成功！");
              this.refNo = acct.data.refNo;
              this.isRefNo = false;
              // 更新数据
              this.searchVip();
              this.getData(this.searchData);
            })
          )
          .catch(err => {
            console.log(err);
            this.isKeep = false;
            this.$Notice.error({ title: "订单提交失败！" });
          });
      }
    },
    // 显示小票信息
    showPrint() {
      this.$http
        .post("/product_print", { refNo: this.refNo })
        .then(res => {
          // console.log(res);
          this.printData = res.data.productPrint;
          this.printData.createTime = this.$layout.formatDate(
            this.printData.createTime
          );
          this.isPrint = true;
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "小票信息获取失败！" });
        });
    },
    // 打印小票
    print(id) {
      this.$layout.print(id);
    },

    // 关闭打印小票
    closePrint() {
      this.isPrint = false;
    }
  }
};
</script>
<style lang="less" scoped>
.tip {
  color: #e6451e;
  margin-bottom: 10px;
}
</style>
