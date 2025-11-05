现在我需要一个 dialog 弹窗计时器组件：

0. 写在 web/src/components/下
1. 弹窗不可手动关闭，不可 esc 关闭，没有 x 按钮，圆角，背景为透明黑色；
2. 计时器会显示“Working.....x seconds passed”字样，其中 x 每秒+1
3. 写法同 components 下的其他组件写法，其 index.ts 中写一个 class
4. 组件销毁时清除计时器
5. 组件暴露 start 和 stop 两个方法。start 就会弹出 dialog 并开始计时，stop 会关闭 dialog 并停止计时
6. 弹出、关闭的时候有渐变特效
