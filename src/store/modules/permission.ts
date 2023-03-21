import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { constantRoutes } from '@/router';
import { store } from '@/store';
import { listRoutes } from '@/api/menu';
import { ref } from 'vue';

const modules = import.meta.glob('../../views/**/**.vue');
export const Layout = () => import('@/layout/index.vue');

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    if (roles.includes('ROOT')) {
      return true;
    }
    return roles.some(role => {
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role);
      }
    });
  }
  return false;
};

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = [];
  routes.forEach(route => {
    const tmp = { ...route } as any;
    if (hasPermission(roles, tmp)) {
      if (tmp.component == 'Layout') {
        tmp.component = Layout;
      } else {
        const component = modules[`../../views/${tmp.component}.vue`] as any;
        if (component) {
          tmp.component = component;
        } else {
          tmp.component = modules[`../../views/error-page/404.vue`];
        }
      }
      res.push(tmp);

      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
    }
  });
  return res;
};

// setup
export const usePermissionStore = defineStore('permission', () => {
  // state
  const routes = ref<RouteRecordRaw[]>([]);
  const addRoutes = ref<RouteRecordRaw[]>([]);

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    addRoutes.value = newRoutes;
    routes.value = constantRoutes.concat(newRoutes);
  }

  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // listRoutes()
      //   .then(response => {

      //     // response.data = [
      //     //   {
      //     //     component: "Layout",
      //     //     meta: {
      //     //       title: '企业管理',
      //     //       icon: 'system',
      //     //       hidden: false,
      //     //       alwaysShow: true,
      //     //       roles: ['ADMIN'],
      //     //       keepAlive: true
      //     //     },
      //     //     path: "/company",
      //     //     redirect: "/company/index",
      //     //     children: [
      //     //       {
      //     //         component: "company/company/index",
      //     //         meta: { title: "企业管理", icon: "user", hidden: false, alwaysShow: false, roles: ["ADMIN"], keepAlive: true },
      //     //         alwaysShow: false,
      //     //         hidden: false,
      //     //         icon: "user",
      //     //         keepAlive: true,
      //     //         roles: ["ADMIN"],
      //     //         title: "企业管理",
      //     //         name: "company",
      //     //         path: "company"
      //     //       },
      //     //     ]
      //     //   },
      //     //   {
      //     //     component: "Layout",
      //     //     meta: {
      //     //       title: '账户管理',
      //     //       icon: 'user',
      //     //       hidden: false,
      //     //       alwaysShow: true,
      //     //       roles: ['ADMIN'],
      //     //       keepAlive: true
      //     //     },
      //     //     path: "/account",
      //     //     redirect: "/account/index",
      //     //     children: [
      //     //       {
      //     //         component: "account/account/index",
      //     //         meta: { title: "账户管理", icon: "user", hidden: false, alwaysShow: false, roles: ["ADMIN"], keepAlive: true },
      //     //         alwaysShow: false,
      //     //         hidden: false,
      //     //         icon: "user",
      //     //         keepAlive: true,
      //     //         roles: ["ADMIN"],
      //     //         title: "账户管理",
      //     //         name: "account",
      //     //         path: "account"
      //     //       },
      //     //     ]
      //     //   },
      //     //   {
      //     //     component: "Layout",
      //     //     meta: {
      //     //       title: '账号申请',
      //     //       icon: 'user',
      //     //       hidden: false,
      //     //       alwaysShow: true,
      //     //       roles: ['ADMIN'],
      //     //       keepAlive: true
      //     //     },
      //     //     path: "/apply",
      //     //     redirect: "/apply/index",
      //     //     children: [
      //     //       {
      //     //         component: "apply/apply/index",
      //     //         meta: { title: "账号申请", icon: "user", hidden: false, alwaysShow: false, roles: ["ADMIN"], keepAlive: true },
      //     //         alwaysShow: false,
      //     //         hidden: false,
      //     //         icon: "user",
      //     //         keepAlive: true,
      //     //         roles: ["ADMIN"],
      //     //         title: "账号申请",
      //     //         name: "apply",
      //     //         path: "apply"
      //     //       },
      //     //     ]
      //     //   }
      //     // ]

      //     const asyncRoutes = response.data;
      //     const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      //     setRoutes(accessedRoutes);
      //     resolve(accessedRoutes);
      //   })
      //   .catch(error => {
      //     reject(error);
      //   });
      const response: any = {
        data: []
      }

      // [
      //   {
      //     title: '企业管理',
      //     key: 'system',
      //     children: [
      //       {
      //         title: '企业儿子',
      //         key: 'sye2'
      //       }
      //     ]
      //   }
      // ]

      response.data = [
        {
          component: "Layout",
          meta: {
            title: '企业管理',
            icon: 'system',
            hidden: false,
            roles: ["ADMIN"],
            alwaysShow: true,
            keepAlive: true
          },
          path: "/company",
          redirect: "/company/index",
          children: [
            {
              component: "company/company/index",
              meta: { title: "企业管理", icon: "user", hidden: false, alwaysShow: false, roles: ["ADMIN"], keepAlive: true },
              alwaysShow: false,
              hidden: false,
              icon: "user",
              keepAlive: true,
              roles: ["ADMIN"],
              title: "企业管理",
              name: "company",
              path: "company"
            },
          ]
        },
        {
          component: "Layout",
          meta: {
            title: '账户管理',
            icon: 'user',
            hidden: false,
            alwaysShow: true,
            roles: ['ADMIN'],
            keepAlive: true
          },
          path: "/account",
          redirect: "/account/index",
          children: [
            {
              component: "account/account/index",
              meta: { title: "账户管理", icon: "user", hidden: false, alwaysShow: false, roles: ["ADMIN"], keepAlive: true },
              alwaysShow: false,
              hidden: false,
              icon: "user",
              keepAlive: true,
              roles: ["ADMIN"],
              title: "账户管理",
              name: "account",
              path: "account"
            },
          ]
        },
        {
          component: "Layout",
          meta: {
            title: '账号申请',
            icon: 'user',
            hidden: false,
            alwaysShow: true,
            roles: ['ADMIN'],
            keepAlive: true
          },
          path: "/apply",
          redirect: "/apply/index",
          children: [
            {
              component: "apply/apply/index",
              meta: { title: "账号申请", icon: "user", hidden: false, alwaysShow: false, roles: ["ADMIN"], keepAlive: true },
              alwaysShow: false,
              hidden: false,
              icon: "user",
              keepAlive: true,
              roles: ["ADMIN"],
              title: "账号申请",
              name: "apply",
              path: "apply"
            },
          ]
        }
      ]

      const asyncRoutes = response.data;
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      setRoutes(accessedRoutes);
      resolve(accessedRoutes);
      
    });
  }
  return { routes, setRoutes, generateRoutes };
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
