<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='通讯录'></head-nav>
		<view style="height: 176rpx;">

		</view>

		<view class="liu-search" id="TOP">
			<image class="liu-search-img" src="/static/search.png"></image>
			<input class="liu-input" @input="search" v-model="searchStr" placeholder="请输入姓名" maxlength="50"
				placeholder-class="liu-placeholder" />
		</view>

		<view class="page-main">
			<liu-indexed-list :dataList="dataList" @click="click"></liu-indexed-list>
		</view>
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		getaddressBook
	} from '../../units/request.js'
	export default {
		components: {
			HeadNav
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				searchStr: "",
				dataList: []

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
		onShow() {
			this.querygetaddressBook()
		},
		methods: {
			click(e) {
				console.log(e)
				uni.makePhoneCall({
					phoneNumber: e.phone //仅为示例
				});
			},
			search(e) {
				console.log(e)
				getaddressBook(`?personType=1&pageNum=1&pageSize=99999&name=${e.detail.value}`).then(res => {
					if (res.data.code == 200) {
						console.log(res.data)

						this.dataList = res.data.rows.map(e => {
							return {
								id: e.personCode,
								name: e.name,
								phone: e.phone,
								img: e.picFileList.length ? e.picFileList[0].url : '/static/headerImg.png'
							}
						})
					}
				})
			},
			querygetaddressBook() {
				getaddressBook(`?personType=1&pageNum=1&pageSize=99999`).then(res => {
					if (res.data.code == 200) {
						console.log(res.data)

						this.dataList = res.data.rows.map(e => {
							return {
								id: e.personCode,
								name: e.name,
								phone: e.phone,
								img: e.picFileList.length ? e.picFileList[0].url : '/static/headerImg.png'
							}
						})
					}
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
	.liu-search {
		width: 100%;
		height: 106rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		.liu-search-img {
			width: 32rpx;
			height: 32rpx;
			position: absolute;
			left: 64rpx;
		}

		.liu-input {
			width: calc(100% - 64rpx);
			height: 72rpx;
			background: #EEEEEE;
			border-radius: 36rpx;
			padding: 0 32rpx 0 80rpx;
			box-sizing: border-box;
			color: #333333;
		}

		.liu-placeholder {
			color: #777777;
		}
	}

	.page-main {
		height: calc(100vh - 292rpx);
	}
</style>