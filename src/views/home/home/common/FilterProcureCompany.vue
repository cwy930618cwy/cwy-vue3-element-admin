<template>
  <FilterCell title="信息类型：">
    <FilterCascader ref="FilterCascader" @change="searchChange" :data="AreaJsonList"></FilterCascader>
  </FilterCell>
</template>

<script>
import FilterCell from "@/components/Filter/FilterCell.vue";
import FilterCascader from "@/components/Filter/FilterCascader.vue";
import { getPartyTypeJSON } from "@/constant/partyTypeJSON.js";

export default {
  name: "FilterProcureCompany",
  props: {},
  components: { FilterCell, FilterCascader },
  inject: ["pro_setParams"],
  data() {
    return {
      AreaJson: [],
    };
  },
  computed: {
    AreaJsonList() {
      return [{ id: -1, name: "全部" }].concat(this.AreaJson);
    },
  },
  methods: {
    init(data = [-1]) {
      this.$refs.FilterCascader.init(data);
    },
    //id
    clear(data) {
      this.$refs.FilterCascader.clear(data);
    },
    searchChange(data, currentItem) {
      this.emitChange(this.levelValMap(data, currentItem, "name"), currentItem);
    },
    emitChange(data, currentItem) {
      const currentItemE = data.dataTree.find((r) => r.id === currentItem.id);
      let echoText = "";
      if (currentItemE) {
        echoText = currentItemE.name;
        if (currentItemE.children.length) {
          echoText += `:${currentItemE.children.map((r) => r.name)}`;
        }
      }
      const params = {
        refNameRoot: this.$options.name,
        data,
        echoText,
        checkedStatus: "checkbox",
      };
      this.pro_setParams(params);
    },
    levelValMap(data, currentItem, type = "id") {
      return data.reduce(
        (acc, item) => {
          acc.leave1.push(item[type]);
          acc.leave2.push(...item.children.map((r) => r[type]));

          // console.log(item.sourceChildren.length,'数量1')
          // console.log(item.children.length,'数量2')

          if (item.children.length !== 0 && item.sourceChildren.length !== item.children.length) {
            const leaveIndex = acc.leave1.indexOf(item[type]);
            acc.leave1.splice(leaveIndex, 1);
          } else {
            acc.leave2 = acc.leave2.filter((r, i) => !item.children.map((v) => v[type]).includes(r));
          }
          // else if (item.sourceChildren.length === item.children.length) {
          //     acc.leave2 = acc.leave2.filter((r, i) => !item.children.map((v) => v[type]).includes(r));
          // }
          return acc;
        },
        {
          leave1: [],
          leave2: [],
          dataTree: data,
          dataCurrent: currentItem,
        }
      );
    },
  },
  mounted() {
    this.AreaJson = getPartyTypeJSON();
  },
  created() { },
};
</script>

<style scoped lang="scss"></style>
