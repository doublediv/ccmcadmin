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
      searchData: {
        name: "",
        idCard: "",
        phone: "",
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
                      this.show(params.index);
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
                              _this.getData("/getcustomer", { limit: 10, page: 1 });
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
    this.getData("/getcustomer", { limit: 10, page: 1 });
  },
  methods: {
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
      this.getData("/search_customer", this.searchData);
    },
    // 选页
    selectPage(pageNum) {
      this.getData("/getcustomer", { limit: 10, page: pageNum });
    }
  }
};
</script>
