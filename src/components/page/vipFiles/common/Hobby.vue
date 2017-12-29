<template>
  <div class="consume-box">
    <p class="title">会员兴趣爱好</p>
    <Form :model="HobbyData" inline :label-width="80">
        <FormItem label="爱好:">
            <CheckboxGroup v-model="HobbyData.hobby">
                <Checkbox label="散步"></Checkbox>
                <Checkbox label="爬山"></Checkbox>
                <Checkbox label="戏曲"></Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="其他爱好:">
            <Input v-model="HobbyData.otherHobby" placeholder="请输入其他爱好"></Input>
        </FormItem>
        <FormItem label="兴趣特长:">
            <CheckboxGroup v-model="HobbyData.specialty">
                <Checkbox label="游泳"></Checkbox>
                <Checkbox label="棋牌"></Checkbox>
                <Checkbox label="跳舞"></Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="其他特长:">
            <Input v-model="HobbyData.otherSpecialty" placeholder="请输入其他特长"></Input>
        </FormItem>
        <div class="buttonbox">
            <Button :loading="isKeep" type="primary" @click="keepHobby">保存</Button>
        </div>
    </Form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      vipId: "",
      HobbyData: {
        hobby: [],
        otherHobby: "",
        specialty: [],
        otherSpecialty: ""
      },
      isKeep: false
    };
  },
  created() {
    this.vipId = localStorage.getItem("vipId");
    this.getHobbyData();
  },
  methods: {
    keepHobby() {
      let hobbyDataForAdmin = [];
      let hobbyContent;
      let specialtyContent;
      hobbyContent = this.HobbyData.hobby.join("|") + "|" + this.HobbyData.otherHobby
      specialtyContent = this.HobbyData.specialty.join("|") + "|" + this.HobbyData.otherSpecialty
      hobbyDataForAdmin.push({
        category: 2,
        content: hobbyContent
      });
      hobbyDataForAdmin.push({
        category: 1,
        content: specialtyContent
      });
      // console.log(hobbyDataForAdmin)
      this.$http
        .post("/add_hobbyandspeciaty/" + this.vipId, hobbyDataForAdmin)
        .then(res => {
          this.$Message.success("操作成功!");
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "操作失败！" });
        });
    },
    getHobbyData() {
      this.$http
        .post("/gethobbyandspeciaty", { customerId: this.vipId })
        .then(res => {
          let resData = res.data.hobbySpecialtys;
          let resDataHobby, resDataSpecialty;
          resData.forEach(element => {
            if (element.category == 2) {
              let hobbyArr = element.content.split("|");
              hobbyArr.forEach(h => {
                if (h === "散步" || h === "爬山" || h === "戏曲") {
                  this.HobbyData.hobby.push(h);
                } else {
                  this.HobbyData.otherHobby = h;
                }
              });
            } else {
              let specialtyArr = element.content.split("|");
              specialtyArr.forEach(h => {
                if (h === "游泳" || h === "棋牌" || h === "跳舞") {
                  this.HobbyData.specialty.push(h);
                } else {
                  this.HobbyData.otherSpecialty = h;
                }
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "兴趣爱好获取失败！" });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.consume-box {
  width: 580px;
  margin: 48px auto 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 30px;

  .title {
    font-size: 16px;
    margin-bottom: 24px;
    color: #0b9595;
    text-align: center;
  }

  .buttonbox {
    text-align: center;
    margin-top: 16px;

    button {
      margin: 0 4px;
    }
  }
}
</style>
