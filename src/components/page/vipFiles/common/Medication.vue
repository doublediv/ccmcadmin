<template>
  <div>
    <Button class="addbutton" icon="plus-round" type="dashed" @click="showMedication">新增用药记录</Button>
    <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" :isPage="isPage"></v-table>
    <Modal 
        v-model="isAddShow"
        :closable="false"
        :mask-closable="false"
        :width="400"
        class-name="eidthform">
        <p slot="header">{{ editFormTitle }}</p>
        <Form ref="medicationForm" :model="medicationData" :rules="medicationRules" :label-width="70">
            <FormItem label="药名:" prop="medicationName">
                <Input type="text" v-model="medicationData.medicationName" placeholder="请输入药名"></Input>
            </FormItem>
            <FormItem label="服药日期:">
                <DatePicker type="date" v-model="medicationData.medicationDate" placeholder="请选择服药日期" style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem label="使用方法:">
                <Select v-model="medicationData.way" placeholder="请选择使用方法" style="width: 105px">
                    <Option value="口服">口服</Option>
                    <Option value="外用">外用</Option>
                </Select>
                <Input type="text" v-model="medicationData.num" placeholder="请输入数字" style="width: 83px"></Input>
                <Select v-model="medicationData.cycle" placeholder="请选择使用周期" style="width: 105px">
                    <Option value=" 次/天 ">次/天</Option>
                    <Option value=" 次/周 ">次/天</Option>
                    <Option value=" 次/月 ">次/月</Option>
                </Select>
            </FormItem>
            <FormItem label="用药剂量:">
                <Input type="text" v-model="medicationData.dose" placeholder="请输入用药剂量"></Input>
            </FormItem>
            <FormItem label="服用疗程:">
                <Select v-model="medicationData.course" placeholder="请选择服用疗程">
                    <Option value="一个月">一个月</Option>
                    <Option value="两个月">两个月</Option>
                    <Option value="六个月">六个月</Option>
                    <Option value="十二个月">十二个月</Option>
                </Select>
            </FormItem>
            <FormItem label="作用:">
                <Input type="text" v-model="medicationData.effect" placeholder="请输用药作用"></Input>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="primary" :loading="isKeep"  @click="keepMedication('medicationForm')">保存</Button>
            <Button type="ghost" @click="cancel('medicationForm', 'isAddShow')">取消</Button>
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
      medicationData: {
        medicationName: "",
        medicationDate: "",
        way: "",
        num: "",
        cycle: "",
        dose: "",
        course: "",
        effect: "",
        customerId: ""
      },
      medicationRules: {
        medicationName: [{ required: true, message: "请输入用药名称" }]
      },
      isKeep: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "药名", key: "medicationName", align: "center" },
        { title: "服药日期", key: "medicationDate", align: "center" },
        { title: "使用方法", key: "instructions", align: "center" },
        { title: "用药剂量", key: "dose", align: "center" },
        { title: "服用疗程", key: "course", align: "center" },
        { title: "作用", key: "effect", align: "center" },
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
                      this.editFormTitle = "用药记录编辑";
                      this.isAddShow = true;
                      this.medicationData = JSON.parse(
                        JSON.stringify(params.row)
                      );
                      let instructionsArr = this.medicationData.instructions.split(
                        " "
                      );
                      this.medicationData.way = instructionsArr[0];
                      this.medicationData.num = instructionsArr[1];
                      this.medicationData.cycle = instructionsArr[2];
                      delete this.medicationData.createTime;
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
                        content: "确定要删除这条用药记录吗？",
                        okText: "确认",
                        cancelText: "取消",
                        loading: true,
                        onOk: () => {
                          const _this = this;
                          this.$http
                            .post("/remove_medicationRecord", {
                              MedicationRecordId: params.row.id
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
    this.medicationData.customerId = localStorage.getItem("vipId");
    this.getMedicationData();
  },
  methods: {
    //   获取用药记录
    getMedicationData() {
      const _this = this;
      this.$http
        .post("/getMedicationRecord", {
          customerId: this.medicationData.customerId
        })
        .then(res => {
          this.tableData = res.data.medicationRecords;
        })
        .catch(err => {
          console.log(err);
          _this.$Notice.error({ title: "用药记录获取失败！" });
        });
    },
    // 弹出新增用药记录
    showMedication() {
      this.isAddShow = true;
      this.editFormTitle = "新增用药记录";
    },
    // 取消弹窗
    cancel(refName, showName) {
      this.$refs[refName].resetFields();
      this[showName] = false;
    },
    // 保存用药记录
    keepMedication(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          const _this = this;
          this.medicationData.instructions =
            this.medicationData.way +
            " " +
            this.medicationData.num +
            " " +
            this.medicationData.cycle;
          // console.log(this.medicationData)

          this.$http
            .post("/add_medicationRecord", this.medicationData)
            .then(function(res) {
              //   console.log(res);
              _this.$refs[refName].resetFields();
              _this.getMedicationData();
              _this.$Message.success("操作成功!");
              _this.isKeep = false;
              _this.isAddShow = false;
              delete _this.medicationData.id;
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
