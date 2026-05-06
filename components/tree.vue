<template>
  <view class="tree">
    <tree-node
      v-for="(node, index) in treeData"
      :key="index"
      :node="node"
      :depth="0"
      @toggle="handleToggle"
    />
  </view>
</template>

<script>
import TreeNode from "./tree-node.vue";

export default {
  name: "Tree",
  components: { TreeNode },
  props: {
    treeData: {
      type: Array,
      default: () => [], // 接收外部传递的树形数据
    },
  },
  methods: {
    handleToggle(node) {
      this.$emit("toggle", node); // 向外暴露“节点切换”事件
    },
  },
};
</script>

<style scoped>
.tree {
  padding: 10rpx;
}
</style>