<template>
    <div class="system-empty fr_c" :style="{ height: height + 'px' }">
        <img src="@/assets/img/no-data.png" class="list_none" />
        <div style="margin-left: 32px" class="fc_fs">
            <p>建议您：</p>
            <p>· 适当扩大搜索时间和地区；</p>
            <p>· 适当删减或更改搜索关键词；</p>
            <p>· 如需查询多关键词，之间可用“,”隔开，如：“ICT,网络,系统”，用“+”隔开，会更准确，如：“ICT+网络+系统”。</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: "没有检索到相关数据",
        },
        // 1.数据为空 2.无服务
        type: {
            type: Number,
            default: 1,
        },
        height: {
            tpye: Number,
            default: 500,
        },
    },
    data() {
        return {
            privateText: this.text,
        };
    },
    methods: {
        empty(type, text) {
            this.privateText = text;
        },
    },
};
</script>

<style lang="scss" scoped>
.system-empty {
    padding: 50px 90px;
    height: 100%;
    color: rgb(102 102 102);
    img.list_none {
        width: 187px;
        height: 171px;
    }
    p {
        padding: 4px 0;
    }
}
</style>
