<template>
  <div class="data-analysis">
    <Button type="primary" shape="circle" icon="reply" @click="drawChinaData" v-show="isProvice" style="font-size: 20px"></Button>
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import china from "echarts/map/js/china";
import "echarts/map/js/province/anhui";
import "echarts/map/js/province/aomen";
import "echarts/map/js/province/beijing";
import "echarts/map/js/province/chongqing";
import "echarts/map/js/province/fujian";
import "echarts/map/js/province/gansu";
import "echarts/map/js/province/guangdong";
import "echarts/map/js/province/guangxi";
import "echarts/map/js/province/guizhou";
import "echarts/map/js/province/hainan";
import "echarts/map/js/province/hebei";
import "echarts/map/js/province/henan";
import "echarts/map/js/province/hubei";
import "echarts/map/js/province/hunan";
import "echarts/map/js/province/jiangsu";
import "echarts/map/js/province/jiangxi";
import "echarts/map/js/province/heilongjiang";
import "echarts/map/js/province/jilin";
import "echarts/map/js/province/liaoning";
import "echarts/map/js/province/neimenggu";
import "echarts/map/js/province/ningxia";
import "echarts/map/js/province/qinghai";
import "echarts/map/js/province/shandong";
//山西
import "echarts/map/js/province/shanxi";
//陕西
import "echarts/map/js/province/shanxi1";
import "echarts/map/js/province/sichuan";
import "echarts/map/js/province/taiwan";
import "echarts/map/js/province/tianjin";
import "echarts/map/js/province/xianggang";
import "echarts/map/js/province/xinjiang";
import "echarts/map/js/province/xizang";
import "echarts/map/js/province/yunnan";
import "echarts/map/js/province/zhejiang";
export default {
  data() {
    return {
      allVipNum: "",
      provinceVipNum: "",
      isProvice: false,
      mapEchart: "",
      provincesData: [],
      allBranchOffice: [],
      allBaseStation: [],
      ProvinceBranchOffice: [],
      ProvinceBaseStation: [],
      mapOption: {
        title: {
          text: "",
          left: "center"
        },
        tooltip: {
          formatter: function(params) {
            // console.log(params);
            // if (!params.name) return;
            if (params.seriesIndex == 3) {
              if (!params.value) {
                return;
              } else {
                return (
                  params.seriesName +
                  "<br />" +
                  params.name +
                  ":" +
                  params.value
                );
              }
            } else {
              if (params.seriesId === "bar") {
                return params.name + ":" + params.value;
              } else {
                return params.name + ":" + params.value[2];
              }
            }
          }
        },
        geo: {
          map: "",
          left: "10",
          right: "40%",
          roam: true,
          zoom: 0.8,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              color: "#fff",
              padding: 6,
              backgroundColor: "rgba(0, 0, 0, .5)",
              borderRadius: 4,
              show: true
            }
          },
          itemStyle: {
            normal: {
              areaColor: "#097e7e",
              borderColor: "#222"
            },
            emphasis: {
              areaColor: "#086868"
            }
          }
        },
        // 柱状图
        grid: {
          right: 40,
          top: 100,
          bottom: 40,
          width: "30%"
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 1]
        },
        yAxis: {
          type: "category",
          data: []
        },
        series: [
          {
            name: "分公司",
            type: "scatter",
            coordinateSystem: "geo",
            symbolSize: 16,
            itemStyle: {
              normal: {
                color: "#f90"
              }
            },
            data: []
          },
          {
            name: "基站",
            type: "scatter",
            coordinateSystem: "geo",
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: "#3abfbf"
              }
            },
            data: []
          },
          {
            name: "会员数据",
            id: "bar",
            zlevel: 2,
            type: "bar",
            symbol: "none",
            itemStyle: {
              normal: {
                color: "#086868"
              }
            },
            data: []
          }
        ]
      }
    };
  },
  mounted() {
    switch (localStorage.getItem("companyCategory")) {
      case "1":
        // 获取地图数据（1：各省会员数，2：分公司点， 3：基站点）
        this.$http
          .all([
            this.$http.get("/all_province_map"),
            this.$http.post("/province_f_map", { category: 2 }),
            this.$http.post("/province_f_map", { category: 3 }),
            this.$http.post("/count_people")
          ])
          .then(
            this.$http.spread((acct, perms, res, vipNum) => {
              // 两个请求现在都执行完成
              // console.log(vipNum);
              this.provincesData = acct.data.map;
              this.provincesData = this.provincesData.map(item => {
                item.name = item.name.replace(/省/, "");
                return item;
              });
              this.allBranchOffice = perms.data.echartMap;
              this.allBaseStation = res.data.echartMap;
              this.allVipNum = vipNum.data.count;
              this.drawChinaData();
            })
          )
          .catch(err => {
            console.log(err);
            this.$Notice.error({ title: "地图数据请求失败！" });
          });
        // 创建地图
        this.mapEchart = echarts.init(this.$refs.map);

        // 地图下钻
        this.mapEchart.on("click", this.drawProvinceMap);
        break;
      case "2":
        // 创建地图
        this.mapEchart = echarts.init(this.$refs.map);
        const provinceName = localStorage.getItem("province").replace(/省/, "")
        this.$http
          .all([
            this.$http.post("/company_f_map", {
              companyId: localStorage.getItem("companyId"),
              category: "2"
            }),
            this.$http.post("company_j_map", {
              companyId: localStorage.getItem("companyId"),
              category: "3"
            })
          ])
          .then(
            this.$http.spread((acct, perms) => {
              // console.log(acct);
              // console.log(perms);
              this.ProvinceBranchOffice = acct.data.data;
              this.ProvinceBaseStation = perms.data.data;
              // this.provinceVipNum = acct.data.data.value[2];
              let yAxisData = this.ProvinceBaseStation.map(function(item) {
                return item.name;
              });
              let xAxisData = this.ProvinceBaseStation.map(function(item) {
                return item.value[2];
              });
              this.drawMap(provinceName);
              this.mapEchart.setOption({
                yAxis: {
                  data: yAxisData
                },
                series: [
                  {
                    name: "分公司",
                    data: this.ProvinceBranchOffice
                  },
                  {
                    name: "基站",
                    data: this.ProvinceBaseStation
                  },
                  {
                    id: "bar",
                    data: xAxisData
                  }
                ]
              });
            })
          )
          .catch(err => {
            console.log(err);
            this.$Notice.error({ title: "地图数据请求失败！" });
          });
        break;

      default:
        break;
    }
  },
  methods: {
    // 画地图
    drawMap(area) {
      if (area === "china") {
        this.mapOption.title.text = "全国会员总数：" + this.allVipNum;
      } else {
        this.mapOption.title.text = area + "会员总数：" + this.provinceVipNum;
      }
      this.mapOption.geo.map = area;
      this.mapEchart.setOption(this.mapOption, true);
    },
    // 画中国地图
    drawChinaData() {
      this.isProvice = false;
      let yAxisData = this.provincesData.map(function(item) {
        return item.name;
      });
      let xAxisData = this.provincesData.map(function(item) {
        return item.value;
      });
      this.drawMap("china");
      this.mapEchart.setOption({
        yAxis: {
          data: yAxisData
        },
        series: [
          {
            name: "分公司",
            data: this.allBranchOffice
          },
          {
            name: "基站",
            data: this.allBaseStation
          },
          {
            name: "各省数据",
            type: "map",
            geoIndex: 0,
            data: this.provincesData
          },
          {
            id: "bar",
            data: xAxisData
          }
        ]
      });
    },
    // 画各省地图
    drawProvinceMap(params) {
      // console.log(params);
      if (params.seriesIndex == 1 || !params.value) return;
      this.isProvice = true;

      this.$http
        .all([
          this.$http.post("/province_f_map", {
            province: params.name + "省",
            category: 2
          }),
          this.$http.post("/province_f_map", {
            province: params.name + "省",
            category: 3
          }),
          this.$http.post("/count_people", { province: params.name + "省" })
        ])
        .then(
          this.$http.spread((acct, perms, vipNum) => {
            // 两个请求现在都执行完成
            // console.log(vipNum);
            this.ProvinceBranchOffice = acct.data.echartMap;
            this.ProvinceBaseStation = perms.data.echartMap;
            this.provinceVipNum = vipNum.data.count;
            let yAxisData = this.ProvinceBranchOffice.map(function(item) {
              return item.name;
            });
            let xAxisData = this.ProvinceBranchOffice.map(function(item) {
              return item.value[2];
            });
            this.drawMap(params.name);
            this.mapEchart.setOption({
              yAxis: {
                data: yAxisData
              },
              series: [
                {
                  name: "分公司",
                  data: this.ProvinceBranchOffice
                },
                {
                  name: "基站",
                  data: this.ProvinceBaseStation
                },
                {
                  id: "bar",
                  data: xAxisData
                }
              ]
            });
          })
        )
        .catch(err => {
          console.log(err);
          this.$Notice.error({ title: "地图数据请求失败！" });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.map {
  width: 90%;
  height: 700px;
  margin: 0 auto;
}
</style>


