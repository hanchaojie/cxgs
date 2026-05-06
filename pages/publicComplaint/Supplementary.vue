<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='补充登记'></head-nav>
		<view style="height: 176rpx;">

		</view>
		<view class="reportBox">
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					投诉号码
				</view>
				<view class="reportLine_R">
					{{complaint.complaintNum}}
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					真实姓名
				</view>
				<view class="reportLine_R">
					<input type="text" v-model="complaint.realName" value="" placeholder="请输入" />
				</view>
			</view>
			<view class="reportLine" @click="selecTown">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					所在乡镇
				</view>
				<view class="reportLine_R">
					<view class="reportLine_R">
						{{ addvcd}}
						<uni-icons type="right" size="16" color="#999999"></uni-icons>
					</view>
				</view>
			</view>
			<view class="reportLine" @click="problemSelect">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					问题类型
				</view>
				<view class="reportLine_R">
					<view class="reportLine_R">
						{{ problemType}}
						<uni-icons type="right" size="16" color="#999999"></uni-icons>
					</view>
				</view>
			</view>

			<view class="reportLine" @click="projectSelect">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					相关供水站
				</view>
				<view class="reportLine_R">
					<view class="reportLine_R">
						{{ projectName}}
						<uni-icons type="right" size="16" color="#999999"></uni-icons>
					</view>
				</view>
			</view>
			<view class="reportLine" style="margin-bottom: 0rpx;">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					问题描述
				</view>
				<view class="reportLine_R">
				</view>
			</view>
			<textarea class="textareaBox" name="" id="" placeholder="请输入描述" v-model="complaint.remark"></textarea>
		</view>
		<view class="reportBox">
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					登记人
				</view>
				<view class="reportLine_R" style="display: flex;">
					{{nickName}}
				</view>
			</view>
			<view class="reportLine" style="margin-bottom: 0rpx;" @click="timeSelect">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					投诉时间
				</view>
				<view class="reportLine_R" style="display: flex;">
					{{complaint.reportTime}}
					<u-icon name="clock" style="margin-left: 10rpx;"></u-icon>
				</view>
			</view>
		</view>
		<view class="disBtns">
			<view class="reject" @click="reject">
				删除记录
			</view>
			<view class="pass" @click="pass">
				提交
			</view>
		</view>
		<uni-popup ref="centerPopup" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					是否删除投诉记录?
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

		<u-picker :show="townShow" closeOnClickOverlay :columns="townColumns" @confirm="townConfirm" @close="townClose"
			@cancel="townClose"></u-picker>
		<u-picker :show="problemShow" closeOnClickOverlay :columns="problemColumns" @confirm="problemConfirm"
			@close="problemClose" @cancel="problemClose"></u-picker>
		<u-picker :show="projectShow" closeOnClickOverlay :columns="projectColumns" @confirm="projectConfirm"
			@close="projectClose" @cancel="projectClose"></u-picker>
		<u-datetime-picker :show="Timeshow" v-model="nowTime" mode="datetime" @confirm="confirmTime" closeOnClickOverlay
			@close="closeTime"></u-datetime-picker>

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
		putSensorWarning,
		getaddvcdList,
		getAttWawoBaseList,
		getcomplaintId,
		putComplaint,
		deleteComplaint
	} from '@/units/request.js'
	import {
		dayjs
	} from '../../uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js'


	// 手机号正则
	const phoneReg = /^1[3-9]\d{9}$/

	// 座机号正则（去除空格横线后判断是否符合固定电话结构）
	const landlineReg = /^0\d{2,3}\d{7,8}$/
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
				complaint: {},
				nickName: uni.getStorageSync('getInfo').user.nickName,
				nowTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
				townShow: false,
				problemShow: false,
				projectShow: false,
				complaintId: '',
				complaintNum: '',
				realName: '',
				problemType: "",
				projectName: '',
				addvcd: '',
				emergency_event_code: [{
						value: "1",
						label: "水质投诉",
					},
					{
						value: "2",
						label: "水费投诉",
					},
					{
						value: "3",
						label: "水量投诉",
					},
					{
						value: "9",
						label: "其他投诉"
					},
				],
				alladdvcd: [],
				allWawoBaseList: [],
				townColumns: [],
				problemColumns: [
					[
						'水质投诉', '水费投诉', '水量投诉', '其他投诉'
					]
				],
				projectColumns: [],
				Timeshow: false,


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
			// this.getqueryDict()
			// this.getDetail(this.supervisionId)
			this.addvcdList()
			this.AttWawoBaseList()

		},
		onLoad(e) {
			this.complaintId = e.complaintId
			this.complaintNum = e.complaintNum
			this.querygetcomplaintId(e.complaintId)


		},
		// 定义局部过滤器
		filters: {
			filtersType(value) {
				console.log(value)
				return this.Dict.find(item => item.value == value).label
			}
		},
		methods: {
			querygetcomplaintId(e) {
				getcomplaintId(e).then(res => {
					console.log(res)
					this.complaint = res.data.data
				})
			},
			addvcdList() {
				getaddvcdList(`?level=4`).then(res => {
					this.alladdvcd = res.data.rows
					this.townColumns = [res.data.rows.map(e => {
						return e.addvm
					})]
				})
			},
			AttWawoBaseList() {
				getAttWawoBaseList().then(res => {
					this.allWawoBaseList = res.data.rows
					this.projectColumns = [res.data.rows.map(e => {
						return e.wawoName
					})]
				})
			},
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

				deleteComplaint(this.complaintId).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.$refs.centerPopup.close()
					uni.navigateBack()

					}
				})
			},
			pass() {
				// complaint.realName
				// this.addvcd
				// this.problemType 
				// this.projectName
				// 去除输入中的空格和横线以便统一处理
				const cleanValue = this.complaint.complaintNum.replace(/[- ]/g, '')
				console.log(this.addvcd)
				console.log(this.problemType)
				console.log(this.projectName)
				if (this.complaint.complaintNum == '' || this.complaint.complaintNum == null) {
					uni.$u.toast('投诉号码不能为空');
					return
				} else {
					if (!phoneReg.test(cleanValue) && !landlineReg.test(cleanValue)) {
						uni.$u.toast('输入正确的号码');
						return
					}
				}
				if (this.complaint.realName == '' || this.complaint.realName == null) {
					uni.$u.toast('真实姓名不能为空');
					return
				}
				if (this.addvcd == '') {
					uni.$u.toast('请选择乡镇');
					return
				}
				if (this.problemType == '') {
					uni.$u.toast('请选择问题类型');
					return
				}
				if (this.projectName == '') {
					uni.$u.toast('请选择供水站');
					return
				}
				if (this.complaint.remark == '' || this.complaint.remark == null) {
					uni.$u.toast('请输入描述');
					return
				}
				if (this.complaint.reportTime == '' || this.complaint.reportTime == null) {
					uni.$u.toast('请选择投诉时间');
					return
				}


				console.log(this.alladdvcd)
				this.complaint.addvcd = this.alladdvcd.find(e => e.addvm == this.addvcd).addvcd
				this.complaint.orderType = this.emergency_event_code.find(e => e.label == this.problemType).value
				this.complaint.projectId = this.allWawoBaseList.find(e => e.wawoName == this.projectName).wawoCode
				console.log(this.complaint)
				this.complaint.status = '1';
				putComplaint(this.complaint).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						uni.$u.toast('补充登记完成');
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/publicComplaint/index'
							})
						}, 1500)
					}
				})
				// uni.navigateTo({
				// 	url: '/pages/earlyWarning/addEarlyOrder'
				// })

			},
			confirmTime(e) {
				console.log(e)
				this.complaint.reportTime = dayjs(e.value).format('YYYY-MM-DD HH:mm:ss');
				this.Timeshow = false
				// this.
			},
			closeTime() {
				this.Timeshow = false
			},
			selecTown() {
				// this.$refs.centerPopup.open('bottom')
				this.townShow = true
			},
			townClose() {
				this.townShow = false
			},
			townConfirm(e) {
				console.log(e)
				this.addvcd = e.value[0]
				this.townShow = false
			},
			problemSelect() {
				this.problemShow = true
			},
			problemClose() {
				this.problemShow = false
			},
			timeSelect() {
				this.Timeshow = true
			},
			problemConfirm(e) {
				this.problemType = e.value[0]
				this.problemShow = false
			},
			projectSelect() {
				this.projectShow = true
			},
			projectConfirm(e) {
				this.projectName = e.value[0]
				this.projectShow = false
			},
			projectClose() {
				this.projectShow = false
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
			color: rgba(86, 86, 86, 1);
			font-family: "Microsoft YaHei";
			color: #565656;
			line-height: 48rpx;
		}
	
		.reportLine_R {
			// color: rgba(153, 153, 153, 1);
			font-family: "Microsoft YaHei";
			font-size: 32rpx;
			line-height: 48rpx;
			color: #333;
	
			input {
				text-align: right;
				font-size: 32rpx;
				font-family: "Microsoft YaHei";
				color: #333;
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
			font-size: 28rpx;
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
			width: 320rpx;
			height: 88rpx;
			background: #fff;
			border-radius: 16rpx;
			text-align: center;
			line-height: 88rpx;
		}

		.unreject {
			width: 320rpx;
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