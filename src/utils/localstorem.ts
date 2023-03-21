/**
 * 获取当前月的总天数
 */
function getDays() {
  const date = new Date();
  //将当前月份加1，下移到下一个月
  date.setMonth(date.getMonth() + 1);
  //将当前的日期置为0，
  date.setDate(0);
  //再获取天数即取上个月的最后一天的天数
  const days = date.getDate();
  return days;
}

/**
 * 计算两个时间是否大于一个月
 * @param {String} starDate 进行比较的开始日期  例如：2017-07-08 2017/01/12  日期格式字符串
 * @param {String} endDate 进行比较的结束日期  例如：2017-07-08 2017/01/12  日期格式字符串
 * @returns {Boolean}
 */
export function getD(starDate: any, endDate: any) {
  const sDate = new Date(starDate).getTime();
  const eDate = new Date(endDate).getTime();

  if ((eDate - sDate) / (24 * 60 * 60 * 1000) > 30) {
    return false;
  } else {
    return true;
  }
}

export function getCurrentTime() {
    const date = new Date();//当前时间
    const year = date.getFullYear() //返回指定日期的年份
    const month = repair(date.getMonth() + 1);//月
    const day = repair(date.getDate());//日
    
    //当前时间 
    const curTime = year + "-" + month + "-" + day
    return curTime;
}
 
//补0
 
function repair(i: any) {
  if (i >= 0 && i <= 9) {
    return "0" + i;
  } else {
    return i;
  }
}