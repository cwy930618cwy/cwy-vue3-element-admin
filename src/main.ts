import { createApp, Directive } from 'vue';
import App from './App.vue';
import router from '@/router';
import { setupStore } from '@/store';

import ElementPlus from 'element-plus';

import Pagination from '@/components/Pagination/index.vue';
import '@/permission';

// 引入svg注册脚本
import 'virtual:svg-icons-register';

// 国际化
import i18n from '@/lang/index';

import '@/styles/index.scss';
// import '@/styless/common.scss';
import 'element-plus/theme-chalk/index.css';
//import 'element-plus/theme-chalk/dark/css-vars.css';
import showTip from "@/utils/dom";

const app = createApp(App);
// 自定义指令
import * as directive from '@/directive';
Object.keys(directive).forEach(key => {
  app.directive(key, (directive as { [key: string]: Directive })[key]);
});

// 全局方法
import { getDictionaries } from '@/api/dict';
app.config.globalProperties.$getDictionaries = getDictionaries;


import * as filters from "./filters"; // global filters
app.config.globalProperties.$filters = {
  formatTime(time: any) {
    if (!time) return time
    return filters.getYMDHMS(time)
  },
  formatSeven(time: any) {
    if (!time) return time
    return filters.getSeven(time)
  },
  formatRoleName(time: any) {
    return filters.getformatRoleName(time)
  },
  formatCity(province: any, city: any) {
    return filters.getCity(province, city)
  }
}

app.directive("show-tip", showTip);

// 全局挂载
setupStore(app);
app
  .component('Pagination', Pagination)
  .use(router)
  .use(ElementPlus)
  .use(i18n)
  .mount('#app');
