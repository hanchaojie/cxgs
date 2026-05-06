<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" :textContent="defaultName"></head-nav>
		<view style="height: 176rpx;">
		</view>
		<view class="reportBox">
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					厂站名称
				</view>
				<view class="reportLine_R">
					{{infoDetail.projectName }}
					<!-- <uni-icons type="right" size="16" color="#999999"></uni-icons> -->
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					工单类型
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<!-- 		<u-number-box min="0" inputWidth="70" button-size="28" v-model="ph"
						@change="valChange"></u-number-box> -->
					<view class="">
						上报问题
					</view>
				</view>
			</view>
			<view class="reportLine" @click="openDictOrder">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					优先级
				</view>
				<view class="reportLine_R">
					<view class="reportLine_R">
						{{ orderTypeName}}
						<uni-icons type="right" size="16" color="#999999"></uni-icons>
					</view>
				</view>
			</view>
			<view class="reportLine" style="margin-bottom: 0rpx;">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					工单描述
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<!-- <uni-icons type="mic" size="30" color="#0366F1"></uni-icons> -->
				</view>
			</view>
			<textarea class="textareaBox" name="" id="" placeholder="请输入工单描述" v-model="infoDetail.remark"></textarea>
		</view>
		<view class="reportBox">
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					图片上传<text style="font-size: 24rpx;color: #999;">图片只限上传六张</text>
				</view>
				<view class="reportLine_R" style="display: flex;">
					<image src="/static/img.png" mode="" v-if="waitImage.length <6" style="width: 48rpx;height: 48rpx;"
						@click="openXeUpload">
					</image>
				</view>
			</view>
			<view class="" style="display: flex;">
				<view class="imgSize" v-for="(src,i) in waitImage">
					<image :src="src" mode="" style="width: 128rpx;height: 108rpx;margin-right: 10rpx;"
						@click="previewImage(src)"></image>
					<image src="/static/hazardReporting/close.png" @click="deleteImg(i)"
						style="position: absolute;right: 10rpx;top: 6rpx;width: 28rpx;height: 28rpx;" mode="" />
				</view>
			</view>

			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					视频
				</view>
				<view class="reportLine_R" style="display: flex;">
					<image src="/static/hazardReporting/videoplay.png" mode="" v-if="!videoUrl"
						style="width: 42rpx;height: 34rpx;" @click="openXeUploadVideo">
					</image>
					<image src="/static/hazardReporting/close.png" mode="" v-if="videoUrl"
						style="width: 28rpx;height: 28rpx;" @click="deleteVideo">
					</image>

				</view>
			</view>
			<DomVideoPlayer ref="domVideoPlayer" style="height: 400rpx;margin-bottom: 20rpx;" :src="videoUrl" loop
				controls muted v-if="videoUrl">
				<!-- 	<cover-image src="/static/hazardReporting/close.png" @click="deleteVideo"
					style="position: absolute;right: 10rpx;top: 14rpx;width: 28rpx;height: 28rpx;z-index: 999;"
					mode="" /> -->
			</DomVideoPlayer>
			<!-- <video :src="videoUrl" show-center-play-btn='false' show-play-btn="true" controls v-if="videoUrl"> -->
			<!-- </video> -->
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					计划完成时间
				</view>
				<view class="reportLine_R" style="display: flex;" @click="selectTime">
					{{finishTime | futtilvalue1}}
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-icon name="clock" style="margin-left: 10rpx;"></u-icon>
				</view>
			</view>
			<!-- <view class="reportLine" @click="selectpenpel"> -->
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					指派处理人
				</view>
				<view class="reportLine_R" style="display: flex;">
					{{penpelName}}
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->

				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					任务下达人
				</view>
				<view class="reportLine_R" @click="openTestShow">
					{{nowName}}
					<!-- testStatus -->
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					任务下达时间
				</view>
				<view class="reportLine_R" @click="openTestShow">
					{{nowTime}}
					<!-- testStatus -->
				</view>
			</view>


		</view>
		<view class="uploadSub" @click="uploadSub">
			上报
		</view>
		<xe-upload ref="XeUpload" :options="uploadOptions" @callback="handleUploadCallback"></xe-upload>
		<u-picker :closeOnClickOverlay="true" title='选择地区' :show="addressPopup" ref="uPicker" :columns="columns"
			@confirm="confirm" @cancel="cancel" @close="cancel" @change="changeHandler"></u-picker>


		<u-picker :show="penpelShow" closeOnClickOverlay :columns="penpelColumns" @confirm="penpelConfirm"
			@close="penpelClose" @cancel="penpelClose"></u-picker>

		<u-picker :show="dictOrderType" closeOnClickOverlay :columns="dictOrderTypeColumns" @confirm="dictConfirm"
			@close="dictCLose" @cancel="dictCLose"></u-picker>

		<u-datetime-picker :show="sptTimeshow" :minDate="minDate" v-model="finishTime" mode="date"
			@confirm="sptconfirmTime" closeOnClickOverlay @close="sptcloseTime"></u-datetime-picker>
		<u-datetime-picker :show="Timeshow" v-model="testTime" mode="datetime" @confirm="confirmTime"
			closeOnClickOverlay @close="closeTime"></u-datetime-picker>
		<uni-popup ref="centerPopup" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					是否确认工单上报?
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
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import DomVideoPlayer from '@/components/DomVideoPlayer/DomVideoPlayer.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		dayjs
	} from '@/uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js'
	import {
		GettreeByAddvcd,
		addOrder,
		queryDict,
		listUser,
		getMatterId,getUserByWawo
	} from '@/units/request.js'
	import {
		BaseUrl
	} from '@/units/api.js'
	export default {
		components: {
			HeadNav,
			DomVideoPlayer
		},
		data() {
			return {
				containerStyle: '',
				nowTime: dayjs(new Date().getTime()).format('YYYY-MM-DD'),
				nowName: uni.getStorageSync('getInfo').user.nickName,
				navStyle: '',
				navHeightValue: 0,
				defaultName: '工单上报',
				value: null,
				chroma: 0,
				ph: 0,
				turb: 0,
				cl: 0,
				codmn: 0,
				colony: 0,
				escherichiaColi: 0,
				odour: "0",
				visualObj: "0",
				checked: '无',
				rouyanchecked: "有",
				assigneeUserId:'',
				Timeshow: false,
				sptTimeshow: false,
				testStatusshow: false,
				selectDictOrder: false,
				dictOrderType: false,
				dictOrderTypeColumns: [],
				orderTypeName: '',
				orderName: '',
				remark: '',
				testStatusColumns: [
					['合格', '超标']
				],
				testStatus: '合格',
				dict: [],
				// finishTime: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
				minDate: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
				finishTime: null,
				testTime: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
				addressPopup: false,
				imgOssList: [],
				columns: [],
				columnData: [],
				allColumns: [],
				allUser: [],
				listUser: [],
				penpelColumns: [],
				penpelName: '',
				addvcdName: '',
				wawoCodeName: "",
				penpelShow: false,
				videoOssList: [],
				imgOssList: [],
				waitImage: [],
				matterId: "",
				infoDetail: {},
				videoUrl: null,
				uploadOptions: {
					// url: 'http://192.168.31.185:3000/api/upload', // 不传入上传地址则返回本地链接
					url: `${BaseUrl}/system/oss/upload`,
					header: {
						'Authorization': uni.getStorageSync('Authorization')
					}
				},
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
			this.QueryGettreeByAddvcd()
			this.getDict()
			this.getlistUser()

		},
		onLoad(e) {
			this.matterId = e.matterId
			this.getDetail(e.matterId)
		},
		filters: {
			futtilvalue1(e) {
				console.log(e)
				if (e) {
					return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM-DD')))
				}
			}
		},
		methods: {
			getDetail(e) {
				getMatterId(e).then(res => {
					console.log(res, 'res')
					this.infoDetail = res.data.data
					res.data.data.picFileList.map(e => {
						this.imgOssList.push(e.ossId)
						this.waitImage.push(e.url)
					})
					res.data.data.videoFileList.map(e => {
						this.videoOssList = e.ossId
						this.videoUrl = e.url
					})
					getUserByWawo(`?wawoCode=${res.data.data.projectId}`).then(Response => {
						console.log(Response)
						this.penpelName = Response.data.data[0].nickName
						this.assigneeUserId = Response.data.data[0].userId
					})
					console.log(this.videoUrl, 'videoUrl')
					console.log(this.videoOssList, 'videoOssList')
				})
			},
			getlistUser() {
				listUser().then(res => {
					console.log(res)
					this.listUser = res.data.rows
					this.penpelColumns = [res.data.rows.map(e => {
						return e.nickName
					})]
				})
			},
			deleteVideo() {
				this.videoUrl = ''
			},
			deleteImg(i) {
				console.log(i)
				this.imgOssList.splice(i, 1)
				this.waitImage.splice(i, 1)
			},
			getDict() {

				queryDict('?dictType=order_lev').then(res => {
					console.log(res, 'dict')
					this.dict = res.data.rows.map(e => {
						return {
							value: e.dictValue,
							label: e.dictLabel
						}
					})
					this.dictOrderTypeColumns = [res.data.rows.map(e => {
						return e.dictLabel
					})]
				})
			},
			openDictOrder() {
				// this.addressPopup = true
				// dictOrderTypeColumns
				this.dictOrderType = true
			},
			dictCLose() {
				this.dictOrderType = false
			},
			selectBtn(e) {
				this.addressPopup = true
			},
			dictConfirm(e) {
				console.log(e)
				this.orderTypeName = e.value[0]
				this.dictOrderType = false
			},
			penpelConfirm(e) {
				this.penpelName = e.value[0]
				this.penpelShow = false
			},
			selectpenpel() {
				this.penpelShow = true
			},
			previewImage(e) {
				var aa = []
				aa.push(e)
				uni.previewImage({
					urls: aa,
				});
			},
			testClose() {
				this.testStatusshow = false
			},
			sptconfirmTime(e) {
				console.log(e)
				this.sptTimeshow = false
				// console.log(dayjs(e.value).format('YYYY-MM-DD HH:mm'))
				this.finishTime = e.value
			},
			penpelClose() {
				this.penpelShow = false
			},
			openTestShow() {
				this.testStatusshow = true
			},
			sptcloseTime() {
				this.sptTimeshow = false
			},
			testConfirm(e) {
				console.log(e)
				this.testStatus = e.value[0]
				this.testStatusshow = false
			},
			QueryGettreeByAddvcd() {
				let firstColumns
				let twoColumns
				GettreeByAddvcd().then(res => {
					console.log(res)
					firstColumns = res.data.data[0].children.map(e => {
						return e.name
					})
					twoColumns = res.data.data[0].children[0].wawoList.map(e => {
						return e.wawoName
					})
					this.columns = [firstColumns, twoColumns]
					this.allColumns = res.data.data
					// this.columnData = res.data.data[0].children.map(e => {
					// 	return e.name
					// })
				})
			},
			changeHandler(e) {
				let firstColumns
				let twoColumns
				console.log(e)
				firstColumns = this.allColumns[0].children.map(e => {
					return e.name
				})
				twoColumns = this.allColumns[0].children[e.indexs[0]].wawoList.map(e => {
					return e.wawoName
				})
				this.columns = [firstColumns, twoColumns]
			},
			valChange(e) {
				console.log('当前值为: ' + e.value)
			},
			selectTime() {
				// this.Timeshow = true
				this.sptTimeshow = true
			},
			confirmTime(e) {
				console.log(e)
				this.Timeshow = false
				// console.log(dayjs(e.value).format('YYYY-MM-DD HH:mm'))
				this.testTime = e.value
			},
			confirm(e) {
				console.log(e)
				this.addvcdName = e.value[0]
				this.wawoCodeName = e.value[1]
				this.addressPopup = false
			},
			closeTime() {
				this.Timeshow = false
			},
			cancel() {
				this.addressPopup = false
			},
			openXeUpload() {
				this.$refs.XeUpload.upload('image');
			},
			openXeUploadVideo() {
				this.$refs.XeUpload.upload('video');
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

			findWawoCode(data, targetName) {
				// 遍历children数组
				for (const child of data.children) {
					// 遍历wawoList数组
					for (const wawo of child.wawoList) {
						// 检查wawoName是否匹配
						if (wawo.wawoName === targetName) {
							return wawo.wawoCode; // 找到匹配项，返回wawoCode
						}
					}
				}
				return null; // 未找到匹配项
			},
			closeCenterPop() {
				this.$refs.centerPopup.close()
			},
			uploadSub() {


				if (this.orderTypeName == '') {
					uni.$u.toast('请选择优先级');
					return
				}
				if (this.infoDetail.remark == '') {
					uni.$u.toast('请输入工单描述');
					return
				}
				if (this.imgOssList.length == 0) {
					// uni.$u.toast('请至少上传一张照片');
					// return
				}
				console.log(this.finishTime)
				if (this.finishTime == null) {
					uni.$u.toast('请选择计划完成时间');
					return
				}
				if (this.penpelName == '') {
					uni.$u.toast('请选择指派处理人');
					return
				}

				this.$refs.centerPopup.open('center')





			},
			gotoPatrolDetail() {

				console.log(this.dict)
				console.log(this.videoOssList)
				let a = {
					remark: this.infoDetail.remark,
					// orderName: this.orderName,
					lev: this.dict.find(e => e.label == this.orderTypeName).value,
					// assigneeUserId: this.listUser.find(e => e.nickName == this.penpelName).userId,
					assigneeUserId: this.assigneeUserId,
					finishTime: `${dayjs(this.finishTime).format('YYYY-MM-DD')} 00:00:00`,
					// addvcd: this.allColumns[0].children.find(e => e.name == this.addvcdName).addvcd,
					projectId: this.infoDetail.projectId,
					picFileList: this.imgOssList.map(e => {
						return {
							ossId: e
						}
					}),
					videoFileList: this.videoOssList.length ? [{
						ossId: this.videoOssList
					}] : [],
					orderType: '1',
					orderRefId: this.matterId

				}
				console.log(a)
				addOrder(a).then(res => {
					console.log(res)
					uni.$u.toast('新增成功');
					setTimeout(() => {
						uni.navigateBack({
							delta: 2
						})
					}, 500)

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
	::v-deep .u-radio-group--row {
		justify-content: space-between;
	}

	video {
		width: 300rpx;
		height: 200rpx;
	}

	.uploadSub {
		width: 686rpx;
		height: 88rpx;
		border-radius: 16rpx;
		background: rgba(3, 102, 241, 1);
		margin-left: 32rpx;
		text-align: center;
		line-height: 88rpx;
		color: #fff;
		margin-top: 100rpx;
	}

	.reportBox {
		width: 630rpx;
		height: auto;
		margin-left: 32rpx;
		margin-top: 22rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 28rpx 32rpx 20rpx 24rpx;

		.reportLine {
			display: flex;
			justify-content: space-between;
			margin-bottom: 36rpx;

			.reportLine_L {
				font-size: 32rpx;
				color: #565656;
				font-family: "Microsoft YaHei";
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
					font-size: 28rpx;
					font-family: "Microsoft YaHei";
					color: #333;
				}
			}
		}

		.imgSize {
			width: 128rpx;
			height: 108rpx;
			display: flex;
			position: relative;
		}


		.textareaBox {
			background: rgba(244, 245, 249, 1);
			border-radius: 12rpx;
			height: 132rpx;
			padding: 14rpx 16rpx;
			width: 596rpx;
			color: #333;
			font-family: "Microsoft YaHei";
			font-size: 32rpx;
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
</style>