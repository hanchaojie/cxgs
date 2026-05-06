<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" :textContent="defaultName"></head-nav>
		<view style="height: 176rpx;">
		</view>
		<view class="reportBox">
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					工程名称
				</view>
				<view class="reportLine_R" @click="selectBtn">
					{{addvcdName || '请选择'}}
					<uni-icons type="right" size="16" color="#999999"></uni-icons>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					部位名称
				</view>
				<view class="reportLine_R" @click="buweiBtn">
					{{partName || '请选择'}}
					<uni-icons type="right" size="16" color="#999999"></uni-icons>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					设施设备名称
				</view>
				<view class="reportLine_R" @click="shebeiBtn">
					{{facilityName || '请选择'}}
					<uni-icons type="right" size="16" color="#999999"></uni-icons>
				</view>
			</view>

			<view class="reportLine" style="margin-bottom: 0rpx;">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					维修原因
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<!-- 	<view class="" @touchstart="start" @touchend="end">
						<uni-icons type="mic" size="30" color="#0366F1"></uni-icons>
					</view> -->
				</view>
			</view>
			<textarea class="textareaBox" name="" id="" placeholder="请输入维修原因" v-model="remark"></textarea>
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
				<view v-for="(item,index) in waitImage" style="position: relative; " class="imgSize">
					<image :src="item" style="width: 128rpx;height: 108rpx;margin-right: 10rpx;"
						@click="previewImage(item)">
					</image>
					<image src="/static/hazardReporting/close.png" @click="deleteImg(index)"
						style="position: absolute;right: 10rpx;top: 14rpx;width: 28rpx;height: 28rpx;" mode="" />
				</view>
			</view>
			<view class="reportLine" style="margin-bottom: 0;">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					视频上传
				</view>
				<view class="reportLine_R" style="display: flex;">



					<image src="/static/hazardReporting/videoplay.png" mode="" v-if="!videoUrl"
						style="width: 42rpx;height: 34rpx;" @click="videoopenXeUpload">
					</image>
					<image src="/static/hazardReporting/close.png" mode="" v-if="videoUrl"
						style="width: 28rpx;height: 28rpx;" @click="deleteVideo">
					</image>
				</view>
			</view>
			<view class="" style="margin-bottom: 36rpx;">
				<DomVideoPlayer ref="guochengdomVideo" style="height: 400rpx;" :src="videoUrl" loop controls muted
					v-if="videoUrl" />
			</view>
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
					<!-- 	请选择-->
					<!-- <uni-icons type="right" size="16" color="#999999"></uni-icons> -->
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
		<view :class="longPress == '1' ? 'record-layer' : 'record-layer1'">
			<view :class="longPress == '1' ? 'record-box' : 'record-box1'">
				<view class="prompt-layer prompt-layer-1" v-if="longPress == '2'">
					<view class="prompt-loader">
						<view class="em" v-for="(item,index) in 15" :key="index"></view>
					</view>
					<text class="span">松手结束录音</text>
				</view>
			</view>
		</view>
		<xe-upload ref="XeUpload" :options="uploadOptions" @callback="handleUploadCallback"></xe-upload>
		<u-picker :closeOnClickOverlay="true" title='选择工程' :show="addressPopup" ref="uPicker" :columns="columns"
			@confirm="confirm" @cancel="cancel" @close="cancel" @change="changeHandler"></u-picker>
		<u-picker :closeOnClickOverlay="true" title='选择部位' :show="partPopup" ref="uPicker" :columns="partcolumns"
			@confirm="partconfirm" @cancel="partcancel" @close="partcancel" @change="partchangeHandler"></u-picker>
		<u-picker :closeOnClickOverlay="true" title='选择设施设备' :show="facilityPopup" ref="uPicker"
			:columns="facilitycolumns" @confirm="facilityconfirm" @cancel="facilitycancel"
			@close="facilitycancel"></u-picker>
		<u-picker :show="penpelShow" closeOnClickOverlay :columns="penpelColumns" @confirm="penpelConfirm"
			@close="penpelClose" @cancel="penpelClose"></u-picker>
		<u-picker :show="dictOrderType" closeOnClickOverlay :columns="dictOrderTypeColumns" @confirm="dictConfirm"
			@close="dictCLose" @cancel="dictCLose"></u-picker>
		<u-datetime-picker :show="sptTimeshow" :minDate="minDate" v-model="finishTime" mode="datetime"
			@confirm="sptconfirmTime" closeOnClickOverlay @close="sptcloseTime"></u-datetime-picker>
		<u-datetime-picker :show="Timeshow" v-model="testTime" mode="datetime" @confirm="confirmTime"
			closeOnClickOverlay @close="closeTime"></u-datetime-picker>
		<yimo-AudioTrans ref="yimoAudioTransRefs" :options="options" @countDown="countDown" @result="resultMsg"
			@onStop="onStop" @onOpen="onOpen" @change="change"></yimo-AudioTrans>
		<uni-popup ref="centerPopup" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					是否确认发起维修?
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
		getprojectList,
		getpartList,
		getFacilityList,
		addRecord,getUserByWawo
	} from '@/units/request.js'
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
				nowTime: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
				nowName: uni.getStorageSync('getInfo').user.nickName,
				navStyle: '',
				navHeightValue: 0,
				longPress: '1',
				defaultName: '发起维修',
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
				minDate: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
				finishTime: null,
				testTime: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
				addressPopup: false,
				imgOssList: [],
				waitImage: [],
				columns: [],
				columnData: [],
				allColumns: [],
				allUser: [],
				listUser: [],
				penpelColumns: [],
				penpelName: '',
				assigneeUserId:'',
				addvcdName: '',
				facilityName: '',
				wawoCodeName: "",
				penpelShow: false,
				partPopup: false,
				facilityPopup: false,
				partName: '',
				partcolumns: [],
				allpartcolumns: [],
				facilitycolumns: [],
				allfacilitycolumns: [],
				bigallColumns: [],
				videoOssList: '',
				videoUrl: '',
				uploadOptions: {
					// url: 'http://192.168.31.185:3000/api/upload', // 不传入上传地址则返回本地链接
					url: `${BaseUrl}/system/oss/upload`,
					header: {
						'Authorization': uni.getStorageSync('Authorization')
					}
				},
				options: {
					receordingDuration: 60,
					APPID: '88abc856',
					API_SECRET: 'NDEwOGM0Yzg5MjM4MjA2MzM1OGIwNmFk',
					API_KEY: '1963c3780ad0b68d89809d89ace04ffe'
				}
			}
		},
		computed: {

		},
		watch: {

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
			this.QueryGettreeByAddvcd() //获取工程列表
			this.getDict()
			this.getlistUser()
		},
		filters: {
			futtilvalue1(e) {
				console.log(e)
				if (e) {
					return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM-DD HH:mm')))
				}
			}
		},
		methods: {

			start() {
				console.log('开始');
				this.longPress = '2'
				this.$refs.yimoAudioTransRefs.start();
			},
			end() {
				console.log('结束');
				this.longPress = '1'
				this.$refs.yimoAudioTransRefs.end();
			},
			countDown(e) {
				console.log('countDown', e);
			},
			onStop(e) {
				console.log('onStop', e);
			},
			onOpen(e) {
				console.log('onOpen', e);
			},
			change(e) {
				console.log('change', e);
			},
			resultMsg(e) {
				this.remark = e
				console.log('resultMsg', e);
			},
			deleteImg(idx) {
				this.imgOssList.splice(idx, 1)
				this.waitImage.splice(idx, 1)
			},
			deleteVideo() {
				console.log('删除')
				this.videoOssList = ''
				this.videoUrl = ''
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
			getDict() {
				queryDict('?dictType=patrol_matter_lev').then(res => {
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

				this.sptTimeshow = false
				console.log(dayjs(e.value).format('YYYY-MM-DD HH:mm'))
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
			buweiBtn() {
				this.partPopup = true
			},
			testConfirm(e) {
				console.log(e)
				this.testStatus = e.value[0]
				this.testStatusshow = false
			},
			partcancel() {
				this.partPopup = false
			},
			shebeiBtn() {
				this.facilityPopup = true
			},
			partchangeHandler() {

			},
			facilitycancel() {
				this.facilityPopup = false
			},
			QueryGettreeByAddvcd() {
				let firstColumns
				let twoColumns
				let deptIdList = uni.getStorageSync('getInfo')
				GettreeByAddvcd().then(res => {
					console.log(res)
					firstColumns = res.data.data[0].children.map(e => {
						return e.name
					})
					twoColumns = res.data.data[0].children[0].wawoList.map(e => {
						return e.wawoName
					})
					this.columns = [firstColumns, twoColumns]
					this.bigallColumns = this.flattenWawoData(res.data.data[0].children)
					this.allColumns = res.data.data
				})
			},
			flattenWawoData(data) {
				return data.reduce((result, item) => {
					if (item.wawoList && Array.isArray(item.wawoList)) {
						result.push(...item.wawoList);
					}
					return result;
				}, []);
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
			selectTime() {
				this.sptTimeshow = true
			},
			confirmTime(e) {
				this.Timeshow = false
				// console.log(dayjs(e.value).format('YYYY-MM-DD HH:mm'))
				this.finishTime = e.value
			},
			confirm(e) {
				console.log(e)
				console.log(this.bigallColumns)
				this.addvcdName = e.value[1]
				let partId = this.bigallColumns.find(item => item.wawoName === e.value[1]).wawoCode
				console.log(partId)
				getpartList(`?pageNum=1&pageSize=99999&projectId=${partId}`).then(Response => {
					this.partcolumns = Response.data.rows.length > 0 ? [Response.data.rows.map(e => {
						return e.name
					})] : []
					this.allpartcolumns = Response.data.rows
					this.partName = null
					this.facilityName = null
					// this.partcolumns = []
					this.facilitycolumns = []
					this.addressPopup = false
					getUserByWawo(`?wawoCode=${partId}`).then(Response => {
						console.log(Response)
						this.penpelName = Response.data.data[0].nickName
						this.assigneeUserId = Response.data.data[0].userId
					})
				})
				// this.wawoCodeName = e.value[1]

			},
			partconfirm(e) {
				console.log(e)
				if (e.value.length == 0) {
					this.partPopup = false
					return
				} else {
					this.partName = e.value[0]
					let partId = this.allpartcolumns.find(item => item.name === e.value[0]).id
					getFacilityList(`?pageNum=1&pageSize=99999&partId=${partId}`).then(Response => {
						this.facilitycolumns = Response.data.rows.length > 0 ? [Response.data.rows.map(e => {
							return e.name
						})] : []
						this.allfacilitycolumns = Response.data.rows
						this.facilityName = null
						// this.facilitycolumns = []
						this.partPopup = false
					})
				}
			},
			facilityconfirm(e) {
				this.facilityName = e.value[0]
				this.facilityPopup = false
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
			videoopenXeUpload() {
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
				console.log(this.orderTypeName)
				console.log(this.dict)
				if (this.addvcdName == '') {
					uni.$u.toast('请选择工程');
					return
				}

				if (this.remark == '') {
					uni.$u.toast('请输入问题描述');
					return
				}
				if (this.imgOssList.length == 0) {
					// uni.$u.toast('请至少上传一张照片');
					// return
				}
				if (this.penpelName == '') {
					uni.$u.toast('请选择指派处理人');
					return
				}
				this.$refs.centerPopup.open('center')
			},
			gotoPatrolDetail() {
				let a = {
					maintenanceType: '1',
					maintenanceReason: this.remark,
					projectId: this.bigallColumns.find(e => e.wawoName == this.addvcdName).wawoCode,
					partId: this.allpartcolumns.length > 0 ? this.allpartcolumns.find(e => e.name == this.partName)
						.id : null,
					facilityId: this.allfacilitycolumns.length > 0 ? this.allfacilitycolumns.find(e => e.name == this
						.facilityName).id : null,
					// assigneeUserId: this.listUser.find(e => e.nickName == this.penpelName).userId,
					assigneeUserId:this.assigneeUserId,
					
					picFileList: this.imgOssList.map(e => {
						return {
							ossId: e
						}
					}),
					videoFileList: this.videoOssList !== '' ? [{
						ossId: this.videoOssList
					}] : [],
					// planFinishTime: this.finishTime + ':00',
					planFinishTime: `${dayjs(this.finishTime).format('YYYY-MM-DD HH:mm')}:00`,
				}
				console.log(a)
				// this.$refs.centerPopup.open('center')
				addRecord(a).then(rsp => {
					uni.$u.toast('新增成功');
					setTimeout(() => {
						uni.navigateBack()
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

	/* 语音录制开始--------------------------------------------------------------------- */
	.record-layer {
		width: 91vw;
		// padding: 300px 0;
		box-sizing: border-box;
		height: 15vw;
		position: fixed;
		margin-left: 4vw;
		z-index: 10;
		bottom: 3vh;
	}

	.record-layer1 {
		width: 100vw;
		// padding: 300px 0;
		box-sizing: border-box;
		height: 100vh;
		position: fixed;
		background-color: rgba(0, 0, 0, .6);
		// padding: 0 4vw;
		z-index: 10;
		bottom: 0vh;
	}

	.record-box {
		width: 100%;
		position: relative;
	}

	.record-box1 {
		width: 100%;
		position: relative;
		bottom: -83vh;
		height: 17vh;
	}

	.record-btn-layer {
		width: 100%;
	}

	.record-btn-layer button::after {
		border: none;
		transition: all 0.1s;
	}

	.record-btn-layer button {
		font-size: 14px;
		line-height: 50px;
		width: 100%;
		height: 50px;
		border-radius: 8px;
		text-align: center;
		background: #FFD300;
		transition: all 0.1s;
	}

	.record-btn-layer button image {
		width: 16px;
		height: 16px;
		margin-right: 4px;
		vertical-align: middle;
		transition: all 0.3s;
	}

	.record-btn-layer .record-btn-1 {
		background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);
		color: #000000 !important;

	}

	.record-btn-layer .record-btn-2 {
		border-radius: 168rpx 168rpx 0 0;
		height: 17vh;
		line-height: 17vh;
		transition: all 0.3s;
	}

	/* 提示小弹窗 */
	.prompt-layer {
		border-radius: 15px;
		background: #95EB6C;
		padding: 8px 16px;
		box-sizing: border-box;
		position: absolute;
		left: 50%;
		height: 11vh;
		transform: translateX(-50%);
		transition: all 0.3s;
	}

	.prompt-layer::after {
		content: '';
		display: block;
		border: 12px solid rgba(0, 0, 0, 0);
		border-radius: 10rpx;
		border-top-color: #95EB6C;
		position: absolute;
		bottom: -46rpx;
		left: 50%;
		transform: translateX(-50%);
		transition: all 0.3s;
	}

	//取消动画
	.prompt-layer1 {
		border-radius: 15px;
		background: #FB5353;
		padding: 8px 16px;
		box-sizing: border-box;
		position: absolute;
		left: 50%;
		height: 11vh;
		transform: translateX(-50%);
		transition: all 0.3s;
	}

	.prompt-layer1::after {
		content: '';
		display: block;
		border: 12px solid rgba(0, 0, 0, 0);
		border-radius: 10rpx;
		border-top-color: #FB5353;
		position: absolute;
		bottom: -46rpx;
		left: 50%;
		transform: translateX(-50%);
		transition: all 0.3s;
	}

	.prompt-layer-1 {
		font-size: 12px;
		width: 150px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		top: -400rpx;
	}

	.prompt-layer-1 .p {
		color: #000000;
	}

	.prompt-layer-1 .span {
		color: rgba(0, 0, 0, .6);
	}

	.prompt-loader .em {}

	/* 语音音阶------------- */
	.prompt-loader {
		width: 96px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}

	.prompt-loader .em {
		display: block;
		background: #333333;
		width: 1px;
		height: 10%;
		margin-right: 2.5px;
		float: left;
	}

	.prompt-loader .em:last-child {
		margin-right: 0px;
	}

	.prompt-loader .em:nth-child(1) {
		animation: load 2.5s 1.4s infinite linear;
	}

	.prompt-loader .em:nth-child(2) {
		animation: load 2.5s 1.2s infinite linear;
	}

	.prompt-loader .em:nth-child(3) {
		animation: load 2.5s 1s infinite linear;
	}

	.prompt-loader .em:nth-child(4) {
		animation: load 2.5s 0.8s infinite linear;
	}

	.prompt-loader .em:nth-child(5) {
		animation: load 2.5s 0.6s infinite linear;
	}

	.prompt-loader .em:nth-child(6) {
		animation: load 2.5s 0.4s infinite linear;
	}

	.prompt-loader .em:nth-child(7) {
		animation: load 2.5s 0.2s infinite linear;
	}

	.prompt-loader .em:nth-child(8) {
		animation: load 2.5s 0s infinite linear;
	}

	.prompt-loader .em:nth-child(9) {
		animation: load 2.5s 0.2s infinite linear;
	}

	.prompt-loader .em:nth-child(10) {
		animation: load 2.5s 0.4s infinite linear;
	}

	.prompt-loader .em:nth-child(11) {
		animation: load 2.5s 0.6s infinite linear;
	}

	.prompt-loader .em:nth-child(12) {
		animation: load 2.5s 0.8s infinite linear;
	}

	.prompt-loader .em:nth-child(13) {
		animation: load 2.5s 1s infinite linear;
	}

	.prompt-loader .em:nth-child(14) {
		animation: load 2.5s 1.2s infinite linear;
	}

	.prompt-loader .em:nth-child(15) {
		animation: load 2.5s 1.4s infinite linear;
	}

	@keyframes load {
		0% {
			height: 10%;
		}

		50% {
			height: 100%;
		}

		100% {
			height: 10%;
		}
	}

	/* 语音音阶-------------------- */
	.prompt-layer-2 {
		top: -40px;
	}

	.prompt-layer-2 .text {
		color: rgba(0, 0, 0, 1);
		font-size: 12px;
	}

	/* 语音录制结束---------------------------------------------------------------- */
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

		.textareaBox {
			background: rgba(244, 245, 249, 1);
			border-radius: 12rpx;
			height: 132rpx;
			padding: 14rpx 16rpx;
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