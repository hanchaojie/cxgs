<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='预警信息'></head-nav>
		<view style="height: 176rpx;">
		</view>
		<view class="reportBox">
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					供水厂站
				</view>
				<view class="reportLine_R">
					{{infoDetail.wawoName}}
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					测点名称
				</view>
				<view class="reportLine_R">
					<!-- <input type="text" v-model="infoDetail.sensorName" value="" /> -->
					{{infoDetail.sensorName}}
				</view>
			</view>
			<view class="reportLine" v-if="Dict.length >0">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					预警类型
				</view>
				<view class="reportLine_R">
					<view class="" v-for="item in Dict">
						<view class="" v-if="item.value == infoDetail.warnType">
							{{item.label}}
						</view>
						<!-- 		<view v-if="detailInfo.lev == '1'">
							Ⅰ级
						</view>
						<view v-else-if="detailInfo.lev == '2'">
							Ⅱ级
						</view>
						<view v-else-if="detailInfo.lev == '3'">
							Ⅲ级
						</view> -->
					</view>
				</view>
			</view>
			<view class="reportLine" style="margin-bottom: 0rpx;">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					预警内容
				</view>
				<view class="reportLine_R">
				</view>
			</view>
			<textarea style="color: #333;" disabled class="textareaBox" name="" id="" placeholder="请输入工单描述"
				v-model="infoDetail.context"></textarea>
		</view>
		<view class="reportBox">
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					预警开始时间
				</view>
				<view class="reportLine_R" style="display: flex;">
					{{infoDetail.startTime}}
				</view>
			</view>
			<view class="reportLine" style="margin-bottom: 17rpx;">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					预警结束时间
				</view>
				<view class="reportLine_R" style="display: flex;">
					{{infoDetail.endTime}}
				</view>
			</view>
		</view>
		<view class="disBtns">
			<view v-if="!isShowBtn" style="width: 100%;">
				<view :class="infoDetail.endTime !==null ? 'unreject' : 'reject'" @click="reject">
					解除预警
				</view>
			</view>
			<view v-else style="width: 320rpx">
				<view :class="infoDetail.endTime !==null ? 'unreject' : 'reject'" @click="reject">
					解除预警
				</view>
			</view>
			<view class="pass" @click="pass" v-if="isShowBtn">
				发起工单
			</view>
		</view>
		<uni-popup ref="centerPopup" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					是否解除当前预警?
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
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		getwarnSupervisionId,
		queryDict,
		putSensorWarning
	} from '@/units/request.js'
	import {
		selectRole
	} from '../../units/units.js'
	import {
		dayjs
	} from '../../uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js'
	export default {
		components: {
			HeadNav
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				supervisionId: '',
				infoDetail: {},
				Dict: [],
				isShowBtn: false,
			}
		},
		onShow() {
			this.isShowBtn = selectRole(['GL', 'patrol_audit_role', 'area_manager'], uni.getStorageSync('getInfo').roles)
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
			this.getqueryDict()
			this.getDetail(this.supervisionId)

		},
		onLoad(e) {
			this.supervisionId = e.supervisionId

		},
		// 定义局部过滤器
		filters: {
			filtersType(value) {
				console.log(value)
				return this.Dict.find(item => item.value == value).label
			}
		},
		methods: {
			getqueryDict() {
				queryDict(`?dictType=warn_sensor_warn_type`).then(Response => {
					console.log(Response)
					this.Dict = Response.data.rows.map(e => {
						return {
							value: e.dictValue,
							label: e.dictLabel
						}
					})
					console.log(this.Dict)
				})
			},
			getDetail(e) {
				getwarnSupervisionId(e).then(res => {
					this.infoDetail = res.data.data
				})
			},
			reject() {
				if (this.infoDetail.endTime) {
					return
				}
				this.$refs.centerPopup.open('center')
			},
			closeCenterPop() {
				this.$refs.centerPopup.close()
			},
			gotoPatrolDetail() {
				let a = {
					"id": this.infoDetail.id,
					"sensorId": this.infoDetail.sensorId,
					"warnStatus": 3,
					"endTime": dayjs().format('YYYY-MM-DD HH:mm:ss')
				}
				putSensorWarning(a).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.$refs.centerPopup.close()
						this.getDetail(this.supervisionId)

					}
				})
			},
			pass() {
				if (this.infoDetail.endTime) {
					uni.$u.toast('当前预警已经终止');
					return
				}
				uni.navigateTo({
					url: `/pages/earlyWarning/addEarlyOrder?supervisionId=${this.supervisionId}`
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
	.reportBox {
		width: 630rpx;
		height: auto;
		margin-left: 32rpx;
		margin-top: 22rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 28rpx 32rpx 20rpx 24rpx;

		.reportLine {
			display: flex;
			justify-content: space-between;
			margin-bottom: 32rpx;

			.reportLine_L {
				font-size: 32rpx;
				// color: rgba(86, 86, 86, 1);
				color: #333;
				font-family: "Microsoft YaHei";
				line-height: 48rpx;
			}

			.reportLine_R {
				// color: rgba(153, 153, 153, 1);
				font-family: "Microsoft YaHei";
				font-size: 32rpx;
				color: #333;
				line-height: 48rpx;
				width: 400rpx;
				overflow: hidden; //超出的文本隐藏
				text-overflow: ellipsis; //溢出用省略号显示
				white-space: nowrap; // 默认不换行；
				text-align: right;

				input {
					text-align: right;
					font-size: 28rpx;
					font-family: "Microsoft YaHei";
					color: rgba(51, 51, 51, 1);
				}
			}
		}

		.textareaBox {
			background: rgba(244, 245, 249, 1);
			border-radius: 12rpx;
			height: 132rpx;
			padding: 14rpx 16rpx;
			color: rgba(153, 153, 153, 1);
			font-family: "Microsoft YaHei";
			font-size: 32rpx;
		}
	}

	.disBtns {
		padding: 0 32rpx;
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
		width: 686rpx;
		position: fixed;
		bottom: 60rpx;

		.reject {
			// width: 320rpx;
			width: 100%;
			height: 88rpx;
			background: #fff;
			border-radius: 16rpx;
			text-align: center;
			line-height: 88rpx;
		}

		.unreject {
			// width: 320rpx;
			width: 100%;
			height: 88rpx;
			background: #fff;
			color: rgba(153, 153, 153, 1);
			border-radius: 16rpx;
			text-align: center;
			line-height: 88rpx;
		}

		.pass {
			width: 320rpx;
			height: 88rpx;
			background: #0366F1;
			border-radius: 16rpx;
			text-align: center;
			line-height: 88rpx;
			color: #fff;
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
			margin-top: 64rpx;
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