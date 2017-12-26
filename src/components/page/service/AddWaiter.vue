<template>
  <div class="consume-box">
    <p class="title">添加服务人员</p>
    <Form ref="addWaiterForm" :model="addWaiterData" :rules="addWaiterRule" :label-width="80">
        <FormItem label="姓名:" prop="name">
            <Input v-model="addWaiterData.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="联系电话:" prop="tel">
            <Input v-model="addWaiterData.tel" placeholder="请输入联系电话"></Input>
        </FormItem>
        <FormItem label="身份证号:" prop="idCard">
            <Input v-model="addWaiterData.idCard" placeholder="请输入身份证号"></Input>
        </FormItem>
        <FormItem label="住址:" prop="address">
            <Input v-model="addWaiterData.address" placeholder="请输入住址"></Input>
        </FormItem>
        <FormItem label="服务类型:">
            <Select placeholder="请选择服务类型" style="width:100%" @on-change="getServiceItem">
                <Option v-for="item in serviceType" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="服务项目:" prop="serviceProjectId">
            <Select v-model="addWaiterData.serviceProjectId" placeholder="请选择服务项目" :loading="isGetServiceItem" style="width:100%">
                <Option disabled v-if="serviceItem.length == 0" value="">请先选择服务类型</Option>
                <Option v-for="item in serviceItem" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <upload-pic :fileType="fileType" :fatherPicUrl="addWaiterData.picUrl" @upSuccess="setPicUrl"></upload-pic>
        <div class="buttonbox">
            <Button type="ghost" @click="resetWaiter('addWaiterForm')">重置</Button>
            <Button :loading="isKeep" type="primary" @click="addWaiter('addWaiterForm')">提交</Button>
        </div>
    </Form>
  </div>
</template>
<script>
import uploadPic from "../../common/UploadPic.vue";
export default {
  components: { uploadPic },
  data() {
    // 联系方式验证
    const phoneRule = (rule, value, callback) => {
      //   支持手机号码，3-4位区号，7-8位直播号码
      let phoneReg = /((^\d{11}$)|(^(\d{3,4}-)?\d{7,8}$))/;
      if (value === "") {
        callback(new Error("请输入联系电话"));
      } else if (!phoneReg.test(value)) {
        callback(new Error("请输入正确的联系电话"));
      } else {
        callback();
      }
    };
    // 身份证验证
    const idCardRule = (rule, value, callback) => {
      //   15/17+加校验码
      let idCardReg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
      if (value === "") {
        callback(new Error("请输入身份证号"));
      } else if (!idCardReg.test(value)) {
        callback(new Error("请输入正确的身份证号"));
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
      addWaiterData: {
        name: "",
        tel: "",
        idCard: "",
        address: "",
        serviceProjectId: "",
        picUrl: ""
      },
      addWaiterRule: {
        name: [{ required: true, message: "请输入姓名" }],
        tel: [{ required: true, validator: phoneRule }],
        idCard: [{ required: true, validator: idCardRule }],
        address: [{ required: true, message: "请输入住址" }],
        serviceProjectId: [{ required: true, message: "请选服务项目" }]
      },
      fileType: {
        fileType: 2
      },

      isKeep: false
    };
  },
  created() {
    this.getServiceType();
  },
  methods: {
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

    // 获取上传图片的地址
    setPicUrl(imgUrl) {
      this.addWaiterData.picUrl = imgUrl;
    },

    // 重置表单
    resetWaiter(refName) {
      this.$refs[refName].resetFields();
    },
    // 提交表单
    addWaiter(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          // console.log(this.addWaiterData)
          this.$http
            .post("/add_service_user", this.addWaiterData)
            .then(res => {
              // console.log(res);
              this.isKeep = false;
              this.$refs[refName].resetFields();
              this.$Message.success("新增服务人员成功！");
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "新增服务人员失败！" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.consume-box {
  width: 460px;
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
