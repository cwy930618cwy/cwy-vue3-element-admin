import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { constantRoutes } from '@/router';
import { store } from '@/store';
import { listRoutes } from '@/api/menu';
import { ref } from 'vue';

const modules = import.meta.glob('../../views/**/**.vue');
export const Layout = () => import('@/layout/index.vue');
import matchs from "@/routerMatch";

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
    const matchVal = matchs[tmp.permissionId]
    if (matchVal) {
      const config: any = {
        path: matchVal.path,
        name: matchVal.name,
        hidden: false,
        component: Layout,
        meta: matchVal.meta,
        children: []
      }
      config.children = [
        {
          component: modules[`../../views/${matchVal.component}.vue`],
          meta: matchVal.meta,
          title: matchVal.meta.title,
          name: matchVal.name,
          path: matchVal.path
        },
      ]
      res.push(config);
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
      listRoutes()
        .then(response => {
          const asyncRoutes = response.data;
          const accessedRoutes: any = filterAsyncRoutes(asyncRoutes, []);
          setRoutes(accessedRoutes);
          resolve(accessedRoutes);
        })

      
    });
  }
  return { routes, setRoutes, generateRoutes };
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
