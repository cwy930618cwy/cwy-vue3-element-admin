<template>
  <div class="app-container">

    <el-card shadow="never" style="margin-bottom: 10px;" v-if="userStore.$state.roleId === 3">
      <div class="companyAll">
        <div class="list">
          <div class="split"></div>
          <div class="title">公司名称：</div>
          <div class="name">{{ userStore.$state.company }}</div>
        </div>
        <div class="list">
          <div class="split"></div>
          <div class="title">地区权限：</div>
          <div class="name">{{ userStore.$state.province }}</div>
        </div>
        <div>您的企业被授权{{ userStore.$state.accountNum }}个账号使用权限</div>
      </div>
    </el-card>

    <el-row :gutter="20">

      <!-- 用户数据 -->
      <el-col :span="24" :xs="24">
        <div class="search">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="公司名称" prop="company" v-if="userStore.$state.roleId === 1">
              <el-select v-model="queryParams.company" style="width: 180px;" filterable clearable remote reserve-keyword placeholder="请输入关键词" @blur="selectBlur" @clear="selectClear" @change="selectChange" :remote-method="getGenderOptions">
                <el-option v-for="item in restaurants" :key="item.unitName" :label="item.unitName" :value="item.unitName">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="账号" prop="accountName">
              <el-input v-model="queryParams.accountName" placeholder="请输入账号名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item label="手机号" prop="linkPhone">
              <el-input v-model="queryParams.linkPhone" placeholder="请输入手机号" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item label="只看可用账号" prop="states">
              <el-switch v-model="queryParams.states" @change="handleQuery" />
            </el-form-item>

            <el-form-item>
              <el-button color="#7263CE" :icon="Search" @click="handleQuery">搜索</el-button>
              <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
            <!-- 
            <el-form-item>
              <el-button type="success" :icon="Plus" @click="handleAllAdd">批量启用</el-button>
            </el-form-item> -->

            <el-form-item>
              <el-button color="#7263CE" :icon="Plus" @click="handleAllDisable">批量禁用</el-button>
            </el-form-item>

            <el-form-item>
              <el-button color="#7263CE" :icon="Plus" @click="handleAdd">新增账号</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never" style="margin-bottom: 10px;">
          <div class="chooseAll">
            <div>已选中{{ ids.length }}项目</div>
            <span @click="toggleSelection('')">清空</span>
          </div>
        </el-card>

        <el-card shadow="never">
          <el-table v-loading="loading" ref="multipleTableRef" :data="userList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="账号" show-overflow-tooltip align="center" prop="userName" />
            <el-table-column label="姓名" width="120" align="center" prop="linkMan" />
            <el-table-column label="近七日总DAU" v-if="userStore.$state.roleId === 1" width="120" align="center" prop="accountDAU">
              <template #default="scope">
                <span>{{ scope.row.dailyCount ? scope.row?.dailyCount['总计'] : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户角色" v-if="userStore.$state.roleId === 1" width="120" align="center" prop="roleId">
              <template #default="scope">
                <span>{{ proxy.$filters.formatRoleName(scope.row.roleId) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属公司名称" show-overflow-tooltip width="220" align="center" prop="company" />
            <el-table-column label="手机号" width="120" align="center" prop="linkPhone" />
            <el-table-column label="地区权限" align="center" prop="province" width="120" />
            <el-table-column label="状态" align="center" prop="states">
              <template #default="scope">
                <el-switch v-model="scope.row.states" :inactive-value="0" :active-value="1" @change="handleStatusChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="备注" show-overflow-tooltip align="center" prop="remarks" width="120" />
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.createTime) === 0 ? '-' : proxy.$filters.formatTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.updateTime) === 0 ? '-' : proxy.$filters.formatTime(scope.row.updateTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left" fixed="right" width="160">
              <template #default="scope">
                <el-button type="primary" link @click="handleUpdate(scope.row)">编辑</el-button>
                <el-button type="primary" link @click="handleReset(scope.row)">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNumber" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户表单 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body @close="closeDialog">
      <el-form ref="dataFormRef" label-position="top" height="250" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="所属公司名称" prop="company">
          <el-select v-if="userStore.$state.roleId === 1" v-model="formData.company" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getGenderOptions" :loading="loading" @change="selectCompany">
            <el-option v-for="item in restaurants" :key="item.unitName" :label="item.unitName" :value="item.unitName">
            </el-option>
          </el-select>
          <el-input v-else v-model="formData.company" disabled placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="用户角色" v-if="userStore.$state.roleId === 1" prop="roleId">
          <el-radio-group v-model="formData.roleId">
            <el-radio v-for="item in userRoles" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input v-model="formData.userName" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" v-if="false" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="姓名" prop="linkMan">
          <el-input v-model="formData.linkMan" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="地区权限" prop="totalcity">
          <el-cascader :options="citylist" style="width: 500px;" v-model="formData.totalcity" :props="{ multiple: true, value: 'name', label: 'name', checkStrictly: true }" clearable @change="provinceChange"></el-cascader>
        </el-form-item>
        <el-form-item label="手机号" prop="linkPhone">
          <el-input v-model="formData.linkPhone" placeholder="请输入手机号" maxlength="50" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="formData.remarks" placeholder="请输入备注" maxlength="50" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button color="#7263CE" @click="submitForm">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts">
export default {
  name: 'user'
};
</script>

<script setup lang="ts">
import {
  reactive,
  ref,
  watchEffect,
  onMounted,
  getCurrentInstance,
  toRefs,
  nextTick
} from 'vue';
import { getAreaJson } from '@/constant/area.js';

import { searchCompany } from '@/api/company';

// api
import {
  fetchList,
  fetchCompanyInfo,
  detailAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  resetPasswordAccount
  // updateUserStatus,
  // updateUserPassword
} from '@/api/account';
import { getUserArea } from '@/api/user';
import { listRoleOptions } from '@/api/role';

import {
  ElTree,
  ElForm,
  ElMessageBox,
  ElMessage,
  UploadFile
} from 'element-plus';
import {
  Search,
  Plus,
  Refresh,
  Delete,
  Download,
  Top,
  UploadFilled
} from '@element-plus/icons-vue';
import {
  UserForm,
  UserImportData,
  UserQuery,
  UserType
} from '@/api/user/types';

import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { store } from '@/store';
const userStore = useUserStore();
const router = useRouter();

const queryFormRef = ref(ElForm); // 查询表单
const dataFormRef = ref(ElForm); // 用户表单
const importFormRef = ref(ElForm); // 导入表单

const { ctx, proxy }: any = getCurrentInstance();

const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [] as number[],
  // 总条数
  total: 0,
  userList: [] as any,
  dialog: {
    visible: false
  } as any,
  dialogReset: {
    visible: false
  } as any,
  deptName: undefined,
  // 部门下拉项
  deptOptions: [] as any,
  // 性别下拉项
  genderOptions: [] as any,
  // 角色下拉项
  roleOptions: [] as any,
  formData: {
    accountNo: null,
    company: '',
    roleId: 4,
    userName: '',
    password: '',
    province: '',
    totalcity: '',
    linkMan: '',
    linkPhone: '',
    ramark: ''
  } as any,
  queryParams: {
    company: '',
    accountName: '',
    linkPhone: '',
    states: true,
    pageNumber: 1,
    pageSize: 10
  } as any,

  rules: {
    company: [
      { required: true, message: '所属公司名称不能为空', trigger: 'blur' }
    ],
    roleId: [
      { required: true, message: '用户类型不能为空', trigger: 'change' }
    ],
    userName: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    linkMan: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    totalcity: [
      { required: true, message: '地区权限不能为空', trigger: 'change' }
    ],
    linkPhone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
    remarks: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
  },

  importDialog: {
    title: '用户导入',
    visible: false
  } as any,
  importFormData: {} as UserImportData,
  excelFile: undefined as any,
  excelFilelist: [] as File[],
  userRoles: [] as any
});

const {
  ids,
  loading,
  queryParams,
  userList,
  total,
  dialog,
  formData,
  rules,
  userRoles,
  deptName,
  deptOptions,
  roleOptions,
  importDialog,
  importFormData,
  excelFilelist
} = toRefs(state);

const province = ref([]);
const city = ref([]);

function provinceChange(citys: any) {
  let total = citys;
  citys.forEach((item: any) => {
    if (province.value.indexOf(item[0]) === -1) {
      province.value.push(item[0]);
    }
    if (item[1] && city.value.indexOf(item[1]) === -1) {
      city.value.push(item[1]);
    }
    if (item[0] === '全国' || item === '全国') {
      total = ['全国'];
      province.value = ['全国'];
      city.value = ['全国'];
    }
  });
  state.formData.totalcity = total;
  state.formData.province = province.value;
  state.formData.city = city.value;
}

/**
 * 部门筛选
 */
function filterDeptNode(value: string, data: any) {
  if (!value) {
    return true;
  }
  return data.label.indexOf(value) !== -1;
}

/**
 * 部门树节点click
 */
function handleDeptNodeClick(data: { [key: string]: any }) {
  state.queryParams.deptId = data.value;
  handleQuery();
}

/**
 * 获取角色下拉项
 */
async function getRoleOptions() {
  state.roleOptions = [
    {
      value: '0',
      label: '专辑特新'
    },
    {
      value: '1',
      label: '国网供应商'
    }
  ];
  // listRoleOptions().then(response => {
  // });
}

async function getUserRoles() {
  state.userRoles = [];
  userStore.$state.rolesTypeList.forEach((item: any) => {
    if (item.remarks !== '0') {
      state.userRoles.push({
        id: item.id,
        name: item.roleName
      });
    }
  });
}

/**
 * 用户状态change
 */
function handleStatusChange(row: { [key: string]: any }) {
  const text = row.states === 1 ? '启用' : '停用';
  ElMessageBox.confirm(
    '确认要' + text + '' + row.userName + '账户吗?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      deleteAccount({ state: row.states, userIds: [row.userId] }).then(() => {
        ElMessage.success(text + '成功');
      });
    })
    .catch(() => {
      row.states = row.states === 1 ? 0 : 1;
    });
}

/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  if (userStore.$state.roleId === 3) {
    fetchCompanyInfo({
      accountName: state.queryParams.accountName,
      companyId: userStore.$state.companyId,
      linkPhone: state.queryParams.linkPhone,
      pageNumber: state.queryParams.pageNumber,
      pageSize: state.queryParams.pageSize,
      states: state.queryParams.states ? 1 : 0
    }).then(({ data }) => {
      state.userList = data.list;
      state.total = data.totalSize;
      state.loading = false;
    });
  } else {
    fetchList({
      accountName: state.queryParams.accountName,
      company: state.queryParams.company,
      linkPhone: state.queryParams.linkPhone,
      pageNumber: state.queryParams.pageNumber,
      pageSize: state.queryParams.pageSize,
      states: state.queryParams.states ? 1 : 0
    }).then(({ data }) => {
      state.userList = data.list;
      state.total = data.totalSize;
      state.loading = false;
    });
  }
}

/**
 * 重置
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

/**
 * 行选中
 */
function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item.userId);
}

/**
 * 批量启用
 */
function handleAllAdd() {
  // state.ids = selection.map((item: any) => item.userId);
  // toggleSelection(userList.value);
}

/**
 * 批量禁用
 */
function handleAllDisable(selection: any) {
  ElMessageBox.confirm('确认要批量禁用用户吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteAccount({ state: 0, userIds: state.ids }).then(() => {
        ElMessage.success('批量禁用成功！');
        handleQuery();
      });
    })
    .catch(() => {
      // row.states = row.states === 1 ? 0 : 1;
    });
}

const multipleTableRef = ref();
function toggleSelection(rows?: any) {
  if (rows) {
    rows.forEach((row: any) => {
      multipleTableRef.value!.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value!.clearSelection();
  }
}

/**
 * 重置密码
 */
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    '请输入用户「' + row.username + '」的新密码',
    '重置密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  )
    .then(({ value }) => {
      if (!value) {
        ElMessage.warning('请输入新密码');
        return false;
      }
      // updateUserPassword(row.id, value).then(() => {
      //   ElMessage.success('密码重置成功，新密码是：' + value);
      // });
    })
    .catch(() => {});
}

const resetTemp = () => {
  state.formData = {
    accountNo: null,
    company: userStore.$state.roleId === 1 ? '' : userStore.$state.company,
    roleId: 4,
    userName: '',
    password: '',
    province: '',
    totalcity: '',
    linkMan: '',
    linkPhone: '',
    ramark: ''
  };
};

/**
 * 添加用户
 **/
async function handleAdd() {
  state.dialog = {
    title: '添加账号',
    visible: true
  };
  await getDeptOptions(userStore.$state.province);
  await getRoleOptions();
  nextTick(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
    resetTemp();
  });
}

/**
 * 修改用户
 **/
async function handleUpdate(row: { [key: string]: any }) {
  detailAccount({ userId: row.userId }).then((res: any) => {
    formData.value = res.data;
    if (!formData.value.province) {
      formData.value.province = [];
    }
    if (!formData.value.city) {
      formData.value.city = [];
    }

    formData.value.totalcity = formData.value.province.concat(
      formData.value.city
    );
    province.value = formData.value.province;
    city.value = formData.value.city;
    getDeptOptions(userStore.$state.province);
    dialog.value = {
      title: '修改账号',
      visible: true
    };
  });
}

/**
 * 表单提交
 */
function submitForm() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = state.formData.userId;
      if (userId) {
        updateAccount(state.formData).then(() => {
          ElMessage.success('修改用户成功');
          closeDialog();
          handleQuery();
        });
      } else {
        createAccount(state.formData).then(() => {
          ElMessage.success('新增用户成功');
          closeDialog();
          handleQuery();
        });
      }
    }
  });
}

/**
 * 删除用户
 */
function handleDelete(row: { [key: string]: any }) {
  const userIds = row.id || state.ids.join(',');
  ElMessageBox.confirm(
    '是否确认删除用户编号为「' + userIds + '」的数据项?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(function () {
      deleteAccount(userIds).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

/**
 * 关闭用户弹窗
 */
function closeDialog() {
  dialog.value.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.value.id = undefined;
}

/**
 * 获取部门下拉项
 */
async function getDeptOptions(province: any) {
  // formData.value.province = ['安徽']
  // formData.value.city = ['安庆']

  getUserArea().then((response: any) => {
    if (province === '全国') {
      citylist.value = response.data;
    } else {
      response.data.forEach((element: any) => {
        if (element.name === province) {
          if (element.children && element.children.length > 0) {
            citylist.value = element.children;
          } else {
            citylist.value = response.data;
          }
        }
      });
    }
    formData.value.province = ['安徽'];
  });
}

/**
 * 获取性别下拉项
 */
function getGenderOptions(query: any) {
  searchCompany({ company: query }).then((response: any) => {
    restaurants.value = response?.data;
  });
}

function selectBlur(e: any) {
  // 意见类型
  if (e.target.value !== '') {
    state.queryParams.company = e.target.value;
    ctx.$forceUpdate();
  }
}
function selectClear() {
  state.queryParams.company = '';
  ctx.$forceUpdate();
}
function selectChange(val: any) {
  state.queryParams.company = val;
  ctx.$forceUpdate();
}

function selectCompany(query: any) {
  restaurants.value.forEach((item: any) => {
    if (item.unitName === query) {
      getDeptOptions(item.province[0]);
    }
  });
}

function handleSelect(item: any) {}

/**
 * 修改用户
 **/
async function handleReset(row: { [key: string]: any }) {
  ElMessageBox.confirm('确认要为账号' + row.userName + '重置密码吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      resetPasswordAccount({ userId: row.userId }).then(() => {
        ElMessage.success('重置密码成功');
      });
    })
    .catch(() => {
      // row.states = row.states === 1 ? 0 : 1;
    });
}

const citylist = ref([]) as any;
const restaurants = ref([]) as any;

onMounted(() => {
  queryParams.value.company = router.currentRoute.value.query.company
    ? router.currentRoute.value.query.company
    : '';

  handleQuery();
  // 初始化部门
  getDeptOptions(userStore.$state.province);
  // 初始化用户列表数据
  handleQuery();
  getUserRoles();
});
</script>

