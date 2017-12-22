<template>
  <div>
    <Form :model="searchData" inline :label-width="80">
        <FormItem label="服务类型:">
            <Select v-model="searchData.projectCategoryId" placeholder="按服务类型搜索" style="width:164px" @on-change="getServiceItem">
                <Option value="">请先选择</Option>
                <Option v-for="item in serviceType" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="服务项目:">
            <Select v-model="searchData.projectId" placeholder="按服务项目搜索" :loading="isGetServiceItem"  style="width:164px">
                <Option value="">请先选择</Option>
                <Option v-for="item in serviceItem" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
    </Form>
    <Button class="addbutton" icon="plus-round" type="dashed" @click="showPopup('isAddType')">新增服务类型</Button>
    <Button class="addbutton" icon="plus-round" type="dashed" @click="showPopup('isAddItem')">新增服务项目</Button>
    <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" :isPage="isPage" :totalPage="totalPage" @getPage="selectPage"></v-table>
    <!-- 新增服务类型 -->
    <Modal 
        v-model="isAddType"
        :closable="false"
        :mask-closable="false"
        :width="358"
        class-name="eidthform">
        <p slot="header">新增服务类型</p>
        <Form ref="addTypeForm" :model="addTypeData" :rules="addTypeRules" :label-width="80">
            <FormItem label="服务类型:" prop="serviceCategoryName">
                <Input type="text" v-model="addTypeData.serviceCategoryName" placeholder="请输入服务类型"></Input>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancel('addTypeForm', 'isAddType')">取消</Button>
            <Button type="primary" :loading="isKeep"  @click="keepType('addTypeForm')">保存</Button>
        </div>
    </Modal> 
    <!-- 新增服务项目 -->
    <Modal 
        v-model="isAddItem"
        :closable="false"
        :mask-closable="false"
        :width="400"
        class-name="eidthform">
        <p slot="header">新增服务项目</p>
        <Form ref="addItemForm" :model="addItemData" :rules="addItemRules" :label-width="100">
            <FormItem label="服务类型:" prop="serviceCategoryId">
                <Select v-model="addItemData.serviceCategoryId" placeholder="请选择服务类型" style="width:100%">
                    <Option v-for="item in serviceType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="服务项目:" prop="name">
                <Input type="text" v-model="addItemData.name" placeholder="请输入服务项目"></Input>
            </FormItem>
            <FormItem label="计费方式:" prop="costType">
                <RadioGroup v-model="addItemData.costType">
                    <Radio label="1">天</Radio>
                    <Radio label="2">小时</Radio>
                    <Radio label="3">次数</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="收费单价:" prop="price">
                <Input type="text" v-model="addItemData.price" placeholder="请输入收费单价"></Input>
            </FormItem>
            <FormItem label="参与积分兑换:" prop="isScore">
                <RadioGroup v-model="addItemData.isScore" @on-change="changeIsCanScore">
                    <Radio label="1">是</Radio>
                    <Radio label="99">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="兑换所需积分:" prop="score">
                <Input :disabled="isCanScore" type="text" v-model="addItemData.score"></Input>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancel('addItemForm', 'isAddItem')">取消</Button>
            <Button type="primary" :loading="isKeep"  @click="keepItem('addItemForm')">保存</Button>
        </div>
    </Modal> 
    <!-- 编辑服务项目 -->
    <Modal 
        v-model="isEditItem"
        :closable="false"
        :mask-closable="false"
        :width="400"
        class-name="eidthform">
        <p slot="header">编辑服务项目</p>
        <Form ref="editItemForm" :model="editItemData" :rules="editItemRules" :label-width="100">
            <FormItem label="服务类型:" prop="serviceCategoryId">
                <Select v-model="editItemData.serviceCategoryId" placeholder="请选择服务类型" style="width:100%" @on-change="getServiceItem">
                    <Option v-for="item in serviceType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="服务项目:" prop="name">
                <Input type="text" v-model="editItemData.name" placeholder="请输入服务项目"></Input>
            </FormItem>
            <FormItem label="计费方式:" prop="costType">
                <RadioGroup v-model="editItemData.costType">
                    <Radio label="1">天</Radio>
                    <Radio label="2">小时</Radio>
                    <Radio label="3">次数</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="收费单价:" prop="price">
                <Input type="text" v-model="editItemData.price" placeholder="请输入收费单价"></Input>
            </FormItem>
            <FormItem label="参与积分兑换:" prop="isScore">
                <RadioGroup v-model="editItemData.isScore" @on-change="changeIsCanScore">
                    <Radio label="1">是</Radio>
                    <Radio label="99">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="兑换所需积分:" prop="score">
                <Input :disabled="isCanScore" type="text" v-model="editItemData.score"></Input>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancel('editItemForm', 'isEditItem')">取消</Button>
            <Button type="primary" :loading="isKeep"  @click="keepItem('editItemForm')">保存</Button>
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
      serviceType: [],
      serviceItem: [],
      isGetServiceItem: false,
      searchData: {
        projectCategoryId: "",
        projectId: "",
        limit: 10,
        page: 0
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "服务类型", key: "serviceCategoryName", align: "center" },
        { title: "服务项目", key: "name", align: "center" },
        { title: "收费单价", key: "charge", align: "center" },
        // { title: "计费方式", key: "costType", align: "center" },
        { title: "参与积分对换", key: "isCanScore", align: "center" },
        { title: "兑换所需积分", key: "score", align: "center" },
        {
          title: "操作",
          key: "action",
          width: 150,
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
                      // console.log(params.row);
                      this.isEditItem = true;
                      this.changeIsCanScore(params.row.isScore);
                      this.editItemData = JSON.parse(
                        JSON.stringify(params.row)
                      );
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: { type: "error", size: "small" },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "删除确认",
                        content: `<p>服务类型：${params.row.serviceCategoryName}</p>
                                 <p>服务项目：${params.row.name}</p>
                                 <p>收费单价：${params.row.charge}</p>`,
                        okText: "确认",
                        cancelText: "取消",
                        loading: true,
                        onOk: () => {
                          const _this = this;
                          this.$http
                            .post("remove_service_project", {
                              serviceProjectId: params.row.id
                            })
                            .then(function(res) {
                              _this.$Modal.remove();
                              _this.tableData.splice(params.index, 1);
                              _this.$Message.success("服务项目删除成功!");
                              _this.getData(_this.searchData);
                            })
                            .catch(function(err) {
                              console.log(err);
                              _this.$Notice.error({ title: "服务项目删除失败！" });
                            });
                        }
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [],
      isPage: false,
      totalPage: 0,
      isAddType: false,
      isKeep: false,
      addTypeData: {
        serviceCategoryName: ""
      },
      addTypeRules: {
        serviceCategoryName: [{ required: true, message: "请输入服务类型" }]
      },
      isAddItem: false,
      isCanScore: true,
      addItemData: {
        serviceCategoryId: "",
        name: "",
        costType: "",
        price: "",
        isScore: "99",
        score: "0"
      },
      addItemRules: {
        serviceCategoryId: [{ required: true, message: "请选择类型" }],
        name: [{ required: true, message: "请输入服务项目" }],
        costType: [{ required: true, message: "请选择计费方式" }],
        price: [{ required: true, message: "请输入收费单价" }],
        isScore: [{ required: true, message: "请选择是否参与积分兑换" }],
        score: [{ required: true, message: "请输入兑换所需积分" }]
      },
      isEditItem: false,
      editItemData: {
        serviceCategoryId: "",
        name: "",
        costType: "",
        price: "",
        isScore: "",
        score: ""
      },
      editItemRules: {
        serviceCategoryId: [{ required: true, message: "请选择类型" }],
        name: [{ required: true, message: "请输入服务项目" }],
        costType: [{ required: true, message: "请选择计费方式" }],
        price: [{ required: true, message: "请输入收费单价" }],
        isScore: [{ required: true, message: "请选择是否参与积分兑换" }],
        score: [{ required: true, message: "请输入兑换所需积分" }]
      }
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
          this.serviceType = res.data.serviceCategory.map(function(e) {
            e.id = e.id.toString();
            return e;
          });
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "服务类型列表获取失败！" });
        });
    },
    // 根据服务类型Id获取服务项目
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
          this.$Notice.error({ title: "服务项目失败！" });
        });
    },
    //   获取数据
    getData(jsonData) {
      this.tableData = [];
      this.$http
        .post("/service_project_list", jsonData)
        .then(res => {
          //   console.log(res);
          this.tableData = res.data.serviceCategory.map(function(e) {
            e.costType = e.costType.toString();
            e.isScore = e.isScore.toString();
            e.serviceCategoryId = e.serviceCategoryId.toString();
            if (e.isScore === "1") {
              e.isCanScore = "是";
            } else {
              e.isCanScore = "否";
            }
            switch (e.costType) {
              case "1":
                e.charge = e.price + " 元 / 天";
                break;
              case "2":
                e.charge = e.price + " 元 / 小时";
                break;
              case "3":
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
          this.$refs.vTable.$emit("getErr");
          this.$Notice.error({ title: "服务项目列表获取失败！" });
          if (this.isSearch) {
            this.isSearch = false;
          }
        });
    },
    // 搜索
    search() {
      this.isSearch = true;
      this.getData(this.searchData);
    },
    // 选页
    selectPage(pageNum) {
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
    // 添加服务类型
    keepType(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          this.$http
            .post("/add_service_category", this.addTypeData)
            .then(res => {
              this.isKeep = false;
              this.isAddType = false;
              this.$refs[refName].resetFields();
              this.getServiceType();
              this.$Message.success("服务类型添加成功!");
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "服务类型添加失败！" });
            });
        }
      });
    },
    // 修改是否参加积分兑换
    changeIsCanScore(value) {
      if (value === "1") {
        this.isCanScore = false;
      } else {
        this.isCanScore = true;
      }
    },
    // 添加服务项目
    keepItem(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          this.$http
            .post("/add_service_project", this.addItemData)
            .then(res => {
              this.isKeep = false;
              this.isAddItem = false;
              this.getData(this.searchData);
              this.$refs[refName].resetFields();
              this.$Message.success("服务项目添加成功!");
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "服务项目添加失败！" });
            });
        }
      });
    },
    // 编辑服务项目
    keepItem(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          this.$http
            .post("/modify_service_project", {
              id: this.editItemData.id,
              serviceCategoryId: this.editItemData.serviceCategoryId,
              name: this.editItemData.name,
              costType: this.editItemData.costType,
              price: this.editItemData.price,
              isScore: this.editItemData.isScore,
              score: this.editItemData.score
            })
            .then(res => {
              this.isKeep = false;
              this.isEditItem = false;
              this.getData(this.searchData);
              this.$refs[refName].resetFields();
              this.$Message.success("服务项目编辑成功!");
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "服务项目编辑失败！" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>

</style>

