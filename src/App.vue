<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
</script>

<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>

<style lang="scss" scope>
@import './assets/css/common';
@import './assets/css/fastflex.scss';
@import './assets/css/element.scss';
</style>
