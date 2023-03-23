<template>
  <div class="filter-cell fr">
    <p class="cell-title">{{ title }}</p>
    <div class="f_1 cell-content fr_c">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "FilterCell",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped lang="scss">
.filter-cell {
  width: 100%;
  font-size: 14px;
  margin-bottom: 10px;
  .cell-title {
    width: 5em;
    color: #45464a;
    height: 30px;
    line-height: 30px;
  }
  .cell-content {
    //padding-top: 8px;
  }
}
</style>
