<template>
	<view class="content-container" :class="{ 'slide-up': showAnimation }">
		<!-- 		<view class="header-operate-btn">
			<text class="cancel" @tap="handleClose">取消</text>
			<text class="date-type" v-if="dateType">{{dateType==='start'? '开始时间' : '结束时间'}}</text>
			<text class="confirm" @tap="handleSubmit">确定</text>
		</view> -->

		<!-- 统一的日期时间选择器 -->
		<picker-view :value="defaultIndex" :indicator-style="indicatorStyle" @change="bindChange"
			class="picker-container">
			<!-- 年份列 -->
			<picker-view-column v-if="showYear" style="flex:0.9">
				<view class="item" v-for="(item, index) in years" :key="index">{{ item }}</view>
			</picker-view-column>

			<!-- 月份列 -->
			<picker-view-column v-if="showMonth" style="flex:0.9">
				<view class="item" v-for="(item, index) in months" :key="index">{{ item }}</view>
			</picker-view-column>

			<!-- 日期列 -->
			<picker-view-column v-if="showDay" style="flex:1.2">
				<view class="item" v-for="(item, index) in days" :key="index">{{ item }}</view>
			</picker-view-column>

			<!-- 小时列 -->
			<picker-view-column v-if="showHour" style="flex:0.9">
				<view class="item" v-for="(item, index) in hours" :key="index">{{ item }}</view>
			</picker-view-column>

			<!-- 分钟列 -->
			<picker-view-column v-if="showMinute" style="flex:0.9">
				<view class="item" v-for="(item, index) in minutes" :key="index">{{ item }}</view>
			</picker-view-column>

			<!-- 秒钟列 -->
			<picker-view-column v-if="showSecond" style="flex:0.9">
				<view class="item" v-for="(item, index) in seconds" :key="index">{{ item }}</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>
<script>
	// 获取月份天数的函数
	function getMonthDays(year, month) {
		return new Date(year, month, 0).getDate();
	}

	//获取当前时间
	function getCurrentTime(fmt = "yyyy-MM-dd") {
		let o = {
			'M+': new Date().getMonth() + 1, // 月份
			'd+': new Date().getDate(), // 日
			'h+': new Date().getHours(), // 小时
			'm+': new Date().getMinutes(), // 分
			's+': new Date().getSeconds(), // 秒
			'q+': Math.floor((new Date().getMonth() + 3) / 3), //季度
			'S': new Date().getMilliseconds() //毫秒
		}
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date().getFullYear() + '').substr(4 - RegExp.$1.length))
		for (var k in o) {
			if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
				'00' + o[k]).substr(('' + o[k]).length)))
		}
		return fmt
	}

	// 解析日期字符串为Date对象
	function parseDate(dateStr, format) {
		if (!dateStr) return null;

		let year = new Date().getFullYear();
		let month = 0; // 0-11
		let day = 1;
		let hour = 0;
		let minute = 0;
		let second = 0;

		// 判断格式类型
		if (format === 'yyyy') {
			year = parseInt(dateStr);
		} else if (format === 'yyyy-MM') {
			const parts = dateStr.split('-');
			year = parseInt(parts[0]);
			month = parseInt(parts[1]) - 1;
		} else if (format === 'yyyy-MM-dd') {
			const parts = dateStr.split('-');
			year = parseInt(parts[0]);
			month = parseInt(parts[1]) - 1;
			day = parseInt(parts[2]);
		} else if (format === 'HH:mm:ss') {
			const parts = dateStr.split(':');
			hour = parseInt(parts[0]);
			minute = parseInt(parts[1]);
			second = parseInt(parts[2]);
		} else if (format === 'HH:mm') {
			const parts = dateStr.split(':');
			hour = parseInt(parts[0]);
			minute = parseInt(parts[1]);
		} else if (format === 'HH') {
			hour = parseInt(dateStr);
		} else if (format === 'yyyy-MM-dd HH:mm:ss') {
			const [datePart, timePart] = dateStr.split(' ');
			const dateParts = datePart.split('-');
			const timeParts = timePart.split(':');

			year = parseInt(dateParts[0]);
			month = parseInt(dateParts[1]) - 1;
			day = parseInt(dateParts[2]);
			hour = parseInt(timeParts[0]);
			minute = parseInt(timeParts[1]);
			second = parseInt(timeParts[2]);
		} else if (format === 'yyyy-MM-dd HH:mm') {
			const [datePart, timePart] = dateStr.split(' ');
			const dateParts = datePart.split('-');
			const timeParts = timePart.split(':');

			year = parseInt(dateParts[0]);
			month = parseInt(dateParts[1]) - 1;
			day = parseInt(dateParts[2]);
			hour = parseInt(timeParts[0]);
			minute = parseInt(timeParts[1]);
		} else if (format === 'yyyy-MM-dd HH') {
			const [datePart, timePart] = dateStr.split(' ');
			const dateParts = datePart.split('-');

			year = parseInt(dateParts[0]);
			month = parseInt(dateParts[1]) - 1;
			day = parseInt(dateParts[2]);
			hour = parseInt(timePart);
		}

		return new Date(year, month, day, hour, minute, second);
	}

	export default {
		props: {
			showAnimation: {
				type: Boolean,
				default: false
			},
			format: {
				type: String,
				default: 'yyyy-MM-dd'
			},
			values: {
				type: [String, Array],
				default: null
			},
			start: {
				type: String,
				default: ''
			},
			end: {
				type: String,
				default: ''
			},
			dateType: {
				type: String,
				default: null
			}
		},
		data() {
			return {
				value: null, // 当前值
				indicatorStyle: 'height: 90px;',

				// 日期时间数据
				years: [],
				months: [],
				days: [],
				hours: [],
				minutes: [],
				seconds: [],
				defaultIndex: [],

				// 控制显示哪些列
				showYear: true,
				showMonth: true,
				showDay: true,
				showHour: false,
				showMinute: false,
				showSecond: false,

				weekDays: ['日', '一', '二', '三', '四', '五', '六'],

				// 范围限制
				startDate: null,
				endDate: null
			};
		},
		created() {
			this.value = this.values || getCurrentTime(this.format.replace("HH", "hh"));

			// 解析开始和结束日期
			this.startDate = this.start ? parseDate(this.start, this.format) : null;
			this.endDate = this.end ? parseDate(this.end, this.format) : null;

			// 根据格式确定显示哪些列
			this.determineColumnsToShow();

			// 初始化默认索引数组
			this.defaultIndex = new Array(6).fill(0);

			// 初始化数据
			this.initData();
		},
		methods: {
			// 确定显示哪些列
			determineColumnsToShow() {
				// 根据格式确定显示哪些列
				this.showYear = this.format.includes('yyyy');
				this.showMonth = this.format.includes('MM');
				this.showDay = this.format.includes('dd');
				this.showHour = this.format.includes('HH');
				this.showMinute = this.format.includes('mm');
				this.showSecond = this.format.includes('ss');
			},

			// 初始化所有数据
			initData() {
				if (this.showYear) this.initYears();
				if (this.showMonth) this.initMonths();
				if (this.showDay) this.initDays();
				if (this.showHour) this.initHours();
				if (this.showMinute) this.initMinutes();
				if (this.showSecond) this.initSeconds();
			},

			// 初始化年份数据
			initYears() {
				let startYear = 1945;
				let endYear = new Date().getFullYear() + 10;
				let selectedYear = new Date().getFullYear();

				// 应用范围限制
				if (this.startDate) {
					startYear = Math.max(startYear, this.startDate.getFullYear());
				}

				if (this.endDate) {
					endYear = Math.min(endYear, this.endDate.getFullYear());
				}

				if (this.value) {
					if (this.format.includes('HH') && this.value.includes(' ')) {
						const datePart = this.value.split(' ')[0];
						selectedYear = parseInt(datePart.split('-')[0]);
					} else {
						const dateParts = this.value.split('-');
						selectedYear = parseInt(dateParts[0]);
					}
				}

				// 确保选中的年份在范围内
				selectedYear = Math.max(startYear, Math.min(selectedYear, endYear));

				this.years = [];
				for (let i = startYear; i <= endYear; i++) {
					const year = i + '年';
					this.years.push(year);

					if (i === selectedYear) {
						this.defaultIndex[0] = this.years.length - 1;
					}
				}
			},

			// 初始化月份数据
			initMonths() {
				let startMonth = 1;
				let endMonth = 12;
				let selectedYear = parseInt(this.years[this.defaultIndex[0]]?.replace('年', '') || new Date()
					.getFullYear());
				let selectedMonth = new Date().getMonth() + 1;

				// 应用范围限制 - 只有当选中年份等于开始/结束年份时才限制月份
				if (this.startDate && selectedYear === this.startDate.getFullYear()) {
					startMonth = Math.max(startMonth, this.startDate.getMonth() + 1);
				}

				if (this.endDate && selectedYear === this.endDate.getFullYear()) {
					endMonth = Math.min(endMonth, this.endDate.getMonth() + 1);
				}

				if (this.value) {
					if (this.format.includes('HH') && this.value.includes(' ')) {
						const datePart = this.value.split(' ')[0];
						if (datePart.split('-').length > 1) {
							selectedMonth = parseInt(datePart.split('-')[1]);
						}
					} else if (this.value.split('-').length > 1) {
						selectedMonth = parseInt(this.value.split('-')[1]);
					}
				}

				// 确保选中的月份在范围内
				selectedMonth = Math.max(startMonth, Math.min(selectedMonth, endMonth));

				this.months = [];
				for (let i = startMonth; i <= endMonth; i++) {
					const month = (i < 10 ? `0${i}` : `${i}`) + '月';
					this.months.push(month);

					if (i === selectedMonth) {
						this.defaultIndex[1] = this.months.length - 1;
					}
				}
			},

			// 初始化日期数据
			initDays() {
				const year = parseInt(this.years[this.defaultIndex[0]]?.replace('年', '') || new Date().getFullYear());
				const month = parseInt(this.months[this.defaultIndex[1]]?.replace('月', '') || (new Date().getMonth() + 1));
				let startDay = 1;
				let endDay = getMonthDays(year, month);
				let selectedDay = new Date().getDate();

				// 应用范围限制
				if (this.startDate && year === this.startDate.getFullYear() && month === this.startDate.getMonth() + 1) {
					startDay = Math.max(startDay, this.startDate.getDate());
				}

				if (this.endDate && year === this.endDate.getFullYear() && month === this.endDate.getMonth() + 1) {
					endDay = Math.min(endDay, this.endDate.getDate());
				}

				if (this.value) {
					if (this.format.includes('HH') && this.value.includes(' ')) {
						const datePart = this.value.split(' ')[0];
						if (datePart.split('-').length > 2) {
							selectedDay = parseInt(datePart.split('-')[2]);
						}
					} else if (this.value.split('-').length > 2) {
						selectedDay = parseInt(this.value.split('-')[2]);
					}
				}

				// 确保选中的日期在范围内
				selectedDay = Math.max(startDay, Math.min(selectedDay, endDay));

				this.days = [];
				for (let i = startDay; i <= endDay; i++) {
					// 计算星期几
					const date = new Date(year, month - 1, i);
					const weekDay = date.getDay(); // 0-6，0表示星期日

					// 格式化日期，添加星期信息
					const formattedDay = i < 10 ? `0${i}` : `${i}`;
					// const dayText = `${formattedDay}日 周${this.weekDays[weekDay]}`;
					const dayText = `${formattedDay}日 `;

					this.days.push(dayText);

					if (i === selectedDay) {
						this.defaultIndex[2] = this.days.length - 1;
					}
				}
			},

			// 初始化小时数据
			initHours() {
				let startHour = 0;
				let endHour = 23;
				let selectedYear = parseInt(this.years[this.defaultIndex[0]]?.replace('年', '') || new Date()
					.getFullYear());
				let selectedMonth = parseInt(this.months[this.defaultIndex[1]]?.replace('月', '') || (new Date()
					.getMonth() + 1));
				let selectedDay = parseInt(this.days[this.defaultIndex[2]]?.split('日')[0] || new Date().getDate());
				let selectedHour = new Date().getHours();

				// 应用范围限制
				if (this.startDate &&
					selectedYear === this.startDate.getFullYear() &&
					selectedMonth === this.startDate.getMonth() + 1 &&
					selectedDay === this.startDate.getDate()) {
					startHour = Math.max(startHour, this.startDate.getHours());
				}

				if (this.endDate &&
					selectedYear === this.endDate.getFullYear() &&
					selectedMonth === this.endDate.getMonth() + 1 &&
					selectedDay === this.endDate.getDate()) {
					endHour = Math.min(endHour, this.endDate.getHours());
				}

				if (this.value) {
					if (this.format.includes('yyyy') && this.value.includes(' ')) {
						const timePart = this.value.split(' ')[1];
						selectedHour = parseInt(timePart.split(':')[0]);
					} else {
						const timeParts = this.value.split(':');
						selectedHour = parseInt(timeParts[0]);
					}
				}

				// 确保选中的小时在范围内
				selectedHour = Math.max(startHour, Math.min(selectedHour, endHour));

				this.hours = [];
				for (let i = startHour; i <= endHour; i++) {
					const hour = (i < 10 ? `0${i}` : `${i}`) + '时';
					this.hours.push(hour);

					if (i === selectedHour) {
						const hourIndex = this.format.includes('yyyy') ? 3 : 0;
						this.defaultIndex[hourIndex] = this.hours.length - 1;
					}
				}
			},

			// 初始化分钟数据
			initMinutes() {
				let startMinute = 0;
				let endMinute = 59;
				let selectedYear = parseInt(this.years[this.defaultIndex[0]]?.replace('年', '') || new Date()
					.getFullYear());
				let selectedMonth = parseInt(this.months[this.defaultIndex[1]]?.replace('月', '') || (new Date()
					.getMonth() + 1));
				let selectedDay = parseInt(this.days[this.defaultIndex[2]]?.split('日')[0] || new Date().getDate());
				let selectedHour = parseInt(this.hours[this.defaultIndex[this.format.includes('yyyy') ? 3 : 0]]?.replace(
					'时', '') || new Date().getHours());
				let selectedMinute = new Date().getMinutes();

				// 应用范围限制
				if (this.startDate &&
					selectedYear === this.startDate.getFullYear() &&
					selectedMonth === this.startDate.getMonth() + 1 &&
					selectedDay === this.startDate.getDate() &&
					selectedHour === this.startDate.getHours()) {
					startMinute = Math.max(startMinute, this.startDate.getMinutes());
				}

				if (this.endDate &&
					selectedYear === this.endDate.getFullYear() &&
					selectedMonth === this.endDate.getMonth() + 1 &&
					selectedDay === this.endDate.getDate() &&
					selectedHour === this.endDate.getHours()) {
					endMinute = Math.min(endMinute, this.endDate.getMinutes());
				}

				if (this.value) {
					if (this.format.includes('yyyy') && this.value.includes(' ')) {
						if (this.value.split(' ')[1].split(':').length > 1) {
							const timePart = this.value.split(' ')[1];
							selectedMinute = parseInt(timePart.split(':')[1]);
						}
					} else if (this.value.split(':').length > 1) {
						selectedMinute = parseInt(this.value.split(':')[1]);
					}
				}

				// 确保选中的分钟在范围内
				selectedMinute = Math.max(startMinute, Math.min(selectedMinute, endMinute));

				this.minutes = [];
				for (let i = startMinute; i <= endMinute; i++) {
					const minute = (i < 10 ? `0${i}` : `${i}`) + '分';
					this.minutes.push(minute);

					if (i === selectedMinute) {
						const minuteIndex = this.format.includes('yyyy') ? 4 : 1;
						this.defaultIndex[minuteIndex] = this.minutes.length - 1;
					}
				}
			},

			// 初始化秒钟数据
			initSeconds() {
				let startSecond = 0;
				let endSecond = 59;
				let selectedYear = parseInt(this.years[this.defaultIndex[0]]?.replace('年', '') || new Date()
					.getFullYear());
				let selectedMonth = parseInt(this.months[this.defaultIndex[1]]?.replace('月', '') || (new Date()
					.getMonth() + 1));
				let selectedDay = parseInt(this.days[this.defaultIndex[2]]?.split('日')[0] || new Date().getDate());
				let selectedHour = parseInt(this.hours[this.defaultIndex[this.format.includes('yyyy') ? 3 : 0]]?.replace(
					'时', '') || new Date().getHours());
				let selectedMinute = parseInt(this.minutes[this.defaultIndex[this.format.includes('yyyy') ? 4 : 1]]
					?.replace('分', '') || new Date().getMinutes());
				let selectedSecond = new Date().getSeconds();

				// 应用范围限制
				if (this.startDate &&
					selectedYear === this.startDate.getFullYear() &&
					selectedMonth === this.startDate.getMonth() + 1 &&
					selectedDay === this.startDate.getDate() &&
					selectedHour === this.startDate.getHours() &&
					selectedMinute === this.startDate.getMinutes()) {
					startSecond = Math.max(startSecond, this.startDate.getSeconds());
				}

				if (this.endDate &&
					selectedYear === this.endDate.getFullYear() &&
					selectedMonth === this.endDate.getMonth() + 1 &&
					selectedDay === this.endDate.getDate() &&
					selectedHour === this.endDate.getHours() &&
					selectedMinute === this.endDate.getMinutes()) {
					endSecond = Math.min(endSecond, this.endDate.getSeconds());
				}

				if (this.value) {
					if (this.format.includes('yyyy') && this.value.includes(' ')) {
						if (this.value.split(' ')[1].split(':').length > 2) {
							const timePart = this.value.split(' ')[1];
							selectedSecond = parseInt(timePart.split(':')[2]);
						}
					} else if (this.value.split(':').length > 2) {
						selectedSecond = parseInt(this.value.split(':')[2]);
					}
				}

				// 确保选中的秒钟在范围内
				selectedSecond = Math.max(startSecond, Math.min(selectedSecond, endSecond));

				this.seconds = [];
				for (let i = startSecond; i <= endSecond; i++) {
					const second = (i < 10 ? `0${i}` : `${i}`) + '秒';
					this.seconds.push(second);

					if (i === selectedSecond) {
						const secondIndex = this.format.includes('yyyy') ? 5 : 2;
						this.defaultIndex[secondIndex] = this.seconds.length - 1;
					}
				}
			},

			// 处理选择器变化
			bindChange(e) {
				const val = e.detail.value;

				// 保存原始索引，用于后续比较
				const oldIndices = [...this.defaultIndex];

				// 更新索引
				if (this.showYear) this.defaultIndex[0] = val[0];
				if (this.showMonth) this.defaultIndex[this.showYear ? 1 : 0] = val[this.showYear ? 1 : 0];
				if (this.showDay) this.defaultIndex[this.showYear ? (this.showMonth ? 2 : 1) : (this.showMonth ? 1 : 0)] =
					val[this.showYear ? (this.showMonth ? 2 : 1) : (this.showMonth ? 1 : 0)];
				if (this.showHour) this.defaultIndex[this.getHourIndex()] = val[this.getHourIndex()];
				if (this.showMinute) this.defaultIndex[this.getMinuteIndex()] = val[this.getMinuteIndex()];
				if (this.showSecond) this.defaultIndex[this.getSecondIndex()] = val[this.getSecondIndex()];

				// 检查是否需要重新初始化数据
				let needReinitialize = false;

				// 年份变化，需要重新初始化月份
				if (this.showYear && oldIndices[0] !== this.defaultIndex[0]) {
					if (this.showMonth) this.initMonths();
					needReinitialize = true;
				}

				// 月份变化，需要重新初始化日期
				if (this.showMonth && oldIndices[this.showYear ? 1 : 0] !== this.defaultIndex[this.showYear ? 1 : 0]) {
					if (this.showDay) this.initDays();
					needReinitialize = true;
				}

				// 日期变化，需要重新初始化小时
				if (this.showDay && oldIndices[this.showYear ? (this.showMonth ? 2 : 1) : (this.showMonth ? 1 : 0)] !==
					this.defaultIndex[this.showYear ? (this.showMonth ? 2 : 1) : (this.showMonth ? 1 : 0)]) {
					if (this.showHour) this.initHours();
					needReinitialize = true;
				}

				// 小时变化，需要重新初始化分钟
				if (this.showHour && oldIndices[this.getHourIndex()] !== this.defaultIndex[this.getHourIndex()]) {
					if (this.showMinute) this.initMinutes();
					needReinitialize = true;
				}

				// 分钟变化，需要重新初始化秒钟
				if (this.showMinute && oldIndices[this.getMinuteIndex()] !== this.defaultIndex[this.getMinuteIndex()]) {
					if (this.showSecond) this.initSeconds();
					needReinitialize = true;
				}

				// 确保索引不超出范围
				if (needReinitialize) {
					if (this.showMonth) {
						const monthIndex = this.showYear ? 1 : 0;
						this.defaultIndex[monthIndex] = Math.min(this.defaultIndex[monthIndex], this.months.length - 1);
					}

					if (this.showDay) {
						const dayIndex = this.showYear ? (this.showMonth ? 2 : 1) : (this.showMonth ? 1 : 0);
						this.defaultIndex[dayIndex] = Math.min(this.defaultIndex[dayIndex], this.days.length - 1);
					}

					if (this.showHour) {
						const hourIndex = this.getHourIndex();
						this.defaultIndex[hourIndex] = Math.min(this.defaultIndex[hourIndex], this.hours.length - 1);
					}

					if (this.showMinute) {
						const minuteIndex = this.getMinuteIndex();
						this.defaultIndex[minuteIndex] = Math.min(this.defaultIndex[minuteIndex], this.minutes.length - 1);
					}

					if (this.showSecond) {
						const secondIndex = this.getSecondIndex();
						this.defaultIndex[secondIndex] = Math.min(this.defaultIndex[secondIndex], this.seconds.length - 1);
					}
				}

				// 生成结果
				this.generateResult();
				this.$emit('change', this.value);
			},

			// 获取小时列的索引
			getHourIndex() {
				let index = 0;
				if (this.showYear) index++;
				if (this.showMonth) index++;
				if (this.showDay) index++;
				return index;
			},

			// 获取分钟列的索引
			getMinuteIndex() {
				return this.getHourIndex() + 1;
			},

			// 获取秒钟列的索引
			getSecondIndex() {
				return this.getMinuteIndex() + 1;
			},

			// 生成结果
			generateResult() {
				let result = '';

				// 判断是否为日期时间格式
				const isDateTime = this.format.includes('yyyy') && this.format.includes('HH');

				// 判断是否为纯时间格式
				const isTimeOnly = this.format.includes('HH') && !this.format.includes('yyyy');

				// 判断是否为纯日期格式
				const isDateOnly = this.format.includes('yyyy') && !this.format.includes('HH');

				if (isDateOnly) {
					// 纯日期类型
					if (this.showYear) {
						const year = this.years[this.defaultIndex[0]].replace('年', '');
						result = year;

						if (this.showMonth) {
							const month = this.months[this.defaultIndex[1]].replace('月', '');
							result += `-${month}`;

							if (this.showDay) {
								const dayWithWeek = this.days[this.defaultIndex[2]];
								const day = dayWithWeek.split(' ')[0].replace('日', '');
								result += `-${day}`;
							}
						}
					}
				} else if (isTimeOnly) {
					// 纯时间类型
					const hour = this.hours[this.defaultIndex[0]].replace('时', '');
					result = hour;

					if (this.showMinute) {
						const minute = this.minutes[this.defaultIndex[1]].replace('分', '');
						result += `:${minute}`;

						if (this.showSecond) {
							const second = this.seconds[this.defaultIndex[2]].replace('秒', '');
							result += `:${second}`;
						}
					}
				} else if (isDateTime) {
					// 日期时间类型
					const year = this.years[this.defaultIndex[0]].replace('年', '');
					const month = this.months[this.defaultIndex[1]].replace('月', '');
					const dayWithWeek = this.days[this.defaultIndex[2]];
					const day = dayWithWeek.split(' ')[0].replace('日', '');
					const hour = this.hours[this.defaultIndex[3]].replace('时', '');

					result = `${year}-${month}-${day} ${hour}`;

					if (this.showMinute) {
						const minute = this.minutes[this.defaultIndex[4]].replace('分', '');
						result += `:${minute}`;

						if (this.showSecond) {
							const second = this.seconds[this.defaultIndex[5]].replace('秒', '');
							result += `:${second}`;
						}
					}
				}

				this.value = result;
				this.handleChange(result);
			},

			handleClose() {
				this.$emit('cancel');
			},

			handleSubmit() {
				this.$emit('change', this.value);
			},

			handleChange(val) {
				this.value = val;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.content-container {
		// position: absolute;
		// bottom: -50%;
		/* 初始位置在屏幕外 */
		// left: 0;
		// right: 0;
		// z-index: 999;
		transition: 2s;
		padding: 10px;
		// background-color: #fff;
		height: 500rpx;
		width: 100%;
		transition: all 0.3s ease;
		/* 添加过渡效果 */

		&.slide-up {
			bottom: 0;
			/* 动画结束位置 */
		}

		.header-operate-btn {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			height: 50px;

			text {
				font-weight: bold;
				font-size: 36rpx;
			}

			.date-type {
				font-weight: normal;
				font-size: 32rpx;
			}

			.confirm {
				color: #20B681;
			}
		}
	}

	.picker-container {
		height: calc(100% - 20px);

		.item {
			line-height: 90px;
			text-align: center;
		}
	}
</style>