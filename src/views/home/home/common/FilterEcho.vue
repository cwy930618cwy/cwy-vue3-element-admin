<template>
  <div class="FilterEcho">
    <FilterCell title="筛选条件：">
      <div class="echo fr fj_sb">
        <div class="echo-tag">
          <div class="fs_fe">
            <el-tag v-for="(item, index) in tabList" :key="index" :closable="true" size="small" disable-transitions @close="onClear(item, index)">
              <p class="" style="max-width: 275px">{{ item.echoText }}</p>
            </el-tag>
          </div>
          <div style="line-height: 30px" v-if="!tabList.length">默认</div>
        </div>
        <!--  :class="{ 'clear-checked': tabList.length }"-->
        <!-- <div class="fs_fs fs_0 fr_c clear clear-checked" @click="onClearAll">
          <el-icon>
            <DeleteFilled />
          </el-icon>
          <span>清空</span>
        </div> -->
      </div>
    </FilterCell>
  </div>
</template>

<script>
import FilterCell from "@/components/Filter/FilterCell.vue";
export default {
  name: "FilterEcho",
  components: { FilterCell },
  data() {
    return {
      tabList: [],
    };
  },
  methods: {
    /**
     *如果没有数据添加一条数据，有数据则更新当前数据或者删除
     * @param res
     */
    fill(res) {
      const data = {
        tabId: res.refNameRoot + "=" + res.data.dataCurrent.id,
        refNameRoot: res.refNameRoot,
        refName: res.refName || res.refNameRoot, //没有子集时候，已是父
        data: res.data || {},
        echoText: res.echoText || "", //回显文本
        dataCurrent: res.data.dataCurrent || {}, //当前选中值
        checkedStatus: res.checkedStatus || "radio", //单选radio 多选checkbox 输入框text
      };
      const isSplice = data.echoText !== "" && data.dataCurrent.id !== -1;
      if (data.dataCurrent.id === -1) {
        this.tabList = this.tabList.filter((r) => data.refNameRoot !== r.refNameRoot);
        return;
      }
      if (!this.tabList.length && isSplice) {
        this.tabList.push(data);
      } else {
        if (data.checkedStatus === "checkbox") {
          const sameCurrentIndex = this.tabList.findIndex((r) => data.tabId === r.tabId);
          if (sameCurrentIndex !== -1) {
            if (data.data.dataTree && data.data.dataTree.find((r) => r.id === data.dataCurrent.id)) {
              //更新
              this.tabList.splice(sameCurrentIndex, 1, data);
            } else {
              //删除
              this.tabList.splice(sameCurrentIndex, 1);
            }
          } else {
            if (isSplice) {
              this.tabList.push(data);
            }
          }
        } else if (data.checkedStatus === "radio") {
          const sameCurrentIndex = this.tabList.findIndex((r) => data.refNameRoot === r.refNameRoot);
          if (sameCurrentIndex !== -1) {
            if (data.echoText === "") {
              this.tabList.splice(sameCurrentIndex, 1);
            } else {
              this.tabList.splice(sameCurrentIndex, 1, data);
            }
          } else {
            if (isSplice) {
              this.tabList.push(data);
            }
          }
        }
      }
    },
    // 清除所有筛选条件
    onClearAll() {
      this.tabList = [];
      this.$emit("clear", { type: "clearAll", data: this.tabList });
    },
    // 清除单个筛选条件
    onClear(item, index) {
      this.tabList.splice(index, 1);
      this.$emit("clear", { type: "clear", data: item });
    },
  },
};
</script>

<style scoped lang="scss">
.FilterEcho {
  .echo {
    .echo-tag {
      padding-left: 12px;
      height: 30px;
      :deep {
        .el-tag {
          margin-right: 12px;
          margin-top: 8px;
          color: rgb(51 51 51);
          background: rgb(243 243 243);
          border: 1px dotted #d9d9d9;
          border-radius: 14px;
        }
      }
    }
    .clear {
      margin-top: 6px;
      //color: rgb(161, 161, 161);
      //&:hover {
      //    cursor: not-allowed;
      //}
      color: #df6250;
      &:hover {
        cursor: pointer;
      }
      //&-checked {
      //    //color: #df6250;
      //}
      span {
        padding-left: 4px;
      }
    }
  }
}
</style>
