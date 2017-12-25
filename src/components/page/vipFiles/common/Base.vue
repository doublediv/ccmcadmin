<template>
    <Form ref="baseForm" :model="baseData" :rules="baseRule" :label-width="90">
        <Row class-name="three-column" :gutter="104">
            <Col :xs="24" :md="8">
                <p class="tip">个人信息</p>
                <FormItem label="会员姓名:" prop="realName">
                    <Input v-model="baseData.realName" placeholder="请输入会员姓名"></Input>
                </FormItem>
                <FormItem label="身份证号:" prop="idCard">
                    <Input v-model="baseData.idCard" placeholder="请输入身份证号"></Input>
                </FormItem>
                <FormItem label="联系电话:" prop="tel">
                    <Input v-model="baseData.tel" placeholder="请输入联系电话"></Input>
                </FormItem>
                <FormItem label="性别:">
                    <RadioGroup v-model="baseData.gender">
                        <Radio label="1">男</Radio>
                        <Radio label="2">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="年龄:">
                    <Input v-model="baseData.age" placeholder="请输入年龄"></Input>
                </FormItem>
                <FormItem label="民族:">
                    <Input v-model="baseData.nation" placeholder="请输入民族"></Input>
                </FormItem>
                <FormItem label="家庭住址:">
                    <Select v-model="baseData.province" placeholder="请选择省" placement="top" @on-change="selectCity" style="width: 100%">
                        <Option v-for="(item, index) in provinceList" :value="item.name" :key="index">{{ item.name }}</Option>  
                    </Select>
                    <Select :disabled="isZxs" v-model="baseData.city" placeholder="请选择市" placement="top" @on-change="selectArea" style="width: 100%">
                        <Option v-for="(item, index) in city" :value="item.name" :key="index">{{ item.name }}</Option>
                    </Select>
                    <Select v-model="baseData.area" placeholder="请选择区" placement="top" style="width: 100%">
                        <Option v-for="(item, index) in area" :value="item.name" :key="index">{{ item.name }}</Option>
                    </Select>
                    <Input v-model="baseData.address" placeholder="请输入门牌号"></Input>
                </FormItem>
                <FormItem label="婚姻状况:">
                    <Input v-model="baseData.marriage" placeholder="请输入婚姻状况"></Input>
                </FormItem>
            </Col>
            <Col :xs="24" :md="8" class-name="second-column">
                <p class="tip">紧急联系人</p>
                <FormItem label="紧急联系人:" prop="conname">
                    <Input v-model="baseData.conname" placeholder="请输入紧急联系人"></Input>
                </FormItem>
                <FormItem label="联系电话:" prop="contel">
                    <Input v-model="baseData.contel" placeholder="请输入联系电话"></Input>
                </FormItem>
                <p class="tip">服务信息</p>
                <FormItem label="服务类型:">
                    <Select v-model="baseData.sertype" placeholder="请选择服务类型" style="width: 100%">
                        <Option value="有偿服务1">有偿服务1</Option>
                        <Option value="有偿服务2">有偿服务2</Option>
                        <Option value="有偿服务3">有偿服务3</Option>
                    </Select>
                </FormItem>
                <FormItem label="服务状态:">
                    <Select v-model="baseData.serstate" placeholder="请选择服务状态" style="width: 100%">
                        <Option value="正常服务">正常服务</Option>
                        <Option value="停止服务">停止服务</Option>
                        <Option value="移居">移居</Option>
                        <Option value="去世">去世</Option>
                    </Select>
                </FormItem>
                <p class="tip">经济情况</p>
                <FormItem label="经济来源:">
                    <Select v-model="baseData.ecosource" placeholder="请选择经济来源" style="width: 100%">
                        <Option value="社保工资">社保工资</Option>
                        <Option value="子女赡养">子女赡养</Option>
                        <Option value="低保">低保</Option>
                        <Option value="其他">其他</Option>
                    </Select>
                </FormItem>
                <FormItem label="月收入:">
                    <Input v-model="baseData.income" placeholder="请输入月收入"></Input>
                </FormItem>
                <FormItem label="医疗保障:">
                    <Select v-model="baseData.medsecurity" placeholder="请选择医疗保障" style="width: 100%">
                        <Option value="城镇医保">城镇医保</Option>
                        <Option value="农村医保">农村医保</Option>
                        <Option value="商业保险">商业保险</Option>
                        <Option value="其他">其他</Option>
                    </Select>
                </FormItem>
                <FormItem label="社保卡号:">
                    <Input v-model="baseData.soscard" placeholder="请输入社保卡号"></Input>
                </FormItem>
            </Col>
            <Col :xs="24" :md="8">
                <p class="tip">会员健康情况</p>
                <FormItem label="慢性病:">
                    <CheckboxGroup v-model="baseData.chronic">
                        <Checkbox label="无"></Checkbox>
                        <Checkbox label="高血压"></Checkbox>
                        <Checkbox label="高血糖"></Checkbox>
                        <Checkbox label="其他"></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="血型:">
                    <Select v-model="baseData.blood" placeholder="请选择血型" style="width: 100%">
                        <Option value="A型">A型</Option>
                        <Option value="B型">B型</Option>
                        <Option value="AB型">AB型</Option>
                        <Option value="O型">O型</Option>
                        <Option value="其他">其他</Option>
                    </Select>
                </FormItem>
                <FormItem label="失能情况:">
                    <Select v-model="baseData.disability" placeholder="请选择失能情况" style="width: 100%">
                        <Option value="无">无</Option>
                        <Option value="轻度失能">轻度失能</Option>
                        <Option value="中度失能">中度失能</Option>
                        <Option value="重度失能">重度失能</Option>
                    </Select>
                </FormItem>
                <FormItem label="残疾状况:">
                    <Select v-model="baseData.deformity" placeholder="请选择残疾状况" style="width: 100%">
                        <Option value="无">无</Option>
                        <Option value="轻度残疾">轻度残疾</Option>
                        <Option value="中度残疾">中度残疾</Option>
                        <Option value="重度残疾">重度残疾</Option>
                    </Select>
                </FormItem>
                <FormItem label="居住情况:">
                    <Select v-model="baseData.live" placeholder="请选择居住情况" style="width: 100%">
                        <Option value="与子女合住">与子女合住</Option>
                        <Option value="独自居住">独自居住</Option>
                        <Option value="与配偶二人居住">与配偶二人居住</Option>
                        <Option value=" 其他"> 其他</Option>
                    </Select>
                </FormItem>
                <upload-pic :fileType="fileType" @upSuccess="setPicUrl"><p class="tip">会员头像</p></upload-pic>
            </Col>
        </Row>
        <div class="button-box">
            <Button :loading="isKeep" type="primary" @click="keepBase('baseForm')">保存</Button>
        </div>
    </Form>
</template>
<script>
import provinceList from "@/assets/js/area.js";
import uploadPic from "@/components/common/UploadPic.vue";
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
      provinceList: provinceList,
      city: [],
      area: [],
      isZxs: false,
      vipId: "",
      baseData: {
        realName: "",
        idCard: "",
        tel: "",
        gender: "",
        age: "",
        nation: "",
        province: "",
        city: "",
        area: "",
        address: "",
        marriage: "",
        conname: "",
        contel: "",
        sertype: "",
        serstate: "",
        ecosource: "",
        income: "",
        medsecurity: "",
        soscard: "",
        chronic: [],
        blood: "",
        disability: "",
        deformity: "",
        live: "",
        headpic: "",
        companyId: 2
      },
      baseRule: {
        realName: [{ required: true, message: "请输入会员姓名" }],
        idCard: [{ required: true, validator: idCardRule }],
        tel: [{ required: true, validator: phoneRule }],
        conname: [{ required: true, message: "请输入紧急联系人" }],
        contel: [{ required: true, validator: phoneRule }]
      },
      fileType: {
        fileType: 1
      },
      isKeep: false
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      var vipIdReg = /\d*$/;
      this.vipId = this.$route.path.match(vipIdReg)[0];
      localStorage.setItem("vipId", this.vipId);
      if (localStorage.getItem("vipId") !== "") {
        // console.log(1);
        this.getCustomerDetail();
      }
    });
  },
  methods: {
    //   获取数据
    getCustomerDetail() {
      this.$http
        .post("/getcustomerDetail", { customerId: this.vipId })
        .then(res => {
          //   console.log(res);
          let dataFromAdmin = res.data.customer;
          dataFromAdmin.chronic = dataFromAdmin.chronic.split(",");
          this.baseData = dataFromAdmin;
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "会员信息获取失败！" });
        });
    },
    //   获取市
    selectCity(provinceName) {
      this.area = [];
      this.city = [];
      this.provinceList.forEach(element => {
        if (element.name === provinceName) {
          this.city = element.cityList.map(e => {
            return {
              name: e.name
            };
          });
        }
        return false;
      });
    },
    //获取区
    selectArea(cityName) {
      this.area = [];
      this.provinceList.forEach(eProvince => {
        if (eProvince.name === this.baseData.province) {
          eProvince.cityList.forEach(eCity => {
            if (eCity.name === cityName) {
              this.area = eCity.areaList.map(e => {
                return {
                  name: e
                };
              });
            }
            return false;
          });
        }
        return false;
      });
    },
    // 获取上传图片的地址
    setPicUrl(imgUrl) {
      this.baseData.headpic = imgUrl;
    },
    // 保存
    keepBase(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          let BaseDataForAdmin = JSON.parse(JSON.stringify(this.baseData));
        //   if (BaseDataForAdmin.chronic.length < 1) {
        //     BaseDataForAdmin.chronic = "";
        //   } else {
        //     BaseDataForAdmin.chronic = BaseDataForAdmin.chronic.join(",");
        //   }
          BaseDataForAdmin.chronic = BaseDataForAdmin.chronic.join(",");
          console.log(BaseDataForAdmin.chronic)
          if (this.vipId !== "") {
            BaseDataForAdmin.id = this.vipId;
          }
          //   console.log(BaseDataForAdmin)
          this.isKeep = true;
          this.$http
            .post("/add_customer", BaseDataForAdmin)
            .then(res => {
              console.log(res);
              this.isKeep = false;
              if (localStorage.getItem("vipId") !== "") {
                this.vipId = es.data.customerId;
                localStorage.setItem("vipId", res.data.customerId);
              }
              this.$Message.success("表单提交成功！");
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "表单提交失败！" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.three-column {
  padding: 20px 0;

  .second-column {
    border-right: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
}
.tip {
  font-size: 16px;
  margin-bottom: 16px;
  color: #0b9595;
}
.button-box {
  border-top: 1px solid #ccc;
  text-align: center;
  padding-top: 24px;
}
</style>
