<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!-- 用户数据 -->
      <el-col :span="24" :xs="24">
        <div class="search">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="公司名称" prop="keywords">
              <el-input v-model="queryParams.keywords" placeholder="请输入公司名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item label="只看可用公司" prop="status">
              <el-switch v-model="queryParams.status" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
              <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="success" :icon="Plus" @click="handleAdd" v-hasPerm="['sys:user:add']">新增</el-button>
            </el-form-item>
          </el-form>

        </div>

        <el-card shadow="never">
          <el-table v-loading="loading" :data="userList">
            <el-table-column label="公司名称" align="center" prop="companyName">
              <template #default="scope">
                <span style="color: #409eff;cursor: pointer;" @click="resetPassword(scope.row)">{{ scope.row.companyName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="近七日DAU" width="120" align="center" prop="companyDAU" />

            <el-table-column label="可用账号数/授权账号数" width="100" align="center" prop="keyonguser">
              <template #default="scope">
                {{ scope.row.keyonguser }}/{{ scope.row.souquanuser }}
              </template>
            </el-table-column>

            <el-table-column label="公司联系人/公司联系电话" width="120" align="center" prop="companyPeople">
              <template #default="scope">
                {{ scope.row.companyPeople }}/{{ scope.row.companyPhone }}
              </template>
            </el-table-column>

            <el-table-column label="地区权限" align="center" prop="companyPermision" width="120" />
            <el-table-column label="失效日期" sortable align="center" prop="failDate" width="120">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.failDate) === 0 ? '-' : proxy.$filters.formatTime(scope.row.failDate) }}</span>
                <el-tag class="ml-2" type="danger">剩余7天</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <el-switch v-model="scope.row.status" :inactive-value="0" :active-value="1" @change="handleStatusChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" sortable align="center" prop="gmtCreate" width="180">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.gmtCreate) === 0 ? '-' : proxy.$filters.formatTime(scope.row.gmtCreate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" sortable align="center" prop="updateCreate" width="180">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.updateCreate) === 0 ? '-' : proxy.$filters.formatTime(scope.row.updateCreate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left" width="200">
              <template #default="scope">
                <el-button type="success" link @click="resetPassword(scope.row)">进入</el-button>
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
        <el-form-item label="公司类型" prop="companyType">
          <el-radio-group v-model="formData.companyType">
            <el-radio :label="0" size="large">合作公司</el-radio>
            <el-radio :label="1" size="large">试用公司</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="formData.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="地区权限" prop="companyPermision">
          <el-select v-model="formData.companyPermision" filterable placeholder="请选择">
            <el-option v-for="item in citylist" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="授权账号数" prop="souquanuser">
          <el-input v-model="formData.souquanuser" placeholder="请输入授权账号数" maxlength="11" />
        </el-form-item>
        <el-form-item label="失效日期" prop="failDate">
          <el-date-picker v-model="formData.failDate" type="date" placeholder="请输入失效日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="定制数据包" prop="dingzhidata">
          <el-checkbox-group v-model="formData.dingzhidata">
            <el-checkbox v-for="item in roleOptions" :key="item.value" :label="item.value">
              {{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="公司联系人" prop="companyPeople">
          <el-input v-model="formData.companyPeople" placeholder="请输入公司联系人" maxlength="50" />
        </el-form-item>
        <el-form-item label="公司联系电话" prop="companyPhone">
          <el-input v-model="formData.companyPhone" placeholder="请输入公司联系电话" maxlength="50" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- import dialog -->
    <el-dialog :title="importDialog.title" v-model="importDialog.visible" width="600px" append-to-body @close="closeImportDialog">
      <el-form ref="importFormRef" :model="importFormData" :rules="rules" label-width="80px">
        <el-form-item label="部门" prop="deptId">
          <el-tree-select v-model="importFormData.deptId" placeholder="请选择部门" :data="deptOptions" filterable check-strictly />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="importFormData.roleIds" multiple placeholder="请选择">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="Excel">
          <el-upload class="upload-demo" action="" drag :auto-upload="false" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :file-list="excelFilelist" :on-change="handleExcelChange" :limit="1">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">xls/xlsx files</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitImportForm">确 定</el-button>
          <el-button @click="closeImportDialog">取 消</el-button>
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
  listUserPages,
  getUserForm,
  deleteUsers,
  addUser,
  updateUser,
  updateUserStatus,
  updateUserPassword,
  downloadTemplate,
  exportUser,
  importUser
} from '@/api/user';
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

import router from '@/router';

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
  } as UserQuery,
  rules: {
    //     公司类型: companyType
    // 公司名称: companyName
    // 地区权限: companyPermision
    // 授权账号数: souquanuser
    // 失效日期：failDate
    // 定制数据包：dingzhidata
    // 公司联系人: companyPeople
    // 公司联系电话: companyPhone

    companyType: [
      { required: true, message: '公司类型不能为空', trigger: 'change' }
    ],
    companyName: [
      { required: true, message: '公司名称不能为空', trigger: 'blur' }
    ],
    companyPermision: [
      { required: true, message: '地区权限不能为空', trigger: 'change' }
    ],
    souquanuser: [
      { required: true, message: '授权账号数不能为空', trigger: 'blur' }
    ],
    failDate: [
      { required: true, message: '失效日期不能为空', trigger: 'blur' }
    ],
    dingzhidata: [
      { required: true, message: '定制数据包不能为空', trigger: 'change' }
    ],
    companyPeople: [
      { required: true, message: '公司联系人不能为空', trigger: 'blur' }
    ],
    companyPhone: [
      { required: true, message: '公司联系电话不能为空', trigger: 'blur' }
    ]
  },

  importDialog: {
    title: '用户导入',
    visible: false
  } as DialogType,
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
      return updateUserStatus(row.companyNo, row.status);
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
  listUserPages(state.queryParams).then(({ data }) => {
    state.userList = [
      {
        companyName: '张三律师所',
        companyDAU: 1111,
        keyonguser: 10,
        souquanuser: 20,
        companyPeople: '张三',
        companyPhone: 13181633622,
        companyPermision: '北京',
        failDate: 1677827685000,
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
  state.ids = selection.map((item: any) => item.id);
}

/**
 * 进入
 */
function resetPassword(row: { [key: string]: any }) {
  router.push({
    path: '/system/account',
    query: { companyName: row.companyName }
  });
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
  // getUserForm(userId).then(({ data }) => {
  //   formData.value = data;
  // });

  const data = {
    companyNo: 111,
    companyType: 0,
    companyName: '公司1',
    companyPermision: '北京',
    souquanuser: 20,
    failDate: 1677060227000,
    dingzhidata: ['0'],
    companyPeople: 'zhangsan',
    companyPhone: 131816333
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
        updateUser(userId, state.formData).then(() => {
          ElMessage.success('修改用户成功');
          closeDialog();
          handleQuery();
        });
      } else {
        addUser(state.formData).then(() => {
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
      deleteUsers(userIds).then(() => {
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
 * 下载导入模板
 */
function handleDownloadTemplate() {
  downloadTemplate().then((response: any) => {
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    });
    const a = document.createElement('a');
    const href = window.URL.createObjectURL(blob); // 下载链接
    a.href = href;
    a.download = decodeURI(
      response.headers['content-disposition'].split(';')[1].split('=')[1]
    ); // 获取后台设置的文件名称
    document.body.appendChild(a);
    a.click(); // 点击下载
    document.body.removeChild(a); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
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

/**
 * Excel文件上传
 */
function submitImportForm() {
  importFormRef.value.validate((valid: any) => {
    if (valid) {
      if (!state.excelFile) {
        ElMessage.warning('上传Excel文件不能为空');
        return false;
      }

      const deptId = state.importFormData.deptId;
      const roleIds = state.importFormData.roleIds.join(',');
      importUser(deptId, roleIds, state.excelFile).then(response => {
        ElMessage.success(response.data);
        closeImportDialog();
        handleQuery();
      });
    }
  });
}

/**
 * 关闭导入弹窗
 */
function closeImportDialog() {
  state.importDialog.visible = false;
  state.excelFile = undefined;
  state.excelFilelist = [];
  importFormRef.value.resetFields();
}

/**
 * 导出用户
 */
function handleExport() {
  exportUser(queryParams.value).then((response: any) => {
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    });
    const a = document.createElement('a');
    const href = window.URL.createObjectURL(blob); // 下载的链接
    a.href = href;
    a.download = decodeURI(
      response.headers['content-disposition'].split(';')[1].split('=')[1]
    ); // 获取后台设置的文件名称
    document.body.appendChild(a);
    a.click(); // 点击导出
    document.body.removeChild(a); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  });
}

const citylist = ref([]) as any;

onMounted(() => {
  citylist.value = getAreaJson();
  // 初始化性别字典
  getGenderOptions();
  // 初始化部门
  getDeptOptions();
  // 初始化用户列表数据
  handleQuery();
});
</script>

