<template>
    <div>
        <div class="temp-link clearfix">
            <a href="javascript:;" :class="{on: isOn.vipBase}" @click="selectTemp('vipBase')">基本资料</a>
            <a href="javascript:;" :class="{on: isOn.vipRelationship}" @click="selectTemp('vipRelationship')">亲属管理</a>
            <a href="javascript:;" :class="{on: isOn.vipHealth}" @click="selectTemp('vipHealth')">健康档案</a>
            <a href="javascript:;" :class="{on: isOn.vipMedication}" @click="selectTemp('vipMedication')">用药记录</a>
            <a href="javascript:;" :class="{on: isOn.vipHobby}" @click="selectTemp('vipHobby')">兴趣爱好</a>
            <a href="javascript:;" :class="{on: isOn.vipVisit}" @click="selectTemp('vipVisit')">就诊记录</a>
            <a href="javascript:;" :class="{on: isOn.vipCard}" @click="selectTemp('vipCard')">绑定会员卡号</a>
        </div>
        <transition name="fade" mode="out-in"><component :is="currentView"></component></transition>
    </div>
</template>
<script>
import vipBase from "./Base.vue";
import vipRelationship from "./Relationship.vue";
import vipHealth from "./Health.vue";
import vipMedication from "./Medication.vue";
import vipHobby from "./Hobby.vue";
import vipVisit from "./Visit.vue";
import vipCard from "./Card.vue";
export default {
  components: {
    vipBase,
    vipRelationship,
    vipHealth,
    vipMedication,
    vipHobby,
    vipVisit,
    vipCard
  },
  data() {
    return {
      currentView: "vipBase",
      isOn: {
        vipBase: true,
        vipRelationship: false,
        vipHealth: false,
        vipMedication: false,
        vipHobby: false,
        vipVisit: false,
        vipCard: false
      }
    };
  },
  created() {
    if (localStorage.getItem("isTemp")) {
      this.currentView = localStorage.getItem("isTemp");
      this.isOn[localStorage.getItem("isOn")] = true;
      this.isOn.vipBase = false;
    }
  },
  methods: {
    selectTemp(tempName) {
      if (localStorage.getItem("vipId") === "") {
        this.$Modal.warning({
          title: "新增会员提示",
          content: "<p>请先填写基本资料再做其他资料的录入</p>"
        });
      } else {
        this.currentView = tempName;
        localStorage.setItem("isTemp", this.currentView);
        for (var key in this.isOn) {
          if (key == tempName) {
            this.isOn[key] = true;
            localStorage.setItem("isOn", key);
          } else {
            this.isOn[key] = false;
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.temp-link {
  border-bottom: 1px solid #dddee1;
  margin-bottom: 24px;

  a {
    float: left;
    padding: 0 20px;
    height: 60px;
    color: #495060;
    line-height: 60px;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;

    &:hover,
    &.on {
      border-bottom-color: #0b9595;
    }
  }
}
</style>
