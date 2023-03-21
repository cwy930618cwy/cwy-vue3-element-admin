<script lang="ts" setup>
import { ref } from 'vue';
import { useSettingsStore } from '@/store/modules/settings';

const settingsStore = useSettingsStore();

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
});

const logo = ref<string>(
  new URL(`../../../assets/logo.png`, import.meta.url).href
);
</script>

<template>
  <transition class="bg-gray-800">
    <router-link v-if="collapse" key="collapse" class="h-[50px] flex items-center justify-center" to="/">
      <img v-if="settingsStore.sidebarLogo" :src="logo" class="w-5 h-5" />
      <div v-else>
        <h1>融标宝后台管理系统</h1>
        <h5>挖掘企业客户的贷款商机</h5>
      </div>
    </router-link>

    <router-link v-else key="expand" class="h-[50px] flex items-center justify-center" to="/">
      <img v-if="settingsStore.sidebarLogo" :src="logo" class="w-5 h-5" />
      <div class="flex" style="flex-direction: column;">
        <div class="ml-3 text-white text-sm font-bold">融标宝后台管理</div>
        <div class="ml-3 text-white text-sm font-bold">挖掘企业客户的贷款商机</div>
      </div>
    </router-link>
  </transition>
</template>
