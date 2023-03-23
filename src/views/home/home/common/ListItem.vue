<template>
  <div class="list-item" v-loading.fullscreen="exportLoading" element-loading-text="正在导出中...">
    <div class="filter-hd fr_c fj_sb">
      <div class="hd-left fr_c">
        <div class="fr_c" style="min-width: 180px">
          <div class="fs_0 fr_c">
            <el-checkbox v-model="checkedValueAll" @change="handleChangeCheckboxAll" class="left-checkbox" />
            <span class="checkbox-all">全选</span>
            <span class="left-content">
              <span v-show="checkedValueList.length">
                （已选<span class="content-num">{{ checkedValueList.length }}</span>个）
              </span>
            </span>
          </div>
          <div class="left-content fr_c">
            共
            <img src="@/assets/img/loading.gif" class="loading-p" v-if="page.loading" />
            <span class="content-num" v-if="!page.loading">{{ page.total }}</span> 条数据，
            为您找到
            <span class="content-num" v-if="!page.loading">{{ page.total }}</span> 个联系方式
          </div>
        </div>
        <!-- <el-radio-group class="filter-sort" v-model="filter.sort.value" @change="changeSort" size="mini">
          <el-radio-button :label="item.id" v-for="item in filter.sort.options" :key="item.id">
            {{ item.name }}
          </el-radio-button>
        </el-radio-group> -->
      </div>
      <div class="fr">
        <div class="right-btn" @click="handleBatchThe">勾选导出</div>
        <el-popover placement="top-start" :width="400" trigger="hover" :disabled="page.total < 10000" content="全部导出仅支持导出10000条数据，请修改筛选条件">
          <template #reference>
            <div class="right-btn fr_c" :class="{ 'right-btn-dis': page.total > 10000 }" @click="handleBatchUnlock">
              批量导出
            </div>
          </template>
        </el-popover>
      </div>
    </div>

    <div v-loading="page.loading" element-loading-text="加载中..." style="min-height: 400px">
      <div v-show="page.list.length">
        <!--  数据列表  -->
        <ItemCompany ref="ItemCompany" :itemList="page.list" @checked="checkedItem" />
        <div class="pagination-table fr_c fj_fe">
          <el-pagination small background layout="prev,pager,next,jumper" :current-page="page.pageNo" :page-sizes="[10, 20, 40]" :page-size="page.size" :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
      <NoData ref="NoData" v-show="!page.loading && !page.list.length"> </NoData>
    </div>
    <div>
      <el-dialog v-model="dialog.show" width="25%">
        <span>{{ dialog.msg }}</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialog.show = false">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ItemCompany from "./ItemCompany.vue";
import NoData from "./NoData.vue";
// import { exportApi } from "@/http/api";
import { exprotExcal } from "@/utils/shared";
import dayjs from "dayjs";

export default {
  name: "FilterListHead",
  components: { ItemCompany, NoData },
  inject: ["pro_setParams", "pro_paramsPost"],
  data() {
    return {
      filter: {
        sort: {
          options: [
            { id: 1, name: "综合排序" },
            { id: 2, name: "时间排序" },
          ],
          value: 1,
        },
      },
      page: {
        pageNo: 1,
        size: 10,
        total: 0,
        loading: false,
        list: [],
        keywords: "",
      },
      checkedValueAll: false,
      checkedValueList: [],
      switchUnlock: false,
      isFocus: false,
      dialog: {
        show: false,
        msg: "",
      },
      exportLoading: false,
    };
  },

  computed: {},
  watch: {},
  methods: {
    async handleBatchThe() {
      if (!this.checkedValueList.length) {
        this.$message({
          duration: 1000,
          showClose: true,
          type: "warning",
          offset: 200,
          message: "请选择数据！",
        });
        return;
      }
      this.selectDownLoad();
    },
    //批量导出
    handleBatchUnlock() {
      if (this.page.total === 0) {
        this.$message({
          duration: 1000,
          showClose: true,
          type: "warning",
          offset: 200,
          message: "没有可导出的数据！",
        });
        return;
      }
      if (this.page.total > 10000) {
        return;
      }
      this.exportLoading = true;
      // exportApi.checkDownLoad({ ...this.pro_paramsPost(), check: false, totalRecord: this.page.total }, {}).then(() => {
      //     exportApi
      //       .checkDownLoad(
      //         {
      //           ...this.pro_paramsPost(),
      //           totalRecord: this.page.total,
      //           check: true,
      //         },
      //         { responseType: "blob" }
      //       )
      //       .then(() => { })
      //       .catch((error) => {
      //         exprotExcal("数据导出表" + dayjs().format("YYYY-MM-DD"), error);
      //       })
      //       .finally(() => {
      //         this.exportLoading = false;
      //       });
      //   })
      //   .catch((err) => {
      //     this.exportLoading = false;
      //     this.$message({
      //       duration: 1000,
      //       showClose: true,
      //       type: "error",
      //       message: err.msg || "服务异常！",
      //     });
      //   });

    },
    // 全选逻辑
    handleChangeCheckboxAll(e) {
      this.$refs.ItemCompany.initCheckbox(this.page.list, e);
    },
    // 处理单个选择逻辑
    checkedItem(isCheckedAll, checkedAll) {
      this.checkedValueAll = isCheckedAll;
      this.checkedValueList = checkedAll;
    },
    changeSort() {
      this.page.pageNo = 1;
      this.emitChange();
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.page.pageNo = 1;
      this.emitChange();
    },
    handleCurrentChange(val) {
      if (val > 500) {
        this.dialog.show = true;
        this.dialog.msg = "仅为您展示前5000条，可通过细化检索条件来查看更多内容哦！";
        return;
      }
      this.page.pageNo = val;
      this.emitChange();
    },
    changeFilterCompanyInfo(value) {
      this.emitChange();
    },
    emitChange(noEventTig) {
      const params = {
        refNameRoot: this.$options.name,
        data: {
          pageNo: this.page.pageNo,
          pageSize: this.page.size,
          sort: this.filter.sort.value,
        },
        noEventTig,
      };
      this.pro_setParams(params);
    },
    selectDownLoad() {
      const contentIds = this.checkedValueList.map((r) => r.contentId).join(",");
      exportApi
        .selectDownLoad({ check: false, contentIds }, {})
        .then((res) => {
          exportApi
            .selectDownLoad(
              {
                check: true,
                contentIds,
              },
              { responseType: "blob" }
            )
            .then(() => { })
            .catch((error) => {
              exprotExcal("数据导出表" + dayjs().format("YYYY-MM-DD"), error);
            });
        })
        .catch((err) => {
          this.$message({
            duration: 1000,
            showClose: true,
            type: "error",
            message: err.msg || "服务异常！",
          });
        });
    },
    empty(type, msg) {
      // this.$refs.NoData.empty(type, msg);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-button {
  height: 28px;
  color: #df6250;
  border-color: #df6250;
}
.el-button:focus,
.el-button:hover {
  background-color: #fff;
  border-color: #df6250;
}
.el-radio-button__inner {
  font-size: 12px;
}
.el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #df6250;
  background-color: #fff;
}
.el-pagination {
  .number {
    margin: 0 4px;
    border: 1px solid #dddddd;
    border-radius: 4px;
    line-height: 26px;
    min-width: 32px;
    font-size: 14px;
    font-weight: 400;
    overflow: hidden;
    color: #999;
    &:hover {
      color: #df6250;
    }
  }
  // .el-pager li.is-active + li {
  //     border: 1px solid #dddddd;
  // }
  .el-pager li.is-active {
    border-color: #df6250;
    color: #df6250;
  }
}
</style>
<style scoped lang="scss">
.list-item {
  // margin-top: 20px;
  padding: 0 24px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 5%);
  .filter-hd {
    padding: 12px 0;
    border-bottom: 1px solid #e9e9e9;
    .hd-left {
      .checkbox-all {
        padding-right: 4px;
        padding-left: 16px;
        font-weight: 700;
        font-size: 16px;
        color: #333;
      }
      .left-content {
        font-size: 12px;
        color: #333333;
        .content-num {
          color: #e64a00;
          font-weight: 550;
        }
        .loading-p {
          width: 24px;
          height: 24px;
          margin: 0 6px;
        }
      }
    }
    .filter-sort {
      margin-left: 24px;
    }
  }
  .right-btn {
    margin-left: 10px;
    padding: 4px 16px;
    font-size: 12px;
    border-radius: 4px;
    font-weight: 400;
    border: 1px solid #df6250;
    background: #fff;
    color: #df6250;
    &:hover {
      cursor: pointer;
      background-color: #df6250;
      color: #fff;
    }
    &-dis {
      color: #fff;
      background: #d9d9d9;
      border-color: #d9d9d9;
      &:hover {
        cursor: not-allowed;
        color: #fff;
        background: #d9d9d9;
        border-color: #d9d9d9;
      }
    }
  }
  .pagination-table {
    padding: 20px;
    :deep {
      .el-pagination {
        .el-pagination__sizes {
          margin-left: 24px;
        }
      }
    }
  }
}
</style>
