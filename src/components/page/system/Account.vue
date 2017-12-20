<template>
    <div>
        <Form :model="searchData" inline :label-width="60">
            <FormItem label="账号:">
                <Input type="text" v-model="searchData.username" placeholder="按会员账号搜索"></Input>
            </FormItem>
            <FormItem label="手机号:">
                <Input type="text" v-model="searchData.phone" placeholder="按手机号搜索"></Input>
            </FormItem>
            <FormItem label="角色:">
                <Select v-model="searchData.roleId" placeholder="按角色搜索" style="width:164px">
                    <Option value="">请选择</Option>
                    <Option v-for="item in roleOption" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
            </FormItem>
            <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
        </Form>
        <Button class="addbutton" icon="plus-round" type="dashed" @click="showAddAccount">新增帐号</Button>
        <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" :isPage="isPage"></v-table>
        <!-- 新增 -->
        <Modal 
            v-model="isAddShow"
            :closable="false"
            :mask-closable="false"
            :width="358"
            class-name="eidthform">
            <p slot="header">添加帐号</p>
            <Form ref="addAccountForm" :model="addAccountData" :rules="addAccountRules" :label-width="90">
                <FormItem label="账号:" prop="username">
                    <Input type="text" v-model="addAccountData.username" placeholder="请输入帐号"></Input>
                </FormItem>
                <FormItem label="密码:" prop="password">
                    <Input type="password" v-model="addAccountData.password" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem label="确认密码:" prop="repassword">
                    <Input type="password" v-model="addAccountData.repassword" placeholder="请确认密码"></Input>
                </FormItem>
                <FormItem label="使用者姓名:" prop="name">
                    <Input type="text" v-model="addAccountData.name" placeholder="请输入使用者姓名"></Input>
                </FormItem>
                <FormItem label="性别:" prop="gender">
                    <RadioGroup v-model="addAccountData.gender">
                        <Radio label="1">男</Radio>
                        <Radio label="2">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="联系电话:" prop="phone">
                    <Input type="text" v-model="addAccountData.phone" placeholder="请输入联系电话"></Input>
                </FormItem>
                <FormItem label="角色:" prop="roleId">
                    <Select v-model="addAccountData.roleId" placeholder="请选择角色" placement="top" style="width:100%">
                        <Option v-for="item in roleOption" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer" class="button-box">
                <Button type="ghost" @click="cancel('addAccountForm', 'isAddShow')">取消</Button>
                <Button type="primary" :loading="isKeep"  @click="addAccount('addAccountForm')">添加</Button>
            </div>
        </Modal>
        <!-- 修改 -->
        <Modal 
            v-model="isEditShow"
            :closable="false"
            :mask-closable="false"
            :width="358"
            class-name="eidthform">
            <p slot="header">编辑帐号</p>
            <Form ref="editAccountForm" :model="editAccountData" :rules="editAccountRules" :label-width="90">
                <FormItem label="账号:" prop="username">
                    <Input type="text" v-model="editAccountData.username" placeholder="请输入帐号"></Input>
                </FormItem>
                <FormItem label="密码:">
                    <Input type="password" v-model="editAccountData.password" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem label="确认密码:" prop="repassword">
                    <Input type="password" v-model="editAccountData.repassword" placeholder="请确认密码"></Input>
                </FormItem>
                <FormItem label="使用者姓名:" prop="name">
                    <Input type="text" v-model="editAccountData.name" placeholder="请输入使用者姓名"></Input>
                </FormItem>
                <FormItem label="性别:" prop="gender">
                    <RadioGroup v-model="editAccountData.gender">
                        <Radio label="1">男</Radio>
                        <Radio label="2">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="联系电话:" prop="phone">
                    <Input type="text" v-model="editAccountData.phone" placeholder="请输入联系电话"></Input>
                </FormItem>
                <FormItem label="角色:" prop="roleId">
                    <Select v-model="editAccountData.roleId" placeholder="请选择角色" placement="top" style="width:100%">
                        <Option v-for="item in roleOption" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer" class="button-box">
                <Button type="ghost" @click="cancel('editAccountForm', 'isEditShow')">取消</Button>
                <Button type="primary" :loading="isKeep"  @click="editAccount('editAccountForm')">修改</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import vTable from "../../common/Table.vue";
export default {
  components: { vTable },
  data() {
    //   添加帐号确认密码规则
    const rePassWordRule = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.addAccountData.password) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    //   编辑帐号确认密码规则
    const editRePassWordRule = (rule, value, callback) => {
      if (value !== this.editAccountData.password) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    const phoneRule = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入联系电话"));
      } else if (!/((^\d{11}$)|(^(\d{3,4}-)?\d{7,8}$))/.test(value)) {
        //   支持手机号码，3-4位区号，7-8位直播号码
        callback(new Error("请输入正确的联系电话"));
      } else {
        callback();
      }
    };
    return {
      roleOption: [],
      searchData: {
        phone: "",
        username: "",
        roleId: ""
      },
      isSearch: false,
      tableColumns: [
        { title: "账号", key: "username", align: "center" },
        { title: "姓名", key: "name", align: "center" },
        { title: "性别", key: "gender", align: "center" },
        { title: "所属机构", key: "companyName", align: "center" },
        { title: "手机号", key: "phone", align: "center" },
        { title: "角色", key: "roleName", align: "center" },
        {
          title: "操作",
          key: "action",
          width: 180,
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
                      this.isEditShow = true;
                      this.editAccountData = JSON.parse(
                        JSON.stringify(params.row)
                      );
                      if (this.editAccountData.gender === "男") {
                        this.editAccountData.gender = "1";
                      } else {
                        this.editAccountData.gender = "2";
                      }
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: { type: "ghost", size: "small" },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      const _this = this;
                      var statusNum, statusText;
                      if (params.row.status === "禁用") {
                        statusNum = "99";
                        statusText = "启用";
                      } else {
                        statusNum = "0";
                        statusText = "禁用";
                      }
                      this.$http
                        .post("/enable_user", {
                          userId: params.row.id,
                          status: statusNum
                        })
                        .then(function(res) {
                          params.row.status = statusText;
                          _this.$Message.success("会员状态变更成功!");
                        })
                        .catch(function(err) {
                          console.log(err);
                          _this.$Notice.error({ title: "会员状态变更失败！" });
                        });
                    }
                  }
                },
                params.row.status
              ),
              h(
                "Button",
                {
                  props: { type: "error", size: "small" },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "删除确认",
                        content: `<p>帐号：${params.row.username}</p>
                                 <p>姓名：${params.row.name}</p>
                                 <p>角色：${params.row.roleName}</p>`,
                        okText: "确认",
                        cancelText: "取消",
                        loading: true,
                        onOk: () => {
                          const _this = this;
                          this.$http
                            .post("/enable_user", {
                              userId: params.row.id,
                              status: "9"
                            })
                            .then(function(res) {
                              _this.$Modal.remove();
                              _this.tableData.splice(params.index, 1);
                              _this.$Message.success("会员删除成功!");
                            })
                            .catch(function(err) {
                              console.log(err);
                              _this.$Notice.error({ title: "会员删除失败！" });
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
      isAddShow: false,
      addAccountData: {
        username: "",
        password: "",
        repassword: "",
        name: "",
        gender: "",
        phone: "",
        roleId: ""
      },
      addAccountRules: {
        username: [{ required: true, message: "请输入帐号" }],
        password: [{ required: true, message: "请输入密码" }],
        repassword: [{ required: true, validator: rePassWordRule }],
        name: [{ required: true, message: "请输入使用者姓名" }],
        gender: [{ required: true, message: "请选择性别" }],
        phone: [{ required: true, validator: phoneRule }],
        roleId: [{ required: true, message: "请选择角色" }]
      },
      isEditShow: false,
      editAccountData: {
        username: "",
        password: "",
        repassword: "",
        name: "",
        gender: "",
        phone: "",
        roleId: ""
      },
      editAccountRules: {
        username: [{ required: true, message: "请输入帐号" }],
        repassword: [{ validator: editRePassWordRule }],
        name: [{ required: true, message: "请输入使用者姓名" }],
        gender: [{ required: true, message: "请选择性别" }],
        phone: [{ required: true, validator: phoneRule }],
        roleId: [{ required: true, message: "请选择角色" }]
      },
      isKeep: false
    };
  },
  created() {
    this.getRoleOption();
    this.getUser();
  },
  methods: {
    //   获取角色列表
    getRoleOption() {
      const _this = this;
      this.$http
        .post("/get_roles")
        .then(function(res) {
          // console.log(res);
          _this.roleOption = res.data.roles.map(function(e) {
            e.id = e.id.toString();
            return e;
          });
        })
        .catch(function(err) {
          console.log(err);
          _this.$Notice.error({ title: "角色列表获取失败！" });
        });
    },
    // 获取帐号列表
    getUser() {
      const _this = this;
      this.$http
        .post("/get_users", this.searchData)
        .then(function(res) {
          // console.log(res);
          //   "status": "99"   9 表示删除  99 表示禁用  0表示正常
          _this.tableData = res.data.user.map(function(e) {
            switch (e.status) {
              case "0":
                e.status = "禁用";
                break;
              case "99":
                e.status = "启用";
                break;

              default:
                break;
            }
            return e;
          });
          if (_this.isSearch) {
            _this.isSearch = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.$refs.vTable.$emit("getErr");
          _this.$Notice.error({ title: "帐号列表获取失败！" });
          if (_this.isSearch) {
            _this.isSearch = false;
          }
        });
    },
    //   搜索
    search() {
      this.isSearch = true;
      this.getUser();
    },
    // 弹出新增账号
    showAddAccount() {
      this.isAddShow = true;
    },
    // 取消弹窗
    cancel(refName, showName) {
      this.$refs[refName].resetFields();
      this[showName] = false;
    },
    // 新增帐号
    addAccount(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          var accountDataForAdmin = JSON.parse(
            JSON.stringify(this.addAccountData)
          );
          delete accountDataForAdmin.repassword;
          const _this = this;
          this.$http
            .post("/add_user", accountDataForAdmin)
            .then(function(res) {
              // console.log(res);
              if (res.data.status === 2001) {
                _this.$Notice.error({ title: "帐号名已存在，添加失败!" });
              } else {
                _this.$refs[refName].resetFields();
                _this.$Message.success("新增帐号成功!");
                _this.getUser();
                _this.isAddShow = false;
              }
              _this.isKeep = false;
            })
            .catch(function(err) {
              console.log(err);
              _this.isKeep = false;
              _this.$Notice.error({ title: "新增帐号失败!" });
            });
        }
      });
    },
    // 修改
    editAccount(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.isKeep = true;
          const _this = this;
          this.$http
            .post("/modify_user", {
              id: this.addAccountData.id,
              password: this.addAccountData.password,
              gender: this.addAccountData.gender,
              phone: this.addAccountData.phone,
              roleId: this.addAccountData.roleId,
              name: this.addAccountData.name,
              username: this.addAccountData.username
            })
            .then(function(res) {
              // console.log(res);
              _this.$refs[refName].resetFields();
              _this.isKeep = false;
              _this.$Message.success("修改帐号成功!");
              _this.getUser();
              _this.isEditShow = false;
            })
            .catch(function(err) {
              console.log(err);
              _this.isKeep = false;
              _this.$Notice.error({ title: "修改帐号失败!" });
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>

</style>
