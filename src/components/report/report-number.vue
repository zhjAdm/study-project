<template>
    <div>
        <el-card style="margin-left: 0px;height:800px;background-color: rgba(99%,99%,99%,0.6);">

            <el-table
                    :data="sums"
                    border
                    :cell-style="tableRowClassName"
                    :header-cell-style="tableHeaderStyle"
                    style="float:left;width:430px;">
                <el-table-column
                        prop="semester"
                        label="学期"
                        width="260">
                </el-table-column>
                <el-table-column
                        prop="year"
                        label="年份"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="sum"
                        label="项目数量"
                        width="100">
                </el-table-column>
            </el-table>
            <div ref="main" style="margin-left:30px;float:left;width:600px;height: 400px;">

            </div>
        </el-card>


    </div>
</template>

<script>
    export default {
        name: "report-number",
        data(){
            return{
                sums:[]
            }
        },
        methods:{
            init(){
                this.getSum();
            },
            tableHeaderStyle(){
                return 'background:#0182ce;color:#f0f0f0;'
            },
            tableRowClassName({row, column, rowIndex, columnIndex}){
                var style = "background:#0182ce;color:#f0f0f0;";
                if(rowIndex%2==0){
                    style+= "background-color:rgba(14%,64%,96%,0.6);";
                }else{

                }
                return style;
            },
            getSum(){
                this.$axios.post("/project/countProjectSum",{

                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.sums=res.data
                    this.initCharts();
                })
            },
            initCharts(){
                let myChart = this.$echarts.init(this.$refs.main)
                var timeArr = [];
                var sumArr = [];
                for (let i = 0; i < this.sums.length; i++) {
                    timeArr.push(this.sums[i].semester)
                    sumArr.push(this.sums[i].sum)
                }
                let option = {
                    title: { text: '学期项目数量情况' },
                    tooltip: {},
                    xAxis: {
                        data: timeArr
                    },
                    yAxis: {},
                    series: [{
                        name: '数量',
                        type: 'line',
                        data: sumArr
                    }]
                }
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        }
    }
</script>

<style scoped>
    .el-table .single{
        background: #0182ce;
        background-color: rgba(14%,64%,96%,0.3);
    }
    .el-table .double{
        background: #0182ce;
    }
</style>