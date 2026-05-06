<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='采样上报'></head-nav>
		<view style="height: 176rpx;">

		</view>
<!-- 		<view class="topDisplay">
			<view class="leftDis" @click="checkNumBtn(1)">
				<image :src="checkNum == 1 ? '/static/waterReport.png' : '/static/unwaterReport.png'"
					class=" patrolSize" mode=""></image>
				<view :class="checkNum == 1 ?'blueTxt':'whiteTxt'">
					水质采样
				</view>
			</view>
			<view class="rightDis" @click="checkNumBtn(2)">
				<image :src="checkNum==2 ? '/static/report.png' : '/static/unreport.png'" class=" patrolSize" mode="">
				</image>
				<view :class="checkNum == 2 ?'blueTxt':'whiteTxt'">
					水质上报
				</view>
			</view>
		</view> -->
		<view class="rightBox">
			<view class="selectBox">
				<view class="selectLeft" @click="openSelectBox">
					缙云县{{addvcdName}}
					<u-icon name="arrow-down-fill" color="#000" size="14"></u-icon>
				</view>
				<view class="selectRight" @click="openTimePopup">
					<!-- {{this.year}}-{{this.month<10?'0'+this.month:this.month}} -->
					{{value1 | futtilvalue1}}
					<uni-icons custom-prefix=" iconfont" type="cxgsrili-" size="20"></uni-icons>
				</view>
			</view>
			<view class="boxpage">
				<view class="" v-if='list.length>0'>
					<view :class="i.testStatus==1 ?'patrolMission':'patrolMissionRed' " v-for="(i,index) in list"
						@click="gotoWaterDetails(i)">
						<view class="topName" style="font-size: 32rpx;">
							{{i.wawoName}}
							<image src="/static/barCode.png" mode="" class="postab"></image>
						</view>
						<view class="frequency">
							采样时间：<text style="color: rgba(51, 51, 51, 1);">{{i.spt}}</text>
						</view>
						<view class="date">
							检测时间：<text style="color: rgba(51, 51, 51, 1);">{{i.testTime}}</text>
						</view>
						<view class="rightTop">
							{{i.testStatus == 1?"合格":"超标"}}
						</view>
						<!-- 		<view class="querydetailBlue">
							查看详情
						</view> -->
						<image :src="i.testStatus==1?'/static/left.png':'/static/arrowRed.png'" mode=""
							class="leftSize">
						</image>
					</view>
				</view>
				<view class="" v-else>
					<noDeta></noDeta>
				</view>
			</view>
		</view>
		<uni-popup ref="timePopup" type="bottom" border-radius="10px 10px 0 0">
			<view class="autoHeight">
				<view class="topTxt">
					选择日期
				</view>
				<uni-icons class="uicons" type="closeempty" size="24" @click="closetimePopup"></uni-icons>
				<!-- 				<view class="heibox">
					<picker-view :value="value" @change="bindChange" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
						</picker-view-column>
					</picker-view>
					<button type="primary" class="confimBtn" @click="confimBtn">确定</button>
				</view> -->
			</view>
		</uni-popup>
		<!-- <uni-popup ref="addressPopup" type="bottom" border-radius="10px 10px 0 0"> -->
		<u-picker :closeOnClickOverlay="true" title='选择地区' :show="addressPopup" ref="uPicker" :columns="columns"
			@confirm="confirm" @change="changeHandler" @cancel="cancel" @close="cancel"></u-picker>
		<u-datetime-picker :show="timeShow" v-model="value1" title='选择时间' mode="year-month" closeOnClickOverlay
			@confirm="timeConfirm" @close="closeTime"></u-datetime-picker>
		<!-- </uni-popup> -->
		<image src="/static/add.png" mode="" class="addImg" @click="addWaterQuality"></image>
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import noDeta from '@/components/nodeta.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		dayjs
	} from '@/uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js'
	import {
		mGetDate,
		GettreeByAddvcd,
		queryWqlist
	} from '@/units/request.js'
	export default {
		components: {
			HeadNav,
			noDeta
		},
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 1990; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}
			return {
				years,
				year,
				months,
				month,
				days,
				day,
				value: [9999, month - 1, day - 1],
				value1: Number(new Date()),
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				checkNum: 1,
				addressPopup: false,
				closeOnClickOverlay: true,
				timeShow: false,
				columns: [],
				columnData: [],
				addvcdName: '',
				addvcd: "",
				list: [],
				allList: []

			}
		},
		filters: {
			futtilvalue1(e) {
				return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM')))
			}
		},
		async mounted() {
			// -------------------------- 经典界面自定义，需要记录-------------------------------------------------------------
			// 设备系统信息
			let systemInfomations_ = uni.getSystemInfoSync()
			// 机型适配比例系数
			let scaleFactor_ = 750 / systemInfomations_.windowWidth
			// 当前机型-屏幕高度
			let windowHeight_ = systemInfomations_.windowHeight * scaleFactor_ //rpx

			/* 获取设备信息 */
			const SystemInfomations = systemInfo()
			/* 通用平台 */
			const statusBarHeight = SystemInfomations.statusBarHeight //状态栏高度
			this.navHeightValue = Number((176 - SystemInfomations.statusBarHeight) / SystemInfomations.scaleFactor)
			const scaleFactor = SystemInfomations.scaleFactor //比例系数
			const windowWidth = SystemInfomations.windowWidth //当前设备的屏幕宽度
			/* 微信小程序平台 */
			// #ifdef MP-WEIXIN
			const navHeight = SystemInfomations.navHeight + SystemInfomations.statusBarHeight //头部导航栏总高度
			const navigationBarHeight = SystemInfomations.navHeight //头部导航栏高度
			const customHeight = SystemInfomations.menuButtonHeight //胶囊高度
			const menubarLeft = SystemInfomations.menuButtonLeft //胶囊左边界距离左上角的距离
			this.containerStyle = ' height:' + (systemInfomations_.windowHeight - statusBarHeight - 10) + 'px;';
			// #endif
			/* 通用平台 */
			// #ifndef MP-WEIXIN
			this.containerStyle = 'height:' + (systemInfomations_.windowHeight - 54) + 'px;';
			// navStyle.value = 'height:' + 44 + 'px';
			// #endif
			// ---------------------------------------------------------------------------------------
			await this.QueryGettreeByAddvcd()
		},
		methods: {
			gotoWaterDetails(e) {
				console.log(e)
				uni.setStorageSync('samplingData', e)
				uni.navigateTo({
					url: `/pages/waterQualityReport/queryWater?samplingCode=${e.samplingCode}`
				})
			},
			bindChange: function(e) {
				console.log(e)
				const val = e.detail.value
				this.year = this.years[val[0]]
				this.month = this.months[val[1]]
				this.day = this.days[val[2]]
			},
			checkNumBtn(e) {
				console.log(e)
				if (e == 2) {
					uni.$u.toast('水质上报暂不开发');
					return
				} else {
					this.checkNum = e
				}
				// if(e)
			},
			openTimePopup() {
				// this.$refs.timePopup.open('bottom')
				this.timeShow = true
			},
			closetimePopup() {
				this.$refs.timePopup.close()
				// this.timePopup = false
			},
			timeConfirm(e) {
				console.log(e)
				this.value1 = e.value
				this.timeShow = false
				this.defaultQuery()
			},
			QueryGettreeByAddvcd() {
				GettreeByAddvcd().then(res => {
					console.log(res)
					this.allList = res.data.data
					this.columns = [
						[res.data.data[0].name], res.data.data[0].children.map(e => {
							return e.name
						})
					]
					this.columnData = res.data.data[0].children.map(e => {
						return e.name
					})
					this.addvcd = res.data.data[0].children[0].addvcd
					this.addvcdName = res.data.data[0].children[0].name
					console.log(this.columns)
					console.log(this.columnData)
					this.defaultQuery()
				})
			},
			changeHandler(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e
				// 当第一列值发生变化时，变化第二列(后一列)对应的选项
				if (columnIndex === 0) {
					// picker为选择器this实例，变化第二列对应的选项
					picker.setColumnValues(1, this.columnData[index])
				}
			},
			closeTime() {
				this.timeShow = false
			},
			openSelectBox() {
				// this.$refs.popup.open('bottom')
				this.addressPopup = true
			},
			confimBtn(e) {
				console.log(e)
				console.log(this.year + '-' + this.month)
				this.$refs.timePopup.close()
			},
			confirm(e) {
				console.log(e)
				this.addvcdName = e.value[1]
				this.addvcd = this.allList[0].children.find(e => e.name == this.addvcdName).addvcd,
					this.addressPopup = false
				console.log(this.addvcd)
				console.log(this.addvcdName)
				this.defaultQuery()
				// this.addvcd  = this.allList
			},
			cancel() {
				this.addressPopup = false
			},
			addWaterQuality() {
				uni.navigateTo({
					url: '/pages/waterQualityReport/addWater'
				})
			},
			defaultQuery() {

				let dayNum = dayjs(this.value1).daysInMonth() // 31
				let stm = `${dayjs(this.value1).format('YYYY-MM')}-01 00:00:00`
				let etm = `${dayjs(this.value1).format('YYYY-MM')}-${dayNum} 23:59:59`
	
				// addvcd
				// stm
				// etm
				queryWqlist(`?addvcd=${this.addvcd}&stm=${stm}&etm=${etm}`).then(res => {
					console.log(res)
					this.list = res.data.rows
				})
			}
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
	.addImg {
		position: fixed;
		right: 56rpx;
		bottom: 76rpx;
		width: 144rpx;
		height: 144rpx;
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

		.topTxt {
			text-align: center;
		}

		.uicons {
			position: absolute;
			right: 46rpx;
			top: 40rpx;
		}

		.heibox {
			height: auto;
			padding: 52rpx 46rpx 48rpx;
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

	.topDisplay {
		width: 100%;
		display: flex;
		background: #fff;
		padding-bottom: 20rpx;

		.leftDis {
			// flex: 1;
			display: flex;
			// display: block;
			align-items: center;
			margin: 0 auto;

			.blueTxt {
				color: rgba(3, 102, 241, 1);
				font-family: "Microsoft YaHei";
				font-size: 30rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}

			.whiteTxt {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size: 30rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}
		}

		.rightDis {
			// flex: 1;
			display: flex;
			// display: block;
			align-items: center;
			margin: 0 auto;

			.blueTxt {
				color: rgba(3, 102, 241, 1);
				font-family: "Microsoft YaHei";
				font-size: 30rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}

			.whiteTxt {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size: 30rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}
		}

		.patrolSize {
			width: 48rpx;
			height: 48rpx;
			margin-right: 16rpx;
		}
	}

	.rightBox {
		.selectBox {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;
			padding-top: 32rpx;

			.selectLeft {
				width: 302rpx;
				height: 80rpx;
				background-color: #fff;
				border-radius: 12rpx;
				display: flex;
				justify-content: space-between;
				padding: 0 24rpx;
				align-items: center;
			}

			.selectRight {
				width: 262rpx;
				height: 80rpx;
				background-color: #fff;
				border-radius: 12rpx;
				display: flex;
				justify-content: space-between;
				padding: 0 24rpx;
				align-items: center;
				position: relative;



			}
		}

		.boxpage {
			padding: 30rpx 32rpx 0;
			height: calc(100vh - 374rpx);
			overflow-y: scroll;

			.patrolMission {
				width: 664rpx;
				height: 232rpx;
				background-image: url('/static/blueback.png');
				background-size: 100%;
				padding: 24rpx 0 0 24rpx;
				position: relative;
				margin-bottom: 24rpx;

				.topName {
					color: rgba(51, 51, 51, 1);
					font-size: 28rpx;
					font-weight: 600;
					line-height: 32rpx;
					text-align: left;
					position: relative;

					.postab {
						position: absolute;
						left: 0;
						width: 128rpx;
						height: 8rpx;
						bottom: -5rpx;

					}

				}

				.frequency {
					margin-top: 40rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.date {
					margin-top: 30rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.rightTop {
					width: 128rpx;
					height: 48rpx;
					font-size: 24rpx;
					color: #fff;
					line-height: 48rpx;
					border-radius: 0px 16rpx 0px 16rpx;
					position: absolute;
					right: 0;
					top: 0;
					text-align: center;
					background: linear-gradient(228.64deg, rgba(146, 205, 251, 1), rgba(23, 124, 244, 1) 100%);
				}

				.querydetailBlue {
					width: 160rpx;
					height: 64rpx;
					position: absolute;
					right: 48rpx;
					bottom: 48rpx;
					background: rgba(3, 102, 241, 0.1);
					border: 1rpx solid rgba(3, 102, 241, 0.2);
					border-radius: 32rpx;
					text-align: center;
					line-height: 64rpx;
					color: rgba(3, 102, 241, 1);
					font-size: 28rpx;
					font-weight: 400;
				}

				.leftSize {
					width: 64rpx;
					height: 64rpx;
					position: absolute;
					right: 64rpx;
					bottom: 48rpx;
				}
			}

			.patrolMissionRed {
				width: 664rpx;
				height: 232rpx;
				background-image: url('/static/renback.png');
				background-size: 100%;
				padding: 24rpx 0 0 24rpx;
				position: relative;
				margin-bottom: 24rpx;

				.topName {
					color: rgba(51, 51, 51, 1);
					font-size: 28rpx;
					font-weight: 600;
					line-height: 32rpx;
					text-align: left;
					position: relative;

					.postab {
						position: absolute;
						left: 0;
						width: 128rpx;
						height: 8rpx;
						bottom: -5rpx;

					}

				}

				.frequency {
					margin-top: 40rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.date {
					margin-top: 30rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.rightTop {
					width: 128rpx;
					height: 48rpx;
					font-size: 24rpx;
					color: #fff;
					line-height: 48rpx;
					border-radius: 0px 16rpx 0px 16rpx;
					position: absolute;
					right: 0;
					top: 0;
					text-align: center;
					background: linear-gradient(228.64deg, rgba(251, 146, 146, 1), rgba(244, 57, 23, 1) 100%);
				}

				.querydetailBlue {
					width: 160rpx;
					height: 64rpx;
					position: absolute;
					right: 48rpx;
					bottom: 48rpx;
					background: rgba(226, 42, 44, 0.1);
					border: 1rpx solid rgba(226, 42, 44, 0.2);
					border-radius: 32rpx;
					text-align: center;
					line-height: 64rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: rgba(226, 42, 44, 1);
				}

				.leftSize {
					width: 64rpx;
					height: 64rpx;
					position: absolute;
					right: 64rpx;
					bottom: 48rpx;
				}
			}
		}
	}
</style>