<template>
  <div class="wrapper">
    <input-cmp place="请输入电影名" @startGrip="setMap"/>
    <div :id="id"></div>
    <div class="noData" v-if="showData">暂无数据</div>
  </div>
</template>

<script>
  import Highcharts from 'highcharts';
  import Exporting from 'highcharts/modules/exporting';
  import WordCloud from 'highcharts/modules/wordcloud';
  import api from '@/api/index';
  import InputCmp from '../grip/component/inputCmp';

  Exporting(Highcharts);
  WordCloud(Highcharts);

  export default {
    name: "WordCloud",
    components: {
      InputCmp
    },
    data() {
      return {
        id: "cloud",
        showData: false
      }
    },
    methods: {
      setMap(inp) {
        api.getKeyword({
          mName: inp,
          num: 500
        }).then(res => {
          if(res.data.length) {
              console.log(res);
            this.showData = false;
            Highcharts.chart(this.id, {
              chart: {
                height: '500px'
              },
              series: [{
                type: 'wordcloud',
                data: res.data
              }],
              title: {
                text: `${inp}词云图`
              },
              tooltip: {
                formatter: function () {
                  return `${this.point.name}<br/>count：${this.point.num}`
                }
              },
              exporting: {//导出
                  enabled: false
              },
              credits: {//版权信息
                  enabled: false
              }
            });
          } else {
            this.showData = true;
            Highcharts.chart(this.id, {
              title: {
                text: ``
              },
              exporting: {//导出
                enabled: false
              },
              credits: {//版权信息
                enabled: false
              }
            });
          }
        }, err => {
          console.log(err)
        });
      }
    }
  }
</script>

<style scoped>
.wrapper{
  position: relative;
}
.wrapper .noData{
  position: absolute;
  left: 500px;
  top: 200px;
}
</style>