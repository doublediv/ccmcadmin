<template>
  <div>
    <Form :model="searchData" inline :label-width="80">
        <FormItem label="服务商名称:">
            <Input type="text" v-model="searchData.name" placeholder="按服务商名称搜索"></Input>
        </FormItem>
        <FormItem label="手机号:">
            <Input type="text" v-model="searchData.tel" placeholder="按负责人手机号搜索"></Input>
        </FormItem>
        <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
    </Form>
    <Button class="addbutton" icon="plus-round" type="dashed" @click="showPopup('isAdd')">新增服务商</Button> 
    <Button class="singlebutton"  type="primary" @click="exportData"><Icon type="ios-download-outline"></Icon> 导出数据</Button>
    <Table ref="table" :columns="tableColumns" :data="tableData" :no-data-text="defaultText" border></Table>
    <Page class="page" v-if="isPage" :total="totalPage" :page-size="10" @on-change="changePage"></Page>
    <!-- 新增服务商 -->
    <Modal 
        v-model="isAdd"
        :closable="false"
        :width="600"
        :mask-closable="false"
        class-name="eidthform">
        <p slot="header">新增服务商</p>
        <Form ref="addFacilitatorForm" :model="addFacilitatorData" :rules="addFacilitatorRules" :label-width="90">
            <Row :gutter="16">
                <Col span="12">
                    <FormItem label="服务商名称:" prop="name">
                        <Input type="text" v-model="addFacilitatorData.name" placeholder="请输入服务商名称"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="服务商性质:" prop="nature">
                        <Input type="text" v-model="addFacilitatorData.nature" placeholder="请输入服务商性质"></Input>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem label="服务简介:" prop="introduction">
                        <Input type="text" v-model="addFacilitatorData.introduction" placeholder="请输入服务简介"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="服务类型:">
                        <Select placeholder="请选择服务类型" style="width:100%" @on-change="getServiceItem">
                            <Option v-for="item in serviceType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="服务项目:" prop="serviceProjectId">
                        <Select v-model="addFacilitatorData.serviceProjectId" placeholder="请选择服务项目" :loading="isGetServiceItem" style="width:100%">
                            <Option disabled v-if="serviceItem.length < 1" value="">请先选择服务类型</Option>
                            <Option v-for="item in serviceItem" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="收费单价:" prop="price">
                        <Input type="text" v-model="addFacilitatorData.price" placeholder="请输入收费单价"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="计费方式:" prop="costType">
                        <RadioGroup v-model="addFacilitatorData.costType">
                            <Radio label="1">天</Radio>
                            <Radio label="2">小时</Radio>
                            <Radio label="3">次数</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="主要负责人:" prop="contact">
                        <Input type="text" v-model="addFacilitatorData.contact" placeholder="请输入主要负责人"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="负责人电话:" prop="tel">
                        <Input type="text" v-model="addFacilitatorData.tel" placeholder="请输入负责人电话"></Input>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem label="工商执照号:" prop="businessLicense">
                        <Input type="text" v-model="addFacilitatorData.businessLicense" placeholder="请输入工商执照号"></Input>
                    </FormItem>
                </Col>
                <Col span="24">
                    <upload-pic :fileType="fileType" @upSuccess="setPicUrl"></upload-pic>
                </Col>
                <Col span="24">
                    <FormItem label="备注:">
                        <Input type="textarea" :autosize="{minRows: 5,maxRows: 5}" v-model="addFacilitatorData.remark" placeholder="请输入备注"></Input>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancel('addFacilitatorForm', 'isAdd')">取消</Button>
            <Button type="primary" :loading="isKeep"  @click="addFacilitator('addFacilitatorForm')">保存</Button>
        </div>
    </Modal> 
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
    return {
      serviceType: [],
      serviceItem: [],
      isGetServiceItem: false,
      searchData: {
        name: "",
        tel: "",
        limit: 10,
        page: 0
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "服务商名称", key: "name", align: "center" },
        { title: "服务商性质", key: "nature", align: "center" },
        { title: "服务简介", key: "introduction", align: "center" },
        { title: "主要负责人", key: "contact", align: "center" },
        { title: "联系方式", key: "tel", align: "center" },
        { title: "服务项目", key: "serviceProjectName", align: "center" },
        { title: "服务区域", key: "companyName", align: "center" },
        { title: "收费单价", key: "charge", align: "center" },
        { title: "服务状态", key: "status", align: "center" }
      ],
      tableData: [],
      defaultText: "加载中...",
      isPage: false,
      totalPage: 0,
      isAdd: false,
      addFacilitatorData: {
        name: "",
        nature: "",
        introduction: "",
        serviceProjectId: "",
        companyId: "2",
        businessLicense: "",
        costType: "",
        price: "",
        tel: "",
        contact: "",
        picUrl: "",
        remark: ""
      },
      addFacilitatorRules: {
        name: [{ required: true, message: "请输入服务商名称" }],
        nature: [{ required: true, message: "请输入服务商性质" }],
        introduction: [{ required: true, message: "请输入服务简介" }],
        serviceProjectId: [{ required: true, message: "请选择服务项目" }],
        businessLicense: [{ required: true, message: "请输入工商执照号" }],
        price: [{ required: true, message: "请输入收费单价" }],
        costType: [{ required: true, message: "请选择计费方式" }],
        contact: [{ required: true, message: "请输入主要负责人" }],
        tel: [{ required: true, validator: phoneRule }]
      },
      fileType: {
        fileType: 2
      },
      isKeep: false
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getData(this.searchData);
      this.getServiceType();
    });
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
    //   获取数据
    getData(jsonData) {
      this.tableData = [];
      this.$http
        .post("/service_business_list", jsonData)
        .then(res => {
          //   console.log(res);
          this.tableData = res.data.business.map(function(e) {
            switch (e.costType) {
              case 1:
                e.charge = e.price + " 元 / 天";
                break;
              case 2:
                e.charge = e.price + " 元 / 小时";
                break;
              case 3:
                e.charge = e.price + " 元 / 次";
                break;

              default:
                break;
            }
            return e;
          });
          //   分页
          this.totalPage = res.data.paginator.totalCount;
          if (res.data.paginator.totalPages > 1) {
            this.isPage = true;
          } else {
            this.isPage = false;
          }
          if (this.isSearch) {
            this.isSearch = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "服务商列表获取失败！" });
          this.defaultText = "数据获取失败";
          if (this.isSearch) {
            this.isSearch = false;
          }
        });
    },
    // 搜索
    search() {
      this.isSearch = true;
      if (this.isPage) {
        this.isPage = false;
      }
      this.getData(this.searchData);
    },
    // 选页
    changePage(pageNum) {
      this.getData({ limit: 10, page: pageNum });
    },
    // 显示弹窗
    showPopup(show) {
      this[show] = true;
    },
    // 取消弹窗
    cancel(refName, showName) {
      this.$refs[refName].resetFields();
      this[showName] = false;
    },
    // 导出数据
    exportData() {
      this.$refs.table.exportCsv({ filename: "服务商列表" });
    },
    // 获取上传图片的地址
    setPicUrl(imgUrl) {
      this.addFacilitatorData.picUrl = imgUrl;
    },
    // 新增服务商
    addFacilitator(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          //   console.log(this.addFacilitatorData);
          this.$http
            .post("/add_service_business", this.addFacilitatorData)
            .then(res => {
              //   console.log(res);
              this.isKeep = false;
              this.isAdd = false;
              this.$refs[refName].resetFields();
              this.getData(this.searchData);
              this.$Message.success("新增服务商成功！");
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "新增服务商失败！" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>

</style>
