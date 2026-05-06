<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='待办事项'></head-nav>
		<view style="height: 176rpx;">
		</view>
		<view class="boxpage">

			<!-- 
			<view class="newbox" v-for="(i,index) in patrolBox" @click="Golocation(i)">
				<view class="topName">
					<view class="topName_t">
						<image src="/static/lan.png" mode="" class="workOrderLogo"></image>
						<text style="margin-right: 16rpx;"> [巡查任务]</text>
						<text>{{i.title}}</text>
					</view>
					<view class="patrolBtn" style="color: #0366F1;">
						巡查
					</view>
				</view>
				<view class="lastNmae">
					{{i.patrolValidStm}}-{{i.patrolValidEtm}}
				</view>
			</view> -->
			<!-- 		<view class="newbox" v-for="(i,index) in problemBox" @click="gotoProblem(i)">
				<view class="topName">
					<view class="topName_t">
						<image src="/static/lan.png" mode="" class="workOrderLogo"></image>
						<text style="margin-right: 16rpx;"> [问题上报]</text>
						<text
							style="width: 400rpx;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;">{{i.projectName}}</text>
					</view>
					<view class="leftBtn">
						{{ i.remark}}
					</view>
					<view class="patrolBtn isorange" v-if="i.status == 1">工单上报</view>
					<view class="patrolBtn ispurple" v-if="i.status == 2">待处理</view>
					<view class="patrolBtn isblue" v-if="i.status == 3">待审核</view>
					<view class="patrolBtn isred" v-if="i.status == 4">已驳回</view>
					<view class="patrolBtn isblue" v-if="i.status == 5">已审核</view>
				</view>
				<view class="lastNmae">
					{{i.reportTime}}
				</view>
			</view> -->
			<!-- 			<view class="newbox" v-for="(i,index) in tableData" @click="gotoWorkOrder(i)">
				<view class="topName">
					<view class="topName_t">
						<image src="/static/lan.png" mode="" class="workOrderLogo"></image>
						<text style="margin-right: 16rpx;"> [工单任务]</text>
						<text
							style="width: 400rpx;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;">{{i.projectName}}</text>
					</view>
					<view class="leftBtn">
						{{ i.remark}}
					</view>
					<view class="patrolBtn isorange" v-if="i.status == 1">待接收</view>
					<view class="patrolBtn ispurple" v-if="i.status == 2">待处理</view>
					<view class="patrolBtn isblue" v-if="i.status == 3">待审核</view>
					<view class="patrolBtn isred" v-if="i.status == 4">已驳回</view>
					<view class="patrolBtn isblue" v-if="i.status == 5">已审核</view>
				</view>
				<view class="lastNmae">
					{{i.reportTime}}
				</view>
			</view> -->
			<!-- <view class="newbox" v-for="(i,index) in RecordList" @click="gotoRepair(i)">
				<view class="topName">
					<view class="topName_t">
						<image src="/static/huang.png" mode="" class="workOrderLogo"></image>
						<text style="margin-right: 16rpx;"> [维修养护]</text>
						<text
							style="width: 400rpx;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;">{{i.projectName}}</text>
					</view>
					<view class="leftBtn">
						{{ i.maintenanceReason}}
					</view>
					<view class="patrolBtn isorange" v-if="i.status == 1">待接收</view>
					<view class="patrolBtn ispurple" v-if="i.status == 2">待处理</view>
					<view class="patrolBtn isblue" v-if="i.status == 3">待审核</view>
					<view class="patrolBtn isred" v-if="i.status == 4">已驳回</view>
					<view class="patrolBtn isblue" v-if="i.status == 5">已审核</view>
				</view>
				<view class="lastNmae">
					{{i.reportTime}}
				</view>
			</view> -->

			<view class="" v-if='todoList.length>0'>
				<view class="newbox" v-for="(i,index) in todoList" @click="gotoRepair(i)">
					<view class="topName">
						<view class="topName_t">
							<image src="/static/lan.png" v-if="i.taskType == 5" mode="" class="workOrderLogo"></image>
							<image src="/static/huang.png" v-else mode="" class="workOrderLogo"></image>
							<text style="margin-right: 16rpx;"> [{{selectDict(i.taskType)}}]</text>
							<text
								style="width: 400rpx;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;">{{i.projectName}}</text>
						</view>
						<view class="leftBtn">
							{{ i.name}}
						</view>
						<view class="patrolBtn" v-if="i.taskType == '5'" style="color: #0366F1;">
							巡查
						</view>
						<view class="" v-else>
							<view class="patrolBtn" v-if="i.taskType == 4 &&i.status == 0" style="color: #0366F1;">
								补充登记
							</view>
							<view class="" v-else>
								<view class="" v-if="i.taskType == '2'">
									<view class="patrolBtn isorange" v-if="i.status == 1">接收</view>
									<view class="patrolBtn ispurple" v-if="i.status == 2">处理</view>
									<view class="patrolBtn isblue" v-if="i.status == 3">审核</view>
									<view class="patrolBtn isred" v-if="i.status == 4">处理</view>
									<view class="patrolBtn isblue" v-if="i.status == 5">已审核</view>
								</view>
								<view v-else class="">
									<view class="patrolBtn isorange" v-if="i.status == 1">派单</view>
									<view class="patrolBtn ispurple" v-if="i.status == 2">处理</view>
									<view class="patrolBtn isblue" v-if="i.status == 3">审核</view>
									<view class="patrolBtn isred" v-if="i.status == 4">处理</view>
									<view class="patrolBtn isblue" v-if="i.status == 5">已审核</view>
								</view>
							</view>
						</view>
					</view>
					<view class="lastNmae">
						{{i.actionTime}}
					</view>
				</view>
			</view>
			<view class="" v-else>
				<noDeta></noDeta>
			</view>
		</view>
		<uni-popup ref="centerPopup" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					巡查需开启手机GPS定位记录您的巡查轨迹
					确定是否开启并开始巡查?
				</view>
				<view class="confimBtnPop">
					<view class="confimNo" @click="closeCenterPop">
						否
					</view>
					<view class="confimYes" @click="gotoPatrolDetail()">
						是
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import noDeta from '@/components/nodeta.vue'
	import {
		getUserTaskTodoList,
		queryDict,
		getOrderList,
		getRecordList,
		startXuncha,
		continueXuncha,
		matterPageList,
		getTodo
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
				patrolBox: [],
				allSelect: [],
				tableData: [],
				RecordList: [],
				gotogotoPatrolData: {},
				problemBox: [],
				todoList: [],
				todo_task_type: []

			}
		},
		onShow() {
			// this.queryTodoList()
			this.queryAllDict()
			this.Dict()
			this.getTodoList()
			// this.querygetPageList()
			// this.queryproblem()
			// this.queryTableData()
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
		methods: {
			selectDict(e) {
				if (e) {
					return this.todo_task_type.find(i => i.value == e).label
				} else {

				}


			},

			getTodoList() {
				getTodo().then(res => {
					this.todoList = res.data.data
				})
			},





			queryproblem() {
				matterPageList({
					pageNum: 1,
					pageSize: 1000,
					status: '1',
					statusT: "2"
				}).then(rensphone => {
					if (rensphone.data.code == 200) {
						// this.tableData = []
						// return
						this.problemBox = rensphone.data.rows
					}
				})
			},
			gotoProblem(e) {
				uni.navigateTo({
					url: `/pages/problem/detail?id=${e.id}`
				})
			},
			gotoPatrolDetail() {
				// uni.navigateTo({
				// 	url: '/pages/patrol/patrolDetail'
				// })
				var e = this.gotogotoPatrolData
				console.log(e)
				this.$refs.centerPopup.close()
				if (e.status == '0') {
					startXuncha(`?planId=${e.planId}&module=WAWO`).then(res => {
						console.log(res)
						if (res.data.code == 200) {
							uni.showToast({
								title: '开始巡查',
								duration: 2000,
								iocn: 'none'
							});
							uni.navigateTo({
								url: `/pages/patrol/patrolDetail?name=${e.title}&stm=${e.patrolValidStm}&patrolId=${res.data.data.id}&planId=${e.planId}&taskType=${e.taskType}&taskFrequency=${e.taskFrequency}&hasQr=${e.hasQr}`
							});
						}
					})
				} else if (e.status == '2') {
					continueXuncha(`?patrolId=${e.patrolId}`).then(res => {
						if (res.data.code == 200) {
							uni.showToast({
								title: '继续巡查',
								duration: 2000,
								iocn: 'none'
							});
							uni.navigateTo({
								url: `/pages/patrol/patrolDetail?name=${e.title}&stm=${e.patrolValidStm}&planId=${e.planId}&patrolId=${e.patrolId}&taskType=${e.taskType}&taskFrequency=${e.taskFrequency}&hasQr=${e.hasQr}`
							});
						}
					})
				} else if (e.status == '1') {
					uni.navigateTo({
						url: `/pages/patrol/patrolDetail?name=${e.title}&stm=${e.patrolValidStm}&planId=${e.planId}&patrolId=${e.patrolId}&taskType=${e.taskType}&taskFrequency=${e.taskFrequency}&hasQr=${e.hasQr}`
					});
				}
			},
			closeCenterPop() {
				this.$refs.centerPopup.close()
			},
			Golocation(i) {
				this.$refs.centerPopup.open('center')
				this.gotogotoPatrolData = i
			},
			gotoWorkOrder(i) {
				console.log(i)
				uni.navigateTo({
					url: `/pages/workOrder/workDetail?oderId=${i.orderId}`
				})
			},
			gotoRepair(item) {
				if (item.taskType == '1') { //问题上报
					uni.navigateTo({
						url: `/pages/problem/detail?id=${item.id}`
					})
				} else if (item.taskType == '2') { //工单任务
					uni.navigateTo({
						url: `/pages/workOrder/workDetail?oderId=${item.id}`
					})
				} else if (item.taskType == '3') { //维修养护
					uni.navigateTo({
						url: `/pages/repair/repairDetail?id=${item.id}`
					})
				} else if (item.taskType == '4') { //公众投诉

					console.log(item.status)
					if (item.status == '1' || item.status == '2' || item.status == '3' || item.status == '4') {
						uni.navigateTo({
							url: `/pages/publicComplaint/detail?complaintId=${item.id}`
						})
					} else {
						uni.navigateTo({
							url: `/pages/publicComplaint/Supplementary?complaintId=${item.id}&complaintNum=${item.name}`
						})

					}
				} else { //巡查
					this.$refs.centerPopup.open('center')
					console.log(item.ext)
					this.gotogotoPatrolData = item.ext
				}
			},
			queryTodoList() {

				getUserTaskTodoList().then(res => {
					console.log(res)
					this.patrolBox = res.data.data
				})
			},
			querygetPageList() {
				getOrderList(`?pageNum=1&pageSize=10000&statusList=1,2,3,4`).then(rensphone => {
					console.log(rensphone, 'rensphone')
					if (rensphone.data.code == 200) {
						this.tableData = rensphone.data.rows
					}
				})
			},
			queryTableData() {
				getRecordList(`?pageNum=1&pageSize=10000&statusList=1,2,3,4`).then(
					rensphone => {
						console.log(rensphone, 'rensphone')
						if (rensphone.data.code == 200) {
							this.RecordList = rensphone.data.rows
						}
					})
			},
			filterTask(list, e) {
				console.log(list, e)
				if (list.length !== 0) {
					return list.find(i => i.value == e).label
				} else {
					return
				}
			},
			filterTime(e) {
				return e.substring(0, 10);
			},
			Dict() {
				queryDict(`?dictType=todo_task_type`).then(res => {
					console.log(res, 'sadsadsadsa')
					this.todo_task_type = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})

			},
			async queryAllDict() {
				uni.showLoading({
					title: '加载中'
				});
				this.vloading = false

				await queryDict(`?dictType=patrol_task_frequency_0`).then(res => {
					this.patrol_task_frequency_0 = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})
				await queryDict(`?dictType=patrol_task_frequency_1`).then(res => {
					this.patrol_task_frequency_1 = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})
				await queryDict(`?dictType=patrol_task_frequency_2`).then(res => {
					this.patrol_task_frequency_2 = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})
				await queryDict(`?dictType=patrol_task_frequency_3`).then(res => {
					this.patrol_task_frequency_3 = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})
				await queryDict(`?dictType=patrol_task_frequency_4`).then(res => {
					console.log(res, 'sadsadsadsa')
					this.patrol_task_frequency_4 = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})
				let arr = [];
				let haveMap = {};
				setTimeout(() => {

					if (this.patrol_task_frequency_0) {
						this.patrol_task_frequency_0.forEach(data => {
							if (!haveMap[data.value]) {
								haveMap[data.value] = true;
								arr.push(data);
							}
						});
					}
					if (this.patrol_task_frequency_1) {
						this.patrol_task_frequency_1.forEach(data => {
							if (!haveMap[data.value]) {
								haveMap[data.value] = true;
								arr.push(data);
							}
						});
					}
					if (this.patrol_task_frequency_2) {
						this.patrol_task_frequency_2.forEach(data => {
							if (!haveMap[data.value]) {
								haveMap[data.value] = true;
								arr.push(data);
							}
						});
					}
					if (this.patrol_task_frequency_3) {
						this.patrol_task_frequency_3.forEach(data => {
							if (!haveMap[data.value]) {
								haveMap[data.value] = true;
								arr.push(data);
							}
						});
					}
					if (this.patrol_task_frequency_4) {
						this.patrol_task_frequency_4.forEach(data => {
							if (!haveMap[data.value]) {
								haveMap[data.value] = true;
								arr.push(data);
							}
						});
					}
				}, 300)
				setTimeout(() => {
					this.allSelect = arr
					uni.hideLoading()
					this.vloading = true
				}, 1500)

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
	.boxpage {
		padding: 30rpx 32rpx 0;
		max-height: calc(100vh - 244rpx);
		overflow-y: scroll;

		.newbox {
			width: 676rpx;
			height: 230rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-bottom: 30rpx;

			.topName {
				color: rgba(51, 51, 51, 1);
				padding: 12rpx 0 0 10rpx;
				height: 144rpx;
				font-size: 28rpx;
				font-weight: 600;
				line-height: 32rpx;
				text-align: left;
				position: relative;

				.topName_t {
					display: flex;
					align-items: center;
					font-size: 32rpx;
					font-weight: 400;

				}

				.postab {
					position: absolute;
					left: 0;
					width: 128rpx;
					height: 8rpx;
					bottom: -5rpx;

				}

				.workOrderLogo {
					width: 64rpx;
					height: 64rpx;

				}

				.patrolBtn {
					position: absolute;
					right: 32rpx;
					top: 70rpx;
					width: 128rpx;
					height: 56rpx;
					border-radius: 32rpx;
					text-align: center;
					line-height: 56rpx;
					// color: #0366F1;
					font-weight: 400;
					background-color: #0366F133;
					border: 1rpx solid #0366F11A
				}

				.leftBtn {
					margin-top: 20rpx;
					width: 420rpx;
					white-space: nowrap;
					/* 不换行 */
					overflow: hidden;
					/* 隐藏超出的内容 */
					text-overflow: ellipsis;
					/* 用省略号表示被隐藏的部分 */
					margin-left: 20rpx;
					font-weight: 400;
				}

				.isorange {
					background: #EC940A1A;
					color: #EC940A;
					border: 1rpx solid #EC940A1A;
				}

				.ispurple {
					background: #B34AEB1A;
					border: 1rpx solid #B34AEB1A;
					color: #B34AEB;
				}

				.isblue {
					background: #0366F11A;
					border: 1rpx solid #0366F11A;
					color: #0366F1;
				}

				.isred {
					background: #F439170D;
					border: 1rpx solid #F439170D;
					color: #F43917;
				}
			}

			.lastNmae {
				width: 100%;
				border-top: 2rpx solid rgba(0, 0, 0, 0.05);
				height: 74rpx;
				line-height: 74rpx;
				padding-left: 20rpx;
				color: rgba(153, 153, 153, 1);
				font-size: 24rpx;
			}

		}

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

			.leftSize {
				width: 64rpx;
				height: 64rpx;
				position: absolute;
				right: 64rpx;
				bottom: 48rpx;
			}
		}

		.workOrder {
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



			.rightTop {
				width: 128rpx;
				height: 48rpx;
				font-size: 24rpx;
				color: #fff;
				line-height: 48rpx;
				border-radius: 0px 16rpx 0px 16rpx;
				position: absolute;
				right: 10rpx;
				top: 10rpx;
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

		.maintenanceBox {
			width: 686rpx;
			height: 310rpx;
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
			font-size: 28rpx;
			color: #fff;
			padding: 0 18rpx;
		}

		.isorange {
			background: linear-gradient(228.64deg, rgba(245, 204, 119, 1), rgba(236, 148, 10, 1) 100%);
			color: #EC940A;
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

	.centerPop {
		width: 610rpx;
		height: 374rpx;
		background-image: url('/static/header.png');
		background-repeat: no-repeat;
		background-color: #fff;
		border-radius: 20rpx;
		background-size: 100%;
		padding-top: 24rpx;

		.titleTip {
			text-align: center;
			color: rgba(51, 51, 51, 1);
			font-family: "Microsoft YaHei";
			font-size: 36rpx;
			font-weight: 600;
			line-height: 54rpx;
		}

		.contentTip {
			margin-top: 48rpx;
			padding: 0 39rpx;
			text-align: center;
			color: rgba(51, 51, 51, 1);
			font-family: "Microsoft YaHei";
			font-size: 28rpx;
			font-weight: 500;
			line-height: 56rpx;
		}

		.confimBtnPop {
			display: flex;
			padding: 0 50rpx 0 40rpx;
			margin-top: 34rpx;
			justify-content: space-between;

			.confimNo {
				width: 240rpx;
				height: 80rpx;
				border: 2rpx solid rgba(220, 223, 229, 1);
				text-align: center;
				line-height: 80rpx;
				border-radius: 44rpx;
			}

			.confimYes {
				width: 240rpx;
				height: 80rpx;
				border: 2rpx solid rgba(220, 223, 229, 1);
				color: #fff;
				border-radius: 44rpx;
				background: linear-gradient(112.20deg, rgba(112.28693389892578, 191.46656799316406, 247.03125, 1), rgba(38.70535659790039, 116.93612670898438, 212.87945556640625, 1) 100%);
				text-align: center;
				line-height: 80rpx;
			}
		}

	}
</style>