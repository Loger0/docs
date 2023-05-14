---
highlight: a11y-dark
---

## Chrome盒模型和IE盒模型

- 标准的盒子模型组成部分： margin + border + padding + content
- IE盒子模型组成部分： margin + content(border + padding + content)

> 两者的区别在于content内容部分，IE的content由(border + padding + content)组成，通常我们在写样式时IE盒子模型会比较可控，Chrome盒子模型在添加padding/border时会额外增加宽度/高度，所有使用IE盒子模型则不需要考虑宽高，设置的值为多少就多少

## 标签元素

1. 行内元素

```html
<span>、<a>、<b>、<strong>、<img>、<input>、<textarea>、<select>、<em>、<del>
```

2. 块元素

```html
<address>、<center>、<h1>~<h6>、<p>、<pre>、<ul>、<ol>、<dl>、<table>、<div>、<form>
```

3. 单标签

```html
<br>、<hr>、<img>、<input>、<param>、<meta>、<link>
```

4. es6新增标签

- section：表示页面中的一个内容区块
- article：表示页面中的一块与上下文不相关的强立内容
- aside：表示article元素的内容之外的
- header：表示页面中一个内容区块或整个页面的标题
- footer：表示整个页面或页面中一个内容区块的脚注；一般会包含创作者的姓名、创作日期以及创作者联系信息
- nav：表示页面中导航链接的部分
- figure：表示一段独立的流内容，一般表示文档主体流内容中的一个独立单元。使用figcaption元素为figure元素组添加标题
- video：定义视频
- audio：定义音频
- embed：用来插入各种多媒体，格式可以是Midi、Wav、AIFF、AU、MP3等
- mark：主要用来在视觉上向用户呈现那些需要突出显示或高亮显示的文字
- meter:进度

  ```html
  <meter value="2" min="0" max="10">2 out of 10</meter><br>
  <meter value="0.6">60%</meter>
  ```

- progress：表示运行中的进程，可以用progress元素显示JS中耗费时间的函数的进程

  ```html
   <progress value="22" max="100"></progress>
  ```  

- time：表示日期或时间，也可以同时表示两者
- ruby：表示ruby注释(中文注音或字符)
- rt：表示字符(中文注音或字符)的解释或发音
- canvas：表示图形，比如图表和其他图像。这个元素本身没有行为，仅提供一块面 布，但它把一个绘图API展现给客户端JavaScript
- command：表示命令按钮， 比如单选按钮、复选框或按钮

### 行内元素和块级元素的区别

1. 行内元素和块级元素可以通过display属性相互转换 ( block:块元素 inline:行内元素 inline-block块元素)
2. 块元素的特点： 独占一行，宽度100%
3. 行内元素的特点： 多个行内元素会并排显示，宽高由内容撑起，不可以设置盒子宽高，外边距设置left/right会失效
4. 行内块则包含了块元素和行内元素的特点，宽高由内容撑起，可以设置宽高，外边距有效

## BFC

1. ***BFC全称 Block Formatting Context*** 块级格式化上下文
2. BFC的特性就是内部元素不会影响到外部元素

### 触发BFC条件

1. 根元素
2. 浮动元素。元素的 float 不是 none
3. 绝对定位元素。元素的 position 为 absolute 或 fixed
4. 行内块元素。元素的 display 为 inline-block
5. 表格单元格。元素的 display为 table-cell，HTML表格单元格默认为该值
6. 表格标题。元素的 display 为 table-caption，HTML表格标题默认为该值
7. 匿名表格单元格元素。元素的 display为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table
8. overflow 值不为 visible 的块元素
9. 弹性元素。display为 flex 或 inline-flex元素的直接子元素
10. 网格元素。display为 grid 或 inline-grid 元素的直接子元素

## flex弹性盒子

设为 `flex` 布局以后，子元素的 `float、clear` 和`vertical-align`属性将失效

使用flex布局可以更便捷快速的进行布局

### flex常用属性

1. display: flex; 把盒子转换为flex布局
2. flex-direction: column; 设置主轴方向
3. flex-wrap: wrap; 是否换行显示
4. justify-content: center; 主轴方向的子元素排列方式
5. align-item: center; 侧轴方向的子元素排列方向
6. ...

## H5新特性

- `Canvas绘图`
- `SVG绘图`
- `地理定位`
- `Web Worker`
- `web worker` 是运行在后台的 JS，独立于其他脚本，不会影响页面的性能。
- `Web Storage`
- 1.Cookie技术 （ 兼容性好,数据不能超4kb,操作复杂）
- 2.（兼容性差,数据8MB,操作简单）sessionStorage
- 3.localStorage
- (6)`Web Socket`
- WebSocket协议是基于TCP的一种新的网络协议。它实现了浏览器与服务器全双工(full-duplex)通信——允许服务器主动发送信息给客户端。

## position有哪些属性

**1. position: relative;相对定位**

**2. position: absolute;绝对定位**

**3. position: fixed;固定定位**

**4. position:static**：**默认值**

**5. position: sticky 粘性定位**

**6. position: inherit 规定应该从父元素继承 position 属性的值**

**7. position: initial 设置该属性为默认值**

## 1px，1rem，1vh，1em各自代表的含义

px

代表1个像素相对于你的电脑分辨率，分辨率不同1px大小也不一样

rem

相对于html根元素的字体大小，通常在移动端适配不同屏幕尺寸时使用

vh

相对于浏览器可视窗口，相当于屏幕宽度的1%

em

相对于该元素的字体大小

## 什么是SPA？

单页面应用，全称***Single Page Application***,是加载单个HTML页面并在用户与应用程序交互时动态更新该页面。它将所有活动局限于一个web页面中，仅在该web页面初始化时加载相应的HTML、JavaScript、css。一旦页面加载完成，SPA不会因为用户的操作而进行页面的重新加载或者跳转，而是利用JavaScript动态的变换HTML（采用的是div切换显示和隐藏），从而实现UI与用户的交互。在SPA应用中，应用加载之后就不会再有整页刷新。相反，展示逻辑预先加载，并有赖于内容Region(区域)中的视图切换来展示内容。

>单页面应用的关键就是通过路由进行不同组件的切换，实现不同页面的效果

> **缺点：**
>
>- 1.不利于SEO。
>- 2.初次加载耗时相对增多。
>- 3.导航不可用，如果一定要导航需要自行实现前进、后退。

## 优雅降级与渐进增强

**优雅降级**： 一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

**渐进增强**： 先实现最基本的功能，根据一些高级浏览器进行效果和交互上追加功能
