# 超强的日期时间选择组件

专用的时间选择组件，支持单个年份及范围、年月及范围、年月日及范围、年月日时及范围、年月日时分及范围、年月日时分秒及范围

### 参数配置

| 参数及回调          | 类型            | 默认值        | 说明                                                                                                    |
| :------------- | :------------ | :--------- | :---------------------------------------------------------------------------------------------------- |
| placeholder    | String        | 请选择        | 非时间范围选择提示语                                                                                            |
| isRange        | Boolean       | false      | 是否是时间范围选择                                                                                             |
| format         | String        | yyyy-MM-dd | 格式：yyyy、yyyy-MM、yyyy-MM-dd、HH\:mm\:ss、HH\:mm、HH、yyyy-MM-dd HH\:mm\:ss、yyyy-MM-dd HH\:mm、yyyy-MM-dd HH |
| disabled       | Boolean       | false      | 禁用                                                                                                    |
| value          | String，Arrary | null、\[]   | 绑定的值，时间范围为\[],单个时间为null                                                                               |
| border         | Boolean       | false      | 边框                                                                                                    |
| clearable      | Boolean       | false      | 清除按钮显示                                                                                                |
| rangeSeparator | String        | -          | 时间范围选择分隔符                                                                                             |
| selectorStyle  | String        | ''         | 组件样式，例：height:10px                                                                                    |
| align          | String        | left       | 对齐方式\:left、center、right，isRange为true无效                                                                |
| start          | String        | ''         | 限制开始时间范围                                                                                              |
| end            | String        | ''         | 限制结束时间范围                                                                                              |

### 回调方法

| 方法名    | 类型       | 回调说明                      |
| :----- | :------- | :------------------------ |
| change | Function | 点击确定和清空时触发，范围回调数组，单个回调字符串 |
| cancel | Function | 点击取消的触发                   |

示例

```html
<template>
	<fly-date-time v-model="value" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" :border="true" :disabled="false" @change="onChange" @cancel="onCancel"/>
	<fly-date-time v-model="value2" isRange format="yyyy-MM-dd HH:mm:ss" :clearable="false" :border="true" :disabled="false" @change="onChange" @cancel="onCancel"/>
</template>
<script>
    export default {
        data() {
            return {
                value:'',
				value2:[],
            }
        },
        methods: {
            onChange(val){
                console.log(val);
            },
			onCancel(){
			}
        }
    }
</script>
```

