<template>
  <div class="item-company">
    <div class="list" v-for="(item, index) in list" :key="index" :class="{
                'list-last': index === list.length - 1,
            }">
      <div class="list-item1 fr">
        <el-checkbox class="list-checkbox" v-model="item.checked" @change="changeCheckbox(item, $event)"></el-checkbox>
        <div class="item-content f_1" @click="handleDetail(item)">
          <div class="fr_c fj_sb">
            <div class="content-title line-1">
              <div class="line-1" v-html="item.infoTitle"></div>
            </div>
            <span class="fs_0">{{ item.infoPublishTime }}</span>
          </div>
          <div class="content-content">
            <!-- <p class="tag-1">{{ item.dataTag }}</p>
                        <p class="tag-2">{{ item.dataType }}</p>
                        <p class="tag-1">{{ item.provinceAndCity }}</p> -->

            <el-tag style="color: #409eff">{{ item.dataTag }}</el-tag>
            <el-tag type="danger">{{ item.provinceAndCity }}</el-tag>
            <el-tag style="color: #409eff">{{ item.dataType }}</el-tag>
          </div>

          <div class="content-detail">
            <div class="detail-ul">
              <div class="detail-li" v-if="item.zhaoBiaoUnit">
                招标单位：
                <span>{{ item.zhaoBiaoUnit }}</span>
              </div>
              <div class="detail-li" v-if="item.zhaoRelationWay">
                招标联系人：
                <span class="phone">({{ item.zhaoRelationWay }})</span>
              </div>
              <div class="detail-li" v-if="item.dailiRelationWay">
                代理联系人：
                <span class="phone">({{ item.dailiRelationWay }})</span>
              </div>
            </div>
            <div class="detail-ul">
              <div class="detail-li" v-if="item.zhongBiaoUnit">
                中标单位：
                <span>{{ item.zhongBiaoUnit }}</span>
              </div>
              <div class="detail-li" v-if="item.zhongRelationWay">
                中标联系人：
                <span class="phone">({{ item.zhongRelationWay }})</span>
              </div>
              <div class="detail-li" v-if="item.gongshangRelationWay">
                工商联系人：
                <span class="phone">({{ item.gongshangRelationWay }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemCompany",
  inject: ["pro_params"],
  props: {
    itemList: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  data() {
    return {
      list: this.initList(this.itemList),
    };
  },
  computed: {},
  watch: {
    itemList(newVal) {
      this.initCheckbox(newVal);
    },
  },
  methods: {
    handleDetail(item) {
      const routeData = this.$router.push({
        path: "/detail",
        query: { infoId: item.infoId, keywords: this.$parent.page.keywords },
      });
      // window.open(routeData.href, "_blank");
    },
    /**
     * 初始化选中状态
     * @param list 初始化数据
     * @param checkedStatus 初始化数据状态
     * @param checkedId 单个数据初始化数据id
     */
    initCheckbox(list, checkedStatus, checkedId) {
      this.list = this.initList(list, checkedStatus, checkedId);
      this.checkedStatus();
    },
    initList(list, checkedStatus = false, checkedId) {
      return list.map((item) => {
        // 为真表示点击某个选择框，只更新某一个数据；为假表示是初始化所有数据
        if (checkedId) {
          checkedId === item.infoId && (item.checked = checkedStatus);
          // item.isUnlock === 1 && (item.titleText = item.title);
        } else {
          //解锁状态不能选中
          item.checked = checkedStatus;
        }
        return item;
      });
    },
    //选中状态
    checkedStatus() {
      const filterList = this.list;
      const isCheckedAll = filterList.length ? filterList.every((r) => r.checked) : false; //全选状态
      const checkedList = this.list.filter((r) => r.checked); //选中值
      this.$emit("checked", isCheckedAll, checkedList);
    },
    changeCheckbox(item, checkedStatus) {
      this.initCheckbox(this.list, checkedStatus, item.infoId);
      this.checkedStatus();
    },
  },
};
</script>

<style scoped lang="scss">
.item-company {
  margin-bottom: 62px;
  position: relative;
  .list {
    border-bottom: 1px solid #e9e9e9;
    padding: 18px 0;
    .list-item1 {
      .list-checkbox {
        padding-bottom: 12px;
      }
      .item-content {
        padding-left: 16px;
        cursor: pointer;
        .content-title {
          font-size: 14px;
          color: #333;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
            color: rgb(69 70 74);
          }
        }
        .content-content {
          margin-top: 15px;
          .el-tag {
            margin-right: 12px;
            border: 0;
            border-radius: 4px;
            padding: 6px 12px 7px;
            font-size: 14px;
          }
        }
        .content-detail {
          .detail-ul {
            display: flex;
            margin: 10px 0;
            .detail-li {
              margin-right: 100px;
            }
            .phone {
              color: cornflowerblue;
            }
          }
        }
      }
    }
    .list-content {
    }
    &-last {
      border-bottom: none;
    }
  }
}
</style>
