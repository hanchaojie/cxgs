<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='隐患上报'></head-nav>
		<view style="height: 176rpx;"></view>
		<view class="bigBox">
			<view class="title">{{ selectList.name }}</view>
			<view v-for="item in selectList.newName">
				<view style="font-size: 32rpx;margin-bottom: 16rpx;color: #565656;"> <text
						style="color: #FF3838;">*</text>{{ item.newName }}
				</view>
			</view>
			<textarea v-model="remark" class="textarea" placeholder="请输入隐患描述及说明" cols="30" rows="10"></textarea>
			<view
				style="display: flex;height: 80rpx;line-height: 80rpx;justify-content: space-between;margin-top: 40rpx;margin-bottom: 20rpx;border-bottom: 2rpx solid #f5f5f5;border-top: 2rpx solid #f5f5f5;">
				<view style="color: #565656;font-size: 32rpx;"><text style="color: #FF3838;">*</text>问题级别</view>
				<picker @change="bindPickerChange" :value="index" :range="array">
					<view class="" style="display: flex;align-items: center;">
						<view class="uni-input" style="color: #333;font-size: 32rpx;">{{ array[index] }}</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</picker>
			</view>
		</view>
		<view class="bigBox" style="padding-top: 30rpx;">
			<view class="imgBox">
				<view style="display: flex;justify-content: space-between;">
					<view style="color: #565656;font-size: 32rpx;">
						<text style="color: transparent;">*</text>图片上传<text
							style="color: #999;font-size: 24rpx;margin-left: 10rpx;">只限上传五张</text>
					</view>
					<xe-upload ref="XeUpload" :options="uploadOptions" @callback="handleUploadCallback"></xe-upload>
					<image @click="handleUploadClick" v-if="waitImage.length<5" src="/static/hazardReporting/merge.png"
						class="smallPng" mode="" />
				</view>
				<view style="display: flex;margin-top: 20rpx;margin-bottom: 20rpx;">
					<view v-for="(item,index) in waitImage" style="position: relative; " class="imgSize">
						<image :src="item" style="width: 112rpx; height: 112rpx;" bind:tap="showImg">
						</image>
						<image src="/static/hazardReporting/close.png" @click="deleteImg(index)"
							style="position: absolute;right: 10rpx;top: 14rpx;width: 28rpx;height: 28rpx;" mode="" />
					</view>
				</view>
			</view>
			<view class="imgBox" style="margin-top: 15rpx">
				<view style="display: flex;justify-content: space-between;">
					<view style="color: #565656;font-size: 32rpx;margin-left: 16rpx;">
						视频上传
						<xe-upload ref="XeUpload" :options="uploadOptions" @callback="handleUploadCallback"></xe-upload>
					</view>
					<image @click="handleUploadVideoClick" src="/static/hazardReporting/videoplay.png" class="smallPng"
						mode="" />
				</view>
				<view style="display: flex;margin-top: 20rpx;margin-bottom: 20rpx;">
					<video :src="videoUrl" show-center-play-btn='false' show-play-btn="true" controls v-if="videoUrl">
						<cover-image src="/static/hazardReporting/close.png" @click="deleteVideo"
							style="position: absolute;right: 10rpx;top: 14rpx;width: 28rpx;height: 28rpx;" mode="" />
					</video>
				</view>
			</view>
		</view>
		<view v-if="xcindex == 0" class="bigBox" style="padding-top: 20rpx;">
			<view class="imgBox">
				<xe-upload ref="xcXeUpload" :options="uploadOptions" @callback="xchandleUploadCallback"></xe-upload>
				<view style="display: flex;justify-content: space-between;">
					<view>
						<text style="color: red;">*</text> 处理后图片<text
							style="color: #999;font-size: 24rpx;margin-left: 10rpx;">只限上传五张</text>
					</view>
					<image @click="xchandleUploadClick" v-if="xcwaitImage.length<5"
						src="/static/hazardReporting/merge.png" class="smallPng" mode="" />
				</view>
				<view style="display: flex;margin-top: 20rpx;margin-bottom: 20rpx;">
					<view v-for="(item,key) in xcwaitImage" style="position: relative; " class="imgSize">
						<image :src="item" style="width: 112rpx; height: 112rpx;" bind:tap="xcshowImg">
						</image>
						<cover-image src="/static/hazardReporting/close.png" @click="xcdeleteImg(key)"
							style="position: absolute;right: 10rpx;top: -14rpx;width: 28rpx;height: 28rpx;" mode="" />
					</view>
				</view>
			</view>
			<view class="imgBox" style="margin-top: 20rpx;">
				<view style="display: flex;justify-content: space-between;">
					<view style="margin-left: 16rpx;">
						处理后视频
					</view>
					<image @click="xchandleUploadVideoClick" src="/static/hazardReporting/videoplay.png"
						class="smallPng" mode="" />
				</view>
				<view style="display: flex;margin-bottom: 20rpx;margin-top: 20rpx;">
					<video id="myVideo" :src="xcvideoUrl" show-center-play-btn='false' show-play-btn="true" controls
						v-if="xcvideoUrl">
						<cover-image src="/static/hazardReporting/close.png" @click="xcdeleteVideo"
							style="position: absolute;right: 10rpx;top: 14rpx;width: 28rpx;height: 28rpx;" mode="" />
					</video>
				</view>
			</view>
		</view>
		<view class="submit" @click="submitBtn">上报</view>
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		BaseUrl
	} from '@/units/api.js'
	export default {
		components: {
			HeadNav
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				array: ['轻微', '一般', '严重'],
				index: 0,
				xcindex: 1,
				xcarray: ['现场解决', '上传报修'],
				selectList: {},
				waitImage: [],
				imgOssList: [],
				waitImage: [],
				xcwaitImage: [],
				xcimgOssList: [],
				videoOssList: '',
				videoUrl: '',
				remark: '',
				roundsList: null,
				arrayName: "",
				vedioList: [],
				xcName: '现场解决',
				xcremark: '',
				xcvideoUrl: '',
				uploadOptions: {
					// url: 'http://192.168.31.185:3000/api/upload', // 不传入上传地址则返回本地链接
					url: `${BaseUrl}/system/oss/upload`,
					header: {
						'Authorization': uni.getStorageSync('Authorization')
					}
				},
				targetId: '',
				targetType: "",
				patrolId: "",
				titleName: '',
				stm: "",
				xcvideoOssList: '',



			}
		},
		onLoad(e) {
			console.log(e)
			this.patrolId = e.patrolId
			this.targetType = e.targetType
			this.targetId = e.targetId
			this.titleName = e.name
			this.stm = e.stm
			this.selectList = uni.getStorageSync('selectList')
			this.roundsList = uni.getStorageSync('roundsList')
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
			bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value

			},
			xcbindPickerChange(e) {
				this.xcindex = e.detail.value
			},
			handleUploadClick() {
				this.$refs.XeUpload.upload('image');
			},
			handleUploadVideoClick() {
				this.$refs.XeUpload.upload('video');
			},
			xchandleUploadClick() {
				this.$refs.xcXeUpload.upload('image');
			},
			xchandleUploadVideoClick() {
				this.$refs.xcXeUpload.upload('video');
			},
			handleUploadCallback(e) {
				console.log('UploadCallback', e);
				for (var i = 0; i < e.data.length; i++) {
					if (e.data[i].fileType == 'image') {
						this.imgOssList.push(e.data[i].response.data.ossId)
						this.waitImage.push(e.data[i].response.data.url)
					} else if (e.data[i].fileType == 'video') {
						this.videoOssList = e.data[i].response.data.ossId
						this.videoUrl = e.data[i].response.data.url
					}
				}
				console.log(this.imgOssList, ' this.imgOssList');
				console.log(this.waitImage, ' this.waitImage');
			},
			xchandleUploadCallback(e) {
				console.log('xchandleUploadCallback', e);

				for (var i = 0; i < e.data.length; i++) {
					if (e.data[i].fileType == 'image') {
						this.xcimgOssList.push(e.data[i].response.data.ossId)
						this.xcwaitImage.push(e.data[i].response.data.url)
					} else if (e.data[i].fileType == 'video') {
						this.xcvideoOssList = e.data[i].response.data.ossId
						this.xcvideoUrl = e.data[i].response.data.url
					}

				}
				console.log(this.xcimgOssList, ' this.xcimgOssList');
				console.log(this.xcwaitImage, ' this.xcwaitImage');
			},
			deleteImg(idx) {
				this.imgOssList.splice(idx, 1)
				this.waitImage.splice(idx, 1)
			},
			xcdeleteImg(idx) {
				this.xcimgOssList.splice(idx, 1)
				this.xcwaitImage.splice(idx, 1)
			},
			deleteVideo() {
				console.log('删除')
				this.videoOssList = ''
				this.videoUrl = ''
			},
			xcdeleteVideo() {
				console.log('删除')
				this.xcvideoOssList = ''
				this.xcvideoUrl = ''
			},
			submitBtn() {
				// console.log(this.roundsList)
				console.log(this.imgOssList)
				if (this.remark !== '') {
					this.roundsList.remark = this.remark
				}
				this.roundsList.lev = this.index + 1
				this.roundsList.treatType = this.xcindex + 1
				this.roundsList.source = this.targetType
				this.roundsList.patrolId = this.patrolId
				if (this.imgOssList.length == 0) {
					// uni.showToast({
					// 	title: '请选择一张图片',
					// 	icon: 'none',
					// })
					// return
				} else {
					this.roundsList.picFileList = this.imgOssList.map(e => {
						return {
							ossId: e
						}
					})
				}
				if (this.videoOssList !== '') {
					this.roundsList.videoFileList = [{
						ossId: this.videoOssList
					}]
				}
				// if (this.audioossId !== '') {
				// 	this.roundsList.audioFileList = [{
				// 		ossId: this.audioossId
				// 	}]

				// }
				if (this.xcindex == 0) {
					this.roundsList.processForm = {}
					if (this.xcremark !== '') {
						this.roundsList.processForm.remark = this.xcremark
					}
					if (this.xcimgOssList.length == 0) {
						uni.showToast({
							title: '请选择一张现场图片',
							icon: 'none',
						})
						return
					} else {
						this.roundsList.processForm.picFileList = this.xcimgOssList.map(e => {
							return {
								ossId: e
							}
						})
					}
					if (this.xcvideoOssList !== '') {
						this.roundsList.processForm.videoFileList = [{
							ossId: this.xcvideoOssList
						}]
					}
					// if (this.xcaudioossId !== '') {
					// 	this.roundsList.processForm.audioFileList = [{
					// 		ossId: this.xcaudioossId
					// 	}]
					// }
				}

				console.log(this.roundsList)
				uni.setStorageSync('yinhuanList', this.roundsList);
				console.log(
					`/pages/patrol/report?patrolId=${this.patrolId}&targetType=${this.targetType}&targetId=${this.targetId}`
				)
				// uni.redirectTo({
				// 	url: `/pages/patrol/report?name=${this.titleName}&stm=${this.stm}&patrolId=${this.patrolId}&targetType=${this.targetType}&targetId=${this.targetId}`
				// });
				uni.navigateBack()
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
	.bigBox {
		width: 644rpx;
		margin-left: 30rpx;
		margin-top: 40rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 12rpx 28rpx 0 28rpx;
	}

	.title {
		font-weight: 700;
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid rgba(99, 99, 99, .2);
		margin-bottom: 32rpx;
	}

	.textarea {
		width: 602rpx;
		height: 214rpx;
		margin-top: 8rpx;
		/* margin-left: 20rpx; */
		border-radius: 16rpx;
		font-size: 32rpx;
		padding: 16rpx 0 0 32rpx;
		color: #333;
		/* border: 2rpx solid #999; */
		background-color: #F4F5F9;
	}

	.smallPng {
		width: 42rpx;
		height: 34rpx;
	}

	.audio {
		width: 36rpx;
		height: 40rpx;
	}

	.imgBox {
		/* padding-bottom: 20rpx; */
	}

	.backImg {
		width: 100%;
		height: 240rpx;
		background-size: 100% 100%;
		margin-top: -226rpx;
		top: 0;
		left: 0;
		position: relative;
		z-index: -1;
	}

	.titleImg {
		height: 100%;
		width: 100%;
		z-index: -1;
		position: absolute;
		background-size: 100%;
	}

	.customclass {
		background-color: transparent !important;
	}






	.loader {
		position: fixed;
		top: 40%;
		left: 40%;
		display: flex;
	}

	.l,
	.l:nth-child(9) {
		margin: 0.15em;
		border-radius: 5em;
		width: 0.4em;
		background-color: #f12711;
		height: 3em;
		box-shadow: 1px 1px 4px black;
		animation: load_5186 cubic-bezier(.41, .44, .72, .69) 2s infinite;
	}

	.l:nth-child(2),
	.l:nth-child(8) {
		background-color: #f24e13;
		animation-delay: .25s;
	}

	.l:nth-child(3),
	.l:nth-child(7) {
		background-color: #f36915;
		animation-delay: .5s;
	}

	.l:nth-child(4),
	.l:nth-child(6) {
		background-color: #f48c17;
		animation-delay: .75s;
	}

	.l:nth-child(5) {
		background-color: #f5af19;
		animation-delay: 1s;
	}

	@keyframes load_5186 {
		0% {
			transform: scaleY(1);
		}

		100% {
			transform: scaleY(-1);
		}
	}



	.box {
		/* width: 100px; */
		height: 200rpx;
		width: 400rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 40%;
		left: 25%;
		margin: 0 auto;
		overflow: unset;
		background-color: transparent;
	}

	.circle-line-spin {
		position: relative;
		animation: circle-line 1.5s linear infinite;
	}

	.circle-line-spin text {
		display: block;
		width: 50%;
		height: 5px;
		opacity: .7;
		position: absolute;
		top: calc(50% - 2.5px);
		left: 0px;
		transform-origin: center right;
	}

	.circle-line-spin text::before {
		content: '';
		display: block;
		width: 15px;
		height: 5px;
		position: absolute;
		top: 0;
		right: 10px;
		background-color: #a8c992;
	}

	.circle-line-spin text:nth-child(1) {
		transform: rotate(0deg);
		animation-delay: 0.2s;
	}

	.circle-line-spin text:nth-child(2) {
		transform: rotate(45deg);
		animation-delay: 0.4s;
	}

	.circle-line-spin text:nth-child(3) {
		transform: rotate(90deg);
		animation-delay: 0.6s;
	}

	.circle-line-spin text:nth-child(4) {
		transform: rotate(135deg);
		animation-delay: 0.8s;
	}

	.circle-line-spin text:nth-child(5) {
		transform: rotate(180deg);
		animation-delay: 1s;
	}

	.circle-line-spin text:nth-child(6) {
		transform: rotate(225deg);
		animation-delay: 1.2s;
	}

	.circle-line-spin text:nth-child(7) {
		transform: rotate(270deg);
		animation-delay: 1.4s;
	}

	.circle-line-spin text:nth-child(8) {
		transform: rotate(315deg);
		animation-delay: 1.6s;
	}

	@keyframes circle-line {
		0% {
			transform: rotate(-360deg);
		}

		100% {
			transform: rotate(10deg);
		}
	}

	.imgSize {
		width: 112rpx;
		height: 112rpx;
		margin-right: 20rpx;
		border-radius: 10rpx;
	}

	video {
		width: 300rpx;
		height: 200rpx;
	}

	.submit {
		width: 700rpx;
		height: 80rpx;
		background: #0366F1;
		text-align: center;
		line-height: 80rpx;
		border-radius: 12rpx;
		font-size: 32rpx;
		color: #fff;
		margin-left: 24rpx;
		margin-top: 60rpx;
		margin-bottom: 40rpx;
	}

	.bigCircle {
		height: 166rpx;
		width: 166rpx;
		border-radius: 100%;
		background-color: #3370FF2E;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;

	}

	.smallCircle {
		width: 100rpx;
		height: 100rpx;
		background-color: #3370FF;
		border-radius: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.onVedio {
		background-color: #04D7B9 !important;
	}

	.item-list {
		width: 100rpx;
		height: 15rpx;
		display: flex;
		align-items: center;
	}

	.time {
		color: #0D296E;
		font-size: 24rpx;
	}

	.item {
		height: 24rpx;
		width: 4rpx;
		background-color: #3370FF33;
		margin-left: 5rpx;
	}

	.active {
		background-color: #3370FF;
	}

	.item:nth-child(6n-5),
	.item:nth-child(6n-1) {
		height: 4px;
	}

	.item:nth-child(6n-4),
	.item:nth-child(6n-2) {
		height: 8px;
	}

	.item:nth-child(6n-3) {
		height: 14px;
	}

	.vedio-file {
		width: 250rpx;
		height: 34px;
		background: #F5F5F5;
		border-radius: 34.5px;
		display: flex;
		align-items: center;
		/* padding: 0 10px; */
		box-sizing: border-box;
		justify-content: space-evenly;
	}

	.vedioDialog {
		height: 350px;
		width: 90%;
		background-color: white;
		box-shadow: 0px 0px 4px 6px rgba(91, 202, 151, 0.03);
		border-radius: 7px;
		position: absolute;
		top: calc(50% - 175px);
		right: 5%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;



	}

	.vedio-player {
		margin-top: 20px;
		display: flex;
		justify-content: center;
		align-items: center;


	}
</style>