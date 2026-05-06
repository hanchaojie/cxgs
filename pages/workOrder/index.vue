<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='工单处理'></head-nav>
		<view style="height: 176rpx;">

		</view>
		<view class="topDisplay">
			<view class="leftDis" @click="checkNumBtn(1)">
				<image :src="checkNum == 1 ? '/static/Unfinished.png' : '/static/unUnfinished.png'" class=" patrolSize"
					mode=""></image>
				<view :class="checkNum == 1 ?'blueTxt':'whiteTxt'">
					未完成
				</view>
			</view>
			<view class="rightDis" @click="checkNumBtn(2)">
				<image :src="checkNum==2 ? '/static/Completed.png' : '/static/unCompleted.png'" class=" patrolSize"
					mode=""></image>
				<view :class="checkNum == 2 ?'blueTxt':'whiteTxt'">
					已完成
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="boxpage" @scrolltolower="scrolltolower">
			<view class="" v-if='tableData.length>0'>
				<view class="patrolMission" v-for="(i,index) in tableData" @click="gotoDetail(i)">
					<view class="topName">
						<image src="/static/workOrderLogo.png" mode="" class="workOrderLogo"></image>

						<text
							style="margin-left: 30rpx;margin-right: 16rpx;color: rgba(238, 58, 45, 1);font-size: 32rpx;"
							v-if="i.lev == '1'"> [Ⅰ级]</text>
						<text
							style="margin-left: 30rpx;margin-right: 16rpx;color: rgba(236, 148, 10, 1);font-size: 32rpx;"
							v-else-if="i.lev == '2'"> [Ⅱ级]</text>
						<text
							style="margin-left: 30rpx;margin-right: 16rpx;color: rgba(3, 102, 241, 1);font-size: 32rpx;"
							v-else-if="i.lev == '3'"> [Ⅲ级]</text>
						<text
							style="font-size: 32rpx;width: 350rpx; white-space: nowrap;overflow: hidden; text-overflow: ellipsis;">{{i.wawoName}}</text>

						<!-- <image src="/static/barCode.png" mode="" class="postab"></image> -->
					</view>
					<!-- 			<view class="frequency" style="margin-top: 32rpx;">
						{{i.orderName}}
					</view> -->
					<view class="frequency" style="margin-top: 27rpx;">
						下达人：<text style="color: rgba(51, 51, 51, 1);">{{i.reporterName}}</text>
					</view>
					<view class="date">
						下达时间：<text style="color: rgba(51, 51, 51, 1);">{{i.reportTime | futtilvalue1}}</text>
					</view>
					<view class="date">
						工单类型：<text style="color: rgba(51, 51, 51, 1);">{{i.orderType | fitrerOrder}}</text>
					</view>
					<view class="rightTop isorange" v-if="i.status == 1">待接收</view>
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
			<uni-load-more :status="loadMoreStatus"></uni-load-more>
		</scroll-view>
		<image src="/static/add.png" mode="" class="addImg" @click="addWorkOrder"></image>
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import noDeta from '@/components/nodeta.vue'
	import {
		systemInfo,
	} from '../../units/system_info.js'
	import {
		dayjs
	} from '@/uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js'
	import {
		getOrderList,
		baseAttWawoBaseList
	} from '@/units/request.js'
	export default {
		components: {
			HeadNav,
			noDeta
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				checkNum: 1,
				pageNum: 1,
				tableData: [],
				wawoList: [],
				loadMoreStatus: 'more',

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
			// this.querybaseAttWawoBaseList()
		},



		filters: {
			fitrerOrder(e) {
				switch (e) {
					case '1':
						return '上报问题'
						break;
					case '2':
						return '监测报警'
						break;
					case '3':
						return '媒体报道'
						break;
					case '4':
						return '公众投诉'
						break;
					case '5':
						return '暗访督查'
						break;
					case '9':
						return '其他'
						break;
					default:
						break;
				}
			},
			futtilvalue1(e) {
				console.log(e)
				if (e) {
					return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM-DD')))
				}
			}
		},
		onShow() {
			this.pageNum = 1
			this.tableData = []
			this.loadMoreStatus = 'more'
			console.log(this.checkNum)
			if (this.checkNum == 1) {
				this.querygetPageList()
			} else {
				this.unquerygetPageList()
			}
		},
		methods: {
			checkNumBtn(e) {
				console.log(e)
				this.pageNum = 1
				this.loadMoreStatus = 'more'
				this.tableData = []
				if (e == 1) {
					this.querygetPageList()
				} else {
					this.unquerygetPageList()
				}
				this.checkNum = e
			},
			scrolltolower() {
				console.log('到底了')
				if (this.checkNum == 1) {
					this.querygetPageList()
				} else {
					this.unquerygetPageList()
				}


			},
			gotoDetail(i) {
				console.log(i)
				uni.navigateTo({
					url: `/pages/workOrder/workDetail?oderId=${i.orderId}`
				})
			},
			addWorkOrder() {
				uni.navigateTo({
					url: '/pages/workOrder/addWork'
				})
			},
			querybaseAttWawoBaseList() {
				baseAttWawoBaseList().then(res => {
					this.wawoList = res.data.rows
				})
			},
			querygetPageList() {

				if (this.loadMoreStatus !== 'more') return;
				// ?pageNum=${this.pageNum}&pageSize=${this.pageSize}&stm=${this.stm}-01 00:00:00&etm=${this.etm} 23:59:59
				getOrderList(`?pageNum=${this.pageNum}&pageSize=10&statusList=1,2,3,4`).then(rensphone => {
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
			unquerygetPageList() {

				if (this.loadMoreStatus !== 'more') return;
				// ?pageNum=${this.pageNum}&pageSize=${this.pageSize}&stm=${this.stm}-01 00:00:00&etm=${this.etm} 23:59:59
				getOrderList(`?pageNum=${this.pageNum}&pageSize=10&statusList=5`).then(rensphone => {
					console.log(rensphone, 'rensphone')
					if (rensphone.data.code == 200) {
						this.tableData = [...this.tableData, ...rensphone.data.rows]
						if (this.tableData.length >= rensphone.data.total) {
							this.loadMoreStatus = "noMore"
						} else {
							this.loadMoreStatus = "more"
							this.pageNum++
						}
						console.log(rensphone.data.rows)


						typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
					}
				})
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
				font-size: 32rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}

			.whiteTxt {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size: 32rpx;
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
				font-size: 32rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}

			.whiteTxt {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size: 32rpx;
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
		padding: 30rpx 32rpx 0;
		height: calc(100vh - 304rpx);
		// overflow-y: scroll;

		.patrolMission {
			width: 652rpx;
			height: 300rpx;
			background-image: url('/static/bigback.png');
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

	.addImg {
		position: fixed;
		// right: 16rpx;
		// bottom: 56rpx;
		// width: 112rpx;
		// height: 112rpx;

		right: 56rpx;
		bottom: 76rpx;
		width: 144rpx;
		height: 144rpx;

	}
</style>