<template>
  <div class="consume-box">
    <p class="title">会员卡变更</p>
    <Form :model="searchData" inline :label-width="80">
        <FormItem label="会员搜索:">
            <Input type="text" v-model="searchData.content" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
        <Button class="singlebutton" type="primary" @click="linkDevice">连接设备</Button>
        <Button class="singlebutton" type="primary" @click="toFindTheCard">双击读卡</Button>
        <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search(searchData)">搜索</Button>
    </Form>
    <p class="tip">会员信息</p>
    <Form :model="vipData" inline :label-width="82">
        <FormItem label="姓名:">
            <Input disabled type="text" v-model="vipData.realName" placeholder="请先搜索相关会员"></Input>
        </FormItem>
        <FormItem label="所属基站:">
            <Input disabled type="text" v-model="vipData.companyName" placeholder="请先搜索相关会员"></Input>
        </FormItem>
        <FormItem label="会员卡号:">
            <Input disabled type="text" v-model="vipData.vipcard" placeholder="请先搜索相关会员"></Input>
        </FormItem>
        <FormItem label="身份证:">
            <Input disabled type="text" v-model="vipData.idcard" placeholder="请先搜索相关会员"></Input>
        </FormItem>
        <FormItem label="会员等级:">
            <Input disabled type="text" v-model="vipData.viplevel" placeholder="请先搜索相关会员"></Input>
        </FormItem>
        <FormItem label="会员状态:">
            <Input disabled type="text" v-model="vipData.status" placeholder="请先搜索相关会员"></Input>
        </FormItem>
        <FormItem label="会员余额:">
            <Input disabled type="text" v-model="vipData.totalDeposits" placeholder="请先搜索相关会员"></Input>
        </FormItem>
        <FormItem label="会员积分:">
            <Input disabled type="text" v-model="vipData.score" placeholder="请先搜索相关会员"></Input>
        </FormItem>
        <FormItem label="办卡日期:">
            <Input disabled type="text" v-model="vipData.createTime" placeholder="请先搜索相关会员"></Input>
        </FormItem>
        <FormItem label="办卡人员:">
            <Input disabled type="text" v-model="vipData.seller" placeholder="请先搜索相关会员"></Input>
        </FormItem>
    </Form>
    <p class="tip">操作</p>
    <p class="operation-tip">当前会员状态：<span>{{ vipcardStatus }}</span></p>
    <Form ref="operationVipCardForm" :model="operationVipCardData" :rules="operationVipCardRule" inline :label-width="80">
        <FormItem label="会员状态:" prop="status">
            <Select v-model="operationVipCardData.status" placeholder="请选择会员状态" style="width:164px">
                <Option value="0">正常</Option>
                <Option value="99">挂失</Option>
                <Option value="9">注销</Option>
            </Select>
        </FormItem>
        <Button :loading="isChange" type="primary" @click="operationVipCard('operationVipCardForm')">确定</Button>
    </Form>
    <Form v-show="vipData.vipcardStatus === '挂失'" ref="reissueCardForm" :model="reissueCardData" :rules="reissueCardRule" inline :label-width="80">
        <FormItem label="补卡:" prop="newVIPCard">
            <Input type="text" v-model="reissueCardData.newVIPCard" placeholder="请读取卡号"></Input>
        </FormItem>
        <Button class="singlebutton" type="primary" @click="linkDevice">连接设备</Button>
        <Button class="singlebutton" type="primary" @click="toFindTheNewCard">双击读卡</Button>
        <Button class="singlebutton" :loading="isReissue" type="primary" @click="reissueCard('reissueCardForm')">确定</Button>
    </Form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchData: {
        content: ""
      },
      isSearch: false,
      vipData: {
        companyName: "",
        createTime: "",
        idcard: "",
        realName: "",
        score: "",
        seller: "",
        totalDeposits: "",
        vipcard: "",
        status: "",
        viplevel: ""
      },
      vipcardStatus: "请先搜索相关会员",
      operationVipCardData: {
        status: ""
      },
      operationVipCardRule: {
        status: [{ required: true, message: "请选择会员状态" }]
      },
      isChange: false,
      reissueCardData: {
        newVIPCard: ""
      },
      reissueCardRule: {
        newVIPCard: [{ required: true, message: "请读取卡号" }]
      },
      isReissue: false
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
    // 读新卡
    toFindTheNewCard() {
      this.$layout.toFindTheCard();
      this.reissueCardData.newVIPCard = JSON.parse(
        localStorage.getItem("vipnumber")
      );
    },
    //   搜索
    search(jsonData) {
      localStorage.removeItem("vipnumber");
      this.isSearch = true;
      this.$http
        .post("/get_VIP_card", jsonData)
        .then(res => {
          //   console.log(res);
          switch (res.data.status) {
            case 3001:
              this.$Notice.error({ title: "会员卡号不存在" });
              for(var key in this.vipData) {
                this.vipData[key] = ""
              }
              this.vipcardStatus = "会员不存在"

              break;
            default:
              this.vipData = res.data.vipcustomer;
              if (this.vipData.status == "0") {
                this.vipData.status = "正常";
              } else if (this.vipData.status == "99") {
                this.vipData.status = "挂失";
              } else {
                this.vipData.status = "注销";
              }
              this.vipcardStatus = this.vipData.status
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
    // 更改会员状态
    operationVipCard(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isChange = true;
          this.$http
            .post("/change_VIP_card_base", {
              VIPCard: this.vipData.vipcard,
              status: this.operationVipCardData.status
            })
            .then(res => {
              // console.log(res);
              this.search(this.searchData);
              this.isChange = false;
              this.$Message.success("会员卡状态变更成功！");
              this.$refs[refName].resetFields();
            })
            .catch(err => {
              this.isChange = false;
              console.log(err);
              this.$Notice.error({ title: "会员卡状态变更失败！" });
            });
        }
      });
    },
    // 补卡
    reissueCard(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          localStorage.removeItem("vipnumber");
          this.isReissue = true;
          this.$http
            .post("/replace_VIP_card", {
              oldVIPCard: this.vipData.vipcard,
              newVIPCard: this.reissueCardData.newVIPCard
            })
            .then(res => {
              // console.log(res);
              this.search({ content: this.reissueCardData.newVIPCard });
              this.isReissue = false;
              this.$Message.success("补卡成功！");
              this.$refs[refName].resetFields();
            })
            .catch(err => {
              this.isReissue = false;
              console.log(err);
              this.$Notice.error({ title: "补卡失败！" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.consume-box {
  width: 590px;
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
  .operation-tip {
    color: #0b9595;
    margin-bottom: 14px;

    span {
      margin-left: 4px;
      color: #e6451e;
    }
  }
}
</style>
