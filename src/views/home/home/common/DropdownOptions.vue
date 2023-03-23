<template>
    <div class="dropdown">
        <div class="fr_c fj_c" @mouseenter="mouseenterSelect" @mouseleave="mouseleaveSelect">
            <div class="dropdown-hd fr_c" :class="{ 'dropdown-hd-active': currentIndex >= 0 }">
                <span class="dropdown-hd-text"> {{ currentName }}</span>
                <el-icon :class="{ 'dropdown-hd-up': dropdownShow }"><ArrowDown /></el-icon>
            </div>
            <div class="dropdown-content" v-show="dropdownShow">
                <div class="content scrollbar">
                    <div
                        class="content-item"
                        v-for="(item, index) in options"
                        :key="index"
                        :class="{ 'content-item-active': currentIndex === index }"
                        @click="handelCurrentItem(item, index)"
                    >
                        {{ item.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true,
        },
        value: {
            type: Number,
            default: -1,
        },
        placeholder: {
            type: String,
            default: "请选择",
        },
    },
    components: {},
    data() {
        return {
            dropdownShow: false,
            currentIndex: this.value,
        };
    },
    computed: {
        currentName() {
            if (this.currentIndex === -1) {
                return this.placeholder;
            }
            return this.options[this.currentIndex].name;
        },
    },
    watch: {
        value(newVal) {
            this.currentIndex = newVal;
        },
        currentIndex(newVal) {
            this.$emit("update:value", newVal);
        },
    },
    methods: {
        handelCurrentItem(item, index) {
            this.currentIndex = index;
            this.dropdownShow = false;
            this.$emit("clickItem", index, item);
        },
        mouseenterSelect(item) {
            this.dropdownShow = true;
        },
        mouseleaveSelect(e) {
            this.dropdownShow = false;
        },
    },
    created() {},
    mounted() {},
};
</script>

<style lang="scss" scoped>
.dropdown {
    position: relative;
    &-hd {
        font-size: 14px;
        background: #fff;
        &-text {
            margin-right: 4px;
        }
        &-up {
            transform: rotate(-180deg);
            color: #df6250;
        }
        &-active {
            padding: 0px 8px;
            color: #df6250;
            border: 1px solid #df6250;
            border-radius: 4px;
        }
        &:hover {
            cursor: pointer;
            color: #df6250;
        }
    }
    &-content {
        position: absolute;
        top: 20px;
        bottom: 0;
        z-index: 9999;
        padding-top: 12px;
        .content {
            min-width: 120px;
            overflow-y: auto;
            height: 200px;
            -webkit-box-shadow: 0 2px 6px 0 rgb(0 0 0 / 19%);
            box-shadow: 0 2px 6px 0 rgb(0 0 0 / 19%);
            text-align: center;
            border-radius: 0 0 4px 4px;
            background: #fff;
            padding: 4px 0;
            &-item {
                padding: 10px 4px;
                color: rgb(102 102 102);
                &-active {
                    color: #df6250;
                    background: rgb(251 238 236);
                }
                &:hover {
                    cursor: pointer;
                    color: #df6250;
                    background: rgb(251 238 236);
                }
            }
        }
    }
}
</style>
