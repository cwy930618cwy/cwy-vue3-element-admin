<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!-- 用户数据 -->
      <el-col :span="24" :xs="24">
        <div class="search">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="公司名称" prop="company">
              <el-select v-model="queryParams.company" style="width: 180px;" filterable clearable remote reserve-keyword placeholder="请输入关键词" @blur="selectBlur" @clear="selectClear" @change="selectChange" :remote-method="getGenderOptions">
                <el-option v-for="item in restaurants" :key="item.unitName" :label="item.unitName" :value="item.unitName">
                </el-option>
              </el-select>

            </el-form-item>

            <el-form-item label="手机号" prop="phoneNumber">
              <el-input v-model="queryParams.phoneNumber" placeholder="请输入手机号" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item>
              <el-button color="#7263CE" :icon="Search" @click="handleQuery">搜索</el-button>
              <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <el-table v-loading="loading" :data="userList">
            <el-table-column label="姓名" show-overflow-tooltip align="center" prop="userName" />
            <el-table-column label="所属公司名称" show-overflow-tooltip align="center" prop="company" />
            <el-table-column label="手机号" align="center" prop="phoneNumber" />
            <el-table-column label="职务" align="center" prop="companyPost" />
            <el-table-column label="申请时间" align="center" prop="createTime">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.createTime) === 0 ? '-' : proxy.$filters.formatTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="跟进人" align="center" prop="followName" />
            <el-table-column label="跟进时间" align="center" prop="handleTime">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.handleTime) === 0 ? '-' : proxy.$filters.formatTime(scope.row.handleTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" show-overflow-tooltip align="center" prop="desc" />

            <el-table-column label="操作" align="left" fixed="right" width="100">
              <template #default="scope">
                <el-button type="primary" v-if="!scope.row.states" link @click="handleUpdate(scope.row)">跟进</el-button>
                <span v-else>已跟进</span>
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
        <el-form-item label="备注" prop="desc">
          <el-input v-model="formData.desc" placeholder="请输入备注" maxlength="50" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
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
  toRefs
} from 'vue';
import { getAreaJson } from '@/constant/area.js';

// api
import { fetchList, updateApply } from '@/api/apply';
import { listDeptOptions } from '@/api/dept';
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
import { searchCompany } from '@/api/company';

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
  deptName: undefined,
  // 部门下拉项
  deptOptions: [] as any,
  // 性别下拉项
  genderOptions: [] as any,
  // 角色下拉项
  roleOptions: [] as any,
  formData: {
    states: 1
  } as any,
  queryParams: {
    companyName: '',
    phoneNumber: '',
    pageNumber: 1,
    pageSize: 10
  } as any,
  rules: {
    desc: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
  },

  importDialog: {
    title: '用户导入',
    visible: false
  } as any,
  importFormData: {} as UserImportData,
  excelFile: undefined as any,
  excelFilelist: [] as File[]
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
  excelFilelist
} = toRefs(state);

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

/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  fetchList(state.queryParams).then(({ data }) => {
    state.userList = data.list;
    state.total = data.totalSize;
    state.loading = false;
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
 * 添加用户
 **/
async function handleAdd() {
  state.dialog = {
    title: '添加企业',
    visible: true
  };
  await getRoleOptions();
}

/**
 * 修改用户
 **/
async function handleUpdate(row: { [key: string]: any }) {
  dialog.value = {
    title: '跟进账号',
    visible: true
  };

  // await getDeptOptions();
  await getRoleOptions();
  // getUserForm(userId).then(({ data }) => {
  //   formData.value = data;
  // });

  const data = {
    applyNo: row.id,
    desc: row.desc
  };
  formData.value = data;
}

/**
 * 表单提交
 */
function submitForm() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      updateApply({
        potentId: state.formData.applyNo,
        remarks: state.formData.desc,
        states: 1
      }).then(() => {
        ElMessage.success('修改用户成功');
        closeDialog();
        handleQuery();
      });
    }
  });
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
  citylist.value = getAreaJson();
  // 初始化用户列表数据
  handleQuery();
});
</script>

