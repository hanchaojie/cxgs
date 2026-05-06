<template>
	<!-- 糅合所有时间选择的组件 -->
	<view :class="['fly-date-time', `isRange-${isRange}`, `border-${border}`, `disabled-date-${disabled}`]"
		:style="`${selectorStyle}`">
		<template v-if="!isRange">
			<text class="txt" :class="{ 'placeholder-style': !value2 }" @tap="handleChangeDate(null)"
				:style="`text-align:${align}`">{{ value2 ? `${value2}${getWeek(value2)}` :(disabled ? '' : placeholder) }}</text>
			<view class="right-control">
				<image src="./arrows.png" class="fly-direction-arrows"
					:class="{ 'rotate-up': isPickerOpen }" v-if="showArrows" />
				<icon type="clear" :size="18" color="#c5c5c5" @tap.stop="handleClear" v-if="clearable && value2"
					class="fly-clear-icon" />
			</view>
		</template>
		<template v-else>
			<text class="start" :class="{ 'placeholder-style': !value2[0] }" @tap="handleChangeDate('start')">{{
				value2[0] || (disabled ? '' : `开始${getPlaceholderText()}`) }}</text>
			<text class="range-separator" v-if="!disabled || value2.length">{{ rangeSeparator }}</text>
			<text class="end" :class="{ 'placeholder-style': !value2[1] }" @tap="handleChangeDate('end')">{{
				value2[1] || (disabled ? '' : `结束${getPlaceholderText()}`) }}</text>
			<view class="right-control">
				<image src="./arrows.png" class="fly-direction-arrows"
					:class="{ 'rotate-up': isPickerOpen }" v-if="showArrows" />
				<icon type="clear" :size="18" color="#c5c5c5" @tap="handleClear" v-if="clearable && value2.length"
					class="fly-clear-icon" />
			</view>
		</template>

		<view v-if="isPickerOpen" class="date-dialog-container">
			<view class="fly-mask"></view>
			<time-change :showAnimation="showAnimation" :format="format" :start="start" :end="end" :dateType="dateType"
				:values="isRange ? (dateType === 'start' ? value2[0] || null : value2[1] || null) : value2"
				@cancel="onCancel" @change="onChange"></time-change>
		</view>
	</view>
</template>

<script>
	import timeChange from "./child/timeChange"
	export default {
		name: 'flyDateTime',
		components: {
			timeChange
		},
		props: {
			placeholder: {
				type: String,
				default: '请选择'
			},
			format: {
				type: String,
				default: 'yyyy-MM-dd'
			}, //yyyy、yyyy-MM、yyyy-MM-dd、HH:mm:ss、HH:mm、HH、yyyy-MM-dd HH:mm:ss、yyyy-MM-dd HH:mm、yyyy-MM-dd HH
			isRange: {
				type: Boolean,
				default: false
			}, //是否是范围选择
			disabled: {
				type: Boolean,
				default: false
			},
			value: {
				type: [String, Array],
				default: null
			},
			border: {
				type: Boolean,
				default: false
			},
			clearable: {
				type: Boolean,
				default: false
			}, //清除按钮
			showArrows: {
				type: Boolean,
				default: true
			}, //右侧箭头
			rangeSeparator: {
				type: String,
				default: '~'
			}, //分开符
			selectorStyle: {
				type: String,
				default: ''
			}, //传入样式
			align: {
				type: String,
				default: 'left',
				validator: function(value) {
					return ['left', 'center', 'right'].indexOf(value) !== -1
				}
			}, //对齐方式，left、center、right,范围选择下无效
			start: {
				type: String,
				default: '2025-08-26'
			}, //开始时间
			end: {
				type: String,
				default: '2025-09-02'
			}, //结束时间
		},
		data() {
			return {
				innerValue: null,
				isPickerOpen: false, // 添加状态标记是否打开选择器
				showAnimation: false,

				dateType: null,
			}
		},
		created() {
			// 初始化时校验value格式
			this.validateValue();
		},
		watch: {
			value: {
				handler() {
					this.validateValue();
				},
				immediate: true
			},
		},
		computed: {
			value2: {
				get() {
					return this.innerValue
				},
				set(val) {
					this.innerValue = val;
					if(this.isRange){
						if(this.innerValue.length===2 || this.innerValue.length===0)this.$emit('input', val)
					}else{
						this.$emit('input', val)
					}
				}
			},
		},
		methods: {
			getWeek(dateString) {
				if(this.format !== "yyyy-MM-dd") return "";
				var dateArray = dateString.split("-");
				let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
				return " 周" + "日一二三四五六".charAt(date.getDay());
			},
			// 获取占位符文本
			getPlaceholderText() {
				if (this.format === 'yyyy') {
					return '年份';
				} else if (this.format === 'yyyy-MM') {
					return '月份';
				} else if (this.format.includes('HH') && !this.format.includes('yyyy')) {
					return '时间';
				} else {
					return '日期';
				}
			},

			// 校验value格式是否与format匹配
			validateValue() {
				if (this.isRange) {
					// 处理范围类型
					if (!Array.isArray(this.value)) {
						this.innerValue = [];
						return;
					}

					const validatedArray = [];
					for (let i = 0; i < this.value.length; i++) {
						if (this.value[i] && this.isFormatValid(this.value[i])) {
							validatedArray.push(this.value[i]);
						} else {
							validatedArray.push(null);
						}
					}
					this.innerValue = validatedArray;
				} else {
					// 处理单个值
					if (this.value && this.isFormatValid(this.value)) {
						this.innerValue = this.value;
					} else {
						this.innerValue = null;
					}
				}
			},

			// 判断值是否符合格式要求
			isFormatValid(val) {
				if (!val) return false;

				// 定义格式正则表达式映射
				const formatRegexMap = {
					'yyyy': /^\d{4}$/,
					'yyyy-MM': /^\d{4}-\d{2}$/,
					'yyyy-MM-dd': /^\d{4}-\d{2}-\d{2}$/,
					'HH:mm:ss': /^\d{2}:\d{2}:\d{2}$/,
					'HH:mm': /^\d{2}:\d{2}$/,
					'HH': /^\d{2}$/,
					'yyyy-MM-dd HH:mm:ss': /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
					'yyyy-MM-dd HH:mm': /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
					'yyyy-MM-dd HH': /^\d{4}-\d{2}-\d{2} \d{2}$/
				};

				// 根据类型选择对应的格式
				let formatToCheck = this.format;

				// 检查格式是否有对应的正则表达式
				if (formatRegexMap[formatToCheck]) {
					return formatRegexMap[formatToCheck].test(val);
				}

				// 如果没有匹配到任何格式，返回false
				return false;
			},

			handleClear() {
				this.value2 = this.isRange ? [] : null
				this.$emit("change", this.value2);
			},
			handleChangeDate(type) {
				const that = this
				if (that.disabled) return

				that.dateType = type === 'end' && !that.value2.length ? 'start' : type
				// 设置箭头旋转状态为true
				that.isPickerOpen = true;
				setTimeout(() => {
					that.showAnimation = true;
				}, 20);

			},
			onCancel() {
				this.$emit("cancel");
				// 重置箭头旋转状态
				this.showAnimation = false;
				setTimeout(() => {
					this.isPickerOpen = false;
				}, 300);
			},
			onChange(val) {
				let value2 = JSON.parse(JSON.stringify(this.value2))
				if (this.isRange) {
					if (this.dateType === 'start') {
						value2.splice(0, 1, val)
					} else {
						value2.splice(1, 1, val)
					}

					if (value2[0] && value2[1]) {
						// 判断开始时间是否大于结束时间
						if (new Date(value2[0].replace(/-/g, '/')).getTime() > new Date(value2[1].replace(/-/g, '/')).getTime()) {
							value2 = value2.reverse();
						}
					}
					this.value2 = value2
					if(this.value2.length===2)this.$emit("change", this.value2);
				} else {
					this.value2 = val
					this.$emit("change", this.value2);
				}
				// 重置箭头旋转状态
				this.showAnimation = false;
				setTimeout(() => {
					this.isPickerOpen = false;
					if (this.value2.length === 1) {
						this.handleChangeDate('end')
					}
				}, 300);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fly-date-time {
		// width: 100%;
		// height: 72rpx;
		// line-height: 72rpx;
		position: relative;
		display: flex;
		align-items: center;
		// flex: 1;

		.txt {
			flex: 1;
			white-space: nowrap;
		}

		.placeholder-style {
			color: #999999;
		}

		.fly-clear-icon {
			// position: absolute;
			// right: 10px;
			// top: 50%;
			// transform: translateY(-50%);
			margin-left: 10px;
		}

		.fly-direction-arrows {
			width: 32rpx;
			height: 32rpx;
			transition: transform 0.3s ease;
			margin-left: 5px;
		}

		.right-control {
			display: flex;
			align-items: center;
			// position: absolute;
			// right: 10px;
			// top: 50%;
			// transform: translateY(-50%);
		}

		/* 添加箭头向上旋转的样式 */
		.rotate-up {
			transform: rotate(-180deg);
		}

	}

	.isRange-true {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.start,
		.end {
			flex: 1;
			text-align: center;
			white-space: nowrap;
		}

		.range-separator {
			padding: 3px;
		}
	}

	.border-true {
		padding: 0px 10px;
		border: 1px solid #c8c7cc;
		border-radius: 3px;
	}

	.disabled-date-true {
		padding: 0;
		justify-content: normal;

		.start,
		.end {
			flex: none;
		}
	}

	// 弹窗
	.date-dialog-container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		z-index: 999;

		.fly-mask {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			background-color: rgba(0, 0, 0, 0.5);
		}

		.content-container {
			position: absolute;
			bottom: -50%;
			/* 初始位置在屏幕外 */
			left: 0;
			right: 0;
			z-index: 99;
			transition: 2s;
			padding: 10px;
			background-color: #fff;
			height: 50%;
			transition: all 0.3s ease;

			/* 添加过渡效果 */
			&.slide-up {
				bottom: 0;
				/* 动画结束位置 */
			}
		}
	}
</style>