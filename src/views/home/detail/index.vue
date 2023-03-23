<style lang="scss" scope>
.body-title {
  line-height: 32px;
  background: #fff;
  margin-bottom: 20px;
  margin-top: 20px;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 5%);
  h3 {
    font-size: 24px;
    margin-bottom: 16px;
    font-weight: 500;
  }
  .el-tag {
    margin-right: 12px;
    border: 0;
    border-radius: 4px;
    padding: 6px 12px 7px;
    font-size: 14px;
  }
  .body-row {
    display: flex;
    margin-top: 10px;
  }
  .body-date {
    flex: 1;
    color: #666;
    font-size: 14px;
    .el-icon {
      margin-right: 6px;
      vertical-align: text-bottom;
    }
  }

  .el-button {
    // border-radius: 4px;
    color: #fff;
    font-size: 12px;
    height: 28px;
    &:hover,
    &:focus {
      background-color: #df6250;
      border: 1px solid #df6250;
      color: #fff;
    }
    .el-icon {
      margin-right: 5px;
    }
  }
}
.el-descriptions__body
  .el-descriptions__table.is-bordered
  .el-descriptions__cell {
  font-weight: normal;
  color: rgb(51, 51, 51);
}
.el-descriptions__label.el-descriptions__cell.is-bordered-label {
  background: #fafafa;
}
.el-descriptions__content:not(.is-bordered-label) {
  color: rgb(51, 51, 51);
}
.el-descriptions {
  .el-descriptions__header .el-descriptions__title {
    font-size: 16px;
    font-weight: 600;
    color: rgb(51, 51, 51);
    line-height: 16px;
    display: flex;
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 1px solid #e9e9e9;
    em {
      display: block;
      width: 3px;
      border-radius: 20px;
      background-color: #df6250;
      margin-right: 6px;
    }
  }
}
.my-label {
  width: 140px;
}
.more {
  display: inline-block;
  margin-left: 10px;
  color: #df6250;
  cursor: pointer;
  .el-icon {
    margin-right: 5px;
    display: block;
    float: left;
    margin-top: 5px;
  }
}
</style>
<template>
  <div class="main-body" v-loading="loading">
    <Header @changeSearch="changeSearch" fromType="2"></Header>
    <div style="margin-top: 100px">
      <el-breadcrumb>
        <el-breadcrumb-item><a href="/index">搜索列表</a></el-breadcrumb-item>
        <el-breadcrumb-item>标文详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="body-title">
        <!-- <h3>{{ tableData.infoTitle }}</h3> -->
        <h3 v-html="tableData.infoTitle"></h3>
        <el-tag style="color: #409eff">{{ tableData.classificationIndustry }}</el-tag>
        <el-tag type="danger">{{ tableData.areaProvince }}-{{ tableData.areaCity }}</el-tag>
        <el-tag style="color: #409eff">{{ tableData.infoType }}</el-tag>
        <div class="body-row">
          <p class="body-date">
            <el-icon>
              <Clock />
            </el-icon>发布时间：{{ tableData.infoPublishTime }}
          </p>
          <el-button color="#df6250" v-loading.fullscreen="exportLoading" element-loading-text="正在导出中..." @click="downLoadDetail">
            <el-icon>
              <Download />
            </el-icon>导出
          </el-button>
        </div>
      </div>

      <div class="body-content">
        <div class="body-left">
          <el-descriptions :column="2" border>
            <template #title><em></em>摘要信息</template>
            <el-descriptions-item label="中标单位" label-class-name="my-label">{{ tableData.zhongBiaoUnit || "-" }}
              <a v-if="tableData.zhongBiaoUnit" class="more" @click="goIndex(tableData.zhongBiaoUnit, 1)"><el-icon>
                  <OfficeBuilding />
                </el-icon>企业信息</a>
            </el-descriptions-item>
            <el-descriptions-item label="中标金额" label-class-name="my-label">{{
                            tableData.winnerAmount || "-"
                        }}</el-descriptions-item>
            <el-descriptions-item label="招标单位" label-class-name="my-label">
              {{ tableData.zhaoBiaoUnit || "-"
                            }}<a v-if="tableData.zhaoBiaoUnit" class="more" @click="goIndex(tableData.zhaoBiaoUnit, 2)"><el-icon>
                  <OfficeBuilding />
                </el-icon>企业信息</a>
            </el-descriptions-item>
            <el-descriptions-item label="项目编号" label-class-name="my-label">{{
                            tableData.xmNumber || "-"
                        }}</el-descriptions-item>
            <el-descriptions-item label="招标单位联系人" label-class-name="my-label">{{
                            tableData.zhaoRelationName || "-"
                        }}</el-descriptions-item>
            <el-descriptions-item label="招标单位联系方式" label-class-name="my-label">{{ tableData.zhaoRelationWay || "-"
                            }}<a v-if="tableData.zhaoRelationWay" class="more" @click="goIndex(tableData.zhaoRelationWay, 3)">更多<el-icon style="float: right">
                  <ArrowRight />
                </el-icon></a></el-descriptions-item>
          </el-descriptions>

          <el-descriptions style="margin-top: 40px">
            <template #title><em></em>招标详情</template>
            <el-descriptions-item>
              <p v-html="tableData.infoContent"></p>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <HelpfulHints class="list-help"></HelpfulHints>
      </div>
    </div>
  </div>
</template>

<script setup>
import HelpfulHints from "@/components/HelpfulHints.vue";
import Header from "@/components/Header/index.vue";
import { ElMessage } from "element-plus";
import { Clock, Download, Search, UploadFilled, ArrowRight, OfficeBuilding } from "@element-plus/icons-vue";
import { ref, reactive, defineProps, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { exprotExcal } from "@/utils/shared";
// import { detailApi, exportApi } from "@/http/api";
import dayjs from "dayjs";

//路由取值
const router = useRouter();
const contentId = ref("");
onMounted(() => {
  //路由取值
  contentId.value = router.currentRoute.value.query.contentId;
  getDetail();
});

const params = (obj) => {
  for (const objKey in obj) {
    const item = obj[objKey];
    if (item === undefined || item === null || item === "") {
      delete obj[objKey];
    }
  }
  return obj;
};

const changeSearch = (op) => {
  router.push({
    path: "/index",
    query: params(op),
  });
};

const goIndex = (Params, index) => {
  // console.log(Params, index);
  if (index == 1) {
    const newpage = router.resolve({
      path: "/index",
      query: {
        keywords: Params,
        type: "zhongBiaoUnit",
        searchRange: 4,
        path: "detail",
        // searchModel:1,
      },
    });
    window.open(newpage.href, "_blank");
  }
  if (index == 2) {
    const newpage = router.resolve({
      path: "/index",
      query: {
        keywords: Params,
        type: "zhaoBiaoUnit",
        searchRange: 3,
        path: "detail",
        // searchModel:1,
      },
    });
    window.open(newpage.href, "_blank");
  }
  if (index == 3) {
    const newpage = router.resolve({
      path: "/index",
      query: {
        keywords: Params,
        type: "zhaoRelationWay",
        searchRange: 7,
        path: "detail",
        // searchModel:1,
      },
    });
    window.open(newpage.href, "_blank");
  }
};

//获取详情
const loading = ref(true);
const tableData = ref({});
const getDetail = () => {
  let params = {
    contentId: contentId.value,
    keywords: router.currentRoute.value.query.keywords,
  };
  // detailApi
  //   .getDetailInfo(params)
  //   .then((res) => {
  //     loading.value = false;
  //     tableData.value = res.data;
  //   })
  //   .catch((err) => {
  //     ElMessage({
  //       message: err.msg,
  //       type: "error",
  //       showClose: true,
  //       duration: 1000,
  //     });
  //     // console.log(err);
  //   });
};
//导出
const exportLoading = ref(false);
const downLoadDetail = () => {
  exportLoading.value = true;
  // exportApi
  //   .selectDownLoad({ check: false, contentIds: contentId.value })
  //   .then((res) => {
  //     exportApi
  //       .selectDownLoad(
  //         {
  //           check: true,
  //           contentIds: contentId.value,
  //         },
  //         { responseType: "blob" }
  //       )
  //       .then(() => { })
  //       .catch((error) => {
  //         exprotExcal("数据导出表" + dayjs().format("YYYY-MM-DD"), error);
  //       });
  //   })
  //   .catch((err) => {
  //     // console.log(err);
  //   })
  //   .finally(() => {
  //     exportLoading.value = false;
  //   });
};
</script>


