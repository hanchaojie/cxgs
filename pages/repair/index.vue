<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='维修养护'></head-nav>
		<view style="height: 176rpx;">

		</view>
		<view class="topDisplay">
			<view class="leftDis" @click="checkNumBtn(1)">
				<image :src="checkNum == 1 ? '/static/weixiu.png' : '/static/unweixiu.png'" class=" patrolSize" mode="">
				</image>
				<view :class="checkNum == 1 ?'blueTxt':'whiteTxt'">
					维修记录
				</view>
			</view>
			<view class="rightDis" @click="checkNumBtn(2)">
				<image :src="checkNum==2 ? '/static/yanghu.png' : '/static/unyanghu.png'" class=" patrolSize" mode="">
				</image>
				<view :class="checkNum == 2 ?'blueTxt':'whiteTxt'">
					养护记录
				</view>
			</view>
		</view>
		<view class="listtabs">
			<u-tabs :list="list1" :scrollable="false" @click="tabsclick" :activeStyle="{
		    color: 'rgba(3, 102, 241, 1)', }" lineColor="rgba(3, 102, 241, 1)"></u-tabs>
		</view>
		<scroll-view scroll-y="true" @scrolltolower="scrolltolower" class="boxpage">
			<view class="" v-if='tableData.length>0'>
				<view class="maintenanceBox" v-for="item in tableData" @click="gotoDetail(item)">
					<view style="display: flex;border-bottom: 2rpx solid #0000000D;padding-bottom: 20rpx;">
						<image :src="item.picFileList[0].url"
							v-if="item.picFileList&&item.picFileList.length&&item.picFileList[0].url" mode=""
							class="timgSize" style="margin-left: 20rpx;" />
						<image src="/static/uploadProblem.png" v-else mode="" class="timgSize"
							style="margin-left: 20rpx;" />
						<view style="margin-left: 26rpx;">
							<view style="font-weight: 700;margin-bottom: 20rpx;" class="more">
								{{item.projectName?item.projectName:'--'}}
							</view>
							<view
								style="font-size: 28rpx;width: 400rpx;margin-bottom: 10rpx; overflow: hidden;  white-space: nowrap;text-overflow:ellipsis;line-height: 48rpx;">
								{{item.maintenanceReason?item.maintenanceReason:'--'}}
							</view>
							<view style="color: #565656;margin-bottom: 10rpx;font-size: 28rpx;line-height: 48rpx; ">
								下达人:<text style="color: #333;">
									{{item.reporterName}}</text>
							</view>
							<view style="color: #565656;font-size: 28rpx;">被指派人: <text style="color: #333;">
									{{item.treaterName}}</text>
							</view>
						</view>
					</view>
					<view class="plannedCompletionTime" style="font-size: 28rpx;">
						计划完成时间:{{item.planFinishTime }}
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
		</scroll-view>
		<uni-load-more :status="loadMoreStatus"></uni-load-more>
		<image src="/static/add.png" v-if="isShowBtn" mode="" class="addImg" @click="addProcess"></image>
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
		selectRole
	} from '../../units/units.js'
	import {
		getRecordList
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
				loadMoreStatus: 'more',
				isShowBtn:false,
				list1: [{
					name: '未完成',
				}, {
					name: '已完成',
				}],
				tabNum: 1
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
		onLoad() {

		},
		onShow() {
			this.tableData = []
			this.pageNum = 1
			this.loadMoreStatus = 'more'
			// this.queryTableData()
			this.isShowBtn = selectRole(['GL', 'patrol_audit_role', 'area_manager', 'clerk_role', 'patrol_treat_role',
				'patrol_role', 'common'
			], uni.getStorageSync('getInfo').roles)
			if (this.checkNum == 1) {
				if (this.tabNum == 2) {
					this.unqueryTableData()
				} else {
					this.queryTableData()
				}

			} else {

				if (this.tabNum == 2) {
					this.unyanghuTableTableData()
				} else {
					this.yanghuTableTableData()
				}
			}
		},
		filters: {
			futtilvalue1(e) {
				console.log(e)
				if (e) {
					return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM-DD')))
				}
			},
		},

		methods: {
			tabsclick(e) {
				this.tableData = []
				this.pageNum = 1
				this.loadMoreStatus = 'more'
				console.log(e)
				if (this.checkNum == 1) {
					if (e.name == '已完成') {
						this.tabNum = 2
						this.unqueryTableData()
					} else {
						this.tabNum = 1
						this.queryTableData()
					}

				} else {
					if (e.name == '已完成') {
						this.tabNum = 2
						this.unyanghuTableTableData()
					} else {
						this.tabNum = 1
						this.yanghuTableTableData()
					}
				}
			},
			unqueryTableData() {
				if (this.loadMoreStatus !== 'more') return;
				getRecordList(`?maintenanceType=1&pageNum=${this.pageNum}&pageSize=10&statusList=5&isNeed=1&module=WAWO`).then(
					rensphone => {
						if (rensphone.data.code == 200) {
							this.tableData = [...this.tableData, ...rensphone.data.rows]
							if (this.tableData.length >= rensphone.data.total) {
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
			queryTableData() {
				if (this.loadMoreStatus !== 'more') return;
				getRecordList(`?maintenanceType=1&pageNum=${this.pageNum}&pageSize=10&statusList=1,2,3,4&isNeed=1&module=WAWO`).then(
					rensphone => {
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

			yanghuTableTableData() {
				if (this.loadMoreStatus !== 'more') return;
				getRecordList(`?maintenanceType=2&pageNum=${this.pageNum}&pageSize=10&statusList=1,2,3,4&isNeed=1&module=WAWO`).then(
					rensphone => {
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
			unyanghuTableTableData() {
				if (this.loadMoreStatus !== 'more') return;
				getRecordList(`?maintenanceType=2&pageNum=${this.pageNum}&pageSize=10&statusList=5&isNeed=1&module=WAWO`).then(
					rensphone => {
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
			checkNumBtn(e) {
				this.checkNum = e
				this.tableData = []
				this.pageNum = 1
				this.loadMoreStatus = 'more'
				if (e == 1) {
					if (this.tabNum == 1) {
						this.queryTableData()
					} else {
						this.unqueryTableData()
					}
					// this.queryProcessingTable()
				} else {
					if (this.tabNum == 1) {
						this.yanghuTableTableData()
					} else {
						this.unyanghuTableTableData()
					}
					// this.queryTableData()
				}
			},
			addProcess() {
				if (this.checkNum == 1) {
					uni.navigateTo({
						url: '/pages/repair/fqweixiu'
					})
				} else {
					uni.navigateTo({
						url: '/pages/repair/fqyanghu'
					})
				}

			},
			scrolltolower() {
				if (this.checkNum == 1) {
					if (this.tabNum == 1) {
						this.queryTableData()
					} else {
						this.unqueryTableData()
					}
					// this.queryProcessingTable()
				} else {
					if (this.tabNum == 1) {
						this.yanghuTableTableData()
					} else {
						this.unyanghuTableTableData()
					}
					// this.queryTableData()
				}
			},
			gotoDetail(item) {
				uni.navigateTo({
					url: `/pages/repair/repairDetail?id=${item.recordId}`
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
		height: calc(100vh - 454rpx);

		.maintenanceBox {
			width: 686rpx;
			height: auto;
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
			line-height: 80rpx;
			color: #999;
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

	.listtabs {
		width: 686rpx;
		height: 96rpx;
		border-radius: 16rpx;
		background-color: #fff;
		margin-left: 32rpx;
		margin-top: 30rpx;
	}
</style>