<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!-- 用户数据 -->
      <el-col :span="24" :xs="24">
        <div class="search">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="queryParams.companyName" placeholder="请输入公司名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item label="账号/手机号" prop="keywords">
              <el-input v-model="queryParams.keywords" placeholder="请输入公司名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item label="只看可用账号" prop="status">
              <el-switch v-model="queryParams.status" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
              <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="success" :icon="Plus" @click="handleAllAdd">批量启用</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="success" :icon="Plus" @click="handleAllDisable">批量禁用</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="success" :icon="Plus" @click="handleAdd" v-hasPerm="['sys:user:add']">新增</el-button>
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
            <el-table-column label="账号" align="center" prop="accountUser" />
            <el-table-column label="姓名" width="120" align="center" prop="accountName" />
            <el-table-column label="近七日总DAU" width="120" align="center" prop="accountDAU" />
            <el-table-column label="用户角色" width="120" align="center" prop="accountRole" />
            <el-table-column label="所属公司名称" width="120" align="center" prop="accountCompany" />
            <el-table-column label="手机号" width="120" align="center" prop="accountPhone" />

            <el-table-column label="地区权限" align="center" prop="accountPermission" width="120" />
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <el-switch v-model="scope.row.status" :inactive-value="0" :active-value="1" @change="handleStatusChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="gmtCreate" width="180">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.gmtCreate) === 0 ? '-' : proxy.$filters.formatTime(scope.row.gmtCreate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateCreate" width="180">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.updateCreate) === 0 ? '-' : proxy.$filters.formatTime(scope.row.updateCreate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left" width="200">
              <template #default="scope">
                <el-button type="primary" link @click="handleUpdate(scope.row)">编辑</el-button>
                <el-button type="danger" link @click="handleDelete(scope.row)">禁用</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户表单 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body @close="closeDialog">
      <el-form ref="dataFormRef" label-position="top" height="250" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="所属公司名称" prop="accountCompany">
          <el-input v-model="formData.accountCompany" placeholder="请输入所属公司名称" />
        </el-form-item>
        <el-form-item label="用户类型" prop="accountType">
          <el-radio-group v-model="formData.accountType">
            <el-radio :label="0" size="large">企业管理员</el-radio>
            <el-radio :label="1" size="large">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" prop="accountUser">
          <el-input v-model="formData.accountUser" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="accountPassword">
          <el-input v-model="formData.accountPassword" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="姓名" prop="accountName">
          <el-input v-model="formData.accountName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="地区权限" prop="companyPermision">
          <el-select v-model="formData.companyPermision" filterable placeholder="请选择">
            <el-option v-for="item in citylist" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="定制数据包" prop="dingzhidata">
          <el-checkbox-group v-model="formData.dingzhidata">
            <el-checkbox v-for="item in roleOptions" :key="item.value" :label="item.value">
              {{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="手机号" prop="accountPhone">
          <el-input v-model="formData.accountPhone" placeholder="请输入手机号" maxlength="50" />
        </el-form-item>
        <el-form-item label="备注" prop="accountRemark">
          <el-input v-model="formData.accountRemark" placeholder="请输入备注" maxlength="50" />
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
import {
  fetchList,
  // detailAccount,
  createAccount,
  updateAccount,
  deleteAccount
  // updateUserStatus,
  // updateUserPassword
} from '@/api/account';
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

import { useRouter } from 'vue-router';
const router = useRouter();

const queryFormRef = ref(ElForm); // 查询表单
const dataFormRef = ref(ElForm); // 用户表单
const importFormRef = ref(ElForm); // 导入表单

const { proxy }: any = getCurrentInstance();

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
    status: 1
  } as any,
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as any,
  rules: {
    accountCompany: [
      { required: true, message: '所属公司名称不能为空', trigger: 'blur' }
    ],
    accountType: [
      { required: true, message: '用户类型不能为空', trigger: 'change' }
    ],
    accountUser: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
    accountPassword: [
      { required: true, message: '密码不能为空', trigger: 'blur' }
    ],
    accountName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    companyPermision: [
      { required: true, message: '地区权限不能为空', trigger: 'change' }
    ],
    dingzhidata: [
      { required: true, message: '定制数据包不能为空', trigger: 'change' }
    ],
    accountPhone: [
      { required: true, message: '手机号不能为空', trigger: 'blur' }
    ],
    accountRemark: [
      { required: true, message: '备注不能为空', trigger: 'blur' }
    ]
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
 * 用户状态change
 */
function handleStatusChange(row: { [key: string]: any }) {
  const text = row.status === 1 ? '启用' : '停用';
  ElMessageBox.confirm(
    '确认要' + text + '' + row.companyName + '用户吗?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // return updateUserStatus(row.companyNo, row.status);
    })
    .then(() => {
      ElMessage.success(text + '成功');
    })
    .catch(() => {
      row.status = row.status === 1 ? 0 : 1;
    });
}

/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  console.log('nininini');
  fetchList(state.queryParams).then(({ data }) => {
    //     账号: accountUser
    // 姓名: accountName
    // 近七日总DAU: accountDAU
    // 用户角色: accountRole
    // 所属公司名称: accountCompany
    // 手机号：accountPhone
    // 地区权限: accountPermission
    // 状态: status
    // 创建时间： gmtCreate
    //     更新时间： updateCreate

    state.userList = [
      {
        accountNo: 1,
        accountUser: 'key',
        accountName: '张三律师所',
        accountDAU: 1111,
        accountRole: '超级管理员',
        accountCompany: '百度',
        accountPhone: 13181633622,
        accountPermission: '北京',
        status: 0,
        gmtCreate: 1677827685000,
        updateCreate: 1677827685000
      },
      {
        accountNo: 2,
        accountUser: 'key2',
        accountName: '张三律师所2',
        accountDAU: 1111,
        accountRole: '超级管理员',
        accountCompany: '百度',
        accountPhone: 13181633622,
        accountPermission: '北京',
        status: 0,
        gmtCreate: 1677827685000,
        updateCreate: 1677827685000
      }
    ];
    // state.userList = data.list;
    state.total = data.total;
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
  console.log('selection----', selection);
  state.ids = selection.map((item: any) => item.accountNo);
}

/**
 * 批量启用
 */
function handleAllAdd() {
  console.log('state.ids---', state.ids);
  console.log('掉接口-------');
  // state.ids = selection.map((item: any) => item.accountNo);
  // toggleSelection(userList.value);
}

/**
 * 批量禁用
 */
function handleAllDisable(selection: any) {
  console.log('state.ids---', state.ids);
  console.log('掉接口-------');
  // state.ids = [];
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

/**
 * 添加用户
 **/
async function handleAdd() {
  state.dialog = {
    title: '添加企业',
    visible: true
  };
  await getDeptOptions();
  await getRoleOptions();
}

/**
 * 修改用户
 **/
async function handleUpdate(row: { [key: string]: any }) {
  dialog.value = {
    title: '修改企业',
    visible: true
  };

  const userId = row.id || state.ids;
  // await getDeptOptions();
  await getRoleOptions();
  // detailAccount(userId).then(({ data }) => {
  //   formData.value = data;
  // });

  const data = {
    accountNo: 111,
    accountCompany: '百度',
    accountType: 0,
    accountUser: 'key',
    accountPassword: 123456,
    accountName: '张三',
    companyPermision: '北京',
    dingzhidata: ['0'],
    accountPhone: 131816333,
    accountRemark: '备注'
  };
  formData.value = data;
}

/**
 * 表单提交
 */
function submitForm() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = state.formData.id;
      if (userId) {
        updateAccount(userId).then(() => {
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
async function getDeptOptions() {
  listDeptOptions().then(response => {
    state.deptOptions = response.data;
  });
}

/**
 * 获取性别下拉项
 */
function getGenderOptions() {
  proxy.$getDictionaries('gender').then((response: any) => {
    state.genderOptions = response?.data;
  });
}

/**
 * 导入弹窗
 */
async function showImportDialog() {
  await getDeptOptions();
  await getRoleOptions();
  importDialog.value.visible = true;
}

/**
 * Excel文件change事件
 *
 * @param file
 */
function handleExcelChange(file: UploadFile) {
  if (!/\.(xlsx|xls|XLSX|XLS)$/.test(file.name)) {
    ElMessage.warning('上传Excel只能为xlsx、xls格式');
    state.excelFile = undefined;
    state.excelFilelist = [];
    return false;
  }
  state.excelFile = file.raw;
}

const citylist = ref([]) as any;

onMounted(() => {
  citylist.value = getAreaJson();

  // contentId.value = router.currentRoute.value.query;

  // queryParams.companyName = router.currentRoute.value.query.companyName;

  queryParams.value.companyName = router.currentRoute.value.query.companyName
    ? router.currentRoute.value.query.companyName
    : '';

  handleQuery();

  // 初始化性别字典
  getGenderOptions();
  // 初始化部门
  getDeptOptions();
  // 初始化用户列表数据
  handleQuery();
});
</script>

