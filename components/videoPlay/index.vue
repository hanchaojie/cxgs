<template>
	<view>

		<!-- <u-card :show-head="false" :show-foot="false" :border="false"> -->
			<!-- 获取到对应的视频监控信息videoObj通过message与:change:message传递给视图层(renderjs) -->
			<view style="position: relative;" id="vide" class="vide" slot="body" :message="videoObj"
				:change:message="videoRender.listChanged">
				<view id='hk-video' class="player"></view>
				<!-- 视频监控的加载 -->

				<u-loading-icon :show="loading"
					style="position: absolute;top: 48%;left: 48%;transform: translate(-50%, -50%);"></u-loading-icon>
			</view>
		<!-- </u-card> -->
	</view>
</template>

<script>
	export default {
		props: {
			videoObj: String
		},
		data() {
			return {
				player: null,
				videoObj: {},
				loading: false,
			}
		},
		mounted() {},
		methods: {
			//点击需要显示的监控视频，把信息赋值给videoObj
			vedioChange(item) {
				this.videoObj = item
			},
			//获取从视图层(renderjs)传过来的数据,控制数据监控的加载状态
			acceptDataFromRenderjs(data) {
				this.loading = data.loading
			}
		}
	}
</script>
<script module="videoRender" lang="renderjs">
	var _this = this;
	export default {
		data() {
			return {
				videoObjRender: {}, //接受逻辑层传过来的视频流和其他数据
				ownerVm: undefined //获取逻辑层的所有数据，为了获取监控视频的加载状态
			}
		},
		mounted() {
			if (typeof window.JSPlugin === 'function') {
				this.init()
			} else {
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在  根目录，其相对路径相对于 根目录 计算
				script.src = 'static/lib/h5player.min.js' //h5player.min.js 相对路径
				script.onload = () => {
					this.init()
				}
				document.head.appendChild(script)
			};
		},
		beforeDestroy() {
			this.stopPlay()
		},
		methods: {
			init() {
				//实例化
				this.player = new window.JSPlugin({
					szId: 'hk-video',
					szBasePath: 'static/lib', //以根目录为起点的路径，不是从此页面为起点的路径
					// iMaxSplit: this.maxSplit || 4,
					iCurrentSplit: 1,
					openDebug: true,
					oStyle: {
						borderSelect: '#FFCC00',
						background: '#4C4C4C'
					}
				})
				this.player.JS_SetWindowControlCallback({
					pluginErrorHandler: function(iWndIndex, iErrorCode, oError) {
						//插件错误回调
						// do you want...
						// 取流失败，流中断等错误都会触发该回调函数，请自行对照错误码表进行判断。
						// 业务上层可在此做一些个性化操作，如：个性化错误信息展示，重新取流等。
						console.log("插件错误回调   iWndIndex是" + iWndIndex + ",当前iErrorCode是" + iErrorCode);
						//0x12f910011:  流中断,重新取流，继续播放
						if ("0x12f910011" == iErrorCode) {
							console.log("流中断  尝试重新拉流");
							const gscs = {
								gscsId: _this.videoObjRender.gscsId,
								gscsLx: 1
							}
							getVedioList(gscs).then(response => {
								console.log("response vedioList length:" + response.data.vedioList
									.length);
								for (let i = 0; i < response.data.vedioList.length; i++) {
									//console.log(_this.playerIndexList[iWndIndex]);
									//console.log(response.data.vedioList[i].spId);
									if (_this.videoObjRender.spId == response.data.vedioList[i].spId) {
										console.log("重新请求到了视频流，栅格id为" + iWndIndex + "重新加载");
										let playURL = response.data.vedioList[i].vedioAddress;
										let mode = 1;
										_this.player.JS_Play(playURL, {
											playURL,
											mode
										}, iWndIndex);
										break;
									}
								}
							})
						}
						console.log("插件错误回调   iErrorCode" + iErrorCode);
						console.log("插件错误回调   oError" + oError);
					},
				})
			},
			//播放视频
			replay() {
				this.player.JS_Play(this.videoObjRender, {
					playURL: this.videoObjRender,
					mode: 1, //解码类型：0=普通模式; 1=高级模式 默认为0,h5高级模式才能播放
				}, 0).then(() => {
					// 加载监控视频结束后加载状态消失，给视图层传递过去‘acceptDataFromRenderjs’方法
					this.ownerVm.callMethod('acceptDataFromRenderjs', {
						loading: false
					})
				})
			},
			//关闭所有视频
			stopPlay() {
				this.player.JS_StopRealPlayAll().then(
					() => {
						console.info('JS_StopRealPlayAll success');
					},
					(err) => {
						console.info('JS_StopRealPlayAll failed');
					}
				);
			},
			// 接受来自逻辑层的数据
			listChanged(newValue, oldValue, ownerVm, vm) {
				console.log(newValue,'newValue')
				if (newValue) { //newValue.vedioAddress判断逻辑层传过来的ws视频流是否存在
					this.videoObjRender = newValue
					this.replay()
					this.ownerVm = ownerVm
					// 实现视频监控加载状态  
					// 加载监控视频时开始显示加载状态，给逻辑层传递过去‘acceptDataFromRenderjs’方法
					ownerVm.callMethod('acceptDataFromRenderjs', {
						loading: true
					})
				}
			},
		},
	}
</script>

<style scoped>
	.player {
		/* border: 1px solid #000; */
	/* 	width: 100%;
		height: 100%; */
		width: 654rpx;
		height: 422rpx;
	}
</style>