<template>
    <div class="header">
        <div class="logo"><img src="~@/assets/img/login_logo.png" alt="" /></div>
        <p class="welcome">你好！欢迎使用CCMC基站管理系统</p>
        <ul class="user-info clearfix">
            <li><Icon type="person"></Icon><span>{{ username }}</span></li>
            <li><Button type="text" icon="log-out" :loading="isSignOut" @click="signOut">退出</Button></li>
        </ul>
    </div>
</template>
<script>
export default {
  data() {
    return {
      isSignOut: false
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("username");
      return username ? username : "未登录";
    }
  },
  methods: {
    signOut() {
      this.isSignOut = true;
      const _this = this;
      this.$http
        .post("/ccmc/logout", this.loginData)
        .then(function(res) {
          console.log(res);
          _this.$Message.success("退出成功!");
          _this.isSignOut = false;
          localStorage.clear()
          //   _this.$router.push("/login");
        })
        .catch(function(err) {
          console.log(err);
          _this.$Message.error("退出失败!");
          _this.isSignOut = false;
        });
    }
  }
  // handleCommand(command) {
  //     if(command == 'loginout'){
  //         localStorage.removeItem('ms_username')
  //         this.$router.push('/login');
  //     }
  // }
};
</script>
<style lang="less" scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  color: #fff;
  background-color: #333;
  overflow: hidden;

  .logo {
    position: absolute;
    top: 0;
    left: 0;
    width: 250px;
    height: 100%;

    img {
      display: block;
      margin: 15px auto 0;
    }

    &:after {
      content: "";
      position: absolute;
      top: 20px;
      right: 0;
      width: 1px;
      height: 30px;
      background-color: #6c6c6c;
    }
  }

  .welcome {
    font-size: 18px;
    line-height: 46px;
    margin-top: 12px;
    text-align: center;
  }

  .user-info {
    position: absolute;
    top: 16px;
    right: 40px;

    li {
      float: left;
      font-size: 16px;
      line-height: 34px;
      margin: 0 20px;

      span {
        margin-left: 8px;
      }

      button {
        font-size: 16px;
        line-height: 34px;
        padding: 0 10px;
        color: #fff;

        &:hover {
          color: #0b9595;
        }
      }
    }
  }
}
</style>
