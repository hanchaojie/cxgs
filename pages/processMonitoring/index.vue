<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='工艺监控'></head-nav>
		<view style="height: 176rpx;">

		</view>
		<view class="selectBox">
			<view class="selectLeft" @click="openSelectBox">
				缙云县{{addvcdName}}
				<u-icon name="arrow-down-fill" color="#000" size="14"></u-icon>
			</view>
			<view class="selectRight">
				<input type="text" placeholder="请输入厂站名称" v-model="wawoName" @input="iptWawoName" />
				<uni-icons type="search" size="20" @click="gowoWebview"></uni-icons>
			</view>
		</view>
		<scroll-view scroll-y="true" class="boxpage">
			<view class="patrolMission" v-for="item in childrenList" @click="gowoWebview(item)">

				<view class="topName">
					{{item.wawoName}}
					<image src="/static/barCode.png" mode="" class="postab"></image>
				</view>

				<view class="frequency">
					所在地：<text style="color: rgba(51, 51, 51, 1);">{{item.wawoLoc}}</text>
				</view>
				<view class="rightTop" :class="item.treProc == '1'?'rightTop':'greenrightTop'">
					<text v-for=" i in Dict">
						<text v-if="i.dictValue == item.treProc">{{i.dictLabel }}</text>
					</text>
				</view>
				<image src="/static/left.png" mode="" class="leftSize">
				</image>
			</view>
		</scroll-view>
		<u-picker closeOnClickOverlay title='选择地区' :show="addressPopup" ref="uPicker" :columns="columns"
			@confirm="confirm" @change="changeHandler" @cancel="cancel" @close="cancel"></u-picker>
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		GettreeByAddvcd,
		queryDict
	} from '@/units/request.js'
	export default {
		components: {
			HeadNav
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				addvcdName: '',
				allList: [],
				columns: [],
				columnData: [],
				addvcd: '',
				addvcdName: "",
				addressPopup: false,
				childrenList: [],
				Dict: [],
				wawoName:'',

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
			this.getqueryDict()
		},
		methods: {
			getqueryDict() {
				queryDict(`?dictType=att_wawo_treatment_process`).then(res => {
					this.Dict = res.data.rows
					console.log(this.Dict)
				})
			},
			gowoWebview(item) {
				console.log(item)
				uni.navigateTo({
					url: `/pages/processMonitoring/webview?projectId=${item.vis2dId}&name=${item.wawoName}&stationId=${item.wawoCode}`
				})
			},
			openSelectBox() {
				// this.$refs.popup.open('bottom')
				this.addressPopup = true
			},
			QueryGettreeByAddvcd() {
				GettreeByAddvcd().then(res => {
					console.log(res)
					this.allList = res.data.data
					this.columns = [
						[res.data.data[0].name], res.data.data[0].children.map(e => {
							return e.name
						})
					]
					this.columnData = res.data.data[0].children.map(e => {
						return e.name
					})
					this.addvcd = res.data.data[0].children[0].addvcd
					this.addvcdName = res.data.data[0].children[0].name
					this.childrenList = res.data.data[0].children[0].wawoList
					console.log(this.childrenList)
					console.log(this.columnData)
					// this.defaultQuery()
				})
			},
			confirm(e) {
				console.log(e)
				this.addvcdName = e.value[1]
				this.addvcd = this.allList[0].children.find(e => e.name == this.addvcdName).addvcd,
					this.addressPopup = false
				this.childrenList = this.allList[0].children.find(e => e.addvcd == this.addvcd).wawoList
				console.log(this.addvcd)
				console.log(this.addvcdName)
				// this.defaultQuery()
			},
			iptWawoName(e){
				console.log(e)
				console.log(this.wawoName)
				GettreeByAddvcd(`?wawoName=${this.wawoName}`).then(res => {
					console.log(res)
					this.allList = res.data.data
					this.columns = [
						[res.data.data[0].name], res.data.data[0].children.map(e => {
							return e.name
						})
					]
					this.columnData = res.data.data[0].children.map(e => {
						return e.name
					})
					this.addvcd = res.data.data[0].children[0].addvcd
					this.addvcdName = res.data.data[0].children[0].name
					this.childrenList = res.data.data[0].children[0].wawoList
					console.log(this.childrenList)
					console.log(this.columnData)
				})
			},
			changeHandler(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e
				// 当第一列值发生变化时，变化第二列(后一列)对应的选项
				if (columnIndex === 0) {
					// picker为选择器this实例，变化第二列对应的选项
					picker.setColumnValues(1, this.columnData[index])
				}
			},
			cancel() {
				this.addressPopup = false
			},
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
	.selectBox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		padding-top: 32rpx;

		.selectLeft {
			width: 262rpx;
			height: 80rpx;
			background-color: #fff;
			border-radius: 12rpx;
			display: flex;
			justify-content: space-between;
			padding: 0 24rpx;
			align-items: center;
		}

		.selectRight {
			width: 302rpx;
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
		margin-left: 32rpx;
		padding-top: 22rpx;
		height: calc(100vh - 310rpx);

		.patrolMission {
			width: 662rpx;
			height: 152rpx;
			background-image: url('/static/samllback.png');
			background-size: 100%;
			background-repeat: no-repeat;
			padding: 24rpx 0 0 24rpx;
			position: relative;
			margin-bottom: 30rpx;
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
				margin-top: 40rpx;
				color: rgba(86, 86, 86, 1);
				font-family: Microsoft YaHei;
				font-size: 28rpx;
				font-weight: 400;
				line-height: 42rpx;
				text-align: left;
				width: 500rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.leftSize {
				width: 64rpx;
				height: 64rpx;
				position: absolute;
				right: 64rpx;
				bottom: 28rpx;
			}

			.rightTop {
				padding: 0 6rpx;
				height: 58rpx;
				font-size: 24rpx;
				color: #fff;
				line-height: 58rpx;
				border-radius: 0px 16rpx 0px 16rpx;
				position: absolute;
				right: 0;
				top: 0;
				text-align: center;
				background: linear-gradient(228.64deg, rgba(146, 205, 251, 1), rgba(23, 124, 244, 1) 100%);
			}

			.greenrightTop {
				padding: 0 6rpx;
				height: 58rpx;
				font-size: 24rpx;
				color: #fff;
				line-height: 58rpx;
				border-radius: 0px 16rpx 0px 16rpx;
				position: absolute;
				right: 0;
				top: 0;
				text-align: center;
				background: linear-gradient(228.64deg, rgba(125, 237, 165, 1), rgba(28, 221, 95, 1) 100%);
			}

		}

	}
</style>