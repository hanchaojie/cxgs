<template>
	<view class="stepsbpx">
		<view class="speedbox">
			<view class="speed-item" v-for="(item, index) in list" :key="index">
				<view class="speedheader" style="width: 100%;">
					<view>
						<image class="refundshenhe" v-if="item.ischeck" :src="checked"></image>
						<image class="refundshenhe" v-else :src="unchecked"></image>
					</view>

					<!-- 	<image v-else-if="current > index"
						:src="wancheng">
					</image> -->
					<!-- <view v-else class="notStarted"></view> -->
					<view style="display: flex;justify-content: space-between;" class="rightBox">
						<view class="textactive">{{item.name}}<text v-if="item.isFlag"
								style='color: rgba(238, 58, 45, 1);'>[异常]</text><text v-else
								style='color: rgba(3, 102, 241, 1);'>[正常]</text></view>
						<image class="rightBoxImg" v-if="!item.ischeck" :src="arrowR" mode=""></image>

						<image class="rightBoxImg" v-else :src="arrowRed"></image>
					</view>
				</view>
				<view class="speedcon">
					<view class="speedcon-item" v-if="item.details">检查时间:{{item.details}}</view>
					<view class="speedcon-item" style="line-height: 40rpx;" v-if="item.label">
						检查事项:{{item.label}}3.检查事项内容3.检查事项内容3.检查事项内容</view>
				</view>
				<view v-if="index < list.length - 1" class="line " :class="list.length == index ? '' : 'lineactive'">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked: require('./CheckedAlready.png'),
				unchecked: require('./unchecked.png'),
				arrowR: require('./arrowR.png'),
				arrowRed: require('./arrowRed.png'),
			};
		},
		props: {

			list: {
				type: Array,
				default: () => []
			}
		},
		methods: {
			handleInput(e) {
				console.log(e)
			},
			handleLastInput() {
				const result = this.codeList.reduce((acc, item) => acc + item.value, '');
				this.$emit('success', result);
			},
			handleResend() {
				// 处理重新发送逻辑
				this.reset();
			},
			reset() {
				var codeNum = JSON.parse(JSON.stringify([{
					value: ''
				}, {
					value: ''
				}, {
					value: ''
				}, {
					value: ''
				}]))
				this.codeNum = codeNum
			},
		},
	};
</script>

<style scoped>
	.stepsbpx {
		margin: 29rpx 0 31rpx;
		background: #fff;
		border-radius: 10rpx;
		padding: 47rpx 21rpx 63rpx;
	}

	.stepsbpx .bigtitle {
		font-size: 34rpx;
		line-height: 34rpx;
		color: #333;
		font-weight: 700;
		margin-bottom: 39rpx;
	}

	.stepsbpx .speedbox .speed-item {
		margin-bottom: 30rpx;
		position: relative;
		min-height: 100rpx;
	}

	.stepsbpx .speedbox .speed-item:last-child {
		margin-bottom: 0;
	}

	.stepsbpx .speedbox .speed-item .speedheader {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 28rpx;
		position: relative;
		padding-left: 55rpx;
		width: 100%;
	}

	.stepsbpx .speedbox .speed-item .speedheader .rightBox {

		width: calc(100% - 60rpx);
		display: flex;
		justify-content: space-between;
	}

	.stepsbpx .speedbox .speed-item .speedheader .rightBox .rightBoxImg {
		width: 32rpx;
		height: 32rpx;
	}

	.stepsbpx .speedbox .speed-item .speedheader image {
		/* 	width: 18rpx;
		height: 18rpx;
		position: absolute;
		z-index: 10;
		left: 24rpx;
		top: 5rpx; */
	}

	.stepsbpx .speedbox .speed-item .speedheader text {
		color: #333;
		font-weight: 400;
	}

	.stepsbpx .speedbox .speed-item .speedheader .textactive {
		color: rgba(51, 51, 51, 1);
		font-weight: 500;
		margin-left: 30rpx;
	}

	.stepsbpx .speedbox .speed-item .speedheader .refundshenhe {
		width: 64rpx;
		height: 48rpx;
		position: absolute;
		z-index: 10;
		left: 11rpx;
		top: -7rpx;
	}

	.stepsbpx .speedbox .speed-item .speedheader .leftrefundshenhe {
		width: 32rpx;
		height: 32rpx;
		display: inline-block;
	}

	.stepsbpx .speedbox .speed-item .speedheader .notStarted {
		width: 18rpx;
		height: 18rpx;
		border-radius: 18rpx;
		background: #E6E6E6;
		position: absolute;
		z-index: 10;
		left: 24rpx;
		top: 5rpx;
	}

	.stepsbpx .speedbox .speed-item .line {
		position: absolute;
		border: 2rpx solid #F5F5F5;
		width: 0;
		height: calc(100%);
		left: 40rpx;
		top: 48rpx;
	}

	.stepsbpx .speedbox .speed-item .lineactive {
		border: 2rpx solid #05DB9B;
	}

	.stepsbpx .speedbox .speed-item .speedcon {
		padding: 0 80rpx;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #999;
		font-weight: 400;
		margin-top: 16rpx;
	}

	.stepsbpx .speedbox .speed-item .speedcon .speedcon-item {
		margin-bottom: 16rpx;
	}

	.stepsbpx .speedbox .speed-item .speedcon .speedcon-item:last-child {
		margin: 0;
	}
</style>