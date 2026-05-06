<template>
	<view class="fixboxEX">
		<image src="/static/nodeta.png" mode=""></image>
		<view class="tac">
			暂无数据
		</view>
	</view>
</template>

<script>
	export default {
		name: "noDeta",
	}
</script>

<style scoped lang="less">
	.fixboxEX {
		// position: fixed;
		left: 0;
		top: 304rpx;
		width: 100%;
		height:calc(100% - 354rpx);

		image {
			width: 652rpx;
			height: 360rpx;
			margin-left: 48rpx;
			margin-top: 50%;
			// margin-right: 48rpx;
		}

		.tac {
			text-align: center;
			color: #666;
			font-size: 36rpx;
		}
	}
</style>