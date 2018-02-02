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
      vipNum: 3000000,
      isProvice: false,
      mapEchart: "",
      allchinaData: [
        {
          name: "海门",
          value: [121.15, 31.89, 100]
        },
        {
          name: "鄂尔多斯",
          value: [109.781327, 39.608266, 300]
        },
        {
          name: "招远",
          value: [120.38, 37.35, 500]
        },
        {
          name: "舟山",
          value: [122.207216, 29.985295, 400]
        },
        {
          name: "齐齐哈尔",
          value: [123.97, 47.33, 600]
        },
        {
          name: "赤峰",
          value: [118.87, 42.28, 5000]
        },
        {
          name: "青岛",
          value: [120.33, 36.07, 1600]
        },
        {
          name: "乳山",
          value: [121.52, 36.89, 56]
        },
        {
          name: "金昌",
          value: [102.188043, 38.520089, 4616]
        },
        {
          name: "泉州",
          value: [118.58, 24.93, 2635]
        },
        {
          name: "莱西",
          value: [120.53, 36.86, 1565]
        },
        {
          name: "日照",
          value: [119.46, 35.42, 2389]
        },
        {
          name: "胶南",
          value: [119.97, 35.88, 566]
        },
        {
          name: "南通",
          value: [121.05, 32.08, 46400]
        },
        {
          name: "云浮",
          value: [121.05, 32.08, 464]
        },
        {
          name: "梅州",
          value: [116.1, 24.55, 784]
        },
        {
          name: "文登",
          value: [122.05, 37.2, 112]
        },
        {
          name: "上海",
          value: [121.48, 31.22, 847]
        }
      ],
      provincesData: [
        { name: "北京", value: 100 },
        { name: "天津", value: 100 },
        { name: "上海", value: 100 },
        { name: "重庆", value: 100 },
        { name: "河北", value: 100 },
        { name: "河南", value: 100 },
        { name: "云南", value: 100 },
        { name: "辽宁", value: 100 },
        { name: "黑龙江", value: 100 },
        { name: "湖南", value: 100 },
        { name: "安徽", value: 100 },
        { name: "山东", value: 100 },
        { name: "新疆", value: 100 },
        { name: "江苏", value: 100 },
        { name: "浙江", value: 100 },
        { name: "江西", value: 100 },
        { name: "湖北", value: 100 },
        { name: "广西", value: 100 },
        { name: "甘肃", value: 100 },
        { name: "山西", value: 100 },
        { name: "内蒙古", value: 100 },
        { name: "陕西", value: 100 },
        { name: "吉林", value: 100 },
        { name: "福建", value: 0 },
        { name: "贵州", value: 0 },
        { name: "广东", value: 300 },
        { name: "青海", value: 0 },
        { name: "西藏", value: 0 },
        { name: "四川", value: 0 },
        { name: "宁夏", value: 0 },
        { name: "海南", value: 0 },
        { name: "台湾", value: 0 },
        { name: "香港", value: 0 },
        { name: "澳门", value: 0 }
      ],
      allProvinceData: [
        {
          name: "基站1",
          value: [109.781327, 39.608266, 300]
        },
        {
          name: "基站2",
          value: [100.556147,41.736375, 654]
        },
        {
          name: "基站3",
          value: [114.83245,43.74319, 400]
        },
        {
          name: "基站4",
          value: [121.602655,43.636387, 200]
        },
        {
          name: "基站5",
          value: [117.776017,48.887859, 11]
        }
      ],
      mapOption: {
        title: {
          text: "",
          left: "center"
        },
        tooltip: {
          formatter: function(params) {
            // console.log(params)
            // if (!params.name) return;
            if (params.seriesIndex) {
              return (
                params.seriesName + "<br />" + params.name + ":" + params.value
              );
            } else {
              return params.name + ":" + params.value[2];
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
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: []
        },
        series: [
          {
            name: "机构",
            type: "scatter",
            coordinateSystem: "geo",
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: "#3abfbf"
              },
              emphasis: {
                borderColor: "#5dbfbf",
                borderWidth: 1
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
    // 创建地图
    this.mapEchart = echarts.init(this.$refs.map);
    this.drawChinaData();
    // 地图下钻
    this.mapEchart.on("click", this.drawProvinceMap);
  },
  methods: {
    // 画地图
    drawMap(area) {
      if (area === "china") {
        this.mapOption.title.text = "全国会员总数：" + this.vipNum;
        this.mapOption.geo.label.emphasis.show = false;
      } else {
        this.mapOption.title.text = area + "会员总数：" + this.vipNum;
        this.mapOption.geo.label.emphasis.show = true;
      }
      this.mapOption.geo.map = area;
      this.mapEchart.setOption(this.mapOption, true);
      // 异步加载数据
      // this.mapEchart.showLoading();
      // $.get("data.json").done(function(data) {
      // this.mapEchart.hideLoading();
      //   // 填入数据
      //   this.mapEchart.setOption({
      //     series: [
      //       {
      //         // 根据名字对应到相应的系列
      //         name: "分公司",
      //         data: data.data
      //       }
      //     ]
      //   });
      // });
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
            name: "机构",
            data: this.allchinaData
          },
          {
            name: "各省数据",
            type: "map",
            geoIndex: 0,
            data: this.provincesData
          },
          {
            id: 'bar',
            data: xAxisData
          }
        ]
      });
    },
    // 画各省地图
    drawProvinceMap(params) {
      // console.log(params);
      if (!params.seriesIndex || !params.value) return;
      this.isProvice = true;
      this.drawMap(params.name);
      // this.addData("基站", this.allProvinceData);
      let yAxisData = this.allProvinceData.map(function(item) {
        return item.name;
      });
      let xAxisData = this.allProvinceData.map(function(item) {
        return item.value[2];
      });
      
      this.mapEchart.setOption({
        yAxis: {
          data: yAxisData
        },
        series: [
          {
            name: "机构",
            data: this.allProvinceData
          },
          {
            id: 'bar',
            data: xAxisData
          }
        ]
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


