<template>
  <div>
    <Button class="addbutton" icon="plus-round" type="dashed" @click="showVisit">新增就诊记录</Button>
    <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" :isPage="isPage"></v-table>
    <Modal 
        v-model="isAddShow"
        :closable="false"
        :mask-closable="false"
        :width="400"
        class-name="eidthform">
        <p slot="header">{{ editFormTitle }}</p>
        <Form ref="visitForm" :model="visitData" :rules="visitRules" :label-width="70">
            <FormItem label="姓名:" prop="name">
                <Input type="text" v-model="visitData.name" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="就诊时间:">
                <DatePicker type="date" :value="visitData.treatmentTime"  @on-change="setTreatDate" placeholder="请选择就诊时间" style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem label="就诊科室:">
                <Input type="text" v-model="visitData.department" placeholder="请输入就诊科室"></Input>
            </FormItem>
            <FormItem label="医生:">
                <Input type="text" v-model="visitData.doctor" placeholder="请输入医生姓名"></Input>
            </FormItem>
            <FormItem label="复诊时间:">
                <DatePicker type="date" :value="visitData.visitTime" @on-change="setVisitDate" placeholder="请选择就诊时间" style="width: 100%"></DatePicker>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="primary" :loading="isKeep"  @click="keepVisit('visitForm')">保存</Button>
            <Button type="ghost" @click="cancel('visitForm', 'isAddShow')">取消</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import vTable from "@/components/common/Table.vue";
export default {
  components: { vTable },
  data() {
    return {
      editFormTitle: "",
      isAddShow: false,
      visitData: {
        name: "",
        treatmentTime: "",
        department: "",
        doctor: "",
        visitTime: "",
        customerId: ""
      },
      visitRules: {
        name: [{ required: true, message: "请输入姓名" }]
      },
      isKeep: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "姓名", key: "name", align: "center" },
        { title: "就诊时间", key: "treatmentTime", align: "center" },
        { title: "就诊科室", key: "department", align: "center" },
        { title: "医生", key: "doctor", align: "center" },
        { title: "复诊时间", key: "visitTime", align: "center" },
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
                      this.editFormTitle = "就诊记录编辑";
                      this.isAddShow = true;
                      this.visitData = JSON.parse(
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
                        content: "确定要删除这条就诊记录吗？",
                        okText: "确认",
                        cancelText: "取消",
                        loading: true,
                        onOk: () => {
                          const _this = this;
                          this.$http
                            .post("/remove_treatment_record", {
                              treatmentRecordIds: params.row.id
                            })
                            .then(function(res) {
                              _this.$Modal.remove();
                              _this.tableData.splice(params.index, 1);
                              _this.$Message.success("就诊删除成功!");
                            })
                            .catch(function(err) {
                              console.log(err);
                              _this.$Notice.error({ title: "就诊删除失败！" });
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
    this.visitData.customerId = localStorage.getItem("vipId");
    this.getVisitData();
  },
  methods: {
    //   获取就诊记录
    getVisitData() {
      const _this = this;
      this.$http
        .post("/getTreatmentRecord", {
          customerId: this.visitData.customerId
        })
        .then(res => {
          this.tableData = res.data.treatmentRecords;
        })
        .catch(err => {
          console.log(err);
          _this.$Notice.error({ title: "就诊记录获取失败！" });
        });
    },
    // 弹出新增就诊
    showVisit() {
      this.isAddShow = true;
      this.editFormTitle = "新增就诊记录";
    },
    // 设置就诊时间
    setTreatDate(date) {
      this.visitData.treatmentTime = date;
    },
    // 设置复诊时间
    setVisitDate(date) {
      this.visitData.visitTime = date;
    },
    // 取消弹窗
    cancel(refName, showName) {
      this.$refs[refName].resetFields();
      this[showName] = false;
    },
    // 保存就诊记录
    keepVisit(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          const _this = this;
          this.$http
            .post("/add_treatment_record", this.visitData)
            .then(function(res) {
                // console.log(res);
              _this.$refs[refName].resetFields();
              _this.getVisitData();
              _this.$Message.success("操作成功!");
              _this.isKeep = false;
              _this.isAddShow = false;
              delete _this.visitData.id
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
