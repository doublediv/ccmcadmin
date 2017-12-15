<template>
    <div class="login-box">
        <Card class="login-card" :padding="0" :bordered="false">
            <div class="card-header"><img src="~@/assets/img/login_logo.png" alt="" /></div>
            <Form class="login-form" ref="login" :model="loginData" :rules="ruleLogin" :label-width="60">
                <FormItem label="帐号：" prop="user">
                    <Input type="text" v-model="loginData.user" placeholder="请输入帐号"></Input>
                </FormItem>
                <FormItem label="密码：" prop="password">
                    <Input type="password" v-model="loginData.password" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" long :loading="isLogin" @click="signIn('login')">登录</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      isLogin: false,
      loginData: {
        user: "admin",
        password: "admin"
      },
      test: [{ a: 1 }, { b: 2 }],
      ruleLogin: {
        user: [{ required: true, message: "请输入帐号" }],
        password: [{ required: true, message: "请输入密码" }]
      }
    };
  },
  methods: {
    // 登录
    signIn(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.isLogin = true;
          //   localStorage.clear()
          localStorage.setItem("username", this.loginData.user);
          const _this = this;
          this.$http
            .post("/ccmc/login", this.loginData)
            .then(function(res) {
              console.log(res);
              _this.$Message.success("登录成功!");
              _this.isLogin = false;
              //   _this.$router.push("/home");
            })
            .catch(function(err) {
              console.log(err);
              _this.$Message.error("登录失败!");
              _this.isLogin = false;
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.login-box {
  width: 100%;
  height: 100%;
  background: url("~@/assets/img/login_bg.jpg") no-repeat center;
  background-size: cover;

  .login-card {
    width: 360px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .card-header {
      padding: 14px 0;
      background-color: #333;

      img {
        display: block;
        margin: 0 auto;
      }
    }

    .login-form {
      padding: 20px 20px 0;
    }
  }
}
</style>
