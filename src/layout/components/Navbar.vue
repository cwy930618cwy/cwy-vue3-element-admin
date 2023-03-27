<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';

import Hamburger from '@/components/Hamburger/index.vue';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import Screenfull from '@/components/Screenfull/index.vue';
import SizeSelect from '@/components/SizeSelect/index.vue';
import LangSelect from '@/components/LangSelect/index.vue';
import MixNav from './Sidebar/MixNav.vue';
import { CaretBottom } from '@element-plus/icons-vue';

import { useAppStore } from '@/store/modules/app';
import { useTagsViewStore } from '@/store/modules/tagsView';
import { useUserStore } from '@/store/modules/user';
import { useSettingsStore } from '@/store/modules/settings';

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

const device = computed(() => appStore.device);

function toggleSideBar() {
  appStore.toggleSidebar(true);
}

function logout() {
  ElMessageBox.confirm('确定退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    confirmButtonClass: 'el-button-primary',
    cancelButtonClass: 'el-button-origin',
    type: 'warning'
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  });
}
</script>

<template>
  <div class="navbar">
    <div class="flex justify-start" v-if="device === 'mobile' || settingsStore.layout === 'left'">
      <hamburger :is-active="appStore.sidebar.opened" @toggleClick="toggleSideBar" />
      <!-- 面包屑导航栏 -->
      <breadcrumb />
    </div>

    <mix-nav v-if="device !== 'mobile' && settingsStore.layout === 'mix'" />

    <div v-if="device === 'mobile' || settingsStore.layout === 'left'" class="flex justify-start">
      <div class="flex justify-center fr_fs">
        <el-tag style="margin-top: 10px;">{{ userStore.$state.roleName }}</el-tag>
        <div style="margin: 0 20px;margin: 0px 20px;line-height: 16px;margin-top: 10px;">
          <div>{{ userStore.$state.nickname }}</div>
          <div>{{ userStore.$state.accessEndTime }}到期</div>
        </div>
        <div style="margin-right: 20px;cursor: pointer;margin-top: 10px;" @click="logout">退出</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-dropdown {
  font-size: 18px;
}

.navbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.2);
}
</style>
