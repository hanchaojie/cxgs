import {
	getAPi,
	postAPi,
	putApi,
	deleteAPi,
	imgGet,
	getPutAPi,
	elsepostAPi,
	elsegetAPi
} from "./api";



//获取当前月一共有几天
const mGetDate = (year, month) => {
	var d = new Date(year, month, 0);
	return d.getDate();
}

// 格式化日对象
const getNowDate = () => {
	var date = new Date();
	var sign2 = ":";
	var year = date.getFullYear() // 年
	var month = date.getMonth() + 1; // 月
	var day = date.getDate(); // 日
	var hour = date.getHours(); // 时
	var minutes = date.getMinutes(); // 分
	var seconds = date.getSeconds() //秒
	var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
	var week = weekArr[date.getDay()];
	// 给一位数的数据前面加 “0”
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (day >= 0 && day <= 9) {
		day = "0" + day;
	}
	if (hour >= 0 && hour <= 9) {
		hour = "0" + hour;
	}
	if (minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}
	if (seconds >= 0 && seconds <= 9) {
		seconds = "0" + seconds;
	}
	return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
}
const getHoursTime = (e) => { // 计算N小时之前的时间
	// 获取当前时间
	let now = new Date();
	let twoDaysAgo = new Date(now.getTime() - e * 60 * 60 * 1000);

	// 获取年月日时分秒
	let newyear = twoDaysAgo.getFullYear();
	let newmonth = twoDaysAgo.getMonth() + 1; // 月份是从0开始的，所以需要加1
	let newdate = twoDaysAgo.getDate();
	let newhours = twoDaysAgo.getHours();
	let newminutes = twoDaysAgo.getMinutes();
	let newseconds = twoDaysAgo.getSeconds();

	// 将月、日、小时、分钟和秒数补齐为两位数字
	const nmonth = newmonth < 10 ? '0' + newmonth : newmonth;
	const ndate = newdate < 10 ? '0' + newdate : newdate;
	const nhours = newhours < 10 ? '0' + newhours : newhours;
	const nminutes = newminutes < 10 ? '0' + newminutes : newminutes;
	const nseconds = newseconds < 10 ? '0' + newseconds : newseconds;

	// 组合成字符串格式
	return newyear + '-' + nmonth + '-' + ndate + ' ' + nhours + ':' + nminutes + ':' + nseconds;
}



const getNowDateDay = () => { //只返回年月日  和上面的没区别  
	var date = new Date();
	var sign2 = ":";
	var year = date.getFullYear() // 年
	var month = date.getMonth() + 1; // 月
	var day = date.getDate(); // 日
	var hour = date.getHours(); // 时
	var minutes = date.getMinutes(); // 分
	var seconds = date.getSeconds() //秒
	var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
	var week = weekArr[date.getDay()];
	// 给一位数的数据前面加 “0”
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (day >= 0 && day <= 9) {
		day = "0" + day;
	}
	if (hour >= 0 && hour <= 9) {
		hour = "0" + hour;
	}
	if (minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}
	if (seconds >= 0 && seconds <= 9) {
		seconds = "0" + seconds;
	}
	return year + "-" + month + "-" + day;
}

const getHoursTimeDay = (e) => { // 计算N小时之前的时间  只返回年月日  和上面的没区别  
	// 获取当前时间
	let now = new Date();
	let twoDaysAgo = new Date(now.getTime() - e * 60 * 60 * 1000);

	// 获取年月日时分秒
	let newyear = twoDaysAgo.getFullYear();
	let newmonth = twoDaysAgo.getMonth() + 1; // 月份是从0开始的，所以需要加1
	let newdate = twoDaysAgo.getDate();
	let newhours = twoDaysAgo.getHours();
	let newminutes = twoDaysAgo.getMinutes();
	let newseconds = twoDaysAgo.getSeconds();

	// 将月、日、小时、分钟和秒数补齐为两位数字
	const daynmonth = newmonth < 10 ? '0' + newmonth : newmonth;
	const ndate = newdate < 10 ? '0' + newdate : newdate;
	const nhours = newhours < 10 ? '0' + newhours : newhours;
	const nminutes = newminutes < 10 ? '0' + newminutes : newminutes;
	const nseconds = newseconds < 10 ? '0' + newseconds : newseconds;

	// 组合成字符串格式
	return newyear + '-' + daynmonth + '-' + ndate;
}
const getNowDateMonth = () => { //只返回年月  和上面的没区别  
	var date = new Date();
	var sign2 = ":";
	var year = date.getFullYear() // 年
	var month = date.getMonth() + 1; // 月
	var day = date.getDate(); // 日
	var hour = date.getHours(); // 时
	var minutes = date.getMinutes(); // 分
	var seconds = date.getSeconds() //秒
	var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
	var week = weekArr[date.getDay()];
	// 给一位数的数据前面加 “0”
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (day >= 0 && day <= 9) {
		day = "0" + day;
	}
	if (hour >= 0 && hour <= 9) {
		hour = "0" + hour;
	}
	if (minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}
	if (seconds >= 0 && seconds <= 9) {
		seconds = "0" + seconds;
	}
	return year + "-" + month;
}
const getHoursTimeMonth = (e) => { // 计算N小时之前的时间  只返回年月  和上面的没区别  
	// 获取当前时间
	let now = new Date();
	let twoDaysAgo = new Date(now.getTime() - e * 60 * 60 * 1000);

	// 获取年月日时分秒
	let newyear = twoDaysAgo.getFullYear();
	let newmonth = twoDaysAgo.getMonth() + 1; // 月份是从0开始的，所以需要加1
	let newdate = twoDaysAgo.getDate();
	let newhours = twoDaysAgo.getHours();
	let newminutes = twoDaysAgo.getMinutes();
	let newseconds = twoDaysAgo.getSeconds();

	// 将月、日、小时、分钟和秒数补齐为两位数字
	const yearnmonth = newmonth < 10 ? '0' + newmonth : newmonth;
	const ndate = newdate < 10 ? '0' + newdate : newdate;
	const nhours = newhours < 10 ? '0' + newhours : newhours;
	const nminutes = newminutes < 10 ? '0' + newminutes : newminutes;
	const nseconds = newseconds < 10 ? '0' + newseconds : newseconds;

	// 组合成字符串格式
	return newyear + '-' + yearnmonth;
}


const timeDifference = (e) => {
	const startTime = new Date(e);
	// 获取当前时间
	const now = new Date();

	// 计算时间差（毫秒）
	const timeDiffMs = now - startTime;
	console.log(timeDiffMs);


	// 转换为总分钟数
	const totalMinutes = Math.floor(timeDiffMs / (1000 * 60));

	// 计算小时和剩余分钟
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	// 格式化输出
	console.log(`距离起始时间已过去 ${hours} 小时 ${minutes} 分钟`);
	return `${hours} 小时 ${minutes} 分钟`
	// // 如需在页面展示，可返回结构化数据
	// const result = {
	// 	hours: hours,
	// 	minutes: minutes,
	// 	formatted: `${hours}小时${minutes}分钟`
	// };

}


// 获取字典
function queryDict(opt) {
	return getAPi('/system/dict/data/list', opt)
}
// 获取iP
function getUserIp(opt) {
	return getAPi('/getUserIp', opt)
}


// 获取验证码图片
function getCaptchaImage(opt) {
	return getAPi('/captchaImage', opt)
}
// 获取个人信息
function getInfo(opt) {
	return getAPi('/getInfo', opt)
}

// 登录
function login(opt) {
	return postAPi('/appLogin', opt) //适配app新的接口  token长时间免登录 
	// return postAPi('/login', opt)   //PC端登录接口   token过期快

}

//一张图  树形数据
function mapTree(opt) {
	return getAPi('/map/mapLayer/tree', opt)
}
//巡查待办任务
function getUserTaskTodoList(opt) {
	return getAPi('/patrol/getUserTaskTodoList', opt)
}
// 开始巡查
function startXuncha(opt) {
	return getAPi('/patrol/start', opt)
}
// 继续巡查
function continueXuncha(opt) {
	return getAPi('/patrol/continue', opt)
}
// 结束巡查
function finishXuncha(opt) {
	return getAPi('/patrol/finish', opt)
}

// 通过蓝牙编码或经纬度获取巡查对象
function getTargetList(opt) {
	return getAPi('/patrol/getTargetList', opt, null, true)
}

// 查询巡查记录检查事项列表
function getCheckList(opt) {
	return getAPi('/patrol/record/getCheckList', opt)
}
// 获取巡查对象事项
function getTargetSubjectTree(opt) {
	return getAPi('/patrol/getTargetSubjectTree', opt)
}
// 提交检查记录及隐患
function submitCheck(opt) {
	return postAPi('/patrol/submitCheck', opt)
}

// 移动端-总览统计
function overviewCountMobile(opt) {
	return getAPi('/realTime/monitor/overviewCountMobile', opt)
}



// 查询行政区划树状结构下关联的水厂信息
function GettreeByAddvcd(opt) {
	return getAPi('/AttWawoBase/AttWawoBase/treeByAddvcd', opt)
}
// 新增水质采样信息
function wqArtificial(opt) {
	return postAPi('/wq/artificial', opt)
}

// 查询水质采样信息列表
function queryWqlist(opt) {
	return getAPi('/wq/artificial/list', opt)
}
// 获取水质采样信息详细信息
function getwqArtificialDetail(opt) {
	return getAPi(`/wq/artificial/${opt}`)
}


// 查询巡查工程问题统计树   隐患记录列表
function getPageList(opt) {
	return postAPi('/matter/getPageList', opt)
}
// 工单列表
function getOrderList(opt) {
	return getAPi(`/order/list`, opt)
}
// 查询水厂基本信息列表
function baseAttWawoBaseList(opt) {
	return getAPi(`/AttWawoBase/AttWawoBase/list`, opt)
}
// 获取水质采样信息详细信息
function getAttWawoBase(opt) {
	return getAPi(`/AttWawoBase/AttWawoBase/${opt}`)
}
// 获取实时供水统计-供水概览
function querysupplyOverview(opt) {
	return getAPi(`/PipeSupplyDaySta/supplyDaySta/supplyOverview`, opt)
}
// 供水趋势,供水统计表格
function querysupplyTrend(opt) {
	return getAPi(`/PipeSupplyDaySta/supplyDaySta/supplyTrend`, opt)
}
// 查询视频监控点列表
function videoMonitorList(opt) {
	return getAPi(`/video/monitor/list`, opt)
}

// 实时监测
function getMonitorSummary(opt) {
	return getAPi(`/realTime/monitor/getMonitorSummary`, opt)
}

// 实时监测
function echartsWq(opt) {
	return getAPi(`/wq/automatic/listMonitorList`, opt)
}
// 进出厂流量分析
function getInOutFlowByCode(opt) {
	return getAPi(`/StIntakeDaySta/intakeDaySta/getInOutFlowByCode`, opt)
}

// 新增工单信息
function addOrder(opt) {
	return postAPi('/order', opt)
}
// 查询用户列表
function listUser(opt) {
	return getAPi(`/system/user/list`, opt)
}
// 获取工单信息详细信息
function getOrderDetail(opt) {
	return getAPi(`/order/${opt}`)
}
// 进行流程下一步
function ProcesstoNext(opt) {
	return postAPi('/orderProcess/toNext', opt)
}
// 查询维养流程列表
function getOrderProcessList(opt) {
	return getAPi(`/orderProcess/list`, opt)
}
// 查询预警信息列表
function getwarnSensorWarning(opt) {
	return getAPi(`/warn/sensorWarning/list`, opt)
}
// 查询预警督办信息列表
function getwarnSupervision(opt) {
	return getAPi(`/warn/supervision/list`, opt)
}
// 获取预警督办信息详细信息
function getwarnSupervisionId(opt) {
	return getAPi(`/warn/sensorWarning/${opt}`)
}

// 修改预警信息
function putSensorWarning(opt) {
	return putApi(`/warn/sensorWarning`, opt)
}
// 查询公众投诉信息列表
function getComplaintlist(opt) {
	return getAPi(`/complaint/list`, opt)
}
//乡镇集合
function getaddvcdList(opt) {
	return getAPi(`/base/addvcd/list`, opt)
}
//水厂列表
function getAttWawoBaseList(opt) {
	return getAPi(`/AttWawoBase/AttWawoBase/list`, opt)
}
// 获取公众投诉信息详细信息
function getcomplaintId(opt) {
	return getAPi(`/complaint/${opt}`)
}
// 修改公众投诉信息
function putComplaint(opt) {
	return putApi(`/complaint`, opt)
}
// 查询巡查隐患列表-分页 Copy
function matterPageList(opt) {
	return postAPi('/matter/getPageList', opt)
}
// 删除公众投诉
function deleteComplaint(opt) {
	return deleteAPi(`/complaint/${opt}`)
}
// 查询巡查工程列表
function getprojectList(opt) {
	return getAPi(`/patrol/project/list`, opt)
}
// 查询巡查部位列表
function getpartList(opt) {
	return getAPi(`/patrol/part/list`, opt)
}
// 查询设施设备列表
function getFacilityList(opt) {
	return getAPi(`/patrol/facility/list`, opt)
}
//新增问题上报
function addMatter(opt) {
	return postAPi('/matter', opt)
}
// 获取问题详细信息 
function getMatterId(opt) {
	return getAPi(`/matter/${opt}`)
}
// 新增维修养护记录
function addRecord(opt) {
	return postAPi('/maintenanceRecord/record', opt)
}
// 查询维修养护记录列表
function getRecordList(opt) {
	return getAPi(`/maintenanceRecord/record/list`, opt)
}
// 获取维修养护记录详细信息
function getRecordDetail(opt) {
	return getAPi(`/maintenanceRecord/record/${opt}`)
}
// 查询维养流程列表
function getMTProcessList(opt) {
	return getAPi(`/maintenanceProcess/process/list`, opt)
}
// 维修养护流程下一步
function maintenanceProcessNext(opt) {
	return postAPi('/maintenanceProcess/process/toNext', opt)
}
//修改密码
function updatePwd(opt) {
	return getPutAPi(`/system/user/profile/updatePwd`, opt)
}
// 查询巡查记录列表
function getpatrolRecordList(opt) {
	return getAPi(`/patrol/record/list`, opt)
}
// 获取巡查记录详细信息
function getPatrolId(opt) {
	return getAPi(`/patrol/record/${opt}`)
}
// 查询厂站清水池液位历史列表
function getwawoWaterH(opt) {
	return getAPi(`/wawoWaterH/list`, opt)
}
// 查询自动水质监测状态统计
function getautomaticgetStatusCount(opt) {
	return getAPi(`/wq/automatic/getStatusCount`, opt)
}
// 查询水厂统计
function jianceMon(opt) {
	return getAPi(`/AttWawoBase/AttWawoBase/getMonitorDataList`, opt)
}
//查询是否升级APP
function getLastVersion(opt) {
	return getAPi('/system/app/getLastVersion', opt)
}
// 查询问题模版列表
function getquestionModel(opt) {
	return getAPi('/questionModel/list', opt)
}
// 通讯录
function getaddressBook(opt) {
	return getAPi('/AttPersonManageBase/personManageBase/list', opt)
}

// 查询巡查记录详情
function querygetDetail(opt) {
	return getAPi('/patrol/record/getDetail', opt)

	// return getAPi(`/patrol/record/${opt}`)
}
//获取摄像头
function getVideo(opt) {
	return postAPi('/api/hikvision/previewURLs', opt)
}
//转动摄像头
function getVideocontrolling(opt) {
	return postAPi('/api/hikvision/controlling', opt)
}

//获取待办事件
function getTodo(opt) {
	return getAPi('/todo/list', opt)
}


//预警信息一键已读
function sensorWarningRead(opt) {
	return postAPi('/warn/sensorWarning/read', opt)
}

//根据厂站code获取统管员
function getUserByWawo(opt) {
	return getAPi('/relUserWawo/getUserByWawo', opt)
}

// 查询附件业务管理列表
function getCommonFile(opt) {
	return elsegetAPi('/system/commonFile/list', opt)
}


// 新增附件业务管理
function postCommonFile(opt) {
	return postAPi('/system/commonFile', opt)
}

// 查询附件业务管理列表
function delectCommonFile(opt) {
	return deleteAPi(`/system/commonFile/${opt}`)
}

module.exports = {
	getHoursTime,
	timeDifference,
	getNowDate,
	getHoursTimeDay,
	getNowDateDay,
	getHoursTimeMonth,
	getNowDateMonth,
	getUserIp,
	getCaptchaImage,
	login,
	mapTree,
	queryDict,
	getUserTaskTodoList,
	startXuncha,
	continueXuncha,
	getTargetList,
	getCheckList,
	getTargetSubjectTree,
	submitCheck,
	overviewCountMobile,
	GettreeByAddvcd,
	wqArtificial,
	queryWqlist,
	getwqArtificialDetail,
	getPageList,
	getOrderList,
	baseAttWawoBaseList,
	getAttWawoBase,
	querysupplyOverview,
	querysupplyTrend,
	videoMonitorList,
	getMonitorSummary,
	echartsWq,
	getInOutFlowByCode,
	addOrder,
	listUser,
	getInfo,
	getOrderDetail,
	ProcesstoNext,
	getOrderProcessList,
	getwarnSensorWarning,
	getwarnSupervision,
	getwarnSupervisionId,
	putSensorWarning,
	getComplaintlist,
	getaddvcdList,
	getAttWawoBaseList,
	getcomplaintId,
	putComplaint,
	matterPageList,
	deleteComplaint,
	getprojectList,
	getpartList,
	getFacilityList,
	addMatter,
	getMatterId,
	addRecord,
	getRecordList,
	getRecordDetail,
	getMTProcessList,
	maintenanceProcessNext,
	updatePwd,
	getpatrolRecordList,
	getPatrolId,
	finishXuncha,
	getwawoWaterH,
	getautomaticgetStatusCount,
	jianceMon,
	getLastVersion,
	getquestionModel,
	getaddressBook,
	querygetDetail,
	getVideo,
	getVideocontrolling,
	getTodo,
	sensorWarningRead,
	getUserByWawo,
	getCommonFile,postCommonFile,delectCommonFile
}