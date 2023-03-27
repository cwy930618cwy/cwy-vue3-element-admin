<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!-- 公司数据 -->
      <el-col :span="24" :xs="24">
        <div class="search">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="公司名称" prop="company">
              <el-select v-model="queryParams.company" style="width: 180px;" filterable clearable remote reserve-keyword placeholder="请输入关键词" @blur="selectBlur" @clear="selectClear" @change="selectChange" :remote-method="getGenderOptions">
                <el-option v-for="item in restaurants" :key="item.unitName" :label="item.unitName" :value="item.unitName">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="只看可用公司" prop="states">
              <el-switch v-model="queryParams.states" @change="handleQuery" />
            </el-form-item>

            <el-form-item>
              <el-button class="el-button-primary" :icon="Search" @click="handleQuery">搜索</el-button>
              <el-button class="el-button-origin" :icon="Refresh" @click="resetQuery">重置</el-button>
              <el-button class="el-button-primary" :icon="Plus" @click="handleAdd">新增公司</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <el-table v-loading="loading" :data="userList">
            <el-table-column label="公司名称" show-overflow-tooltip align="center" min-width="200" prop="company">
              <template #default="scope">
                <span style="color: #409eff;cursor: pointer;" @click="resetPassword(scope.row)">{{ scope.row.company }}</span>
                <el-tag class="ml-2" v-if="scope.row.companyType === 0" type="danger">试用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="可用账号数/授权账号数" min-width="100" align="center" prop="validNum">
              <template #default="scope">
                {{ scope.row.validNum }}/{{ scope.row.accountNum }}
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="states">
              <template #default="scope">
                <el-switch v-model="scope.row.states" :inactive-value="0" :active-value="1" :before-change="beforeSwitchChange" @change="handleStatusChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="失效日期" sortable align="center" prop="accessEndTime" min-width="120">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.accessEndTime) === 0 ? '-' : proxy.$filters.formatTime(scope.row.accessEndTime) }}</span>
                <el-tag class="ml-2" v-if="proxy.$filters.formatSeven(scope.row.accessEndTime) < 30" type="danger">剩余{{ proxy.$filters.formatSeven(scope.row.accessEndTime) }}天</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="近七日总DAU" min-width="120" align="center" prop="dailyCount">
              <template #default="scope">
                <span>{{ scope.row.dailyCount['总计'] }}</span>
              </template>
            </el-table-column>

            <el-table-column v-for="item in state.header" :key="item" :label="item" min-width="80" align="center" prop="dailyCount">
              <template #default="scope">
                <span>{{ scope.row.dailyCount[item] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商务经理" align="center" prop="salesPerson" min-width="120" />
            <el-table-column label="公司联系人/公司联系电话" show-overflow-tooltip min-width="120" align="center" prop="linkMan">
              <template #default="scope">
                {{ scope.row.linkMan }}/{{ scope.row.linkPhone }}
              </template>
            </el-table-column>

            <el-table-column label="地区权限" align="center" prop="province" min-width="120" />
            <el-table-column label="创建时间" sortable align="center" prop="createTime" min-width="180">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.createTime) === 0 ? '-' : proxy.$filters.formatTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" sortable align="center" prop="updateTime" min-width="180">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.updateTime) === 0 ? '-' : proxy.$filters.formatTime(scope.row.updateTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left" fixed="right" min-width="120">
              <template #default="scope">
                <el-button type="primary" link @click="resetPassword(scope.row)">进入</el-button>
                <el-button type="primary" link @click="handleUpdate(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNumber" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 公司表单 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" v-if="dialog.visible" width="600px" append-to-body @close="closeDialog">
      <el-form ref="dataFormRef" label-position="top" height="250" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="公司类型" prop="companyType">
          <el-radio-group v-model="formData.companyType">
            <el-radio :label="0" size="large">合作公司</el-radio>
            <el-radio :label="1" size="large">试用公司</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="formData.company" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="授权账号数" prop="accountNum">
          <el-input v-model="formData.accountNum" placeholder="请输入授权账号数" maxlength="11" />
        </el-form-item>
        <el-form-item label="地区权限" prop="totalcity">
          <el-cascader :options="citylist" style="width: 500px;" v-model="formData.totalcity" :props="{ multiple: true, value: 'name', label: 'name', checkStrictly: true }" clearable @change="provinceChange"></el-cascader>
        </el-form-item>
        <el-form-item label="开始日期和失效日期" prop="accessEndTime">
          <el-date-picker v-model="formData.accessBeginTime" type="date" placeholder="请输入生效日期">
          </el-date-picker>
          <div style="margin: 0 20px;">-</div>
          <el-date-picker v-model="formData.accessEndTime" type="date" placeholder="请输入失效日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商务经理" prop="salesPerson">
          <el-input v-model="formData.salesPerson" placeholder="请输入商务经理" maxlength="50" />
        </el-form-item>
        <el-form-item label="公司联系人" prop="linkMan">
          <el-input v-model="formData.linkMan" placeholder="请输入公司联系人" maxlength="50" />
        </el-form-item>
        <el-form-item label="公司联系电话" prop="linkPhone">
          <el-input v-model="formData.linkPhone" placeholder="请输入公司联系电话" maxlength="50" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="el-button-primary" @click="submitForm">确 定</el-button>
          <el-button class="el-button-origin" @click="closeDialog">取 消</el-button>
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

import {
  fetchList,
  detailCompany,
  createCompany,
  updateCompany,
  deleteCompany
  // updateUserStatus,
  // updateUserPassword
} from '@/api/company';

import { listDeptOptions } from '@/api/dept';
import { listRoleOptions } from '@/api/role';
import { getUserArea } from '@/api/user';

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

import { parseTime } from '@/utils';

import router from '@/router';
import { useUserStore } from '@/store/modules/user';
import { store } from '@/store';
import { searchCompany } from '@/api/company';
const userStore = useUserStore();

const queryFormRef = ref(ElForm); // 查询表单
const dataFormRef = ref(ElForm); // 公司表单
const cascaderRef = ref(ElForm); // 公司表单
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
  deptName: undefined,
  // 部门下拉项
  deptOptions: [] as any,
  // 性别下拉项
  genderOptions: [] as any,
  // 角色下拉项
  roleOptions: [] as any,

  formData: {
    companyId: null,
    companyType: 0,
    company: '',
    province: [''],
    totalcity: [''],
    accountNum: '',
    accessBeginTime: null,
    accessEndTime: null,
    salesPerson: '',
    linkMan: '',
    linkPhone: ''
  } as any,
  queryParams: {
    company: '',
    states: true,
    pageNumber: 1,
    pageSize: 10
  } as any,
  rules: {
    companyType: [
      { required: true, message: '公司类型不能为空', trigger: 'change' }
    ],
    company: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
    totalcity: [
      {
        required: true,
        message: '地区权限不能为空',
        trigger: 'change'
      }
    ],
    accountNum: [
      { required: true, message: '授权账号数不能为空', trigger: 'blur' }
    ],
    accessEndTime: [
      { required: true, message: '失效日期不能为空', trigger: 'blur' }
    ]
  },

  importDialog: {
    title: '公司导入',
    visible: false
  } as DialogType,
  importFormData: {} as UserImportData,
  excelFile: undefined as any,
  excelFilelist: [] as File[],
  header: [] as any
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
  deptName,
  deptOptions,
  roleOptions,
  importDialog,
  importFormData,
  excelFilelist,
  header
} = toRefs(state);

let province = ref([]);
let city = ref([]);

function provinceChange(citys: any) {
  let total = citys;
  province.value = [];
  city.value = [];
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
  // handleQuery();
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

let switchState = reactive({
  switchStatus: false
});
const beforeSwitchChange = (val: any) => {
  switchState.switchStatus = true;
  return switchState.switchStatus;
};

/**
 * 公司状态change
 */
function handleStatusChange(row: { [key: string]: any }) {
  if (!switchState.switchStatus) return;
  if (!row.company) return;
  const text = row.states === 1 ? '启用' : '停用';
  ElMessageBox.confirm('确认要' + text + '' + row.company + '公司吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    confirmButtonClass: 'el-button-primary',
    cancelButtonClass: 'el-button-origin',
    type: 'warning'
  })
    .then(() => {
      deleteCompany({ state: row.states, companyIds: [row.companyId] }).then(
        () => {
          ElMessage.success(text + '成功');
        }
      );
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
  fetchList({
    company: state.queryParams.company,
    pageNumber: state.queryParams.pageNumber,
    pageSize: state.queryParams.pageSize,
    states: state.queryParams.states ? 1 : 0
  }).then((data: any) => {
    state.loading = false;
    state.userList = data.data.list;
    state.total = data.data.totalSize;
    state.header = [];
    for (let items in data.data.list[0].dailyCount) {
      if (items !== '总计') state.header.push(items);
    }
  });
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
  state.ids = selection.map((item: any) => item.id);
}

/**
 * 进入
 */
function resetPassword(row: { [key: string]: any }) {
  router.push({
    path: '/account',
    query: { company: row.company }
  });
}

const resetTemp = () => {
  state.formData = {
    companyId: null,
    companyType: 0,
    company: '',
    province: [''],
    totalcity: ['全国'],
    accountNum: '',
    accessBeginTime: null,
    accessEndTime: null,
    salesPerson: '',
    linkMan: '',
    linkPhone: ''
  };
};

/**
 * 添加公司
 **/
function handleAdd() {
  state.dialog = {
    title: '新增公司',
    visible: true
  };
  nextTick(() => {
    resetTemp();
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
  });
}

/**
 * 修改公司
 **/
async function handleUpdate(row: { [key: string]: any }) {
  detailCompany({ companyId: row.companyId }).then((res: any) => {
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
      title: '编辑公司',
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
      const userId = state.formData.companyId;

      state.formData.accessBeginTime = parseTime(
        Date.parse(new Date(state.formData.accessBeginTime) as any),
        '{y}-{m}-{d}'
      );
      state.formData.accessEndTime = parseTime(
        Date.parse(new Date(state.formData.accessEndTime) as any),
        '{y}-{m}-{d}'
      );

      state.formData.createTime = undefined;
      state.formData.updateTime = undefined;

      if (userId) {
        updateCompany(state.formData).then(() => {
          ElMessage.success('修改公司成功');
          closeDialog();
          handleQuery();
        });
      } else {
        createCompany(state.formData).then(() => {
          ElMessage.success('新增公司成功');
          closeDialog();
          handleQuery();
        });
      }
    }
  });
}

/**
 * 删除公司
 */
function handleDelete(row: { [key: string]: any }) {
  const userIds = row.id || state.ids.join(',');
  ElMessageBox.confirm(
    '是否确认删除公司编号为「' + userIds + '」的数据项?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button-primary',
      cancelButtonClass: 'el-button-origin',
      type: 'warning'
    }
  )
    .then(function () {
      deleteCompany(userIds).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

/**
 * 关闭公司弹窗
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
  citylist.value = [];
  getUserArea().then((response: any) => {
    citylist.value = response.data;
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

const citylist = ref([]) as any;
const restaurants = ref([]) as any;
/**
 * 获取性别下拉项
 */
function getGenderOptions(query: any) {
  searchCompany({ company: query }).then((response: any) => {
    restaurants.value = response?.data;
  });
}

onMounted(() => {
  getDeptOptions(userStore.$state.province);
  // 初始化公司列表数据
  handleQuery();
});
</script>

