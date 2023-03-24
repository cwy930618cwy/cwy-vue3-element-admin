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
      background-color: #7263ce;
      border: 1px solid #7263ce;
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
      background-color: #7263ce;
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
  color: #7263ce;
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
    <!-- <Header @changeSearch="changeSearch" fromType="2"></Header> -->
    <div>
      <!-- <el-breadcrumb>
        <el-breadcrumb-item><span @click="this.$router.push({ path: '/home'})">首页</span></el-breadcrumb-item>
        <el-breadcrumb-item>标文详情</el-breadcrumb-item>
      </el-breadcrumb> -->
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
          <el-button color="#7263CE" v-loading.fullscreen="exportLoading" element-loading-text="正在导出中..." @click="downLoadDetail">
            导出
          </el-button>
        </div>
      </div>

      <div class="body-content">
        <div class="body-left">
          <el-descriptions :column="1" border>
            <template #title><em></em>摘要信息</template>
            <el-descriptions-item label="项目编号" v-if="tableData.xmNumber" label-class-name="my-label">{{ tableData.xmNumber }}</el-descriptions-item>
            <el-descriptions-item label="中标单位" v-if="tableData.zhongBiaoUnit" label-class-name="my-label">{{ tableData.zhongBiaoUnit || "-" }}</el-descriptions-item>
            <el-descriptions-item label="中标金额" v-if="tableData.winnerAmount" label-class-name="my-label">{{  tableData.winnerAmount }}</el-descriptions-item>
            <el-descriptions-item label="招标单位" v-if="tableData.zhaoBiaoUnit" label-class-name="my-label">{{ tableData.zhaoBiaoUnit }}</el-descriptions-item>
            <el-descriptions-item label="招标单位联系人" v-if="tableData.zhaoRelationName" label-class-name="my-label">{{  tableData.zhaoRelationName }}</el-descriptions-item>
            <el-descriptions-item label="招标单位联系方式" v-if="tableData.zhaoRelationWay" label-class-name="my-label">{{ tableData.zhaoRelationWay }}</el-descriptions-item>
            <el-descriptions-item label="代理机构" v-if="tableData.zhaoBiaoUnit" label-class-name="my-label">{{ tableData.zhaoBiaoUnit }}</el-descriptions-item>
            <el-descriptions-item label="代理机构联系人" v-if="tableData.zhaoRelationName" label-class-name="my-label">{{  tableData.zhaoRelationName }}</el-descriptions-item>
            <el-descriptions-item label="代理机构联系方式" v-if="tableData.zhaoRelationWay" label-class-name="my-label">{{ tableData.zhaoRelationWay }}</el-descriptions-item>
            <el-descriptions-item label="工商联系人" v-if="tableData.zhaoRelationName" label-class-name="my-label">{{  tableData.zhaoRelationName }}</el-descriptions-item>
            <el-descriptions-item label="工商联系方式" v-if="tableData.zhaoRelationWay" label-class-name="my-label">{{ tableData.zhaoRelationWay }}</el-descriptions-item>
          </el-descriptions>

          <el-descriptions style="margin-top: 40px">
            <template #title><em></em>招标详情</template>
            <el-descriptions-item>
              <p v-html="tableData.infoContent"></p>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- <HelpfulHints class="list-help"></HelpfulHints> -->
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
import { detailApi, exportApi } from "@/api/home";
import dayjs from "dayjs";

//路由取值
const router = useRouter();
const infoId = ref("");
onMounted(() => {
  //路由取值
  infoId.value = router.currentRoute.value.query.infoId;
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
    infoId: infoId.value,
    keywords: router.currentRoute.value.query.keywords,
  };

  const res = {
    agentRelationName: "",
    agentRelationWay: "",
    agentUnit: "",
    areaCity: "上海",
    areaCountry: "宝山区",
    areaProvince: "上海",
    budget: "4110.00",
    classificationIndustry: "",
    infoId: "331220596",
    infoContent: "<div> \n <div> \n  <div> \n   <div>\n     热镀锌可利用卷 宝山钢铁股份有限公司 \n    <p>卖方: 宝山钢铁股份有限公司 <a target=\"blank\" style=\"background-color: rgb(255, 255, 255);\"> 营业执照</a> <a style=\"background-color: rgb(255, 255, 255);\"> 订阅</a><br></p> \n   </div> \n   <div> \n    <p>拼盘: 1个重量: 1.010吨数量: 无</p> \n   </div> \n   <div> \n    <p>竞价模式: 公开增价会员属性: 只限企业买方收费: 无</p> \n    <p>延时机制: 2分钟/次 年费套餐: 适用开票方: 上海欧冶供应链有限公司</p> \n   </div> \n  </div> \n  <div>\n    开始时间 02月23日 09:00 \n   <p>交易保证金：￥0.00元</p> \n   <div> \n    <p> 交易保证金=竞价保证金+服务费保证金</p> \n   </div> \n   <div> \n    <a id=\"isread-text\" onclick=\"javascript:joinbuy('ZZ2302222110049',this);event.stopPropagation();\">参加竞买</a> \n   </div> \n  </div> \n </div> \n <div> \n  <p>竞拍流程：</p> \n  <ul> \n   <li><a target=\"_blank\">01 现场看货</a></li> \n   <li></li> \n   <li><a target=\"_blank\">02 交保证金</a></li> \n   <li></li> \n   <li><a target=\"_blank\">03 出价竞拍</a></li> \n   <li></li> \n   <li><a target=\"_blank\">04 竞拍成功</a></li> \n   <li></li> \n   <li><a target=\"_blank\">05 支付货款</a></li> \n   <li></li> \n   <li><a target=\"_blank\">06 到货确认</a></li> \n  </ul> \n </div> \n</div> \n<div> \n <div> \n  <ul> \n   <li><a>竞价公告</a></li> \n   <li><a onclick=\"showLogin();\">拼盘详情</a></li> \n   <li><a onclick=\"showLogin();\">卖家协议</a></li> \n   <li><a>单卷交易规则</a></li> \n  </ul> \n  <div> \n   <div>\n     资源信息 \n    <table cellspacing='1' cellpadding='0' style='background: #ccc;' border='0' > \n     <tbody>\n      <tr style='background: #FBFDFE;' > \n       <th>拼盘</th> \n       <th>品名</th> \n       <th>重量/数量</th> \n       <th>起拍价</th> \n       <th>买家服务费率</th> \n      </tr> \n      <tr style='background: #FBFDFE;' > \n       <td rowspan=\"\">001</td> \n       <td>热镀锌可利用卷</td> \n       <td rowspan=\"\">1.010吨</td> \n       <td rowspan=\"\">4110.00元/吨</td> \n       <td rowspan=\"\">无</td> \n      </tr> \n     </tbody>\n    </table> \n    <div>\n      特别提醒:1、系统重量不作提货依据，按实际过磅为准。 2、该资源为宝钢股份可利用材，卖方不受理质量异议。牌号、规格、备注等描述信息仅作参考，不作为提货依据，实物与资源描述可能存在偏差。请对资源的实际情况进行充分了解。一旦在竞价过程中出价或购买挂牌资源，视为买方已现场确认实物质量、数量并认同其品质，或在放弃现场确认权利同时认可实物质量、数量和品质。目前部分仓库不能支持现场看货，请注意风险。 支持现场看货的仓库为：石洞口库、湛江物流基地仓库。 不支持现场看货的仓库为：宝冶1220仓库、湛江2250热轧中间库。 \n    </div> \n   </div> \n   <div> \n    <div>\n      联系信息 \n     <table cellspacing='1' cellpadding='0' style='background: #ccc;' border='0' > \n      <tbody>\n       <tr style='background: #FBFDFE;' > \n        <td>存放地</td> \n        <td colspan=\"3\">上海市-上海市</td> \n       </tr> \n       <tr style='background: #FBFDFE;' > \n        <td>看货时间</td> \n        <td>-</td> \n        <td>发票信息</td> \n        <td>增值税专用发票 13%</td> \n       </tr> \n       <tr style='background: #FBFDFE;' > \n        <td>看货仓库</td> \n        <td>上海宝冶集团有限公司宝冶1220</td> \n        <td>仓库地址</td> \n        <td><a onclick=\"showLogin();\">登录后显示</a></td> \n       </tr> \n       <tr style='background: #FBFDFE;' > \n        <td></td> \n        <td colspan=\"3\"> \n         <div> \n          <div> \n           <div> \n            <div> \n             <div> \n              <div> \n               <div> \n                <div></div> \n               </div> \n              </div> \n             </div> \n             <div></div> \n            </div> \n           </div> \n           <div> \n            <div> \n             <div> \n              <div></div> \n              <div></div> \n              <div></div> \n              <div></div> \n             </div> \n             <div></div> \n             <div> \n              <div></div> \n              <div> \n               <div></div> \n               <div></div> \n              </div> \n              <div></div> \n             </div> \n            </div> \n            <div> \n             <div></div> \n            </div> \n           </div> \n          </div> \n          <div></div> \n         </div></td> \n       </tr> \n       <tr style='background: #FBFDFE;' > \n        <td>联系人</td> \n        <td>戴燕</td> \n        <td>联系电话</td> \n        <td><a onclick=\"showLogin();\">登录后显示</a></td> \n       </tr> \n      </tbody>\n     </table> \n     <div> \n      <div> \n       <p>宝山钢铁股份有限公司<br>2023年02月22日</p> \n      </div> \n     </div> \n    </div> \n   </div> \n  </div> \n </div> \n</div>",
    infoPublishTime: "2023-02-22",
    infoTitle: "热镀锌可利用卷 宝山钢铁股份有限公司",
    infoType: "公告-招标公告",
    infoUrl: "",
    winnerAmount: "",
    xmNumber: "",
    zhaoBiaoUnit: "宝山钢铁股份有限公司",
    zhaoRelationName: "戴燕",
    zhaoRelationWay: "",
    zhongBiaoUnit: "",
    zhongRelationName: "",
    zhongRelationWay: ""
  }
  loading.value = false;
  tableData.value = res;
  detailApi(params)
    .then((res) => {
      loading.value = false;
      tableData.value = res.data;
    })
    .catch((err) => {
      ElMessage({
        message: err.msg,
        type: "error",
        showClose: true,
        duration: 1000,
      });
      // console.log(err);
    });
};
//导出
const exportLoading = ref(false);
const downLoadDetail = () => {
  exportLoading.value = true;
  // exportApi
  //   .selectDownLoad({ check: false, contentIds: infoId.value })
  //   .then((res) => {
  //     exportApi
  //       .selectDownLoad(
  //         {
  //           check: true,
  //           contentIds: infoId.value,
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


