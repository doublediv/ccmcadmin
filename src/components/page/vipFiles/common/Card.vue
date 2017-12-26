<template>
  <div class="consume-box">
    <p class="title">绑定会员卡号</p>
    <Form ref="cardForm" :model="cardData" :rules="cardRules" :label-width="80">
        <FormItem label="会员卡号:" prop="VIPCard">
            <Input disabled v-model="cardData.VIPCard" placeholder="请输入会员卡号"></Input>
        </FormItem>
        <FormItem label="销售人员:">
            <Input :disabled="isCard" v-model="cardData.seller" placeholder="请输入销售人员"></Input>
        </FormItem>
        <div class="buttonbox">
              <Button :disabled="isCard" type="primary" @click="linkDevice">链接设备</Button>
              <Button :disabled="isCard" type="primary" @click="toFindTheCard">双击读卡</Button>
        </div>
        <div class="buttonbox">
              <Button :disabled="isCard" type="primary" @click="resetCard('cardForm')">重置</Button>
              <Button :disabled="isCard" :loading="isKeep" type="primary" @click="keepCard('cardForm')">保存</Button>
        </div>
        <p v-show="isCard" class="tip">注：此项修改请到“会员卡账户管理” &gt; “会员卡变更”里修改</p>
    </Form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCard: false,
      cardData: {
        VIPCard: "",
        seller: "",
        customerId: ""
      },
      cardRules: {
        VIPCard: [{ required: true, message: "请输读取卡号" }]
      },
      isKeep: false
    };
  },
  created() {
    this.cardData.customerId = localStorage.getItem("vipId");
    this.getCardData();
  },
  methods: {
    // 获取卡号
    getCardData() {
      this.$http
        .post("/get_customer_VIPCard", { customerId: this.cardData.customerId })
        .then(res => {
          // console.log(res);
          if (res.data.vipCard.vipCard) {
            this.isCard = true;
            this.cardData.VIPCard = res.data.vipCard.vipCard;
            this.cardData.seller = res.data.vipCard.seller;
          }
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "卡号获取失败!" });
        });
    },
    //   链接设备
    linkDevice() {
      this.$layout.linkDevice();
    },
    // 读卡
    toFindTheCard() {
      this.$layout.toFindTheCard();
      this.cardData.VIPCard = JSON.parse(localStorage.getItem("vipnumber"));
    },
    // 重置卡号
    resetCard(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.$refs[refName].resetFields();
        }
      });
    },
    // 保存卡号
    keepCard(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          localStorage.removeItem("vipnumber");
          this.isKeep = true;
          const _this = this;
          this.$http
            .post("/bind_VIPcard", this.cardData)
            .then(function(res) {
              console.log(res);
              if (res.data.status === 1001) {
                _this.$Notice.error({ title: "绑定失败,该会员卡已存在！" });
              } else {
                _this.$Message.success("会员卡绑定成功!");
              }

              _this.isKeep = false;
            })
            .catch(function(err) {
              console.log(err);
              _this.isKeep = false;
              _this.$Notice.error({ title: "会员卡绑定失败!" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.consume-box {
  width: 420px;
  margin: 48px auto 0;
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
    margin-top: 16px;

    button {
      margin: 0 4px;
    }
  }
  .tip {
    font-size: 14px;
    text-align: center;
    margin-top: 24px;
    color: #ed3f14;
  }
}
</style>
