<template>
	<view id='map' :checkList="checkList" :change:checkList="leaflet.ChangefocusData">
	</view>
</template>
<script>
	export default {
		props: {
			checkList: Array,
			location: Object,
			pic: Object,
			isflag: Boolean,
			focusData: Object,
			location: Object,
		},
		methods: {
			changeView(options) {
				console.log(options)
				this.$emit('changeView', options)
			},

			updateTime(e) {
				console.log(e)
				this.$emit('stopTrue', e)
			}
		}
	}
</script>
<script module="leaflet" lang="renderjs">
	import L from 'static/js/leaflet.js';
	import 'static/js/leaflet.canvas-markers.js';
	let aimg = null
	let lastimg = null




	export default {
		data() {
			return {
				map: null,
				marker: {},
				markers: [],
				center: null,
				check: null

			}


		},
		mounted() {
			this.initMap()
		},
		methods: {
			// 地图初始化
			initMap() {
				this.map = L.map('map', {
					// crs: L.CRS.EPSG3857,	
					center: [28.73897, 120.07389],
					zoom: 10,
					minZoom: 3,
					maxZoom: 18,
					dragging: true,
					attributionControl: false,
					zoomControl: false,
					imageU: [],
					markerone: null
				});

				L.tileLayer(
					'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=7767f305a4f79220b4f973a3db0de9d2', {
						zoomControl: true
					}).addTo(this.map);
				L.tileLayer(
					'http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=7767f305a4f79220b4f973a3db0de9d2', {
						zoomControl: true
					}).addTo(this.map);
				// L.geoJSON(ges).addTo(this.map);
				// var latlngs2 = [
				//      [34.04, -118.2,2],
				//      [32.08, -110.5,2]
				// ];
				// var latlngs1 =

				// 	this.check.map(e => {
				// 		return [e.lttd, e.lgtd]
				// 	});
				// console.log(latlngs1)
				// L.polyline(latlngs1, {color: 'red'}).addTo(this.map);
				// this.mapEvent()
			},
			mapEvent() {
				this.map.on('zoomend', (a, b) => {
					let view = this.getBounds()
					// 主动传递 等价于 $emit
					UniViewJSBridge.publishHandler('onWxsInvokeCallMethod', {
						cid: this._$id,
						method: 'changeView', // 父组件方法
						args: view // 给方法传输的数据
					})
				})
				this.map.on('moveend', (a, b) => {
					let view = this.getBounds()
					// 主动传递 等价于 $emit
					UniViewJSBridge.publishHandler('onWxsInvokeCallMethod', {
						cid: this._$id,
						method: 'changeView', // 父组件方法
						args: view // 给方法传输的数据
					})
				})
			},
			//可视范围 获取
			getBounds() {
				//左下
				let west = this.map.getBounds().getSouthWest()
				var leftdown = [west.lat, west.lng];
				//左上
				let northWest = this.map.getBounds().getNorthWest()
				var leftup = [northWest.lat, northWest.lng];

				//右上
				let orthEast = this.map.getBounds().getNorthEast()
				var rightup = [orthEast.lat, orthEast.lng];
				//右下
				let southEast = this.map.getBounds().getSouthEast()
				var rightdown = [southEast.lat, southEast.lng];
				return {
					leftup,
					leftdown,
					rightup,
					rightdown
				}
			},
			center(point) {
				// 添加中心点，并且移动到地图至中心点
				if (!point || !point.latitude || !point.longitude) return
				if (!this.marker.center) {
					let m = L.marker([point.latitude, point.longitude], {
						icon: L.divIcon({
							className: 'div-icon'
						})
					}).addTo(this.map)
					this.marker.center = m
				} else {
					this.marker.center.setLatLng([point.latitude, point.longitude])
				}
				this.map.panTo({
					lng: point.longitude,
					lat: point.latitude
				});
			},
			getlocation(e) {
				console.log(e, 'eeeeeeee')
				this.map.setView([e[0].lttd, e[0].lgtd], 16)
				var myIcon = L.icon({
					iconUrl: 'static/unmatterImg.png',
					iconSize: [18, 25],
					text: e.layerName,
					textFont: '14px bold', //设置字体大小和样式
					textFillStyle: '#FFFFFF'
					// iconAnchor: [22, 94],
					// popupAnchor: [-3, -76],
					// shadowUrl: "my-icon-shadow.png",
					// // shadowSize: [68, 95],
					// shadowAnchor: [22, 94]
				});
				const markerone = L.marker([e.latitude, e.longitude], {
					icon: myIcon
				}).addTo(this.map);
				this.markers.push(markerone);
			},
			resetIsflag(e) {
				console.log(e)
				this.clearAllMarkers()
				// this.initMap()
				this.map.setView([28.659640, 120.130860], 10)
			},
			ChangefocusData(points) {

				const filteredData = points.filter(item => {
					// 筛选出 lttd 和 lgtd 都不为 null 的数据
					return item.lttd !== null && item.lgtd !== null;
				});
				if (filteredData.length) {
					let Subtraction = points[0].lttd - 0.003
					this.map.setView([Subtraction, points[0].lgtd], 15)
				} else {

				}
				// this.center = [e[0].lttd, e[0].lgtd]
				// this.check = e
				points.map(e => {

					if (e.status) {
						if (e.matterId) {
							var myIcon = L.icon({
								iconUrl: 'static/martterImg.png',
								iconSize: [18, 18],
								text: e.projectName,
								textFont: '14px bold', //设置字体大小和样式
								textFillStyle: '#FFFFFF'
								// iconAnchor: [22, 94],
								// popupAnchor: [-3, -76],
								// shadowUrl: "my-icon-shadow.png",
								// // shadowSize: [68, 95],
								// shadowAnchor: [22, 94]
							});
							this.markerone = L.marker([e.lttd, e.lgtd], {
								icon: myIcon,
								// title: e.layerName
							}).addTo(this.map);
							this.markerone.bindTooltip(e.partName, {
								direction: "bottom",
								permanent: true,
								offset: [0, 10],
								opacity: 0.8,
								className: 'toolclick',
							});
							this.markers.push(this.markerone);
						} else {
							var myIcon = L.icon({
								iconUrl: 'static/unmatterImg.png',
								iconSize: [18, 18],
								text: e.projectName,
								textFont: '14px bold', //设置字体大小和样式
								textFillStyle: '#FFFFFF'
								// iconAnchor: [22, 94],
								// popupAnchor: [-3, -76],
								// shadowUrl: "my-icon-shadow.png",
								// // shadowSize: [68, 95],
								// shadowAnchor: [22, 94]
							});
							this.markerone = L.marker([e.lttd, e.lgtd], {
								icon: myIcon,
								// title: e.layerName
							}).addTo(this.map);
							this.markerone.bindTooltip(e.partName, {
								direction: "bottom",
								permanent: true,
								offset: [0, 10],
								opacity: 0.8,
								className: 'toolclick',
							});
							this.markers.push(this.markerone);
						}

					} else {
						var myIcon = L.icon({
							iconUrl: 'static/garyMatter.png',
							iconSize: [18, 18],
							text: e.projectName,
							textFont: '14px bold', //设置字体大小和样式
							textFillStyle: '#FFFFFF'
							// iconAnchor: [22, 94],
							// popupAnchor: [-3, -76],
							// shadowUrl: "my-icon-shadow.png",
							// // shadowSize: [68, 95],
							// shadowAnchor: [22, 94]
						});
						this.markerone = L.marker([e.lttd, e.lgtd], {
							icon: myIcon,
							// title: e.layerName
						}).addTo(this.map);
						this.markerone.bindTooltip(e.partName, {
							direction: "bottom",
							permanent: true,
							offset: [0, 10],
							opacity: 0.8,
							className: 'toolclick',
						});
						this.markers.push(this.markerone);
					}



				})
				// 获取到数据,进行处理,可以是添加标记,也可以是其他处理

				// this.clearAllMarkers()

			},
			addMarker(points) {
				this.clearAllMarkers()
				console.log(this.map, 'points')
				points.map(e => {
					e.data.rows.map(item => {
						if (item.layerName == '城市水厂') {
							console.log(item, '城市水厂')
							var myIcon = L.icon({
								iconUrl: 'static/cityWater.png',
								iconSize: [18, 18],
								text: item.layerName,
								textFont: '14px bold', //设置字体大小和样式
								textFillStyle: '#FFFFFF'
								// iconAnchor: [22, 94],
								// popupAnchor: [-3, -76],
								// shadowUrl: "my-icon-shadow.png",
								// // shadowSize: [68, 95],
								// shadowAnchor: [22, 94]
							});
							const markerone = L.marker([item.latitude, item.longitude], {
								icon: myIcon,
								// title: e.layerName
							}).addTo(this.map);
							this.markers.push(markerone);
						}
						if (item.layerName == '乡镇水厂') {
							console.log(item, '乡镇水厂')
							var myIcon = L.icon({
								iconUrl: 'static/townWater.png',
								iconSize: [18, 18],
								text: item.layerName,
								textFont: '14px bold', //设置字体大小和样式
								textFillStyle: '#FFFFFF'
								// iconAnchor: [22, 94],
								// popupAnchor: [-3, -76],
								// shadowUrl: "my-icon-shadow.png",
								// // shadowSize: [68, 95],
								// shadowAnchor: [22, 94]
							});
							const markertwo = L.marker([item.latitude, item.longitude], {
								icon: myIcon,
								// title: e.layerName
							}).addTo(this.map);
							this.markers.push(markertwo);

						}
						if (item.layerName == '联村供水站') {
							console.log(item, '联村供水站')
							var myIcon = L.icon({
								iconUrl: 'static/lianWater.png',
								iconSize: [18, 18],
								text: item.layerName,
								textFont: '14px bold', //设置字体大小和样式
								textFillStyle: '#FFFFFF'
								// iconAnchor: [22, 94],
								// popupAnchor: [-3, -76],
								// shadowUrl: "my-icon-shadow.png",
								// // shadowSize: [68, 95],
								// shadowAnchor: [22, 94]
							});
							const markerthree = L.marker([item.latitude, item.longitude], {
								icon: myIcon,
								// title: e.layerName
							}).addTo(this.map);
							this.markers.push(markerthree);
						}
						if (item.layerName == '单村供水站') {
							if (item.latitude == null || item.longitude == null) {
								return
							}
							console.log(item, '单村供水站')
							var myIcon = L.icon({
								iconUrl: 'static/danWater.png',
								iconSize: [18, 18],
								text: item.layerName,
								textFont: '14px bold', //设置字体大小和样式
								textFillStyle: '#FFFFFF'
								// iconAnchor: [22, 94],
								// popupAnchor: [-3, -76],
								// shadowUrl: "my-icon-shadow.png",
								// // shadowSize: [68, 95],
								// shadowAnchor: [22, 94]
							});
							const markerfour = L.marker([item.latitude, item.longitude], {
								icon: myIcon,
								// title: e.layerName
							}).addTo(this.map);
							this.markers.push(markerfour);
						}



					})

				})
				// 获取到数据,进行处理,可以是添加标记,也可以是其他处理
			},
			// 清除所有标记
			clearAllMarkers() {
				// 遍历所有标记并移除
				this.markers.forEach(marker => {
					this.map.removeLayer(marker);
				});
				// 清空标记数组
				this.markers = [];
			}

		}
	}
</script>

<style lang="scss" scoped>
	#map {
		width: 100%;
		height: 100%;
		// height: 1000rpx;
		// height: auto;
		// width: auto;
		top: 0;
		bottom: 0;
		position: absolute;
	}
</style>