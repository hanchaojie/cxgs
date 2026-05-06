<template>
	<view class="tree-node">
		<!-- 节点头部：包含箭头、标签、自定义内容（如“正在播放”） -->
		<view class="node-header" @click="toggleExpanded">
			<!-- 箭头图标（使用 UniApp 内置图标更方便） -->
			<uni-icons v-if="node.children && node.children.length" :type="node.expanded ? 'down' : 'right'" size="18"
				class="arrow-icon" />
			<text class="node-label">{{ node.label }}</text>
			<text v-if="!node.children&&node.isPlaying" class="playing-tag">正在播放</text>
		</view>

		<!-- 子节点容器：展开时渲染子节点（递归调用自身） -->
		<view v-if="node.expanded && node.children && node.children.length" class="children-container">
			<tree-node v-for="(child, index) in node.children" :key="index" :node="child" :depth="depth + 1"
				@toggle="handleChildToggle" />
		</view>
	</view>
</template>

<script>
	export default {
		name: "TreeNode",
		props: {
			node: {
				type: Object,
				required: true, // 单个节点的数据
			},
			depth: {
				type: Number,
				default: 0, // 节点层级（控制缩进）
			},
		},
		data() {
			return {
				id: '',
			}
		},
		methods: {
			// 切换“展开/收起”状态
			toggleExpanded() {
				if (this.node.children && this.node.children.length) {
					this.node.expanded = !this.node.expanded;
					// this.$emit("toggle", this.node); // 向外触发事件
				} else {
					console.log(this.node)
					this.$nextTick(function() {
						this.node.isPlaying = !this.node.isPlaying;
						// this.id = this.node.id
					});
					this.$emit("toggle", this.node); // 向外触发事件
				}
			},
			// 传递子节点的 toggle 事件
			handleChildToggle(childNode) {
				console.log(childNode)
				this.$emit("toggle", childNode);
			},
		},
	};
</script>

<style scoped>
	.tree-node {
		display: flex;
		flex-direction: column;
	}

	.node-header {
		display: flex;
		align-items: center;
		padding: 10rpx;
		margin: 5rpx 0;
	}

	.arrow-icon {
		margin-right: 10rpx;
	}

	.node-label {
		flex: 1;
	}

	.playing-tag {
		color: blue;
		margin-left: 10rpx;
	}

	.children-container {
		padding-left: 40rpx;
		/* 层级越深，缩进越大 */
	}
</style>