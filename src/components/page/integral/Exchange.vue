<template>
  <div>
    <Row :gutter="24">
      <Col span="11">
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
          <Tabs value="goods">
              <TabPane label="兑换商品" name="goods">
                  <Form :model="searchGoodsData" inline :label-width="70">
                      <FormItem label="商品编码:">
                          <Input type="text" v-model="searchGoodsData.productNo" placeholder="按商品编码搜索" @on-enter="searchGoods"></Input>
                      </FormItem>
                      <Button class="singlebutton" icon="ios-search" :loading="isGoodsSearch" type="primary" @click="searchGoods">搜索</Button>
                  </Form>
                  <p class="tip">请选择要兑换的商品</p>
                  <Table ref="goodsTable" :columns="goodsTableColumns" :data="goodsTableData" :no-data-text="goodsDefaultText" @on-row-click="goodsPreSelection" border></Table>
                  <Page class="page" v-if="isGoodsPage" :total="goodsTotalPage" :page-size="10" @on-change="goodsChangePage"></Page>
              </TabPane>
              <TabPane label="兑换服务" name="service">
                  <Form :model="searchServiceData" inline :label-width="80">
                      <FormItem label="服务类型:">
                          <Select v-model="searchServiceData.serviceCategoryId" placeholder="请选择服务类型" @on-change="getServiceItem" style="width:164px">
                              <Option value="">请选择</Option>
                              <Option v-for="item in serviceType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                          </Select>
                      </FormItem>
                      <FormItem label="服务项目:" >
                          <Select v-model="searchServiceData.projectId" placeholder="请选择服务项目" :loading="isGetServiceItem" style="width:164px">
                              <Option value="">请选择</Option>
                              <Option disabled v-if="serviceItem.length == 0" value="">请先选择服务类型</Option>
                              <Option v-for="item in serviceItem" :value="item.id" :key="item.id">{{ item.name }}</Option>
                          </Select>
                      </FormItem>
                      <Button class="singlebutton" icon="ios-search" :loading="isServiceSearch" type="primary" @click="searchService">搜索</Button>
                  </Form>
                  <p class="tip">请选择要兑换的服务</p>
                  <Table ref="serviceTable" :columns="serviceTableColumns" :data="serviceTableData" :no-data-text="serviceDefaultText" @on-row-click="servicePreSelection" border></Table>
                  <Page class="page" v-if="isServicePage" :total="serviceTotalPage" :page-size="10" @on-change="serviceChangePage"></Page>
              </TabPane>
          </Tabs>
          
      </Col>
      <Col span="13">
          <p class="tip">准备兑换的商品</p>
          <Table ref="addGoodsTable" :columns="addGoodsColumns" :data="addGoodsData" height="250" border></Table>
          <p class="tip">&nbsp;</p>
          <p class="tip">准备兑换的服务</p>
          <Table ref="addServiceTable" :columns="addServiceColumns" :data="addServiceData" height="250" border></Table>
          <p class="tip">&nbsp;</p>
          <p class="tip">订单信息</p>
          <Form :model="orderData" inline :label-width="90">
            <Row>
              <Col span="24">
                <FormItem label="消费总积分:">
                    <Input disabled type="text" v-model="orderData.totalConsumption"></Input>
                </FormItem>
                <FormItem label="销售人员:">
                    <Input type="text" v-model="orderData.seller" placeholder="请输入销售人员"></Input>
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem>
                    <Button class="singlebutton" :loading="isKeep" type="primary" @click="buyGoods">确定兑换</Button>
                    <Button class="singlebutton" type="ghost" @click="cancelBuy">取消兑换</Button>
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
          <h3 style="font-size: 16px; text-align: center; margin-bottom: 10px; font-weight: 700">CCMC-康养驿站</h3>
          <hr style="height: 2px; border: none; border-top: 2px dashed #333; margin: 10px 0" />
          <p>No.{{refNo}}</p>
          <hr style="height: 2px; border: none; border-top: 2px dashed #333; margin: 10px 0" />
          <p>
            <span style="display: inline-block; width: 24%; text-align: center">兑换项目</span>
            <span style="display: inline-block; width: 24%; text-align: center">兑换类型</span>
            <span style="display: inline-block; width: 24%; text-align: center">数量</span>
            <span style="display: inline-block; width: 24%; text-align: center">所需积分</span>
          </p>
          <p v-for="item in printData" :key="item.id">
            <span style="display: inline-block; width: 24%; text-align: center">{{item.name}}</span>
            <span style="display: inline-block; width: 24%; text-align: center">{{item.exchangeType}}</span>
            <span style="display: inline-block; width: 24%; text-align: center">{{item.quantity}}</span>
            <span style="display: inline-block; width: 24%; text-align: center">{{item.paidScore}}</span>
          </p>
          <hr style="height: 2px; border: none; border-top: 2px dashed #333; margin: 10px 0" />
          <p style="text-align: right; margin-right: 20px">总消费积分：{{this.totalPaidScore}}</p>
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
      searchGoodsData: {
        productNo: "",
        limit: 10,
        page: 0
      },
      isGoodsSearch: false,
      goodsTableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "商品名称", key: "productName", align: "center" },
        { title: "商品条码", key: "productNo", align: "center", width: "200" },
        { title: "商品单价", key: "purchasePrice", align: "center" },
        { title: "积分兑换", key: "isCanScore", align: "center" },
        { title: "所需积分", key: "score", align: "center" },
        { title: "库存", key: "stock", align: "center" }
      ],
      goodsTableData: [],
      goodsDefaultText: "加载中...",
      goodsTotalPage: 0,
      isGoodsPage: false,
      goodsOldNum: 0,
      addGoodsColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "商品名称", key: "productName", align: "center" },
        { title: "商品条码", key: "productNo", align: "center", width: "200" },
        { title: "商品单价", key: "purchasePrice", align: "center" },
        { title: "所需积分", key: "score", align: "center" },
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
                    this.goodsOldNum = event.target.value;
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
                      this.addGoodsData[params.index].count * params.row.score;
                    //           this.orderData.totalConsumption =
                    // parseFloat(this.orderData.totalConsumption) + goodData.score;
                    if (
                      this.addGoodsData[params.index].count > this.goodsOldNum
                    ) {
                      this.orderData.totalConsumption =
                        parseFloat(this.orderData.totalConsumption) +
                        params.row.score *
                          (this.addGoodsData[params.index].count -
                            this.goodsOldNum);
                    } else {
                      this.orderData.totalConsumption =
                        parseFloat(this.orderData.totalConsumption) -
                        params.row.score *
                          (this.goodsOldNum -
                            this.addGoodsData[params.index].count);
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
                        params.row.score * params.row.count;
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
      serviceType: [],
      serviceItem: [],
      isGetServiceItem: false,
      searchServiceData: {
        serviceCategoryId: "",
        projectId: "",
        limit: 10,
        page: 0
      },
      isServiceSearch: false,
      serviceTableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "服务类型", key: "serviceCategoryName", align: "center" },
        { title: "服务项目", key: "name", align: "center" },
        { title: "服务收费", key: "priceType", align: "center" },
        { title: "积分兑换", key: "isCanScore", align: "center" },
        { title: "所需积分", key: "score", align: "center" }
      ],
      serviceTableData: [],
      serviceDefaultText: "加载中...",
      serviceTotalPage: 0,
      isServicePage: false,
      serviceOldNum: 0,
      addServiceColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "服务类型", key: "serviceCategoryName", align: "center" },
        { title: "服务项目", key: "name", align: "center" },
        { title: "服务收费", key: "priceType", align: "center" },
        { title: "所需积分", key: "score", align: "center" },
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
                  value: this.addServiceData[params.index].count
                },
                on: {
                  "on-focus": event => {
                    this.serviceOldNum = event.target.value;
                  },
                  "on-blur": event => {
                    if (event.target.value < 1) {
                      this.$Notice.error({ title: "商品兑换数量最小为1！" });
                      this.addServiceData[params.index].count = 1;
                    } else {
                      this.addServiceData[params.index].count =
                        event.target.value;
                    }
                    this.addServiceData[params.index].singleTotal =
                      this.addServiceData[params.index].count *
                      params.row.score;

                    if (
                      this.addServiceData[params.index].count >
                      this.serviceOldNum
                    ) {
                      this.orderData.totalConsumption =
                        parseFloat(this.orderData.totalConsumption) +
                        params.row.score *
                          (this.addServiceData[params.index].count -
                            this.serviceOldNum);
                    } else {
                      this.orderData.totalConsumption =
                        parseFloat(this.orderData.totalConsumption) -
                        params.row.score *
                          (this.serviceOldNum -
                            this.addServiceData[params.index].count);
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
                  value: this.addServiceData[params.index].singleTotal
                },
                on: {
                  "on-change": event => {
                    this.addServiceData[params.index].singleTotal =
                      event.target.value;
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
                      this.addServiceData.splice(params.index, 1);
                      this.orderData.totalConsumption =
                        parseFloat(this.orderData.totalConsumption) -
                        params.row.score * params.row.count;
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      addServiceData: [],
      orderData: {
        totalConsumption: 0,
        seller: ""
      },
      isKeep: false,
      isRefNo: true,
      refNo: "",
      isPrint: false,
      totalPaidScore: "",
      printData: []
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getGoodsData(this.searchGoodsData);
      this.getServiceData(this.searchServiceData);
      this.getServiceType();
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
    // 获取商品数据
    getGoodsData(jsonData) {
      const _this = this;
      this.goodsTableData = [];
      this.$http
        .post("/get_product", jsonData)
        .then(function(res) {
          //   console.log(res)
          _this.goodsTableData = res.data.product.map(e => {
            if (e.isScore == 1) {
              e.isCanScore = "是";
            } else {
              e.isCanScore = "否";
            }
            return e;
          });

          if (_this.isGoodsSearch) {
            if (
              _this.goodsTableData.length > 0 &&
              _this.goodsTableData.length < 2
            ) {
              _this.goodsPreSelection(res.data.product[0]);
            }
            _this.isGoodsSearch = false;
          }
          //   分页
          _this.goodsTotalPage = res.data.paginator.totalCount;
          if (res.data.paginator.totalPages > 1) {
            _this.isGoodsPage = true;
          } else {
            _this.isGoodsPage = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.goodsDefaultText = "数据获取失败";
          _this.$Notice.error({ title: "商品获取失败！" });
          if (_this.isGoodsSearch) {
            _this.isGoodsSearch = false;
          }
        });
    },
    //   搜索商品
    searchGoods() {
      this.isGoodsSearch = true;
      this.isGoodsPage = false;
      this.goodsTableData = [];
      this.getGoodsData(this.searchGoodsData);
    },
    // 商品选页
    goodsChangePage(pageNum) {
      this.getGoodsData({ limit: 10, page: pageNum });
    },
    // 预挑选商品
    goodsPreSelection(goodData) {
      if (this.vipData.customerId === "") {
        this.$Modal.warning({
          title: "消费提示",
          content: "<p>请先搜索相关会员！</p>"
        });
      } else if (goodData.isCanScore === "否") {
        this.$Notice.warning({ title: "该商品不支持积分兑换！" });
      } else if (goodData.stock < 1) {
        this.$Notice.warning({ title: "该商品库存不足！" });
      } else if (this.addGoodsData.length == 0) {
        goodData.count = 1;
        goodData.singleTotal = goodData.score;
        this.addGoodsData.push(goodData);
        this.orderData.totalConsumption =
          parseFloat(this.orderData.totalConsumption) + goodData.score;
      } else {
        let isNewGood = true;
        this.addGoodsData.forEach(eGoods => {
          if (eGoods.productNo === goodData.productNo) {
            if (eGoods.count + 1 > eGoods.stock) {
              this.$Notice.warning({ title: "该商品库存不足！" });
            } else {
              eGoods.count++;
              this.orderData.totalConsumption =
                parseFloat(this.orderData.totalConsumption) + eGoods.score;
            }
            eGoods.singleTotal = eGoods.score * eGoods.count;
            isNewGood = false;
          }
        });
        if (isNewGood) {
          goodData.count = 1;
          goodData.singleTotal = goodData.score;
          this.addGoodsData.push(goodData);
          this.orderData.totalConsumption =
            parseFloat(this.orderData.totalConsumption) + goodData.score;
        }
      }
    },
    // 获取服务数据
    getServiceData(jsonData) {
      const _this = this;
      this.serviceTableData = [];
      this.$http
        .post("/service_project_list", jsonData)
        .then(function(res) {
          // console.log(res)
          _this.serviceTableData = res.data.serviceCategory.map(e => {
            if (e.isScore == 1) {
              e.isCanScore = "是";
            } else {
              e.isCanScore = "否";
            }
            switch (e.costType) {
              case 1:
                e.priceType = e.price + " 元 / 天";
                break;
              case 2:
                e.priceType = e.price + " 元 / 小时";
                break;
              case 3:
                e.priceType = e.price + " 元 / 次";
                break;

              default:
                break;
            }
            return e;
          });

          if (_this.isServiceSearch) {
            _this.isServiceSearch = false;
          }
          //   分页
          _this.serviceTotalPage = res.data.paginator.totalCount;
          if (res.data.paginator.totalPages > 1) {
            _this.isServicePage = true;
          } else {
            _this.isServicePage = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.serviceDefaultText = "数据获取失败";
          _this.$Notice.error({ title: "服务获取失败！" });
          if (_this.isServiceSearch) {
            _this.isServiceSearch = false;
          }
        });
    },
    // 获取服务类型
    getServiceType() {
      this.$http
        .post("/service_category_list")
        .then(res => {
          //   console.log(res);
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
          //   console.log(res);
          this.isGetServiceItem = false;
          this.serviceItem = res.data.serviceCategory;
        })
        .catch(err => {
          console.log(err);
          this.isGetServiceItem = false;
          this.$Notice.error({ title: "服务项目列表获取失败！" });
        });
    },
    //   搜索服务
    searchService() {
      this.isServiceSearch = true;
      this.isServicePage = false;
      this.serviceTableData = [];
      this.getServiceData(this.searchServiceData);
    },
    // 服务选页
    serviceChangePage(pageNum) {
      this.getServiceData({ limit: 10, page: pageNum });
    },
    // 预挑选服务
    servicePreSelection(serviceData) {
      if (this.vipData.customerId === "") {
        this.$Modal.warning({
          title: "消费提示",
          content: "<p>请先搜索相关会员！</p>"
        });
      } else if (serviceData.isCanScore === "否") {
        this.$Notice.warning({ title: "该服务不支持积分兑换！" });
      } else if (this.addServiceData.length == 0) {
        serviceData.count = 1;
        serviceData.singleTotal = serviceData.score;
        this.addServiceData.push(serviceData);
        this.orderData.totalConsumption =
          parseFloat(this.orderData.totalConsumption) + serviceData.score;
      } else {
        let isNewService = true;
        this.addServiceData.forEach(eService => {
          if (eService.name === serviceData.name) {
            eService.count++;
            this.orderData.totalConsumption =
              parseFloat(this.orderData.totalConsumption) + eService.score;

            eService.singleTotal = eService.score * eService.count;
            isNewService = false;
          }
        });
        if (isNewService) {
          serviceData.count = 1;
          serviceData.singleTotal = serviceData.score;
          this.addServiceData.push(serviceData);
          this.orderData.totalConsumption =
            parseFloat(this.orderData.totalConsumption) + serviceData.score;
        }
      }
    },
    // 取消兑换
    cancelBuy() {
      this.addGoodsData = [];
      this.addServiceData = [];
      this.orderData.totalConsumption = 0;
    },
    // 确定兑换
    buyGoods() {
      if (this.orderData.totalConsumption > this.vipData.score) {
        this.$Modal.warning({
          title: "兑换信息",
          content: "<p>该用户积分不足！</p>"
        });
      } else {
        let orderGoodsDataForAdmin = this.addGoodsData.map(e => {
          return {
            customerId: this.vipData.customerId,
            paidScore: e.score,
            quantity: e.count,
            otherId: e.productId,
            exchangeType: 1,
            seller: this.orderData.seller
          };
        });

        let orderServiceDataForAdmin = this.addServiceData.map(e => {
          return {
            customerId: this.vipData.customerId,
            paidScore: e.score,
            quantity: e.count,
            otherId: e.id,
            exchangeType: 2,
            seller: this.orderData.seller
          };
        });

        let exchangeOrder = orderGoodsDataForAdmin.concat(
          orderServiceDataForAdmin
        );
        orderGoodsDataForAdmin = orderServiceDataForAdmin = null;

        // console.log(exchangeOrder)

        this.isKeep = true;
        // 用并发请求来改变请求头content-type
        this.$http
          .all([
            this.$http.post("/exchange_score", exchangeOrder),
            this.$http.post("/get_product", this.searchGoodsData)
          ])
          .then(
            this.$http.spread((acct, perms) => {
              // 两个请求现在都执行完成
              // console.log(acct, perms);
              this.addGoodsData = [];
              this.addServiceData = [];
              this.orderData.totalConsumption = 0;
              this.isKeep = false;
              this.$Message.success("订单提交成功！");
              this.refNo = acct.data.refNo;
              this.isRefNo = false;
              // 更新数据
              this.getGoodsData(this.searchGoodsData);
              this.searchVip();
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
        .post("/exchange_print", { refNo: this.refNo })
        .then(res => {
          // console.log(res);
          this.printData = res.data.exchangePrint.data;
          this.totalPaidScore = res.data.exchangePrint.totalPaidScore;
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
.buttonbox {
  margin-top: 24px;
}
</style>
