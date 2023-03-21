// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from "@/utils";

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time: number, label: string) {
  if (time === 1) {
    return time + label;
  }
  return time + label + "s";
}

/**
 * @param {number} time
 */
export function timeAgo(time: number) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), " minute");
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), " hour");
  } else {
    return pluralize(~~(between / 86400), " day");
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num: number, digits: number) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
      );
    }
  }
  return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num: number) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string: any) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function statusFilter(status: any) {
  const statusMap: any = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    danger: 'danger'
  }
  return statusMap[status]
}

export function getYMDHMS(timestamp: any) {
  const time = new Date(timestamp) as any
  const year = time.getFullYear() as any

  let month = time.getMonth() + 1 as any
  let date = time.getDate() as any
  if (month < 10) {
    month = '0' + month
  }
  if (date < 10) {
    date = '0' + date
  }
  return year + '-' + month + '-' + date
}

export function getSeven(timestamp: any) {
  const date = new Date(timestamp);
  const nowTime = new Date();
  const restSec = date.getTime() - nowTime.getTime();
  const day = parseInt((restSec / (60 * 60 * 24 * 1000)) as any);
  return day
}

import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();

export function getformatRoleName(roleId: any) {
  let roleName = ''
  userStore.$state.rolesTypeList.forEach((item: any) => {
    if (item.id === roleId) {
      roleName = item.roleName
    }
  })
  return roleName
}