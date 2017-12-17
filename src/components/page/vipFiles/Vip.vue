<template>
    <div>
        <Form :model="vipSearch" :label-width="80">
            <FormItem label="会员姓名:">
                <Input v-model="vipSearch.name" placeholder="按会员姓名搜索"></Input>
            </FormItem>
            <FormItem label="身份证号:">
                <Input v-model="vipSearch.idCard" placeholder="按身份证号搜索"></Input>
            </FormItem>
            <FormItem label="联系方式:">
                <Input v-model="vipSearch.phone" placeholder="按手机号搜索"></Input>
            </FormItem>
            <FormItem>
                <Button icon="ios-search" :loading="isSearch" type="primary" @click="search">搜索</Button>
        <Form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            vipSearch: {
                name: "",
                idCard: "",
                phone: "",
                limit: "10",
                page: "0"
            },
            isSearch: false
        }
    },
    methods: {
        // 获取数据
        getData() {
            
        },
        search() {
            this.isSearch = true;
            const _this = this;
            this.$http
                .post("/search_customer", this.vipSearch)
                .then(function(res) {
                // console.log(res);
                localStorage.setItem("username", res.data.user.userName);
                localStorage.setItem("sidebarnav", JSON.stringify(res.data.user.permission));
                _this.$Message.success("登录成功!");
                _this.isSearch = false;
                _this.$router.push("/home");
                })
                .catch(function(err) {
                console.log(err);
                _this.$Notice.error({title: "登录失败!"});
                _this.isSearch = false;
                });
        }
    }
}
</script>
