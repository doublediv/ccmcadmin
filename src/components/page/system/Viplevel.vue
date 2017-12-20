<template>
    <div class="viplevel">
        <p class="title">会员卡级别设置</p>
        <p class="tip"><span class="level">级别</span><span class="text">一次性充值钱数</span></p>
        <Form :model="vipLevelData" :label-width="40">
            <FormItem label="普卡:">
                <Input :disabled="isAbleEdit" v-model="vipLevelData.commonvip"><span slot="append">元</span></Input>
            </FormItem>
            <FormItem label="银卡:">
                <Input :disabled="isAbleEdit" v-model="vipLevelData.silvervip"><span slot="append">元</span></Input>
            </FormItem>
            <FormItem label="金卡:">
                <Input :disabled="isAbleEdit" v-model="vipLevelData.goldvip"><span slot="append">元</span></Input>
            </FormItem>
            <div class="button-box">
                <Button type="primary" @click="editVipLevel">编辑</Button>
                <Button type="primary" :loading="isKeep"  @click="keepVipLevel">保存</Button>
            </div>
        </Form>
    </div>
</template>
<script>
export default {
  data() {
    return {
      vipLevelData: {
        commonvip: "",
        silvervip: "",
        goldvip: ""
      },
      isAbleEdit: true,
      isKeep: false
    };
  },
  created() {
    this.getVipLevelData();
  },
  methods: {
    // 获取会员卡级别
    getVipLevelData() {
      const _this = this;
      this.$http
        .post("/get_VIP_card_level")
        .then(function(res) {
          //   console.log(res);
          _this.vipLevelData.commonvip = res.data.VIPCardLevel.commonvip;
          _this.vipLevelData.silvervip = res.data.VIPCardLevel.silvervip;
          _this.vipLevelData.goldvip = res.data.VIPCardLevel.goldvip;
        })
        .catch(function(err) {
          console.log(err);
          _this.$Notice.error({ title: "会员卡级别获取失败！" });
        });
    },
    // 编辑
    editVipLevel() {
      this.isAbleEdit = false;
    },
    // 保存
    keepVipLevel() {
      this.isKeep = true;
      const _this = this;
      this.$http
        .post("/modify_VIP_card_level", this.vipLevelData)
        .then(function(res) {
          //   console.log(res);
          _this.isAbleEdit = true;
          _this.$Message.success("保存成功!");
          _this.isKeep = false;
        })
        .catch(function(err) {
          console.log(err);
          _this.isKeep = false;
          _this.$Notice.error({ title: "保存失败!" });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.viplevel {
  width: 360px;
  margin: 30px auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;

  .title {
    text-align: center;
    color: #0b9595;
    font-size: 18px;
  }

  .tip {
    margin: 20px 0 10px;
    color: #e6451e;

    .level {
      display: inline-block;
      width: 40px;
      margin-right: 10px;
    }
  }

  .button-box {
    text-align: center;
  }
}
</style>
