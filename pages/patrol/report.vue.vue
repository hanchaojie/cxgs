<template>
	<view class="absolute">
		<head-nav :style="navStyle" :navHeightValue="navHeightValue" v-if="projectList[0]"
			:textContent='titleName'></head-nav>
		<view style="height: 176rpx;">
		</view>
		<view class="content" v-for="(item,key) in projectList">
			<view class="topImg">
				<!-- <image src="/pakB/static/default.png" class="imageSize"></image> -->
				<view style="margin-left: 24rpx;width: 224rpx;">
					<view style="font-size:32rpx;font-weight: 400;">{{ item.name }}</view>
					<view style="font-size: 28rpx;font-weight: 400;margin-top: 14rpx;color: #666;">巡查时间: -- </view>
					<view class="waitPatrol" v-if="!item.ischeckout">待巡查 </view>
					<view class="yeswaitPatrol" v-else="{{item.ischeckout}}">已巡查</view>
				</view>
				<view :class="item.ischeckout === false && item.isflag === true ? 'HiddenTroubleelse' : 'HiddenTrouble'"
					@click='reportDevelop(item)'>
					隐患上报
				</view>
			</view>
			<view class="position" v-for="(i,index) in item.subjectList">
				{{index+1}}.{{ i.name }}
				<view style="margin-top: 30rpx;margin-left: 20rpx;" v-if="i.inputType == 'INPUT'">
					<input placeholder="说明" class="inputClass" type="text" v-model="i.defaultValue" />
				</view>
				<view style="margin-top: 30rpx;margin-left: 20rpx;">
					<u-radio-group v-model="i.isflag" shape="circle" placement="row" @change="cheboxChange(i,key,index)"
						:disabled="item.ischeckout">
						<u-radio :customStyle="{marginRight: '40rpx'}" label="0" name="0">正常</u-radio>
						<u-radio label="1" name="1">异常</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="line">
				<view class="lineleft"></view>
				<view class="fr"></view>
				<view class="lineright"></view>
			</view>
		</view>
		<view class="upLoad" @click="recordsUpload">记录上传</view>
		<uni-popup ref="centerPopup" type="center" :mask-click="false">
			<view class="centerPop">
				<view class="titleTip">
					提示信息
				</view>
				<view class="contentTip">
					是否确认上传巡查记录?
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
		getTargetSubjectTree,
		submitCheck
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
				defaultValue: '',
				searchValue: "",
				bomshow: false,
				bigbomshow: false,
				openPop: false,
				projectList: [],
				titleName: "",
				stm: ""


			}
		},
		onLoad(e) {

			this.patrolId = e.patrolId
			this.targetType = e.targetType
			this.targetId = e.targetId
			this.titleName = e.name
			this.stm = e.stm


		},
		onShow() {
			// this.querygetTargetSubjectTree()



			if (uni.getStorageSync('projectList')) {
				console.log('1')
				this.projectList = uni.getStorageSync('projectList')
			} else {
				console.log('2')
				this.querygetTargetSubjectTree()
			}

			if (uni.getStorageSync('yinhuanList')) {
				console.log(uni.getStorageSync('yinhuanList'))
				console.log(this.projectList)
				for (var i = 0; i < this.projectList.length; i++) {
					console.log(this.projectList[i].id)
					if (this.projectList[i].id === uni.getStorageSync('yinhuanList').sid) {
						console.log('666666666')
						this.projectList[i].ischeckout = true
						for (var j = 0; j < this.projectList[i].subjectList.length; j++) {
							// this.projectList[i].subjectList[j].isflag = 1
							for (var a = 0; a < uni.getStorageSync('yinhuanList').subjectIdList.length; a++) {
								if (this.projectList[i].subjectList[j].id === uni.getStorageSync('yinhuanList')
									.subjectIdList[a]) {
									this.projectList[i].subjectList[j].isflag = 1 + ''
								}
							}
						}
					}
				}
				this.projectList = JSON.parse(JSON.stringify(this.projectList))
				console.log(this.projectList, 'zuihoudde')
				setTimeout(() => {
					console.log('yes')
					// let matterList = []

					if (uni.getStorageSync('matterList')) {
						console.log('matterList')


						var yseM = uni.getStorageSync('matterList')
						console.log(yseM)
						yseM.push(uni.getStorageSync('yinhuanList'))
						uni.setStorageSync('matterList', yseM)
						uni.removeStorageSync('yinhuanList')
					} else {
						console.log('nomatterList')

						uni.setStorageSync('matterList', [uni.getStorageSync('yinhuanList')])
					}
				}, 300);







			} else {
				console.log('no')

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
		methods: {
			querygetTargetSubjectTree() {
				getTargetSubjectTree(`?targetId=${this.targetId}&targetType=${this.targetType}&patrolId=${this.patrolId}`)
					.then(res => {

						for (var i = 0; i < res.data.data.length; i++) {
							res.data.data[i].ischeckout = false
							for (var j = 0; j < res.data.data[i].subjectList.length; j++) {
								res.data.data[i].subjectList[j].isflag = 0 + ''
								res.data.data[i].isflag = false
							}
						}
						this.projectList = res.data.data
						uni.setStorageSync('projectList', this.projectList)
						console.log(this.projectList)
					})
			},
			cheboxChange(e, key, index) {

				this.projectList[key].subjectList[index].isflag = e.isflag
				let hasTrueFlag = this.projectList[key].subjectList.some(item => item.isflag === '1');

				if (hasTrueFlag) {
					this.projectList[key].isflag = true

				} else {
					this.projectList[key].isflag = false

				}


			},

			recordsUpload() {
				// this.$refs.centerPopup.open('center')

				if (uni.getStorageSync('matterList') == '') {
					console.log('没有matterList')
					for (var i = 0; i < this.projectList.length; i++) {
						for (var j = 0; j < this.projectList[i].subjectList.length; j++) {
							if (this.projectList[i].subjectList.some(item => item.isflag === '1')) {
								console.log('有异常')
								uni.showToast({
									title: '当前有项目勾选了异常,请隐患上报',
									icon: 'none',
								})
							} else {
								console.log('无异常')
								this.$refs.centerPopup.open('center')
							}
						}
					}
				} else {
					this.$refs.centerPopup.open('center')
				}
			},
			gotoPatrolDetail() {
				const flattenedArray = this.projectList.flatMap(item => {
					return item.subjectList.map(subject => {
						const ivalue = {}
						if (subject.inputType == 'INPUT') {
							ivalue.inputValue = subject.defaultValue
						}
						return {
							subjectId: subject.id,
							status: subject.isflag,
							patrolId: this.patrolId,
							...ivalue
						}
					});
				});
				let a = {
					patrolId: this.patrolId,
					matterList: uni.getStorageSync('matterList') ? uni.getStorageSync('matterList') : [],
					checkList: flattenedArray
				}
				submitCheck(a).then(res => {
					console.log(res)
					uni.removeStorageSync('projectList')

					let thst = this
					if (res.data.msg == '2') {
						uni.$u.toast('上报成功结束巡查');

						setTimeout(() => {
							// uni.redirectTo({
							// 	url: `/pages/patrol/patrolDetail?name=${this.titleName}&stm=${this.stm}&patrolId=${this.patrolId}`
							// })
							uni.navigateBack()
						}, 300)

					} else if (res.data.msg == '1') {
						uni.$u.toast('上报成功暂未结束巡查');


						setTimeout(() => {
							// uni.redirectTo({
							// 	url: `/pages/patrol/patrolDetail?name=${this.titleName}&stm=${this.stm}&patrolId=${this.patrolId}`
							// })
							uni.navigateBack()
						}, 300)

					} else {
						uni.$u.toast('上报失败');

						setTimeout(() => {
							// uni.redirectTo({
							// 	url: `/pages/patrol/patrolDetail?name=${this.titleName}&stm=${this.stm}&patrolId=${this.patrolId}`
							// })
							uni.navigateBack()
						}, 300)

					}
				})
			},
			closeCenterPop() {
				this.$refs.centerPopup.close()
			},
			reportDevelop(e) {
				console.log(e)
				// uni.navigateTo({
				// 	url: '/pages/patrol/hazardReporting'
				// })
				if (e.isflag == false) {
					return
				}
				const newArray = e.subjectList.filter(item => item.isflag === '1').map(item =>
					item.id);
				const newName = e.subjectList.filter(item => item.isflag === '1').map(item => {
					return {
						newName: item.name
					}
				});
				let s = {
					sid: e.id,
					patrolId: this.patrolId,
					subjectIdList: newArray,
					projectId: e.subjectList[0].projectId ? e.subjectList[0].projectId : null,
					partId: e.subjectList[0].partId ? e.subjectList[0].partId : null,
					facilityId: e.subjectList[0].facilityId ? e.subjectList[0].facilityId : null,
				}
				let selectList = {
					name: e.name,
					newName: newName
				}
				uni.setStorageSync('roundsList', s);
				uni.setStorageSync('selectList', selectList);
				uni.navigateTo({
					url: `/pages/patrol/hazardReporting?name=${this.titleName}&stm=${this.stm}&patrolId=${this.patrolId}&targetType=${this.targetType}&targetId=${this.targetId}`
				});

			}
		}

	}
</script>
<style>
	page {
		background-color: #f3f5f9;
	}
</style>
<style lang="scss" scoped>
	/* pakA/pages/rounds/index.wxss */
	page {
		background-color: rgb(242, 245, 255);
		height: 100vh;
	}

	.backGround {
		height: 180rpx;
		/* position: fixed;
	  top: 180rpx;
	  left: 0; */
		background: linear-gradient(180.00deg, rgb(3, 102, 241), rgb(72, 147, 252) 100%);
	}

	.power {
		display: flex;
		padding: 0rpx 20rpx 0;
	}

	.title {
		width: 678rpx;
		height: 60rpx;
		background: #0366F11A;
		font-size: 26rpx;
		line-height: 60rpx;
		display: flex;
		align-items: center;
		padding-left: 24rpx;
		border-radius: 8rpx;
		margin-top: 24rpx;
		margin-left: 24rpx;
	}

	.circle {
		width: 12rpx;
		height: 12rpx;
		background: #0366F1;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.content {
		width: 698rpx;
		height: auto;
		background: rgba(255, 255, 255, 1);
		border-radius: 16rpx;
		margin-left: 24rpx;
		margin-top: 24rpx;
		box-shadow: rgba(0, 0, 0, 0.1);
	}

	.topImg {
		padding: 0 0 0 14rpx;
		height: 176rpx;
		background: #fff;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		box-shadow: 0px 0px 10rpx 0px rgba(224, 229, 238, 1);
	}

	.imageSize {
		width: 150rpx;
		height: 150rpx;
		border-radius: 8rpx;
	}

	.roundStatus {
		width: 92rpx;
		height: 36rpx;
		background: #F189281A;
		font-size: 24rpx;
		margin-top: 20rpx;
		line-height: 36rpx;
		text-align: center;
		border-radius: 4rpx;
		color: #F18928;
	}

	.HiddenTrouble {
		width: 160rpx;
		height: 64rpx;
		background: rgba(226, 42, 44, 0.2);
		border: 2rpx solid rgba(226, 42, 44, 0.2);
		line-height: 64rpx;
		text-align: center;
		color: rgba(226, 42, 44, .5);
		border-radius: 32rpx;
		margin-left: 220rpx;
	}

	.HiddenTroubleelse {
		width: 160rpx;
		height: 64rpx;
		background: rgba(226, 42, 44, 0.2);
		border: 2rpx solid rgba(226, 42, 44, 0.2);
		line-height: 64rpx;
		text-align: center;
		color: rgba(226, 42, 44, 1);
		border-radius: 32rpx;
		margin-left: 220rpx;
	}

	.waitPatrol {
		width: 92rpx;
		height: 36rpx;
		background-color: rgba(236, 148, 10, 0.1);
		font-size: 24rpx;
		color: rgba(236, 148, 10, 1);
		text-align: center;
		margin-top: 14rpx;
	}

	.backImg {
		width: 100%;
		height: 240rpx;
		background-size: 100% 100%;
		margin-top: -226rpx;
		top: 0;
		left: 0;
		position: relative;
		z-index: -1;
	}

	.titleImg {
		height: 100%;
		width: 100%;
		z-index: -1;
		position: absolute;
		background-size: 100%;
	}

	.yeswaitPatrol {
		width: 92rpx;
		height: 36rpx;
		background-color: rgba(66, 201, 128, 0.1);
		font-size: 24rpx;
		color: rgba(66, 201, 128, 1);
		text-align: center;
		margin-top: 14rpx;
	}

	.position {
		width: 95%;
		padding-left: 20rpx;
		font-size: 32rpx;
		margin-top: 40rpx;
	}

	.line {
		display: flex;
		margin-left: 28rpx;
		margin-top: 40rpx;
	}

	.lineleft {
		width: 290rpx;
		height: 2rpx;
		margin-right: 20rpx;
		background: rgba(241, 241, 241, 1);
	}

	.lineright {
		width: 290rpx;
		height: 2rpx;
		margin-left: 20rpx;
		background: rgba(241, 241, 241, 1);
	}

	.fr {
		width: 24rpx;
		height: 24rpx;
		border-top: 2rpx solid gainsboro;
		border-right: 2rpx solid gainsboro;
		transform: rotate(-45deg);
	}

	.upLoad {
		width: 702rpx;
		height: 80rpx;
		background: #0366F1;
		line-height: 80rpx;
		text-align: center;
		color: #fff;
		margin-left: 20rpx;
		margin-top: 32rpx;
		margin-bottom: 32rpx;
		border-radius: 10rpx;
	}

	.popup {
		width: 600rpx;
		height: 340rpx;
		border-radius: 20rpx;
		position: relative;
		padding-top: 20rpx;
	}

	.popupImg {
		width: 600rpx;
		height: 160rpx;
		position: absolute;
		z-index: -999;
		top: 0;
		left: 0;
	}

	.tips {
		text-align: center;
		font-size: 36rpx;
		font-weight: 700;
	}

	.contentitle {
		text-align: center;
		margin-top: 50rpx;
	}

	.btns {
		display: flex;
		margin-left: 40rpx;
		margin-top: 70rpx;
	}

	.closeBtn {
		width: 240rpx;
		height: 80rpx;
		border-radius: 44rpx;
		border: 2rpx solid rgba(220, 223, 229, 1);
		line-height: 80rpx;
		text-align: center;
		margin-right: 40rpx;
	}

	.corfimBtn {
		width: 240rpx;
		height: 80rpx;
		border-radius: 44rpx;
		background: linear-gradient(to right, rgba(112, 191, 247, 1), rgba(39, 117, 213, 1));
		line-height: 80rpx;
		color: #fff;
		text-align: center;
	}

	.inputClass {
		border-radius: 20rpx;
		border: 2rpx solid #f5f5f5;
		width: 500rpx;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 20rpx;
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
			margin-top: 64rpx;
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