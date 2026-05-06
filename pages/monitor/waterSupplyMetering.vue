<template>
	<view class="">
		<view class="firstBox">
			<view class="firstImg">
				<image src="/static/waterLogo.png" mode="" class="waterLogo"></image>
				<view class="timeTxt">
					{{waterInfo.tm?waterInfo.tm:'暂无时间'}}
				</view>
			</view>
			<view class="imgBox">
				<view class="imgContent">
					<image src="/static/blue.png" mode="" class="alittleImg"></image>
					<view class="rightContent">
						<view class="colorDot">
							{{waterInfo.supply6Hour?waterInfo.supply6Hour:"--"}} <text
								style="font-size: 28rpx;">吨</text>
						</view>
						<view class="describe">
							近6H供水量
						</view>
					</view>
				</view>
				<view class="imgContent" style="background-color: #F4FFFD;">
					<image src="/static/green.png" mode="" class="alittleImg"></image>
					<view class="rightContent">
						<view class="colorDot">
							{{waterInfo.supplyDay?waterInfo.supplyDay:"--"}}<text style="font-size: 28rpx;">吨</text>
						</view>
						<view class="describe">
							当日供水量
						</view>
					</view>
				</view>
				<view class="imgContent">
					<image src="/static/purple.png" mode="" class="alittleImg"></image>
					<view class="rightContent">
						<view class="colorDot">
							{{waterInfo.supplyMonth?waterInfo.supplyMonth:"--"}}<text
								style="font-size: 28rpx;">万吨</text>
						</view>
						<view class="describe">
							当月供水量
						</view>
					</view>
				</view>
				<view class="imgContent"  style="background-color: #F4FAFF;">
					<image src="/static/blackish green.png" mode="" class="alittleImg"></image>
					<view class="rightContent">
						<view class="colorDot">
							{{waterInfo.supplyYear?waterInfo.supplyYear:"--"}} <text style="font-size: 28rpx;">万吨</text>
						</view>
						<view class="describe">
							当年供水量
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="select_Time">
			<view class="topBox">
				<view class="flex1" :class="checkNum == 1 ? 'topBoxFlexL':''" @click="checkNumBtn(1)">
					<view :class="checkNum == 1 ? 'colorTxt':'uncolorTxt'">
						日供水
					</view>
				</view>
				<view class="flex1" :class="checkNum == 2 ? 'topBoxFlexC':''" @click="checkNumBtn(2)">
					<view :class="checkNum == 2 ? 'colorTxt':'uncolorTxt'">
						月供水
					</view>
				</view>
				<view class="flex1" :class="checkNum == 3 ? 'topBoxFlexR':''" @click="checkNumBtn(3)">
					<view :class="checkNum == 3 ? 'colorTxt':'uncolorTxt'">
						年供水
					</view>
				</view>
				<!-- 			<view class="flex1" :class="checkNum == 4 ? 'topBoxFlexLast':''" @click="checkNumBtn(4)">
					<view :class="checkNum == 4 ? 'colorTxt':'uncolorTxt'">
						自定义
					</view>
				</view> -->
			</view>
			<view class="Lechart" v-if="checkNum == 1">
				<view class="bigTime" @click="openDayTimePopup">
					<view class="timeBox">
						{{Filter(daystm)}}
						<image src="/static/Vector.png" mode="" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
						</image>
					</view>
					<text style="margin-left: 10rpx;margin-right: 10rpx;">至</text>
					<view class="timeBox">
						{{Filter(dayetm)}}
						<image src="/static/Vector.png" mode="" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
						</image>
					</view>
				</view>
				<l-echart ref="rianCharts" @finished="rianinit"></l-echart>
			</view>
			<view class="Lechart" v-else-if="checkNum == 2">
				<view class="bigTime" @click="openMonthTimePopup">
					<view class="timeBox">
						{{monthstm}}
						<image src="/static/Vector.png" mode="" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
						</image>
					</view>
					<text style="margin-left: 10rpx;margin-right: 10rpx;">至</text>
					<view class="timeBox">
						{{monthetm}}
						<image src="/static/Vector.png" mode="" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
						</image>
					</view>
				</view>
				<l-echart ref="rianCharts" @finished="rianinit"></l-echart>
			</view>
			<view class="Lechart" v-else-if="checkNum == 3">
				<view class="bigTime" @click="openTimePopup">
					<view class="timeBox">
						{{yearstm}}
						<image src="/static/Vector.png" mode="" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
						</image>
					</view>
					<text style="margin-left: 10rpx;margin-right: 10rpx;">至</text>
					<view class="timeBox">
						{{yearetm}}
						<image src="/static/Vector.png" mode="" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
						</image>
					</view>
				</view>
				<l-echart ref="rianCharts" @finished="rianinit"></l-echart>
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
						{{yearstm}}
					</view>
					<text style="margin-left: 10rpx;margin-right: 10rpx;">-</text>
					<view :class="checkTime == 1?'timeBox':'untimeBox'" @click="checkTimeBtn(1)">
						{{yearetm}}
					</view>
				</view>
				<view class="heibox">
					<time-change :showAnimation="showAnimation" format="yyyy" :start="yearstart" :end="yearend"
						:values="''" @change="yearonChange"></time-change>
					<button type="primary" class="confimBtn" @click="yearconfimBtn">确定</button>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="openDayTimePopup" type="bottom" border-radius="10px 10px 0 0">
			<view class="autoHeight">
				<view class="topTxt">
					自定义
				</view>
				<uni-icons class="uicons" type="closeempty" size="24" @click="closeDaytimePopup"></uni-icons>
				<view class="bigTime">
					<view :class="checkTime == 0?'timeBox':'untimeBox'" @click="checkTimeBtn(0)">
						{{Filter(daystm)}}
					</view>
					<text style="margin-left: 10rpx;margin-right: 10rpx;">-</text>
					<view :class="checkTime == 1?'timeBox':'untimeBox'" @click="checkTimeBtn(1)">
						{{Filter(dayetm)}}
					</view>
				</view>
				<view class="heibox">
					<time-change :showAnimation="showAnimation" :format="format" :start="start" :end="end" :values="''"
						@change="onChange"></time-change>
					<button type="primary" class="confimBtn" @click="confimBtn">确定</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="openMonthTimePopup" type="bottom" border-radius="10px 10px 0 0">
			<view class="autoHeight">
				<view class="topTxt">
					自定义
				</view>
				<uni-icons class="uicons" type="closeempty" size="24" @click="closeMonthTimePopup"></uni-icons>
				<view class="bigTime">
					<view :class="checkTime == 0?'timeBox':'untimeBox'" @click="checkTimeBtn(0)">
						{{monthstm}}
					</view>
					<text style="margin-left: 10rpx;margin-right: 10rpx;">-</text>
					<view :class="checkTime == 1?'timeBox':'untimeBox'" @click="checkTimeBtn(1)">
						{{monthetm}}
					</view>
				</view>
				<view class="heibox">
					<time-change :showAnimation="showAnimation" format="yyyy-MM" :start="monthstart" :end="monthend"
						:values="''" @change="monthonChange"></time-change>
					<button type="primary" class="confimBtn" @click="monthconfimBtn">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as echarts from '@/uni_modules/lime-echart/static/echarts.min'
	import timeChange from "@/components/timeChange.vue"
	import {
		getNowDate,
		getHoursTime,
		getNowDateDay,
		getHoursTimeDay,
		getHoursTimeMonth,
		getNowDateMonth,
		querysupplyOverview,
		querysupplyTrend
	} from '@/units/request.js'
	export default {
		props: ['checkData'],
		components: {
			timeChange
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
			for (let i = date.getFullYear() - 5; i <= date.getFullYear(); i++) {
				syears.push(i)
			}
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
				showAnimation: false,
				format: 'yyyy-MM-dd',
				checkOne: 0,
				etm: getNowDate(),
				stm: getHoursTime(168),
				dayetm: getNowDateDay(),
				daystm: getHoursTimeDay(168),
				yearstm: new Date().getFullYear() - 3,
				yearetm: new Date().getFullYear(),
				yearstart: new Date().getFullYear() - 5 + '',
				yearend: new Date().getFullYear() + '',
				start: getHoursTimeDay(360),
				end: getNowDateDay(),
				monthstart: getHoursTimeMonth(8640),
				monthend: getNowDateMonth(),
				monthstm: getHoursTimeMonth(4320),
				monthetm: getNowDateMonth(),
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
				dayvalue: [10, month - 1, day - 1],
				waterInfo: {}
			}
		},
		mounted() {
			this.getquerysupplyOverview(this.checkData.wawoCode)
			this.getquerysupplyTrend(this.checkData.wawoCode)
		},
		methods: {
			Filter(e) {
				console.log(e)
				return e.slice(0, 13) + "日";
			},
			getquerysupplyOverview(e) {
				querysupplyOverview(`?wawoCode=${e}`).then(res => {
					console.log(res)
					this.waterInfo = res.data.data
				})
			},
			getquerysupplyTrend(e) {
				querysupplyTrend(`?wawoCode=${e}&stm=${this.daystm}&etm=${this.dayetm}&type=1`).then(res => {
					let Ydata = res.data.data.map(e => {
						return e.totQ ? e.totQ : '0'
					})
					let Xdata = res.data.data.map(e => {
						return e.tm.substring(5)
					})
					this.rianinit(Ydata, Xdata, )
				})
			},
			getquerysupplyTrendMonth() {
				querysupplyTrend(`?wawoCode=${this.checkData.wawoCode}&stm=${this.monthstm}&etm=${this.monthetm}&type=2`).then(res => {
					let Ydata = res.data.data.map(e => {
						return e.totQ ? e.totQ : '0'
					})
					let Xdata = res.data.data.map(e => {
						return e.tm
					})
					this.rianinit(Ydata, Xdata, )
				})
			},
			getquerysupplyTrendYear() {
				querysupplyTrend(`?wawoCode=${this.checkData.wawoCode}&stm=${this.yearstm}&etm=${this.yearetm}&type=3`).then(res => {
					let Ydata = res.data.data.map(e => {
						return e.totQ ? e.totQ : '0'
					})
					let Xdata = res.data.data.map(e => {
						return e.tm
					})
					this.rianinit(Ydata, Xdata, )
				})
			},
			openDayTimePopup() {
				this.$refs.openDayTimePopup.open('bottom')
			},
			closeDaytimePopup() {
				this.$refs.openDayTimePopup.close()
			},
			openMonthTimePopup() {
				this.$refs.openMonthTimePopup.open('bottom')
			},
			closeMonthTimePopup() {
				this.$refs.openMonthTimePopup.open('bottom')
			},
			checkNumBtns(e) {
				this.checkOne = e
			},
			checkNumBtn(e) {
				console.log(e)
				this.checkNum = e
				if (e == 1) {
					this.getquerysupplyTrend(this.checkData.wawoCode)
				} else if (e == 2) {
					this.getquerysupplyTrendMonth()
				} else if (e == 3) {
					this.getquerysupplyTrendYear()
				}
			},
			closetimePopup() {
				this.$refs.timePopup.close()
				// this.timePopup = false
			},
			openTimePopup() {
				this.$refs.timePopup.open('bottom')
			},
			monthconfimBtn() {
				this.$refs.openMonthTimePopup.close()
				this.getquerysupplyTrendMonth()
			},
			onChange(value) {
				console.log(value);
				if (this.checkTime == 0) {
					this.daystm = value
				} else {
					this.dayetm = value
				}
			},
			monthonChange(v) {
				if (this.checkTime == 0) {
					this.monthstm = v
				} else {
					this.monthetm = v
				}
			},
			yearconfimBtn() {
				this.$refs.timePopup.close()
				this.getquerysupplyTrendYear()
			},
			bindChange(e) {
				const dates = new Date()

				const lyear = dates.getFullYear()
				const lmon = dates.getMonth() + 1
				const lday = dates.getDate()
				const lhous = dates.getHours()
				if (this.checkTime == 0) {
					console.log(e)
					this.yearstm = this.syears[e.detail.value[0]]
				} else {
					console.log('1111')
					this.yearetm = this.syears[e.detail.value[0]]
				}
			},
			yearonChange(e) {
				console.log(e)
				if (this.checkTime == 0) {
					this.yearstm = parseInt(e)
				} else {
					this.yearetm = parseInt(e)
				}
			},
			confimBtn() {
				this.$refs.openDayTimePopup.close()
				this.getquerysupplyTrend()
			},
			checkTimeBtn(e) {
				this.checkTime = e
			},
			async rianinit(Y, X) {
				// chart 图表实例不能存在data里
				const chart = await this.$refs.rianCharts.init(echarts);
				// let option = {
				// 	// title: {
				// 	// 	text: '出厂pH变化'
				// 	// },

				// 	legend: {
				// 		orient: 'horizontal',
				// 		textStyle: {
				// 			color: "#000"
				// 		}
				// 	},
				// 	tooltip: {
				// 		trigger: 'axis'
				// 	},
				// 	xAxis: {
				// 		type: 'category',
				// 		data: X
				// 	},
				// 	yAxis: {
				// 		type: 'value'
				// 	},
				// 	series: [{
				// 		data: Y,
				// 		type: 'line',
				// 		name: '万吨',
				// 		symbol: "none",
				// 		itemStyle: {
				// 			color: '#4895ef' // 线条颜色，可根据原图调整
				// 		}
				// 	}]
				// };

				let option = {
					grid: {
						left: '15%', // 左侧内边距 
						top: '10%'
					},
					title: {
						// text: '用户登入统计',
					},
					legend: {
						orient: 'horizontal',
						textStyle: {
							color: "#000"
						}
					},
					// 提示框
					tooltip: {
						trigger: 'axis',
						// axisPointer: {
						//   type: 'none',
						//   crossStyle: {
						//     color: '#999'
						//   }
						// }
					},
					// // 头部标注
					// legend: {
					//   data: ['全部', '我']
					// },
					xAxis: [{
						type: 'category',
						// prettier-ignore
						data: X,
						axisTick: {
							//y轴刻度线
							show: false,
						},
						axisLabel: {
							// interval: 0,
							// formatter: function (value) {
							//   let text,
							//     length = 4; // 文字显示长度
							//   if (value.length > length) {
							//     text = value.slice(0, length) + '…'
							//   } else {
							//     text = value
							//   }
							//   return '{a|' + `${text.split("").join("\n")}` + '}' //垂直显示
							// },
							// rich: {
							//   a: {
							//     height: 15,  //设置行高
							//     fontWeight: 900,
							//   }
							// }
						}
					}],
					yAxis: {
						type: 'value',
						name: this.checkNum == 1 ? '吨' : '万吨',
						max: this.checkNum == 1 ? parseInt(Math.max.apply(null, Y) + 10):Math.max.apply(null, Y) + 0.1,
						"axisLine": {
							"show": false //隐藏x轴线
						},
						"splitLine": {
							"show": false
						},
						"axisTick": {
							"show": false //隐藏x轴刻度
						}
					},
					series: [{
						type: 'bar',
						// name: '万吨',
						data: Y,
						itemStyle: {
							// 柱条的颜色（color）；
							color: 'rgba(3, 102, 241, 0.5)',
							// 柱条的描边颜色（borderColor）、宽度（borderWidth）、样式（borderType）；
							borderType: 'solid',
							// 阴影（shadowBlur、shadowColor、shadowOffsetX、shadowOffsetY）。
							// shadowBlur: 10,
						},
						emphasis: {
							itemStyle: {
								color: 'rgba(3, 102, 241, 1)', //hover时改变柱子颜色
								// shadowColor: 'rgba(102,102,102,0.50)',
								// shadowOffsetX: 0,
								// shadowOffsetY: 2,
								// shadowBlur: 6,
								borderWidth: 4,
								// borderColor: '#2F4654',
								// borderType: 'solid'
							}
						},
						// barGap 被设为 '20%'，这意味着每个类目（比如 A）下的两个柱子之间的距离，
						// 相对于柱条宽度的百分比。而 barCategoryGap 是 '40%'，
						// 意味着柱条每侧空余的距离，相对于柱条宽度的百分比。
						barGap: '40%',
						barCategoryGap: '60%',
						// 为柱条添加背景色
						// 用 showBackground 开启，并且可以通过 backgroundStyle 配置。
						showBackground: true,
						backgroundStyle: {
							borderRadius: [4, 4, 0, 0], //（顺时针左上，右上，右下，左下）
							color: 'rgba(3, 102, 241, 0.1)'
						},
					}, ]
				}
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

<style lang="scss" scoped>
	.firstBox {
		width: 654rpx;
		height: 450rpx;
		border-radius: 20rpx;
		margin-left: 32rpx;
		margin-top: 30rpx;
		background: #fff;
		padding: 30rpx 0 0 32rpx;

		.firstImg {
			display: flex;
			align-items: center;

			.waterLogo {
				width: 48rpx;
				height: 48rpx;
				margin-right: 16rpx;
			}

			.timeTxt {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size: 24rpx;
				line-height: 56rpx;
			}
		}

		.imgBox {
			display: flex;
			flex-wrap: wrap;
			margin-top: 28rpx;

			.imgContent {
				width: 280rpx;
				height: 160rpx;
				background-color: rgba(244, 247, 255, 1);
				border-radius: 16rpx;
				display: flex;
				padding-left: 24rpx;
				align-items: center;
				margin-right: 30rpx;
				margin-bottom: 24rpx;

				&:nth-child(2n) {
					// 去除第3n个的margin-right
					margin-right: 0rpx;
				}

				.alittleImg {
					width: 64rpx;
					height: 64rpx;
					margin-right: 24rpx;
				}

				.rightContent {
					.colorDot {
						color: rgba(3, 102, 241, 1);
						font-size: 36rpx;
						line-height: 42rpx;
					}

					.describe {
						color: rgba(51, 51, 51, 1);
						font-size: 28rpx;
						line-height: 42rpx;
					}
				}
			}


		}


	}

	.select_Time {
		width: 686rpx;
		height: 800rpx;
		margin-top: 24rpx;
		background: #fff;
		border-radius: 16rpx;
		margin-left: 32rpx;

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

			// .topBoxFlexR::after {
			// 	position: absolute;
			// 	content: '';
			// 	width: 40rpx;
			// 	height: 40rpx;
			// 	// line-height: 100px;
			// 	// display: block;
			// 	// text-align: center;
			// 	background-image: radial-gradient(40rpx at 36rpx -0rpx, #e9f2ff 42rpx, #fff 30rpx);
			// 	top: 41rpx;
			// 	right: -40rpx;
			// }

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
			height: 600rpx;
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
</style>