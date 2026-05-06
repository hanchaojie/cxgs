<template>
	<view class="" style="position: relative;">
		<view class="content">
			<view class="topBack">
				<image src="/static/loginlogo.png" mode="" class="toplogo"></image>
				<view class="title">
					你好,欢迎登录
				</view>
				<view class="content">
					「缙云县域供水掌上管控平台」
				</view>
			</view>
		</view>
		<!-- 		<view class="loginBox">
			<view class="loginTitle">
				<view class="message">
					短信登录
				</view>
				<view class="passw">
					密码登录
				</view>
			</view>
		</view> -->
		<view class="userIpt">
			<input type="text" v-model="username" placeholder="输入账号" class="ipt" />
		</view>
		<view class="userIpt" style="margin-top: 64rpx;">
			<input :type="passType" v-model="password" class="ipt" placeholder="输入密码" />
			<image src="/static/noyey.png" v-if="passType =='password'" mode="" class="yey" @click="checkPass"></image>
			<image src="/static/yey.png" v-else mode="" class="yey" @click="checkPass"></image>
		</view>
	<!-- 	<view class="flexuserIpt">
			<view class="samlluserIpt">
				<input type="text" v-model="yzm" class="ipt" placeholder="验证码" />
			</view>
			<image @click="querygetcaptchaImage" :src="baseimg" v-if="baseimg" mode="" class="VerificationCode"></image>
		</view> -->
		<view class="DisF">
			<view class="">
				<u-checkbox-group v-model="ischeck">
					<!-- <u-checkbox shape="square" label="记住密码"></u-checkbox> -->
					<u-checkbox v-for="(item, index) in checkboxList1" :key="index" :label="item.name"
						:name="item.name">
					</u-checkbox>
				</u-checkbox-group>
			</view>
			<!-- 	<view class="forgotPassword">
				忘记密码?
			</view> -->
		</view>
		<view class="loginBtn" @click="loginBtn">
			登录
		</view>
	</view>
</template>

<script>
	import JSEncrypt from 'jsencrypt'
	import {
		getUserIp,
		login,
		getCaptchaImage,
		getInfo
	} from '../../units/request.js'
	export default {
		data() {
			return {
				loginType: 'sms', // 登录方式：sms（短信）/ password（密码）
				account: '', // 账号（手机号）
				password: '', // 密码
				passType: 'password',
				showPassword: false, // 密码是否显示
				ischeck: [],
				username: "",
				loginCode: '',
				uuid: "",
				baseimg: null,
				yzm: '',
				checkboxList1: [{
					name: '记住密码',
				}, ]
			}
		},
		onBackPress(e) {
		    return true
		},
		mounted() {
			// this.querygetcaptchaImage()
			const savedUsername = uni.getStorageSync('username');
			const savedPassword = uni.getStorageSync('password');
			if (uni.getStorageSync('checked')) {
				console.log(uni.getStorageSync('checked'))
				this.username = savedUsername;
				this.password = savedPassword;
				this.ischeck = ['记住密码'];
			} else {
				this.username = null;
				this.password = null;
				this.ischeck = [];
			}
		},
		methods: {
			checkPass() {
				if (this.passType == 'password') {
					this.passType = 'txt'
				} else {
					this.passType = 'password'
				}
			},
			querygetcaptchaImage() {
				getCaptchaImage().then(res => {
					console.log(res)
					this.baseimg = `data:image/jpeg;base64,${res.data.data.img}`
					this.loginCode = res.data.data.uuid
				})
			},
			gotoMap() {
				uni.navigateTo({
					url: '/pages/map/map',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			loginBtn() {




				if (this.ischeck[0] == '记住密码') {
					uni.setStorageSync('username', this.username);
					uni.setStorageSync('password', this.password);
					uni.setStorageSync('checked', true);

					// uni.clearStorageSync();

					getUserIp().then(ip => {
						let that = this
						let encryptor = new JSEncrypt() // 创建加密对象实例
						encryptor.setPublicKey(
							'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOXetnO57UuT/qZSzWMoBZEukCaD+InJhduDpmI1kvp3A9sfFqysdpURm2m00sZ2mWFJ2qBLb1ToTQoaJT5BP6qqrpqgaB//1s9wKiczUvgxCnQvY2ylEw/rilZFGYVUfP6G4xoc9Kt94/01C+Qmsfx7g+Xk68IiShwucNAFmaWwIDAQAB'
						) //设置公钥
						let timer = new Date().getTime()
						let ipp = ip.data.data
						console.log(encryptor.encrypt(encodeURIComponent(that.username + ":-:" + that.password +
							":-:" + timer + ":-:" + ipp)))
						console.log(that.yzm)
						const datas = {
							// code: that.yzm ? btoa(encodeURIComponent(that.yzm)) : null,
							code:null,
							dsAuth: encryptor.encrypt(encodeURIComponent(that.username + ":-:" + that
								.password + ":-:" + timer + ":-:" + ipp)),
							// code: btoa(encodeURIComponent(code)),
							uuid: that.loginCode ? btoa(encodeURIComponent(that.loginCode)) : null
						}
						// console.log(datas)

						login(datas).then(res => {
							console.log(res, '帐号登录返回')
							if (res.data.code == 200) {
								uni.setStorageSync('Authorization', `Bearer ${res.data.data.token}`);
								uni.setStorageSync('Token', `${res.data.data.token}`);
								uni.setStorageSync('jump', false);
								getInfo().then(r => {
									console.log(r)
									uni.setStorageSync('getInfo', r.data.data)
								})
								uni.switchTab({
									url: '/pages/index/index'
								});
							} else {
								uni.$u.toast(res.data.msg);
								that.querygetcaptchaImage()
							}
						})
					})
				} else {
					uni.clearStorageSync();
					uni.setStorageSync('checked', false);
					getUserIp().then(ip => {
						let that = this
						let encryptor = new JSEncrypt() // 创建加密对象实例
						encryptor.setPublicKey(
							'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOXetnO57UuT/qZSzWMoBZEukCaD+InJhduDpmI1kvp3A9sfFqysdpURm2m00sZ2mWFJ2qBLb1ToTQoaJT5BP6qqrpqgaB//1s9wKiczUvgxCnQvY2ylEw/rilZFGYVUfP6G4xoc9Kt94/01C+Qmsfx7g+Xk68IiShwucNAFmaWwIDAQAB'
						) //设置公钥
						let timer = new Date().getTime()
						let ipp = ip.data.data
						console.log(encryptor.encrypt(encodeURIComponent(that.username + ":-:" + that.password +
							":-:" + timer + ":-:" + ipp)))
						const datas = {
							// code: that.yzm ? btoa(encodeURIComponent(that.yzm)) : null,
							code:null,
							dsAuth: encryptor.encrypt(encodeURIComponent(that.username + ":-:" + that
								.password + ":-:" + timer + ":-:" + ipp)),
							// code: btoa(encodeURIComponent(code)),
							uuid: that.loginCode ? btoa(encodeURIComponent(that.loginCode)) : null
						}
						login(datas).then(res => {
							console.log(res)
							if (res.data.code == 200) {
								uni.setStorageSync('Authorization', `Bearer ${res.data.data.token}`);
								uni.setStorageSync('Token', `${res.data.data.token}`);
								uni.setStorageSync('jump', false);
								getInfo().then(r => {
									console.log(r)
									uni.setStorageSync('getInfo', r.data.data)
								})
								uni.switchTab({
									url: '/pages/index/index'
								});
							} else {
								uni.$u.toast(res.data.msg);
								that.querygetcaptchaImage()
							}
						})
					})
				}




				// uni.switchTab({
				// 	url: '/pages/index/index',
				// 	success: res => {},
				// 	fail: () => {},
				// 	complete: () => {}
				// });
			},
			
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>
<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.topBack {
			width: 100%;
			height: 574rpx;
			background-image: url('/static/loginback.png');
			background-size: 100%;
			position: relative;

			.title {
				font-family: 'Microsoft YaHei';
				color: rgba(51, 51, 51, 1);
				font-size: 40rpx;
				font-weight: 600;
				line-height: 24px;
				letter-spacing: 0px;
				text-align: left;
				position: absolute;
				left: 46rpx;
				bottom: 138rpx;
				/* 倾斜10度 */
			}

			.toplogo {
				width: 148rpx;
				height: 140rpx;
				position: absolute;
				top: 162rpx;
				left: 60rpx;
			}

			.content {
				color: rgba(51, 51, 51, 1);
				font-family: "Microsoft YaHei";
				font-size: 32rpx;
				transform: skewX(-10deg);
				line-height: 48rpx;
				position: absolute;
				font-weight: 700;
				left: 30rpx;
				bottom: 56rpx;
			}

		}
	}

	.userIpt {
		width: 614rpx;
		height: 92rpx;
		border-radius: 94rpx;
		margin-left: 68rpx;
		margin-top: 0rpx;
		background: rgba(248, 248, 248, 1);
		display: flex;
		align-items: center;
		justify-content: space-between;

		.ipt {
			padding-left: 40rpx;
		}

		.yey {
			width: 44rpx;
			height: 44rpx;
			margin-right: 30rpx;
		}
	}

	.flexuserIpt {
		display: flex;
		align-items: center;
		margin-left: 68rpx;
		margin-top: 64rpx;

		.samlluserIpt {
			width: 414rpx;
			height: 92rpx;
			border-radius: 94rpx;
			background: rgba(248, 248, 248, 1);
			display: flex;
			align-items: center;

			.ipt {
				padding-left: 40rpx;
			}

		}

		.VerificationCode {
			height: 92rpx;
			width: 160rpx;
			margin-left: 28rpx;
		}

	}

	.DisF {
		margin-top: 46rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 68rpx 0 94rpx;
		font-size: 24rpx;
		font-family: "Microsoft YaHei";

		.forgotPassword {
			color: rgba(102, 102, 102, 1);
			font-family: "Microsoft YaHei";
			font-size: 24rpx;
		}
	}

	.loginBtn {
		width: 630rpx;
		height: 92rpx;
		border-radius: 94rpx;
		background: linear-gradient(90.00deg, rgba(77.5625, 151.1156463623047, 255, 1), rgba(3, 102, 241, 1) 100%);
		color: #fff;
		text-align: center;
		line-height: 92rpx;
		margin-left: 68rpx;
		margin-top: 64rpx;
	}
</style>