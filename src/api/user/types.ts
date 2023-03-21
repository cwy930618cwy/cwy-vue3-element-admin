/**
 * 登录用户信息
 */
export interface UserInfo {
  nickname: string;
  avatar: string;
  roles: string[];
  perms: string[];
}

/**
 * 用户查询参数
 */
export interface UserQuery extends PageQuery {
  keywords: string;
  status: number;
  deptId: number;
}

/**
 * 用户分页列表项声明
 */
export interface UserType {
  id: string;
  username: string;
  nickname: string;
  mobile: string;
  gender: number;
  avatar: string;
  email: string;
  status: number;
  deptName: string;
  roleNames: string;
  createTime: string;
}

/**
 * 用户分页项类型声明
 */
export type UserPageResult = PageResult<UserType[]>;


// 公司id: companyNo
// 查询
// 公司类型: companyType
// 公司名称: companyName
// 地区权限: companyPermision


// 授权账号数: souquanuser
// 失效日期：failDate
// 定制数据包：dingzhidata
// 公司联系人: companyPeople
// 公司联系电话: companyPhone

/**
 * 用户表单类型声明
 */
export interface UserForm {
  companyNo: number | undefined;
  companyType: number;
  companyName: string;
  companyPermision: number;
  souquanuser: number;
  failDate: number;
  dingzhidata: string[];
  companyPeople: string;
  companyPhone: number;
}

/**
 * 用户导入表单类型声明
 */
export interface UserImportData {
  deptId: number;
  roleIds: number[];
}
