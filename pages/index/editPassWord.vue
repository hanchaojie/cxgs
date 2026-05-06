<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='修改密码'></head-nav>
		<view style="height: 176rpx;"></view>
		<view class="reportBox">
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					旧密码
				</view>
				<view class="reportLine_R">
					<input type="password" placeholder="输入旧密码" v-model="oldPass" style="color: #333;" />
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					新密码
				</view>
				<view class="reportLine_R">
					<input type="password" placeholder="输入新密码" v-model="newPass" style="color: #333;" />
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					确认新密码
				</view>
				<view class="reportLine_R">
					<input type="password" placeholder="输入新密码" v-model="repeatPass" style="color: #333;" />
				</view>
			</view>

		</view>
		<view style="font-size: 24rpx;color: #999;margin-left: 30rpx;margin-top: 20rpx;">密码由6~20位数字、字母或者符号（_/#@&）组成，至少两种
		</view>
		<view class="editPassWord" @click="editPassWord">
			确认修改
		</view>
	</view>

</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		updatePwd
	} from '@/units/request.js'
	import {
		systemInfo
	} from '../../units/system_info.js'
	export default {
		components: {
			HeadNav
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,

				oldPass: "",
				newPass: '',
				repeatPass: ""

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
		methods: {
			editPassWord() {
				if (this.newPass === this.repeatPass) {
					const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%?])[a-zA-Z0-9!@#$%?_]{12,}$/;
					if (strongPasswordRegex.test(this.newPass)) {
						
						// return
						// const model = `?oldPassword=${this.oldPass}&newPassword=${this.newPass}`
						updatePwd(
								`?oldPassword=` + encodeURIComponent(this.oldPass) + `&newPassword=` + encodeURIComponent(
									this.newPass))
							.then(res => {
								console.log(res)
								if (res.data.code == 200) {
									uni.$u.toast(res.data.msg);
									uni.removeStorage({
										key: 'Authorization',
										success: function(res) {
											console.log('success');
										}
									});
									uni.removeStorage({
										key: 'password',
										success: function(res) {
											console.log('success');
										}
									});
									uni.navigateTo({
										url: '/pages/index/login'
									})
								} else {
									uni.$u.toast(res.data.msg);
								}
							})

					} else {
						uni.$u.toast('密码验证不通过,需要包含大小写,数字,特殊符号且长度大于12');
						return
					}
				} else {
					uni.$u.toast('新密码不相同');
					return
				}
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
		padding: 28rpx 32rpx 1rpx 24rpx;

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

	
	}

	.editPassWord {
		width: 686rpx;
		height: 88rpx;
		background-color: #0366F1;
		border-radius: 12rpx;
		color: #fff;
		margin-left: 32rpx;
		margin-top: 32rpx;
		text-align: center;
		line-height: 88rpx;
	}
</style>