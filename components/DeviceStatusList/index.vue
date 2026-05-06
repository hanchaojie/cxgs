<template>
	<view class="device-status-list">
		<!-- 机电设备1 -->
		<view class="" v-for="(item,index) in checkList" v-if="checkList" @click="gotoNext(item)">
			<view class="device-item">
				<image src="/static/unischeck.png" mode="" v-if="item.status == null" class="checkedImg"></image>
				<image src="/static/ischeck.png" mode="" v-else class="checkedImg"></image>
				<text class="device-name">{{item.partName}} <text style="color: lightsalmon;">{{item.isBlueTooth?'(蓝牙连接成功)':''}}</text>
					<text :class="item.matterId?'redTxt':'blueTxt'" style="margin-left: 10rpx;"
						v-if="item.status !== null">{{item.matterId?`[异常]`:'[正常]'}}</text></text>
				<!-- <text></text> -->
				<image class="arrow" src="/static/arrowR.png"></image>
			</view>
			<image class="arrowLine" v-if="checkList.length - 1!==index" src="/static/arrow-right.png"></image>
		</view>
		<!-- PH调节设备 -->
		<!-- <view class="device-item">
			<image src="/static/unchecked.png" mode="" class="checkedImg"></image>
			<text class="device-name">{{device2Name}}</text>
			<text class="status abnormal">{{device2Status}}</text>
		</view>
		<image class="arrowLine" src="/static/arrow-right.png"></image> -->

	</view>
</template>

<script>
	export default {
		props: {
			// 文本区域位置 left：左  center：中  
			checkList: {
				type: Object,

			},
			isRecord: {
				type: Boolean,
				default: false
			}

		},
		data() {
			return {
				// 机电设备1数据
				tagText1: '未查',
				tagColor1: 'orange',
				device1Name: '机电设备1',
				// PH调节设备数据
				tagText2: '已查',
				tagColor2: 'green',
				device2Name: 'PH调节设备',
				device2Status: '异常',
				// 絮凝加药设备数据
				device3Name: '絮凝加药设备',
				device3Status: '正常'
			}
		},
		mounted() {
			console.log(this.checkList)
		},
		methods: {
			gotoNext(e) {
				console.log(e)
				if (this.isRecord) {
					this.$emit('gotoNext', e)
				} else {
					if (e.matterId) {
						uni.$u.toast('已巡查');
						return
					} else {
						this.$emit('gotoNext', e)
					}
				}





			}
		}
	}
</script>

<style scoped lang="scss">
	.device-status-list {
		background-color: #fff;
		min-height: 200rpx;
		border-radius: 10rpx;
	}

	.device-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15rpx 48rpx;

		/* border-bottom: 1rpx solid #f5f5f5; */
		.checkedImg {
			width: 64rpx;
			height: 48rpx;
			margin-top: 10rpx;
			margin-right: 20rpx;

		}
	}

	.arrowLine {
		width: 16rpx;
		height: 44rpx;
		margin-top: 10rpx;
		margin-left: 72rpx;
	}

	.tag {
		padding: 5rpx 10rpx;
		border-radius: 6rpx;
		color: #fff;
		font-size: 24rpx;
		margin-right: 10rpx;
	}

	.device-name {
		font-size: 32rpx;
		flex: 1;
		display: -webkit-box;
		/* 使用弹性盒模型 */
		-webkit-box-orient: vertical;
		/* 垂直排列子元素 */
		-webkit-line-clamp: 1;
		/* 限制显示的行数为3 */
		overflow: hidden;
		/* 隐藏溢出的内容 */
	}

	.redTxt {
		color: rgba(238, 58, 45, 1);
		font-size: 30rpx;
	}

	.blueTxt {
		color: rgba(3, 102, 241, 1);
		font-size: 30rpx;
	}

	.status {
		font-size: 28rpx;
	}

	.abnormal {
		color: red;
	}

	.normal {
		color: blue;
	}

	.arrow {
		width: 40rpx;
		height: 40rpx;
	}
</style>