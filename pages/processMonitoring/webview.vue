<template>
	<view class="absolute">
		<!-- <head-nav :style="navStyle" :navHeightValue="navHeightValue" :textContent='textContent'></head-nav> -->
		<view style="height: 50px;width: 100vw;display: flex;z-index: 99999;position: fixed;left: 0;top: 0;">
			<!-- 	<view style="height: 1rpx;width: 100vw;">
				
			</view> -->
			<!-- <uni-icons style="text-align: left;line-height: 50px;background-color: red;" type="left" size="30" color="#000"
				@tap="goBack"></uni-icons> -->
			<view class="" style="width: 80rpx;height: 50px;" @click.stop="goBack">
				<!-- <u-icon name="arrow-left" size="30" style="line-height: 50px;"></u-icon> -->
				<uni-icons style="text-align: left;line-height: 60px;margin-left: 10rpx;" type="left" size="30"
					color="#000" @tap="goBack"></uni-icons>
			</view>
			<view style="text-align: center;flex: 1;;line-height: 60px;">
				{{textContent}}
			</view>
		</view>

		<view class="web-view-wrap" v-if="isurl">
			<web-view :src="isurl" v-if="isurl"></web-view>
		</view>
		<!-- <web-view src="http://baidu.com"></web-view> -->
		<!-- <iframe style="width: 100vw;height: 100vh;" v-if="isurl" :src="isurl" frameborder="0"></iframe> -->
		<!-- <iframe src="http://baidu.com" frameborder="0"></iframe> -->
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import index from '../../uni_modules/uview-ui/index.js'
	export default {
		components: {
			HeadNav
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				textContent: '',
				isurl: null,
				ischeck: false,
				statusbar: 0,
				stationId:"",
				// http://192.168.88.240:60061/dishi-visual-designer/home/index?projectId=1927541850018779138
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
		onLoad(e) {
			this.projectId = e.projectId
			this.textContent = e.name
			this.stationId = e.stationId
			this.isurl =
				`http://jycxgs.cloud.zjdsxx.com:60061/dishi-visual-designer/home/index?systemType=APP&projectId=${e.projectId}&stationId=${e.stationId}&token=${uni.getStorageSync('Token')}`
			console.log(this.isurl)
			// `http://www.baidu.com`
		},
		onShow() {
			// 进入web-view页面
			// unlockOrientation => 解锁
			// lockOrientation => 锁定
			// "portrait-primary", //可选，字符串类型，支持竖屏
			// "portrait-secondary", //可选，字符串类型，支持反向竖屏
			// "landscape-primary", //可选，字符串类型，支持横屏
			// "landscape-secondary" //可选，字符串类型，支持反向横屏
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('landscape-primary');
			/* 5+环境屏幕旋转 */
			return
			watchScheen = setInterval(() => {

				// 屏幕方向数值： HOME键在右, 0 - 竖屏； 90 - 横屏；  HOME'键在左, 180 - 反向竖屏； -90 - 反向横屏;
				let c = plus.navigator.getOrientation();
				if (c == 0) {
					console.log('竖屏', c)
					var currentWebview = this.$scope.$getAppWebview() //获取当前页面的webview对象//是否可以双指缩放
					setTimeout(function() {
						let wv = currentWebview.children()[0]
						wv.setStyle({
							top: 200,
							height: 350,
							scalable: true,
							zIndex: -999
						})
					}, 1000); //如果是页面初始化调用时，需要延时一下
					plus.screen.lockOrientation('portrait-primary'); //锁定竖屏
					plus.navigator.setStatusBarStyle('dark');
					plus.screen.unlockOrientation();
					uni.showTabBar()
				} else if (c == 180) {
					console.log('反向竖屏', c)
					plus.screen.lockOrientation('portrait-secondary'); //锁定横屏
					plus.navigator.setStatusBarStyle('dark');
					plus.screen.unlockOrientation();
					uni.hideTabBar()
				} else if (c == -90) {
					console.log('反向横屏', c)
					plus.screen.lockOrientation('landscape-secondary'); //锁定反向横屏
					plus.navigator.setStatusBarStyle('dark');
					plus.screen.unlockOrientation();
					uni.hideTabBar()
				} else {
					console.log('横屏', c)
					var currentWebview = this.$scope.$getAppWebview() //获取当前页面的webview对象//是否可以双指缩放

					setTimeout(function() {

						let wv = currentWebview.children()[0]
						wv.setStyle({
							top: 80,
							height: 300,
							scalable: true,
							zIndex: -999
						})

					}, 1000); //如果是页面初始化调用时，需要延时一下

					plus.screen.lockOrientation('landscape-primary'); //锁定反向横屏
					plus.navigator.setStatusBarStyle('dark');
					plus.screen.unlockOrientation();
					uni.hideTabBar()
				}


			}, 200)



			// #endif





		},
		onUnload() {
			// #ifdef APP-PLUS
			/* 5+环境锁定屏幕方向 */
			// plus.screen.unlockOrientation('landscape-primary'); //锁定
			plus.screen.lockOrientation('portrait-primary');
			// #endif
		},
		onReady() {
			// #ifdef APP-PLUS

			let currentWebview = this.$scope.$getAppWebview(); //获取当前web-view
			setTimeout(function() {

				let height = 0; //定义动态的高度变量
				let statusbar = 0; // 动态状态栏高度
				uni.getSystemInfo({
					// 获取当前设备的具体信息
					success: sysinfo => {
						this.statusbar = sysinfo.statusBarHeight;
						height = sysinfo.windowHeight;
						console.log(height)
						console.log(this.statusbar)
					}

				});
				var wv = currentWebview.children()[0];
				wv.setStyle({
					//设置web-view距离顶部的距离以及自己的高度，单位为px
					top: 50, //此处是距离顶部的高度，应该是你页面的头部
					height: height - statusbar - uni.upx2px(15), //webview的高度
					// scalable: true, //webview的页面是否可以缩放，双指放大缩小,
				});
			}, 1000); //如页面初始化调用需要写延迟
			// #endif

		},
		methods: {
			goBack() {
				console.log('返回')
				// #ifdef APP-PLUS
				/* 5+环境锁定屏幕方向 */
				// plus.screen.unlockOrientation('landscape-primary'); //锁定
				plus.screen.lockOrientation('portrait-primary');
				// #endif

				uni.navigateBack()
			}
		}

	}
</script>
<style>
	/* page {
		background-color: rgb(242, 245, 255);
		height: 100%;
	} */
	.web-view-wrap {
		position: fixed !important;
		bottom: 100;
		width: 100px;
		height: 100px;
		/* top: ; */
		/* top: 50px; */
	}
</style>

<style scoped>
	/* pakA/pages/rounds/index.wxss */
</style>