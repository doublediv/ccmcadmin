<template>
  <div>
      <Form :model="searchData" inline :label-width="80">
        <FormItem label="所属公司:">
            <Select v-model="searchData.company" placeholder="请选择" style="width:164px">
                <Option value="">请选择</Option>
            </Select>
        </FormItem>
        <FormItem label="所属基站:">
            <Select v-model="searchData.baseStation" placeholder="请选择" style="width:164px">
                <Option value="">请选择</Option>
            </Select>
        </FormItem>
        <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
    </Form>
    <Button class="addbutton" icon="plus-round" type="dashed" @click="showAddMechanismType">新增机构类型</Button>
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
                    <Radio disabled label="1">总部</Radio>
                    <Radio disabled label="2">分公司</Radio>
                    <Radio label="3">基站</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="基站名称:" prop="name">
                <Input type="text" v-model="addOrganizationData.name" placeholder="请输入基站名称"></Input>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancel('addOrganizationForm', 'isAddShow')">取消</Button>
            <Button type="primary" :loading="isKeep"  @click="keepOrganization('addOrganizationForm')">保存</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import vTable from "../../common/Table.vue";
export default {
  components: { vTable },
  data() {
    return {
      searchData: {
        company: "",
        baseStation: ""
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "机构类型", key: "category", align: "center" },
        { title: "基站名称", key: "name", align: "center" },
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
                      this.eidthformTitle = "编辑机构类型";
                      this.isAddShow = true;
                      this.addOrganizationData = JSON.parse(
                        JSON.stringify(params.row)
                      );
                      switch (this.addOrganizationData.category) {
                        case "总站":
                          this.addOrganizationData.category = "1";
                          break;
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
                "编辑机构"
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
      eidthformTitle: "",
      addOrganizationData: {
        category: "",
        name: ""
      },
      addOrganizationRules: {
        category: [{ required: true, message: "请输选择机构类型" }],
        name: [{ required: true, message: "请输入基站名称" }]
      },
      isKeep: false
    };
  },
  created() {
    this.getOrganizationData();
  },
  methods: {
    // 搜索
    search() {},
    // 获取机构类型
    getOrganizationData() {
      const _this = this;
      this.$http
        .post("/getcompanys")
        .then(function(res) {
          //   console.log(res);
          _this.tableData = res.data.companys;
        })
        .catch(function(err) {
          console.log(err);
          _this.$Notice.error({ title: "机构类型获取失败！" });
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
