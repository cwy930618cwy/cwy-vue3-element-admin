<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginData" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container" style="display: flex;">
        <!-- <div class="image"></div> -->
        <img class="image" src="@/assets/logo.png" alt="首页" />
        <div class="right">
          <h3 class="title1">融标宝后台管理系统</h3>
          <h4 class="title2">挖局企业客户的贷款商机</h4>
        </div>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginData.username" :placeholder="$t('login.username')" name="username" type="text" tabindex="1" auto-complete="on" />
      </el-form-item>

      <el-tooltip :disabled="capslockTooltipDisabled" content="Caps lock is On" placement="right">
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input ref="passwordRef" :key="passwordType" v-model="loginData.password" :type="passwordType" placeholder="Password" name="password" tabindex="2" auto-complete="on" @keyup="checkCapslock" @blur="capslockTooltipDisabled = true" @keyup.enter="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button size="default" :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px;background: #7263ce; height: 50px;border-color: #7263ce;" @click.prevent="handleLogin">{{ $t('login.login') }}
      </el-button>

      <!-- 账号密码提示 -->
      <!-- <div class="tips">
        <div style="position: relative">
          <span style="margin-right: 20px">{{ $t('login.username') }}: admin</span>
          <span> {{ $t('login.password') }}: 123456</span>
        </div>
      </div> -->
      <el-checkbox v-model="config.autoInsertSpace">30天内免登录</el-checkbox>
    </el-form>

    <div v-if="showCopyright == true" class="copyright">
      <p>{{ $t('login.copyright') }}</p>
      <p>{{ $t('login.icp') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch, nextTick } from 'vue';

// 组件依赖
import { ElForm, ElInput } from 'element-plus';
import router from '@/router';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { getD, getCurrentTime } from '@/utils/localstorem';

// 状态管理依赖
import { useUserStore } from '@/store/modules/user';

// API依赖
import { useRoute } from 'vue-router';
import { LoginData } from '@/api/auth/types';

import { localStorage } from '@/utils/localStorage';

const userStore = useUserStore();
const route = useRoute();

const loginFormRef = ref(ElForm);
const passwordRef = ref(ElInput);

const config = reactive({
  autoInsertSpace: true
});

const state = reactive({
  redirect: '',
  loginData: {
    avoidTheLogin: 0,
    username: 'cxhtest', // admin
    password: '123456' // 123456
  } as LoginData,
  loginRules: {
    username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
    password: [{ required: true, trigger: 'blur', validator: validatePassword }]
  },
  loading: false,
  passwordType: 'password',
  // 大写提示禁用
  capslockTooltipDisabled: true,
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
  showCopyright: true,
  showDialog: false
});

function validatePassword(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    callback();
  }
}

const {
  loginData,
  loginRules,
  loading,
  passwordType,
  capslockTooltipDisabled,
  showCopyright
} = toRefs(state);

function checkCapslock(e: any) {
  const { key } = e;
  state.capslockTooltipDisabled =
    key && key.length === 1 && key >= 'A' && key <= 'Z';
}

function showPwd() {
  if (passwordType.value === 'password') {
    passwordType.value = '';
  } else {
    passwordType.value = 'password';
  }
  nextTick(() => {
    passwordRef.value.focus();
  });
}

// 30天免登陆
function freeLogin() {
  if (config.autoInsertSpace) {
    localStorage.set('username', state.loginData.username);
    localStorage.set('password', state.loginData.password);
  } else {
    localStorage.set('username', '');
    localStorage.set('password', '');
  }
  localStorage.set('freetime', getCurrentTime());
  localStorage.set('autoInsertSpace', config.autoInsertSpace);
}
/**
 *  登录
 */
function handleLogin() {
  freeLogin();
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      userStore
        .login(state.loginData)
        .then(() => {
          router.push({ path: state.redirect || '/', query: state.otherQuery });
          state.loading = false;
        })
        .catch(() => {
          state.loading = false;
        });
    } else {
      return false;
    }
  });
}

watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true
  }
);

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}

onMounted(() => {
  if (getD(localStorage.get('freetime'), getCurrentTime())) {
    state.loginData.username = localStorage.get('username');
    state.loginData.password = localStorage.get('password');
  } else {
    localStorage.set('username', '');
    localStorage.set('password', '');
  }
  config.autoInsertSpace = localStorage.get('autoInsertSpace');
  window.onresize = () => {
    if (state.clientHeight > document.documentElement.clientHeight) {
      state.showCopyright = false;
    } else {
      state.showCopyright = true;
    }
  };
});
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

.el-input__wrapper {
  width: 100%;
}

/* reset element-ui css */
.login-container {
  .title-container {
    position: relative;

    .image {
      height: 80px;
      width: 80px;
      margin-right: 40px;
      margin-bottom: 40px;
    }

    .title1 {
      font-size: 20px;
      color: #7263ce;
      margin: 0px auto 10px auto;
    }
    .title2 {
      font-size: 18px;
      color: #7263ce;
    }

    .title {
      font-size: 26px;
      color: #7263ce;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .el-input {
    display: inline-block;
    color: black;
    height: 36px;
    width: 85%;
    .el-input__wrapper {
      padding: 0;
      background: transparent;
      box-shadow: none;
      .el-input__inner {
        // background: transparent;
        // border: 0px;
        // -webkit-appearance: none;
        // border-radius: 0px;
        height: 36px;
        // caret-color: $cursor;

        &:-webkit-autofill {
          // box-shadow: 0 0 0px 1000px $bg inset !important;
          // -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-input__inner {
    &:hover {
      border-color: var(--el-input-hover-border, var(--el-border-color-hover));
      box-shadow: none;
    }

    box-shadow: none;
  }

  .el-form-item {
    border: 1px solid #eee;
    background: white;
    border-radius: 5px;
    color: #454545;
  }

  .copyright {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    text-align: center;
    color: #cccccc;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 5px 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captcha {
    position: absolute;
    right: 0;
    top: 0;

    img {
      height: 42px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
}

.thirdparty-button {
  position: absolute;
  right: 40px;
  bottom: 6px;
}

@media only screen and (max-width: 470px) {
  .thirdparty-button {
    display: none;
  }
}
</style>
