<template>
    <div class="FilterKeywordOut fr_c">
        <el-popover
            placement="top-start"
            :width="400"
            title="排除词介绍："
            trigger="hover"
            content="可去除干扰词，使匹配信息更准确，如：设置关键词“面粉”，添加排除词“墙面粉刷”，则会将匹配结果中含有“墙面粉刷”的内容过滤掉。"
        >
            <template #reference><img class="key-tip" src="@/assets/img/icon-success-fill.png" alt="" /> </template>
        </el-popover>
        <div class="fs_0" style="display: flex">
            标题排除词：
            <p class="line-folding">
                正在搜索关键词"<span>{{ pro_params().keywords }}</span>"
            </p>
            ，但不包含
        </div>
        <div class="fr_c key-content">
            <el-input placeholder="请输入排除词" v-model="list[0]" />
            <p class="key-ps">且</p>
            <el-input placeholder="请输入排除词" v-model="list[1]" />
            <p class="key-ps">且</p>
            <el-input placeholder="请输入排除词" v-model="list[2]" />
            <div class="key-button fs_0" :class="{ 'key-button-ch': checked }" @click="clickBtn">确认</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "FilterKeywordOut",
    props: {},
    components: {},
    inject: ["pro_setParams", "pro_params"],
    data() {
        return {
            list: ["", "", ""],
            keywords: "",
            oldVal: {},
        };
    },
    computed: {
        checked() {
            if (Object.keys(this.oldVal).length && this.oldVal.data.leave1.length) {
                return true;
            }
            return this.list.some((r) => r);
        },
    },
    watch: {},
    methods: {
        clear() {
            this.list = ["", "", ""];
            this.emitChange(this.list);
        },
        clickBtn() {
            if (this.checked) {
                this.emitChange(this.list);
            }
        },
        emitChange(op) {
            const effectiveList = op.filter((r) => r);
            let leave1 = [];
            let echoText = "";
            if (effectiveList.length > 0) {
                leave1 = [effectiveList.join(",")];
                echoText = "排除词：" + effectiveList.join("|");
            }
            const params = {
                refNameRoot: this.$options.name,
                data: {
                    dataCurrent: effectiveList,
                    leave1,
                    leave2: [],
                },
                echoText,
            };
            this.oldVal = params;
            this.pro_setParams(params);
        },
    },
    mounted() {},
};
</script>

<style scoped lang="scss">
.FilterKeywordOut {
    // padding-top: 12px;
    .key-tip {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-right: 4px;
        cursor: pointer;
    }
    .key-ps {
        padding: 0 12px;
    }
    .key-button {
        margin-left: 12px;
        padding: 2px 15px;
        border-radius: 20px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background: #d9d9d9;
        &:hover {
            cursor: not-allowed;
        }
        &-ch {
            border: 1px solid #df6250;
            color: #df6250;
            background-color: #fff;
            &:hover {
                background-color: #df6250;
                color: #fff;
                cursor: pointer;
            }
        }
    }
    .key-content {
        padding-left: 10px;
        :deep {
            .el-input {
                width: 128px;
                .el-input__wrapper {
                    border-radius: 40px;
                    .el-input__inner {
                        height: 28px;
                        line-height: 32px;
                    }
                }
            }
        }
    }
}
.line-folding {
    color: #999;
    span {
        max-width: 300px;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
        color:#df6250;
    }
}
</style>
