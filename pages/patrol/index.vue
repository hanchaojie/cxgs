<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='巡查检查'></head-nav>
		<view style="height: 176rpx;background-color: #fff;">
		</view>
		<view class="topDisplay">
			<view class="leftDis" @click="checkNumBtn(1)">
				<image :src="checkNum == 1 ? '/static/patrolMission.png' : '/static/unpatrolMission.png'"
					class=" patrolSize" mode=""></image>
				<view :class="checkNum == 1 ?'blueTxt':'whiteTxt'">
					巡查任务
				</view>
			</view>
			<view class="rightDis" @click="checkNumBtn(2)">
				<image :src="checkNum==2 ? '/static/inspectionRecord.png' : '/static/uninspectionRecord.png'"
					class=" patrolSize" mode=""></image>
				<view :class="checkNum == 2 ?'blueTxt':'whiteTxt'">
					巡查记录
				</view>
			</view>
		</view>
		<view class="boxpage" v-if="checkNum == 1&&vloading">
			<view class="" v-if='patrolBox.length>0'>
				<view class="patrolMission" v-for="(i,index) in patrolBox" @click="gotoPatrol(i)">
					<view class="topName">
						{{i.title}}
						<image src="/static/barCode.png" mode="" class="postab"></image>
					</view>
					<view class="frequency">
						巡查频率：<text style="color: rgba(51, 51, 51, 1);">{{filterTask(allSelect,i.taskFrequency) }}</text>
					</view>
					<view class="date">
						起止日期：<text
							style="color: rgba(51, 51, 51, 1);">{{filterTime(i.patrolValidStm)}}~{{filterTime(i.patrolValidEtm)}}</text>
					</view>
					<view class="rightTop">
						{{ filterTask(partol_task_type,i.taskType)}}
					</view>
					<image src="/static/left.png" mode="" class="leftSize"></image>
				</view>
			</view>
			<view class="" v-else>
				<noDeta></noDeta>
			</view>
		</view>

		<view class="rightBox" v-else-if="checkNum == 2">
			<view class="selectBox">
				<!-- <view class="selectLeft" @click="openSelectBox"> -->
				<view class="selectLeft" @click="selectBtn">
					<view class="selectLeft_name">
						{{addvcdName}}
					</view>
					<u-icon name="arrow-down-fill" color="#000" size="14"></u-icon>
				</view>
				<view class="selectRight" @click="openTimePopup">
					{{yearMonth}}
					<uni-icons custom-prefix="iconfont" type="cxgsrili-" size="20"></uni-icons>
				</view>
			</view>
			<scroll-view scroll-y="true" class="boxpage" @scrolltolower="scrolltolower">
				<view class="" v-if="RecordList.length>0">
					<view :class="i.hasMatter == 1 ?'patrolMissionRed':'patrolMission' " v-for="(i,index) in RecordList"
						@click="gotoLedger(i)">
						<view class="topName">
							{{i.projectName}}
							<image src="/static/barCode.png" mode="" class="postab"></image>
						</view>
						<view class="frequency">
							巡查频率：<text
								style="color: rgba(51, 51, 51, 1);">{{filterTask(allSelect,i.taskFrequency) }}</text>
						</view>
						<view class="date">
							开始时间：<text style="color: rgba(51, 51, 51, 1);">{{i.stm |filterTimes}}
							</text>
						</view>
						<view class="date">
							结束时间：<text style="color: rgba(51, 51, 51, 1);">{{i.etm |filterTimes}}
							</text>
						</view>
						<view class="rightTop">
							{{i.hasMatter == 1?"有隐患":"正常"}}
						</view>
						<view class="querydetailBlue">
							查看详情
						</view>
						<!-- <image src="/static/left.png" mode="" class="leftSize"></image> -->
					</view>
				</view>
				<view class="" v-else>
					<noDeta></noDeta>
				</view>
			</scroll-view>
			<uni-load-more :status="loadMoreStatus"></uni-load-more>
		</view>

		<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
			<view class="autoHeight">
				<view class="topTxt">
					请选择
				</view>
				<uni-icons class="uicons" type="closeempty" size="24" @click="closeSelectBox"></uni-icons>
				<view class="heibox">
					<view :class="selectCode == i.wawoCode?'selectSmallBox':'smallBox' " v-for="i in allBaseList"
						@click="selectBase(i)">
						{{i.wawoName}}
					</view>
				</view>
			</view>
		</uni-popup>
		<u-picker :closeOnClickOverlay="true" title='选择工程' :show="addressPopup" ref="uPicker" :columns="columns"
			@confirm="confirm" @cancel="cancel" @close="cancel" @change="changeHandler"></u-picker>
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
	import noDeta from '@/components/nodeta.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		getUserTaskTodoList,
		queryDict,
		startXuncha,
		continueXuncha,
		GettreeByAddvcd,
		baseAttWawoBaseList,
		getpatrolRecordList
	} from '@/units/request.js'
	import {
		dayjs
	} from '@/uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js'
	export default {
		components: {
			HeadNav,
			noDeta
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
				pageNum: 1,
				value: [9999, month - 1, day - 1],
				yearMonth: dayjs().format('YYYY-MM'),
				timePopup: false,
				vloading: false,
				patrolBox: [],
				partol_task_type: [],
				patrol_task_frequency_0: [],
				patrol_task_frequency_1: [],
				patrol_task_frequency_2: [],
				patrol_task_frequency_3: [],
				patrol_task_frequency_4: [],
				allSelect: [],
				gotogotoPatrolData: {},
				allList: [],
				columns: [],
				addvcd: '',
				addvcdName: '全部',
				childrenList: [],
				addressPopup: false,
				allBaseList: [],
				RecordList: [],
				loadMoreStatus: 'more',
				selectCode: '',
				bigallColumns: [],
				allColumns: [],
			}
		},
		onShow() {
			this.queryTodoList()
			this.Dict()
			this.queryAllDict()
			// this.QueryGettreeByAddvcd()
			this.getbaseAttWawoBaseList()
			this.QueryGettreeByAddvcd() //获取工程列表
		},
		filters: {
			filterTimes(e) {
				return e.slice(5, 16)
			}
		},
		methods: {

			selectBase(e) {
				console.log(e)
				this.selectCode = e.wawoCode
				this.addvcdName = e.wawoName
				this.pageNum = 1
				this.RecordList = []
				this.loadMoreStatus = 'more'
				// 创建一个仅包含年份和月份的日期对象
				const date = dayjs(this.yearMonth); // 只指定年份和月份
				// 获取该月天数
				const daysInMonth = date.daysInMonth();
				if (e.wawoCode == '999999') {
					console.log(e)
					// 创建一个仅包含年份和月份的日期对象
					const date = dayjs(this.yearMonth); // 只指定年份和月份
					// 获取该月天数
					const daysInMonth = date.daysInMonth();
					console.log('到底了')
					if (this.loadMoreStatus !== 'more') return;
					getpatrolRecordList(
						`?pageNum=${this.pageNum}&pageSize=10&module=WAWO&stm=${this.yearMonth}-01 00:00:00&etm=${this.yearMonth}-${daysInMonth} 23:59:59`
					).then(rensphone => {
						console.log(rensphone, 'rensphone')
						if (rensphone.data.code == 200) {
							this.RecordList = [...this.RecordList, ...rensphone.data.rows]
							if (this.RecordList.length >= rensphone.data.total) {
								console.log(this.RecordList)
								this.loadMoreStatus = "noMore"
							} else {
								this.loadMoreStatus = "more"
								this.pageNum++
							}
							// console.log(this.tableData)
							typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
						}
					})
				} else {
					getpatrolRecordList(
						`?projectId=${e.wawoCode}&pageNum=${this.pageNum}&pageSize=10&module=WAWO&stm=${this.yearMonth}-01 00:00:00&etm=${this.yearMonth}-${daysInMonth} 23:59:59`
					).then(rensphone => {
						console.log(rensphone, 'rensphone')
						if (rensphone.data.code == 200) {
							this.RecordList = [...this.RecordList, ...rensphone.data.rows]
							if (this.RecordList.length >= rensphone.data.total) {
								console.log(this.RecordList)
								this.loadMoreStatus = "noMore"
							} else {
								this.loadMoreStatus = "more"
								this.pageNum++
							}
							// console.log(this.tableData)
							typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
						}
					})
				}
				this.$refs.popup.close()
			},
			scrolltolower() {
				console.log('到底了')
				if (this.loadMoreStatus !== 'more') return;
				// 创建一个仅包含年份和月份的日期对象
				const date = dayjs(this.yearMonth); // 只指定年份和月份
				// 获取该月天数
				const daysInMonth = date.daysInMonth();
				if (this.selectCode == '999999') {
					getpatrolRecordList(
						`?pageNum=${this.pageNum}&pageSize=10&module=WAWO&stm=${this.yearMonth}-01 00:00:00&etm=${this.yearMonth}-${daysInMonth} 23:59:59`
					).then(rensphone => {
						console.log(rensphone, 'rensphone')
						if (rensphone.data.code == 200) {
							this.RecordList = [...this.RecordList, ...rensphone.data.rows]
							if (this.RecordList.length >= rensphone.data.total) {
								console.log(this.RecordList)
								this.loadMoreStatus = "noMore"
							} else {
								this.loadMoreStatus = "more"
								this.pageNum++
							}
							typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
						}
					})
				} else {
					getpatrolRecordList(
						`?projectId=${this.selectCode}&pageNum=${this.pageNum}&pageSize=10&module=WAWO&stm=${this.yearMonth}-01 00:00:00&etm=${this.yearMonth}-${daysInMonth} 23:59:59`
					).then(rensphone => {
						console.log(rensphone, 'rensphone')
						if (rensphone.data.code == 200) {
							this.RecordList = [...this.RecordList, ...rensphone.data.rows]
							if (this.RecordList.length >= rensphone.data.total) {
								console.log(this.RecordList)
								this.loadMoreStatus = "noMore"
							} else {
								this.loadMoreStatus = "more"
								this.pageNum++
							}
							// console.log(this.tableData)
							typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
						}
					})
				}

			},
			getbaseAttWawoBaseList() {
				baseAttWawoBaseList().then(res => {
					console.log(res, 'res')
					this.selectCode = '999999'
					this.allBaseList = [{
						wawoCode: '999999',
						wawoName: '全部'
					}, ...res.data.rows]
				})
			},
			QueryGettreeByAddvcd() {
				let firstColumns
				let twoColumns
				let deptIdList = uni.getStorageSync('getInfo')
				GettreeByAddvcd().then(res => {
					console.log(res)


					res.data.data[0].children.unshift({
						name: '全部',
						parent_id: 1,
						wawoList: [],
						level: 4,
						addvcd: 999999,
						id: 99999
					})



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
			confirm(e) {
				console.log(e)

				console.log(this.bigallColumns)


				this.selectCode = e.wawoCode
				this.addvcdName = e.wawoName
				this.pageNum = 1
				this.RecordList = []
				this.loadMoreStatus = 'more'
				// 创建一个仅包含年份和月份的日期对象
				const date = dayjs(this.yearMonth); // 只指定年份和月份
				// 获取该月天数
				const daysInMonth = date.daysInMonth();



				if (e.value[0] == '全部') {
					this.selectCode = '999999'
					this.addvcdName = '全部'

					getpatrolRecordList(
						`?pageNum=${this.pageNum}&pageSize=10&module=WAWO&stm=${this.yearMonth}-01 00:00:00&etm=${this.yearMonth}-${daysInMonth} 23:59:59`
					).then(rensphone => {
						console.log(rensphone, 'rensphone')
						if (rensphone.data.code == 200) {
							this.RecordList = [...this.RecordList, ...rensphone.data.rows]
							if (this.RecordList.length >= rensphone.data.total) {
								console.log(this.RecordList)
								this.loadMoreStatus = "noMore"
							} else {
								this.loadMoreStatus = "more"
								this.pageNum++
							}
							// console.log(this.tableData)
							typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
						}
					})


				} else {
					this.addvcdName = e.value[1]
					let partId = this.bigallColumns.find(item => item.wawoName === e.value[1]).wawoCode
					getpatrolRecordList(
						`?projectId=${partId}&pageNum=${this.pageNum}&pageSize=10&module=WAWO&stm=${this.yearMonth}-01 00:00:00&etm=${this.yearMonth}-${daysInMonth} 23:59:59`
					).then(rensphone => {
						console.log(rensphone, 'rensphone')
						if (rensphone.data.code == 200) {
							this.RecordList = [...this.RecordList, ...rensphone.data.rows]
							if (this.RecordList.length >= rensphone.data.total) {
								console.log(this.RecordList)
								this.loadMoreStatus = "noMore"
							} else {
								this.loadMoreStatus = "more"
								this.pageNum++
							}
							// console.log(this.tableData)
							typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
						}
					})


				}
				this.addressPopup = false


			},
			cancel() {
				this.addressPopup = false
			},
			selectBtn() {
				this.addressPopup = true
			},
			Dict() {
				queryDict(`?dictType=partol_task_type`).then(res => {
					console.log(res, 'sadsadsadsa')
					this.partol_task_type = res.data.rows.map(e => {
						return {
							label: e.dictLabel,
							value: e.dictValue
						}
					})
				})

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
			filterTask(list, e) {

				return list.find(i => i.value == e).label
			},
			queryTodoList() {

				getUserTaskTodoList().then(res => {
					console.log(res)
					this.patrolBox = res.data.data
				})
			},
			checkNumBtn(e) {
				this.checkNum = e
				if (e == 2) {
					console.log(e)
					// 创建一个仅包含年份和月份的日期对象
					const date = dayjs(this.yearMonth); // 只指定年份和月份
					// 获取该月天数
					const daysInMonth = date.daysInMonth();
					console.log('到底了')
					if (this.loadMoreStatus !== 'more') return;
					getpatrolRecordList(
						`?pageNum=${this.pageNum}&pageSize=10&module=WAWO&stm=${this.yearMonth}-01 00:00:00&etm=${this.yearMonth}-${daysInMonth} 23:59:59`
					).then(rensphone => {
						console.log(rensphone, 'rensphone')
						if (rensphone.data.code == 200) {
							this.RecordList = [...this.RecordList, ...rensphone.data.rows]
							if (this.RecordList.length >= rensphone.data.total) {
								console.log(this.RecordList)
								this.loadMoreStatus = "noMore"
							} else {
								this.loadMoreStatus = "more"
								this.pageNum++
							}
							// console.log(this.tableData)
							typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
						}
					})
				}
			},
			openSelectBox() {
				this.$refs.popup.open('bottom')
				// this.addressPopup = true
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
			gotoPatrol(e) {
				this.$refs.centerPopup.open('center')
				this.gotogotoPatrolData = e
			},
			closeCenterPop() {
				this.$refs.centerPopup.close()
			},
			gotoPatrolDetail() {
				// uni.navigateTo({
				// 	url: '/pages/patrol/patrolDetail'
				// })
				// return
				var e = this.gotogotoPatrolData
				console.log(e)
				this.$refs.centerPopup.close()
				if (e.status == '0') {
					startXuncha(`?planId=${e.planId}&module=WAWO`).then(res => {
						console.log(res)
						if (res.data.code == 200) {
							uni.showToast({
								title: '开始巡查',
								duration: 2000,
								iocn: 'none'
							});
							uni.navigateTo({
								url: `/pages/patrol/patrolDetail?name=${e.title}&stm=${e.patrolValidStm}&patrolId=${res.data.data.id}&planId=${e.planId}&taskType=${e.taskType}&taskFrequency=${e.taskFrequency}&hasQr=${e.hasQr}`
							});
						}
					})
				} else if (e.status == '2') {
					continueXuncha(`?patrolId=${e.patrolId}`).then(res => {
						if (res.data.code == 200) {
							uni.showToast({
								title: '继续巡查',
								duration: 2000,
								iocn: 'none'
							});
							uni.navigateTo({
								url: `/pages/patrol/patrolDetail?name=${e.title}&stm=${e.patrolValidStm}&planId=${e.planId}&patrolId=${e.patrolId}&taskType=${e.taskType}&taskFrequency=${e.taskFrequency}&hasQr=${e.hasQr}`
							});
						}
					})
				} else if (e.status == '1') {
					uni.navigateTo({
						url: `/pages/patrol/patrolDetail?name=${e.title}&stm=${e.patrolValidStm}&planId=${e.planId}&patrolId=${e.patrolId}&taskType=${e.taskType}&taskFrequency=${e.taskFrequency}&hasQr=${e.hasQr}`
					});
				}





			},
			gotoLedger(i) {
				uni.navigateTo({
					url: `/pages/patrol/ledger?id=${i.id}`
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
				if (this.month < 10) {
					this.yearMonth = `${this.year}-0${this.month}`
				} else {
					this.yearMonth = `${this.year}-${this.month}`
				}
				this.loadMoreStatus = 'more'
				this.RecordList = []
				this.pageNum = 1
				// 创建一个仅包含年份和月份的日期对象
				const date = dayjs(this.yearMonth); // 只指定年份和月份
				// 获取该月天数
				const daysInMonth = date.daysInMonth();



				if (this.selectCode == '999999') {
					getpatrolRecordList(
						`?pageNum=${this.pageNum}&pageSize=10&module=WAWO&stm=${this.yearMonth}-01 00:00:00&etm=${this.yearMonth}-${daysInMonth} 23:59:59`
					).then(rensphone => {
						console.log(rensphone, 'rensphone')
						if (rensphone.data.code == 200) {
							this.RecordList = [...this.RecordList, ...rensphone.data.rows]
							if (this.RecordList.length >= rensphone.data.total) {
								console.log(this.RecordList)
								this.loadMoreStatus = "noMore"
							} else {
								this.loadMoreStatus = "more"
								this.pageNum++
							}
							// console.log(this.tableData)
							typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
						}
					})
				} else {
					getpatrolRecordList(
						`?projectId=${this.selectCode}&pageNum=${this.pageNum}&pageSize=10&module=WAWO&stm=${this.yearMonth}-01 00:00:00&etm=${this.yearMonth}-${daysInMonth} 23:59:59`
					).then(rensphone => {
						console.log(rensphone, 'rensphone')
						if (rensphone.data.code == 200) {
							this.RecordList = [...this.RecordList, ...rensphone.data.rows]
							if (this.RecordList.length >= rensphone.data.total) {
								console.log(this.RecordList)
								this.loadMoreStatus = "noMore"
							} else {
								this.loadMoreStatus = "more"
								this.pageNum++
							}
							// console.log(this.tableData)
							typeof fn == 'function' && fn(); //判断 如果是方法就执行这个方法
						}
					})
				}

				this.$refs.timePopup.close()
			},
			filterTime(e) {
				return e.substring(0, 10);
			}

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


	.boxpage {
		padding: 30rpx 32rpx 0;
		max-height: calc(100vh - 244rpx);
		overflow-y: scroll;

		.patrolMission {
			width: 664rpx;
			height: 232rpx;
			background-image: url('/static/blueback.png');
			background-size: 100%;
			padding: 24rpx 0 0 24rpx;
			position: relative;
			margin-bottom: 24rpx;

			.topName {
				color: rgba(51, 51, 51, 1);
				font-size: 32rpx;
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
				margin-top: 30rpx;
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

			.leftSize {
				width: 64rpx;
				height: 64rpx;
				position: absolute;
				right: 64rpx;
				bottom: 48rpx;
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
				width: 322rpx;
				height: 80rpx;
				background-color: #fff;
				border-radius: 12rpx;
				display: flex;
				justify-content: space-between;
				padding: 0 24rpx;
				align-items: center;

				.selectLeft_name {
					width: 280rpx;
					white-space: nowrap;
					/* 控制元素不换行 */
					overflow: hidden;
					/* p标签超出部分隐藏*/
					text-overflow: ellipsis;
					/* 文本超出部分为省略号 */
				}
			}


			.selectRight {
				width: 242rpx;
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
			height: calc(100vh - 454rpx);
			overflow-y: scroll;

			.patrolMission {
				width: 664rpx;
				height: 232rpx;
				background-image: url('/static/blueback.png');
				background-size: 100%;
				padding: 24rpx 0 0 24rpx;
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
				height: 232rpx;
				background-image: url('/static/renback.png');
				background-size: 100%;
				padding: 24rpx 0 0 24rpx;
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
					margin-top: 30rpx;
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
			height: 600rpx;
			overflow-y: scroll;
			padding: 52rpx 46rpx 48rpx;

			display: flex;
			flex-wrap: wrap;

			.smallBox {
				width: 182rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				padding: 0 10rpx;
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

			.selectSmallBox {
				width: 182rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				padding: 0 10rpx;
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
				background: #0366F10D;

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