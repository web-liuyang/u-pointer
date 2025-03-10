### TODO

[√] Interaction Canvas
[√] Matrix
[√] 重构属性为可写
[√] Renderer
[√] 图形结构调整
[√] 样式, 继承
[√] AABB/hitTest. 图片的aabb需要通过某种方法计算, 等uni-x支持图片请求后通过ArrayBuffer进行计算.
[ ] iOS, Andriod 的 Text 只能获取到宽度, 所以无法计算 aabb, 等支持

记：

1. 当前坐标系是屏幕坐标系，即 0,0 在左上角. 矩形遵守顺时针原则
2. 所有图形的方法应该都获取的是基于自身（local）的数据，如果想要转化成全局（global）的数据，应该通过某种方法。
3. 在paint前,会注入uCanvas的实例
4 .Matrix 基点尚未确定，目前图形的基点是在左上角

u-canvas-component 没啥必要, 内部也没有什么好简化的部分, 而且反而还复杂了许多

### Bug

[ ] u-pointer 一直手指全局按下,一直手指局部按下, 局部信息会显示全局按下的信息
    复现步骤: 第二根手指按到了 if 或 v-for length = 0 上. 但这应该是正常的, 毕竟dom都没了肯定也就不触发了.
[ ] iOS 多次设置字体粗细属性后会导致错乱, 所以iOS暂时无法使用字体粗细

### Issue

[√] Path2D 绘制原点与 Context 绘制原点不一致. 8748
[√] uni.createCanvasContextAsync 在 IOS 上报错. 14065
[√] putImageData 无法绘制自定义的ImageData. 15053
[√] options 名称被编译器占用. 15107
[ ] 设置别名后 无法导入类型. 15105
[√] 请求图片闪退. 15166
[ ] 无法发布自定义组件库. 15425

[√] 客户端 父级触摸事件会触发两次，在嵌套的情况下. 9901 -> 14285
[ ] h5 无法触发 tap事件
[ ] @/u-canvas 可以访问类型与值，@u-canvas不可以访问类型，但可以访问值
[ ] .uvue 后缀只能导出Type，导出Interface不可以用
[ ] workspace 无法导入组件

roundRect/strokeText/createPath2D 文档错误
