
<template>
	<view class="upgrade-popup">
		<image class="header-bg" src='../../static/1726736922499.png' mode="widthFix"></image>
		<view class="main">
			<view class="versionPopupTitleClass">发现新版本</view>
			<view class="versionPopupNameClass">v{{versionName}}</view>
			<view class="content">
				<text class="updataContentTitleClass">更新内容</text>
				<view class="updataContentClass" v-html="versionDesc"></view>
			</view>
			<!--下载状态-进度条显示 -->
			<view class="footer" v-if="isStartDownload">
				<view class="progress-view" :class="{'active':!hasProgress}" @click="handleInstallApp">
					<!-- 进度条 -->
					<view v-if="hasProgress" style="height: 100%;">
						<view class="txt">{{percentText}}</view>
						<view class="progress" :style="setProStyle"></view>
					</view>
					<view v-else>
						<view class="btn upgrade force">
							{{ isDownloadFinish  ? '立即安装' :'下载中...'}}
						</view>
					</view>
				</view>
			</view>
			<!-- 强制更新 -->
			<view class="footer" v-else-if="isForceUpdate">
				<view class="btn upgrade force" @click="handleUpgrade">立即体验</view>
			</view>
			<!-- 可选择更新 -->
			<view class="footer" v-else>
				<view class="btn close" @click="handleClose">暂不更新</view>
				<view class="btn upgrade" @click="handleUpgrade">立即体验</view>
			</view>
		</view>
	</view>
</template>
 
<script>
	import {
		downloadApp,
		installApp
	} from '@/units/upgrade.js'
	export default {
 
		data() {
			return {
				isForceUpdate: false, //是否强制更新
				versionName: '', //版本名称
				versionDesc: '', //更新说明
				downloadUrl: '', //APP下载链接
				isDownloadFinish: false, //是否下载完成
				hasProgress: false, //是否能显示进度条
				currentPercent: 0, //当前下载百分比
				isStartDownload: false, //是否开始下载
				fileName: '', //下载后app本地路径名称
			}
		},
 
		computed: {
			//设置进度条样式，实时更新进度位置
			setProStyle() {
				return {
					width: (510 * this.currentPercent / 100) + 'rpx' //510：按钮进度条宽度
				}
			},
 
			//百分比文字
			percentText() {
				let percent = this.currentPercent;
				if (typeof percent !== 'number' || isNaN(percent)) return '下载中...'
				if (percent < 100) return `下载中${percent}%`
				return '立即安装'
			}
 
		},
 
		onLoad(option) {
			console.log(option)
			if(option.versionName){
				this.versionName = option.versionName
			}
			if(option.url){
				this.downloadUrl = option.url
			}
			if(option.slogan){
				this.versionDesc = option.slogan
			}
			if(option.isForce == '1'){
				this.isForceUpdate = true
			}else{
				this.isForceUpdate = false
			}
			
		},
 
		onBackPress(options) {
			// 禁用返回
			if (options.from == 'backbutton') {
				return true;
			}
		},
 
		methods: {
		
			//更新
			handleUpgrade() {
				if (this.downloadUrl) {
					this.isStartDownload = true
					//开始下载App
					downloadApp(this.downloadUrl, current => {
						//下载进度监听
						this.hasProgress = true
						this.currentPercent = current
					}).then(fileName => {
						//下载完成
						this.isDownloadFinish = true
						this.fileName = fileName
						if (fileName) {
							//自动安装App
							this.handleInstallApp()
						}
					}).catch(e => {
						console.log(e, 'e')
					})
				} else {
					uni.showToast({
						title: '下载链接不存在',
						icon: 'none'
					})
				}
			},
 
			//安装app
 
			handleInstallApp() {
				//下载完成才能安装，防止下载过程中点击
				if (this.isDownloadFinish && this.fileName) {
					installApp(this.fileName, () => {
						//安装成功,关闭升级弹窗
						uni.navigateBack()
					})
				}
			},
 
			//关闭返回
			handleClose() {
				uni.setStorageSync('upDateTime',Math.floor(new Date().getTime() / 1000))
				uni.setStorageSync('isUpdate',true)
				uni.navigateBack()
			},
		}
	}
</script>
 
<style>
	page {
		background: rgba(0, 0, 0, 0.5);
		/**设置窗口背景半透明*/
	}
</style>
 
<style lang="scss" scoped>
	.upgrade-popup {
		width: 610rpx;
		height: 654.14rpx;
		position: fixed;
		top: 50%;
		left: 52%;
		transform: translate(-50%, -50%);
		border-radius: 20rpx;
		box-sizing: border-box;
	}
 
	.header-bg {
		width: 100%;
	}
	.main {
		position: absolute;
		top: 69rpx;
		padding-left: 35rpx;
		box-sizing: border-box;
		
 
		.footer {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			flex-shrink: 0;
			margin-top: 100rpx;
 
			.btn {
				width: 246rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				z-index: 999;
				height: 96rpx;
				box-sizing: border-box;
				font-size: 38rpx;
				font-family: Source Han Sans-Regular;
				border-radius: 10rpx;
				letter-spacing: 2rpx;
				border-radius: 50rpx 50rpx 50rpx 50rpx;
				&.force {
					width: 500rpx;
				}
 
				&.close {
					margin-right: 25rpx;
					background: #E1E1E1;
					font-weight: 400;
					font-size: 34rpx;
					color: #3D3D3D;
				}
 
				&.upgrade {
					background: linear-gradient( 90deg, #FF470B 1%, #FC966E 100%);
					color: white;
				}
 
			}
 
			.progress-view {
				width: 500rpx;
				height: 90rpx;
				display: flex;
				position: relative;
				align-items: center;
				border-radius: 50rpx;
				background-color: #FFCEBE;
				display: flex;
				justify-content: flex-start;
				padding: 0px;
				box-sizing: border-box;
				border: none;
				overflow: hidden;
				font-size: 38rpx;
				font-family: Source Han Sans-Regular;
				&.active {
					// background-color: #FFCEBE;
					background: linear-gradient( 90deg, #FF470B 1%, #FC966E 100%);
					border-radius: 50rpx 50rpx 50rpx 50rpx;
				}
				.progress {
					height: 100%;
					// background-color: #FFCEBE;
					background: linear-gradient( 90deg, #FF470B 1%, #FC966E 100%);
					padding: 0px;
					box-sizing: border-box;
					border: none;
					border-radius: 50rpx;
				}
 
				.txt {
					
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					color: #fff;
 
				}
 
			}
 
		}
 
	}
	.content {
		margin-top: 60rpx;
	}
	.versionPopupTitleClass{
		height: 53rpx;
		font-family: Alibaba PuHuiTi;
		font-weight: 700;
		font-size: 38rpx;
		color: #3D3D3D;
		line-height: 53rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		margin-top: 41.35rpx;
	}
	.versionPopupNameClass{
		width: 71rpx;
		height: 38rpx;
		font-family: Source Han Sans-Regular;
		font-weight: 350;
		font-size: 26rpx;
		color: #ADADAD;
		line-height: 38rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		margin-top: 8rpx;
	}
	.updataContentTitleClass{
		height: 38rpx;
		font-family: Source Han Sans-Regular;
		font-weight: 400;
		font-size: 26rpx;
		color: #3D3D3D;
		line-height: 38rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		margin-top: 120rpx;
	}
	.updataContentClass{
		height: 32rpx;
		font-family: Source Han Sans-Regular;
		font-weight: 400;
		font-size: 23rpx;
		color: #727272;
		line-height: 32rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		margin-top: 16.92rpx;
	}
	.zanbugengxinClass{
		width: 252rpx;
		height: 92rpx;
		background: #E1E1E1;
		border-radius: 50rpx 50rpx 50rpx 50rpx;
		font-family: Source Han Sans-Regular;
		font-weight: 400;
		font-size: 34rpx;
		color: #3D3D3D;
		text-align: center;
		font-style: normal;
		text-transform: none;
	}
	.lijitiyanClass{
		width: 252rpx;
		height: 92rpx;
		background: linear-gradient( 90deg, #FF470B 1%, #FC966E 100%);
		border-radius: 50rpx 50rpx 50rpx 50rpx;
		font-family: Source Han Sans-Regular;
		font-weight: 400;
		font-size: 34rpx;
		color: #FFFFFF;
		text-align: center;
		font-style: normal;
		text-transform: none;
	}
</style>