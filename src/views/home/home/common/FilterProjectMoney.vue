<template>
    <div class="FilterProjectMoney">
        <FilterCell title="筛选金额：">
            <FilterRadio ref="FilterRadio" v-model:value="currentIndex" @clickItem="searchChange" :options="list">
                <div class="custom fr_c">
                    <p>自定义</p>
                    <div class="custom-content fr_c" v-show="currentIndex === list.length - 1">
                        <div class="content-input fr_c fj_sb">
                            <el-input
                                @input="inputCustom('customBegNum', $event)"
                                placeholder="最低"
                                v-model="customBegNum"
                            ></el-input>
                            <p style="width: 14px; height: 1px; background: rgb(204 204 204); margin: 0 6px"></p>
                            <el-input
                                placeholder="最高"
                                @input="inputCustom('customEndNum', $event)"
                                v-model="customEndNum"
                            ></el-input>
                            <span class="content-p">万</span>
                        </div>
                        <div
                            class="fs_0 custom-btn"
                            :class="{ 'custom-btn-ch': customBegNum !== '' && customEndNum !== '' }"
                            @click="blurCustom"
                        >
                            确认
                        </div>
                    </div>
                </div>
            </FilterRadio>
        </FilterCell>
    </div>
</template>

<script>
import FilterCell from "@/components/Filter/FilterCell";
import FilterRadio from "@/components/Filter/FilterRadio";
export default {
    name: "FilterProjectMoney",
    props: {
        pId: {
            type: String,
            default: "",
        },
    },
    components: { FilterCell, FilterRadio },
    inject: ["pro_setParams"],
    data() {
        return {
            list: [
                { id: -1, name: "全部", begNum: null, endNum: null, label: "" },
                { id: 1, name: "10万以下", begNum: 0, endNum: 10, label: "10万以下" },
                { id: 2, name: "10万-50万", begNum: 10, endNum: 50, label: "10万-50万" },
                { id: 3, name: "50万-100万", begNum: 50, endNum: 100, label: "50万-100万" },
                { id: 4, name: "100万-200万", begNum: 100, endNum: 200, label: "100万-200万" },
                { id: 5, name: "500万以上", begNum: 500, endNum: "", label: "500万以上" },
                { id: -2, name: "自定义", custom: true, begNum: "", endNum: "", label: "" },
            ],
            customBegNum: "",
            customEndNum: "",
            currentIndex: 0,
        };
    },
    computed: {},
    watch: {},
    methods: {
        clear() {
            this.currentIndex = 0;
            this.customBegNum = "";
            this.customEndNum = "";
            this.emitChange(this.list[0]);
        },
        searchChange(index, item) {
            //自定义-2
            if (item.id === -2 && this.customBegNum === "" && this.customEndNum === "") {
                return;
            }
            this.emitChange(item);
        },
        inputCustom(type, e) {
            const str = e.replace(/\D/g, "");
            this[type] = str;
            if (str.charAt(0) === "0") {
                this[type] = "";
            }
        },
        blurCustom() {
            const begNum = this.customBegNum;
            const endNum = this.customEndNum;
            if (begNum === "" || endNum === "") return;
            if (begNum === endNum) {
                this.$message({
                     duration: 1000,
showClose: true, type: "warning", message: "请输入正确的金额区间", duration: 5000 });

                return;
            }
            if (endNum !== "" && +begNum > +endNum) {
                this.customEndNum = begNum;
                this.customBegNum = endNum;
            } else {
                this.customEndNum = endNum;
                this.customBegNum = begNum;
            }
            this.emitChange({ id: -2 });
        },
        emitChange(op) {
            let echoText = op.label;
            let data = {
                begNum: "",
                endNum: "",
            };
            //自定义
            if (op.id === -2) {
                data.begNum = this.customBegNum;
                data.endNum = this.customEndNum;
                echoText = `自定义：${data.begNum}万-${data.endNum}万`;
            } else {
                const { begNum, endNum } = op || {};
                data.begNum = begNum;
                data.endNum = endNum;
            }
            data.begNum = data.begNum && (data.begNum * 10000).toString();
            data.endNum = data.endNum && (data.endNum * 10000).toString();

            const params = {
                refNameRoot: this.$options.name,
                data: {
                    dataCurrent: op,
                    leave1: [data.begNum],
                    leave2: [data.endNum],
                },
                echoText,
            };
            this.pro_setParams(params);
        },
    },
    mounted() {},
};
</script>

<style scoped lang="scss">
.FilterProjectMoney {
    .custom {
        position: relative;
        .custom-content {
            position: absolute;
            top: -5px;
            left: 50px;
            width: 300px;
            color: #45464a;
            .content-input {
                padding-left: 12px;
                .content-p {
                    padding: 0 12px;
                    font-size: 14px;
                    color: #45464a;
                }
            }
            .custom-btn {
                padding: 2px 15px;
                border-radius: 20px;
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
        }

        :deep {
            .el-input {
                width: 100px;
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
</style>
