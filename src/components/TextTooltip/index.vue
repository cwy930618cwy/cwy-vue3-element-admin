<template>
  <div class="tooltip-container">
    <el-tooltip class="my-tooltip" :disabled="showTooltip" :content="text">
      <p ref="tooltipBox" class="text-box">
        <span ref="tooltipItem" class="">{{text}}</span>
      </p>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "myTooltip",
  props: {
    text: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      showTooltip: true
    }
  },
  watch: {
    text: {
      handler() {
        this.$nextTick(() => this.checkWidth());
      },
      immediate: true
    }
  },
  methods: {
    checkWidth() {
      const boxWidth = this.$refs['tooltipBox'].offsetWidth;
      const itemWidth = this.$refs['tooltipItem'].offsetWidth;
      this.showTooltip = boxWidth > itemWidth
    }
  }
};
</script>
<style scoped lang="scss">
.tooltip-container {
  width: 100%;
  .text-box {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>