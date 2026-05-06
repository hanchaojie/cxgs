<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='监测管理'></head-nav>
		<view style="height: 176rpx;"></view>
		<view class="selectBox">
			<view class="selectLeft" @click="openSelectBox">
				缙云县{{addvcdName}}
				<u-icon name="arrow-down-fill" color="#000" size="14"></u-icon>
			</view>
			<view class="selectRight">
				<input type="text" v-model="wawoName" @input="iptWawoName" />
				<uni-icons type="search" size="20"></uni-icons>
			</view>
		</view>
		<view class="box">
			<view class="topBox">
				<view class="flex1" :class="checkNum == 1 ? 'topBoxFlexL':''" @click="checkNumBtn(1)">
					<view :class="checkNum == 1 ? 'flexNum':'unflexNum'">
						{{totalNum}}个
					</view>
					<view :class="checkNum==1 ? 'flexName' :'unflexName'">
						厂站总数
					</view>
				</view>
				<view class="flex1" :class="checkNum == 2 ? 'topBoxFlexC':''" @click="checkNumBtn(2)">
					<view :class="checkNum == 2 ? 'flexNum':'unflexNum'">
						{{normalNum}}个
					</view>
					<view :class="checkNum == 2 ? 'flexName':'unflexName'">
						水质正常
					</view>
				</view>
				<view class="flex1" :class="checkNum == 3 ? 'topBoxFlexR':''" @click="checkNumBtn(3)">
					<view :class="checkNum == 3 ? 'flexNum':'unflexNum'">
						{{abnormalNum}}个
					</view>
					<view :class="checkNum == 3 ? 'flexName':'unflexName'">
						水质异常
					</view>
				</view>
			</view>
			<view class="scrollList">
				<view class="contentBox" v-for="item in childrenList" @click="gotoNext(item)">
					<view class="topName">
						{{item.wawoName}}
						<image src="/static/barCode.png" mode="" class="postab"></image>
					</view>
					<view class="waterQuality">
						<view class="waterQualityL">
							<view class="" style="font-size: 28rpx;">
								供水水质：
							</view>
							<view :class="item.wqStatus=='1'?'normal':item.wqStatus=='0'?'unonline':'unflase'">
								<!-- {{item.wqStatus }} -->
								{{item.wqStatus=='1'?'正常':item.wqStatus=='0'?'离线':'异常'}}
							</view>
						</view>
						<view class="waterQualityR">
							<view class="" style="font-size: 28rpx;">
								水池液位：
							</view>
							<view class="normal">
								{{item.waterLevel !== null?item.waterLevel:'--'}}m
							</view>
						</view>
					</view>
					<view class="waterSupply">
						<view class="waterSupplyL">
							<view class="" style="font-size: 28rpx;">
								出厂流量：
							</view>
							<view class="normal">
								{{item.supplyQ !== null?item.supplyQ:'--'}}m³/h
							</view>
						</view>
						<view class="waterSupplyR">
							<view class="" style="font-size: 28rpx;">
								今日供水：
							</view>
							<view class="normal">
								{{item.daySupplyQ !== null?item.daySupplyQ:'--'}}m³
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
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
		getautomaticgetStatusCount,
		jianceMon
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
				checkNum: 1,
				addvcdName: '',
				allList: [],
				columns: [],
				columnData: [],
				childrenList: [],
				addvcd: '',
				addressPopup: false,
				totalNum: '',
				normalNum: '',
				abnormalNum: '',
				wawoName: "",
				statsList: [{
						number: '100个',
						label: '厂站总数'
					},
					{
						number: '93个',
						label: '水质正常'
					},
					{
						number: '3个',
						label: '水质异常'
					}
				],
				currentActive: 0 // 默认选中第一个
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
		},
		onShow() {
			this.QueryGettreeByAddvcd()
			this.wawoName = ''
			// this.getjianceMon()
		},
		methods: {
			getjianceMon(id) {
				jianceMon(
					`?pageNum=1&pageSize=99999&addvcd=${id?id:""}&searchValue=${this.wawoName}&status=${this.checkNum==1?'':this.checkNum ==2?'1':'2,3'}`
				).then(res => {
					this.childrenList = res.data.rows
				})
			},
			querygetautomaticgetStatusCount(id) {
				getautomaticgetStatusCount(`?addvcd=${id?id:""}&searchValue=${this.wawoName}`).then(res => {
					this.totalNum = res.data.data.abnormal + res.data.data.normal + res.data.data.offline
					this.normalNum = res.data.data.normal
					this.abnormalNum = res.data.data.abnormal
				})
			},
			handleTabClick(index) {
				this.currentActive = index;
				// 这里还可以扩展点击后的其他逻辑，比如根据选中项发不同请求等
				console.log('当前选中的统计项：', this.statsList[index]);
			},
			checkNumBtn(e) {
				this.checkNum = e
				if (e == 2) {
					jianceMon(`?pageNum=1&pageSize=99999&addvcd=${this.addvcd}&status=1&searchValue=${this.wawoName}`)
						.then(res => {
							this.childrenList = res.data.rows

						})
				} else if (e == 1) {
					this.getjianceMon(this.addvcd)
				} else {
					jianceMon(`?pageNum=1&pageSize=99999&addvcd=${this.addvcd}&status=2,3&searchValue=${this.wawoName}`)
						.then(res => {
							this.childrenList = res.data.rows
						})
				}
			},
			gotoNext(item) {
				uni.navigateTo({
					url: `/pages/monitor/detail?wawoCode=${item.wawoCode}&name=${item.wawoName}`
				})
			},
			iptWawoName(e) {
				jianceMon(
					`?searchValue=${this.wawoName}&addvcd=${this.addvcd}&status=${this.checkNum==1?'':this.checkNum ==2?'1':'2'}`
					).then(res => {
					this.childrenList = res.data.rows
				})
			},
			QueryGettreeByAddvcd() {
				GettreeByAddvcd().then(res => {
					console.log(res)
					this.allList = res.data.data
					let twoColunmns = ['全部', ...res.data.data[0].children.map(e => {
						return e.name
					})]
					this.columns = [
						[res.data.data[0].name], twoColunmns
					]
					this.columnData = res.data.data[0].children.map(e => {
						return e.name
					})
					// this.addvcd = res.data.data[0].children[0].addvcd
					// this.addvcdName = res.data.data[0].children[0].name
					// this.childrenList = res.data.data[0].children[0].wawoList
					this.querygetautomaticgetStatusCount()
					this.getjianceMon()
					// this.defaultQuery()
				})
			},
			confirm(e) {
				console.log(e)
				if (e.value[1] == '全部') {
					this.addvcdName = ''
					this.getjianceMon()
					this.querygetautomaticgetStatusCount()
					this.addressPopup = false
				} else {
					this.addvcdName = e.value[1]
					this.addvcd = this.allList[0].children.find(e => e.name == this.addvcdName).addvcd,
						this.addressPopup = false
					this.getjianceMon(this.addvcd)
					this.querygetautomaticgetStatusCount(this.addvcd)
					// this.childrenList = this.allList[0].children.find(e => e.addvcd == this.addvcd).wawoList
					console.log(this.addvcd)
					console.log(this.addvcdName)
					// this.defaultQuery()
				}
			},
			openSelectBox() {
				// this.$refs.popup.open('bottom')
				this.addressPopup = true
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
			width: 302rpx;
			height: 80rpx;
			background-color: #fff;
			border-radius: 12rpx;
			display: flex;
			justify-content: space-between;
			padding: 0 24rpx;
			align-items: center;
		}

		.selectRight {
			width: 262rpx;
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

	.box {
		width: 690rpx;
		// height: 1200rpx;
		height: calc(100vh - 345rpx);
		margin-left: 30rpx;
		margin-top: 18rpx;
		border-radius: 16rpx;
		background: #fff;

		.topBox {


			width: 100%;
			height: 100rpx;
			border-radius: 16rpx;
			background-color: rgba(233, 242, 255, 1);
			display: flex;

			.flex1 {
				flex: 1;
				text-align: center;
				padding-top: 10rpx;

				.flexNum {
					color: rgba(3, 102, 241, 1);
					font-family: "Microsoft YaHei";
					font-size: 32rpx;
					line-height: 48rpx;
					text-align: center;
				}

				.unflexNum {
					color: rgba(86, 86, 86, 1);
					font-family: "Microsoft YaHei";
					font-size: 32rpx;
					line-height: 48rpx;
					text-align: center;
				}

				.unflexName {
					color: rgba(86, 86, 86, 1);
					font-size: 32rpx;
					line-height: 36rpx;
					// margin-top: 8rpx;
				}

				.flexName {
					color: rgba(3, 102, 241, 1);
					font-size: 32rpx;
					line-height: 36rpx;
					// margin-top: 8rpx;
				}
			}

			.topBoxFlexL {

				background: #fff;
				position: relative;
				border-radius: 16rpx 16rpx 0 0;

			}

			.topBoxFlexC {

				background: #fff;
				position: relative;
				border-radius: 16rpx 16rpx 0 0;

			}

			.topBoxFlexR {
				background: #fff;
				position: relative;
				border-radius: 16rpx 16rpx 0 0;
			}

			.topBoxFlexL::after {
				position: absolute;
				content: '';
				width: 40rpx;
				height: 40rpx;
				// line-height: 100px;
				// display: block;
				// text-align: center;
				background-image: radial-gradient(40rpx at 30rpx -0rpx, #e9f2ff 42rpx, #fff 30rpx);
				top: 61rpx;
				right: -40rpx;
			}

			.topBoxFlexC::before {
				position: absolute;
				content: '';
				width: 40rpx;
				height: 40rpx;
				// line-height: 100px;
				// display: block;
				// text-align: center;
				background-image: radial-gradient(40rpx at 0rpx 6rpx, #e9f2ff 42rpx, #fff 30rpx);
				top: 61rpx;
				left: -40rpx;
			}

			.topBoxFlexC::after {
				position: absolute;
				content: '';
				width: 40rpx;
				height: 40rpx;
				// line-height: 100px;
				// display: block;
				// text-align: center;
				background-image: radial-gradient(40rpx at 36rpx -0rpx, #e9f2ff 42rpx, #fff 30rpx);
				top: 61rpx;
				right: -40rpx;
			}

			.topBoxFlexR::before {
				position: absolute;
				content: '';
				width: 40rpx;
				height: 40rpx;
				// line-height: 100px;
				// display: block;
				// text-align: center;
				background-image: radial-gradient(40rpx at 0rpx 6rpx, #e9f2ff 42rpx, #fff 30rpx);
				top: 61rpx;
				left: -40rpx;
			}
		}

		.scrollList {
			height: calc(100% - 135rpx);
			overflow-y: scroll;

			.contentBox {
				width: 622rpx;
				height: 194rpx;
				background: rgba(3, 102, 241, 0.05);
				border-radius: 8rpx;
				margin-top: 30rpx;
				margin-left: 29rpx;
				padding: 16rpx 0 0 16rpx;

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

				.waterQuality {
					padding: 0 40rpx 0 20rpx;
					display: flex;
					justify-content: space-between;
					margin-top: 30rpx;
					line-height: 40rpx;

					.waterQualityL {
						display: flex;
						align-items: center;

						.normal {
							color: rgba(66, 201, 128, 1);
							font-size: 32rpx;
							line-height: 40rpx;
						}

						.unonline {
							color: #999;
							font-size: 32rpx;
							line-height: 40rpx;
						}

						.unflase {
							color: red;
							font-size: 32rpx;
							line-height: 40rpx;
						}
					}

					.waterQualityR {
						display: flex;
						align-items: center;

						.normal {
							color: rgba(66, 201, 128, 1);
							font-size: 32rpx;
							line-height: 40rpx;

						}
					}
				}

				.waterSupply {
					padding: 0 40rpx 0 20rpx;
					display: flex;
					justify-content: space-between;
					margin-top: 30rpx;
					line-height: 40rpx;

					.waterSupplyL {
						display: flex;
						align-items: center;

						.normal {
							color: rgba(66, 201, 128, 1);
							font-size: 32rpx;
							line-height: 40rpx;
						}
					}

					.waterSupplyR {
						display: flex;
						align-items: center;

						.normal {
							color: rgba(66, 201, 128, 1);
							font-size: 32rpx;
							line-height: 40rpx;
						}
					}
				}
			}
		}

	}
</style>