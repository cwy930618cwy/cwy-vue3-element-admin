<template>
  <div class="body-right">
    <h5>友情提示</h5>
    <p>
      <el-icon>
        <Search />
      </el-icon>搜索关键词
    </p>
    <span>在关键词使用过程中，可以通过特定符号表示“词与词”之间的连接关系</span>
    <span>1）“,”表示“或” 满足任意一个关键词</span>
    <span>举例：输入“ICT,网络,系统” 查询结果为包含“ICT”，或者包含“网络”，或者包含“系统”的标文</span>
    <span>2）“+”表示“且” 需要满足所有关键词</span>
    <span>举例：输入“ICT+网络+系统” 查询结果为包含“ICT”，并且包含“网络”，并且包含“系统”的标文</span>
    <span>3）“+”“,”组合使用 程序优先执行“且”，然后执行“或”</span>
    <span>举例：输入“ICT+网络,系统” 查询结果为同时包含“ICT”和“网络”的数据，或者单独包含“系统”的标文</span>
    <p>
      <el-icon>
        <UploadFilled />
      </el-icon>上传搜索内容
    </p>
    <span>我们可以通过上传指定Excel、WPS的关键词内容，批量查询标文</span>

    <span>需要参照指定的模板进行格式调整，详见（高级搜索->搜索内容->上传->导出模板)</span>
  </div>
</template>

<script>
export default {
  name: "helpfulHints",
};
</script>

<style scoped lang="scss">
.body-right {
  width: 236px;
  padding: 30px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 5%);
  h5 {
    font-weight: 600;
    font-size: 16px;
    color: rgb(51 51 51);
    padding-bottom: 12px;
    border-bottom: 1px solid rgb(233 233 233);
    &::before {
      content: '';
      display: inline-block;
      background-color: #7263ce;
      width: 3px;
      height: 14px;
      border-radius: 2px;
      vertical-align: middle;
      margin-right: 6px;
    }
  }

  p {
    margin-top: 20px;
    font-weight: bold;
    font-size: 14px;

    .el-icon {
      margin-right: 6px;
      vertical-align: text-top;
    }
  }

  span {
    display: block;
    font-size: 12px;
    margin-top: 10px;
  }
}
</style>
