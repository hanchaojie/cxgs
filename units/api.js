let ajaxUrl = '';
if (process.env.NODE_ENV === 'development') {
	console.log('开发环境')
	ajaxUrl = 'http://jycxgs.cloud.zjdsxx.com:60061/prod-api'
	// ajaxUrl = 'http://192.168.88.240:60061/prod-api'
	// ajaxUrl = 'http://112.124.28.116:7700'

} else {
	console.log('生产环境')
	// ajaxUrl = `${window.location.protocol}//${window.location.host}`;
	ajaxUrl = 'http://jycxgs.cloud.zjdsxx.com:60061/prod-api'
	// ajaxUrl = 'http://112.124.28.116:7700'
}
// 接口地址
export const BaseUrl = ajaxUrl
//封装get
export function getAPi(url, parms, loading) {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		var windowUrl = window.location.href;
		// #endif
		if (loading) {
			uni.showLoading({
				title: "",
				mask: true,
			});
		}

		uni.request({
			// url: Aurl + url + parms, //打包
			// url: url + parms,
			url: parms ? BaseUrl + url + parms : BaseUrl + url,
			method: "GET",
			header: {
				Authorization: uni.getStorageSync('Authorization')
				// sk: 'e01f5dd8fe2248e3b6b5166e5c2e5485'
				// Authorization: uni.getStorageSync('Authorization') ? uni.getStorageSync('Authorization') : ""
			},
			success: (res) => {
				console.log(res)
				if (loading) {
					uni.hideLoading();
				}
				if (res.data.code == 401) {

					var jump = uni.getStorageSync('jump') //以下解决多次跳转登录页的重点
					if (!jump) {
						//以下做token失效的操作
						setTimeout(() => {
							uni.showToast({
								title: '身份过期,重新登录',
								duration: 2000,
								icon: 'none'
							});
							uni.navigateTo({
								url: '/pages/index/login'
							});
						}, 100)
						uni.setStorageSync('jump', true)
					}

				} else if (res.data.code !== 200) {
					console.log('服务器繁忙')
					uni.showToast({
						title: "服务器繁忙,请稍后...",
						icon: "none",
						duration: 3000,
					});
				}

				resolve(res);
			},
			fail: (res) => {
				if (loading) {
					uni.hideLoading();
				}
				console.log(res, '服务器繁忙,请稍后', parms ? BaseUrl + url + parms : BaseUrl + url)
				uni.showToast({
					title: "服务器繁忙,请稍后...",
					icon: "none",
					duration: 3000,
				});
				// uni.navigateTo({
				// 	url: '/pages/index/login'
				// });
				reject(res);
			},
			complete: (res) => {},
		});
	});
}

//封装get
export function elsegetAPi(url, parms) {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		var windowUrl = window.location.href;
		// #endif


		uni.request({
			// url: Aurl + url + parms, //打包
			// url: url + parms,
			url: parms ? BaseUrl + url + parms : BaseUrl + url,
			method: "GET",
			header: {
				Authorization: uni.getStorageSync('Authorization')
				// sk: 'e01f5dd8fe2248e3b6b5166e5c2e5485'
				// Authorization: uni.getStorageSync('Authorization') ? uni.getStorageSync('Authorization') : ""
			},
			success: (res) => {
				// console.log(res)
				// uni.hideLoading();
				if (res.statusCode !== 200) {
					console.log(res)
					console.log(BaseUrl + url)
					var jump = uni.getStorageSync('jump') //以下解决多次跳转登录页的重点
					if (!jump) {
						//以下做token失效的操作
						setTimeout(() => {
							uni.showToast({
								title: '身份过期,重新登录',
								duration: 2000,
								icon: 'none'
							});

							uni.navigateTo({
								url: '/pages/index/login'
							});
						}, 100)
						uni.setStorageSync('jump', 'true')
					}





				} else {

				}
				resolve(res);
			},
			fail: (res) => {
				console.log(res)
				// uni.hideLoading();
				// uni.showToast({
				//     title: "服务器错误,请稍后...",
				//     icon: "none",
				//     duration: 3000,
				// });
				uni.navigateTo({
					url: '/pages/index/login'
				});
				reject(res);
			},
			complete: (res) => {
				// console.log(JSON.stringify(res))
			},
		});
	});
}
//封装get版本put
export function getPutAPi(url, parms, loading) {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		var windowUrl = window.location.href;
		// #endif
		if (loading) {
			uni.showLoading({
				title: "",
				mask: true,
			});
		}

		uni.request({
			// url: Aurl + url + parms, //打包
			// url: url + parms,
			url: parms ? BaseUrl + url + parms : BaseUrl + url,
			method: "PUT",
			header: {
				Authorization: uni.getStorageSync('Authorization')
				// sk: 'e01f5dd8fe2248e3b6b5166e5c2e5485'
				// Authorization: uni.getStorageSync('Authorization') ? uni.getStorageSync('Authorization') : ""
			},
			success: (res) => {
				console.log(res)
				if (loading) {
					uni.hideLoading();
				}
				if (res.data.code == 401) {
					var jump = uni.getStorageSync('jump') //以下解决多次跳转登录页的重点
					if (!jump) {
						//以下做token失效的操作
						setTimeout(() => {
							uni.showToast({
								title: '身份过期,重新登录',
								duration: 2000,
								icon: 'none'
							});
							uni.navigateTo({
								url: '/pages/index/login'
							});
						}, 100)
						uni.setStorageSync('jump', true)
					}

				} else if (res.data.code !== 200) {
					console.log('服务器繁忙')
					uni.showToast({
						title: "服务器繁忙,请稍后...",
						icon: "none",
						duration: 3000,
					});
				}

				resolve(res);
			},
			fail: (res) => {
				if (loading) {
					uni.hideLoading();
				}
				console.log(res, '服务器繁忙,请稍后', parms ? BaseUrl + url + parms : BaseUrl + url)
				uni.showToast({
					title: "服务器繁忙,请稍后...",
					icon: "none",
					duration: 3000,
				});
				// uni.navigateTo({
				// 	url: '/pages/index/login'
				// });
				reject(res);
			},
			complete: (res) => {},
		});
	});
}

// 封装PUT
export function putApi(url, parms) {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		var windowUrl = window.location.href;
		// #endif
		uni.showLoading({
			title: "",
			mask: true,
		});

		uni.request({
			// url: Aurl + url, //打包
			// url: url,
			url: BaseUrl + url,
			method: "PUT",
			data: parms,
			// data: {
			// 	sessionId: uni.getStorageSync('sessionId'),
			// 	parms,
			// },
			header: {
				// Authorization: uni.getStorageSync('token')
				Authorization: uni.getStorageSync('Authorization')
				// sk: 'e01f5dd8fe2248e3b6b5166e5c2e5485'
				// Authorization: uni.getStorageSync('Authorization') ? uni.getStorageSync('Authorization') : ""
			},
			success: (res) => {
				uni.hideLoading();
				if (res.data.code == 401) {
					var jump = uni.getStorageSync('jump') //以下解决多次跳转登录页的重点
					if (!jump) {
						//以下做token失效的操作
						setTimeout(() => {
							uni.showToast({
								title: '身份过期,重新登录',
								duration: 2000,
								icon: 'none'
							});
							uni.navigateTo({
								url: '/pages/index/login'
							});
						}, 100)
						uni.setStorageSync('jump', true)
					}

				} else if (res.data.code !== 200) {
					console.log('服务器繁忙,请稍后')
					uni.showToast({
						title: "服务器繁忙,请稍后...",
						icon: "none",
						duration: 3000,
					});
				}
				resolve(res);
			},
			fail: (res) => {
				uni.hideLoading();
				uni.showToast({
					title: "服务器繁忙,请稍后...",
					icon: "none",
					duration: 3000,
				});
				// uni.navigateTo({
				// 	url: '/pages/index/login'
				// });
				reject(res);
			},
			complete: (res) => {},
		});

	});
}
//登录封装post
export function dlpostAPi(url, parms) {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		var windowUrl = window.location.href;
		// #endif
		uni.showLoading({
			title: "",
			mask: true,
		});
		uni.request({
			// url: Aurl + url, //打包
			// url: url,
			url: BaseUrl + url,
			method: "POST",
			data: parms,

			header: {
				// Authorization: uni.getStorageSync('token')
				Authorization: uni.getStorageSync('Authorization')
				// sk: 'e01f5dd8fe2248e3b6b5166e5c2e5485'
				// Authorization: uni.getStorageSync('Authorization') ? uni.getStorageSync('Authorization') : ""
			},
			success: (res) => {
				uni.hideLoading();

				resolve(res);
			},
			fail: (res) => {
				uni.hideLoading();
				console.log('服务器繁忙,请稍后')
				uni.showToast({
					title: "服务器繁忙,请稍后...",
					icon: "none",
					duration: 3000,
				});
				// uni.navigateTo({
				// 	url: '/pages/index/login'
				// });
				reject(res);
			},
			complete: (res) => {},
		});
	});
}
//封装post
export function postAPi(url, parms) {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		var windowUrl = window.location.href;
		// #endif
		uni.showLoading({
			title: "",
			mask: true,
		});

		uni.request({
			// url: Aurl + url, //打包
			// url: url,
			url: BaseUrl + url,
			method: "POST",
			data: parms,
			// data: {
			// 	sessionId: uni.getStorageSync('sessionId'),
			// 	parms,
			// },
			header: {
				// Authorization: uni.getStorageSync('token')
				Authorization: uni.getStorageSync('Authorization')
				// sk: 'e01f5dd8fe2248e3b6b5166e5c2e5485'
				// Authorization: uni.getStorageSync('Authorization') ? uni.getStorageSync('Authorization') : ""
			},
			success: (res) => {
				uni.hideLoading();
				if (res.data.code == 401) {
					var jump = uni.getStorageSync('jump') //以下解决多次跳转登录页的重点
					if (!jump) {
						//以下做token失效的操作
						setTimeout(() => {
							uni.showToast({
								title: '身份过期,重新登录',
								duration: 2000,
								icon: 'none'
							});
							uni.navigateTo({
								url: '/pages/index/login'
							});
						}, 100)
						uni.setStorageSync('jump', true)
					}

				} else if (res.data.code !== 200) {
					console.log('服务器繁忙,请稍后')
					uni.showToast({
						title: "服务器繁忙,请稍后...",
						icon: "none",
						duration: 3000,
					});
				}
				resolve(res);
			},
			fail: (res) => {
				uni.hideLoading();
				uni.showToast({
					title: "服务器繁忙,请稍后...",
					icon: "none",
					duration: 3000,
				});
				// uni.navigateTo({
				// 	url: '/pages/index/login'
				// });
				reject(res);
			},
			complete: (res) => {},
		});

	});
}
//封装特殊post
export function elsepostAPi(url, parms) {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		var windowUrl = window.location.href;
		// #endif
		uni.showLoading({
			title: "",
			mask: true,
		});
		if (uni.getStorageSync('sessionId') == '') {
			uni.navigateTo({
				url: '/pages/index/login'
			})
		}
		uni.request({
			// url: Aurl + url, //打包
			// url: url,
			url: url,
			method: "POST",
			data: parms,
			// data: {
			// 	sessionId: uni.getStorageSync('sessionId'),
			// 	parms,
			// },
			header: {
				// Authorization: uni.getStorageSync('token')
				Authorization: uni.getStorageSync('sessionId')
				// sk: 'e01f5dd8fe2248e3b6b5166e5c2e5485'
				// Authorization: uni.getStorageSync('Authorization') ? uni.getStorageSync('Authorization') : ""
			},
			success: (res) => {
				uni.hideLoading();
				if (res.data.code == 401) {
					var jump = uni.getStorageSync('jump') //以下解决多次跳转登录页的重点
					if (!jump) {
						//以下做token失效的操作
						setTimeout(() => {
							uni.showToast({
								title: '身份过期,重新登录',
								duration: 2000,
								icon: 'none'
							});
							uni.navigateTo({
								url: '/pages/index/login'
							});
						}, 100)
						uni.setStorageSync('jump', true)
					}
				} else if (res.data.code == 200) {
					resolve(res);
				} else {
					uni.showToast({
						title: "服务器繁忙,请稍后...",
						icon: "none",
						duration: 3000,
					});

				}
			},
			fail: (res) => {
				uni.hideLoading();
				console.log('服务器繁忙,请稍后')
				uni.showToast({
					title: "服务器繁忙,请稍后...",
					icon: "none",
					duration: 2000,
				});
				// uni.navigateTo({
				// 	url: '/pages/index/login'
				// });
				reject(res);
			},
			complete: (res) => {},
		});

	});
}
//putApi


//封装直接获取图片的get 
export function imgGet(url, parms) {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		var windowUrl = window.location.href;
		// #endif
		uni.showLoading({
			title: "",
			mask: true,
		});
		if (uni.getStorageSync('sessionId') == '') {
			uni.navigateTo({
				url: '/pages/index/login'
			})
		}
		uni.getNetworkType({
			success: function(res) {
				if (res.networkType == 'none') {
					uni.hideLoading();
					uni.navigateTo({
						url: '/pages/index/nonetWork'
					});

				} else {
					uni.request({
						// url: Aurl + url, //打包
						// url: url,
						url: BaseUrl + url + parms,
						method: "GET",
						data: parms,
						responseType: "arraybuffer",
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							Authorization: uni.getStorageSync('sessionId'),
						},
						success: (res) => {
							uni.hideLoading();

							resolve(res);
						},
						fail: (res) => {
							uni.hideLoading();
							// uni.showToast({
							//     title: "服务器错误,请稍后...",
							//     icon: "none",
							//     duration: 3000,
							// });
							uni.navigateTo({
								url: '/pages/common/serviceException'
							});
							reject(res);
						},
						complete: (res) => {},
					});
				}
			}
		});

	});
}
// 封装deleteApi
export function deleteAPi(url, parms, loading) {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		var windowUrl = window.location.href;
		// #endif
		if (loading) {
			uni.showLoading({
				title: "",
				mask: true,
			});
		}

		uni.request({
			// url: Aurl + url + parms, //打包
			// url: url + parms,
			url: parms ? BaseUrl + url + parms : BaseUrl + url,
			method: "DELETE",
			header: {
				Authorization: uni.getStorageSync('Authorization')
				// sk: 'e01f5dd8fe2248e3b6b5166e5c2e5485'
				// Authorization: uni.getStorageSync('Authorization') ? uni.getStorageSync('Authorization') : ""
			},
			success: (res) => {
				console.log(res)
				if (loading) {
					uni.hideLoading();
				}
				if (res.data.code == 401) {
					var jump = uni.getStorageSync('jump') //以下解决多次跳转登录页的重点
					if (!jump) {
						//以下做token失效的操作
						setTimeout(() => {
							uni.showToast({
								title: '身份过期,重新登录',
								duration: 2000,
								icon: 'none'
							});
							uni.navigateTo({
								url: '/pages/index/login'
							});
						}, 100)
						uni.setStorageSync('jump', true)
					}

				} else if (res.data.code !== 200) {
					console.log('服务器繁忙')
					uni.showToast({
						title: "服务器繁忙,请稍后...",
						icon: "none",
						duration: 3000,
					});
				}

				resolve(res);
			},
			fail: (res) => {
				if (loading) {
					uni.hideLoading();
				}
				console.log(res, '服务器繁忙,请稍后', parms ? BaseUrl + url + parms : BaseUrl + url)
				uni.showToast({
					title: "服务器繁忙,请稍后...",
					icon: "none",
					duration: 3000,
				});
				// uni.navigateTo({
				// 	url: '/pages/index/login'
				// });
				reject(res);
			},
			complete: (res) => {},
		});
	});
}