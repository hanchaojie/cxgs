<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" :textContent='titleName'></head-nav>
		<view style="height: 176rpx;"></view>
		<view class="map">
			<leaflet :checkList="checkList"></leaflet>
		</view>
		<!-- 	<view class="poFixed">
			<view class="poFixedL">
				<image src="/static/duration.png" mode="" class="poFixedImg"></image>
				<view class="poFixedL_L">
					<view class="poFixedL_time">
						{{timeLong}}
					</view>
					<view class="poFixedL_txt">
						已巡查时长
					</view>
				</view>
			</view>
			<view class="poFixedR">
				<image src="/static/numberQuestions.png" mode="" class="poFixedImg"></image>
				<view class="poFixedR_R">
					<view class="poFixedL_time">
						{{problemNum}}个
					</view>
					<view class="poFixedL_txt">
						上报问题
					</view>
				</view>
			</view>
		</view> -->
		<view class="btmBox" :style="{height: isCheckHeight?'750rpx':'180rpx'}">
			<image :src="isCheckHeight?'/static/line.png':'/static/topLine.png'" @click.stop="TlcHeight" mode=""
				class="lineSize"></image>
			<view class="route" @click="ReportView" v-if="isCheckHeight">
				巡查路线
			</view>
			<view class="" style="overflow-y: scroll;max-height: 550rpx;">
				<DeviceStatusList :checkList="checkList" v-if="checkList!==null" @gotoNext="gotoNext" />
			</view>
			<view class="endPatrol" @click="openPopup">
				过程图片
			</view>
			<view class="endPatrolRght" @click="endPatrol">
				结束巡查
			</view>



		</view>
		<view class="centerPopup" v-if="disPlayBN">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					是否结束当前巡查?
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
		</view>



		<view class="centerPopup" v-show="showImg" @click="closeImg">
			<view class="imageUpload" @click.stop>
				<view style="display: flex;margin-top: 20rpx;flex-wrap: wrap;">
					<view v-for="(img, idx) in waitImage" :key="idx"
						style="position: relative;margin-bottom: 40rpx;margin-right: 30rpx; " class="imgSize">
						<image :src="img.url" style="width: 140rpx; height: 140rpx;" @click="showImage(img.url)">
						</image>
						<uni-icons v-if="img.url !=='../../static/download.png'" type="closeempty"
							@click="deleteImg(img)" size="20"
							style="position: absolute;right: -20rpx;top: -14rpx;"></uni-icons>
					</view>
					<!-- 	<image src="../../static/download.png" class="imgSize" @click="handleUploadClick"
						v-if="waitImage.length < 9"> 
					</image>-->
				</view>
			</view>
		</view>
		<xe-upload ref="XeUpload" :options="uploadOptions" @callback="handleUploadCallback"></xe-upload>
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import leaflet from '@/components/patrolMap.vue'
	import DeviceStatusList from '@/components/DeviceStatusList/index.vue';
	import {
		BaseUrl
	} from '@/units/api.js'
	import {
		wgs84_to_gcj02,
		getDistance
	} from '../../units/units.js'
	import {
		getTargetList,
		timeDifference,
		getCheckList,
		finishXuncha,
		getPatrolId,
		getCommonFile,
		postCommonFile,
		delectCommonFile
	} from '@/units/request.js'
	export default {
		components: {
			HeadNav,
			leaflet,
			DeviceStatusList
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				defaultValue: 1,
				searchValue: "",
				telescopicHeight: "900rpx",
				isCheckHeight: true,
				disPlayBN: false,
				showImg: false,
				waitImage: [{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
				],
				imgList: [{
					url: '/static/citywaterworks.png',
					unurl: '/static/uncitywaterworks.png',
					checkBoolear: true,
					name: '城市水厂'
				}, {
					url: '/static/townwaterworks.png',
					unurl: '/static/untownwaterworks.png',
					checkBoolear: false,
					name: '乡镇水厂'
				}, {
					url: '/static/Liancun.png',
					unurl: '/static/unLiancun.png',
					checkBoolear: true,
					name: '联村水厂'
				}, {
					url: '/static/SingleVillage.png',
					unurl: '/static/unSingleVillage.png',
					checkBoolear: true,
					name: '单村水厂'
				}],
				planId: '',
				taskType: '',
				taskFrequency: '',
				hasQr: '',
				patrolId: '',
				showLoading: false,
				bluetoothData: [],
				bluetoothList: [],
				checkList: null,
				problemNum: 0,
				stm: '',
				timeLong: '',
				titleName: '',
				uploadOptions: {
					// url: 'http://192.168.31.185:3000/api/upload', // 不传入上传地址则返回本地链接
					url: `${BaseUrl}/system/oss/upload`,
					header: {
						'Authorization': uni.getStorageSync('Authorization')
					}
				},


			}
		},
		onLoad(e) {
			var that = this

			that.planId = e.planId
			that.taskType = e.taskType
			that.taskFrequency = e.taskFrequency
			that.hasQr = e.hasQr
			that.stm = e.stm
			that.titleName = e.name
			console.log(e.stm)

			if (e.patrolId) {
				that.patrolId = e.patrolId

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
			this.queryGetCommonFile()


		},
		onShow() {
			this.querygetCheckList()
			this.queryPatrolId(this.patrolId)
		},
		methods: {
			openPopup() {
				this.showImg = true
				// this.$refs.popup.open('center')
			},
			closeImg() {
				this.showImg = false
			},
			deleteImg(img) {
				console.log(img)
				delectCommonFile(img.id).then(res => {
					console.log(res)
					if (res) {
						this.queryGetCommonFile()
					}
				})
			},
			showImage(e) {
				if (e == '../../static/download.png') {
					// this.handleUploadClick()
					this.$refs.XeUpload.upload('image');
				} else {
					var aa = []
					aa.push(e)
					uni.previewImage({
						urls: aa,
					});
				}

			},
			handleUploadCallback(e) {
				for (var i = 0; i < e.data.length; i++) {
					if (e.data[i].fileType == 'image') {
						// this.imgOssList.push(e.data[i].response.data.ossId)
						postCommonFile({
							ossId: e.data[i].response.data.ossId,
							biz: this.patrolId,
							module: 'PATROL_RECORD',
							subModule: 'PIC'
						}).then(Response => {
							// console.log("Response", Response)
						})
						// this.waitImage.push(e.data[i].response.data.url)
					}
					// else if (e.data[i].fileType == 'video') {
					//        this.videoOssList = e.data[i].response.data.ossId
					//        this.videoUrl = e.data[i].response.data.url
					//    }

				}
				setTimeout(() => {
					this.queryGetCommonFile()
				}, 300);
			},
			queryGetCommonFile() {
				this.waitImage = [{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
					{
						url: '../../static/download.png'
					},
				]
				getCommonFile(`?biz=${this.patrolId}&module=PATROL_RECORD&subModule=PIC`).then(res => {
					console.log(res)
					if (res.data.length == 0) {

					} else {
						for (let i = 0; i < res.data.length && i < this.waitImage.length; i++) {
							this.waitImage[i].url = res.data[i].url;
							this.waitImage[i].id = res.data[i].id;
						}

						this.waitImage = JSON.parse(JSON.stringify(this.waitImage))
					}
				})
			},
			TlcHeight() {
				this.isCheckHeight = !this.isCheckHeight
				if (!this.isCheckHeight) {
					this.checkList = null
				} else {
					this.querygetCheckList()
				}
			},
			closeCenterPop() {
				this.disPlayBN = false
			},
			gotoPatrolDetail() {
				finishXuncha(`?patrolId=${this.patrolId}`).then(res => {
					if (res.data.code == 200) {
						this.disPlayBN = false
						uni.navigateBack()
					}
				})
			},
			queryPatrolId(e) {
				getPatrolId(e).then(res => {
					console.log(res)
					this.timeLong = timeDifference(res.data.data.stm)
				})
			},
			checkAllStatusNotNull(data) {
				// 检查输入
				if (!data || !Array.isArray(data)) {
					return true;
				}

				// 空数组视为满足条件
				if (data.length === 0) {
					return true;
				}

				// 遍历数组
				for (var i = 0; i < data.length; i++) {
					var item = data[i];

					// 如果当前项的 status 为 null，返回 false
					if (item && item.status === null) {
						return false;
					}
				}

				// 所有项的 status 都不为 null
				return true;
			},
			endPatrol() {
				console.log(this.checkList)
				if (this.checkAllStatusNotNull(this.checkList)) {
					this.disPlayBN = true
				} else {
					uni.$u.toast('点位全部巡查完成后才可结束巡查');
				}
			},
			querygetCheckList() {

				getCheckList(`?patrolId=${this.patrolId}`).then(ress => {
					console.log(ress)
					this.checkList = this.uniqueByPartId(ress.data.data)
					if (this.checkList.some(item => item.bluetoothCode !== null)) {
						this.initBlue()

						// setTimeout(() => {
						// 	this.discovery()
						// }, 0);
					}

					console.log(this.checkList)
					this.problemNum = this.checkList.filter(item => item.matterId !== null).length;
					console.log(this.problemNum)
				})
			},
			uniqueByPartId(arr) {
				const seen = {}; // 用于记录已出现的partId
				return arr.filter(item => {
					const partId = item.partId;
					// 如果partId未出现过，则保留该元素，并标记为已出现
					if (!seen[partId]) {
						seen[partId] = true;
						return true;
					}
					// 已出现过则过滤掉
					return false;
				});
			},
			gotoLogin() {
				console.log('sdasdsadas')
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			gotoNext(e) {
				console.log(e)





				let that = this
				if (e.isBlueTooth) {
					if (e.status == null) {
						wx.removeStorageSync('yinhuanList')
						wx.removeStorageSync('matterList')
						wx.removeStorageSync('projectList')
						if (e.targetType == '1') {
							uni.navigateTo({
								url: `/pages/patrol/report?name=${that.titleName}&stm=${that.stm}&patrolId=${that.patrolId}&targetType=${e.targetType}&targetId=${e.projectId}`
							});
						} else if (e.targetType == '2') {
							uni.navigateTo({
								url: `/pages/patrol/report?name=${that.titleName}&stm=${that.stm}&patrolId=${that.patrolId}&targetType=${e.targetType}&targetId=${e.partId}`
							});
						} else if (e.targetType == '3') {
							uni.navigateTo({
								url: `/pages/patrol/report?name=${that.titleName}&stm=${that.stm}&patrolId=${that.patrolId}&targetType=${e.targetType}&targetId=${e.facilityId}`
							});
						}
					} else {
						uni.$u.toast('已巡查');
					}
				} else {
					uni.getLocation({
						type: 'wgs84',
						success: function(res) {
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);
							let nowLocat = wgs84_to_gcj02(res.longitude, res.latitude)
							console.log('当前新位置gcj02坐标：' + nowLocat);
							// const dist1 = getDistance(e.lttd, e.lgtd, nowLocat[1], nowLocat[0]);
							const dist1 = getDistance(e.lttd, e.lgtd, res.latitude, res.longitude);
							console.log('相差多少米' + parseInt(dist1));

							if (parseInt(dist1) < 300) {

								if (e.status == null) {
									wx.removeStorageSync('yinhuanList')
									wx.removeStorageSync('matterList')
									wx.removeStorageSync('projectList')
									if (e.targetType == '1') {
										uni.navigateTo({
											url: `/pages/patrol/report?name=${that.titleName}&stm=${that.stm}&patrolId=${that.patrolId}&targetType=${e.targetType}&targetId=${e.projectId}`
										});
									} else if (e.targetType == '2') {
										uni.navigateTo({
											url: `/pages/patrol/report?name=${that.titleName}&stm=${that.stm}&patrolId=${that.patrolId}&targetType=${e.targetType}&targetId=${e.partId}`
										});
									} else if (e.targetType == '3') {
										uni.navigateTo({
											url: `/pages/patrol/report?name=${that.titleName}&stm=${that.stm}&patrolId=${that.patrolId}&targetType=${e.targetType}&targetId=${e.facilityId}`
										});
									}
								} else {
									uni.$u.toast('已巡查');
								}

							} else {
								uni.$u.toast('距离目的地太远，请到达指定目的地后巡查');
								return
							}
						}
					});
				}

			},
			initBlue() {
				let that = this
				uni.openBluetoothAdapter({
					success(res) {
						// console.log('初始化蓝牙成功')
						// console.log(res)
						that.discovery()
					},
					fail(err) {
						// console.log('初始化蓝牙失败')
						// console.error(err)
					}
				})
			},
			// ArrayBuffer转16进度字符串示例
			ab2hex(buffer) {
				const hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('')
			},
			discovery() {

				var that = this
				that.bluetoothList = []
				uni.startBluetoothDevicesDiscovery({
					success(res) {
						// console.log('开始搜索', res)
						that.showLoading = true
						// 开启监听回调
						uni.onBluetoothDeviceFound(function(resphone) {
							// console.log(resphone, '---')
							if (resphone.devices[0].RSSI > -99) {
								// console.log(resphone, '99')
								that.bluetoothList.push(resphone.devices[0].deviceId)
								// console.log(that.bluetoothList)
								const result = that.bluetoothList.map(item => item.toString()).join(',');
								// console.log(result)






								uni.getBluetoothDevices({
									success(ressss) {
										console.log(ressss)

										// 1. 从数组B中提取所有 deviceId，并存入一个 Set 中以便快速查找
										const deviceIdSet = new Set(ressss.devices.map(device =>
											device.deviceId));

										// 2. 遍历数组A，为每个对象添加 isBlueTooth 字段
										that.checkList.forEach(item => {
											// 检查当前项的 bluetoothCode 是否在 deviceIdSet 中
											if (deviceIdSet.has(item.bluetoothCode)) {
												item.isBlueTooth = true;
											} else {
												// 如果没有匹配，也可以选择设置为 false 或不添加该字段
												// 这里我们选择添加并设为 false，以保持数据结构一致性
												item.isBlueTooth = false;
											}
										});
										that.checkList = JSON.parse(JSON.stringify(that.checkList))
										// 3. 打印结果
										console.log(JSON.parse(JSON.stringify(that.checkList)));
										// if (res.devices[0]) {
										// 	console.log(that.ab2hex(res.devices[0].advertisData))
										// }
									}
								})
								// setTimeout(() => {
								// 	console.log(
								// 		`?planId=${that.planId}&lttd=&lgtd=&bluetoothCodes=${result}`
								// 	)
								// 	getTargetList(
								// 		`?planId=${that.planId}&lttd=&lgtd=&bluetoothCodes=${result}`
								// 	).then(r => {
								// 		console.log(r, 'r')
								// 		if (r.data.code == 200) {
								// 			that.bluetoothData = JSON.parse(JSON.stringify(
								// 				r.data.data))
								// 			uni.getBluetoothDevices({
								// 				success(resphone) {
								// 					that.getBluetoothList =
								// 						resphone.devices
								// 				}
								// 			})
								// 		}
								// 	})
								// }, 3000);
							}

						})

					},
					fail(err) {
						// console.log('搜索失败')
						// console.error(err)
					}
				})
				setTimeout(() => {
					uni.closeBluetoothAdapter({
						success(res) {
							// console.log(res)
							that.initBlue()

						}
					})
				}, 8000);
			},

			ReportView() {
				uni.navigateTo({
					url: '/pages/patrol/report'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.absolute {
		.map {
			width: 100%;
			height: calc(100vh - 176rpx);
			// height: 1000rpx;
			// top: 176rpx;
			bottom: 0;
			position: absolute;
		}

		.poFixed {
			width: 610rpx;
			height: 104rpx;
			background-color: #fff;
			border-radius: 16rpx;
			position: fixed;
			top: 208rpx;
			z-index: 999;
			margin-left: 30rpx;
			z-index: 999;
			display: flex;
			padding: 24rpx 40rpx 0;
			justify-content: space-between;

			.poFixedL {
				display: flex;

				.poFixedL_L {
					margin-left: 24rpx;

					.poFixedL_time {
						color: rgba(51, 51, 51, 1);
						font-family: "Microsoft YaHei";
						font-size: 32rpx;
						line-height: 48rpx;
					}

					.poFixedL_txt {
						color: rgba(86, 86, 86, 1);
						font-size: 24rpx;
						font-weight: 400;
						line-height: 36rpx;
					}
				}



				.poFixedImg {
					width: 80rpx;
					height: 80rpx;
				}
			}

			.poFixedR {
				display: flex;

				.poFixedR_R {
					margin-left: 24rpx;

					.poFixedL_time {
						color: rgba(51, 51, 51, 1);
						font-family: "Microsoft YaHei";
						font-size: 32rpx;
						line-height: 48rpx;
					}

					.poFixedL_txt {
						color: rgba(86, 86, 86, 1);
						font-size: 24rpx;
						font-weight: 400;
						line-height: 36rpx;
					}
				}

				.poFixedImg {
					width: 80rpx;
					height: 80rpx;
				}
			}

		}

		.btmBox {
			width: 750rpx;
			height: 900rpx;
			background-color: #fff;
			border-radius: 16rpx 16rpx 0 0;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 999;

			.lineSize {
				width: 688rpx;
				height: 14rpx;
				margin-left: 32rpx;
			}

			.route {
				padding-left: 32rpx;
				margin-top: 30rpx;
				color: rgba(51, 51, 51, 1);
				font-size: 28rpx;
				font-weight: 400;
				line-height: 36rpx;
			}

			.endPatrol {
				width: 300rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 44rpx;
				// margin-left: 32rpx;
				left: 32rpx;
				bottom: 30rpx;
				position: absolute;
				background: linear-gradient(112.20deg, #FBD092, #F47717 100%);
				color: rgba(255, 255, 255, 1);
				font-size: 30rpx;
			}

			.endPatrolRght {
				width: 300rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 44rpx;
				// margin-left: 32rpx;
				right: 32rpx;
				bottom: 30rpx;
				position: absolute;
				background: linear-gradient(112.20deg, rgba(112.28693389892578, 191.46656799316406, 247.03125, 1), rgba(38.70535659790039, 116.93612670898438, 212.87945556640625, 1) 100%);
				color: rgba(255, 255, 255, 1);
				font-size: 30rpx;
			}
		}



		.centerPopup {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background: rgba(51, 51, 51, 0.5);
			z-index: 999;

			.centerPop {
				width: 610rpx;
				height: 374rpx;
				background-image: url('/static/header.png');
				background-repeat: no-repeat;
				background-color: #fff;
				border-radius: 20rpx;
				background-size: 100%;
				padding-top: 24rpx;

				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);

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
					margin-top: 34rpx;
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

			.imageUpload {
				width: 520rpx;
				height: 600rpx;
				background-color: #fff;
				border-radius: 20rpx;
				padding: 40rpx 20rpx 40rpx 60rpx;
				position: absolute;
				left: 10%;
				top: 20%;

				.imgSize {
					width: 140rpx;
					height: 140rpx;
					// margin-right: 20rpx;
					border-radius: 10rpx;
				}
			}
		}


	}
</style>