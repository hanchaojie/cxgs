<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" :textContent='wawoName'></head-nav>
		<view style="height: 176rpx;">
		</view>
		<view class="topDisplay">
			<u-tabs :list="list1" @click="click" :scrollable="false" :activeStyle="{
            color: '#0366F1',fontWeight:'bold',fontSize:'32rpx'}" lineColor="#0366F1"></u-tabs>
		</view>
		<view class="" v-if="checkNum == 0">
			<image :src="info.commonFile[0].url" v-if="info.commonFile&&info.commonFile.length&&info.commonFile[0].url"
				mode="" class="monitorBack"></image>
			<view class="engineering">
				<view class="engineering_last">
					<view class="engineering_last_L" >
						工程位置
					</view>
					<view class="engineering_last_R" style="width: 440rpx;">
						{{info.wawoLoc?info.wawoLoc:'--'}}
					</view>
				</view>
				<view class="engineering_last">
					<view class="engineering_last_L">
						厂站类型
					</view>
					<view class="engineering_last_R">
						<text v-for="item in dict">
							<text v-if="item.value ==info.wawoType">{{item.label}}</text>
						</text>
					</view>
				</view>
				<view class="engineering_last">
					<view class="engineering_last_L">
						厂站规模
					</view>
					<view class="engineering_last_R">
						<text v-for="item in czdict">
							<text v-if="item.value ==info.wawoCap">{{item.label}}</text>
						</text>
					</view>
				</view>
				<view class="engineering_last">
					<view class="engineering_last_L">
						供水规模
					</view>
					<view class="engineering_last_R">
						{{info.supplyCap?info.supplyCap:'--'}}吨/日
					</view>
				</view>
				<view class="engineering_last">
					<view class="engineering_last_L">
						覆盖人口
					</view>
					<view class="engineering_last_R">
						{{info.coverPop!==null?info.coverPop :'--'}}人
					</view>
				</view>
				<view class="engineering_last">
					<view class="engineering_last_L">
						取水水源
					</view>
					<view class="engineering_last_R" style="text-align: right;">
						{{info.swhsNames?info.swhsNames:'--'}}
					</view>
				</view>
				<view class="engineering_last">
					<view class="engineering_last_L">
						用水主体
					</view>
					<view class="engineering_last_R" style="text-align: right;">
						{{info.bodyNames?info.bodyNames:'--'}}
					</view>
				</view>
			</view>
			<view class="Btns">
				<view class="Btns_L" @click="gotoWebView">
					制水工艺
				</view>
				<view class="Btns_R" @click="toMapAPP(info.latitude,info.longitude,info.wawoLoc)">
					地图导航
				</view>
			</view>
		</view>
		<realTimeMonitoring :checkData="checkData" v-else-if="checkNum == 1" />
		<waterSupplyMetering :checkData="checkData" v-else-if="checkNum == 2" />
		<videoPlay :checkData="checkData"  v-else-if="checkNum == 3" />

	</view>
</template>

<script>
	import HeadNav from '@/components/header.vue'
	import realTimeMonitoring from './realTimeMonitoring.vue'
	import waterSupplyMetering from './waterSupplyMetering.vue'
	import videoPlay from './video.vue'
	import {
		systemInfo
	} from '../../units/system_info.js'
	import {
		getAttWawoBase,
		queryDict
	} from '@/units/request.js'
	export default {
		components: {
			HeadNav,
			realTimeMonitoring,
			waterSupplyMetering,
			videoPlay
		},
		data() {
			return {
				containerStyle: '',
				navStyle: '',
				navHeightValue: 0,
				checkNum: 0,
				dict: [],
				info: {},
				wawoName: "",
				checkData: {},
				czdict: [],
				list1: [{
					name: '工程工况',
				}, {
					name: '实时监测',
				}, {
					name: '供水计量'
				}, {
					name: '视频监控'
				}]

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
			this.getqueryDict()
		},
		onLoad(item) {
			this.checkData = item
			this.wawoName = item.name
			this.wawoCode = item.wawoCode
			this.querygetAttWawoBase(item.wawoCode)
		},
		methods: {
			checkNumBtn(e) {
				this.checkNum = e
			},
			toMapAPP(latitude, longitude, name) {
				let url = "";
				if (plus.os.name == "Android") { //判断是安卓端
					plus.nativeUI.actionSheet({ //选择菜单
						title: "选择地图应用",
						cancel: "取消",
						buttons: [{
							title: "腾讯地图"
						}, {
							title: "百度地图"
						}, {
							title: "高德地图"
						}]
					}, function(e) {
						switch (e.index) {
							//下面是拼接url,不同系统以及不同地图都有不同的拼接字段
							case 1:
								//注意referer=xxx的xxx替换成你在腾讯地图开发平台申请的key
								url = `qqmap://map/geocoder?coord=${latitude},${longitude}&referer=xxx`;
								break;
							case 2:
								url =
									`baidumap://map/marker?location=${latitude},${longitude}&title=${name}&coord_type=gcj02&src=andr.baidu.openAPIdemo`;
								break;
							case 3:
								url =
									`androidamap://viewMap?sourceApplication=appname&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`;
								break;
							default:
								break;
						}
						if (url != "") {
							url = encodeURI(url);
							//plus.runtime.openURL(url,function(e){})调起手机APP应用
							plus.runtime.openURL(url, function(e) {
								plus.nativeUI.alert("本机未安装指定的地图应用");
							});
						}
					})
				} else {
					// iOS上获取本机是否安装了百度高德地图，需要在manifest里配置
					// 在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加
					//（如urlschemewhitelist:["iosamap","baidumap"]）  
					plus.nativeUI.actionSheet({
						title: "选择地图应用",
						cancel: "取消",
						buttons: [{
							title: "腾讯地图"
						}, {
							title: "百度地图"
						}, {
							title: "高德地图"
						}]
					}, function(e) {
						switch (e.index) {
							case 1:
								url = `qqmap://map/geocoder?coord=${latitude},${longitude}&referer=xxx`;
								break;
							case 2:
								url =
									`baidumap://map/marker?location=${latitude},${longitude}&title=${name}&content=${name}&src=ios.baidu.openAPIdemo&coord_type=gcj02`;
								break;
							case 3:
								url =
									`iosamap://viewMap?sourceApplication=applicationName&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`;
								break;
							default:
								break;
						}
						if (url != "") {
							url = encodeURI(url);
							plus.runtime.openURL(url, function(e) {
								plus.nativeUI.alert("本机未安装指定的地图应用");
							});
						}
					})
				}
			},
			gotoWebView() {
				uni.navigateTo({
					url: `/pages/processMonitoring/webview?systemType=APP&projectId=${this.info.vis2dId}&name=${this.info.wawoName}&stationId=${this.info.wawoCode}`
				})
			},
			click(item) {
				console.log('item', item);
				this.checkNum = item.index
			},
			querygetAttWawoBase(wawoCode) {
				getAttWawoBase(`${wawoCode}`).then(res => {
					console.log(res)
					this.info = res.data.data
				})
			},
			getqueryDict() {
				queryDict('?dictType=att_wawo_type').then(res => {
					console.log(res, 'dict')
					this.dict = res.data.rows.map(e => {
						return {
							value: e.dictValue,
							label: e.dictLabel
						}
					})
				})
				queryDict('?dictType=att_wawo_scale').then(res => {
					console.log(res, 'dict')
					this.czdict = res.data.rows.map(e => {
						return {
							value: e.dictValue,
							label: e.dictLabel
						}
					})
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
	.topDisplay {
		width: 100%;
		// display: flex;
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
				font-size: 30rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}

			.whiteTxt {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size: 30rpx;
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
				font-size: 30rpx;
				font-weight: 500;
				line-height: 36rpx;
				text-align: center;
			}

			.whiteTxt {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size: 30rpx;
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

	.monitorBack {
		width: 686rpx;
		height: 360rpx;
		border-radius: 16rpx;
		margin-left: 32rpx;
		margin-top: 30rpx;
	}

	.engineering {
		width: 622rpx;
		height: 700rpx;
		border-radius: 16rpx;
		margin-left: 32rpx;
		background-color: #fff;
		padding: 32rpx 32rpx 46rpx 32rpx;
		overflow-y: scroll;

		.engineering_last {
			display: flex;
			justify-content: space-between;
			margin-bottom: 32rpx;

			.engineering_last_L {
				color: rgba(86, 86, 86, 1);
				font-family: "Microsoft YaHei";
				font-size: 30rpx;
				line-height: 42rpx;
			}

			.engineering_last_R {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size:30rpx;
				line-height: 42rpx;
				width: 308rpx;
				text-align: right;
			}
		}
	}

	.Btns {
		display: flex;
		padding: 0 32rpx;
		margin-top: 64rpx;

		.Btns_L {
			width: 320rpx;
			height: 88rpx;
			background: #0366F1;
			color: #fff;
			border-radius: 16rpx;
			line-height: 88rpx;
			text-align: center;
			margin-right: 46rpx;
		}

		.Btns_R {
			width: 320rpx;
			height: 88rpx;
			background: #0366F1;
			color: #fff;
			border-radius: 16rpx;
			line-height: 88rpx;
			text-align: center;
		}
	}
</style>