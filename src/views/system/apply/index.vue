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

            <el-form-item label="手机号" prop="keywords">
              <el-input v-model="queryParams.keywords" placeholder="请输入手机号" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
              <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <el-table v-loading="loading" :data="userList">
            <el-table-column label="姓名" width="120" align="center" prop="applyName" />
            <el-table-column label="所属公司名称" width="120" align="center" prop="applyCompany" />
            <el-table-column label="手机号" width="120" align="center" prop="applyPhone" />
            <el-table-column label="职务" width="120" align="center" prop="applyPosition" />
            <el-table-column label="申请时间" align="center" prop="applyCreate" width="180">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.applyCreate) === 0 ? '-' : proxy.$filters.formatTime(scope.row.applyCreate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="跟进人" width="120" align="center" prop="applyPeople" />
            <el-table-column label="跟进时间" align="center" prop="gmtCreate" width="180">
              <template #default="scope">
                <span>{{ proxy.$filters.formatTime(scope.row.gmtCreate) === 0 ? '-' : proxy.$filters.formatTime(scope.row.gmtCreate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="120" align="center" prop="remark" />

            <el-table-column label="操作" align="left" width="200">
              <template #default="scope">
                <el-button type="primary" link @click="handleUpdate(scope.row)">跟进</el-button>
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
        <el-form-item label="备注" prop="applyRemark">
          <el-input v-model="formData.applyRemark" placeholder="请输入备注" maxlength="50" />
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
    applyRemark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
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
        applyName: '张三律师所',
        applyCompany: '百度',
        applyPhone: 13181633622,
        applyPosition: '销售',
        applyCreate: 1677827685000,
        applyPeople: '李某',
        gmtCreate: 1677827685000,
        remark: '备注',
        status: 0
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
      updateUserPassword(row.id, value).then(() => {
        ElMessage.success('密码重置成功，新密码是：' + value);
      });
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
    title: '跟进账号',
    visible: true
  };

  const userId = row.id || state.ids;
  // await getDeptOptions();
  await getRoleOptions();
  // getUserForm(userId).then(({ data }) => {
  //   formData.value = data;
  // });

  const data = {
    applyNo: 111,
    applyRemark: '备注'
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

