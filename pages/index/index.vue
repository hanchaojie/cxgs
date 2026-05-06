<template>
	<view class="">
		<view class="content">
			<view class="topBack">
				<view class="title">
					缙云县域供水掌上管控平台
				</view>
				<view class="titlePng">
					<view class="disflex">
						<view class="">
							<view class="">
								<view class="blueTxt">
									{{indexData.wawoNum?indexData.wawoNum:'--'}} <text class="unit">个</text>
								</view>
								<view class="">
									管理厂（站）
								</view>
							</view>
							<view class="">
								<view class="blueTxt">
									{{indexData.waterQualityRate?indexData.waterQualityRate:'--'}} <text
										class="unit">%</text>
								</view>
								<view class="">
									水质达标率
								</view>
							</view>
						</view>
						<view class="">
							<view class="">
								<view class="blueTxt">
									{{indexData.onlineRate?indexData.onlineRate:'--'}}<text class="unit">%</text>
								</view>
								<view class="">
									厂（站）在线率
								</view>
							</view>
							<view class="">
								<view class="blueTxt">
									{{indexData.yw20?indexData.yw20:'--'}} <text class="unit">%</text>
								</view>
								<view class="">
									水池液位＞20%
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="todoWarn">
			<view class="todoWarnL" @click="gotoTodo">
				<image style="width: 72rpx; height: 62rpx;position: absolute;right: 40rpx;top: 50rpx;"
					src="/static/todoWarnL.png"></image>
				<view class=""
					style="display: flex;flex-direction: column;height: 96rpx;justify-content: space-between;">
					<view class="dbTxt">待办事项</view>
					<view class="numberTxt">{{todoNum?todoNum:'0'}}</view>
				</view>
			</view>
			<view class="todoWarnR" @click="gotoeveryWarning">
				<image style="width: 72rpx; height: 64rpx;position: absolute;right: 40rpx;top: 48rpx;"
					src="/static/todoWarnR.png"></image>
				<view class=""
					style="display: flex;flex-direction: column;height: 96rpx;justify-content: space-between;">
					<view class="yjTxt">预警通知</view>
					<view class="numberTxt">{{warnSensorWarn?warnSensorWarn:'0'}}</view>
				</view>
			</view>
		</view>
		<view class="coreArea">
			<view class="title">
				常用功能
			</view>
			<view class="boxBorder">
				<view class="flexBox" @click="gotoMap" v-if="!isAdministrator">
					<image src="/static/map.png" class="imageSize" mode=""></image>
					<view class="name">
						掌上一张图
					</view>
				</view>
				<view class="flexBox" @click="patrol">
					<image src="/static/patrol.png" class="imageSize" mode=""></image>
					<view class="name">
						巡查检查
					</view>
				</view>
				<view class="flexBox" @click="gotoMonitor">
					<image src="/static/monitor.png" class="imageSize" mode=""></image>
					<view class="name">
						监测管理
					</view>
				</view>
				<view class="flexBox" @click="gotoMonitoring" v-if="!isAdministrator">
					<image src="/static/craft.png" class="imageSize" mode=""></image>
					<view class="name">
						工艺监控
					</view>
				</view>
				<view class="flexBox" @click="gotoProblem">
					<image src="/static/problem.png" class="imageSize" mode=""></image>
					<view class="name">
						问题上报
					</view>
				</view>
				<view class="flexBox" @click="gotoRepair">
					<image src="/static/maintenance.png" class="imageSize" mode=""></image>
					<view class="name">
						维修养护
					</view>
				</view>
				<view class="flexBox" @click="gotoWaterQualityReport" v-if="!isAdministrator">
					<image src="/static/water.png" class="imageSize" mode=""></image>
					<view class="name">
						采样上报
					</view>
				</view>
				<view class="flexBox" @click="gotoworkOrder">
					<image src="/static/workOrder.png" class="imageSize" mode=""></image>
					<view class="name">
						工单记录
					</view>
				</view>
				<view class="flexBox" @click="gotopublicComplaint" v-if="!isAdministrator">
					<image src="/static/complaint.png" class="imageSize" mode=""></image>
					<view class="colordot" v-if="tableLength>0">
						{{tableLength}}
					</view>
					<view class="name">
						公众投诉
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		overviewCountMobile,
		getComplaintlist,
		getwarnSensorWarning,
		getUserTaskTodoList,
		getOrderList,
		getRecordList,
		getLastVersion,
		matterPageList,
		getTodo
	} from '@/units/request.js'
	import {
		selectRole
	} from '../../units/units.js';
	export default {
		data() {
			return {
				indexData: {
					wawoNum: null,
					waterQualityRate: null,
					onlineRate: null,
					yw20: null
				},
				isAdministrator: null,
				tableLength: 0,
				warnSensorWarn: 0,
				todoNum: 0
			}
		},
		mounted() {},
		onShow() {
			this.isAdministrator = selectRole(['clerk_role'], uni
				.getStorageSync('getInfo').roles)
			this.queryTableData()
			this.warnSensorWarnLength()
			this.geialltoDOnum()
			this.queryComplaintTableData()
			this.getoverviewCountMobile()
			const systemInfo = uni.getSystemInfoSync();
			// 应用程序版本号
			// #ifdef APP
			uni.setStorageSync('version', systemInfo.appWgtVersion)
			// #endif
			// #ifdef H5
			// me.version = systemInfo.appVersion;
			uni.setStorageSync('version', systemInfo.appVersion)
			// #endif
			console.log(systemInfo)

			console.log(this.isAdministrator, 'this.isAdministrator ')
			this.getdictList()
		},
		methods: {
			getdictList() {
				// #ifdef APP
				getLastVersion().then(restwo => {
					console.log(restwo.data.data.versionCode)
					console.log(uni.getStorageSync('version'))

					if (restwo.data.data.versionCode > uni.getStorageSync('version')) {
						// if(restwo.data.data.)
						console.log(restwo)
						console.log('/pages/index/upgrade?versionName=' + restwo.data.data.versionCode +
							'&isForce=' + restwo.data.data.isForce + '&slogan=' + restwo.data.data
							.slogan + '&url=' + restwo.data.data.apkUrl)
						uni.navigateTo({
							url: '/pages/index/upgrade?versionName=' + restwo.data.data.versionCode +
								'&isForce=' + restwo.data.data.isForce + '&slogan=' + restwo.data.data
								.slogan + '&url=' + restwo.data.data.apkUrl
						})
					} else {

					}
				})
				// #endif
			},
			warnSensorWarnLength() {
				getwarnSensorWarning(`?pageNum=1&pageSize=100000&isGetReadStatus=1&isRead=0`).then(rensphone => {
					if (rensphone.data.code == 200) {
						console.log(rensphone)
						this.warnSensorWarn = rensphone.data.total
					}
				})
			},
			getoverviewCountMobile() {
				overviewCountMobile().then(res => {
					console.log(res)
					this.indexData = res.data.data
				})
			},
			gotoeveryWarning() {
				uni.navigateTo({
					url: '/pages/earlyWarning/index',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			gotoMap() {
				uni.navigateTo({
					url: '/pages/map/map',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			patrol() {
				uni.navigateTo({
					url: '/pages/patrol/index',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			gotoMonitor() {
				uni.navigateTo({
					url: '/pages/monitor/index',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			gotoWaterQualityReport() {
				uni.navigateTo({
					url: '/pages/waterQualityReport/index',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			gotoworkOrder() {
				uni.navigateTo({
					url: '/pages/workOrder/index',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			gotoMonitoring() {
				uni.navigateTo({
					url: '/pages/processMonitoring/index',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			gotopublicComplaint() {
				uni.navigateTo({
					url: '/pages/publicComplaint/index',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			gotoProblem() {
				uni.navigateTo({
					url: '/pages/problem/index',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			gotoRepair() {
				uni.navigateTo({
					url: '/pages/repair/index',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			queryComplaintTableData() {
				getComplaintlist(`?pageNum=1&pageSize=10000&status=0`).then(rensphone => {
					if (rensphone.data.code == 200) {
						this.tableLength = rensphone.data.total


					}
				})
			},
			gotoTodo() {
				uni.navigateTo({
					url: '/pages/toDoList/index',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
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
			geialltoDOnum() {
				getTodo().then(res => {
					console.log(res, 'daiban')
					this.todoNum = res.data.data.length
				})
				return
				const p1 = getOrderList(`?pageNum=1&pageSize=10000&statusList=1,2,3,4`).then(rensphone => {
					// console.log(rensphone, 'rensphone')
					return rensphone.data.total
				})
				const p2 = getUserTaskTodoList().then(rensphone => {
					// console.log(rensphone, 'rensphone')
					return rensphone.data.data.length
				})
				const p3 = getRecordList(`?pageNum=1&pageSize=10000&statusList=1,2,3,4`).then(
					rensphone => {
						// console.log(rensphone, 'rensphone')
						return rensphone.data.total
					})
				const p4 = matterPageList({
					pageNum: 1,
					pageSize: 1000,
					status: '1',
					statusT: "2"
				}).then(
					rensphone => {
						// console.log(rensphone, 'rensphone')
						return rensphone.data.total
					})
				Promise.all([p1, p2, p3, p4]).then((values) => {
					console.log(values); // [3, 42, "foo"]
					this.todoNum = values.reduce((acc, curr) => acc + curr, 0)
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #f3f5f9;
	}
</style>
<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.topBack {
			width: 100%;
			height: 520rpx;
			background-image: url('/static/mengban.png');
			background-size: 100%;
			position: relative;

			.title {
				font-family: 'Microsoft YaHei';
				color: rgba(51, 51, 51, 1);
				font-size: 16px;
				font-weight: 600;
				line-height: 24px;
				letter-spacing: 0px;
				text-align: left;
				position: absolute;
				left: 30rpx;
				top: 100rpx;
				transform: skewX(-10deg);
				/* 倾斜10度 */
			}

			.titlePng {
				width: 524rpx;
				height: 258rpx;
				background-image: url('/static/titlePng.png');
				background-size: 100%;
				position: absolute;
				left: 30rpx;
				bottom: 32rpx;
				padding-left: 80rpx;
				padding-top: 62rpx;
				padding-right: 86rpx;

				.disflex {
					display: flex;
					justify-content: space-between;

					.blueTxt {
						color: rgba(20, 149, 255, 1);
						font-family: PingFang SC;
						font-size: 40rpx;
						font-weight: 600;
						line-height: 72rpx;
						letter-spacing: 0px;
						text-align: left;

						.unit {
							color: rgba(20, 149, 255, 0.5);
							font-family: PingFang SC;
							font-size: 28rpx;
							font-weight: 500;
							line-height: 72rpx;
							letter-spacing: 0px;
							text-align: left;
						}
					}
				}
			}
		}
	}

	.todoWarn {






		padding: 0 32rpx;
		height: 160rpx;
		display: flex;
		justify-content: space-between;
		margin-top: 26rpx;

		.todoWarnL {
			width: 296rpx;
			height: 128rpx;
			padding-left: 32rpx;
			padding-top: 32rpx;
			position: relative;
			border-radius: 16rpx;
			box-shadow: 0px 0px 8rpx 0rpx rgba(190, 190, 190, 0.25);
			background: linear-gradient(to bottom, #AAD1FB, #F4F6FA);

			.dbTxt {
				color: rgba(51, 51, 51, 1);
				font-family: 'Microsoft YaHei';
				font-size: 32rpx;
				font-weight: 700;
				letter-spacing: 0%;
				text-align: left;
			}

			.numberTxt {
				color: rgba(51, 51, 51, 1);
				font-family: 'Microsoft YaHei';
				font-size: 36rpx;
				font-weight: 500;
				letter-spacing: 0%;
				text-align: left;
			}


			/* 	// background-image: url('/static/todoWarnL.png');
			// background-size: 100%;
			// box-shadow: 0px 0px 8rpx 8rpx rgba(190, 190, 190, 0.25); */
		}

		.todoWarnR {
			width: 296rpx;
			height: 128rpx;
			padding-left: 32rpx;
			padding-top: 32rpx;
			position: relative;
			border-radius: 16rpx;
			box-shadow: 0px 0px 8rpx 0rpx rgba(190, 190, 190, 0.25);
			background: linear-gradient(to bottom, #F7E7C7, #F4F6FA);

			.yjTxt {
				color: rgba(51, 51, 51, 1);
				font-family: 'Microsoft YaHei';
				font-size: 32rpx;
				font-weight: 700;
				letter-spacing: 0%;
				text-align: left;
			}

			.numberTxt {
				color: rgba(51, 51, 51, 1);
				font-family: 'Microsoft YaHei';
				font-size: 36rpx;
				font-weight: 500;
				letter-spacing: 0%;
				text-align: left;
			}

			// background-image: url('/static/todoWarnR.png');
			// background-size: 100%;
			// box-shadow: 0px 0px 8rpx 8rpx rgba(190, 190, 190, 0.25);
		}
	}

	.coreArea {
		margin-left: 30rpx;
		margin-top: 32rpx;
		width: 686rpx;
		height: 600rpx;
		border-radius: 20rpx;
		box-shadow: 0px 0px 8rpx 0px rgba(190, 190, 190, 0.25);
		/* background: rgba(233, 242, 255, 1); */
		background: #fff;
		position: relative;

		.whitePng {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;

		}

		.more {
			position: absolute;
			right: 32rpx;
			top: 14rpx;
			color: rgba(101, 146, 212, 1);
			font-family: "Microsoft YaHei";
			font-size: 24rpx;
			font-weight: 500;
			text-align: center;
		}

		.title {
			color: rgba(51, 51, 51, 1);
			font-family: "Microsoft YaHei";
			font-size: 36rpx;
			font-weight: 600;
			letter-spacing: 0px;
			text-align: left;
			position: absolute;
			left: 34rpx;
			top: 32rpx;
		}

		.boxBorder {
			display: flex;
			flex-wrap: wrap;
			position: absolute;
			top: 130rpx;
			width: 646rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			justify-content: space-between;

			.flexBox {
				width: 144rpx;
				height: 122rpx;
				margin-bottom: 32rpx;
				position: relative;

				.imageSize {
					width: 80rpx;
					height: 80rpx;
					margin: 0 auto;
					display: block;
				}



				.name {
					color: rgba(51, 51, 51, 1);
					font-family: "Microsoft YaHei";
					font-size: 28rpx;
					font-weight: 500;
					text-align: center;
				}

				.colordot {
					width: 32rpx;
					height: 32rpx;
					background: #FF4545;
					border-radius: 50%;
					color: #fff;
					font-size: 24rpx;
					text-align: center;
					line-height: 32rpx;
					position: absolute;
					top: 0;
					right: 30rpx;
				}
			}

		}
	}
</style>