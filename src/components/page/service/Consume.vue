<template>
  <div class="consume-box">
    <p class="title">添加服务消费</p>
    <Form :model="searchVipData" inline :label-width="100">
        <FormItem label="会员搜索:">
            <Input type="text" v-model="searchVipData.content" placeholder="请读取卡号或输入手机号"></Input>
        </FormItem>
        <Button class="singlebutton" type="primary" @click="linkDevice">连接设备</Button>
        <Button class="singlebutton" type="primary" @click="toFindTheCard">双击读卡</Button>
        <Button class="singlebutton" icon="ios-search" :loading="isSearchVip" type="primary" @click="searchVip">搜索</Button>
    </Form>
    <Form ref="servConForm" :model="servConData" :rules="servConRule" :label-width="100">
        <FormItem label="创建人:">
            <Input disabled v-model="servConData.creater"></Input>
        </FormItem>
        <FormItem label="会员联系电话:" prop="phone">
            <Input v-model="servConData.phone" placeholder="请输入会员联系电话"></Input>
        </FormItem>
        <FormItem label="消费时间:" prop="paidTime">
            <DatePicker v-model="servConData.paidTime" @on-change="setDate" type="datetime" placeholder="请选择消费时间" style="width: 100%"></DatePicker>
        </FormItem>
        <FormItem label="服务类型:">
            <Select placeholder="请选择服务类型" style="width:100%" @on-change="getServiceItem">
                <Option v-for="item in serviceType" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="服务项目:" prop="serviceProjectId">
            <Select v-model="servConData.serviceProjectId" placeholder="请选择服务项目" :loading="isGetServiceItem" @on-change="getServicePrice" style="width:100%">
                <Option disabled v-if="serviceItem.length == 0" value="">请先选择服务类型</Option>
                <Option v-for="item in serviceItem" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="服务提供:" prop="serviceType">
            <Select v-model="servConData.serviceType" placeholder="请选择服务提供" :loading="isGetServiceItem" style="width:100%" @on-change="getWaiter">
                <Option value="1">供应商服务</Option>
                <Option value="2">本基站人员服务</Option>
            </Select>
        </FormItem>
        <FormItem label="服务人员:" prop="serviceId">
            <Select v-model="servConData.serviceId" placeholder="请选择服务人员" :loading="isGetWaiter" placement="top" style="width:100%">
                <Option disabled v-if="waiter.length == 0" value="">请先选择服务提供</Option>
                <Option v-for="item in waiter" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="收费标准:" prop="feeScale">
            <Input v-model="servConData.feeScale" disabled placeholder="请选择服务项目"></Input>
        </FormItem>
        <FormItem label="消费获得积分:" prop="obtainIntegral">
            <Input v-model="servConData.obtainIntegral" disabled placeholder="请选择服务项目"></Input>
        </FormItem>
        <div class="buttonbox">
            <Button :loading="isKeep" type="primary" @click="keepConsume('servConForm')">提交</Button>
            <!-- <Button type="ghost" @click="resetConsume('servConForm')">重置</Button> -->
        </div>
    </Form>
  </div>
</template>
<script>
export default {
  data() {
    // 联系方式验证
    const phoneRule = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入联系电话"));
      } else if (!/((^\d{11}$)|(^(\d{3,4}-)?\d{7,8}$))/.test(value)) {
        //   支持手机号码，3-4位区号，7-8位直播号码
        callback(new Error("请输入正确的联系电话"));
      } else {
        callback();
      }
    };
    return {
      serviceType: [],
      serviceItem: [],
      isGetServiceItem: false,
      waiter: [],
      isGetWaiter: false,
      searchVipData: {
        content: ""
      },
      isSearchVip: false,
      servConData: {
        creater: "",
        phone: "",
        paidTime: "",
        serviceProjectId: "",
        serviceType: "",
        serviceId: "",
        feeScale: "",
        obtainIntegral: ""
      },
      servConRule: {
        phone: [{ required: true, validator: phoneRule }],
        paidTime: [{ required: true, message: "请选择消费时间" }],
        serviceProjectId: [{ required: true, message: "请选服务项目" }],
        serviceType: [{ required: true, message: "请选服务提供" }],
        serviceId: [{ required: true, message: "请选服务人员" }],
        feeScale: [{ required: true, message: "请选服务人员" }],
        obtainIntegral: [{ required: true, message: "请选服务人员" }]
      },

      isKeep: false
    };
  },
  created() {
    this.getServiceType();
    this.servConData.creater = localStorage.getItem("username");
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
            console.log(res);
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
              this.servConData.phone = res.data.vipcustomer.tel;
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
    // 获取服务项目价格
    getServicePrice(serviceId) {
        this.servConData.feeScale = "";
      this.servConData.obtainIntegral = "";
      this.$http
        .post("/get_service_project_pay", { serviceProjectId: serviceId })
        .then(res => {
          //   console.log(res);
          this.servConData.feeScale =
            res.data.price + " / " + res.data.costType;
          this.servConData.obtainIntegral = res.data.price;
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "服务项目价格获取失败！" });
        });
    },
    // 设置时间
    setDate(date) {
      this.servConData.paidTime = Date.parse(new Date(date));
    },
    // 获取消费人员
    getWaiter() {
      this.isGetWaiter = true;
      this.waiter = [];
      if (this.servConData.serviceType === "1") {
        this.$http
          .post("/service_business_list", { limit: 999, page: 0 })
          .then(res => {
            // console.log(res);
            this.isGetWaiter = false;
            this.waiter = res.data.business.map(function(e) {
              return {
                id: e.id,
                name: e.name
              };
            });
          })
          .catch(err => {
            this.isGetWaiter = false;
            console.log(err);
            this.$Notice.error({ title: "服务人员获取失败！" });
          });
      } else {
        this.$http
          .post("/get_service_user")
          .then(res => {
            // console.log(res);
            this.isGetWaiter = false;
            this.waiter = res.data.serviceUser;
          })
          .catch(err => {
            this.isGetWaiter = false;
            console.log(err);
            this.$Notice.error({ title: "服务人员获取失败！" });
          });
      }
    },
    // 重置表单(页面数据比较复杂，重置会带来不必要的问题，比如浏览器假死)
    // resetConsume(refName) {
    //   this.$refs[refName].resetFields();
    // },
    // 提交表单
    keepConsume(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          this.$http
            .post("/add_service_order", {
              serviceProjectId: this.servConData.serviceProjectId,
              phone: this.servConData.phone,
              paidTime: this.servConData.paidTime,
              serviceId: this.servConData.serviceId,
              serviceType: this.servConData.serviceType
            })
            .then(res => {
              // console.log(res);
              this.isKeep = false;
              // this.$refs[refName].resetFields();
              this.$Message.success("服务消费添加成功！");
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "服务消费添加失败！" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.consume-box {
  width: 602px;
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
