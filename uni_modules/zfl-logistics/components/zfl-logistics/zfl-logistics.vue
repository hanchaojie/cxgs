<template>
	<view class="logistics">
		<view v-for="(item, index) in list" :key="index" class="item">
			<view class="content">
				<!-- <view class="dot-container">
					<view class="dot" :class="{ active: index === 0 }"></view>
				</view> -->
				<image src="/static/headerImg.png" mode="" style="width: 62rpx;height: 62rpx;z-index:999"></image>
				<view class="info">
					<view class="info_L">
						<view class="status" v-if="item.actionType=='3' ||item.actionType=='4'">审核结果</view>
						<view class="status" v-if="item.actionType=='2'">处理结果</view>
						<view class="status" v-if="item.actionType=='1'">工单接收</view>
						<view class="status" v-if="item.actionType=='0'">工单派发</view>
						<view class="blue_btn" v-if="item.actionType=='0'">已下达</view>
						<view class="purple_btn" v-if="item.actionType=='1'">已接收</view>
						<view class="green_btn" v-if="item.actionType=='2'">已完成</view>
						<view class="blue_btn" v-if="item.actionType=='4'">已通过</view>
						<view class="red_btn" v-if="item.actionType=='3'">已驳回</view>
					</view>
					<!-- 	<text class="time">{{ item.time }}</text>
					<text class="description">{{ item.description }}</text> -->
					<view class="info_box">
						<view class="info_box_txt" style="font-size: 28rpx;margin-bottom: 24rpx;">
							{{getProcessLabel(item.actionType)}}人:<text
								style="color: rgba(51, 51, 51, 1);">{{item.actionUserName}}</text>
						</view>
						<view class="info_box_txt" style="font-size: 28rpx;margin-bottom: 18rpx;">
							时间:<text style="color: rgba(51, 51, 51, 1);">{{item.actionTime | futtilvalue1}}</text>
						</view>
						<view class="info_box_txt" v-if="item.actionType=='3' && item.remark !== ''">
							驳回原因: <text style="color: rgba(51, 51, 51, 1);">{{item.remark}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		queryDict,
	} from '@/units/request.js'
	import {
		dayjs
	} from '@/uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js'
	export default {
		name: 'ZflLogistics',
		props: {
			list: {
				type: Array,
				default: () => []
			}
		},
		mounted() {
			// this.gequeryDict()
		},
		filters: {
			futtilvalue1(e) {
				console.log(e)
				if (e) {
					return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM-DD HH:mm')))
				}
			},
		},
		methods: {
			// gequeryDict(){
			// 	queryDict(`?dictType=patrol_matter_process_action`).then(res=>{
			// 		console.log(res)
			// 		this.Dict = res.data.rows.map(e=>{
			// 			return {value:e.dictValue,label:e.dictLabel}
			// 		})
			// 	})
			// }
			getProcessLabel(actionType) {
				if (actionType === "0") {
					return "上报";
				}
				if (actionType === "1") {
					return "接收";
				}
				if (actionType === "2") {
					return "处理";
				}
				if (actionType === "3") {
					return "审核";
				}
				if (actionType === "4") {
					return "审核";
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.logistics {
		padding: 30rpx 32rpx;
		background-color: #ffffff;
		width: 622rpx;
		max-height: calc(100vh - 344rpx);
		overflow-y: scroll;
		border-radius: 16rpx;
		margin-left: 32rpx;
		margin-top: 30rpx;

		.item {
			position: relative;
			padding-bottom: 40rpx;
		}

		.item:not(:last-child)::after {
			content: '';
			position: absolute;
			left: 30rpx;
			top: 30rpx;
			bottom: 0;
			width: 1rpx;
			background-color: rgba(3, 102, 241, 0.1);
			// border: 1px solid rgba(3, 102, 241, 0.1)
		}

		.info {
			margin-left: 20rpx;
			flex: 1;

			.status {
				display: block;
				font-size: 28rpx;
				color: #333;
				font-weight: 700;
				margin-bottom: 4rpx;
			}

			.time {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 8rpx;
			}

			.description {
				display: block;
				font-size: 26rpx;
				color: #666;
				line-height: 1.4;
			}

			.info_box {
				width: 484rpx;
				height: auto;
				padding: 16rpx 24rpx 16rpx 24rpx;
				background: rgba(3, 102, 241, 0.05);
				border-radius: 12rpx;
				margin-top: 22rpx;
				// margin-bottom: 100rpx;
				font-size: 24rpx;

				.info_box_txt {
					color: rgba(86, 86, 86, 1);
					margin-top: 10rpx;
					margin-bottom: 10rpx;
				}
			}

			.info_L {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.blue_btn {
					width: 124rpx;
					height: 56rpx;
					border-radius: 74rpx;
					background: #0366F10D;
					line-height: 56rpx;
					text-align: center;
					color: #0366F1;
					font-size: 28rpx;
				}

				.purple_btn {
					width: 124rpx;
					height: 56rpx;
					border-radius: 74rpx;
					background: #B34AEB0D;
					line-height: 56rpx;
					text-align: center;
					color: #B34AEB;
					font-size: 28rpx;
				}

				.green_btn {
					width: 124rpx;
					height: 56rpx;
					border-radius: 74rpx;
					background: #0ABD670D;
					line-height: 56rpx;
					text-align: center;
					color: #0ABD67;
					font-size: 28rpx;
				}

				.red_btn {
					width: 124rpx;
					height: 56rpx;
					border-radius: 74rpx;
					background: #F439170D;
					line-height: 56rpx;
					text-align: center;
					color: #F43917;
					font-size: 28rpx;
				}
			}
		}
	}

	.content {
		display: flex;
		align-items: flex-start;
	}

	.dot-container {
		width: 30rpx;
		height: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.dot {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			background-color: #e0e0e0;

			&.active {
				width: 20rpx;
				height: 20rpx;
				background-color: #6c7fff;
				box-shadow: 0 0 0 6rpx rgba(111, 129, 255, 0.2);
			}
		}
	}
</style>