### piaoyiStep 步骤条

**使用方法：**

```
<piaoyi-steps :current="current" :list="list" />
```

```
import piaoyiSteps from '@/uni_modules/piaoyi-steps/components/piaoyi-steps/piaoyi-steps.vue'
export default {
    components: {
        piaoyiSteps
    },
    data() {
        return {
        	current: 0,
        	list: [{
        		name: '进度一',
        		details: '描述一',
        		label: '测试'
        	},{
        		name: '进度二',
        		details: '描述二'
        	},{
        		name: '进度三',
        		details: '描述三'
        	},{
        		name: '进度四',
        		details: '描述四'
        	}]
        }
    },
	components: {
		piaoyiSteps
	},
	methods: {
		changeCurrent() {
			if (this.current < this.list.length) {
				this.current++
			} else {
				this.current = 0
			}
		}
	}
}
```
#### 使用说明

此插件使用于审核流程功能的进度条，简单来说就是current=0的时候第一项并非完成状态而是审核状态，进入下一阶段第一项才会显示完成状态

#### 支持自定义内容数据，可扩展能力强

插件内部speedcon-item可以扩展复制多个展示更多信息
```
<view class="speedcon">
	<view class="speedcon-item">{{item.details}}</view>
	<view class="speedcon-item" v-if="item.label">{{item.label}}</view>
</view>
```

#### Prop

| 参数名称 | 描述                           |
| -------- | ------------------------------ |
| current | 索引 |
| list | 进度条内容, list: [{name: '进度一', details: '描述一', label: '测试'}], details和label非必填 |

### 可接定制化组件开发
### 右侧有本人代表作小程序二维码，可以扫码体验
### 如使用过程中有问题或有一些好的建议，欢迎加QQ群互相学习交流：120594820