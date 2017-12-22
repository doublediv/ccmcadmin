<template>
  <div class="consume-box">
    <p class="title">添加商品目录</p>
    <Form ref="addGoodsNameForm" :model="addGoodsNameData" :rules="addGoodsNameRule" :label-width="120">
        <Row :gutter="16">
            <Col span="12">
                <FormItem label="商品一级类目:">
                    <Select placeholder="请选择商品一级类目" style="width:100%" @on-change="getGoodsTwo">
                        <Option v-for="item in goodsOne" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="商品二级类目:" prop="productCategory">
                    <Select v-model="addGoodsNameData.productCategory" placeholder="请选择商品二级类目" :loading="isGetGoodsTwo" style="width:100%">
                        <Option disabled v-if="goodsTwo.length == 0" value="">请先商品一级类目</Option>
                        <Option v-for="item in goodsTwo" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="商品名称:" prop="name">
                    <Input v-model="addGoodsNameData.name" placeholder="请输入商品名称"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="商品编号:" prop="number">
                    <Input v-model="addGoodsNameData.number" placeholder="请输入商品编号"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="商品进价:" prop="purchasePrice">
                    <Input v-model="addGoodsNameData.purchasePrice" placeholder="请输入商品进价"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="商品售价:" prop="originalPrice">
                    <Input v-model="addGoodsNameData.originalPrice" placeholder="请输入商品售价"></Input>
                </FormItem>
            </Col>
        </Row>
        <FormItem label="参与积分兑换:" prop="isScore">
            <RadioGroup v-model="addGoodsNameData.isScore" @on-change="changeIsCanScore">
                <Radio label="1">是</Radio>
                <Radio label="99">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="兑换所需积分:" prop="score">
            <Input :disabled="isCanScore" type="text" v-model="addGoodsNameData.score" placeholder="请输入兑换所需积分"></Input>
        </FormItem>
        <FormItem label="参与会员优惠:" prop="isVip">
            <RadioGroup v-model="addGoodsNameData.isVip" @on-change="changeIsCanVip">
                <Radio label="1">是</Radio>
                <Radio label="99">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="金卡折扣:" prop="goldDiscount">
            <Input :disabled="isCanVip" type="text" v-model="addGoodsNameData.goldDiscount" placeholder="请输入金卡折扣"></Input>
        </FormItem>
        <FormItem label="银卡折扣:" prop="silverDiscount">
            <Input :disabled="isCanVip" type="text" v-model="addGoodsNameData.silverDiscount" placeholder="请输入银卡折扣"></Input>
        </FormItem>
        <FormItem label="普卡折扣:" prop="commonDiscount">
            <Input :disabled="isCanVip" type="text" v-model="addGoodsNameData.commonDiscount" placeholder="请输入普卡折扣"></Input>
        </FormItem>

        <div class="buttonbox">
            <Button type="ghost" @click="resetGoodsName('addGoodsNameForm')">重置</Button>
            <Button :loading="isKeep" type="primary" @click="addGoodsName('addGoodsNameForm')">提交</Button>
        </div>
    </Form>
  </div>
</template>
<script>
export default {
  data() {
    //   验证折扣
    const discountRule = (rule, value, callback) => {
      //   支持手机号码，3-4位区号，7-8位直播号码
      let discountReg = /((^[0|1]$)|(^0\.\d{1,2}$))/;
      if (value === "") {
        callback(new Error("请输入对应折扣"));
      } else if (!discountReg.test(value)) {
        callback(new Error("请输入正确的0到1的数字,且最多保留两位小数位"));
      } else {
        callback();
      }
    };
    return {
      goodsOne: [],
      goodsTwo: [],
      isGetGoodsTwo: false,
      isCanScore: true,
      isCanVip: true,
      addGoodsNameData: {
        productCategory: "",
        name: "",
        number: "",
        purchasePrice: "",
        originalPrice: "",
        isScore: "99",
        score: "0",
        isVip: "99",
        goldDiscount: "1",
        silverDiscount: "1",
        commonDiscount: "1"
      },
      addGoodsNameRule: {
        productCategory: [{ required: true, message: "请选择商品二级类目" }],
        name: [{ required: true, message: "请输入商品名称" }],
        number: [{ required: true, message: "请输入商品编号" }],
        purchasePrice: [{ required: true, message: "请输入商品进价" }],
        originalPrice: [{ required: true, message: "请输入商品售价" }],
        isScore: [{ required: true, message: "请选择是否参与积分兑换" }],
        score: [{ required: true, message: "请输入兑换所需积分" }],
        isVip: [{ required: true, message: "请选择参与会员优惠" }],
        goldDiscount: [{ required: true, validator: discountRule }],
        silverDiscount: [{ required: true, validator: discountRule }],
        commonDiscount: [{ required: true, validator: discountRule }]
      },
      isKeep: false
    };
  },
  created() {
    this.getGoodsOneData();
  },
  methods: {
    //   获取一级类目
    getGoodsOneData() {
      this.$http
        .post("/product_category_one_list")
        .then(res => {
          // console.log(res);
          this.goodsOne = res.data.productCategoryOne.map(function(e) {
            return {
              id: e.id,
              name: e.name
            };
          });
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "商品一级类目获取失败！" });
        });
    },
    //   根据一级目录查询二级目录
    getGoodsTwo(goodsOneId) {
      this.isGetGoodsTwo = true;
      this.$http
        .post("/get_product_category_two", { productCategoyOneId: goodsOneId })
        .then(res => {
          //   console.log(res);
          this.isGetGoodsTwo = false;
          this.goodsTwo = res.data.productCategoryList.map(function(e) {
            return {
              id: e.id,
              name: e.name
            };
          });
        })
        .catch(err => {
          console.log(err);
          this.isGetGoodsTwo = false;
          this.$Notice.error({ title: "商品一级类目获取失败！" });
        });
    },

    // 是否参与积分兑换
    changeIsCanScore(value) {
      if (value === "1") {
        this.isCanScore = false;
      } else {
        this.isCanScore = true;
        this.addGoodsNameData.score = 0;
      }
    },
    // 是否参与会员优惠
    changeIsCanVip(value) {
      if (value === "1") {
        this.isCanVip = false;
      } else {
        this.isCanVip = true;
        this.addGoodsNameData.goldDiscount = 1;
        this.addGoodsNameData.silverDiscount = 1;
        this.addGoodsNameData.commonDiscount = 1;
      }
    },
    // 重置表单
    resetGoodsName(refName) {
      this.$refs[refName].resetFields();
    },
    // 添加商品名录
    addGoodsName(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          console.log(this.addGoodsNameData);
          this.$http
            .post("/add_product", this.addGoodsNameData)
            .then(res => {
              // console.log(res);
              this.isCanScore = true;
              this.isCanVip = true;
              this.isKeep = false;
              this.$refs[refName].resetFields();
              this.$Message.success("新增商品名录成功！");
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "新增商品名录失败！" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.consume-box {
  width: 650px;
  margin: 24px auto 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 30px;

  .title {
    font-size: 16px;
    margin-bottom: 24px;
    color: #0b9595;
    text-align: center;
  }

  .buttonbox {
    text-align: center;

    button {
      margin: 0 4px;
    }
  }
}
</style>
