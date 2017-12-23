<template>
  <div class="consume-box">
    <p class="title">会员卡充值</p>
    <Form :model="searchData" inline :label-width="70">
        <FormItem label="会员搜索:">
            <Input type="text" v-model="searchData.content" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
        <Button class="singlebutton" type="primary" @click="linkDevice">连接设备</Button>
        <Button class="singlebutton" type="primary" @click="toFindTheCard">双击读卡</Button>
        <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
    </Form>
    <p class="tip">会员信息</p>
    <Form :model="vipData" inline :label-width="82">
        <FormItem label="姓名:">
            <Input disabled type="text" v-model="vipData.realName" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
        <FormItem label="性别:">
            <Input disabled type="text" v-model="vipData.gender" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
        <FormItem label="身份证:">
            <Input disabled type="text" v-model="vipData.idcard" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
        <FormItem label="会员卡号:">
            <Input disabled type="text" v-model="vipData.vipcard" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
        <FormItem label="联系电话:">
            <Input disabled type="text" v-model="vipData.tel" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
        <FormItem label="所属基站:">
            <Input disabled type="text" v-model="vipData.companyName" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
    </Form>
    <p class="tip">充值信息</p>
    <Form ref="rechargeForm" :model="rechargeData" :rules="rechargeRule" inline :label-width="82">
        <FormItem label="操作员:">
            <Input disabled type="text" v-model="rechargeData.operator" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
        <FormItem label="账户余额:">
            <Input disabled type="text" v-model="rechargeData.totalDeposits" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
        <FormItem label="充值金额:" prop="amount">
            <Input type="text" v-model="rechargeData.amount" placeholder="请输入充值金额"></Input>
        </FormItem>
        <FormItem label="付款方式:" prop="rechargeType">
            <Select v-model="rechargeData.rechargeType" placeholder="请选择充值方式" style="width:164px">
                <Option value="0">现金</Option>
                <Option value="1">刷卡</Option>
            </Select>
        </FormItem>
    </Form>
    <div class="buttonbox">
        <Button type="primary" @click="recharge('rechargeForm')">充值</Button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    // 充值金额验证
    const amountRule = (rule, value, callback) => {
      //  大于0
      let phoneReg = /^\d+(.\d{1,2})?$/;
      if (value === "") {
        callback(new Error("请输入充值金额"));
      } else if (!phoneReg.test(value)) {
        callback(new Error("请输入大于0且最多保留两位小数位"));
      } else {
        callback();
      }
    };
    return {
      searchData: {
        content: ""
      },
      isSearch: false,
      vipData: {
        vipcard: "",
        realName: "",
        idcard: "",
        gender: "",
        tel: "",
        companyName: ""
      },
      rechargeData: {
        operator: "",
        totalDeposits: "",
        amount: "",
        rechargeType: ""
      },
      rechargeRule: {
        amount: [{ required: true, validator: amountRule }],
        rechargeType: [{ required: true, message: "请选择充值方式" }]
      }
    };
  },
  methods: {
    //   链接设备
    linkDevice() {
      this.$layout.linkDevice();
    },
    // 读卡
    toFindTheCard() {
      this.$layout.toFindTheCard();
      this.searchData.content = JSON.parse(localStorage.getItem("vipnumber"));
    },
    //   搜索
    search() {
      localStorage.removeItem("vipnumber");
      this.isSearch = true;
      this.$http
        .post("/get_VIP_card_base", this.searchData)
        .then(res => {
        //   console.log(res);
          switch (res.data.status) {
            case 3001:
              this.$Notice.error({ title: "会员卡号不存在" });
              break;
            case 3002:
              this.$Notice.error({ title: "会员卡号已被挂失" });
              break;
            case 3003:
              this.$Notice.error({ title: "会员卡号已被禁用或者注销" });
              break;

            default:
              this.vipData.vipcard = res.data.vipcustomer.vipcard;
              this.vipData.realName = res.data.vipcustomer.realName;
              this.vipData.idcard = res.data.vipcustomer.idcard;
              this.vipData.gender = res.data.vipcustomer.gender;
              this.vipData.tel = res.data.vipcustomer.tel;
              this.vipData.companyName = res.data.vipcustomer.companyName;
              this.rechargeData.operator = localStorage.getItem("username");
              this.rechargeData.totalDeposits =
                res.data.vipcustomer.totalDeposits;
              break;
          }
          this.isSearch = false;
        })
        .catch(err => {
          console.log(err);
          this.isSearch = false;
          this.$Notice.error({ title: "会员信息获取失败！" });
        });
    },
    // 充值
    recharge(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          let rechargeType;
          if (this.rechargeData.rechargeType === "0") {
            rechargeType = "现金";
          } else {
            rechargeType = "刷卡";
          }
          this.$Modal.confirm({
            title: "充值信息",
            loading: true,
            content: `<p>会员姓名：${this.vipData.realName}</p>
                      <p>会员卡号：${this.vipData.vipcard}</p>
                      <p>账户余额：${this.rechargeData.totalDeposits} 元</p>
                      <p>充值余额：${this.rechargeData.amount} 元</p>
                      <p>充值方式：${rechargeType}</p>`,
            onOk: () => {
              // console.log(this.addWaiterData)
              this.$http
                .post("/recharge_VIP_card", {
                  vipCard: this.vipData.vipcard,
                  totalDeposits: this.rechargeData.amount,
                  rechargeType: this.rechargeData.rechargeType
                })
                .then(res => {
                  // console.log(res);
                  this.search();
                  this.$Message.success("充值成功！");
                  this.$Modal.remove();
                  this.$refs[refName].resetFields();
                })
                .catch(err => {
                  console.log(err);
                  this.$Notice.error({ title: "充值失败！" });
                });
            },
            onCancel: () => {
              this.$Notice.info({ title: "你取消了本次充值！" });
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.consume-box {
  width: 580px;
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

  .tip {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 24px;
  }
  .buttonbox {
    text-align: center;
    margin-top: 24px;

    button {
      margin: 0 4px;
    }
  }
}
</style>
