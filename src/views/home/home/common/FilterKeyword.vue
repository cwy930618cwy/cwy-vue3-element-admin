<template>
  <Header ref="Header" @changeSearch="changeSearch"></Header>
</template>

<script>
import Header from "@/components/Header/index.vue";
export default {
  name: "fwords",
  props: {},
  components: { Header },
  inject: ["pro_setParams"],
  data() {
    return {
      initData: {},
    };
  },
  computed: {},
  methods: {
    init(obj = {}) {
      console.l.og('this----', this)
      this.$refs.Header.initData(obj)
    },
    changeSearch(data) {
      this.emitChange(data);
    },
    emitChange(op) {
      const data = {
        searchRange: +op.searchRange,
        keywords: op.keywords,
        // searchModel: op.searchModel,
      };
      let echoText = "";
      const params = {
        refNameRoot: this.$options.name,
        dataCurrent: data,
        data,
        echoText,
      };
      this.pro_setParams(params);
    },
  },
  mounted() {
    console.log('this-----, ', this.$refs.Header)
    const q = this.$route.query;
    const params = {
      searchRange: q.searchRange === undefined ? "0" : q.searchRange,
      keywords: q.keywords,
      // searchModel: q.searchModel === undefined ? "1" : q.searchModel,
    };
    this.$refs.Header && this.$refs.Header.initData(params);

    if (Object.keys(q).length) {
      this.emitChange(q);
    }
  },
};
</script>
<style lang="scss" scope></style>
