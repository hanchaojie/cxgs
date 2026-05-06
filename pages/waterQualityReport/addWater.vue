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
				<view class="reportLine_R" @click="selectBtn">
					{{wawoCodeName|| '请选择'}}
					<uni-icons type="right" size="16" color="#999999"></uni-icons>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					PH
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-number-box min="0" inputWidth="70" button-size="28" v-model="ph"
						@change="valChange"></u-number-box>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					色(度)
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-number-box color="#333" min="0" integer inputWidth="70" button-size="28" v-model="chroma"
						@change="valChange"></u-number-box>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					浑浊度(NTU)
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-number-box min="0" inputWidth="70" button-size="28" v-model="turb"
						@change="valChange"></u-number-box>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					余氯-消毒剂余量(mg/L)
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-number-box min="0" inputWidth="70" button-size="28" v-model="cl"
						@change="valChange"></u-number-box>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					高锰酸钾指数(mg/L)
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-number-box min="0" inputWidth="70" button-size="28" v-model="codmn"
						@change="valChange"></u-number-box>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					菌落总数(CFU/ml)
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-number-box min="0" integer inputWidth="70" button-size="28" v-model="colony"
						@change="valChange"></u-number-box>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					总大肠杆菌(MPN/100ml)
				</view>
				<view class="reportLine_R">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-number-box min="0" integer inputWidth="70" button-size="28" v-model="escherichiaColi"
						@change="valChange"></u-number-box>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					臭和味
				</view>
				<view class="reportLine_R" style="width: 200rpx;" @click="selectBtn">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-radio-group v-model="odour" placement="row">
						<u-radio shape="circle" label="有" name="1"></u-radio>
						<u-radio shape="circle" label="无" name="0"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					肉眼可见物
				</view>
				<view class="reportLine_R" style="width: 200rpx;">
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-radio-group v-model="visualObj" placement="row">
						<u-radio shape="circle" label="有" name="1"></u-radio>
						<u-radio shape="circle" label="无" name="0"></u-radio>
					</u-radio-group>
				</view>
			</view>
		</view>
		<view class="reportBox">
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					采样时间
				</view>
				<view class="reportLine_R" style="display: flex;" @click="selectTime">
					{{spt | futtilvalue1}}
					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-icon name="clock" style="margin-left: 10rpx;"></u-icon>

				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					检测时间
				</view>
				<view class="reportLine_R" style="display: flex;" @click="selectTime">
					{{testTime | futtilvalue1}}

					<!-- 	请选择
					<uni-icons type="right" size="16" color="#999999"></uni-icons> -->
					<u-icon name="clock" style="margin-left: 10rpx;"></u-icon>

				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: red;">*</text>
					监测结果
				</view>
				<view class="reportLine_R" style="display: flex;"
					:style="{'color': (testStatus=='合格' ? 'rgba(3, 102, 241, 1)':'red')}" @click="openTestShow">
					{{testStatus}}
					<!-- testStatus -->
					<uni-icons type="right" size="16" color="#999999"></uni-icons>
				</view>
			</view>
			<view class="reportLine">
				<view class="reportLine_L">
					<text style="color: transparent;">*</text>
					过程照片<text style="font-size: 24rpx;color: #999;">照片只限上传六张</text>
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
		</view>
		<view class="uploadSub" @click="uploadSub">
			上报
		</view>
		<xe-upload ref="XeUpload" :options="uploadOptions" @callback="handleUploadCallback"></xe-upload>
		<u-picker :closeOnClickOverlay="true" title='选择地区' :show="addressPopup" ref="uPicker" :columns="columns"
			@confirm="confirm" @cancel="cancel" @close="cancel" @change="changeHandler"></u-picker>
		<u-picker :show="testStatusshow" closeOnClickOverlay :columns="testStatusColumns" @confirm="testConfirm"
			@close="testClose" @cancel="testClose"></u-picker>
		<u-datetime-picker :show="sptTimeshow" v-model="spt" mode="datetime" @confirm="sptconfirmTime"
			closeOnClickOverlay @close="sptcloseTime"></u-datetime-picker>
		<u-datetime-picker :show="Timeshow" v-model="testTime" mode="datetime" @confirm="confirmTime"
			closeOnClickOverlay @close="closeTime"></u-datetime-picker>
		<uni-popup ref="centerPopup" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					是否确认采样上报?
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
		wqArtificial
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
				navStyle: '',
				navHeightValue: 0,
				defaultName: '采样上报',
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
				testStatusColumns: [
					['合格', '超标']
				],
				testStatus: '合格',
				spt: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
				testTime: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
				addressPopup: false,
				imgOssList: [],
				waitImage: [],
				columns: [],
				columnData: [],
				allColumns: [],
				addvcdName: '',
				wawoCodeName: "",
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
			selectBtn(e) {
				this.addressPopup = true
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
				this.spt = e.value
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
				this.Timeshow = true
			},
			confirmTime(e) {
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
				if (this.addvcdName == '' || this.wawoCodeName == '') {
					uni.$u.toast('请选择厂站');
					return
				}
				console.log(this.testStatus)


				if (typeof(this.ph) !== 'number') {
					uni.$u.toast('请输入PH');
					return
				}
				if (typeof(this.turb) !== 'number') {
					uni.$u.toast('请输入浑浊度');
					return
				}
				if (typeof(this.cl) !== 'number') {
					uni.$u.toast('请输入余氯');
					return
				}
				if (this.imgOssList.length == 0) {
					// uni.$u.toast('请至少上传一张照片');
					// return
				}
				if (this.testStatus == '' || this.testStatus == null) {
					uni.$u.toast('请选择监测结果');
					return
				}
				this.$refs.centerPopup.open('center')





			},
			gotoPatrolDetail() {
				let a = {
					testStatus: this.testStatus == '合格' ? 1 : 0,
					testTime: this.testTime + ":00",
					spt: this.spt + ':00',
					addvcd: this.allColumns[0].children.find(e => e.name == this.addvcdName).addvcd,
					wawoCode: this.findWawoCode(this.allColumns[0], this.wawoCodeName),
					chroma: this.chroma,
					ph: this.ph,
					turb: this.turb,
					cl: this.cl,
					codmn: this.codmn,
					colony: this.colony,
					escherichiaColi: this.escherichiaColi,
					odour: this.odour,
					visualObj: this.visualObj,
					fileList: this.imgOssList.map(e => {
						return {
							ossId: e
						}
					})

				}

				wqArtificial(a).then(res => {
					console.log(res)
					uni.$u.toast('新增成功');
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/waterQualityReport/index'
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

/* 	::v-deep .uni-input-input {
		color: #333 !important;
	} */
</style>

<style lang="scss" scoped>
	/* pakA/pages/rounds/index.wxss */
	::v-deep .u-radio-group--row {
		justify-content: space-between;
	}

	// ::v-deep .u-number-box__input {
	// 	color: #999 !important;
	// }


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
		padding: 28rpx 32rpx 1rpx 24rpx;

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