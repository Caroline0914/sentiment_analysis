<template>
  <div class="wrapper">
    <input-cmp place="请输入电影名" @startGrip="setMap"/>
    <div :id="id"></div>
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
        id: "high"
      }
    },
    methods: {
      setMap(inp) {
        api.getKeyword({
          mName: inp,
          num: 500
        }).then(res => {
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
              formatter: function (a) {
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
        }, err => {
          console.log(err)
        });
      }
    }
  }
</script>

<style scoped>
.wrapper{
}
</style>