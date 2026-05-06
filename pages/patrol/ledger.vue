<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" :textContent='textContent'></head-nav>
		<view style="height: 176rpx;background-color: #fff;">
		</view>
		<view class="topDisplay">
			<view class="leftDis" @click="checkNumBtn(1)">
				<image
					:src="checkNum == 1 ? '/static/hazardReporting/ledger.png' : '/static/hazardReporting/noLedger.png'"
					class="patrolSize" mode=""></image>
				<view :class="checkNum == 1 ?'blueTxt':'whiteTxt'">
					巡查台账
				</view>
			</view>
			<view class="rightDis" @click="checkNumBtn(2)">
				<image
					:src="checkNum==2 ? '/static/hazardReporting/navigation.png' : '/static/hazardReporting/nonavigation.png'"
					class="patrolSize" mode=""></image>
				<view :class="checkNum == 2 ?'blueTxt':'whiteTxt'">
					巡查轨迹
				</view>
			</view>
		</view>
		<view class="leftBox" v-if="checkNum == 1">
			<view class="boxpage">
				<!-- 			<view v-for="(i,index) in checkList"
					:class="i.matterId  ?'patrolMissionRed':'patrolMission'" @click="gotoPatrol">
					<view class="topName">
						{{i.projectName}}
						<image src="/static/barCode.png" mode="" class="postab"></image>
					</view>
					<view class="frequency" v-if="allSelect">
						检查类型：<text
							style="color: rgba(51, 51, 51, 1);">{{filterTask(allSelect,PatrolDetail.taskFrequency) }}
						</text>
					</view>
					<view class="date">
						开始时间：<text style="color: rgba(51, 51, 51, 1);">{{PatrolDetail.stm}}</text>
					</view>
					<view class="date">
						结束时间：<text style="color: rgba(51, 51, 51, 1);">{{PatrolDetail.etm}}</text>
					</view>
					<view class="rightTop">
						{{i.matterId?"有隐患":"正常"}}
					</view>
					<view class="querydetailBlue" @click="querydetailBlue(i)">
						查看详情
					</view>
				</view> -->
				<view class="patrolMission">
					<!-- 		<view class="topName">
						{{PatrolDetail.projectName}}
						<image src="/static/barCode.png" mode="" class="postab"></image>
					</view> -->
					<view class="frequency" style="font-size: 32rpx;">
						巡查人：<text style="color: rgba(51, 51, 51, 1);">{{PatrolDetail.patrollerNames}}</text>
					</view>
					<view class="date" style="margin-top: 24rpx;font-size: 32rpx;">
						巡查时长：<text
							style="color: rgba(51, 51, 51, 1);">{{calculateTimeDifference(PatrolDetail.etm,PatrolDetail.stm)}}</text>
					</view>
					<view class="date" style="margin-top: 24rpx;font-size: 32rpx;">
						开始时间：<text style="color: rgba(51, 51, 51, 1);">{{PatrolDetail.stm}}</text>
					</view>
					<view class="date" style="margin-top: 24rpx;font-size: 32rpx;">
						结束时间：<text style="color: rgba(51, 51, 51, 1);">{{PatrolDetail.etm}}</text>
					</view>
					<!-- 	<view class="rightTop">
						{{index == 2?"异常":"正常"}}
					</view> -->
					<view class="filterTask" v-if="allSelect">
						<text>{{filterTask(allSelect,PatrolDetail.taskFrequency) }}
						</text>
					</view>
					<!-- <image src="/static/left.png" mode="" class="leftSize"></image> -->
				</view>
				<view class="patrolMission" v-if="waitImage.length >0">
					过程照片
					<view class="patrolMissionImg">
						<view v-for="(img, idx) in waitImage" :key="idx"
							style="position: relative;margin-bottom: 40rpx;margin-right: 30rpx; " class="imgSize">
							<image :src="img.url" style="width: 140rpx; height: 140rpx;" @click="showImage(img.url)">
							</image>

						</view>
					</view>

				</view>
				<!-- <piaoyi-steps :list="list" /> -->
				<DvviceStatusListElse :checkList="checkList" @gotoNext="gotoNext" :isRecord="true"
					v-if="checkList!==null" />
			</view>
		</view>
		<view class="rightBox" v-else>
			<view class="boxpage">
				<view class="patrolMission">
					<view class="topName" style="font-size: 32rpx;">
						{{PatrolDetail.projectName}}
						<image src="/static/barCode.png" mode="" class="postab"></image>
					</view>
					<view class="frequency" style="font-size: 32rpx;">
						巡查人：<text style="color: rgba(51, 51, 51, 1);">{{PatrolDetail.patrollerNames}}</text>
					</view>
					<view class="date" style="font-size: 32rpx;">
						巡查时长：<text
							style="color: rgba(51, 51, 51, 1);">{{calculateTimeDifference(PatrolDetail.etm,PatrolDetail.stm)}}</text>
					</view>
					<view class="date" style="font-size: 32rpx;">
						开始时间：<text style="color: rgba(51, 51, 51, 1);">{{PatrolDetail.stm}}</text>
					</view>
					<view class="date" style="font-size: 32rpx;">
						结束时间：<text style="color: rgba(51, 51, 51, 1);">{{PatrolDetail.etm}}</text>
					</view>

					<view class="">
						<view class="">

						</view>
					</view>
					<!-- 	<view class="rightTop">
						{{index == 2?"异常":"正常"}}
					</view> -->
					<!-- 		<view class="querydetailBlue">
						查看详情
					</view> -->
					<!-- <image src="/static/left.png" mode="" class="leftSize"></image> -->
				</view>
			</view>
			<view style="width: 686rpx;height: 1000rpx;position: relative;margin-left: 32rpx;">
				<leaflet :checkList="checkList"></leaflet>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
			<view class="autoHeight">
				<view class="topTxt">
					请选择
				</view>
				<uni-icons class="uicons" type="closeempty" size="24" @click="closeSelectBox"></uni-icons>
				<view class="heibox">
					<view class="smallBox" v-for="i in 10">
						A供水站
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="timePopup" type="bottom" border-radius="10px 10px 0 0">
			<view class="autoHeight">
				<view class="topTxt">
					选择日期
				</view>
				<uni-icons class="uicons" type="closeempty" size="24" @click="closetimePopup"></uni-icons>
				<view class="heibox">
					<picker-view :value="value" @change="bindChange" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
						</picker-view-column>
					</picker-view>
					<button type="primary" class="confimBtn" @click="confimBtn">确定</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="centerPopup" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					巡查需开启手机GPS定位记录您的巡查轨迹
					确定是否开启并开始巡查?
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
	import DvviceStatusListElse from '@/components/DvviceStatusListElse/index.vue';
	import piaoyiSteps from '@/uni_modules/piaoyi-steps/components/piaoyi-steps/piaoyi-steps.vue'
	import leaflet from '@/components/j-leaflet.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		getPatrolId,
		queryDict,
		getCheckList,
		querygetDetail,
		getCommonFile
	} from '@/units/request.js'

	export default {
		components: {
			HeadNav,
			DvviceStatusListElse,
			piaoyiSteps,
			leaflet,

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
			this.navHeightValue = Number((146 - SystemInfomations.statusBarHeight) / SystemInfomations.scaleFactor)
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
			// this.navStyle = 'height:' + 4 + 'px';
			// #endif
			// ---------------------------------------------------------------------------------------
		},
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 1990; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}
			return {
				navHeightValue: 0,
				navStyle: '',
				checkNum: 1,
				title: 'picker-view',
				years,
				year,
				months,
				month,
				days,
				day,
				value: [9999, month - 1, day - 1],
				timePopup: false,
				ledgerId: '',
				PatrolDetail: {},
				partol_task_type: [],
				patrol_task_frequency_0: [],
				patrol_task_frequency_1: [],
				patrol_task_frequency_2: [],
				patrol_task_frequency_3: [],
				patrol_task_frequency_4: [],
				allSelect: null,
				checkList: null,
				waitImage: [],
				list: [{
					name: '机电设备1',
					details: '描述一',
					label: '测试',
					ischeck: false,

				}, {
					name: '进度二',
					// details: '描述二',
					ischeck: true,
					isFlag: false,
				}, {
					name: '进度三',
					// details: '描述三',
					ischeck: true,
					isFlag: true,
				}, {
					name: '进度四',
					// details: '描述四',
					ischeck: true,
					isFlag: true,
				}],
				textContent: ''
			}
		},
		onLoad(e) {
			this.ledgerId = e.id
		},
		onShow() {
			this.queryAllDict()
			this.querygetCommonFile(this.ledgerId)
			setTimeout(() => {
				this.querygetPatrolId(this.ledgerId)
				this.querygetCheckList(this.ledgerId)
				// this.query(	this.ledgerId)
			}, 300);

		},
		methods: {
			showImage(e) {
				var aa = []
				aa.push(e)
				uni.previewImage({
					urls: aa,
				});
			},
			querygetCommonFile(e) {
				getCommonFile(`?biz=${e}&module=PATROL_RECORD&subModule=PIC`).then(res => {
					console.log(res)
					if (res.data.length == 0) {

					} else {


						this.waitImage = JSON.parse(JSON.stringify(res.data))
						console.log(this.waitImage, 'waitImagewaitImagewaitImage')
					}
				})
			},
			query(e) {
				querygetDetail(`?patrolId=${e}`).then(res => {
					console.log(res)
				})
			},
			gotoNext(e) {
				console.log(e)
				if (e.matterId) {
					uni.navigateTo({
						url: `/pages/patrol/problemDetails?id=${e.matterId}   `
					})
				}
			},
			querygetCheckList(e) {
				getCheckList(`?patrolId=${e}`).then(res => {
					console.log(res)
					this.checkList = this.uniqueByPartId(res.data.data)
					console.log(this.checkList, 'checkList')
				})
			},
			uniqueByPartId(data) {
				return Object.values(data.reduce((acc, item) => {
					const partId = item.partId;

					if (!acc[partId]) {
						acc[partId] = {
							...item,
							subjects: [item.subjectName]
						};
					} else {
						// 合并相同partId的对象的参数（这里假设非subjectName字段相同）
						acc[partId].subjects.push(item.subjectName);
					}

					return acc;
				}, {}));
			},
			querygetPatrolId(e) {
				getPatrolId(e).then(res => {
					console.log(res)
					this.PatrolDetail = res.data.data
					this.textContent = res.data.data.projectName
				})
			},
			calculateTimeDifference(etm, stm) {
				// 将时间字符串转换为Date对象
				const endTime = new Date(etm);
				const startTime = new Date(stm);
				// 计算时间差（毫秒）
				const diffInMs = endTime - startTime;
				// 转换为小时和分钟
				const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
				const hours = Math.floor(diffInMinutes / 60);
				const minutes = diffInMinutes % 60;


				return `${hours}小时${minutes}分钟`;
			},
			checkNumBtn(e) {
				this.checkNum = e
			},
			openSelectBox() {
				this.$refs.popup.open('bottom')
			},
			closeSelectBox() {
				this.$refs.popup.close()
			},
			openTimePopup() {
				this.$refs.timePopup.open('bottom')
				// this.timePopup = true
			},
			closetimePopup() {
				this.$refs.timePopup.close()
				// this.timePopup = false
			},
			gotoPatrol() {
				// this.$refs.centerPopup.open('center')
			},
			closeCenterPop() {
				this.$refs.centerPopup.close()
			},
			filterTask(list, e) {
				console.log(list, e, 'list eeee')
				return list.find(i => i.value == e).label
			},
			gotoPatrolDetail() {
				uni.navigateTo({
					url: '/pages/patrol/patrolDetail'
				})
			},
			gotoLedger() {
				uni.navigateTo({
					url: '/pages/patrol/ledger'
				})
			},
			bindChange: function(e) {
				const val = e.detail.value
				this.year = this.years[val[0]]
				this.month = this.months[val[1]]
				this.day = this.days[val[2]]
			},
			confimBtn() {
				console.log(this.year + '-' + this.month)
				this.$refs.timePopup.close()
			},
			querydetailBlue(i) {

				console.log(i)
				if (i.matterId) {
					uni.navigateTo({
						url: `/pages/patrol/problemDetails?id=${i.matterId}   `
					})
				}

			},
			async queryAllDict() {
				uni.showLoading({
					title: '加载中'
				});
				this.vloading = false

				await queryDict(`?dictType=patrol_task_frequency_0`).then(res => {
					this.patrol_task_frequency_0 = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})
				await queryDict(`?dictType=patrol_task_frequency_1`).then(res => {
					this.patrol_task_frequency_1 = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})
				await queryDict(`?dictType=patrol_task_frequency_2`).then(res => {
					this.patrol_task_frequency_2 = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})
				await queryDict(`?dictType=patrol_task_frequency_3`).then(res => {
					this.patrol_task_frequency_3 = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})
				await queryDict(`?dictType=patrol_task_frequency_4`).then(res => {
					console.log(res, 'sadsadsadsa')
					this.patrol_task_frequency_4 = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})
				let arr = [];
				let haveMap = {};
				setTimeout(() => {

					if (this.patrol_task_frequency_0) {
						this.patrol_task_frequency_0.forEach(data => {
							if (!haveMap[data.value]) {
								haveMap[data.value] = true;
								arr.push(data);
							}
						});
					}
					if (this.patrol_task_frequency_1) {
						this.patrol_task_frequency_1.forEach(data => {
							if (!haveMap[data.value]) {
								haveMap[data.value] = true;
								arr.push(data);
							}
						});
					}
					if (this.patrol_task_frequency_2) {
						this.patrol_task_frequency_2.forEach(data => {
							if (!haveMap[data.value]) {
								haveMap[data.value] = true;
								arr.push(data);
							}
						});
					}
					if (this.patrol_task_frequency_3) {
						this.patrol_task_frequency_3.forEach(data => {
							if (!haveMap[data.value]) {
								haveMap[data.value] = true;
								arr.push(data);
							}
						});
					}
					if (this.patrol_task_frequency_4) {
						this.patrol_task_frequency_4.forEach(data => {
							if (!haveMap[data.value]) {
								haveMap[data.value] = true;
								arr.push(data);
							}
						});
					}
				}, 300)
				setTimeout(() => {
					this.allSelect = arr
					uni.hideLoading()
					this.vloading = true
				}, 1500)

			},
		}
	}
</script>
<style>
	page {
		background-color: #f3f5f9;
	}
</style>

<style scoped lang="scss">
	.topDisplay {
		width: 100%;
		display: flex;
		background: #fff;
		padding-bottom: 20rpx;

		.leftDis {
			// flex: 1;
			display: flex;
			// display: block;
			align-items: center;
			margin: 0 auto;

			.blueTxt {
				color: rgba(3, 102, 241, 1);
				font-family: "Microsoft YaHei";
				font-size: 32rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}

			.whiteTxt {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size: 32rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}
		}

		.rightDis {
			// flex: 1;
			display: flex;
			// display: block;
			align-items: center;
			margin: 0 auto;

			.blueTxt {
				color: rgba(3, 102, 241, 1);
				font-family: "Microsoft YaHei";
				font-size: 32rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}

			.whiteTxt {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size: 32rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}
		}

		.patrolSize {
			width: 48rpx;
			height: 48rpx;
			margin-right: 16rpx;
		}
	}

	.leftBox {
		.boxpage {
			padding: 30rpx 32rpx 0;
			max-height: calc(100vh - 244rpx);
			overflow-y: scroll;

			.patrolMission {
				width: 664rpx;
				height: auto;
				// background-image: url('/static/blueback.png');
				background-color: #fff;
				background-size: 100%;
				padding: 24rpx 0 0 24rpx;
				position: relative;
				margin-bottom: 24rpx;
				padding-bottom: 18rpx;
				border-radius: 16rpx;

				.patrolMissionImg {
					display: flex;
					padding-left: 10%;
					flex-wrap: wrap;
					padding-top: 20rpx;

					.imgSize {
						width: 160rpx;
						height: 160rpx;
						// margin-right: 20rpx;
						border-radius: 10rpx;
					}

				}

				.topName {
					color: rgba(51, 51, 51, 1);
					font-size: 28rpx;
					font-weight: 600;
					line-height: 32rpx;
					text-align: left;
					position: relative;

					.postab {
						position: absolute;
						left: 0;
						width: 128rpx;
						height: 8rpx;
						bottom: -5rpx;
					}
				}

				.querydetailBlue {
					width: 160rpx;
					height: 64rpx;
					position: absolute;
					right: 48rpx;
					bottom: 48rpx;
					background: rgba(3, 102, 241, 0.1);
					border: 1rpx solid rgba(3, 102, 241, 0.2);
					border-radius: 32rpx;
					text-align: center;
					line-height: 64rpx;
					color: rgba(3, 102, 241, 1);
					font-size: 28rpx;
					font-weight: 400;
				}

				.frequency {
					margin-top: rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.date {
					margin-top: 12rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.rightTop {
					width: 128rpx;
					height: 48rpx;
					font-size: 24rpx;
					color: #fff;
					line-height: 48rpx;
					border-radius: 0px 16rpx 0px 16rpx;
					position: absolute;
					right: 0;
					top: 0;
					text-align: center;
					background: linear-gradient(228.64deg, rgba(146, 205, 251, 1), rgba(23, 124, 244, 1) 100%);
				}

				.leftSize {
					width: 64rpx;
					height: 64rpx;
					position: absolute;
					right: 64rpx;
					bottom: 48rpx;
				}

				.filterTask {
					width: 128rpx;
					height: 48rpx;
					font-size: 24rpx;
					color: #fff;
					line-height: 48rpx;
					border-radius: 0px 16rpx 0px 16rpx;
					position: absolute;
					right: 0;
					top: 0;
					color: #fff;
					text-align: center;
					background: linear-gradient(228.64deg, rgba(146, 205, 251, 1), rgba(23, 124, 244, 1) 100%);
				}
			}

			.patrolMissionRed {
				width: 664rpx;
				background-color: #fff;
				height: auto;
				background-image: url('/static/renback.png');
				background-size: 100%;
				padding: 24rpx 0 0 24rpx;
				position: relative;
				margin-bottom: 24rpx;
				border-radius: 16rpx;

				.topName {
					color: rgba(51, 51, 51, 1);
					font-size: 28rpx;
					font-weight: 600;
					line-height: 32rpx;
					text-align: left;
					position: relative;

					.postab {
						position: absolute;
						left: 0;
						width: 128rpx;
						height: 8rpx;
						bottom: -5rpx;

					}

				}

				.frequency {
					margin-top: 40rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.date {
					margin-top: 30rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.rightTop {
					width: 128rpx;
					height: 48rpx;
					font-size: 24rpx;
					color: #fff;
					line-height: 48rpx;
					border-radius: 0px 16rpx 0px 16rpx;
					position: absolute;
					right: 0;
					top: 0;
					text-align: center;
					background: linear-gradient(228.64deg, rgba(251, 146, 146, 1), rgba(244, 57, 23, 1) 100%);
				}

				.querydetailBlue {
					width: 160rpx;
					height: 64rpx;
					position: absolute;
					right: 48rpx;
					bottom: 48rpx;
					background: rgba(226, 42, 44, 0.1);
					border: 1rpx solid rgba(226, 42, 44, 0.2);
					border-radius: 32rpx;
					text-align: center;
					line-height: 64rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: rgba(226, 42, 44, 1);
				}

				.leftSize {
					width: 64rpx;
					height: 64rpx;
					position: absolute;
					right: 64rpx;
					bottom: 48rpx;
				}
			}
		}

	}

	.rightBox {
		.selectBox {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;
			padding-top: 32rpx;

			.selectLeft {
				width: 152rpx;
				height: 80rpx;
				background-color: #fff;
				border-radius: 12rpx;
				display: flex;
				justify-content: space-between;
				padding: 0 24rpx;
				align-items: center;
			}

			.selectRight {
				width: 352rpx;
				height: 80rpx;
				background-color: #fff;
				border-radius: 12rpx;
				display: flex;
				justify-content: space-between;
				padding: 0 24rpx;
				align-items: center;
				position: relative;



			}
		}

		.boxpage {
			padding: 30rpx 32rpx 0;
			height: auto;
			overflow-y: scroll;
			// background-color: #fff;

			.patrolMission {
				width: 664rpx;
				height: auto;
				background-color: #fff !important;
				// background-image: url('/static/blueback.png');
				// background-repeat: no-repeat;
				// background-size: cover;
				padding: 24rpx 0 0 24rpx;
				border-radius: 16rpx;
				position: relative;
				margin-bottom: 24rpx;
				padding-bottom: 32rpx;

				.topName {
					color: rgba(51, 51, 51, 1);
					font-size: 28rpx;
					font-weight: 600;
					line-height: 32rpx;
					text-align: left;
					position: relative;

					.postab {
						position: absolute;
						left: 0;
						width: 128rpx;
						height: 8rpx;
						bottom: -5rpx;

					}

				}

				.frequency {
					margin-top: 40rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.date {
					margin-top: 30rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.rightTop {
					width: 128rpx;
					height: 48rpx;
					font-size: 24rpx;
					color: #fff;
					line-height: 48rpx;
					border-radius: 0px 16rpx 0px 16rpx;
					position: absolute;
					right: 0;
					top: 0;
					text-align: center;
					background: linear-gradient(228.64deg, rgba(146, 205, 251, 1), rgba(23, 124, 244, 1) 100%);
				}

				.querydetailBlue {
					width: 160rpx;
					height: 64rpx;
					position: absolute;
					right: 48rpx;
					bottom: 48rpx;
					background: rgba(3, 102, 241, 0.1);
					border: 1rpx solid rgba(3, 102, 241, 0.2);
					border-radius: 32rpx;
					text-align: center;
					line-height: 64rpx;
					color: rgba(3, 102, 241, 1);
					font-size: 28rpx;
					font-weight: 400;
				}

				.leftSize {
					width: 64rpx;
					height: 64rpx;
					position: absolute;
					right: 64rpx;
					bottom: 48rpx;
				}
			}

			.patrolMissionRed {
				width: 664rpx;
				background-color: #fff;
				height: auto;
				background-image: url('/static/renback.png');
				// background-size: 100%;
				// padding: 24rpx 0 0 24rpx;
				position: relative;
				margin-bottom: 24rpx;

				.topName {
					color: rgba(51, 51, 51, 1);
					font-size: 28rpx;
					font-weight: 600;
					line-height: 32rpx;
					text-align: left;
					position: relative;

					.postab {
						position: absolute;
						left: 0;
						width: 128rpx;
						height: 8rpx;
						bottom: -5rpx;

					}

				}

				.frequency {
					margin-top: 40rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.date {
					margin-top: 30rpx;
					color: rgba(86, 86, 86, 1);
					font-family: Microsoft YaHei;
					font-size: 28rpx;
					font-weight: 400;
					line-height: 42rpx;
					text-align: left;
				}

				.rightTop {
					width: 128rpx;
					height: 48rpx;
					font-size: 24rpx;
					color: #fff;
					line-height: 48rpx;
					border-radius: 0px 16rpx 0px 16rpx;
					position: absolute;
					right: 0;
					top: 0;
					text-align: center;
					background: linear-gradient(228.64deg, rgba(251, 146, 146, 1), rgba(244, 57, 23, 1) 100%);
				}

				.querydetailBlue {
					width: 160rpx;
					height: 64rpx;
					position: absolute;
					right: 48rpx;
					bottom: 48rpx;
					background: rgba(226, 42, 44, 0.1);
					border: 1rpx solid rgba(226, 42, 44, 0.2);
					border-radius: 32rpx;
					text-align: center;
					line-height: 64rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: rgba(226, 42, 44, 1);
				}

				.leftSize {
					width: 64rpx;
					height: 64rpx;
					position: absolute;
					right: 64rpx;
					bottom: 48rpx;
				}
			}
		}
	}

	.autoHeight {
		width: 100%;
		height: auto;
		background-color: #fff;
		padding-top: 34rpx;
		position: relative;
		color: rgba(51, 51, 51, 1);
		font-family: "Microsoft YaHei";
		font-size: 32rpx;
		font-weight: 600;
		line-height: 48rpx;
		letter-spacing: 0px;

		.topTxt {
			text-align: center;
		}

		.uicons {
			position: absolute;
			right: 46rpx;
			top: 40rpx;
		}

		.heibox {
			height: auto;
			padding: 52rpx 46rpx 48rpx;
			display: flex;
			flex-wrap: wrap;

			.smallBox {
				width: 202rpx;
				height: 64rpx;
				border: 2rpx solid rgba(3, 102, 241, 0.15);
				border-radius: 40rpx;
				line-height: 64rpx;
				text-align: center;
				color: rgba(51, 51, 51, 1);
				font-size: 28rpx;
				font-weight: 400;
				margin-right: 20rpx;
				margin-bottom: 30rpx;

				&:nth-child(3n) {
					// 去除第3n个的margin-right
					margin-right: 0rpx;
				}

			}

			.picker-view {
				width: 750rpx;
				height: 400rpx;
				margin-top: 20rpx;
			}

			.item {
				line-height: 60rpx;
				text-align: center;
			}
		}

		.confimBtn {
			border-radius: 44rpx;
			width: 686rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: linear-gradient(112.20deg, rgba(112.28693389892578, 191.46656799316406, 247.03125, 1), rgba(38.70535659790039, 116.93612670898438, 212.87945556640625, 1) 100%);
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