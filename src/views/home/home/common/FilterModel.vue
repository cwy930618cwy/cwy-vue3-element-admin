<template>
    <div ref="FilterItem">
        <FilterCell title="搜索模式：">
            <FilterRadio ref="FilterRadio" v-model:value="currentIndex" @clickItem="searchChange" :options="list" />
        </FilterCell>
    </div>
</template>

<script>
import FilterCell from "@/components/Filter/FilterCell";
import FilterRadio from "@/components/Filter/FilterRadio";
export default {
    name: "FilterModel",
    props: {},
    components: { FilterCell, FilterRadio },
    inject: ["pro_setParams"],
    data() {
        return {
            list: [
                { id: 1, name: "精准" },
                { id: 2, name: "模糊" },
            ],
            currentIndex: 0,
        };
    },
    computed: {},
    watch: {},
    methods: {
        init(id = 1) {
            this.currentIndex = id;
            this.emitChange({ ...this.list[id], name: "" });
        },
        clear() {
            this.currentIndex = 0;
            this.emitChange({ ...this.list[this.currentIndex], name: "" });
        },
        searchChange(index, item) {
            this.emitChange(item);
        },
        emitChange(op) {
            let echoText = op.name;
            const params = {
                refNameRoot: this.$options.name,
                data: {
                    dataCurrent: op,
                    leave1: [op.id],
                    leave2: [],
                },
                echoText,
            };
            this.pro_setParams(params);
        },
    },
    mounted() {},
    created() {
        //如果是详情页跳转，设置搜索模式为‘精准’
        if (this.$route.query.path === "detail") {
            this.currentIndex = 0;
        }
    },
};
</script>

<style scoped lang="scss"></style>
