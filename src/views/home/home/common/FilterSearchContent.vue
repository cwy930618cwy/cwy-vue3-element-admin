<template>
  <div class="FilterKeywordRelated fr_c" v-loading.fullscreen="exportLoading" element-loading-text="正在加载中...">
    <el-popover placement="top-start" :width="400" title="" trigger="hover" content="谨慎使用，建议关键词数量≤100，否则系统会有宕机风险">
      <template #reference><img class="key-tip" src="@/assets/img/icon-success-fill.png" alt="" /> </template>
    </el-popover>
    <div class="fs_0">搜索内容</div>
    <div class="fr_c key-content">
      <div class="key-button key-button-ch fs_0" @click="clickBtn">上传</div>
      <span>此处可批量上传手机号码、招标单位、中标单位等信息用于检索</span>
    </div>
    <div>
      <el-dialog v-model="dialog.show" title="上传" width="30%" :close-on-click-modal="false" destroy-on-close>
        <span>{{ dialog.msg }}</span>
        <div class="tip-content">
          <el-popover placement="top-start" :width="400" title="使用提示：" trigger="hover" content="上传模式下，excel单行检索词，检索结果大于1万条或所有行搜索结果总条数大于100万条时，整个检索将终止，建议减少搜索词，多次检索。">
            <template #reference><img class="key-tip" src="@/assets/img/icon-success-fill.png" alt="" />
            </template> </el-popover><span>上传模式下只支持<b>精准</b>搜索！</span>
        </div>
        <div>
          <el-upload v-model:file-list="fileList" :action="BaseUrl" :on-progress="onProgress" :on-success="handleSuccess" :on-error="handleError" :limit="1">
            <el-button size="mini">
              上传文件 <el-icon>
                <Upload />
              </el-icon>
            </el-button>
          </el-upload>
          <a class="down-a" @click="exportTemplate">
            导出模板.excel <el-icon>
              <Download />
            </el-icon>
          </a>
        </div>
        <template #footer>
          <div class="dialog-footer fr_c fj_fe">
            <div class="button-cancel" @click="dialog.show = false">取消</div>
            <div class="button-confirm" :class="{ 'button-confirm-ch': checked }" @click="handelConfirm">
              确认
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import { exportApi } from "@/http/api";
import { exprotExcal } from "@/utils/shared";

const BaseUrl = process.env.VUE_APP_API_BASE + "/v1/export/fileAnalysis";

export default {
  name: "FilterSearchContent",
  props: {},
  components: {},
  inject: ["pro_setParams"],
  data() {
    return {
      list: ["", "", ""],
      keywords: "",
      dialog: {
        show: false,
        msg: "",
      },
      fileList: [],
      BaseUrl,
      exportLoading: false,
    };
  },
  computed: {
    checked() {
      return this.fileList.length;
    },
  },
  watch: {
    "dialog.show"(neVal) {
      this.fileList = [];
    },
  },
  methods: {
    clear() {
      this.fileList = [];
      this.emitChange("");
    },
    clickBtn() {
      this.dialog.show = true;
    },
    handelConfirm() {
      if (this.checked) {
        this.emitChange(this.fileList[0].response.data);
        this.dialog.show = false;
      }
    },
    handleSuccess(res) {
      if (res.code !== "200") {
        this.$message({
          duration: 4000,
          showClose: true,
          type: "error",
          offset: 80,
          message: res.msg,
        });
      }
      this.exportLoading = false;
    },
    handleError(res) {
      this.exportLoading = false;
      this.$message({
        duration: 1000,
        showClose: true,
        type: "error",
        offset: 80,
        message: "上传失败！",
      });
    },
    onProgress() {
      this.exportLoading = true;
    },
    exportTemplate() {
      this.exportLoading = true;
      // exportApi
      //   .downloadTemplate()
      //   .then(() => { })
      //   .catch((error) => {
      //     exprotExcal("搜索关键词导入模板", error);
      //   })
      //   .finally(() => {
      //     this.exportLoading = false;
      //   });
    },
    emitChange(op) {
      const params = {
        refNameRoot: this.$options.name,
        data: {
          dataCurrent: op,
          leave1: [op],
          leave2: [],
        },
        echoText: op ? this.fileList[0].name : "",
      };
      this.pro_setParams(params);
    },
  },
  mounted() { },
};
</script>

<style scoped lang="scss">
.down-a {
  color: rgb(64, 158, 255);
  cursor: pointer;
  display: block;
  margin-top: 10px;
  text-decoration: underline;
  .el-icon {
    vertical-align: middle;
  }
}
.FilterKeywordRelated {
  padding-top: 16px;
  .key-tip {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 4px;
    cursor: pointer;
  }
  .key-ps {
    padding: 0 12px;
  }
  .key-button {
    margin-left: 12px;
    padding: 2px 15px;
    border-radius: 20px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background: #d9d9d9;
    &-ch {
      border: 1px solid #7263ce;
      color: #7263ce;
      background-color: #fff;
    }
    &:hover {
      cursor: pointer;
      background-color: #7263ce;
      color: #fff;
    }
  }
  .key-content {
    padding-left: 10px;
    :deep {
      .el-input {
        width: 128px;
        .el-input__wrapper {
          border-radius: 14px;
          .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }
      }
    }
    span {
      font-size: 12px;
      color: #7263ce;
      padding-left: 10px;
    }
  }
  .button-up {
    border-color: #92e498;
    color: #92e498;
  }
  .button-dow {
    border-color: #fbbd65;
    color: #fbbd65;
  }
  .dialog-footer {
    .button-cancel {
      margin-left: 12px;
      padding: 2px 15px;
      border-radius: 20px;
      text-align: center;
      font-size: 14px;
      border: 1px solid #7263ce;
      color: #7263ce;
      background-color: #fff;
      &:hover {
        cursor: pointer;
        background-color: #7263ce;
        color: #fff;
      }
    }
    .button-confirm {
      margin-left: 12px;
      padding: 2px 15px;
      border-radius: 20px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      background: #d9d9d9;
      border: 1px solid #d9d9d9;
      &:hover {
        cursor: not-allowed;
      }
      &-ch {
        border: 1px solid #7263ce;
        color: #7263ce;
        background-color: #fff;
        &:hover {
          cursor: pointer;
          background-color: #7263ce;
          color: #fff;
        }
      }
    }
  }
}
.tip-content {
  display: flex;
  font-size: 12px;
  color: #7263ce;
  padding-bottom: 10px;
  b {
    font-weight: bold;
    padding: 0 5px;
  }
  span {
    display: block;
    margin-top: -2px;
  }
}
</style>
