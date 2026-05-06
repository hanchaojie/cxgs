<template>
	<view class="absolute">
		<view class="parameter">
			<view class="mr32" @click="checkNumBtns(1)" :class="checkOne==1?'parameter_block ':'parameter_unblock '">
				<view class="" v-if="dayData.phOut.length&&dayData.phOut "
					:style="{'color': dayData.phOut[0].isAbnormal == '1' ? 'red':''}">
					{{ dayData.phOut && dayData.phOut.length ? dayData.phOut[0].value : '--' }}<text
						style="font-size: 24rpx;"></text>
				</view>
				<view class="" v-else>
					--
				</view>
				<view class="itemName">
					出厂PH
				</view>
			</view>
			<view class="mr32" @click="checkNumBtns(2)" :class="checkOne==2?'parameter_block ':'parameter_unblock '">
				<view class="" v-if="dayData.turbOut.length&&dayData.turbOut "
					:style="{'color': dayData.turbOut[0].isAbnormal == '1' ? 'red':''}">
					{{ dayData.turbOut && dayData.turbOut.length ? dayData.turbOut[0].value : '--' }}<text
						style="font-size: 24rpx;">NTU</text>
				</view>
				<view class="" v-else>
					--NTU
				</view>
				<view class="itemName">
					出厂浊度
				</view>
			</view>
			<view class="mr32" @click="checkNumBtns(3)" :class="checkOne==3?'parameter_block ':'parameter_unblock '">
				<view class="" v-if=" dayData.cl.length&&dayData.cl"
					:style="{'color': dayData.cl[0].isAbnormal == '1' ? 'red':''}">
					{{ dayData.cl && dayData.cl.length ? dayData.cl[0].value : '--' }}
					<text style="font-size: 24rpx;">mg/L</text>
				</view>
				<view class="" v-else>
					--mg/L
				</view>
				<view class="itemName">
					出厂余氯
				</view>
			</view>
			<view class="mr32" @click="checkNumBtns(4)" :class="checkOne==4?'parameter_block ':'parameter_unblock '">
				<view class="" v-if="dayData.qout.length&&dayData.qout"
					:style="{'color': dayData.qout[0].isAbnormal == '1' ? 'red':''}">
					{{ dayData.qout && dayData.qout.length ? dayData.qout[0].value : '--' }}
					<text style="font-size: 24rpx;">m³/h</text>
				</view>
				<view class="" v-else>
					--m³/h
				</view>
				<view class="itemName">
					出厂流量
				</view>
			</view>
			<view class="mr32" @click="checkNumBtns(5)" :class="checkOne==5?'parameter_block ':'parameter_unblock '">
				<view class="" v-if="dayData.waterLevel.length&&dayData.waterLevel"
					:style="{'color': dayData.waterLevel[0].isAbnormal == '1' ? 'red':''}">
					{{ dayData.waterLevel && dayData.waterLevel.length ? dayData.waterLevel[0].value : '--' }}<text
						style="font-size: 24rpx;">m</text>
				</view>
				<view class="" v-else>
					--m
				</view>
				<view class="itemName">
					清水池液位
				</view>
			</view>
		</view>
		<view class="select_Time">
			<view class="topBox">
				<view class="flex1" :class="checkNum == 1 ? 'topBoxFlexL':''" @click="checkNumBtn(1)">
					<view :class="checkNum == 1 ? 'colorTxt':'uncolorTxt'">
						近12h
					</view>
				</view>
				<view class="flex1" :class="checkNum == 2 ? 'topBoxFlexC':''" @click="checkNumBtn(2)">
					<view :class="checkNum == 2 ? 'colorTxt':'uncolorTxt'">
						近24h
					</view>
				</view>
				<view class="flex1" :class="checkNum == 3 ? 'topBoxFlexR':''" @click="checkNumBtn(3)">
					<view :class="checkNum == 3 ? 'colorTxt':'uncolorTxt'">
						近72h
					</view>
				</view>
				<view class="flex1" :class="checkNum == 4 ? 'topBoxFlexLast':''" @click="checkNumBtn(4)">
					<view :class="checkNum == 4 ? 'colorTxt':'uncolorTxt'">
						自定义
					</view>
				</view>
			</view>
			<view class="Lechart">
				<view class="bigTime" @click="openTimePopup" v-if="checkNum==4">
					<view class="timeBox">
						{{Filter(stm)}}
						<image src="/static/Vector.png" mode="" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
						</image>
					</view>
					<text style="margin-left: 10rpx;margin-right: 10rpx;">至</text>
					<view class="timeBox">
						{{Filter(etm)}}
						<image src="/static/Vector.png" mode="" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
						</image>
					</view>
				</view>
				<l-echart ref="firstCharts" @finished="rianinit()" v-if="showEcharts"></l-echart>
				<view class="fixboxEX" v-else>
					<image src="/static/nodeta.png" mode=""></image>
					<view class="tac">
						暂无数据
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="timePopup" type="bottom" border-radius="10px 10px 0 0">
			<view class="autoHeight">
				<view class="topTxt">
					自定义
				</view>
				<uni-icons class="uicons" type="closeempty" size="24" @click="closetimePopup"></uni-icons>
				<view class="bigTime" @click="openTimePopup">
					<view :class="checkTime == 0?'timeBox':'untimeBox'" @click="checkTimeBtn(0)">
						{{stm}}
					</view>
					<text style="margin-left: 10rpx;margin-right: 10rpx;">-</text>
					<view :class="checkTime == 1?'timeBox':'untimeBox'" @click="checkTimeBtn(1)">
						{{etm}}
					</view>
				</view>
				<view class="heibox">
					<picker-view :value="value" @change="bindChange" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item,index) in syears" :key="index">{{item}}年</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
							</picker- view-column>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in hours" :key="index">{{item}}时</view>
						</picker-view-column>
					</picker-view>
					<button type="primary" class="confimBtn" @click="confimBtn">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as echarts from '@/uni_modules/lime-echart/static/echarts.min'
	import {
		getNowDate,
		getHoursTime,
		getMonitorSummary,
		echartsWq,
		getInOutFlowByCode,
		getwawoWaterH,

	} from '@/units/request.js'
	import noDeta from '@/components/nodeta.vue'
	export default {
		props: ['checkData'],
		components: {

			noDeta
		},
		data() {
			const date = new Date()
			const syears = []
			const lyear = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			const hour = date.getHours()
			const hours = []
			for (let i = date.getFullYear() - 10; i <= date.getFullYear() + 10; i++) {
				syears.push(i)
			}
			console.log(syears)
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}
			for (let i = 1; i <= 24; i++) {
				hours.push(i)
			}
			return {
				checkOne: 1,
				etm: getNowDate(),
				stm: getHoursTime(168),
				checkTime: 0,
				lyear,
				syears,
				months,
				month,
				days,
				day,
				hours,
				checkNum: 1,
				value: [10, month - 1, day - 1, hour - 1],
				dayData: [],
				Xdata: [],
				Ydata: [],
				echartsData: [],
				flowData: [],
				showEcharts: false,
				list: [{
					name: "出厂PH",
					numerical: "6.56",
				}, {
					name: "出厂浊度",
					numerical: "2.7",
					unit: "NTU"
				}, {
					name: "出厂余氧",
					numerical: "2.7",
					unit: "mg/L"
				}, {
					name: "进厂PH",
					numerical: "2.7",
				}, {
					name: "进厂浊度",
					numerical: "2.7",
					unit: "NTU"
				}, {
					name: "出厂流量",
					numerical: "1.23",
					unit: "m³/h"
				}, {
					name: "进厂流量",
					numerical: "2.7",
					unit: "m³/h"
				}, {
					name: "清水池液位",
					numerical: "26.5",
					unit: "m"
				}]
			}
		},
		mounted() {
			// console.log(this.checkData)
			this.querygetMonitorSummary(this.checkData.wawoCode)
			// this.querygetInOutFlowByCode(12, this.checkData.wawoCode)
			this.getechartsWq(12, this.checkData.wawoCode)
			// this.getgetwawoWaterH(12, this.checkData.wawoCode)
		},
		onLoad() {

			// this.querygetMonitorSummary(item.wawoCode)
			// this.getechartsWq(12, item.wawoCode)
			// this.querygetInOutFlowByCode(12, item.wawoCode)
		},
		methods: {
			querygetMonitorSummary(wawoCode) {
				getMonitorSummary(`?wawoCode=${wawoCode}`).then(res => {
					console.log(res)
					this.dayData = res.data.rows[0] || {
						cl: [],
						clIn: [],
						phIn: [],
						phOut: [],
						qin: [],
						qout: [],
						tm: null,
						turbIn: [],
						turbOut: [],
						waterLevel: [],

					}
				})
			},
			querygetInOutFlowByCode(e, wawoCode) { //流量
				this.showEcharts = false
				getInOutFlowByCode(`?type=1&wawoCode=${wawoCode}&stm=${getHoursTime(e)}&etm=${getNowDate()}`).then(res => {
					if (res.data.rows.length > 0) {
						this.echartsData = res.data.rows
						this.Xdata = res.data.rows.map(e => {
							return e.tm.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.currOutTakeFlow ? e.currOutTakeFlow : '0'
						})
						this.showEcharts = true
					} else {

					}
				})
			},
			getechartsWq(e, wawoCode) { //ph
				this.Xdata = []
				this.showEcharts = false
				this.Ydata = []
				echartsWq(`?wawoCode=${wawoCode}&stm=${getHoursTime(e)}&etm=${getNowDate()}`).then(res => {
					console.log(res, 'echarts数据')
					if (res.data.rows.length > 0) {
						this.echartsData = res.data.rows
						this.Xdata = res.data.rows.map(e => {
							return e.spt.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.ph ? e.ph : '0'
						})
						this.showEcharts = true
					} else {

					}
				})
			},
			getechartsCl(e, wawoCode) { //余氯
				this.Xdata = []
				this.showEcharts = false
				this.Ydata = []
				echartsWq(`?wawoCode=${wawoCode}&stm=${getHoursTime(e)}&etm=${getNowDate()}`).then(res => {
					console.log(res, 'echarts数据')
					if (res.data.rows.length > 0) {
						this.echartsData = res.data.rows
						this.Xdata = res.data.rows.map(e => {
							return e.spt.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.cl ? e.cl : '0'
						})
						this.showEcharts = true
					} else {

					}
				})
			},
			zdygetechartsCl(s, e, wawoCode) { //自定义余氯
				this.Xdata = []
				this.showEcharts = false
				this.Ydata = []
				echartsWq(`?wawoCode=${wawoCode}&stm=${s}&etm=${e}`).then(res => {
					console.log(res, 'echarts数据')
					if (res.data.rows.length > 0) {
						this.echartsData = res.data.rows
						this.Xdata = res.data.rows.map(e => {
							return e.spt.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.cl ? e.cl : '0'
						})
						this.showEcharts = true
					} else {

					}
				})
			},
			zdygetechartsWq(s, e, wawoCode) { //自定义ph
				this.Xdata = []
				this.showEcharts = false
				this.Ydata = []
				echartsWq(`?wawoCode=${wawoCode}&stm=${s}&etm=${e}`).then(res => {
					console.log(res, 'echarts数据')
					if (res.data.rows.length > 0) {
						this.echartsData = res.data.rows
						this.Xdata = res.data.rows.map(e => {
							return e.spt.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.ph ? e.ph : '0'
						})
						this.showEcharts = true
					} else {

					}
				})
			},
			getechartsCd(e, wawoCode) { //浊度
				this.Xdata = []
				this.showEcharts = false
				this.Ydata = []
				echartsWq(`?wawoCode=${wawoCode}&stm=${getHoursTime(e)}&etm=${getNowDate()}`).then(res => {
					console.log(res, 'echarts数据')
					if (res.data.rows.length > 0) {
						this.echartsData = res.data.rows
						this.Xdata = res.data.rows.map(e => {
							return e.spt.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.turb ? e.turb : '0'
						})
						this.showEcharts = true
					} else {

					}
				})
			},
			zdygetechartsCd(s, e, wawoCode) { //自定义浊度
				this.Xdata = []
				this.showEcharts = false
				this.Ydata = []
				echartsWq(`?wawoCode=${wawoCode}&stm=${s}&etm=${e}`).then(res => {
					console.log(res, 'echarts数据')
					if (res.data.rows.length > 0) {
						this.echartsData = res.data.rows
						this.Xdata = res.data.rows.map(e => {
							return e.spt.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.turb ? e.turb : '0'
						})
						this.showEcharts = true
					} else {

					}
				})
			},
			zdyquerygetInOutFlowByCode(s, e, wawoCode) { //自定义流量
				this.showEcharts = false
				getInOutFlowByCode(`?type=1&wawoCode=${wawoCode}&stm=${s}&etm=${e}`).then(res => {
					if (res.data.rows.length > 0) {
						this.echartsData = res.data.rows
						this.Xdata = res.data.rows.map(e => {
							return e.tm.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.currOutTakeFlow ? e.currOutTakeFlow : '0'
						})
						this.showEcharts = true
					} else {

					}
				})
			},
			getgetwawoWaterH(e, wawoCode) { //清水池液位

				this.Xdata = []
				this.showEcharts = false
				this.Ydata = []
				getwawoWaterH(`?wawoCode=${wawoCode}&stm=${getHoursTime(e)}&etm=${getNowDate()}`).then(res => {
					console.log(res, 'echarts数据')
					if (res.data.rows.length > 0) {
						this.echartsData = res.data.rows
						this.Xdata = res.data.rows.map(e => {
							return e.tm.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.waterLevel ? e.waterLevel : '0'
						})
						this.showEcharts = true
					} else {

					}
				})
			},
			zdygetgetwawoWaterH(s, e, wawoCode) { //自定义清水池
				this.Xdata = []
				this.showEcharts = false
				this.Ydata = []
				getwawoWaterH(`?wawoCode=${wawoCode}&stm=${s}&etm=${e}`).then(res => {
					console.log(res, 'echarts数据')
					if (res.data.rows.length > 0) {
						this.echartsData = res.data.rows
						this.Xdata = res.data.rows.map(e => {
							return e.tm.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.waterLevel ? e.waterLevel : '0'
						})
						this.showEcharts = true
					} else {

					}
				})
			},
			Filter(e) {
				return e.slice(0, 13) + "时";
			},
			checkNumBtns(e) { //切换出厂ph一栏  e代表顺序
				console.log(e)
				this.checkOne = e
				this.showEcharts = false
				this.checkNum = 1 //切换第一栏  重置第二栏默认为1
				if (e == 1) {

					this.getechartsWq(12, this.checkData.wawoCode)
				} else if (e == 2) {
					this.getechartsCd(12, this.checkData.wawoCode)

				} else if (e == 3) {
					this.getechartsCl(12, this.checkData.wawoCode)
				} else if (e == 4) {
					this.querygetInOutFlowByCode(12, this.checkData.wawoCode)
				} else if (e == 5) {
					this.getgetwawoWaterH(12, this.checkData.wawoCode)
				} else {

				}
			},
			checkNumBtn(e) {
				this.checkNum = e
				if (e == 1) {
					if (this.checkOne == 1) {
						this.getechartsWq(12, this.checkData.wawoCode)
					} else if (this.checkOne == 2) {
						this.getechartsCd(12, this.checkData.wawoCode)
					} else if (this.checkOne == 3) {
						this.getechartsCl(12, this.checkData.wawoCode)
					} else if (this.checkOne == 4) {
						this.querygetInOutFlowByCode(12, this.checkData.wawoCode)
					} else if (this.checkOne == 5) {
						this.getgetwawoWaterH(12, this.checkData.wawoCode)
					}
				} else if (e == 2) {
					if (this.checkOne == 1) {
						this.getechartsWq(24, this.checkData.wawoCode)
					} else if (this.checkOne == 2) {
						this.getechartsCd(24, this.checkData.wawoCode)
					} else if (this.checkOne == 3) {
						this.getechartsCl(24, this.checkData.wawoCode)
					} else if (this.checkOne == 4) {
						this.querygetInOutFlowByCode(24, this.checkData.wawoCode)
					} else if (this.checkOne == 5) {
						this.getgetwawoWaterH(24, this.checkData.wawoCode)
					}
				} else if (e == 3) {
					if (this.checkOne == 1) {
						this.getechartsWq(72, this.checkData.wawoCode)
					} else if (this.checkOne == 2) {
						this.getechartsCd(72, this.checkData.wawoCode)
					} else if (this.checkOne == 3) {
						this.getechartsCl(72, this.checkData.wawoCode)
					} else if (this.checkOne == 4) {
						this.querygetInOutFlowByCode(72, this.checkData.wawoCode)
					} else if (this.checkOne == 5) {
						this.getgetwawoWaterH(72, this.checkData.wawoCode)
					}
				} else {

				}

			},
			closetimePopup() {
				this.$refs.timePopup.close()
				// this.timePopup = false
			},
			openTimePopup() {
				this.$refs.timePopup.open('bottom')
			},
			bindChange(e) {
				const dates = new Date()
				const lyear = dates.getFullYear()
				const lmon = dates.getMonth() + 1
				const lday = dates.getDate()
				const lhous = dates.getHours()
				if (this.checkTime == 0) {
					console.log(e)
					this.stm = `${
						lyear - 10 + e.detail.value[0]
					}` + '-' + (`${e.detail.value[1]+1}` < 10 ? `0${e.detail.value[1]+1}` :
						`${e.detail.value[1]+1}`) + '-' + (`${e.detail.value[2]+1}` < 10 ? `0${e.detail.value[2]+1}` :
						`${e.detail.value[2]+1}`) + ' ' + `${e.detail.value[3]+1}` + ":00" + ":00"
					console.log(this.stm)
				} else {
					this.etm = `${
						lyear - 10 + e.detail.value[0]
					}` + '-' + (`${e.detail.value[1]+1}` < 10 ? `0${e.detail.value[1]+1}` :
						`${e.detail.value[1]+1}`) + '-' + (`${e.detail.value[2]+1}` < 10 ? `0${e.detail.value[2]+1}` :
						`${e.detail.value[2]+1}`) + ' ' + `${e.detail.value[3]+1}` + ":00" + ":00"
					console.log(this.stm)
				}
			},

			confimBtn() {
				if (this.checkOne == 5) {

					this.zdygetgetwawoWaterH(this.stm, this.etm, this.checkData.wawoCode)
				} else if (this.checkOne == 1) {

					this.zdygetechartsWq(this.stm, this.etm, this.checkData.wawoCode)
				} else if (this.checkOne == 3) {
					this.zdygetechartsCl(this.stm, this.etm, this.checkData.wawoCode)
				} else if (this.checkOne == 2) {
					this.zdygetechartsCd(this.stm, this.etm, this.checkData.wawoCode)
				} else if (this.checkOne == 4) {
					this.zdyquerygetInOutFlowByCode(this.stm, this.etm, this.checkData.wawoCode)
				}


				this.$refs.timePopup.close()
			},
			checkTimeBtn(e) {
				this.checkTime = e
			},
			checkType(e) {
				switch (e) {
					case 1:
						return 'PH'
						break;
					case 2:
						return 'NTU'
						break;
					case 3:
						return 'mg/L'
						break;
					case 4:
						return 'm³/h'
						break;
					case 5:
						return 'm'
						break;
					default:
						break;
				}
			},
			elsequerygetInOutFlowByCode(s, e, wawoCode) {
				this.showEcharts = false
				getInOutFlowByCode(`?type=1&wawoCode=${wawoCode}&stm=${s}&etm=${e}`).then(res => {
					console.log(res, 'ssssss')
					this.flowData = res.data.rows
					if (this.checkOne == 6) {
						this.Xdata = res.data.rows.map(e => {
							return e.tm.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.currOutTakeFlow ? e.currOutTakeFlow : '0'
						})
					} else {
						this.Xdata = res.data.rows.map(e => {
							return e.tm.slice(5, 16)
						})
						this.Ydata = res.data.rows.map(e => {
							return e.currInTakeFlow ? e.currInTakeFlow : '0'
						})
					}

					this.showEcharts = true
				})
			},
			async rianinit() {
				// chart 图表实例不能存在data里
				const chart = await this.$refs.firstCharts.init(echarts);
				const type = this.checkType(this.checkOne)
				let option = {
					// title: {
					// 	text: '出厂pH变化'
					// },

					legend: {
						orient: 'horizontal',
						textStyle: {
							color: "#000"
						}
					},
					tooltip: {
						trigger: 'axis',
						formatter: function(params) {
							for (var i = 0, l = params.length; i < l; i++) {
								return params[i].name + "	     " + params[i].value + `${type}`
							}
						}
					},
					xAxis: {
						type: 'category',
						data: this.Xdata
					},
					yAxis: {
						type: 'value',
						name: this.checkType(this.checkOne),
					},
					series: [{
						data: this.Ydata,
						type: 'line',
						name: '',
						symbol: "none",
						itemStyle: {
							color: '#4895ef' // 线条颜色，可根据原图调整
						}
					}]
				};
				chart.setOption(option);
				// this.$nextTick(() => {
				// 	chart.setOption(option);
				// })
				// this.$refs.chartRef.resize({700, 610})
				// myChart.setOption(option);
			},
		}

	}
</script>
<style>
	page {
		background-color: rgb(242, 245, 255);
		height: 100%;
	}
</style>

<style lang="scss" scoped>
	/* pakA/pages/rounds/index.wxss */
	.fixboxEX {
		// position: fixed;
		left: 0;
		width: 100%;
		height: 300rpx;

		image {
			width: 652rpx;
			height: 360rpx;
			// margin-right: 48rpx;
		}

		.tac {
			text-align: center;
			color: #666;
			font-size: 36rpx;
		}
	}

	.absolute {
		padding-top: 30rpx;

		.parameter {
			width: 640rpx;
			height: 432rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-left: 32rpx;
			padding: 20rpx 22rpx 28rpx 24rpx;
			display: flex;
			flex-wrap: wrap;

			.parameter_block {
				width: 189rpx;
				height: 110rpx;
				background: rgba(3, 102, 241, 1);
				border: 2rpx solid rgba(3, 102, 241, 1);
				border-radius: 20rpx;
				text-align: center;
				padding-top: 18rpx;
				color: #fff;

				.itemName {
					font-size: 24rpx;
					margin-top: 20rpx;
				}
			}

			.parameter_unblock {
				width: 189rpx;
				height: 110rpx;
				background: #fff;
				border: 2rpx solid rgba(3, 102, 241, 1);
				border-radius: 20rpx;
				text-align: center;
				padding-top: 18rpx;

				.itemName {
					font-size: 24rpx;
					margin-top: 20rpx;
				}
			}


			.mr32 {
				margin-right: 32rpx;

				&:nth-child(3n) {
					// 去除第3n个的margin-right
					margin-right: 0rpx;
				}
			}
		}

		.select_Time {
			width: 686rpx;
			// height: 800rpx;
			margin-left: 32rpx;
			margin-top: 24rpx;
			background: #fff;
			border-radius: 16rpx;

			.topBox {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 16rpx 16rpx 0 0;
				background-color: rgba(233, 242, 255, 1);
				display: flex;

				.flex1 {
					flex: 1;
					text-align: center;

					.colorTxt {
						color: rgba(3, 102, 241, 1);
						font-family: "Microsoft YaHei";
						font-size: 32rpx;

					}

					.uncolorTxt {
						color: rgba(86, 86, 86, 1);
						font-family: "Microsoft YaHei";
						font-size: 32rpx;
					}
				}

				.topBoxFlexL {
					background: #fff;
					position: relative;
					border-radius: 16rpx 16rpx 0 0;
				}

				.topBoxFlexC {
					background: #fff;
					position: relative;
					border-radius: 16rpx 16rpx 0 0;
				}

				.topBoxFlexLast {
					background: #fff;
					position: relative;
					border-radius: 16rpx 16rpx 0 0;
				}

				.topBoxFlexR {
					background: #fff;
					position: relative;
					border-radius: 16rpx 16rpx 0 0;
				}

				.topBoxFlexL::after {
					position: absolute;
					content: '';
					width: 40rpx;
					height: 40rpx;
					// line-height: 100px;
					// display: block;
					// text-align: center;
					background-image: radial-gradient(40rpx at 30rpx -0rpx, #e9f2ff 42rpx, #fff 30rpx);
					top: 41rpx;
					right: -40rpx;
				}

				.topBoxFlexC::before {
					position: absolute;
					content: '';
					width: 40rpx;
					height: 40rpx;
					// line-height: 100px;
					// display: block;
					// text-align: center;
					background-image: radial-gradient(40rpx at 0rpx 6rpx, #e9f2ff 42rpx, #fff 30rpx);
					top: 41rpx;
					left: -40rpx;
				}

				.topBoxFlexC::after {
					position: absolute;
					content: '';
					width: 40rpx;
					height: 40rpx;
					// line-height: 100px;
					// display: block;
					// text-align: center;
					background-image: radial-gradient(40rpx at 36rpx -0rpx, #e9f2ff 42rpx, #fff 30rpx);
					top: 41rpx;
					right: -40rpx;
				}

				.topBoxFlexR::before {
					position: absolute;
					content: '';
					width: 40rpx;
					height: 40rpx;
					// line-height: 100px;
					// display: block;
					// text-align: center;
					background-image: radial-gradient(40rpx at 0rpx 6rpx, #e9f2ff 42rpx, #fff 30rpx);
					top: 41rpx;
					left: -40rpx;
				}

				.topBoxFlexR::after {
					position: absolute;
					content: '';
					width: 40rpx;
					height: 40rpx;
					// line-height: 100px;
					// display: block;
					// text-align: center;
					background-image: radial-gradient(40rpx at 36rpx -0rpx, #e9f2ff 42rpx, #fff 30rpx);
					top: 41rpx;
					right: -40rpx;
				}

				.topBoxFlexLast::before {
					position: absolute;
					content: '';
					width: 40rpx;
					height: 40rpx;
					// line-height: 100px;
					// display: block;
					// text-align: center;
					background-image: radial-gradient(40rpx at 0rpx 6rpx, #e9f2ff 42rpx, #fff 30rpx);
					top: 41rpx;
					left: -40rpx;

				}
			}

			.Lechart {
				width: 100%;
				height: 600rpx;
				margin-top: 30rpx;

				.bigTime {
					display: flex;
					margin-left: 24rpx;
					align-items: center;
					margin-bottom: 20rpx;

					.timeBox {
						font-size: 28rpx;
						line-height: 60rpx;
						text-align: center;
						width: 288rpx;
						height: 60rpx;
						border: 2rpx solid rgba(241, 241, 241, 1);
						border-radius: 12rpx;
					}
				}

			}
		}

		.autoHeight {
			width: 100%;
			height: auto;
			background-color: #fff;
			padding-top: 34rpx;
			position: relative;
			color: rgba(51, 51, 51, 1);
			font-family: "Microsoft YaHei";
			font-size: 32rpx;
			font-weight: 600;
			line-height: 48rpx;
			letter-spacing: 0px;

			.bigTime {
				display: flex;
				margin-left: 24rpx;
				align-items: center;
				// margin-bottom: 20rpx;	
				margin-left: 32rpx;
				margin-top: 20rpx;

				.timeBox {
					font-size: 28rpx;
					line-height: 60rpx;
					text-align: center;
					width: 320rpx;
					height: 64rpx;
					border: 2rpx solid rgba(241, 241, 241, 1);
					border-radius: 40rpx;
					background: #F1F1F1;
					color: #333;
				}

				.untimeBox {
					font-size: 28rpx;
					line-height: 60rpx;
					text-align: center;
					width: 320rpx;
					height: 64rpx;
					border: 2rpx solid rgba(241, 241, 241, 1);
					border-radius: 40rpx;
					background: #F1F1F1;
					color: #9999;
				}
			}

			.topTxt {
				.timeBox {
					font-size: 28rpx;
					line-height: 60rpx;
					text-align: center;
					width: 288rpx;
					height: 60rpx;
					border: 2rpx solid rgba(241, 241, 241, 1);
					border-radius: 12rpx;
				}

				text-align: center;
				font-weight: 400;
			}

			.uicons {
				position: absolute;
				right: 46rpx;
				top: 40rpx;
			}

			.heibox {
				height: auto;
				padding: 0 46rpx 48rpx;
				display: flex;
				flex-wrap: wrap;

				.smallBox {
					width: 202rpx;
					height: 64rpx;
					border: 2rpx solid rgba(3, 102, 241, 0.15);
					border-radius: 40rpx;
					line-height: 64rpx;
					text-align: center;
					color: rgba(51, 51, 51, 1);
					font-size: 28rpx;
					font-weight: 400;
					margin-right: 20rpx;
					margin-bottom: 30rpx;

					&:nth-child(3n) {
						// 去除第3n个的margin-right
						margin-right: 0rpx;
					}

				}

				.picker-view {
					width: 750rpx;
					height: 400rpx;
					margin-top: 20rpx;
				}

				.item {
					line-height: 60rpx;
					text-align: center;
				}
			}

			.confimBtn {
				border-radius: 44rpx;
				width: 686rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: linear-gradient(112.20deg, rgba(112.28693389892578, 191.46656799316406, 247.03125, 1), rgba(38.70535659790039, 116.93612670898438, 212.87945556640625, 1) 100%);
			}
		}
	}
</style>