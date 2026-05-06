<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='问题上报'></head-nav>
		<view style="height: 176rpx;"></view>
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
		<scroll-view scroll-y="true" @scrolltolower="scrolltolower" class="boxpage">
			<view class="" v-if="checkNum ==1">
				<view class="" v-if='tableData.length>0'>
					<view class="maintenanceBox" v-for="item in tableData" @click="gotoDetail(item)">
						<view style="display: flex;border-bottom: 2rpx solid #0000000D;padding-bottom: 20rpx;">
							<image :src="item.picFileList[0].url"
								v-if="item.picFileList&&item.picFileList.length&&item.picFileList[0].url" mode=""
								class="timgSize" style="margin-left: 20rpx;" />
							<image src="/static/uploadProblem.png" v-else mode="" class="timgSize"
								style="margin-left: 20rpx;" />
							<view style="margin-left: 26rpx;">
								<view style="font-weight: 700;margin-bottom: 20rpx;line-height: 48rpx;" class="more">
									{{item.projectName}}
								</view>
								<view
									style="width: 400rpx;margin-bottom: 10rpx; overflow: hidden;  white-space: nowrap;text-overflow:ellipsis;font-size: 28rpx;line-height: 44rpx;">
									{{item.remark}}
								</view>
								<view style="color: #565656;margin-bottom: 10rpx; font-size: 28rpx;line-height: 44rpx;">
									上报人:<text style="color: #333;">{{item.reporterName}}</text></view>
								<view style="color: #565656;font-size: 28rpx;line-height: 44rpx;">时间:<text
										style="color: #333;">{{item.reportTime | futtilvalue1}}</text></view>
							</view>
						</view>
						<view class="plannedCompletionTime">
							问题来源:{{ item.source | sourceType}}
						</view>
						<view class="positionR isorange" v-if="item.status == 1">待派单</view>
						<view class="positionR ispurple" v-if="item.status == 2">待处理</view>
						<view class="positionR isblue" v-if="item.status == 3">待审核</view>
						<view class="positionR isred" v-if="item.status == 4">审核拒绝</view>
						<view class="positionR isblue" v-if="item.status == 5">已处理</view>
					</view>
				</view>
				<view class="" v-else>
					<noDeta></noDeta>
				</view>
			</view>
			<view class="" v-else>
				<view class="" v-if='tableData.length>0'>
					<view class="maintenanceBox" v-for="item in tableData" @click="gotoDetail(item)">
						<view style="display: flex;border-bottom: 2rpx solid #0000000D;padding-bottom: 20rpx;">
							<image :src="item.picFileList[0].url"
								v-if="item.picFileList&&item.picFileList.length&&item.picFileList[0].url" mode=""
								class="timgSize" style="margin-left: 20rpx;" />
							<image src="/static/uploadProblem.png" v-else mode="" class="timgSize"
								style="margin-left: 20rpx;" />
							<view style="margin-left: 26rpx;">
								<view style="font-weight: 700;margin-bottom: 20rpx;" class="more">{{item.wawoName}}
								</view>
								<view
									style="width: 400rpx;margin-bottom: 10rpx; overflow: hidden;  white-space: nowrap;text-overflow:ellipsis;font-size: 28rpx;line-height: 44rpx;">
									{{item.remark}}
								</view>
								<view style="color: #565656;margin-bottom: 10rpx; font-size: 28rpx;line-height: 44rpx;">
									上报人:<text style="color: #333;">{{item.reporterName}}</text></view>
								<view style="color: #565656;font-size: 28rpx;line-height: 44rpx;">时间:<text
										style="color: #333;">{{item.reportTime | futtilvalue1}}</text></view>
							</view>
						</view>
						<view class="plannedCompletionTime">
							问题来源:{{ item.source? item.source:'--'| sourceType}}
						</view>
						<view class="positionR isorange" v-if="item.status == 1">上报</view>
						<view class="positionR ispurple" v-if="item.status == 2">待处理</view>
						<view class="positionR isblue" v-if="item.status == 3">待审核</view>
						<view class="positionR isred" v-if="item.status == 4">审核拒绝</view>
						<view class="positionR isblue" v-if="item.status == 5">已处理</view>
					</view>
				</view>
				<view class="" v-else>
					<noDeta></noDeta>
				</view>
			</view>

		</scroll-view>
		<image src="/static/add.png" v-if="isShowBtn" mode="" class="addImg" @click="addWorkOrder"></image>
		<!-- 	<view class="addWorkOrder">
			问题上报
		</view> -->
		<uni-load-more :status="loadMoreStatus"></uni-load-more>
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
		queryDict,
		getwarnSensorWarning,
		getwarnSupervision,
		matterPageList,
		getOrderList
	} from '@/units/request.js'
	import {
		selectRole
	} from '../../units/units.js'
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
				checkNum: 1,
				isShowBtn: false,
				list1: [{
					name: '问题上报',
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
			this.pageNum = 1
			this.loadMoreStatus = 'more'
			this.tableData = []
			this.isShowBtn = selectRole(['GL', 'patrol_audit_role', 'area_manager', 'clerk_role', 'patrol_treat_role',
				'patrol_role', 'common'
			], uni.getStorageSync('getInfo').roles)
			if (this.checkNum == 2) {
				this.unquerygetPageList()
			} else {
				this.queryTableData()
			}
		},
		filters: {
			sourceType(e) {
				switch (e) {
					case "1":
						return '日常检查'
						break;
					case "2":
						return '定期检查'
						break;
					case "3":
						return '特别检查'
						break;
					case "9":
						return '其他'
						break;
					default:
						return '--'
						break;
				}
			},
			futtilvalue1(e) {
				if (e) {
					return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM-DD')))
				}
			}
		},
		methods: {
			scrolltolower() {
				if (this.checkone == 1) {
					this.queryTableData()
				} else {
					this.unquerygetPageList()
				}
			},
			gotoDetail(e) {
				// return
				if (e.status == '1') {
					uni.navigateTo({
						url: `/pages/problem/detail?id=${e.id}`
					})
				} else if (e.status == '5') {
					uni.navigateTo({
						url: `/pages/problem/orderDetail?id=${e.orderId}`
					})
				} else {
					// uni.navigateTo({
					// 	url: `/pages/problem/problemDetail?id=${e.id}`
					// })
					uni.navigateTo({
						url: `/pages/problem/process?id=${e.id}   `
					})
				}
			},
			checkNumBtn(e) {
				this.pageNum = 1
				this.loadMoreStatus = 'more'
				this.tableData = []
				if (e == 1) {
					this.queryTableData()
				} else {
					this.unquerygetPageList()
				}
				this.checkNum = e
			},
			queryTableData() {
				if (this.loadMoreStatus !== 'more') return;
				matterPageList({
					pageNum: `${this.pageNum}`,
					pageSize: 10,
					status: '1,2,3,4',
					statusT: "2",
					isNeed: 1
				}).then(rensphone => {
					if (rensphone.data.code == 200) {
						// this.tableData = []
						// return
						this.tableData = [...this.tableData, ...rensphone.data.rows]
						if (this.tableData.length >= rensphone.data.total) {

							this.loadMoreStatus = "noMore"
						} else {
							this.loadMoreStatus = "more"
							this.pageNum++
						}
						typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
					}
				})
			},
			unquerygetPageList() {
				if (this.loadMoreStatus !== 'more') return;
				// ?pageNum=${this.pageNum}&pageSize=${this.pageSize}&stm=${this.stm}-01 00:00:00&etm=${this.etm} 23:59:59
				getOrderList(`?pageNum=${this.pageNum}&pageSize=10&status=5&orderType=1&isNeed=1`).then(rensphone => {
					console.log(rensphone, 'rensphone')
					if (rensphone.data.code == 200) {
						this.tableData = [...this.tableData, ...rensphone.data.rows]
						if (this.tableData.length >= rensphone.data.total) {
							this.loadMoreStatus = "noMore"
						} else {
							this.loadMoreStatus = "more"
							this.pageNum++
						}
						typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
					}
				})
			},
			queryProcessingTable() {
				if (this.loadMoreStatus !== 'more') return;
				matterPageList({
					pageNum: `${this.pageNum}`,
					pageSize: 10,
					statusT: 1,
					isNeed: 1
				}).then(rensphone => {
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
						typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
					}
				})
			},
			click(e) {
				this.checkone = e.index
				this.loadMoreStatus = 'more'
				this.pageNum = 1
				this.tableData = []
				if (e.index == 1) {
					this.queryProcessingTable()
				} else {
					this.queryTableData()
				}
			},
			addWorkOrder() {
				uni.navigateTo({
					url: '/pages/problem/addEarlyOrder'
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
		// padding: 30rpx 32rpx 0;
		height: calc(100vh - 340rpx);
		padding-top: 20rpx;

		.maintenanceBox {
			width: 686rpx;
			height: 100%;
			background-color: #fff;
			border-radius: 16rpx;
			margin-left: 32rpx;
			margin-top: 22rpx;
			padding-top: 20rpx;
			position: relative;
		}

		.timgSize {
			width: 200rpx;
			height: 200rpx;
		}

		.plannedCompletionTime {
			// line-height: 86rpx;
			padding-left: 20rpx;
			font-size: 28rpx;
			color: #999;
			line-height: 80rpx;
		}

		.positionR {
			position: absolute;
			right: 18rpx;
			top: 16rpx;
			/* width: 124rpx; */
			height: 56rpx;
			border-radius: 32rpx;
			text-align: center;
			line-height: 56rpx;
			font-size: 24rpx;
			color: #fff;
			padding: 0 18rpx;
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

		.more {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 300rpx;
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

	.addWorkOrder {
		width: 686rpx;
		height: 100rpx;
		background: #0366F1;
		border-radius: 16rpx;
		margin-left: 32rpx;
		position: fixed;
		font-size: 36rpx;
		line-height: 100rpx;
		text-align: center;
		color: #fff;
		bottom: 86rpx;
	}
</style>