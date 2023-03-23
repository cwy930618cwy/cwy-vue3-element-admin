<template>
  <div class="list fr_c fw_w">
    <div v-for="(item, index) in options" :key="index" class="list-items" @click="clickItem(item, index)">
      <div class="list-item-text" :class="{ 'list-item-text-checked': index === checkedValue }">
        <slot v-if="item.custom">
          <div>{{ item.name }}</div>
        </slot>
        <p v-else>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "FilterRadio",
  props: {
    value: {
      type: Number,
      default: 0,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkedValue: this.value,
    };
  },
  computed: {},
  watch: {
    value(newVal) {
      this.checkedValue = newVal;
    },
    checkedValue(newVal) {
      this.$emit("update:value", newVal);
    },
  },
  methods: {
    clickItem(item, index) {
      if (this.checkedValue === index) return;
      this.checkedValue = index;
      this.$emit("clickItem", index, item);
    },
  },
};
</script>

<style scoped lang="scss">
.greenRoom1 {
  background: #ccc;
}
.list {
  width: 100%;
  font-size: 14px;
  color: #45464a;
  .list-item {
    box-sizing: border-box;
    padding: 4px 6px;
    &-text {
      padding: 0 6px;
      border: 1px solid transparent;
      &-checked {
        position: relative;
        border-radius: 4px;
        border-color: #7263ce;
        color: #7263ce;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
