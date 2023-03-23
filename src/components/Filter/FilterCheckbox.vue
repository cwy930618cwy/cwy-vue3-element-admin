<template>
  <div class="fr">
    <div class="list fr fw_w" :class="{ 'list-more line-1': isMoreShow }">
      <div v-for="(item, index) in list" :key="index" class="list-item1" @click="clickItem(item, $event)">
        <p class="list-item-text fs_0" :class="{
                        'list-item-text-checked':
                            checkedValue.length && checkedValue.map((r) => r.id).includes(item.id),
                    }">
          {{ item.name }}
        </p>
      </div>
    </div>
    <!-- <div class="more fs_0" @click="handelMore" v-if="isMore">
      <div class="fr_c">
        更多
        <el-icon :class="{ 'more-collapse-up': isMoreShow }">
          <ArrowDown />
        </el-icon>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "FilterCheckbox",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
    isMore: {
      type: Boolean,
      default: false,
    },
    checkedValueList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkedValue: this.value,
      isMoreShow: false,
    };
  },
  computed: {},
  watch: {
    value(newVal) {
      this.checkedValue = newVal;
      this.$emit("update:value", this.checkedValue);
    },
  },
  methods: {
    clickItem(item, event) {
      let status = "";
      const checkedValue = this.checkedValueList.find((r) => r.id === item.id);
      if (checkedValue && checkedValue.children.length && !item.init) {
        status = "init";
        item.init = true;
      } else {
        item.init = false;
        if (!this.checkedValue.length) {
          this.checkedValue.push(item);
          status = "add";
        } else {
          if (item.id !== this.checkedValue.find((r) => r.id === item.id)?.id) {
            this.checkedValue.push(item);
            status = "add";
          } else {
            this.checkedValue.splice(
              this.checkedValue.findIndex((r) => r.id === item.id),
              1
            );
            status = "delete";
          }
        }
      }
      this.$emit("update:value", this.checkedValue);
      this.$emit("change", this.checkedValue, item, status);
    },
    handelMore() {
      this.isMoreShow = !this.isMoreShow;
    },
  },
};
</script>

<style scoped lang="scss">
.list {
  width: 100%;
  background-color: #fff;
  font-size: 14px;
  border-radius: 4px;
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
        border-color: #df6250;
        color: #df6250;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
  &-more {
    height: 30px;
  }
}
.more {
  padding-top: 6px;
  font-size: 14px;
  color: rgb(161 161 161);
  &:hover {
    cursor: pointer;
    color: #df6250;
  }
  &-collapse {
    transition: all 300ms;
    &-up {
      transform: rotate(-180deg);
    }
  }
}
</style>
