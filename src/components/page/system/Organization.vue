<template>
  <div>
      <Form v-if="isNoJz" :model="searchData" inline :label-width="80">
        <FormItem label="所属分公司:" v-if="!isFgs">
            <Select v-model="searchData.fCompanyId" placeholder="按所属分公司搜索" @on-change="getJcompany" style="width:164px">
                <Option v-for="item in companyArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="所属基站:">
            <Select v-model="searchData.jCompanyId" placeholder="按所属基站搜索" style="width:164px">
              <Option v-for="item in baseStationArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
    </Form>
    <Button v-show="isNoJz" class="addbutton" icon="plus-round" type="dashed" @click="showAddMechanismType">新增机构类型</Button>
    <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" :isPage="isPage"></v-table>
    <!-- 新增 -->
    <Modal 
        v-model="isAddShow"
        :closable="false"
        :mask-closable="false"
        :width="358"
        class-name="eidthform">
        <p slot="header">{{ eidthformTitle }}</p>
        <Form ref="addOrganizationForm" :model="addOrganizationData" :rules="addOrganizationRules" :label-width="90">
            <FormItem label="机构类型:" prop="category">
                <RadioGroup v-model="addOrganizationData.category">
                    <Radio :disabled="isFgs" label="2">分公司</Radio>
                    <Radio :disabled="isJz" label="3">基站</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="名称:" prop="name">
                <Input :disabled="!isNoJz" type="text" v-model="addOrganizationData.name" placeholder="请输入名称"></Input>
            </FormItem>
            <FormItem label="所属省:" prop="province">
                <Select v-model="addOrganizationData.province" placeholder="请选择省" @on-change="selectCity" style="width: 100%">
                    <Option v-for="(item, index) in provinceList" :value="item.name" :key="index">{{ item.name }}</Option>  
                </Select>
            </FormItem>
            <FormItem label="所属市:" prop="city">
                <Select v-model="addOrganizationData.city" placeholder="请选择市" style="width: 100%">
                    <Option v-for="(item, index) in cityList" :value="item.name" :key="index">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="地址:" prop="address">
                <Input type="text" v-model="addOrganizationData.address" placeholder="请输入地址"></Input>
            </FormItem>
            <FormItem label="经纬度:" prop="woven">
                <Input type="text" v-model="addOrganizationData.woven" placeholder="请输入经纬度"></Input>
                <p><span>示例：116.377823,40.004749</span> <a traget="_blank" href="http://api.map.baidu.com/lbsapi/getpoint/index.html">获取经纬度</a></p>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancel('addOrganizationForm', 'isAddShow')">取消</Button>
            <Button :disabled="!isNoJz" type="primary" :loading="isKeep"  @click="keepOrganization('addOrganizationForm')">保存</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import vTable from "../../common/Table.vue";
import provinceList from "@/assets/js/area.js";
export default {
  components: { vTable },
  data() {
    return {
      companyArr: [],
      baseStationArr: [],
      SelectTip: "请先选择分公司",
      isLodingJz: true,
      searchData: {
        fCompanyId: "",
        jCompanyId: ""
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "名称", key: "name", align: "center" },
        { title: "机构类型", key: "category", align: "center" },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: { type: "primary", size: "small" },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.eidthformTitle = "查看编辑机构类型";
                      this.isAddShow = true;
                      this.addOrganizationData = JSON.parse(
                        JSON.stringify(params.row)
                      );
                      switch (this.addOrganizationData.category) {
                        case "分公司":
                          this.addOrganizationData.category = "2";
                          break;
                        case "基站":
                          this.addOrganizationData.category = "3";
                          break;

                        default:
                          break;
                      }
                    }
                  }
                },
                "查看编辑"
              ),
              h(
                "Button",
                {
                  props: { type: "primary", size: "small" },
                  on: {
                    click: () => {
                      this.$router.push("/system/role");
                    }
                  }
                },
                "添加角色"
              )
            ]);
          }
        }
      ],
      tableData: [],
      isPage: false,
      isAddShow: false,
      isNoJz: true,
      isFgs: true,
      isJz: true,
      eidthformTitle: "",
      provinceList: provinceList,
      cityList: [],
      addOrganizationData: {
        category: "",
        name: "",
        province: "",
        city: "",
        address: "",
        woven: ""
      },
      addOrganizationRules: {
        category: [{ required: true, message: "请输选择机构类型" }],
        name: [{ required: true, message: "请输入基站名称" }],
        province: [{ required: true, message: "请选择省" }],
        city: [{ required: true, message: "请选择市" }],
        address: [{ required: true, message: "请输入地址" }],
        woven: [{ required: true, message: "请输入经纬度" }]
      },
      isKeep: false
    };
  },
  created() {
    switch (localStorage.getItem("companyCategory")) {
      case "1":
        this.isFgs = false;
        this.getFcompany();
        break;
      case "2":
        this.isJz = false;
        this.getJcompany(localStorage.getItem("companyId"));
        break;
      case "3":
        this.isNoJz = false;
        break;

      default:
        break;
    }
    this.getOrganizationData();
  },
  methods: {
    // 获取分公司列表
    getFcompany() {
      this.$http
        .post("/get_f_company")
        .then(res => {
          // console.log(res);
          this.companyArr = res.data.companys;
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "分公司列表获取失败！" });
        });
    },
    // 根据分公司ID获取基站列表
    getJcompany(id) {
      this.$http
        .post("/get_j_company", { companyId: id })
        .then(res => {
          // console.log(res);
          this.baseStationArr = res.data.companys;
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "基站列表获取失败！" });
        });
    },
    // 搜索
    search() {
      this.isSearch = true;
      this.getOrganizationData();
    },
    // 获取机构类型
    getOrganizationData() {
      const _this = this;
      this.$http
        .post("/getcompanys", this.searchData)
        .then(function(res) {
          // console.log(res);
          _this.tableData = res.data.companys;
          if (_this.isSearch) {
            _this.isSearch = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.$Notice.error({ title: "机构类型获取失败！" });
          if (_this.isSearch) {
            _this.isSearch = false;
          }
        });
    },
    //   获取市
    selectCity(provinceName) {
      this.cityList = [];
      this.provinceList.forEach(element => {
        if (element.name === provinceName) {
          this.cityList = element.cityList.map(e => {
            return {
              name: e.name
            };
          });
        }
        return false;
      });
    },
    // 弹出新增机构类型
    showAddMechanismType() {
      this.isAddShow = true;
      this.eidthformTitle = "新增机构类型";
    },
    // 取消弹窗
    cancel(refName, showName) {
      this.$refs[refName].resetFields();
      this[showName] = false;
    },
    // 保存机构类型
    keepOrganization(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          const _this = this;
          this.$http
            .post("/add_company", this.addOrganizationData)
            .then(function(res) {
              //   console.log(res);
              _this.$refs[refName].resetFields();
              _this.getOrganizationData();
              _this.$Message.success("操作成功!");
              _this.isKeep = false;
              _this.isAddShow = false;
            })
            .catch(function(err) {
              console.log(err);
              _this.isKeep = false;
              _this.$Notice.error({ title: "操作失败!" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>

</style>
