<template>
    <div>
        <FilterCell title="行业分类：">
            <FilterRadio ref="FilterRadio" v-model:value="currentIndex" @clickItem="searchChange" :options="list">
            </FilterRadio>
        </FilterCell>
    </div>
</template>

<script>
import FilterCell from "@/components/Filter/FilterCell";
import FilterRadio from "@/components/Filter/FilterRadio";
export default {
    name: "FilterIndustry",
    props: {},
    components: { FilterCell, FilterRadio },
    inject: ["pro_setParams"],
    data() {
        return {
            list: [
                { id: -1, name: "全部" },
                { id: "货物", name: "货物" },
                { id: "工程", name: "工程" },
                { id: "服务", name: "服务" },
            ],
            currentIndex: 0,
        };
    },
    computed: {},
    watch: {},
    methods: {
        clear() {
            this.currentIndex = 0;
            this.emitChange(this.list[0]);
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
};
</script>

<style scoped lang="scss"></style>
