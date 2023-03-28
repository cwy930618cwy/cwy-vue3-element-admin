import { defineStore } from 'pinia';

import { getToken, setToken, removeToken } from '@/utils/auth';
import { loginApi, logoutApi } from '@/api/auth';
import { getUserInfo, getUserRoles, getUserArea } from '@/api/user';
import { resetRouter } from '@/router';
import { store } from '@/store';
import { LoginData } from '@/api/auth/types';
import { ref } from 'vue';
import { UserInfo } from '@/api/user/types';

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref<string>(getToken() || '');
  const nickname = ref<string>('');
  const avatar = ref<string>('');
  const company = ref<string>('');
  const companyId = ref<string>('');
  const province = ref([]) as any;
  const accountNum = ref<string>('');
  const accessEndTime = ref<string>('');
  const roleId = ref(0) as any;
  const roleName = ref('') as any;
  const rolesTypeList = ref([]) as any;
  const originCityList = ref([]) as any;
  const roles = ref<Array<string>>([]); // 用户角色编码集合 → 判断路由权限
  const perms = ref<Array<string>>([]); // 用户权限编码集合 → 判断按钮权限

  // actions

  // 登录
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then((response: any) => {
          token.value = response.data.token;
          setToken(response.data.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 获取角色列表
  function getRoles() {
    return new Promise<any>((resolve, reject) => {
      getUserRoles()
        .then((data: any) => {
          rolesTypeList.value = data.data
          resolve(data.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 获取城市
  function getCity() {
    return new Promise<any>((resolve, reject) => {
      getUserArea()
        .then((data: any) => {
          originCityList.value = data.data
          resolve(data.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getInfo() {
    return new Promise<any>((resolve, reject) => {
      getUserInfo()
        .then((data: any) => {
          // // if (!data) {
          // //   return reject('Verification failed, please Login again.');
          // // }
          // // if (!data.roles || data.roles.length <= 0) {
          // //   reject('getUserInfo: roles must be a non-null array!');
          // // }

          data.data.nickname = data.data.userName
          data.data.avatar = ''
          data.data.roles = ['ADMIN']
          data.data.perms = []
            
          nickname.value = data.data.nickname;
          avatar.value = data.data.avatar;
          province.value = data.data.province;
          companyId.value = data.data.companyId;
          accountNum.value = data.data.accountNum;          
          roles.value = data.data.roles;
          roleId.value = data.data.roleId;
          perms.value = data.data.perms;
          accessEndTime.value = data.data.accessEndTime;
          company.value = data.data.company;

          rolesTypeList.value.forEach((element: any) => {
            if (element.id === data.data.roleId) {
              roleName.value = element.roleName
            }
          });
          resolve(data.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetRouter();
          resetToken();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 重置
  function resetToken() {
    removeToken();
    token.value = '';
    nickname.value = '';
    avatar.value = '';
    province.value = [''];
    company.value = '';
    accessEndTime.value = '';
    accountNum.value = '';
    roles.value = [];
    perms.value = [];
  }
  return {
    roleId,
    accessEndTime,
    companyId,
    originCityList,
    rolesTypeList,
    roleName,
    accountNum,
    province,
    company,
    token,
    nickname,
    avatar,
    roles,
    perms,
    login,
    getCity,
    getRoles,
    getInfo,
    logout,
    resetToken
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
