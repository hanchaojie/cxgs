<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='工单详情'></head-nav>
		<view style="height: 176rpx;">
		</view>
		<view class="topDisplay">
			<view class="leftDis" @click="checkNumBtn(1)">
				<image :src="checkNum == 1 ? '/static/process.png' : '/static/unProcess.png'" class=" patrolSize"
					mode=""></image>
				<view :class="checkNum == 1 ?'blueTxt':'whiteTxt'">
					工单详情
				</view>
			</view>
			<view class="rightDis" @click="checkNumBtn(2)">
				<image :src="checkNum==2 ? '/static/Details.png' : '/static/unDetails.png'" class=" patrolSize" mode="">
				</image>
				<view :class="checkNum == 2 ?'blueTxt':'whiteTxt'">
					处理流程
				</view>
			</view>
		</view>

		<scroll-view scroll-y="true" class="scrollY" v-if="checkNum == 1">
			<!-- 		<view class="titleType">
				<view class="titleType_L">
					工单信息
				</view>
				<view class="titleType_R isorange" v-if="detailInfo.status == 1">待接收</view>
				<view class="titleType_R ispurple" v-if="detailInfo.status == 2">待处理</view>
				<view class="titleType_R isblue" v-if="detailInfo.status == 3">待审核</view>
				<view class="titleType_R isred" v-if="detailInfo.status == 4">已驳回</view>
				<view class="titleType_R isblue" v-if="detailInfo.status == 5">已审核</view>
			</view> -->
			<view class="reportBox">
				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: red;">*</text>
						供水厂站
					</view>
					<view class="reportLine_R">
						{{detailInfo.wawoName}}

					</view>
				</view>
				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: red;">*</text>
						工单类型
					</view>
					<view class="reportLine_R">
						<!-- <input type="text" v-model="detailInfo.orderName" value="" /> -->
						{{detailInfo.orderType | filterOrder}}
					</view>
				</view>
				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: red;">*</text>
						优先级
					</view>
					<view class="reportLine_R">
						<view class="reportLine_R">
							<view v-if="detailInfo.lev == '1'">
								Ⅰ级
							</view>
							<view v-else-if="detailInfo.lev == '2'">
								Ⅱ级
							</view>
							<view v-else-if="detailInfo.lev == '3'">
								Ⅲ级
							</view>
						</view>
					</view>
				</view>
				<view class="reportLine" style="margin-bottom: 0rpx;">
					<view class="reportLine_L">
						<text style="color: red;">*</text>
						工单描述
					</view>
					<view class="reportLine_R">

					</view>
				</view>
				<textarea disabled class="textareaBox" name="" id="" placeholder="请输入工单描述"
					style="color: #333;margin-bottom: 16rpx;" v-model="detailInfo.remark"></textarea>
				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: transparent;">*</text>
						图片
					</view>
					<view class="reportLine_R" style="display: flex;">
						<!-- 	<image :src="item.url" mode="" v-for="item in detailInfo.picFileList"
						style="width: 48rpx;height: 48rpx;">
					</image> -->
					</view>
				</view>

				<view class="" style="margin-bottom: 20rpx;">
					<image v-for="item in detailInfo.picFileList" :src="item.url" mode=""
						style="width: 128rpx;height: 108rpx;margin-right: 10rpx;" @click="previewImage(item.url)">
					</image>
				</view>
				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: transparent;">*</text>
						视频
					</view>
					<view class="reportLine_R" style="display: flex;">
						<!-- 	<image :src="item.url" mode="" v-for="item in detailInfo.picFileList"
						style="width: 48rpx;height: 48rpx;">
					</image> -->
					</view>
				</view>
				<view class="">
					<DomVideoPlayer ref="domVideoPlayer" style="height: 400rpx;" :src="detailInfo.videoFileList[0].url"
						loop controls muted
						v-if="detailInfo.videoFileList && detailInfo.videoFileList.length&&detailInfo.videoFileList[0].url">
					</DomVideoPlayer>
				</view>
				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: red;">*</text>
						计划完成时间
					</view>
					<view class="reportLine_R" style="display: flex;">
						{{detailInfo.finishTime | futtilvalue1}}
					</view>
				</view>
				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: red;">*</text>
						指派处理人
					</view>
					<view class="reportLine_R" style="display: flex;">
						{{detailInfo.treaterName}}
					</view>
				</view>
				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: transparent;">*</text>
						任务下达人
					</view>
					<view class="reportLine_R">
						{{detailInfo.reporterName}}
						<!-- testStatus -->
					</view>
				</view>
				<view class="reportLine">

					<view class="reportLine_L">
						<text style="color: transparent;">*</text>
						任务下达时间
					</view>
					<view class="reportLine_R">
						{{detailInfo.reportTime | futtilvalue1}}
					</view>
				</view>
			</view>
			<view class="reportBox" v-if="detailInfo.status == '3'||detailInfo.status == '5'">
				<view class="topName" style="font-size: 32rpx;">
					工单处理信息
					<image src="/static/barCode.png" mode="" class="postab"></image>
				</view>
				<view class="reportLine" style="margin-top: 20rpx;margin-bottom: 0;">
					<view class="reportLine_L">
						<text style="color: red;">*</text>
						处理结果
					</view>
					<view class="reportLine_R">

					</view>
				</view>
				<textarea disabled class="textareaBox" name="" id="" placeholder="请输入工单描述"
					style="color: #333;margin-bottom: 16rpx;" v-model="contentDate.remark"></textarea>

				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: transparent;">*</text>
						处理图片
					</view>
					<view class="reportLine_R" style="display: flex;">
						<!-- 	<image :src="item.url" mode="" v-for="item in detailInfo.picFileList"
							style="width: 48rpx;height: 48rpx;">
						</image> -->
					</view>
				</view>

				<view class="" style="margin-bottom: 20rpx;">
					<image v-for="item in contentDate.picFileList" :src="item.url" mode=""
						style="width: 128rpx;height: 108rpx;margin-right: 10rpx;" @click="previewImage(item.url)">
					</image>
				</view>
				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: transparent;">*</text>
						处理视频
					</view>
					<view class="reportLine_R" style="display: flex;">
						<!-- 	<image :src="item.url" mode="" v-for="item in detailInfo.picFileList"
						style="width: 48rpx;height: 48rpx;">
					</image> -->
					</view>
				</view>
				<view class="">
					<DomVideoPlayer ref="domVideoPlayer" style="height: 400rpx;" :src="contentDate.videoFileList[0].url"
						loop controls muted
						v-if="contentDate.videoFileList && contentDate.videoFileList.length&&contentDate.videoFileList[0].url">
					</DomVideoPlayer>
				</view>

				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: red;">*</text>
						处理完成时间
					</view>
					<view class="reportLine_R" style="display: flex;">
						{{contentDate.actionTime | futtilvalue1}}
					</view>
				</view>

				<view class="reportLine">
					<view class="reportLine_L">
						<text style="color: red;">*</text>
						处理人员
					</view>
					<view class="reportLine_R" style="display: flex;">
						{{contentDate.actionUserName}}
					</view>
				</view>


			</view>

			<!-- 		<view class="blueBtn" @click="blueBtn" v-if="detailInfo.status == '1'">
				接收
			</view> -->
			<!-- 	<view class="blueBtn" @click="receive"
				v-if="(detailInfo.status == '2' || detailInfo.status == '4') && !isProcess">
				上报处理结果
			</view> -->
			<!-- 	<view class="blueBtn" @click="submit"
				v-if="(detailInfo.status == '2' ||detailInfo.status == '4' )&& isProcess">
				提交审核
			</view> -->
			<!-- 		<view class="disBtns" v-if="detailInfo.status == '3' && !isProcess">
				<view class="reject" @click="reject">
					驳回
				</view>
				<view class="pass" @click="pass">
					通过
				</view>
			</view> -->
		</scroll-view>
		<zfl-logistics :list="list" v-else></zfl-logistics>
		<uni-popup ref="centerPopup" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					{{message}}
				</view>
			</view>
		</uni-popup>
		<xe-upload ref="XeUpload" :options="uploadOptions" @callback="handleUploadCallback"></xe-upload>
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		systemInfo,
	} from '../../units/system_info.js'
	import {
		dayjs
	} from '@/uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js'
	import {
		getOrderDetail,
		ProcesstoNext,
		getOrderProcessList,
		getwarnSupervisionId
	} from '@/units/request.js'
	import {
		BaseUrl
	} from '@/units/api.js'
	export default {
		components: {
			HeadNav
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				checkNum: 1,
				detailInfo: {},
				waitImage: [],
				imgOssList: [],
				videoOssList: '',
				videoUrl: '',
				isProcess: false,
				nowTime: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
				nowName: uni.getStorageSync('getInfo').user.nickName,
				remark: '',
				message: '任务接收成功,请尽快上报处理结果',
				contentDate: {},
				list: [{
						status: '代取件',
						time: '2024-11-29 15:40:23',
						description: '快件已送达菜鸟驿站，凭取件码【10-2-1020】取件，请及时取件，如有疑问请联系150******'
					},
					{
						status: '派送中',
						time: '2024-11-29 15:40:23',
						description: '快件已到达投揽部，等待派件'
					},
					{
						status: '运输中',
						time: '2024-11-29 15:40:23',
						description: '快件离开仓库，已发往下一站'
					},
					{
						status: '已揽件',
						time: '2024-11-29 15:40:23',
						description: '邮政快递 已收取快件'
					},
					{
						status: '已发货',
						time: '2024-11-29 15:40:23',
						description: '等待揽收中'
					},
					{
						status: '已下单',
						time: '2024-11-29 15:40:23',
						description: '商品已经下单'
					},
				],
				uploadOptions: {
					// url: 'http://192.168.31.185:3000/api/upload', // 不传入上传地址则返回本地链接
					url: `${BaseUrl}/system/oss/upload`,
					header: {
						'Authorization': uni.getStorageSync('Authorization')
					}
				},
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
		filters: {
			futtilvalue1(e) {
				console.log(e)
				if (e) {
					return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM-DD')))
				}
			},
			filterOrder(e) {
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
			}
		},
		onLoad(e) {
			console.log(e)
			this.querygetOrderDetail(e.orderId)
			this.querygetOrderProcessList(e.orderId)
		},
		methods: {
			querygetOrderProcessList(e) {
				getOrderProcessList(`?orderId=${e}`).then(e => {
					this.list = e.data.rows
					e.data.rows.map((e) => {
						if (e.actionType == "2") {
							this.contentDate = e;
						}
					});

				})
			},
			blueBtn() {
				let a = {
					actionType: '1',
					orderId: this.detailInfo.orderId,
					processInstanceId: this.detailInfo.processInstanceId,
					assigneeUserId: uni.getStorageSync('getInfo').user.userId,
				}
				ProcesstoNext(a).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.$refs.centerPopup.open('center')
						setTimeout(() => {
							this.$refs.centerPopup.close()
							uni.redirectTo({
								url: '/pages/workOrder/index'
							})
						}, 1500);
					}
				})
			},
			submit() {
				if (this.remark == '') {
					uni.$u.toast('请输入处理结果');
					return
				}
				let a = {
					actionType: '2',
					orderId: this.detailInfo.orderId,
					processInstanceId: this.detailInfo.processInstanceId,
					assigneeUserId: uni.getStorageSync('getInfo').user.userId,
					picFileList: this.imgOssList.length > 0 ? this.imgOssList.map(e => {
						return {
							ossId: e
						}
					}) : [],
					videoFileList: this.videoOssList !== '' ? [{
						ossId: this.videoOssList
					}] : [],
					finishTime: this.nowTime,
					remark: this.remark,



				}
				ProcesstoNext(a).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.message = "提交审核成功"
						this.$refs.centerPopup.open('center')
						setTimeout(() => {
							this.$refs.centerPopup.close()
							uni.redirectTo({
								url: '/pages/workOrder/index'
							})
						}, 1500);
					}
				})
			},
			reject() {
				let a = {
					actionType: '3',
					orderId: this.detailInfo.orderId,
					processInstanceId: this.detailInfo.processInstanceId,
					assigneeUserId: uni.getStorageSync('getInfo').user.userId,
					remark: '',
				}
				ProcesstoNext(a).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.message = '审核驳回,重新处理'
						this.$refs.centerPopup.open('center')
						setTimeout(() => {
							this.$refs.centerPopup.close()
							uni.redirectTo({
								url: '/pages/workOrder/index'
							})
						}, 1500);
					}
				})
			},
			pass() {
				let a = {
					actionType: '4',
					orderId: this.detailInfo.orderId,
					remark: this.remark,
					processInstanceId: this.detailInfo.processInstanceId,
					assigneeUserId: uni.getStorageSync('getInfo').user.userId,
				}
				ProcesstoNext(a).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.message = '审核通过'
						this.$refs.centerPopup.open('center')
						setTimeout(() => {
							this.$refs.centerPopup.close()
							uni.redirectTo({
								url: '/pages/workOrder/index'
							})
						}, 1500);
					}
				})
			},
			querygetOrderDetail(e) {
				getOrderDetail(e).then(res => {
					console.log(res)
					this.detailInfo = res.data.data
				})
			},
			checkNumBtn(e) {
				console.log(e)

				this.checkNum = e
			},
			openXeUpload() {
				this.$refs.XeUpload.upload('image');
			},
			videoopenXeUpload() {
				this.$refs.XeUpload.upload('video');
			},
			deleteVideo() {
				console.log('删除')
				this.videoOssList = ''
				this.videoUrl = ''
			},
			handleUploadCallback(e) {
				for (var i = 0; i < e.data.length; i++) {
					if (e.data[i].fileType == 'image') {
						this.imgOssList.push(e.data[i].response.data.ossId)
						this.waitImage.push(e.data[i].response.data.url)
					} else if (e.data[i].fileType == 'video') {
						this.videoOssList = e.data[i].response.data.ossId
						this.videoUrl = e.data[i].response.data.url
					}
				}
			},
			receive() {
				this.isProcess = true
			},
			scrolltolower() {
				console.log('到底了')
			},
			querybaseAttWawoBaseList() {
				baseAttWawoBaseList().then(res => {
					this.wawoList = res.data.rows
				})
			},
			previewImage(e) {
				var aa = []
				aa.push(e)
				uni.previewImage({
					urls: aa,
				});
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
	video {
		width: 300rpx;
		height: 200rpx;
	}

	.scrollY {
		height: calc(100vh - 244rpx);
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

	.titleType {
		width: 602rpx;
		height: 112rpx;
		background-color: #fff;
		border-radius: 16rpx;
		margin-left: 32rpx;
		margin-top: 30rpx;
		padding-left: 52rpx;
		padding-right: 32rpx;
		line-height: 112rpx;
		display: flex;
		justify-content: space-between;

		.isorange {
			color: rgba(236, 148, 10, 1);
		}

		.ispurple {
			color: rgba(179, 74, 235, 1);
		}

		.isblue {
			color: rgba(23, 124, 244, 1);
		}

		.isred {
			color: rgba(244, 57, 23, 1);
		}
	}

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
				line-height: 48rpx;
			}

			.reportLine_R {
				// color: rgba(153, 153, 153, 1);
				font-family: "Microsoft YaHei";
				font-size: 32rpx;
				line-height: 48rpx;

				input {
					text-align: right;
					font-size: 32rpx;
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
	}

	.blueBtn {
		width: 686rpx;
		height: 88rpx;
		background: rgba(3, 102, 241, 1);
		border-radius: 16rpx;
		line-height: 88rpx;
		text-align: center;
		color: #fff;
		margin-left: 32rpx;
		margin-top: 40rpx;
	}

	.disBtns {
		padding: 0 32rpx;
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;

		.reject {
			width: 320rpx;
			height: 88rpx;
			background: #fff;
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