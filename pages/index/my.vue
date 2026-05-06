<template>
	<view>
		<view class="content">
			<view class="topBack">
				<image src="/static/headerImg.png" mode="" class="headerImg"></image>
				<view class="titleBox">
					<view class="name" v-if="userInfo">{{userInfo.user.nickName}}</view>
						<view class="phone" v-if="userTel !==''">
						Tel:{{userTel}}
					</view>
				</view>
			</view>
			<view class="box">
				<view class="line" @click="gotoTxl">
					<view class="line_L">
						<image src="/static/txl.png" mode="" class="smallImg"></image>
						<view class="">
							通讯录
						</view>
					</view>
					<u-icon name="arrow-right" size="10"></u-icon>
				</view>
				<view class="line" @click="clearCache">
					<view class="line_L">
						<image src="/static/clear.png" mode="" class="smallImg"></image>
						<view class="">
							清除缓存
						</view>
					</view>
					<u-icon name="arrow-right" size="10"></u-icon>
				</view>
				<view class="line" @click="gotoEditPassword" >
					<view class="line_L">
						<image src="/static/souck.png" mode="" class="smallImg"></image>
						<view class="">
							修改密码
						</view>
					</view>
					<u-icon name="arrow-right" size="10"></u-icon>
				</view>
				<view class="line">
					<view class="line_L">
						<image src="/static/leave.png" mode="" class="smallImg"></image>
						<view class="">
							版本号
						</view>
					</view>
					<view class="" style="display: flex;">
						{{version}}
						<!-- <u-icon name="arrow-right" size="10"></u-icon> -->
					</view>
				</view>
			</view>
			<view class="goout" @click="goout">
				退出登录
			</view>
		</view>
		<uni-popup ref="centerPopup" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					是否退出当前账号?
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
		<uni-popup ref="cachePop" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					是否清除缓存?
				</view>
				<view class="confimBtnPop">
					<view class="confimNo" @click="closecachePop">
						否
					</view>
					<view class="confimYes" @click="yescachePop()">
						是
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getInfo
	} from '@/units/request.js'
	export default {
		data() {
			return {
				version: '',
				userInfo: null,
				userTel: ''

			}
		},
		onShow() {
			this.querygetInfo()
			// this.nickName = uni.getStorageSync('users')
			// this.phonenumber = uni.getStorageSync('phonenumber')
			const systemInfo = uni.getSystemInfoSync();
			// 应用程序版本号
			// #ifdef APP
			this.version = systemInfo.appWgtVersion;
			// #endif
		},
		mounted() {

		},
		methods: {
			querygetInfo() {
				getInfo().then(res => {
					console.log(res)
					this.userInfo = res.data.data
					this.userTel = res.data.data.user.phonenumber
					uni.setStorageSync('userInfo', res.data.data)
				})
			},
			goout() {
				this.$refs.centerPopup.open('center')
			},
			gotoTxl() {
				uni.navigateTo({
					url: '/pages/index/indexedList'
				})
			},
			closeCenterPop() {
				this.$refs.centerPopup.close()
			},
			clearCache() {
				// uni.$u.toast('缓存清除成功');
				this.$refs.cachePop.open('center')
			},
			closecachePop() {
				this.$refs.cachePop.close()
			},
			yescachePop() {
				uni.$u.toast('缓存清除成功');
				this.$refs.cachePop.close()
			},
			gotoEditPassword() {
				uni.navigateTo({
					url: '/pages/index/editPassWord'
				})
			},

			gotoPatrolDetail() {
				this.$refs.centerPopup.close()
				uni.removeStorage({
					key: 'Authorization',
					success: function(res) {
						console.log('success');
					}
				});
				uni.navigateTo({
					url: '/pages/index/login'
				})
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
			height: 504rpx;
			background-image: url('/static/myback.png');
			background-size: 100%;
			position: relative;

			.headerImg {
				width: 112rpx;
				height: 112rpx;
				position: absolute;
				left: 48rpx;
				top: 150rpx;
			}

			.titleBox {
				color: #fff;
				position: absolute;
				left: 186rpx;
				top: 150rpx;
				padding-top: 10rpx;

				.name {
					font-size: 36rpx;
				}

				.phone {
					font-size: 28rpx;
					margin-top: 20rpx;
				}
			}
		}

		.box {
			width: 664rpx;
			height: auto;
			margin-top: -150rpx;
			border-radius: 16rpx;
			background: #fff;
			z-index: 9;
			padding: 30rpx 20rpx 0 26rpx;

			.line {
				display: flex;
				justify-content: space-between;
				margin-bottom: 48rpx;
				line-height: 48rpx;

				.line_L {
					display: flex;
					align-items: center;

					.smallImg {
						width: 40rpx;
						height: 40rpx;
						margin-right: 24rpx;
					}
				}
			}

		}

		.goout {
			width: 600rpx;
			height: 88rpx;
			color: #fff;
			text-align: center;
			line-height: 88rpx;
			border-radius: 48rpx;
			background: linear-gradient(90.00deg, rgba(77.5625, 151.1156463623047, 255, 1), rgba(3, 102, 241, 1) 100%);
			position: fixed;
			bottom: 58rpx;


			box-shadow: 0px 8rpx 8rpx 0px rgba(3, 102, 241, 0.3);
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