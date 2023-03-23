<template>
  <div class="main-container2">
    <FilterKeyword ref="FilterKeyword"></FilterKeyword>
    <div class="container-filter">
      <!--  筛选条件  -->
      <FilterEcho ref="FilterEcho" @clear="clearSelected"></FilterEcho>
      <div class="fr fj_sb">
        <!--  选择时间  -->
        <FilterTime ref="FilterTime"></FilterTime>
      </div>
      <!--  采购单位  -->
      <FilterProcureCompany ref="FilterProcureCompany"></FilterProcureCompany>
      <!--  信息类型  -->
      <FilterTypeBidding ref="FilterTypeBidding"></FilterTypeBidding>
      <!--  业务地区  -->
      <FilterArea ref="FilterArea"></FilterArea>
      <div class="fr fj_fe">
        <el-button color="#7263CE" @click="starSearch">搜索</el-button>
        <el-button color="#7263CE" @click="onClearAll">重置</el-button>
      </div>
    </div>

    <div class="body-content fr">
      <div class="body-left">
        <!--  公司招中标条数  -->
        <!-- <FilterCompanyInfo ref="FilterCompanyInfo"></FilterCompanyInfo> -->
        <!-- 数据列表 -->
        <ListItem ref="ListItem"></ListItem>
      </div>
      <!-- <HelpfulHints class="list-help"></HelpfulHints> -->
    </div>
  </div>
</template>

<script>
import FilterKeyword from "./common/FilterKeyword.vue";
import FilterEcho from "./common/FilterEcho.vue";
import FilterArea from "./common/FilterArea.vue";
import FilterTypeBidding from "./common/FilterTypeBidding.vue";
import FilterProcureCompany from "./common/FilterProcureCompany.vue";
// import FilterProjectMoney from "./common/FilterProjectMoney.vue";
// import FilterIndustry from "./common/FilterIndustry.vue";
import FilterTime from "./common/FilterTime.vue";
// import FilterModel from "./common/FilterModel.vue";
// import FilterKeywordOut from "./common/FilterKeywordOut.vue";
// import FilterKeywordRelated from "./common/FilterKeywordRelated.vue";
// import FilterSearchContent from "./common/FilterSearchContent.vue";
import ListItem from "./common/ListItem.vue";
// import HelpfulHints from "@/components/HelpfulHints.vue";
// import FilterCompanyInfo from "./common/FilterCompanyInfo.vue";
import { searchDeleteParams } from "@/utils/shared";
// import { searchApi, assistWindowSearchApi } from "@/http/api";
import _ from "lodash";
export default {
  name: "Maintenance",
  components: {
    FilterKeyword,
    FilterEcho,
    FilterArea,
    FilterTypeBidding,
    FilterProcureCompany,
    // FilterProjectMoney,
    // FilterIndustry,
    FilterTime,
    // FilterModel,
    // FilterKeywordOut,
    // FilterKeywordRelated,
    // FilterSearchContent,
    // FilterCompanyInfo,
    ListItem,
    // HelpfulHints,
  },
  provide() {
    return {
      // 只读的params
      pro_params: () => this.paramsRead, //响应式 不允许子组件修改 切记！！！
      // 接口query参数
      pro_paramsPost: () => this.paramsPost,
      // 参数变化
      pro_setParams: this.onComponentsChangeParams,
    };
  },
  data() {
    return {
      // 可操作参数
      params: {
        searchRange: 0, //0：全文+内容  1：标题  2：项目编号  3：招标单位  4：中标单位  5：代理单位  6：联系人  7：联系电话
        keywords: "", //关键词搜索
        province: "", //省（多个用英文逗号分割）
        city: "", //市（多个用英文逗号分割）
        dataType: "", //数据类型 招标：1  中标：2
        purchaseUnitFirstLevel: "", //采购单位一级行业（多个用英文逗号分割）
        purchaseUnitSecondLevel: "", //采购单位二级行业（多个用英文逗号分割）
        classificationIndustry: "", //行业分类 （货物   工程   商业公司）  多个用，号分割
        startAmount: "", //筛选金额-开始金额
        endAmount: "", //筛选金额-结束金额
        beginTime: "", //开始时间 格式：yyyyMMdd
        endTime: "", //结束时间 格式：yyyyMMdd
        timeType: "-1", //时间分类 -1.全部  1.今天  2.近七天  3.近30天  4.近90天  5.近半年  6.近一年    0.自定义
        searchModel: 1, //搜索模式 1：精准   2：模糊
        ruleOutWords: "", //排除词  ，分割
        relatedWords: "", //相关词 ，分割
        orderBy: 1, //排序类型  1：综合排序  2：时间排序
        batchCondition: "", //批量条件
        pageNumber: 1,
        pageSize: 10,
        zhongBiaoUnit: "", //详情页中标单位
        zhaoBiaoUnit: "", //详情页招标单位
        zhaoRelationWay: "", //详情页招标单位联系方式
      },
      isCollapseShow: true, //是否收起
      loading: false,

      companyName: "", //分解的公司名称
      historyWinTheBidRecord: 1, //中标条数
      historyBidRecord: 1, //招标条数
    };
  },
  created() {
    if (this.$route.query.path === "detail") {
      this.params.searchModel = 1;
    }
  },
  computed: {
    // 只读的params
    paramsRead() {
      return this.params;
    },
    // 搜索接口传参拼接
    paramsPost() {
      return searchDeleteParams(this.params);
    },
  },
  methods: {
    onClearAll() {
      this.$refs.FilterEcho.onClearAll();
    },
    onComponentsChangeParams(res) {
      if (!res || !res.refNameRoot) return;
      let newParams = {};
      switch (res.refNameRoot) {
        case FilterKeyword.name:
          newParams.searchRange = res.data.searchRange || 0;
          newParams.keywords = res.data.keywords;
          newParams.pageNumber = 1;
          break;
        case FilterArea.name:
          this.$refs.FilterEcho.fill(res);
          newParams.province = res.data.leave1;
          newParams.city = res.data.leave2;
          newParams.pageNumber = 1;
          break;
        case FilterTypeBidding.name:
          this.$refs.FilterEcho.fill(res);
          newParams.dataType = res.data.leave1[0];
          newParams.pageNumber = 1;
          break;
        case FilterProcureCompany.name:
          this.$refs.FilterEcho.fill(res);
          newParams.purchaseUnitFirstLevel = res.data.leave1;
          newParams.purchaseUnitSecondLevel = res.data.leave2;
          newParams.pageNumber = 1;
          break;
        // case FilterProjectMoney.name:
        //   this.$refs.FilterEcho.fill(res);
        //   newParams.startAmount = res.data.leave1[0];
        //   newParams.endAmount = res.data.leave2[0];
        //   newParams.pageNumber = 1;
        //   break;
        // case FilterIndustry.name:
        //   this.$refs.FilterEcho.fill(res);
        //   newParams.classificationIndustry = res.data.leave1[0];
        //   newParams.pageNumber = 1;
        //   break;
        case FilterTime.name:
          this.$refs.FilterEcho.fill(res);
          newParams.beginTime = res.data.leave1[0];
          newParams.endTime = res.data.leave2[0];
          newParams.timeType = res.data.leave3[0];
          newParams.pageNumber = 1;
          break;
        // case FilterModel.name:
        //   this.$refs.FilterEcho.fill(res);
        //   newParams.searchModel = res.data.leave1[0];
        //   newParams.pageNumber = 1;
        //   break;
        // case FilterKeywordOut.name:
        //   this.$refs.FilterEcho.fill(res);
        //   newParams.ruleOutWords = res.data.leave1[0];
        //   newParams.pageNumber = 1;
        //   break;
        // case FilterKeywordRelated.name:
        //   this.$refs.FilterEcho.fill(res);
        //   newParams.relatedWords = res.data.leave1[0];
        //   newParams.pageNumber = 1;
        //   break;
        // case FilterSearchContent.name:
        //   // this.$refs.FilterEcho.fill(res);
        //   newParams.batchCondition = res.data.leave1[0];
        //   newParams.pageNumber = 1;
        //   break;
        // case FilterCompanyInfo.name:
        //   newParams.searchRange = res.data.searchRange || 0;
        //   newParams.keywords = res.data.keywords;
        //   const keywordValue = {
        //     keywords: res.data.keywords,
        //     searchRange: res.data.searchRange || 0,
        //   };
        //   this.$refs.FilterKeyword.init(keywordValue);
        //   newParams.pageNumber = 1;
        //   break;
        // case ListItem.name:
        //   newParams.orderBy = res.data.sort;
        //   newParams.pageNumber = res.data.pageNo;
        //   newParams.pageSize = res.data.pageSize;
        //   break;
      }
      this.setParams(newParams);
      // if (res.noEventTig) return; //不触发搜索
      // this.starSearch();
    },
    setParams(newParams) {
      Object.assign(this.params, newParams);
    },
    // 删除以选条件
    clearSelected({ type, data }) {
      switch (type) {
        case "clear":
          for (const key in this.$refs) {
            data.refNameRoot === key && this.$refs[key].clear(data.data.dataCurrent.id);
          }
          break;
        case "clearAll":
          for (const key in this.$refs) {
            this.$refs[key].clear && this.$refs[key].clear();
          }
          break;
      }
    },
    starSearch: _.debounce(function () {
      this.$refs.ListItem.page.list = [];
      this.$refs.ListItem.page.loading = true;
      this.$refs.ListItem.page.loading = true;
      this.loading = true;
      let searchModel = (this.params.searchModel = this.paramsPost.searchModel);
      let timeType = (this.params.timeType = this.paramsPost.timeType);

      if (timeType === "-1" && searchModel === 2) {
        this.$message({
          duration: 1000,
          showClose: true,
          type: "error",
          message: "当前搜索模式下不支持全部搜索，默认近一年！",
        });

        this.$refs.FilterTime.init();
        this.params.timeType = this.paramsPost.timeType = 6;
      }

      const res = {
        "autoSwitchMode": 0,
        "infos": [
          {
            "contentId": "331220596",
            "dataTag": "",
            "dataType": "公告-招标公告",
            "infoPublishTime": "2023-02-22",
            "infoTitle": "热镀锌可利用卷 宝山钢铁股份有限公司",
            "provinceAndCity": "上海-上海",
            "zhaoBiaoUnit": "宝山钢铁股份有限公司",
            "zhongBiaoUnit": "宝山钢铁股份有限公司",
            "zhaoRelationWay": 3,
            "dailiRelationWay": 3,
            "zhongRelationWay": 3,
            "gongshangRelationWay": 3
          },
        ],
        "keywords": "",
        "pageNumber": 1,
        "pageSize": 10,
        "totalRecord": 197783311
      }

      console.log('res-----', res)

      // !res.list.length && this.$refs.ListItem.empty(1, "没有检索到相关数据");
      this.$refs.ListItem.page.list = res.infos;
      this.$refs.ListItem.page.pageNo = res.pageNumber;
      this.$refs.ListItem.page.size = res.pageSize;
      this.$refs.ListItem.page.total = res.totalRecord;
      this.$refs.ListItem.page.loading = false;
      this.$refs.ListItem.page.keywords = res.keywords;
      this.loading = false;

      // searchApi.search(this.paramsPost).then((res) => {
      //     res = res.data;
      //     if (res.autoSwitchMode === 1) {
      //       this.$message({
      //         duration: 1000,
      //         showClose: true,
      //         type: "error",
      //         message: "查询结果没有数据, 将为您推荐相关数据",
      //       });
      //     }
      //     // !res.list.length && this.$refs.ListItem.empty(1, "没有检索到相关数据");
      //     this.$refs.ListItem.page.list = res.infos;
      //     this.$refs.ListItem.page.pageNo = res.pageNumber;
      //     this.$refs.ListItem.page.size = res.pageSize;
      //     this.$refs.ListItem.page.total = res.totalRecord;
      //     this.$refs.ListItem.page.loading = false;
      //     this.$refs.ListItem.page.keywords = res.keywords;
      //     this.loading = false;

      //     assistWindowSearchApi
      //       .assistWindowSearch({ keyword: this.params.keywords || this.paramsPost.keywords })
      //       .then((res) => {
      //         this.companyName = res.data.unitName;
      //         this.historyBidRecord = res.data.historyBidRecord;
      //         this.historyWinTheBidRecord = res.data.historyWinTheBidRecord;
      //       })
      //       .catch((err) => {
      //         this.$message({
      //           duration: 1000,
      //           showClose: true,
      //           type: "error",
      //           message: err.msg,
      //         });
      //       });
      //   })
      //   .catch((err) => {
      //     // if (this.params.searchModel === 1) {
      //     //     if (err.code === "50002") {
      //     //         this.$refs.FilterModel.init();
      //     //         this.params.searchModel = this.paramsPost.searchModel = 2;
      //     //         this.$refs.FilterTime.init();
      //     //         this.params.timeType = this.paramsPost.timeType = 6;
      //     //         this.starSearch();
      //     //     }
      //     // }

      //     if (err.message === "cancel") return;
      //     // this.$refs.ListItem.empty(2, "服务器异常！");
      //     this.$refs.ListItem.page.total = 0;
      //     this.$refs.ListItem.page.loading = false;
      //     this.loading = false;
      //     this.$message({
      //       duration: 1000,
      //       showClose: true,
      //       type: "error",
      //       message: err.msg,
      //     });
      //   });
    }, 100),

    handelMore() {
      this.isCollapseShow = !this.isCollapseShow;
    },
  },
  mounted() {
    this.starSearch();
  },
};
</script>

<style lang="scss" scope>
.main-container2 {
  .body-content .body-left {
    padding: 0;
    background: none;
    border-radius: 0;
    box-shadow: none;
    // margin: 0;
  }
  .container-filter {
    position: relative;
    padding: 24px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 5%);
    h2 {
      font-size: 24px;
      color: #7263ce;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .search-loading {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 2;
      transform: translate(-50%, -50%);
      width: 64px;
      height: 64px;
      background: #f8f9fb;
      border-radius: 8px;
      font-size: 12px;
      color: #e64a00;
      img {
        width: 24px;
        height: 24px;
      }
      span {
        margin-top: 4px;
      }
    }
  }
  .filter-more {
    padding-top: 6px;
    font-size: 14px;
    color: rgb(38 142 255);
    &:hover {
      cursor: pointer;
    }
    &-collapse {
      transition: all 300ms;
      &-up {
        transform: rotate(-180deg);
      }
    }
  }
}
</style>
