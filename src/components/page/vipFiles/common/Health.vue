<template>
  <div>
    <Table class="mb24" :columns="tablecolumns" :data="data1" border></Table>
    <Table class="mb24" :columns="tablecolumns" :data="data2" border></Table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tablecolumns: [
        { title: "参数说明", key: "name", align: "center"},
        { title: "值", key: "value", align: "center"}
      ],
      data1: [
        {name: "姓名", key: "张三"},
        {name: "检测时间", key: "2017-09-09"},
        {name: "身份证", key: "123456789874564564"}
      ],
      data2: [
        {name: "收缩压", key: "11"},
        {name: "舒张压", key: "11"},
        {name: "心率", key: "11"},
        {name: "血氧", key: "11"},
        {name: "血糖的类型（1.空腹，2.餐后）", key: "11"},
        {name: "脂肪", key: "11"},
        {name: "基础代谢率", key: "11"},
        {name: "水分含量", key: "11"},
        {name: "身高", key: "11"},
        {name: "体重", key: "11"},
        {name: "体重指数", key: "11"},
        {name: "体温", key: "11"},
        {name: "血红蛋白", key: "11"},
        {name: "尿酸", key: "11"},
        {name: "总胆固醇", key: "11"},
        {name: "腰围", key: "11"},
        {name: "臀围", key: "11"},
        {name: "腰臀比", key: "11"},
        {name: "检测时间", key: "2017-09-09"}
      ]
    };
  }
};
</script>
<style lang="less" scoped>
.mb24{
  margin-bottom: 24px;
}
</style>
