<template>
  <div class="FilterTime">
    <FilterCell title="发布时间：">
      <div class="fr_c" style="height: 30px">
        <FilterRadio ref="FilterRadio" v-model:value="currentIndex" @clickItem="searchChange" :options="list" />
        <div class="filter-dropdown fs_0">
          <DropdownOptions placeholder="往年" v-model:value="moreOptions.value" :options="moreOptions.list" @clickItem="clickDropdownItem" />
        </div>
        <div class="filter-time fr_c fs_0">
          <p class="time-hd fs_0" @click="handelTime" :class="{ 'time-hd-active': timeActive }">自定义</p>
          <div class="fr_c" v-show="timeActive">
            <el-date-picker format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="time[0]" type="datetime" placeholder="开始时间" :disabledDate="disabledDate" />
            <p style="width: 14px; height: 1px; background: rgb(204 204 204); margin: 0 6px"></p>
            <el-date-picker format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="time[1]" type="datetime" placeholder="终止时间" :disabledDate="disabledDate" />
          </div>
        </div>
      </div>
    </FilterCell>
  </div>
</template>

<script>
import FilterCell from "@/components/Filter/FilterCell.vue";
import FilterRadio from "@/components/Filter/FilterRadio.vue";
import DropdownOptions from "./DropdownOptions.vue";

import dayjs from "dayjs";
export default {
  name: "FilterTime",
  props: {},
  components: { FilterCell, FilterRadio, DropdownOptions },
  inject: ["pro_setParams"],
  data() {
    return {
      list: [
        { id: '-1', name: "全部（只支持精准搜索）" },
        { id: 1, name: "今天" },
        { id: 2, name: "近7天" },
        { id: 3, name: "近30天" },
        { id: 4, name: "近90天" },
        { id: 5, name: "近半年" },
        { id: 6, name: "近1年" },
      ],
      currentIndex: 0,
      moreOptions: {
        list: [],
        value: -1,
      },
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      time: ["", ""],
      timeActive: false,
    };
  },
  computed: {},
  watch: {
    time: {
      handler(newVal) {
        const effectiveValue = newVal.filter((r) => r);
        if (effectiveValue.length > 0) {
          this.emitChange({ type: "current" }, true);
        }
        if (effectiveValue.length === 2) {
          if (dayjs(newVal[0]).valueOf() > dayjs(newVal[1]).valueOf()) {
            [newVal[0], newVal[1]] = [newVal[1], newVal[0]];
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    init(id = 6) {
      this.currentIndex = 6;
      this.emitChange({ ...this.list[this.currentIndex], name: "" });
    },
    clear() {
      this.currentIndex = 0;
      this.moreOptions.value = -1;
      this.time = ["", ""];
      this.timeActive = false;
      this.emitChange({ ...this.list[this.currentIndex], name: "" });
    },
    clickDropdownItem(index, item) {
      this.currentIndex = 0;
      this.time = ["", ""];
      this.timeActive = false;
      this.emitChange(item);
    },
    searchChange(index, item) {
      this.moreOptions.value = -1;
      this.time = ["", ""];
      this.timeActive = false;
      this.emitChange(item);
    },
    handelTime() {
      this.currentIndex = 0;
      this.moreOptions.value = -1;
      this.timeActive = true;
    },
    emitChange(op = {}, timeType) {
      let echoText = op.name;
      if (timeType) {
        echoText = "自定义时间";
        // op = this.time;
      }
      const params = {
        refNameRoot: this.$options.name,
        data: {
          dataCurrent: op,
          leave1: [this.time[0] || op.beginTime],
          leave2: [this.time[1] || op.endTime],
          leave3: [op.type === "current" ? 0 : op.id],
        },
        echoText,
      };
      this.pro_setParams(params);
    },
  },
  mounted() {
    let minYear = 2012;
    let maxYear = new Date().getFullYear() - 1;
    let yearLimit = maxYear - minYear;
    for (let i = 0; i <= yearLimit; i++) {
      let itemYear = minYear + i;
      this.moreOptions.list.unshift({
        type: "current",
        id: `${itemYear}-01-01`,
        name: `${itemYear}年`,
        beginTime: `${itemYear}-01-01`,
        endTime: `${itemYear}-12-31`,
      });
    }
  },
};
</script>

<style scoped lang="scss">
.FilterTime {
  .filter-dropdown {
    padding: 0 0 0 12px;
  }
  .filter-time {
    padding: 0 0 0 12px;
    .time-hd {
      padding: 0px 8px;
      margin-right: 12px;
      &-active {
        color: #df6250;
        border: 1px solid #df6250;
        border-radius: 4px;
      }
      &:hover {
        cursor: pointer;
      }
    }

    :deep {
      .el-input {
        width: 120px;
        .el-input__wrapper {
          width: 120px;
          height: 28px;
          border-radius: 40px;
          .el-input__prefix {
            display: none;
          }
        }
      }
    }
  }
}
</style>
