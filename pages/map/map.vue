<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" textContent='掌上一张图'></head-nav>
		<view style="height: 176rpx;">
		</view>
		<view class="map">
			<oneMap :data="selectMap" :isflag="isflag" :focusData="focusData" :location="location"></oneMap>
		</view>
		<!-- <view class="poxt"> -->
		<image src="/static/address.png" mode="" class="addressImg" @click="uniGetLocagin"></image>
		<image @click="openbomshow" src="/static/LAYER.png" mode="" class="LAYERImg"></image>
		<uni-search-bar class="searchBar" @focus="onFocus" @confirm="search" v-model="searchValue" radius="5"
			placeholder="请输入厂站名称" clearButton="none" cancelButton="none" />
		<!-- <view type="primary" class="resetBtn"></view> -->
		<u-button type="primary" class="resetBtn" text="复位" @click="reset"></u-button>
		<!-- </view> -->
		<u-popup :show="bomshow" round="10" mode="bottom" @close="closeBomshow">
			<view class="bomBox">
				<view class="disflex">
					<view class="disflexTxt">
						图层
					</view>
					<uni-icons @click="closeBomshow" type="closeempty" size="24"></uni-icons>
				</view>
				<view class="imgList">
					<view @click="onecheckBoolear(index,i.isCheck)" class="imgBox" v-for="(i,index) in treeList"
						:key="index">
						<image v-if="i.layerName == '城市水厂'"
							:src="i.isCheck ?'/static/cityWater.png':'/static/uncityWater.png'" mode="" class="imgSize">
						</image>
						<image v-if="i.layerName == '乡镇水厂'"
							:src="i.isCheck ?'/static/townWater.png':'/static/untownWater.png'" mode="" class="imgSize">
						</image>
						<image v-if="i.layerName == '联村供水站'"
							:src="i.isCheck ?'/static/lianWater.png':'/static/unlianWater.png'" mode="" class="imgSize">
						</image>
						<image v-if="i.layerName == '单村供水站'"
							:src="i.isCheck ?'/static/danWater.png':'/static/undanWater.png'" mode="" class="imgSize">
						</image>
						<!-- 	<image :src="i.layerIcon" mode="" class="imgSize"></image>
						<image :src="i.layerIcon" mode="" class="imgSize"></image>
						<image :src="i.layerIcon" mode="" class="imgSize"></image> -->
						<view class="imgBoxTxt">
							{{i.layerName}}
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup :show="bigbomshow" round="10" mode="bottom" @close="closebigBomshow">
			<view class="bigbomBox">
				<u-input placeholder="请输入内容" prefixIcon="arrow-left" border="surround" v-model="searchValue"
					@input="inputChange">
					<template slot="suffix">
						<view style="color: rgba(3, 102, 241, 1);" @click="inputChange">
							搜索
						</view>
					</template>
				</u-input>
				<view class="imgList">
					<view @click="checkBoolearelse(key,item.checkBoolear)" class="imgBox"
						v-for="(item,key) in treeListelse" :key="key">
						<image v-if="item.layerName == '城市水厂'"
							:src="item.isCheck ?'/static/cityWater.png':'/static/uncityWater.png'" mode=""
							class="imgSize">
						</image>
						<image v-if="item.layerName == '乡镇水厂'"
							:src="item.isCheck ?'/static/townWater.png':'/static/untownWater.png'" mode=""
							class="imgSize">
						</image>
						<image v-if="item.layerName == '联村供水站'"
							:src="item.isCheck ?'/static/lianWater.png':'/static/unlianWater.png'" mode=""
							class="imgSize">
						</image>
						<image v-if="item.layerName == '单村供水站'"
							:src="item.isCheck ?'/static/danWater.png':'/static/undanWater.png'" mode=""
							class="imgSize">
						</image>
						<view class="imgBoxTxt">
							{{item.layerName}}
						</view>
					</view>
				</view>
				<view class="SiteList">
					<view class="">
						站点列表
					</view>
					<view class="SiteListScroll">
						<view class="SiteImg" v-for="q in selectData" @click="gotoMap(q)">
							<view class="">
								{{q.wawoName}}
							</view>
							<image src="/static/zuhe3219.png" class="zuhe3219" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import {
		getAPi,
		postAPi,
		dlpostAPi,
		imgGet,
		elsepostAPi
	} from "@/units/api.js";
	import {
		systemInfo
	} from '../../units/system_info.js'
	import oneMap from '@/components/oneMap.vue'
	import {
		mapTree
	} from '@/units/request.js'
	export default {
		components: {
			HeadNav,
			oneMap,
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				defaultValue: 1,
				searchValue: "",
				bomshow: false,
				isflag: false,
				bigbomshow: false,
				selectMap: [],
				treeList: [],
				treeListelse: [],
				selectData: [],
				focusData: {},
				location: {

				}
			}
		},
		onShow() {
			this.getmapTree()
			
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
			getmapTree() {
				mapTree().then(res => {
					console.log(res)
					this.treeList = JSON.parse(JSON.stringify(res.data.data[0].geoMapLayerDataList))
					this.treeListelse = JSON.parse(JSON.stringify(res.data.data[0].geoMapLayerDataList))
					
					this.onecheckBoolear(3,null)  //进来默认选中单村供水站
				})
			},
			search() {
				console.log('111')
				this.bigbomshow = true
			},
			uniGetLocagin() {
				let that = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						console.log('当前位置的经度：' + res.longitude);

						console.log('当前位置的纬度：' + res.latitude);
						that.location = {
							longitude: res.longitude,
							isflag:!that.isflag,
							latitude: res.latitude

						}
					}
				});
			},
			onFocus() {
				var icon = []
				this.bigbomshow = true
				this.treeListelse.map((e, inx) => {
					if (inx == 0) {
						e.isCheck = true
						icon.push(e.layerName)
					} else {
						e.isCheck = false
					}
				})
				getAPi(`${this.treeListelse[0].layerReqUrl}?${this.praseStr(this.treeListelse[0].layerReqParams)}`).then(
					res => {
						console.log(res)
						res.data.rows.map((e, inx) => {
							e.layerName = icon[inx]
						})
						this.selectData = res.data.rows
					})
			},

			inputChange() {
				console.log(this.searchValue)
				this.treeListelse.map((e, inx) => {
					if (e.isCheck) {
						getAPi(
								`${e.layerReqUrl}?${this.praseStr(e.layerReqParams)}&searchValue=${this.searchValue}`
							)
							.then(
								res => {
									console.log(res)
									this.selectData = res.data.rows
								})
					}
				})
			},

			openbomshow() {
				this.bomshow = true
			},
			closebigBomshow() {
				this.bigbomshow = false
				this.searchValue = ''
			},
			closeBomshow() {
				this.bomshow = false
			},
			praseStr(e) {
				const obj = JSON.parse(e);
				return Object.entries(obj)
					.map(([key, value]) => `${key}=${value}`)
					.join('&');
			},
			gotoMap(item) {
				console.log(item)
				this.focusData = item
				this.bigbomshow = false
			},
			async onecheckBoolear(i, boolean) {
				console.log(i, boolean)
				this.selectMap = []
				var temporaryData = []
				var mapicon = []
				if (this.treeList[i].isCheck == null || this.treeList[i].isCheck == false) {
					this.treeList[i].isCheck = true
				} else {
					this.treeList[i].isCheck = false
				}
				await this.treeList.map(e => {
					if (e.isCheck) {
						if (e.layerReqType == 'get') {
							temporaryData.push(getAPi(`${e.layerReqUrl}?${this.praseStr(e.layerReqParams)}`))
							mapicon.push(e.layerName)
						}
					}
				})
				await Promise.all(temporaryData).then((
					values) => {
					values.map((e, index) => {
						e.data.rows.map(res => {
							res.layerName = mapicon[index]
						})
					})
					this.selectMap = values
					console.log(this.selectMap, 's')
				});
			},
			checkBoolearelse(i, boolean) {
				var ico = [this.treeListelse[i].layerName]
				console.log(ico)
				this.treeListelse.map((e, inx) => {
					if (i == inx) {
						e.isCheck = true
						getAPi(`${e.layerReqUrl}?${this.praseStr(e.layerReqParams)}`).then(
							res => {
								console.log(res)
								res.data.rows.map((e, inx) => {
									e.layerName = ico[0]
								})
								this.selectData = res.data.rows
							})
					} else {
						e.isCheck = false
					}
				})
				// if (this.treeListelse[i].isCheck == null || this.treeListelse[i].isCheck == false) {
				// 	this.treeListelse[i].isCheck = true
				// } else {
				// 	this.treeListelse[i].isCheck = false
				// }
				// await this.treeListelse.map(e => {
				// 	if (e.isCheck) {
				// 		if (e.layerReqType == 'get') {
				// 			temporaryData.push(getAPi(`${e.layerReqUrl}?${this.praseStr(e.layerReqParams)}`))
				// 			mapicon.push(e.layerName)
				// 		}
				// 	}
				// })
			},
			reset() {
				this.isflag = !this.isflag
				this.getmapTree()
			},
			checkBoolear(index, e) {
				// console.log(this.imgList[index].checkBoolear)
				// console.log(e)
				// this.imgList[index].checkBoolear = !e

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

		.addressImg {
			position: fixed;
			right: 32rpx;
			top: 200rpx;
			width: 64rpx;
			height: 64rpx;
			z-index: 999;
		}

		.LAYERImg {
			position: fixed;
			right: 32rpx;
			top: 280rpx;
			width: 64rpx;
			height: 64rpx;
			z-index: 999;

		}

		.searchBar {
			position: fixed;
			left: 32rpx;
			bottom: 30rpx;
			width: 320rpx;
			height: 64rpx;
			z-index: 999;
		}

		.resetBtn {
			position: fixed;
			right: 32rpx;
			bottom: 46rpx;
			width: 160rpx;
			height: 72rpx;
			text-align: center;
			color: #fff;
			background-color: #0386F1;
			line-height: 72rpx;
			border-radius: 16rpx;
			border: none;
			z-index: 999;
		}

		.bomBox {
			width: 100%;
			height: 300rpx;
			// background: red;
			background: rgba(243, 245, 249, 1);
			padding: 36rpx 32rpx 0;

			.disflex {
				display: flex;
				padding-right: 64rpx;
				justify-content: space-between;

				.disflexTxt {
					color: rgba(51, 51, 51, 1);
					font-family: "Microsoft YaHei";
					font-size: 32rpx;
					font-weight: 600;
					line-height: 48rpx;
					letter-spacing: 0rpx;
					text-align: center;
				}
			}

			.imgList {
				width: 626rpx;
				height: 128rpx;
				background-color: #fff;
				margin-top: 34rpx;
				border-radius: 20rpx;
				padding-left: 30rpx;
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				padding-right: 30rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.imgBox {
					width: 144rpx;
					height: 116rpx;
					// border: 2rpx solid #0366F1;
					// border-radius: 10rpx;
					// background-color: #0386f10d;

					.imgSize {
						width: 64rpx;
						height: 64rpx;
						display: block;
						margin: 0 auto;
					}

					.imgBoxTxt {
						color: rgba(51, 51, 51, 1);
						font-family: "Microsoft YaHei";
						font-size: 28rpx;
						font-weight: 400;
						line-height: 42rpx;
						text-align: center;
					}
				}

				.unimgBox {
					width: 144rpx;
					height: 116rpx;
					border: 2rpx solid #fff;
					background-color: #0386f10d;

					.imgSize {
						width: 64rpx;
						height: 64rpx;
						display: block;
						margin: 0 auto;
					}

					.imgBoxTxt {
						color: rgba(51, 51, 51, 1);
						font-family: "Microsoft YaHei";
						font-size: 24rpx;
						font-weight: 400;
						line-height: 42rpx;
						text-align: center;
					}
				}
			}

		}

		.bigbomBox {
			width: 100%;
			height: auto;
			// background: red;
			background: rgba(243, 245, 249, 1);
			// padding: 36rpx 32rpx 0;

			.disflex {

				display: flex;
				padding-right: 64rpx;
				justify-content: space-between;

				.disflexTxt {
					color: rgba(51, 51, 51, 1);
					font-family: "Microsoft YaHei";
					font-size: 32rpx;
					font-weight: 600;
					line-height: 48rpx;
					letter-spacing: 0rpx;
					text-align: center;
				}
			}


			.imgList {
				width: 626rpx;
				height: 128rpx;
				background-color: #fff;
				margin-top: 34rpx;
				border-radius: 20rpx;
				padding-left: 30rpx;
				padding-top: 32rpx;
				padding-right: 30rpx;
				margin-left: 32rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.imgBox {
					width: 144rpx;
					height: 116rpx;
					// border: 2rpx solid #0366F1;
					// background-color: #0386f10d;

					.imgSize {
						width: 64rpx;
						height: 64rpx;
						display: block;
						margin: 0 auto;
					}

					.imgBoxTxt {
						color: rgba(51, 51, 51, 1);
						font-family: "Microsoft YaHei";
						font-size: 24rpx;
						font-weight: 400;
						line-height: 42rpx;
						text-align: center;
					}


				}

				.unimgBox {
					width: 144rpx;
					height: 116rpx;
					border: 2rpx solid #fff;
					background-color: #0386f10d;

					.imgSize {
						width: 64rpx;
						height: 64rpx;
						display: block;
						margin: 0 auto;
					}

					.imgBoxTxt {
						color: rgba(51, 51, 51, 1);
						font-family: "Microsoft YaHei";
						font-size: 24rpx;
						font-weight: 400;
						line-height: 42rpx;
						text-align: center;
					}
				}
			}

			.SiteList {
				width: 654rpx;
				height: auto;

				background-color: #fff;
				margin-left: 32rpx;
				margin-top: 24rpx;
				border-radius: 20rpx 20rpx 0 0;
				padding: 32rpx 0 0 32rpx;

				.SiteListScroll {
					height: 600rpx;
					overflow-y: scroll;

					.SiteImg {
						width: 600rpx;
						height: 80rpx;
						border-bottom: 2rpx solid rgba(225, 225, 225, 1);
						display: flex;
						margin-left: 18rpx;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 32rpx;

						.zuhe3219 {
							width: 32rpx;
							height: 32rpx;
							margin-right: 12rpx;

						}
					}
				}

			}

		}


	}
</style>