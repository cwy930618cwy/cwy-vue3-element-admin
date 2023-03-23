<template>
    <div
        class="company-info"
        v-if="$parent.companyName && ($parent.historyBidRecord || $parent.historyWinTheBidRecord)"
    >
        <h3>{{ $parent.companyName || "-" }}</h3>
        <p>
            <a @click="record('3')"
                >{{ $parent.historyBidRecord }}条<el-icon><ArrowRight /></el-icon
            ></a>
            <span>历史招标记录</span>
        </p>
        <p>
            <a @click="record('4')"
                >{{ $parent.historyWinTheBidRecord }}条<el-icon><ArrowRight /></el-icon
            ></a>
            <span>历史中标记录</span>
        </p>
    </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";

import { useRouter } from "vue-router";
export default {
    name: "FilterCompanyInfo",
    props: {},
    inject: ["pro_setParams", "pro_params"],
    data() {
        return {};
    },
    computed: {},
    watch: {},
    methods: {
        record(value) {
            // value为搜索框中的下拉类型
            // const params = {
            //     searchRange: value,
            //     keywords: companyName,
            // };
            // this.emitChange(params);
            const newpage = this.$router.resolve({
                path: "/index",
                query: {
                    keywords: this.$parent.companyName,
                    searchRange: value,
                },
            });
            window.open(newpage.href, "_blank");
        },
        // emitChange(op = {}) {
        //     const data = {
        //         searchRange: op.searchRange,
        //         keywords: op.keywords,
        //         // searchModel: op.searchModel,
        //     };
        //     let echoText = "";
        //     const params = {
        //         refNameRoot: this.$options.name,
        //         dataCurrent: data,
        //         data,
        //         echoText,
        //     };
        //     this.pro_setParams(params);
        // },
    },
    mounted() {},

    created() {},
};
</script>

<style scoped lang="scss">
.company-info {
    padding: 20px 24px;
    background-color: #fff;
    border-radius: 4px;
    display: flex;
    font-size: 14px;
    margin-bottom: 20px;
    justify-content: center;
    align-items: center;
    width: 944px;
    border-radius: 4px;
    box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 5%);
    h3 {
        flex: 2;
        font-weight: normal;
        border-right: 1px solid #eee;
    }
    p {
        margin-left: 30px;
        a {
            display: block;
            cursor: pointer;
            font-weight: bold;
            color: #df6250;
            .el-icon {
                font-size: 12px;
                vertical-align: text-bottom;
            }
        }
        span {
            display: block;
            margin-top: 4px;
        }
    }
}
</style>
