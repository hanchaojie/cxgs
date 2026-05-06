<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='派发工单'></head-nav>
		<view style="height: 176rpx;">

		</view>
		<view class="reportBox">
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					供水厂(站)
				</view>
				<view class="reportLine_R" v-if="infoDetail">
					{{infoDetail.projectName}}
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					部位名称
				</view>
				<view class="reportLine_R" v-if="infoDetail">
					{{infoDetail.partName ? infoDetail.partName:'--'}}
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					设施设备名称
				</view>
				<view class="reportLine_R" v-if="infoDetail">
					{{infoDetail.facilityName ? infoDetail.facilityName:'--'}}
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					问题来源
				</view>
				<view class="reportLine_R" v-if="infoDetail">
					{{ infoDetail.source | sourceType}}
				</view>
			</view>
			<view class="reportLine" v-if="infoDetail">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					问题级别
				</view>
				<view class="reportLine_R" v-if="infoDetail">
					{{ levType(infoDetail.lev) }}
				</view>
			</view>
			<view class="reportLine" style="margin-bottom: 0rpx;">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					问题内容
				</view>
				<view class="reportLine_R">

				</view>
			</view>
			<textarea disabled class="textareaBox" v-if="infoDetail" name="" id="" placeholder="请输入问题描述"
				v-model="infoDetail.remark"></textarea>
			<view class="reportLine" style="margin-top: 10rpx;margin-bottom: 10rpx;">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					图片
				</view>
				<view class="reportLine_R" style="display: flex;">
				</view>
			</view>
			<view class="" v-if="infoDetail">
				<image v-for="item in infoDetail.picFileList" :src="item.url" mode=""
					style="width: 128rpx;height: 108rpx;margin-right: 10rpx;" @click="previewImage(item.url)">
				</image>
			</view>
			<view class="reportLine" style="margin-top: 10rpx;margin-bottom: 10rpx;" v-if="videoUrl">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					视频
				</view>
				<view class="reportLine_R" style="display: flex;">
				</view>
			</view>
			<DomVideoPlayer ref="domVideoPlayer" style="height: 400rpx;" :src="videoUrl" loop controls muted
				v-if="videoUrl" />
			<!-- <video :src="videoUrl" show-center-play-btn='false' show-play-btn="true" controls v-if="videoUrl"> -->
			<!-- 	<cover-image src="/static/hazardReporting/close.png" @click="deleteVideo"
					style="position: absolute;right: 10rpx;top: 14rpx;width: 28rpx;height: 28rpx;z-index: 999;" mode="" /> -->
			</video>
			<view class="reportLine" style="margin-top: 20rpx;">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					上报人员
				</view>
				<view class="reportLine_R" style="display: flex;" v-if="infoDetail">
					{{infoDetail.reporterName}}
				</view>
			</view>
			<view class="reportLine" style="margin-bottom: 0;">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					上报时间
				</view>
				<view class="reportLine_R" style="display: flex;" v-if="infoDetail">
					{{infoDetail.reportTime | futtilvalue1}}
				</view>
			</view>
		</view>

		<view class="disBtns" @click="distribute" v-if="isShowBtn">
			派发工单
		</view>

	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import DomVideoPlayer from '@/components/DomVideoPlayer/DomVideoPlayer.vue'
	import {
		selectRole
	} from '../../units/units.js'
	import {
		getwarnSupervisionId,
		queryDict,
		putSensorWarning,
		getMatterId
	} from '@/units/request.js'
	import {
		dayjs
	} from '../../uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js'
	export default {
		components: {
			HeadNav,
			DomVideoPlayer
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				matterId: '',
				infoDetail: null,
				Dict: [],
				videoUrl: '',
				isShowBtn: false,
				src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-app-video-courses.mp4',
				playing: false,
				loop: false,
				controls: true,
				autoplay: false,
				isLoading: true,
				playbackRate: 1,
				currentTime: 0,
				duration: 0,
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
			this.getqueryDict()
			this.getDetail(this.matterId)
		},
		onLoad(e) {
			this.matterId = e.id
		},
		// 定义局部过滤器
		filters: {
			futtilvalue1(e) {
				console.log(e)
				if (e) {
					return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM-DD')))
				}
			},
			filtersType(value) {
				console.log(value)
				return this.Dict.find(item => item.value == value).label
			},
			sourceType(v) {
				switch (v) {
					case '1':
						return '日常检查'
						break;
					case '2':
						return '定期检查'
						break;
					case '3':
						return '特别检查'
						break;
					case '9':
						return '其他'
						break;
					default:
						break;
				}
			},
		},
		onShow() {
			this.isShowBtn = selectRole(['GL', 'patrol_audit_role', 'area_manager'], uni.getStorageSync('getInfo').roles)
		},
		methods: {
			getqueryDict() {
				queryDict(`?dictType=patrol_matter_lev`).then(Response => {
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
			levType(e) {
				console.log(e)
				console.log(this.Dict)

				return this.Dict.find(item => item.value == e).label
			},
			getDetail(e) {
				getMatterId(e).then(res => {
					console.log(res)
					this.infoDetail = res.data.data
					this.videoUrl = res.data.data.videoFileList.length > 0 ? res.data.data.videoFileList[0].url :
						''
				})
			},
			previewImage(e) {
				var aa = []
				aa.push(e)
				uni.previewImage({
					urls: aa,
				});
			},
			distribute() {
				uni.navigateTo({
					url: `/pages/problem/addOrderWork?matterId=${this.matterId}`
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
	video {
		width: 300rpx;
		height: 200rpx;
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
			margin-bottom: 36rpx;

			.reportLine_L {
				font-size: 32rpx;
				color: #565656;
				font-family: "Microsoft YaHei";
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
					font-size: 28rpx;
					font-family: "Microsoft YaHei";
					color: #333;
				}
			}
		}

		.textareaBox {
			background: rgba(244, 245, 249, 1);
			border-radius: 12rpx;
			height: 132rpx;
			width: 596rpx;
			padding: 14rpx 16rpx;
			color: #333;
			margin-top: 10rpx;
			font-family: "Microsoft YaHei";
			font-size: 32rpx;
		}
	}

	.disBtns {
		width: 686rpx;
		height: 88rpx;
		background: #0366F1;
		margin-left: 32rpx;
		margin-top: 20rpx;
		border-radius: 16rpx;
		color: #fff;
		text-align: center;
		line-height: 88rpx;

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