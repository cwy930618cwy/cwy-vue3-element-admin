<template>
  <div class="FilterCascader">
    <FilterCheckbox v-model:value="changeData" :list="data" :isMore="isMore" :checkedValueList="checkedValue" @change="changeCheckedLevel1"></FilterCheckbox>
    <FilterCheckbox v-show="
                currentItem.children && currentItem.children.length && checkedValue.some((r) => r.id === currentItem.id)
            " v-model:value="changeData2" :list="currentItem.children" @change="changeCheckedLevel2" class="checkbox2"></FilterCheckbox>
  </div>
</template>

<script>
import FilterCheckbox from "./FilterCheckbox.vue";
export default {
  name: "FilterCascader",
  components: { FilterCheckbox },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => { },
    },
    isMore: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      changeData: [{ id: -1 }],
      changeData2: [],
      currentItem: {},
      checkedValue: [], //最终生成的数据 tree
    };
  },
  watch: {
    checkedValue: {
      handler(newVal) {
        this.$emit("change", newVal, this.currentItem);
      },
      deep: true,
    },
  },
  computed: {},
  methods: {
    init(data) {
      // this.changeData = data.map((r) => {
      //     return {
      //         id: r,
      //     };
      // });
      this.changeData = [{ id: -1 }];
      this.checkedValue = [];
    },
    clear(id) {
      if (id === undefined || id === null) {
        this.changeData = [{ id: -1 }];
        this.checkedValue = [];
        return;
      }
      this.checkedValue = this.checkedValue.filter((r) => r.id !== id);
      const changeData = this.changeData.filter((r) => r.id !== id);
      this.changeData = changeData;
      if (!changeData.length) {
        this.changeData = [{ id: -1 }];
      }
    },
    changeCheckedLevel1(data, currentItem, status) {
      if (this.changeData[0] && this.changeData[0].id === -1) {
        this.changeData.splice(0, 1);
      }
      if (currentItem.id === -1) {
        this.checkedValue = [];
        this.changeData = [{ id: -1 }];
      }
      if (data && !data.length) {
        this.changeData = [{ id: -1 }];
      }
      this.currentItem = currentItem;
      this.changeData2 = [];
      if (status === "add") {
        this.checkedValue.push({
          id: currentItem.id,
          name: currentItem.name,
          children: [],
          sourceChildren: currentItem.children,
        });
      } else if (status === "delete") {
        this.checkedValue.splice(
          this.checkedValue.findIndex((r) => r.id === currentItem.id),
          1
        );
      } else if (status === "init") {
        this.changeData2 = this.checkedValue.find((r) => r.id === currentItem.id).children;
      }
    },
    changeCheckedLevel2() {
      this.checkedValue = this.checkedValue.map((r) => {
        let children = r.children;
        if (this.currentItem.id === r.id) {
          children = this.changeData2;
        }
        return {
          id: r.id,
          name: r.name,
          children,
          sourceChildren: r.sourceChildren,
        };
      });
    },
  },
  mounted() { },
};
</script>

<style scoped lang="scss">
.FilterCascader {
  .checkbox2 {
    border-top: 1px dashed rgb(233 233 233);
    padding-top: 5px;
    margin-top: 10px;
  }
  .cascader-item {
    height: 41px;
    overflow: hidden;
  }
  .more {
    padding: 10px 12px;
    color: #7c7d81;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
