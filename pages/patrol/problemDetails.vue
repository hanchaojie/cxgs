<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='问题详情'></head-nav>
		<view style="height: 176rpx;"></view>
		<view class="problemTop">
			<view class="commonDis">
				<text style="color: red;">*</text>
				<view class="commonDisFlex1">
					问题来源
				</view>
				<view class="styletxt">
					{{detailInfo.source |filterSource}}
				</view>
			</view>
			<view class="commonDis">
				<text style="color: transparent;">*</text>
				<view class="commonDisFlex1">
					关联设备
				</view>
				<view class="styletxt">
					{{detailInfo.projectName}}{{detailInfo.facilityName?detailInfo.facilityName:""}}{{detailInfo.partName?detailInfo.partName:""}}
				</view>
			</view>
			<view class="commonDis">
				<text style="color: red;">*</text>
				<view class="commonDisFlex1">
					问题级别
				</view>
				<view class="styletxt">
					{{detailInfo.lev |firLev}}
				</view>
			</view>
			<view class="commonDis">
				<text style="color: red;">*</text>
				<view class="commonDisFlex1">
					问题描述
				</view>
				<view class="styletxt">
					<!-- 一般 -->
				</view>
			</view>
			<textarea class="textareaIpt" v-model="detailInfo.remark" cols="30" rows="3"></textarea>
		</view>

		<view class="problemTop">
			<view class="commonDis">
				<text style="color: red;">*</text>
				<view class="commonDisFlex1">
					隐患照片
				</view>
				<view class="styletxt">
					<!-- 一般 -->
				</view>
			</view>
			<view class="commonDis">
				<text style="color: transparent;">*</text>
				<image @click="previewImage(i.url)" :src="i.url" v-for="i in detailInfo.picFileList" class="imgSize"
					mode=""></image>
			</view>
			<view class="commonDis">
				<text style="color: transparent;">*</text>
				<view class="commonDisFlex1">
					视频
				</view>
				<view class="styletxt">
					<!-- 一般 -->
				</view>
			</view>
			<view class="">
				<DomVideoPlayer ref="domVideoPlayer" style="height: 400rpx;" :src="detailInfo.videoFileList[0].url"
					loop controls muted v-if="detailInfo.videoFileList && detailInfo.videoFileList.length">
					<!-- 	<cover-image src="/static/hazardReporting/close.png" @click="deleteVideo"
					style="position: absolute;right: 10rpx;top: 14rpx;width: 28rpx;height: 28rpx;z-index: 999;"
					mode="" /> -->
				</DomVideoPlayer>
			</view>
			
			<view class="commonDis">
				<text style="color: red;">*</text>
				<view class="commonDisFlex1">
					上报时间
				</view>
				<view class="styletxt">
					{{detailInfo.reportTime}}
				</view>
			</view>
			<view class="commonDis" style="margin-bottom: 0;">
				<text style="color: red;">*</text>
				<view class="commonDisFlex1">
					上报人
				</view>
				<view class="styletxt">
					{{detailInfo.reporterName}}
				</view>
			</view>
		</view>
		<!-- 		<view class="problemTop">
			<view class="commonDis" style="margin-bottom: 0;">
				<text style="color: red;">*</text>
				<view class="commonDisFlex1">
					处理状态
				</view>
				<view class="styletxt colorDot">
					已处理
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		getPatrolId,
		getMatterId
	} from '@/units/request.js'
	export default {
		components: {
			HeadNav
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				detailInfo: {}

			}
		},
		mounted() {
			// --------------------------经典界面自定义，需要记录-------------------------------------------------------------
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
		onLoad(e) {
			console.log(e)
			this.querygetOrderDetail(e.id)
		},
		filters: {
			// 问题来源;1、日常检查；2、定期检查；3、特别检查；9、其他
			filterSource(e) {
				switch (e) {
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
			firLev(e) {
				// 题级别;1、轻微；2、一般；3、严重
				switch (e) {
					case '1':
						return '轻微'
						break;
					case '2':
						return '一般'
						break;
					case '3':
						return '严重'
						break;
					default:
						break;
				}
			}
		},
		methods: {
			querygetOrderDetail(e) {
				getMatterId(`${e}`).then(e => {
					console.log(e)
					this.detailInfo = e.data.data
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
	.absolute {
		.problemTop {
			width: 630rpx;
			height: auto;
			background: #fff;
			margin-left: 32rpx;
			margin-top: 30rpx;
			border-radius: 16rpx;
			padding: 38rpx 32rpx 34rpx 24rpx;

			.commonDis {
				display: flex;
				align-items: center;
				margin-bottom: 32rpx;

				.commonDisFlex1 {
					flex: 1;
					line-height: 48rpx;
					color: #565656;
					
				}

				.imgSize {
					width: 128rpx;
					height: 108rpx;
					margin-right: 18rpx;
				}

				.styletxt {
					color: rgba(51, 51, 51, 1);
					font-family: "Microsoft YaHei";
					font-size: 32rpx;
					line-height: 42rpx;
					width: 400rpx;
					white-space: nowrap;
					/* 不换行 */
					overflow: hidden;
					/* 隐藏超出的内容 */
					text-overflow: ellipsis;
					/* 用省略号表示被隐藏的部分 */
					text-align: right;
				}

				.colorDot {
					color: rgba(3, 102, 241, 1);
				}
			}

			.textareaIpt {
				width: 596rpx;
				height: 128rpx;
				background-color: rgba(244, 245, 249, 1);
				border-radius: 12rpx;
				padding: 16rpx;
			}
		}

		.problemMedium {}

	}
</style>