---
highlight: a11y-dark
---

### VUE渲染流程

## 初始化数据

- 对data中的数据进行数据劫持
- Vue2使用了Object.defineProperty()给每个属性添加get,set方法进行数据监听
- 但是有两种情况 （1）对象 （2）数组
- 对象使用的是Object.defineProperty()
- 数组使用的是对Array方法进行重写，在调用push,pop...方法时，会进入我们重写数组方法中

```js
// 添加数据劫持
function defineReactive(data, key, value) {
  observe(value) // 递归
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      // 添加值也需要劫持
      if (value === newValue) return
      observe(newValue)
      value = newValue
    },
  })
}
```

```js
// 1. 获取原来的数组方法
let oldArrayProtoMethods = Array.prototype

// 2. 继承
export let ArrayMethods = Object.create(oldArrayProtoMethods)

// 3. 劫持数组里面的所有方法
let methods = ['push', 'pop', 'shift', 'unshift', 'splice'] // 常用改变数组的方法

methods.forEach((item) => {
  ArrayMethods[item] = function (...args) {
    // 调用原来的方法
    let result = oldArrayProtoMethods[item].apply(this, args)
    // 数组追加对象的情况
    let inserted
    switch (item) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    let ob = this.__ob__
    if (inserted) {
      ob.observeArray(inserted)
    }
    return result
  }
})
```

> 完成数据初始化我们修改data中的数据则可以被监听到，这一步是在beforeCreate中完成，这也是created函数中为什么获取不到data中数据的原因

## 编译渲染模板

- 通过el属性或者$mount的参数获得对应的标签
- 查看我们的属性中有没有render函数,template模板，el属性/$mount方法
- 这三个属性是有优先级的 el属性是必须要有的,如果有el属性，会查看有没有template属性，有template会查看有没有render函数， 顺序由高到低 render -> template -> el
- 拿到模板之后开始编译，分一下步骤，

1. 将html变成ast语法树
2. 将ast语法树转换为render函数
3. render函数转换成虚拟DOM
4. 虚拟DOM生成真实DOM
5. 挂载到页面上

```js
ast语法树格式:

 {
   tag: 'div',  // 标签
   attrs: [{id:'app'}],  // 属性
   children: [  // 子节点
     {
       tag: null,
       text: 'hello'
     },
     {
       tag: 'div'
     }
   ]
 }
```

```js
render函数格式：

// <div id="app">hello{{name}}<h1></h1></div>
// _c 解析标签
// _v 解析文本
// _s 解析模板字符串
_c('div',{id:app},_v('hello'+_s(name)), _c('h1')) // 有子节点继续在后面追加
```

```js
虚拟DOM的格式：

{
  children:[] // 子级 格式也是一样的
  data: {id: 'app', style: {…}} // 标签中的属性
  el: div // DOM元素
  key: "id" // 属性的键
  tag: "div" // 元素标签名
  text: "hello" // 文本
}
```

> Vue中渲染模板还使用到了diff算法进行比对，提高性能
