<template>
  <div>
    <Button class="addbutton" icon="plus-round" type="dashed" @click="showAddRole">新增角色</Button>
    <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" :isPage="isPage"></v-table>
    <!-- 角色编辑 -->
    <Modal 
        v-model="isAddShow"
        :closable="false"
        :mask-closable="false"
        :width="358"
        class-name="eidthform">
        <p slot="header">{{ editFormTitle }}</p>
        <Form ref="addRoleForm" :model="addRoleData" :rules="addRoleRules" :label-width="80">
            <FormItem label="角色名称:" prop="name">
                <Input type="text" v-model="addRoleData.name" placeholder="请输入角色名称"></Input>
            </FormItem>
            <FormItem label="角色描述:">
                <Input type="text" v-model="addRoleData.description" placeholder="请输入角色描述"></Input>
            </FormItem>
        </Form>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancel('addRoleForm', 'isAddShow')">取消</Button>
            <Button type="primary" :loading="isKeep"  @click="keepRole('addRoleForm')">保存</Button>
        </div>
    </Modal>
    <!-- 权限设置 -->
    <Modal 
        v-model="isEditPowerShow"
        :closable="false"
        :mask-closable="false"
        :width="200"
        class-name="eidthform">
        <p slot="header">权限设置</p>
        <Tree ref="powerTree" class="powertree" :data="powerData" :empty-text="emptyText" @on-toggle-expand="expandTree" show-checkbox></Tree>
        <div slot="footer" class="button-box">
            <Button type="ghost" @click="cancelEditPower">取消</Button>
            <Button type="primary" :loading="isKeep"  @click="keepEditPower">保存</Button>
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
      editFormTitle: "",
      isAddShow: false,
      addRoleData: {
        name: "",
        description: ""
      },
      addRoleRules: {
        name: [{ required: true, message: "请输入角色名称" }]
      },
      isKeep: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "角色名称", key: "name", align: "center" },
        { title: "角色描述", key: "description", align: "center" },
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
                      this.editFormTitle = "角色编辑";
                      this.isAddShow = true;
                      this.addRoleData = JSON.parse(JSON.stringify(params.row));
                    }
                  }
                },
                "角色编辑"
              ),
              h(
                "Button",
                {
                  props: { type: "primary", size: "small" },
                  on: {
                    click: () => {
                      this.powerData = [];
                      this.getPowerData(params.row.id);
                      this.isEditPowerShow = true;
                    }
                  }
                },
                "权限设置"
              )
            ]);
          }
        }
      ],
      tableData: [],
      isPage: false,
      isEditPowerShow: false,
      powerData: [],
      emptyText: "加载中..."
    };
  },
  created() {
    this.getRole();
  },
  methods: {
    //   获取角色列表
    getRole() {
      const _this = this;
      this.$http
        .post("/get_roles")
        .then(function(res) {
          // console.log(res);
          _this.tableData = res.data.roles;
        })
        .catch(function(err) {
          console.log(err);
          _this.$Notice.error({ title: "角色列表获取失败！" });
        });
    },
    // 弹出新增角色
    showAddRole() {
      this.isAddShow = true;
      this.editFormTitle = "新增角色";
    },
    // 取消弹窗
    cancel(refName, showName) {
      this.$refs[refName].resetFields();
      this[showName] = false;
    },
    // 保存角色
    keepRole(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          const _this = this;
          this.$http
            .post("/add_role", this.addRoleData)
            .then(function(res) {
              //   console.log(res);
              _this.$refs[refName].resetFields();
              _this.getRole();
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
    },
    // 获取权限
    getPowerData(role) {
      const _this = this;
      this.$http
        .post("/get_permission", { roleId: role })
        .then(function(res) {
          //   console.log(res);
          _this.powerData = res.data.permissions.permission.map(function(
            parent_e
          ) {
            return {
              title: parent_e.permission_parent_name,
              //   parentId: parent_e.permission_parent_id,
              expand: false,
              children: parent_e.permission_child.map(function(child_e) {
                return {
                  title: child_e.permission_child_name,
                  checked: child_e.checked,
                  childrenId: child_e.permission_child_id,
                  roleId: role
                };
              })
            };
          });
        })
        .catch(function(err) {
          console.log(err);
          _this.emptyText = "权限获取失败!";
          _this.$Notice.error({ title: "权限获取失败!" });
        });
    },
    // 展开节点
    expandTree(arr) {
      // console.log(arr)
      this.powerData.forEach(e => {
        if (e.title !== arr.title) {
          e.expand = false;
        }
      });
    },
    // 取消权限设置
    cancelEditPower() {
      this.powerData = [];
      this.isEditPowerShow = false;
    },
    // 保存权限编辑
    keepEditPower() {
      var checkedNodes = this.$refs.powerTree.getCheckedNodes();
      var powerDataForAdmin = [];
      checkedNodes.forEach(e => {
        if (e.childrenId !== undefined) {
          powerDataForAdmin.push({
            permissionId: e.childrenId,
            roleId: e.roleId
          });
        }
      });

      this.isKeep = true;
      const _this = this;
      this.$http
        .post("/add_role_permission", powerDataForAdmin)
        .then(function(res) {
          //   console.log(res);
          _this.$Message.success("权限设置成功!");
          _this.isKeep = false;
          _this.isEditPowerShow = false;

          this.$Modal.confirm({
            title: "权限设置",
            content: <p>权限编辑成功，是否立即重新登录获取新权限？</p>,
            okText: "立即重登",
            cancelText: "稍后重登",
            loading: true,
            onOk: () => {
              // 退出
              const _this = this;
              this.$http
                .post("/logout")
                .then(function(res) {
                  // console.log(res);
                  localStorage.clear();
                  _this.$Message.success("退出成功!");
                  _this.$Modal.remove();
                  _this.$router.push("/");
                })
                .catch(function(err) {
                  console.log(err);
                  _this.$Notice.error({ title: "退出失败!" });
                });
            }
          });
        })
        .catch(function(err) {
          console.log(err);
          _this.isKeep = false;
          _this.$Notice.error({ title: "权限设置失败!" });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.powertree {
  width: 140px;
  margin: 0 auto 32px;
}
</style>
