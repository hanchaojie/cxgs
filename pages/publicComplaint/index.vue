<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='公众投诉'></head-nav>
		<view style="height: 176rpx;"></view>
		<view class="topDisplay">
			<u-tabs :list="list1" @click="click" :scrollable="false" :activeStyle="{
            color: '#0366F1',fontWeight:'bold',fontSize:'32rpx'}" lineColor="#0366F1"></u-tabs>
		</view>
		<scroll-view scroll-y="true" class="boxpage" @scrolltolower="scrolltolower">
			<view class="" v-if="this.checkone == 0">
				<view class="" v-if="tableData.length >0">
					<view class="patrolMission" v-for="(i,index) in tableData">
						<view class="topName" style="font-size: 32rpx;">
							{{i.complaintNum}}
							<image src="/static/barCode.png" mode="" class="postab"></image>
						</view>

						<view class="date">
							投诉时间：<text style="color: rgba(51, 51, 51, 1);">{{i.reportTime | futtilvalue1}}</text>
						</view>
						<!-- 	<view class="rightTop">
							{{ filterTask(partol_task_type,i.taskType)}}
						</view> -->
						<!-- <image src="/static/left.png" mode="" class="leftSize"></image> -->
						<view class="SupplementaryRegistration" @click="gotoSupplement(i)">
							补充登记
						</view>
					</view>
				</view>
				<view class="" v-else>
					<noDeta></noDeta>
				</view>

			</view>
			<view class="" v-if="this.checkone == 1 ">
				<view class="" v-if="tableData.length >0">
					<view class="patrolMissionelse" v-for="(i,index) in tableData" @click="gotoDetail(i)">
						<view class="topName">
							<image src="/static/workOrderLogo.png" mode="" class="workOrderLogo"></image>
							<text
								style="margin-left: 30rpx;margin-right: 16rpx;color: rgba(51, 51, 51, 1);font-size: 32rpx;">
								[{{i.orderType | FirorderType}}]</text>
							<text
								style="font-size: 32rpx;width: 350rpx; white-space: nowrap;overflow: hidden; text-overflow: ellipsis;">{{i.projectName?i.projectName:'--'}}</text>
							<!-- <image src="/static/barCode.png" mode="" class="postab"></image> -->
						</view>
						<view class="frequency" style="margin-top: 32rpx;">
							{{i.context}}
						</view>
						<view class="frequency" style="margin-top: 27rpx;">
							<text style="color: rgba(51, 51, 51, 1);">{{i.remark}}</text>
						</view>
						<view class="date">
							投诉时间：<text style="color: rgba(51, 51, 51, 1);">{{i.reportTime | futtilvalue1}}</text>
						</view>
						<view class="rightTop isorange" v-if="i.status == 1">待派单</view>
						<view class="rightTop ispurple" v-if="i.status == 2">待处理</view>
						<view class="rightTop isblue" v-if="i.status == 3">待审核</view>
						<view class="rightTop isred" v-if="i.status == 4">已驳回</view>
						<view class="rightTop isblue" v-if="i.status == 5">已审核</view>
						<!-- 	<view class="querydetailBlue">
						查看详情
					</view> -->
						<image src="/static/left.png" mode="" class="leftSize"></image>
					</view>
				</view>
				<view class="" v-else>
					<noDeta></noDeta>
				</view>
			</view>
			<view class="" v-if="this.checkone == 2">
				<view class="" v-if="tableData.length >0">
					<view class="patrolMissionelse" v-for="(i,index) in tableData" @click="gotoDetail(i)">
						<view class="topName">
							<image src="/static/workOrderLogo.png" mode="" class="workOrderLogo"></image>
							<text
								style="margin-left: 30rpx;margin-right: 16rpx;color: rgba(51, 51, 51, 1);font-size: 32rpx;">
								[公众投诉]</text>
							<text
								style="font-size: 32rpx;width: 350rpx; white-space: nowrap;overflow: hidden; text-overflow: ellipsis;">{{i.wawoName?i.wawoName:'--'}}</text>
							<!-- <image src="/static/barCode.png" mode="" class="postab"></image> -->
						</view>
						<view class="frequency" style="margin-top: 32rpx;">
							{{i.context}}
						</view>
						<view class="frequency" style="margin-top: 27rpx;">
							<text style="color: rgba(51, 51, 51, 1);">{{i.remark}}</text>
						</view>
						<view class="date">
							投诉时间：<text style="color: rgba(51, 51, 51, 1);">{{i.reportTime | futtilvalue1}}</text>
						</view>
						<view class="rightTop isorange" v-if="i.status == 1">待派单</view>
						<view class="rightTop ispurple" v-if="i.status == 2">待处理</view>
						<view class="rightTop isblue" v-if="i.status == 3">待审核</view>
						<view class="rightTop isred" v-if="i.status == 4">已驳回</view>
						<view class="rightTop isblue" v-if="i.status == 5">已审核</view>
						<!-- 	<view class="querydetailBlue">
						查看详情
					</view> -->
						<image src="/static/left.png" mode="" class="leftSize"></image>
					</view>
				</view>
				<view class="" v-else>
					<noDeta></noDeta>
				</view>
			</view>
		</scroll-view>
		<uni-load-more :status="loadMoreStatus"></uni-load-more>
	</view>

</template>

<script>
	import HeadNav from '@/components/header.vue'
	import noDeta from '@/components/nodeta.vue'
	import {
		dayjs
	} from '@/uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		queryDict,
		getwarnSensorWarning,
		getwarnSupervision,
		getComplaintlist,
		getOrderList
	} from '@/units/request.js'
	import _switch from '../../uni_modules/uview-ui/libs/config/props/switch.js'
	export default {
		components: {
			HeadNav,
			noDeta
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				checkone: 0,
				navHeightValue: 0,
				pageNum: 1,
				loadMoreStatus: 'more',
				tableData: [],
				list1: [{
					name: '待补充',
				}, {
					name: '处理中',
				}, {
					name: '已处理'
				}]

			}
		},
		mounted() {
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
		},
		onShow() {
			this.queryTableData()
		},
		filters: {
			futtilvalue1(e) {
				console.log(e)
				if (e) {
					return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM-DD')))
				}
			},
			FirorderType(e) {
				switch (e) {
					case '1':
						return '水质投诉'
					case '2':
						return '水费投诉'
					case '3':
						return '水量投诉'
					case '9':
						return '其他投诉'
					default:
						break;
				}
			}
		},
		methods: {
			scrolltolower() {
				console.log('到底了')
				if (this.checkone == 1) {
					this.queryProcessingTable()
				} else if (this.checkone == 2) {
					this.queryProcessingTablethree()
				} else {
					this.queryTableData()
				}
			},
			gotoDetail(e) {
				console.log(e)
				if (e.status == '5') {
					uni.navigateTo({
						url: `/pages/publicComplaint/publicComplaintDetail?orderId=${e.orderId}`
					})
				} else if (e.status == '1') {
					uni.navigateTo({
						url: `/pages/publicComplaint/detail?complaintId=${e.complaintId}&status=${e.status}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/publicComplaint/process?complaintId=${e.complaintId}`
					})
				}
			},
			gotoSupplement(i) {
				console.log(i)
				uni.navigateTo({
					url: `/pages/publicComplaint/Supplementary?complaintId=${i.complaintId}&complaintNum=${i.complaintNum}`
				})

			},
			queryTableData() {
				if (this.loadMoreStatus !== 'more') return;
				getComplaintlist(`?pageNum=${this.pageNum}&pageSize=10&status=0`).then(rensphone => {
					console.log(rensphone, 'rensphone')
					if (rensphone.data.code == 200) {
						this.tableData = [...this.tableData, ...rensphone.data.rows]
						if (this.tableData.length >= rensphone.data.total) {
							console.log(this.tableData)
							this.loadMoreStatus = "noMore"
						} else {
							this.loadMoreStatus = "more"
							this.pageNum++
						}
						// console.log(this.tableData)
						typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
					}
				})
			},
			queryProcessingTable() {
				if (this.loadMoreStatus !== 'more') return;
				getComplaintlist(`?pageNum=${this.pageNum}&pageSize=10&statusList=1,2,3,4`).then(rensphone => {
					console.log(rensphone, 'rensphone')
					if (rensphone.data.code == 200) {
						this.tableData = [...this.tableData, ...rensphone.data.rows]
						if (this.tableData.length >= rensphone.data.total) {
							console.log(this.tableData)
							this.loadMoreStatus = "noMore"
						} else {
							this.loadMoreStatus = "more"
							this.pageNum++
						}
						// console.log(this.tableData)
						typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
					}
				})
			},
			queryProcessingTablethree() {
				if (this.loadMoreStatus !== 'more') return;
				getOrderList(`?pageNum=${this.pageNum}&pageSize=10&status=5&orderType=4`).then(rensphone => {
					console.log(rensphone, 'rensphone')
					if (rensphone.data.code == 200) {
						this.tableData = [...this.tableData, ...rensphone.data.rows]
						if (this.tableData.length >= rensphone.data.total) {
							this.loadMoreStatus = "noMore"
						} else {
							this.loadMoreStatus = "more"
							this.pageNum++
						}
						console.log(this.tableData)
						typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
					}
				})
			},
			click(e) {
				console.log(e)
				this.checkone = e.index
				this.loadMoreStatus = 'more'
				this.pageNum = 1
				this.tableData = []
				if (e.index == 1) {
					this.queryProcessingTable()
				} else if (e.index == 2) {
					this.queryProcessingTablethree()
				} else {
					this.queryTableData()
				}
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
	.topDisplay {
		width: 100%;
		// display: flex;
		background: #fff;
		padding-bottom: 5rpx;

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

	.boxpage {
		// padding: 30rpx 32rpx 0;
		height: calc(100vh - 354rpx);
		margin-left: 32rpx;
		margin-top: 20rpx;

		// overflow-y: scroll;
		.patrolMission {
			width: 664rpx;
			height: 152rpx;
			background-image: url('/static/samllback.png');
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
				right: 0rpx;
				top: 0;
				text-align: center;
				background: linear-gradient(228.64deg, rgba(146, 205, 251, 1), rgba(23, 124, 244, 1) 100%);
			}

			.leftSize {
				width: 64rpx;
				height: 64rpx;
				position: absolute;
				right: 64rpx;
				bottom: 48rpx;
			}

			.SupplementaryRegistration {
				width: 160rpx;
				height: 64rpx;
				box-sizing: border-box;
				border: 1rpx solid rgba(3, 102, 241, 0.2);
				border-radius: 32rpx;
				background: rgba(3, 102, 241, 0.1);
				position: absolute;
				right: 32rpx;
				bottom: 48rpx;
				text-align: center;
				line-height: 64rpx;
				color: rgba(3, 102, 241, 1);
				font-size: 28rpx;

			}
		}

		.patrolMissionelse {
			width: 652rpx;
			height: 220rpx;
			background-image: url('/static/blueback.png');
			background-repeat: no-repeat;
			background-size: 100%;
			padding: 36rpx 0 0 36rpx;
			position: relative;
			margin-bottom: 24rpx;

			.topName {
				color: rgba(51, 51, 51, 1);
				font-size: 28rpx;
				font-weight: 600;
				line-height: 32rpx;
				text-align: left;
				display: flex;
				align-items: center;

				.workOrderLogo {
					width: 64rpx;
					height: 64rpx;

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
				margin-top: 27rpx;
				color: rgba(86, 86, 86, 1);
				font-family: Microsoft YaHei;
				font-size: 28rpx;
				font-weight: 400;
				line-height: 42rpx;
				text-align: left;
			}

			.isorange {
				background: linear-gradient(228.64deg, rgba(245, 204, 119, 1), rgba(236, 148, 10, 1) 100%);
			}

			.ispurple {
				background: linear-gradient(228.64deg, rgba(246, 151, 255, 1), rgba(179, 74, 235, 1) 100%);
			}

			.isblue {
				background: linear-gradient(228.64deg, rgba(146, 205, 251, 1), rgba(23, 124, 244, 1) 100%);
			}

			.isred {
				background: linear-gradient(228.64deg, rgba(251, 146, 146, 1), rgba(244, 57, 23, 1) 100%);
			}

			.rightTop {
				width: 128rpx;
				height: 48rpx;
				font-size: 24rpx;
				color: #fff;
				line-height: 48rpx;
				border-radius: 0px 16rpx 0px 16rpx;
				position: absolute;
				right: 0rpx;
				top: 0rpx;
				text-align: center;
				// background: linear-gradient(228.64deg, rgba(146, 205, 251, 1), rgba(23, 124, 244, 1) 100%);
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
	}
</style>