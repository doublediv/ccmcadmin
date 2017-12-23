<template>
  <div>
    <Button class="addbutton" icon="plus-round" type="dashed" @click="showPopup('isAddOne')">新增一级类目</Button>
    <Button class="addbutton" icon="plus-round" type="dashed" @click="showPopup('isAddTwo')">新增二级类目</Button>
    <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" :isPage="isPage"></v-table>
    <!-- 新增一级类目 -->
    <Modal 
        v-model="isAddOne"
        :closable="false"
        :mask-closable="false"
        :width="358"
        class-name="eidthform">
        <p slot="header">新增一级类目</p>
        <Form ref="addgoodsOneForm" :model="addgoodsOneData" :rules="addgoodsOneRules" :label-width="80">
            <FormItem label="一级类目:" prop="name">
                <Input type="text" v-model="addgoodsOneData.name" placeholder="请输入一级类目名称"></Input>
            </FormItem>
            <FormItem label="排序:">
                <Input type="text" v-model="addgoodsOneData.seqNo" placeholder="请输入排序"></Input>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancel('addgoodsOneForm', 'isAddOne')">取消</Button>
            <Button type="primary" :loading="isKeep"  @click="addgoodsOne('addgoodsOneForm')">保存</Button>
        </div>
    </Modal> 
    <!-- 新增二级类目 -->
    <Modal 
        v-model="isAddTwo"
        :closable="false"
        :mask-closable="false"
        :width="358"
        class-name="eidthform">
        <p slot="header">新增二级类目</p>
        <Form ref="addGoodsTwoForm" :model="addGoodsTwoData" :rules="addGoodsTwoRules" :label-width="80">
            <FormItem label="一级类目:" prop="fatherProductCategoryId">
                <Select v-model="addGoodsTwoData.fatherProductCategoryId" placeholder="请选择一级类目名称" style="width:100%">
                    <Option v-for="item in goodsOne" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="二级类目:" prop="name">
                <Input type="text" v-model="addGoodsTwoData.name" placeholder="请输入二级类目名称"></Input>
            </FormItem>
            <FormItem label="排序:">
                <Input type="text" v-model="addGoodsTwoData.seqNo" placeholder="请输入排序"></Input>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancel('addGoodsTwoForm', 'isAddTwo')">取消</Button>
            <Button type="primary" :loading="isKeep"  @click="addGoodsTwo('addGoodsTwoForm')">保存</Button>
        </div>
    </Modal> 
    <!-- 编辑二级类目 -->
    <Modal 
        v-model="isEditTwo"
        :closable="false"
        :mask-closable="false"
        :width="358"
        class-name="eidthform">
        <p slot="header">编辑二级类目</p>
        <Form ref="editGoodsTwoForm" :model="editGoodsTwoData" :rules="editGoodsTwoRules" :label-width="80">
            <FormItem label="一级类目:" prop="oneCategoryId">
                <Select v-model="editGoodsTwoData.oneCategoryId" placeholder="请选择一级类目名称" style="width:100%">
                    <Option v-for="item in goodsOne" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="二级类目:" prop="twoCategoryName">
                <Input type="text" v-model="editGoodsTwoData.twoCategoryName" placeholder="请输入二级类目名称"></Input>
            </FormItem>
            <FormItem label="排序:">
                <Input type="text" v-model="editGoodsTwoData.seqNo" placeholder="请输入排序"></Input>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancel('editGoodsTwoForm', 'isEditTwo')">取消</Button>
            <Button type="primary" :loading="isKeep"  @click="editGoodsTwo('editGoodsTwoForm')">保存</Button>
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
      isAddOne: false,
      isAddTwo: false,
      isEditTwo: false,
      isKeep: false,
      goodsOne: [],
      addgoodsOneData: {
        name: "",
        seqNo: "100"
      },
      addgoodsOneRules: {
        name: [{ required: true, message: "请输入一级类目名称" }]
      },
      addGoodsTwoData: {
        fatherProductCategoryId: "",
        name: "",
        seqNo: "100"
      },
      addGoodsTwoRules: {
        fatherProductCategoryId: [{ required: true, message: "请选择一级类目名称" }],
        name: [{ required: true, message: "请输入二级类目名称" }]
      },
      editGoodsTwoData: {
        oneCategoryId: "",
        twoCategoryName: "",
        seqNo: "100"
      },
      editGoodsTwoRules: {
        oneCategoryId: [{ required: true, message: "请选择一级类目名称" }],
        twoCategoryName: [{ required: true, message: "请输入二级类目名称" }]
      },
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "一级类目名称", key: "oneCategoryName", align: "center" },
        { title: "二级类目名称", key: "twoCategoryName", align: "center" },
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
                      this.isEditTwo = true;
                      this.editGoodsTwoData = JSON.parse(
                        JSON.stringify(params.row)
                      );
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      tableData: [],
      isPage: false
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getData();
      this.getgoodsOneData();
    });
  },
  methods: {
    //   获取一级类目
    getgoodsOneData() {
      this.$http
        .post("/product_category_one_list")
        .then(res => {
          // console.log(res);
          this.goodsOne = res.data.productCategoryOne.map(function(e) {
            return {
              id: e.id,
              name: e.name
            };
          });
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "商品一级类目获取失败！" });
        });
    },
    //   获取数据
    getData() {
      this.tableData = [];
      this.$http
        .post("/product_category_list")
        .then(res => {
          //   console.log(res);
          this.tableData = res.data.productCategory;
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "商品列表管理获取失败！" });
        });
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
    // 添加一级类目
    addgoodsOne(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          this.$http
            .post("/add_product_category_1", this.addgoodsOneData)
            .then(res => {
              this.isKeep = false;
              this.isAddOne = false;
              this.$refs[refName].resetFields();
              this.$Message.success("添加一级类目成功!");
              this.getgoodsOneData();
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "添加一级类目失败！" });
            });
        }
      });
    },
    // 添加二级类目
    addGoodsTwo(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          this.$http
            .post("/add_product_category_2", this.addGoodsTwoData)
            .then(res => {
              this.isKeep = false;
              this.isAddTwo = false;
              this.$refs[refName].resetFields();
              this.$Message.success("添加二级类目成功!");
              this.getData();
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "添加二级类目失败！" });
            });
        }
      });
    },
    // 编辑二级类目
    editGoodsTwo(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          console.log( [
              { id: this.editGoodsTwoData.twoCategoryId },
              {
                name: this.editGoodsTwoData.twoCategoryName,
                seqNo: this.editGoodsTwoData.seqNo
              }
            ])
          this.$http
            .post("/modify_product_category", [
              { id: this.editGoodsTwoData.twoCategoryId },
              {
                name: this.editGoodsTwoData.twoCategoryName,
                seqNo: this.editGoodsTwoData.seqNo
              }
            ])
            .then(res => {
              this.isKeep = false;
              this.isAddTwo = false;
              this.$refs[refName].resetFields();
              this.$Message.success("编辑二级类目成功!");
              this.getData();
            })
            .catch(err => {
              this.isKeep = false;
              console.log(err);
              this.$Notice.error({ title: "编辑二级类目失败！" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>

</style>

