<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uni_modules/uview-ui/theme.scss";
	@import "uni_modules/uview-ui/index.scss";
	@import '@/static/js/leaflet.css';
	@import "@/static/iconfont.css";
	.uni-tabbar__label{
		font-size: 16px !important;
	}

</style>