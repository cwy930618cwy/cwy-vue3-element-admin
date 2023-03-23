<template>
  <div class="header">
    <div class="header-center">
      <!-- <span @click="goSearch" class="logo-icon" /> -->
      <div class="search-bottom">
        <!-- <el-input @keyup.enter.native="handleSearch" v-model="keywords" placeholder="请输入您要搜索的内容" clearable> -->

        <el-autocomplete ref="autocomplete" v-model="keywords" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false" clearable placeholder="请输入您要搜索的内容" @select="handleSelect" @change="handleSelect" @keyup.enter.native="handleSearch" @clear="clearKeywords">
          <template #prepend>
            <el-select v-model="select.value" placeholder="请选择" style="width: 115px" @change="changeSelect">
              <el-option v-for="(item, index) in select.list" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </template>
          <template #append>
            <el-button @click="handleSearch">
              <span class="search2" />
            </el-button>
          </template>
          <template #default="{ item }">
            <div class="overHiden2 search_item">
              <span class="search_item_title" :title="item.value" v-html="filterTitle(item.value)"></span>
              <!-- <el-button class="search_item_delete" type="text" title="查看">{{
                                item.created
                            }}</el-button> -->
            </div>
          </template>
        </el-autocomplete>
        <!-- </el-input> -->
      </div>
    </div>
  </div>
</template>

<script>
import { searchCompany } from "@/api/company";
import { ElMessage } from "element-plus";

export default {
  name: "Header",
  props: {
    fromType: {
      type: String,
      default: "1", //1搜索  2详情
    },
  },
  components: {},
  data() {
    return {
      keywords: "",
      select: {
        list: [
          { id: "0", name: "全文" },
          { id: "1", name: "标题" },
          { id: "2", name: "项目编号" },
          { id: "3", name: "招标单位" },
          { id: "4", name: "中标单位" },
          { id: "5", name: "代理单位" },
          { id: "6", name: "联系人" },
          { id: "7", name: "联系电话" },
        ],
        value: "0",
      },
      results: [],
      optionsMatching: [],
      loading: "",
      timeout: "",
    };
  },
  computed: {},
  watch: {},
  methods: {
    querySearchAsync(queryString, cb) {
      clearInterval(this.timeout);
      // this.timeout = setTimeout(() => {
      hintSearchApi.hintSearch({ keyword: queryString }).then((res) => {
        if (res.data === null) {
          this.results = [];
          cb(this.results);
        } else {
          this.results = res.data;
          //循环放到一个远程搜索需要的数组
          this.optionsMatching = this.results.map((item, index) => {
            return {
              value: item,
              index: index,
            };
          });
          this.results = this.optionsMatching;
          cb(this.results);
        }
      });
      // }, 100);
    },

    // 给每个结果中匹配字符高亮，v-html="filterTitle(item.value)"
    filterTitle(originStr) {
      if (!this.keywords) {
        return originStr;
      }
      // 将匹配的字符添加一个‘高亮’的标签外表
      let str = this.keywords;
      const regEscape = (v) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      return originStr.replace(new RegExp(regEscape(str), "ig"), '<span style="color: #df6250">$&</span>');
    },
    clearKeywords() {
      this.$router.push({
        path: "/index",
        query: {},
      });
    },
    handleSelect(params) {
      this.eventChange();
      // console.log(params, 123);
    },
    handleSearch() {
      this.eventChange();
      this.$refs.autocomplete.suggestions = [];
    },
    changeSelect() {
      if (this.fromType === "1") {
        this.eventChange();
      }
    },
    eventChange(op) {
      op = {
        searchRange: this.select.value,
        keywords: this.keywords,
        searchModel: this.searchModel,
      };
      // console.log(op, "op");
      this.$emit("changeSearch", op);
    },
    initData(data) {
      this.select.value = data.searchRange;
      this.keywords = data.keywords;
      this.searchModel = data.searchModel;
    },
    goSearch() {
      this.$router.push({
        path: `/search`,
      });
    },
  },
  mounted() { },
  created() { },
};
</script>
<style lang="scss" scope>
.header {
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  // position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 6%);
  .logo-icon {
    display: inline-block;
    width: 97px;
    height: 46px;
    margin-right: 10px;
    cursor: pointer;
    // background: url('../assets/img/logo.png') no-repeat;
    background-size: 100%;
  }
  .header-center {
    display: flex;
    width: 530px;
    margin: 0 auto;
    padding: 8px 0 16px 0;
    .el-input-group {
      height: 32px;
      margin-top: 14px;
    }
  }
  .el-input-group__append .el-button {
    margin-top: -4px;
    height: 30px;
  }
}
span.search2 {
  display: block;
  width: 15px;
  height: 15px;
  background: url('@/assets/img/search.png') no-repeat;
  background-size: 14px;
}
.el-autocomplete {
  width: 100%;
}
.search_item {
  .el-button {
    border: 0 !important;
  }
}
</style>
