<template>
  <div>
    <Button class="addbutton" icon="plus-round" type="dashed" @click="showRelationship">新增亲属</Button>
    <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" :isPage="isPage"></v-table>
    <Modal 
        v-model="isAddShow"
        :closable="false"
        :mask-closable="false"
        :width="400"
        class-name="eidthform">
        <p slot="header">{{ editFormTitle }}</p>
        <Form ref="relationshipForm" :model="relationshipData" :rules="relationshipRules" :label-width="80">
            <FormItem label="姓名:" prop="name">
                <Input type="text" v-model="relationshipData.name" placeholder="请输入亲属姓名"></Input>
            </FormItem>
            <FormItem label="亲属关系:">
                <Input type="text" v-model="relationshipData.relation" placeholder="请输亲属关系"></Input>
            </FormItem>
            <FormItem label="接收信息:">
                <RadioGroup v-model="relationshipData.isAccept">
                    <Radio label="0">是</Radio>
                    <Radio label="1">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="联系电话:" prop="tel">
                <Input type="text" v-model="relationshipData.tel" placeholder="请输入亲属联系电话"></Input>
            </FormItem>
            <FormItem label="同住:">
                <RadioGroup v-model="relationshipData.liveTogether">
                    <Radio label="0">是</Radio>
                    <Radio label="1">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="联系地址:">
                <Input type="text" v-model="relationshipData.address" placeholder="请输亲属联系地址"></Input>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="primary" :loading="isKeep"  @click="keepRelationship('relationshipForm')">保存</Button>
            <Button type="ghost" @click="cancel('relationshipForm', 'isAddShow')">取消</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import vTable from "@/components/common/Table.vue";
export default {
  components: { vTable },
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
      editFormTitle: "",
      isAddShow: false,
      relationshipData: {
        name: "",
        tel: "",
        relation: "",
        isAccept: "",
        liveTogether: "",
        address: "",
        customerId: ""
      },
      relationshipRules: {
        name: [{ required: true, message: "请输入亲属名称" }],
        tel: [{ required: true, validator: phoneRule }]
      },
      isKeep: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "姓名", key: "name", align: "center" },
        { title: "亲属关系", key: "relation", align: "center" },
        { title: "联系电话", key: "tel", align: "center" },
        { title: "接收信息", key: "isAcceptForPre", align: "center" },
        { title: "同住", key: "liveTogetherForPre", align: "center" },
        { title: "联系地址", key: "address", align: "center" },
        {
          title: "操作",
          key: "action",
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
                      this.editFormTitle = "亲属编辑";
                      this.isAddShow = true;
                      this.relationshipData = JSON.parse(
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
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "删除确认",
                        content: "确定要删除这条亲属关系吗？",
                        okText: "确认",
                        cancelText: "取消",
                        loading: true,
                        onOk: () => {
                          const _this = this;
                          this.$http
                            .post("/remove_relationship", {
                              relationshipId: params.row.id
                            })
                            .then(function(res) {
                              _this.$Modal.remove();
                              _this.tableData.splice(params.index, 1);
                              _this.$Message.success("用药记录删除成功!");
                            })
                            .catch(function(err) {
                              console.log(err);
                              _this.$Notice.error({ title: "用药记录删除失败！" });
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
      isPage: false
    };
  },
  created() {
    this.relationshipData.customerId = localStorage.getItem("vipId");
    this.getRelationship();
  },
  methods: {
    //   获取亲属
    getRelationship() {
      const _this = this;
      this.$http
        .post("/getRelationship", { customerId: this.relationshipData.customerId })
        .then(function(res) {
          // console.log(res);
          _this.tableData = res.data.relationshipList.map(e => {
            if (e.isAccept == 0) {
              e.isAcceptForPre = "是";
            } else {
              e.isAcceptForPre = "否";
            }
            if (e.liveTogether == 0) {
              e.liveTogetherForPre = "是";
            } else {
              e.liveTogetherForPre = "否";
            }
            return e;
          });
        })
        .catch(function(err) {
          console.log(err);
          _this.$Notice.error({ title: "亲属获取失败！" });
        });
    },
    // 弹出新增亲属
    showRelationship() {
      this.isAddShow = true;
      this.editFormTitle = "新增亲属";
    },
    // 取消弹窗
    cancel(refName, showName) {
      this.$refs[refName].resetFields();
      this[showName] = false;
    },
    // 保存亲属
    keepRelationship(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          const _this = this;
          this.$http
            .post("/add_relationship", this.relationshipData)
            .then(function(res) {
              //   console.log(res);
              _this.$refs[refName].resetFields();
              _this.getRelationship();
              _this.$Message.success("操作成功!");
              _this.isKeep = false;
              _this.isAddShow = false;
              delete _this.relationshipData.id
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
