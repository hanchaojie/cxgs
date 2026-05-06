<template>
	<view class="">
		<view class="CameraBox" @click="openShow">
			<image src="/static/camera.png" class="cameraPng" mode="" />
			<view class="content">{{selecttwo}}</view>
			<u-icon name="list" size="24" style="margin-right: 20rpx;"></u-icon>
		</view>
		<view class="videoBox">
			<!-- 	<video is-live class="videoPLay" autoplay
				src="https://zwebl02.cztv.com/live/channel011080Pnew.m3u8?auth_key=1757570896-001e3f239b8044068a273028445ee414-0-ddf3bc8f37358263e55d6f6489da3cb4" /> -->
			<!-- <video is-live class="videoPLay" autoplay :src="videoUrl" /> -->
			<view class="videoBox_box">
				<videoPlay :videoObj="videoObj"></videoPlay>
			</view>
			<view style="display: flex; aligna-items: center;margin-left: 18rpx;font-weight: 700;margin-top: 24rpx;">
				<view class="blueLine"></view>
				<view>云台控制</view>
			</view>
			<view class='steeringWheel'>
				<view class="round"></view>
				<view class="smallround"></view>
				<view class="topTriangle" @click="upBtn">
				</view>
				<view class="downTriangle" @click="downBtn">
				</view>
				<view class="triangle_left" @click="leftBtn">
				</view>
				<view class="triangle_right" @click="rightBtn">
				</view>
			</view>
			<view class="setting">
				<view class="Zoom">
					<u-icon name="plus" color="#0366F1" style="margin-left: 20rpx;margin-right: 20rpx;"
						@click="zoomIn"></u-icon>
					缩放
					<u-icon name="minus" color="#0366F1" style="margin-left: 20rpx;margin-right: 20rpx;"
						@click="zoomOut" />
				</view>
				<view class="focus">
					<!-- <u-icon name="plus" color="#0366F1" style="margin-left: 20rpx;margin-right: 20rpx;"></u-icon> -->

					<view class="focusTxt">
						速度
					</view>
					<slider :value="sliderValue" @change="sliderChange" show-value />
					<!-- <u-icon name="minus" color="#0366F1" style="margin-left: 20rpx;margin-right: 20rpx;" /> -->
				</view>
			</view>
		</view>
		<uni-popup ref="videoPop" type="left" border-radius="10px 10px 0 0" background-color="#fff">
			<view class="popupBox">
				视频列表
				<!--<view class='search'>
					<view class='searchItem'>
						<input placeholder='请搜索'></input>
					</view>
				</view> -->
				<view style="margin-top:50rpx">
					<!-- <scroll-view scroll-y class="scrollY">
							<tree  :treeList="treeList" id="treeSelect"
							@clcik="treeClick"></tree>
						<tree :tree-data="treeList" @toggle="onToggle" />
					</scroll-view> -->
					<view v-for=" (item,index) in videoList" :key="index" @click="selectBtn(item,index)">
						<view :class="selectIdx == index ? 'GvideoListPlay':'videoListPlay'">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>

</template>

<script>
	import Tree from "@/components/tree.vue";
	import {
		videoMonitorList,
		getVideo,
		getVideocontrolling
	} from '@/units/request.js'
	import videoPlay from '@/components/videoPlay/index.vue'
	export default {
		props: ['checkData'],
		components: {
			Tree,
			videoPlay
		},
		data() {
			return {
				selecttwo: '',
				selectUrl: "",
				videoUrl: '',
				wrpId: '',
				sliderValue: 50,
				videoList: [],
				videoObj: '',
				selectIdx: 0


			}
		},
		mounted() {
			this.getvideoMonitorList()
		},
		onload(e) {

		},
		methods: {
			sliderChange(e) {
				console.log(e)
				this.sliderValue = e.detail.value
			},
			openShow() {
				this.$refs.videoPop.open('left')
			},
			selectBtn(e, indx) {
				this.selectIdx = indx
				this.selectId = this.videoList.find(i => i.name == e.name).videoId
				getVideo({
					cameraIndexCode: this.videoList.find(i => i.name == e.name).videoId,
					protocol: 'ws',
					recordLocation: 1
				}).then(Response => {
					this.videoObj = Response.data.data.url
					this.selecttwo = e.name
				})
				this.$refs.videoPop.close()
			},
			getvideoMonitorList() {
				videoMonitorList(`?wrpId=${this.checkData.wawoCode}`).then(res => {
					this.selecttwo = res.data.rows[0].name
					this.selectId = res.data.rows[0].id
					this.selectIdx = 0
					this.videoList = res.data.rows.map(e => {
						return {
							name: e.name,
							videoId: e.id
						}
					})
					if (res.data.code == 200 && res.data.rows.length > 0) {
						// getVideo()
						res.data.rows.map(e => {
							getVideo({
								cameraIndexCode: this.selectId,
								protocol: 'ws',
								recordLocation: 1
							}).then(Response => {
								this.videoObj = Response.data.data.url
							})
						})
					} else {
					}
				})
			},
			onToggle(node) {
				this.selecttwo = node.label
				this.selectUrl = node.extParams.mediaUrl
				this.$refs.videoPop.close()
			},
			upBtn() {
				getVideocontrolling({
					cameraIndexCode: this.selectId,
					command: "UP",
					speed: this.sliderValue

				}).then(res => {})
			},
			downBtn(){
				getVideocontrolling({
					cameraIndexCode: this.selectId,
					command: "DOWN",
					speed: this.sliderValue
				}).then(res => {})
			},
			leftBtn(){
				getVideocontrolling({
					cameraIndexCode: this.selectId,
					command: "LEFT",
					speed: this.sliderValue
				}).then(res => {})
			},
			rightBtn(){
				getVideocontrolling({
					cameraIndexCode: this.selectId,
					command: "RIGHT",
					speed: this.sliderValue
				}).then(res => {})
			},
			zoomIn(){
				getVideocontrolling({
					cameraIndexCode: this.selectId,
					command: "ZOOM_IN",
					speed: this.sliderValue
				}).then(res => {})
			},
			zoomOut(){
				getVideocontrolling({
					cameraIndexCode: this.selectId,
					command: "ZOOM_OUT",
					speed: this.sliderValue
				}).then(res => {})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.CameraBox {
		width: 662rpx;
		height: 84rpx;
		background-color: #fff;
		border-radius: 16rpx;
		margin-left: 32rpx;
		margin-top: 34rpx;
		padding-left: 24rpx;
		display: flex;
		align-items: center;
	}

	.content {
		margin-left: 20rpx;
		flex: 1;
	}

	.vanicon {
		margin-right: 32rpx;
	}

	.cameraPng {
		width: 48rpx;
		height: 48rpx;

	}

	.videoBox {
		width: 690rpx;
		height: 940rpx;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 20rpx;
		margin-left: 30rpx;
		margin-top: 22rpx;
		padding-top: 16rpx;

		.videoBox_box {
			width: 654rpx;
			height: 422rpx;
			border-radius: 20rpx;
			margin-left: 18rpx;
		}
	}

	.videoPLay {
		width: 654rpx;
		height: 390rpx;
		border-radius: 20rpx;
		margin-left: 18rpx;
		margin-top: 18rpx;
	}

	.blueLine {
		width: 4rpx;
		height: 32rpx;
		background-color: rgb(3, 102, 241);
		margin-right: 16rpx;
	}

	.steeringWheel {
		width: 280rpx;
		height: 280rpx;
		border-radius: 50%;
		background-color: #fff;
		margin-left: 205rpx;
		margin-top: 20rpx;
		position: relative;
		box-shadow: 0px 0px 24rpx 0px rgba(3, 102, 241, 0.1)
	}

	.round {
		width: 106rpx;
		height: 106rpx;
		border-radius: 50%;
		border: 2rpx solid rgb(3, 102, 241);
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.smallround {
		width: 95rpx;
		height: 95rpx;
		background-color: rgb(3, 102, 241);
		border-radius: 50%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.topTriangle {

		width: 0;
		height: 0;
		border-bottom: 24rpx solid rgb(3, 102, 241);
		border-left: 18rpx solid transparent;
		border-right: 18rpx solid transparent;
		position: absolute;
		top: 34.6rpx;
		left: 120rpx;
	}

	.downTriangle {
		width: 0;
		height: 0;

		border-top: 24rpx solid rgb(3, 102, 241);
		border-left: 18rpx solid transparent;
		border-right: 18rpx solid transparent;
		position: absolute;
		bottom: 34.6rpx;
		left: 120rpx;
	}

	.triangle_left {
		width: 0;
		height: 0;
		border-right: 24rpx solid rgb(3, 102, 241);
		border-top: 18rpx solid transparent;
		border-bottom: 18rpx solid transparent;
		position: absolute;
		top: 122rpx;
		left: 26.4rpx;
	}

	.triangle_right {
		width: 0;
		height: 0;
		border-left: 24rpx solid rgb(3, 102, 241);
		border-top: 18rpx solid transparent;
		border-bottom: 18rpx solid transparent;
		position: absolute;
		top: 122rpx;
		right: 26.4rpx;
	}

	.setting {
		width: 100%;
		margin-left: 30rpx;
		height: 64rpx;
		padding-left: 30rpx;
		display: flex;
		margin-top: 56rpx;
	}

	.Zoom {
		width: 220rpx;
		height: 64rpx;
		margin-right: 66rpx;
		border: 2rpx solid rgb(220, 227, 235);
		text-align: center;
		border-radius: 36rpx;
		line-height: 64rpx;
		position: relative;
		display: flex;
		align-items: center;


	}

	.cameraPng {
		width: 48rpx;
		height: 48rpx;

	}


	.focus {
		width: 350rpx;
		height: 64rpx;
		// margin-right: 56rpx;
		// border: 2rpx solid rgb(220, 227, 235);
		text-align: center;
		// border-radius: 36rpx;
		line-height: 64rpx;
		display: flex;
		align-items: center;

		.focusTxt {
			width: 100rpx;
		}
	}

	uni-slider {
		width: 300rpx;
	}

	.CameraBox {
		width: 662rpx;
		height: 84rpx;
		background-color: #fff;
		border-radius: 16rpx;
		margin-left: 32rpx;
		margin-top: 34rpx;
		padding-left: 24rpx;
		display: flex;
		align-items: center;
	}

	.content {
		margin-left: 20rpx;
		flex: 1;
	}

	.vanicon {
		margin-right: 32rpx;
	}

	.popupBox {
		/* width: 428rpx; */
		height: auto;
		margin-top: 80rpx;
		margin-left: 30rpx;
		padding: 40rpx 36rpx 0;
		background-color: #fff;
		// font-weight: 700;
		border-radius: 30rpx;

		.videoListPlay {
			line-height: 100rpx;
			color: #333;
		}

		.GvideoListPlay {
			color: green;
			line-height: 100rpx;
		}
	}

	.scrollY {
		height: calc(100vh - 340rpx);

	}

	view.search {
		display: flex;
		flex-direction: row;
		height: 68rpx;
		/* background: #efeff4; */
		align-items: center;
		border: 2rpx solid rgb(255, 255, 255);
		box-shadow: 0px 0px 8rpx 0px rgb(225, 232, 241);
		margin-top: 20rpx;
		border-radius: 38rpx;
	}

	view.searchItem {
		display: flex;
		width: 100%;
		background: #fff;
		flex-direction: row;
		border-radius: 10rpx;
		margin-right: 20rpx;
		margin-left: 20rpx;
	}

	view.searchItem image {
		height: 42rpx;
		width: 42rpx;
		align-self: center;
		margin-left: 10rpx;
		margin-right: 20rpx;
		position: absolute;
		right: 30rpx;
	}

	view.searchItem input {
		flex: 1;
		font-size: 30rpx;
	}
</style>