<template>
    <div>
        <Form :model="searchData" inline :label-width="80">
            <FormItem label="会员姓名:">
                <Input type="text" v-model="searchData.name" placeholder="按会员姓名搜索"></Input>
            </FormItem>
            <FormItem label="身份证号:">
                <Input type="text" v-model="searchData.idCard" placeholder="按身份证号搜索"></Input>
            </FormItem>
            <FormItem label="联系方式:">
                <Input type="text" v-model="searchData.phone" placeholder="按手机号搜索"></Input>
            </FormItem>
            <FormItem v-if="isZb" label="所属分公司:">
                <Select v-model="searchData.fgs" placeholder="按所属分公司搜索" @on-change="getJcompany" style="width:164px">
                    <Option value="">请选择</Option>
                    <Option v-for="item in companyArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem v-if="!isJz" label="所属基站:">
                <Select v-model="searchData.jz" placeholder="按所属基站搜索" @on-change="selectJz" style="width:164px">
                  <Option value="">请选择</Option>
                  <Option v-for="item in baseStationArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <Button class="singlebutton" icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
        </Form>
        <v-table ref="vTable" :tableColumns="tableColumns" :tableData="tableData" :totalPage="totalPage" :isPage="isPage" @getPage="selectPage"></v-table>
    </div>
</template>

<script>
import vTable from "../../common/Table.vue";
export default {
  components: { vTable },
  data() {
    return {
      companyArr: [],
      baseStationArr: [],
      isZb: false,
      isJz: false,
      searchData: {
        name: "",
        idCard: "",
        phone: "",
        fgs: "",
        jz: "",
        companyId: "",
        companyCategory: "",
        limit: 10,
        page: 0
      },
      isSearch: false,
      tableColumns: [
        { type: "index", align: "center", width: "60" },
        { title: "姓名", key: "name", align: "center" },
        { title: "性别", key: "gender", align: "center" },
        { title: "年龄", key: "age", align: "center" },
        { title: "会员手机", key: "phone", align: "center" },
        { title: "会员卡号", key: "vipcard", align: "center" },
        { title: "居住情况", key: "liveTogether", align: "center" },
        { title: "所属基站", key: "companyName", align: "center" },
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
                      // console.log(params.row)
                      this.$router.push(
                        "/vipdata/vip/edit/" + params.row.customerId
                      );
                    }
                  }
                },
                "查看"
              ),
              h(
                "Button",
                {
                  props: { type: "error", size: "small" },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "删除确认",
                        content: `<p>姓名：${params.row.name}</p>
                                 <p>会员手机：${params.row.phone}</p>
                                 <p>会员卡号：${params.row.vipcard}</p>
                                 <p>所属基站：${params.row.companyName}</p>`,
                        okText: "确认",
                        cancelText: "取消",
                        loading: true,
                        onOk: () => {
                          const _this = this;
                          this.$http
                            .post("/remove_customer", {
                              customerId: params.row.customerId
                            })
                            .then(function(res) {
                              _this.$Modal.remove();
                              _this.tableData.splice(params.index, 1);
                              _this.$Message.success("会员删除成功!");
                              _this.getData("/getcustomer", {
                                limit: 10,
                                page: 1
                              });
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
      totalPage: 0,
      isPage: false
    };
  },
  created() {
    //   初始数据
    switch (localStorage.getItem("companyCategory")) {
      case "1":
        this.isZb = true;
        this.getFcompany();
        break;
      case "2":
        this.getJcompany(localStorage.getItem("companyId"));
        break;
      case "3":
        this.isJz = true;
        break;

      default:
        break;
    }
    this.getData("/getcustomer", this.searchData);
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
      this.searchData.companyCategory = "2";
      this.searchData.companyId = this.searchData.fgs;
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
    // 选择基站
    selectJz() {
      this.searchData.companyCategory = "3";
      this.searchData.companyId = this.searchData.jz;
    },
    // 获取数据
    getData(url, jsonData) {
      const _this = this;
      this.tableData = [];
      this.$http
        .post(url, jsonData)
        .then(function(res) {
          // console.log(res)
          _this.tableData = res.data.customers.map(function(e) {
            switch (e.gender) {
              case 1:
                e.gender = "男";
                break;
              case 2:
                e.gender = "女";
                break;

              default:
                break;
            }
            return e;
          });
          //   分页
          _this.totalPage = res.data.paginator.totalCount;
          if (res.data.paginator.totalPages > 1) {
            _this.isPage = true;
          } else {
            _this.isPage = false;
          }
          if (_this.isSearch) {
            _this.isSearch = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.$refs.vTable.$emit("getErr");
          _this.$Notice.error({ title: "会员信息获取失败！" });
          if (_this.isSearch) {
            _this.isSearch = false;
          }
        });
    },
    //   搜索
    search() {
      this.isSearch = true;
      this.isPage = false;
      this.getData("/getcustomer", this.searchData);
    },
    // 选页
    selectPage(pageNum) {
      this.getData("/getcustomer", {limit: 10, page: pageNum});
    }
  }
};
</script>
