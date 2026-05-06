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
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					问题来源
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<!-- 		<u-number-box min="0" inputWidth="70" button-size="28" v-model="ph"
						@change="valChange"></u-number-box> -->
					<!-- <input type="text" v-model="orderName" placeholder="请输入" value="" /> -->
					<view class="">
						其他
					</view>
				</view>
			</view>
			<view class="reportLine" @click="openDictOrder">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					问题级别
				</view>
				<view class="reportLine_R">
					<view class="reportLine_R">
						{{ orderTypeName}}
						<uni-icons type="right" size="16" color="#999999"></uni-icons>
					</view>
				</view>
			</view>



			<view class="reportLine" @click="openDictQuesTion">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					问题类型
				</view>
				<view class="reportLine_R">
					<view class="reportLine_R">
						{{ DictQuesTionName}}
						<uni-icons type="right" size="16" color="#999999"></uni-icons>
					</view>
				</view>
			</view>
			<view class="reportLine" style="margin-bottom: 0rpx;">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					问题描述
				</view>
				<view class="reportLine_R" @click="openModel">
					快速选择模板
					<!-- 	请选择-->
					<!-- <uni-icons type="mic" size="30" color="#0366F1"></uni-icons> -->
					<uni-icons type="right" size="16" color="#999999"></uni-icons>
				</view>
			</view>
			<textarea class="textareaBox" name="" id="" placeholder="请输入问题描述" v-model="remark"></textarea>
		</view>
		<view class="reportBox">
			<view class="reportLine" style="margin-bottom: 0;">
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



			<view class="" style="display: flex;margin-top: 20rpx;margin-bottom: 20rpx;">
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
			<view style="">
				<DomVideoPlayer ref="guochengdomVideo" style="height: 400rpx;" :src="videoUrl" loop controls muted
					v-if="videoUrl" />






			</view>
		</view>
		<view class="uploadSub" @click="uploadSub">
			上报
		</view>
		<xe-upload ref="XeUpload" :options="uploadOptions" @callback="handleUploadCallback"></xe-upload>
		<u-picker :closeOnClickOverlay="true" title='选择工程' :show="addressPopup" ref="uPicker" :columns="columns"
			@confirm="confirm" @cancel="cancel" @close="cancel" @change="changeHandler"></u-picker>



		<u-picker :closeOnClickOverlay="true" title='选择部位' :show="partPopup" ref="uPicker" :columns="partcolumns"
			@confirm="partconfirm" @cancel="partcancel" @close="partcancel" @change="partchangeHandler"></u-picker>
		<u-picker :closeOnClickOverlay="true" title='选择设施设备' :show="facilityPopup" ref="uPicker"
			:columns="facilitycolumns" @confirm="facilityconfirm" @cancel="facilitycancel"
			@close="facilitycancel"></u-picker>
		<u-picker :closeOnClickOverlay="true" title='选择问题类型' :show="questionShow" ref="uPicker"
			:columns="PatrolQuestionMondelTypeColumns" @confirm="quesTionConfirm" @cancel="quesTioncancel"
			@close="quesTioncancel"></u-picker>
		<u-picker :closeOnClickOverlay="true" title='选择问题模板' :show="questionModelShow" ref="uPicker"
			:columns="QuesTionModelColumns" @confirm="modelConfirm" @cancel="modelcancel"
			@close="modelcancel"></u-picker>
		<u-picker :show="penpelShow" closeOnClickOverlay :columns="penpelColumns" @confirm="penpelConfirm"
			@close="penpelClose" @cancel="penpelClose"></u-picker>
		<u-picker :show="dictOrderType" closeOnClickOverlay :columns="dictOrderTypeColumns" @confirm="dictConfirm"
			@close="dictCLose" @cancel="dictCLose"></u-picker>
		<u-datetime-picker :show="sptTimeshow" v-model="finishTime" mode="datetime" @confirm="sptconfirmTime"
			closeOnClickOverlay @close="sptcloseTime"></u-datetime-picker>
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
		addMatter,
		getquestionModel
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
				defaultName: '问题上报',
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
				DictQuesTionName: '请选择',
				DictQuesTionId: '',
				dictOrderTypeColumns: [],
				orderTypeName: '',
				orderName: '',
				remark: '',
				testStatusColumns: [
					['合格', '超标']
				],
				testStatus: '合格',
				dict: [],
				finishTime: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
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
				questionModelShow: false,
				PatrolQuestionMondelTypeColumns: [],
				PatrolQuestionMondelTypeDict: [],
				QuesTionModelColumns: [],
				bigallColumns: [],
				videoOssList: '',
				videoUrl: '',
				questionShow: false,
				uploadOptions: {
					// url: 'http://192.168.31.185:3000/api/upload', // 不传入上传地址则返回本地链接
					url: `${BaseUrl}/system/oss/upload`,
					header: {
						'Authorization': uni.getStorageSync('Authorization')
					}
				},
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
				return JSON.parse(JSON.stringify(dayjs(e).format('YYYY-MM-DD HH:mm')))
			}
		},
		methods: {
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
			openDictQuesTion() {
				this.questionShow = true
			},
			quesTioncancel() {
				this.questionShow = false
			},
			quesTionConfirm(e) {
				console.log(e)
				this.DictQuesTionName = e.value[0]
				this.questionShow = false
				this.DictQuesTionId = this.PatrolQuestionMondelTypeDict.find(item => item.label == e.value[0]).value
				console.log(this.DictQuesTionId)
				getquestionModel(`?quesType=${this.DictQuesTionId}`).then(res => {
					console.log('getquestionModel', res)
					// this.QuesTionModel = res.data.rows
					this.QuesTionModelColumns = [res.data.rows.map(e => {
						return e.modelContext
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
				queryDict('?dictType=patrol_question_model_type').then(res => {
					console.log(res, 'PatrolQuestionMondelTypeDict')
					this.PatrolQuestionMondelTypeDict = res.data.rows.map(e => {
						return {
							value: e.dictValue,
							label: e.dictLabel
						}
					})
					this.PatrolQuestionMondelTypeColumns = [res.data.rows.map(e => {
						return e.dictLabel
					})]
				})
			},
			openDictOrder() {
				// this.addressPopup = true
				// dictOrderTypeColumns
				this.dictOrderType = true
			},
			modelConfirm(e) {
				this.remark = e.value[0]
				this.questionModelShow = false
			},
			dictCLose() {
				this.dictOrderType = false
			},
			selectBtn(e) {
				this.addressPopup = true
			},
			openModel() {
				if (this.DictQuesTionName == '请选择') {
					uni.$u.toast('请选择问题级别');
					return
				} else {
					this.questionModelShow = true
				}
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
			sptconfirmTime() {
				this.sptTimeshow = false
				// console.log(dayjs(e.value).format('YYYY-MM-DD HH:mm'))
				this.finishTime = e.value
			},
			penpelClose() {
				this.penpelShow = false
			},
			modelcancel() {
				this.questionModelShow = false
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
				this.Timeshow = true
			},

			flattenWawoData(data) {
				return data.reduce((result, item) => {
					if (item.wawoList && Array.isArray(item.wawoList)) {
						result.push(...item.wawoList);
					}
					return result;
				}, []);
			},
			confirmTime(e) {
				this.Timeshow = false
				// console.log(dayjs(e.value).format('YYYY-MM-DD HH:mm'))
				this.testTime = e.value
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
				})
				// this.wawoCodeName = e.value[1]

			},
			partconfirm(e) {
				console.log(e)
				if (e.value.length) {
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
				} else {
					this.partPopup = false
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
				// if (this.orderName == '') {
				// 	uni.$u.toast('请输入工单名称');
				// 	return
				// }
				if (this.orderTypeName == '') {
					uni.$u.toast('请选择问题级别');
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

				let a = {
					source: "9", //来源
					treatType: "2", //上报维修
					picFileList: this.imgOssList.length > 0 ? this.imgOssList.map(e => {
						return {
							ossId: e
						}
					}) : [],
					videoFileList: this.videoOssList !== '' ? [{
						ossId: this.videoOssList
					}] : [],
					projectId: this.bigallColumns.find(e => e.wawoName == this.addvcdName).wawoCode,
					partId: this.allpartcolumns.length > 0 ? this.allpartcolumns.find(e => e.name == this.partName)
						.id : null,
					facilityId: this.allfacilitycolumns.length > 0 ? this.allfacilitycolumns.find(e => e.name == this
						.facilityName).id : null,
					lev: this.dict.find(e => e.label == this.orderTypeName).value,
					remark: this.remark
				}
				// this.$refs.centerPopup.open('center')
				addMatter(a).then(rsp => {
					uni.$u.toast('新增成功');
					setTimeout(() => {
						uni.navigateBack()
					}, 500)
				})





			},
			gotoPatrolDetail() {

				console.log(this.dict)
				console.log(this.orderTypeName)
				let a = {
					remark: this.remark,
					orderName: this.orderName,
					lev: this.dict.find(e => e.label == this.orderTypeName).value,
					assigneeUserId: this.listUser.find(e => e.nickName == this.penpelName).userId,
					finishTime: this.finishTime + ':00',
					// addvcd: this.allColumns[0].children.find(e => e.name == this.addvcdName).addvcd,
					projectId: this.findWawoCode(this.allColumns[0], this.wawoCodeName),
					picFileList: this.imgOssList.map(e => {
						return {
							ossId: e
						}
					})
				}
				console.log(a)

				addOrder(a).then(res => {
					console.log(res)
					uni.$u.toast('新增成功');
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/workOrder/index'
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
			margin-bottom: 32rpx;

			.reportLine_L {
				font-size: 32rpx;
				color: rgba(86, 86, 86, 1);
				font-family: "Microsoft YaHei";
				color: #565656;
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
					font-size: 32rpx;
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
			// 
			width: 594rpx;
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