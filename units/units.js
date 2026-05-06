function userIdStrCheck(userIdStr, userId) {
	console.log(userIdStr, userId)
	if (userIdStr) {
		let userIdArr = userIdStr.split(',');
		return userIdArr.includes(userId + '');
	}
	return false;
}

function selectRole(specifiedRole, userRole) {
	return specifiedRole.some(item => userRole.includes(item));
}

//地标 转 国测 常量
var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0; //卫星椭球坐标投影到平面地图坐标系的投影因子。  
var ee = 0.00669342162296594323; //椭球的偏心率。

//转化经度
function transformlng(lng, lat) {
    var ret =
        300.0 +
        lng +
        2.0 * lat +
        0.1 * lng * lng +
        0.1 * lng * lat +
        0.1 * Math.sqrt(Math.abs(lng));
    ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) +
            20.0 * Math.sin(2.0 * lng * PI)) *
            2.0) /
        3.0;
    ret +=
        ((20.0 * Math.sin(lng * PI) +
            40.0 * Math.sin((lng / 3.0) * PI)) *
            2.0) /
        3.0;
    ret +=
        ((150.0 * Math.sin((lng / 12.0) * PI) +
            300.0 * Math.sin((lng / 30.0) * PI)) *
            2.0) /
        3.0;
    return ret;
}
//转化纬度
function transformlat(lng, lat) {
    var ret =
        -100.0 +
        2.0 * lng +
        3.0 * lat +
        0.2 * lat * lat +
        0.1 * lng * lat +
        0.2 * Math.sqrt(Math.abs(lng));
    ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) +
            20.0 * Math.sin(2.0 * lng * PI)) *
            2.0) /
        3.0;
    ret +=
        ((20.0 * Math.sin(lat * PI) +
            40.0 * Math.sin((lat / 3.0) * PI)) *
            2.0) /
        3.0;
    ret +=
        ((160.0 * Math.sin((lat / 12.0) * PI) +
            320 * Math.sin((lat * PI) / 30.0)) *
            2.0) /
        3.0;
    return ret;
}
function out_of_china(lng, lat) {
    return (
        lng < 72.004 ||
        lng > 137.8347 ||
        (lat < 0.8293 || lat > 55.8271 || false)
    );
}
function wgs84_to_gcj02(lng, lat) {
	if (out_of_china(lng, lat)) {
		return [lng, lat];
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = (lat / 180.0) * PI;
		var magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat =
			(dlat * 180.0) /
			(((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
		dlng =
			(dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
		var mglat = lat + dlat;
		var mglng = lng + dlng;

		return [mglng, mglat];
	}
}



/**
 * @param {number} lat1 - 第一个点的纬度
 * @param {number} lng1 - 第一个点的经度
 * @param {number} lat2 - 第二个点的纬度
 * @param {number} lng2 - 第二个点的经度
 * @param {boolean} kilometreFlag - 单位标志：true返回公里(km)并保留1位小数，false返回米(m)并取整
 * @returns {string} 两点间的距离字符串（带单位）
 */
function getDistance(lat1, lng1, lat2, lng2, kilometreFlag = false) {
// window.location.href = "https://blog.csdn.net/2301_76459194?spm=1011.2266.3001.5343"
  // 将角度转换为弧度
  function rad(d) {
    return d * Math.PI / 180;
  }
 
  // 将经纬度从角度转换为弧度
  const radLat1 = rad(lat1);
  const radLat2 = rad(lat2);
 
  // 计算纬度和经度的差值（弧度）
  const a = radLat1 - radLat2;
  const b = rad(lng1) - rad(lng2);
 
  // 使用哈弗辛公式计算两点间的球面距离
  let s = 2 * Math.asin(
    Math.sqrt(
      Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
    )
  );
 
  // 乘以地球半径（6378.137公里）得到距离（公里）
  s = s * 6378.137;
 
  // 根据单位标识返回不同单位和精度的结果
  if(kilometreFlag) {
    // 返回公里单位，保留1位小数
    s = s.toFixed(1) + 'km';
  }
  else {
    // 返回米单位，四舍五入取整
    s = Math.round(s * 1000).toFixed(0) ;
  }
  return s;
}
module.exports = {
	userIdStrCheck,
	selectRole,
	wgs84_to_gcj02,getDistance
}