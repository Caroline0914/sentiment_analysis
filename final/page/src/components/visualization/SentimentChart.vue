<template>
  <el-row class="wrapper">
    <el-col :span="10">
      <div class="title">影评</div>
      <textarea class="comment" v-model="content" readonly></textarea>
    </el-col>
    <el-col :span="3" class="btns">
      <el-button type="primary" round @click="refresh">更新影评</el-button>
      <el-button type="primary" round @click="start(twoSent, sevenSent)">开始分析</el-button>
    </el-col>
    <el-col :span="11" class="pic">
      <div class="title">分析图</div>
      <div :id="id"></div>
    </el-col>
  </el-row>
</template>

<script>
  import Highcharts from 'highcharts';
  import Exporting from 'highcharts/modules/exporting';
  import api from '@/api/index';

  Exporting(Highcharts);

  export default {
    name: "SentimentChart",
    data() {
      return {
        content: '',
        id: 'sentiment',
        movieName: '',
        twoSent: [],
        sevenSent: []
      }
    },
    mounted(){
      this.refresh();
    },
    methods: {
      start(twoSent, sevenSent) {
        Highcharts.chart(this.id, {
          chart: {
            type: 'pie',
          },
          title: {
            text: `影评分析`
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              states: {
                hover: {
                  halo: {
                    size: 0
                  }
                }
              }
            }
          },
          exporting: {//导出
            enabled: false
          },
          tooltip: {
            headerFormat: "{series.name}<br/>",
            pointFormatter: function () {
              return `${this.name}：${this.options.y}(${(this.options.y / this.total * 100).toFixed(2)}%)`
            }
          },
          series: [{
            type: 'pie',
            showInLegend: true,
            colors: ["#2b908f", "#91e8e1"],
            dataLabels: {
              enabled: true,
              distance: -20,
              style: {
                color: '#fff',
                fontWeight: "normal"
              }
            },
            size: '50%',
            innerSize: '40%',
            name: '情感分析',
            colorByPoint: true,
            data: twoSent
          }, {
            type: 'pie',
            showInLegend: true,
            cursor: 'pointer',
            size: '100%',
            innerSize: '70%',
            name: '情绪分析',
            colorByPoint: true,
            data: sevenSent
          }]
        });
      },
      refresh() {
        api.getRandomCommentAndSentiment().then(res => {
          this.movieName = res.data.mName;
          this.content = res.data.content.split("a\ta").join('\n');
          let sentimentResult = res.data.sentimentResult;
          this.twoSent = [{
            name: '积极',
            y: sentimentResult.positive.length
          }, {
            name: '消极',
            y: sentimentResult.negative.length
          }];
          this.sevenSent = [{
            name: '乐',
            y: sentimentResult.moods.happy
          }, {
            name: '好',
            y: sentimentResult.moods.good
          }, {
            name: '怒',
            y: sentimentResult.moods.anger
          }, {
            name: '哀',
            y: sentimentResult.moods.grief
          }, {
            name: '惧',
            y: sentimentResult.moods.fear
          }, {
            name: '恶',
            y: sentimentResult.moods.bad
          }, {
            name: '惊',
            y: sentimentResult.moods.surprise
          }];
          this.start(this.twoSent, this.sevenSent)
        }, err => {
          console.log(err);
        })
      }
    }
  }
</script>

<style scoped>
.wrapper{
  font-size: 14px;
  height: 100%;
}
.wrapper .title{
  text-align: center;
  font-size: 18px;
  font-weight: bolder;
  margin-top: 10px;
}
.comment{
  margin: 10px 20px;
  width: 400px;
  height: 450px;
  resize: none;
  padding: 5px;
  outline: none;
}
.wrapper .btns{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.wrapper .btns button{
  width: 120px;
  margin: 20px auto;
}
</style>