---
highlight: a11y-dark
---

# 前言

watch在开发中的4种用法

```js
watch: {
    // 第一种
    abc(newValue,oldValue){
    
    }
    
    // 第二种
    abc: {
        handler(newValue,oldValue){
        
        },
        deep: true,
        immediate: true
    }
    
    // 第三种
    'obj.name': [
        {
        function () {
            console.log(1) this.bb++ 
        }, 
        { 
        handler: function (val, oldVal) {
            console.log(2) this.aa++ 
        }, 
        immediate: true 
        }
    ]
    
    // 第四种
    abc: 'fn' // 调用methods中的函数
},
methods: {
    fn(newValue,oldValue){
    
    }
}
```

所以需要考虑多种情况去写我们的watch

## 格式化watch

因为watch有多种写法，不能去写4种解决方案，我们需要把所有情况处理成相同的结果，最终传递到`$watch`方法中去进行初始化

```js
// 初始化 watch
function initWatch(vm) {
  // 通过实例拿到 watch 对象
  let watch = vm.$options.watch
  // watch 是一个对象 通过遍历 watch 拿到所有的对象
  for (let key in watch) {
    let handler = watch[key]
    // 下面的就是处理不同情况
    if (Array.isArray(handler)) {
      // 数组
      handler.forEach((item) => {
        createrWatcher(vm, key, item)
      })
    } else {
      // 对象 字符串 函数
      createrWatcher(vm, key, handler)
    }
  }
}
```

这里把处理好的数据传递到 `createrWatcher` 函数

## 分情况处理 watch

现在我们先创建一个 `createrWatcher` 函数

```js
function createrWatcher(vm, exprOrfn, handler, options) {
  // 判断 handler 类型
  if (typeof handler === 'object') {
    // options 代表 deep immediate 这些配置项
    options = handler // 用户得配置项
    handler = handler['handler'] // 函数
  }

  // 这一步就是当我们的函数为字符串时，就要从实例上拿到方法
  if (typeof handler === 'string') {
    handler = vm[handler] // 将实例上的方法作为handler
  }

  // watch 最终处理 $watch 方法
  return vm.$watch(vm, exprOrfn, handler, options)
}
```

## 创建\$watch实例方法

```js
vm.prototype.$watch = function (Vue, exprOrfn, handler, options = {}) {
    // 实现 watch 方法 就是 new Watcher 渲染的时候走渲染 watcher
    // 给配置项传递 user:true 就是为了区分是渲染的 watcher 还是用户的 wathcer
    let watcher = new Watcher(Vue, exprOrfn, handler, {
      ...options,
      user: true,
    })
    
    // 当配置项 immediate 为true时，就立即执行handler方法
    if (options.immediate) {
      // 拿到当前的值，传递到handler方法中
      let value = Vue[exprOrfn]
      handler.call(Vue, value)
    }
}
```

## 给watch中的属性添加watcher

当 `watch` 的依赖数据发生变化时，`dep`会通知`watcher`更新，这个时候就可以获取到最新的数据，通过调用，`watch`中传递的`handler`函数，把新值和旧值传递进去，供开发者使用，这里可以粗略的看看实现代码

1.  判断是执行渲染的还是执行用户的，这里具体说用户的`watcher`

```js
// 判断
if (typeof exprOrfn === 'function') {
  this.getters = exprOrfn
} else {
  this.getters = function () {
    // watch 的属性可能是 'c.c.c' 的字符串，c:{c:{c:123}} 这样的解构，所以需要做一个循环
    let path = exprOrfn.split('.')
    let obj = vm
    for (let i = 0; i < path.length; i++) {
      // 比如 vm.c 等于 {c:{c:123}} 把对象赋值给obj走下一次循环 obj.c就等于 {c:123} 这样就可以通过循环拿到数据的值了 
      obj = obj[path[i]] 
    }
    return obj // 最后把值返回出去
  }
```

2.  把`this.getter`的返回值，保存在实例中

```js
// 执行添加dep方法，把getter的返回值保存在实例上
this.value = this.get()

// 每次数据更新都会执行run方法，在这里可以通过调用get获取到最新的数据值，这个时候我们就有了
// 新值和旧值，再去调用传递进来的handler方法就可以实现了
run() {
    let value = this.get() // newValue
    let oldValue = this.value
    this.value = value

    // 执行 handler 这个是用户的 watcher
    if (this.user) {
      this.cb.call(this.vm, value, oldValue)
    }
  }

  // 初次渲染
  get() {
    // 给 dep 添加 watcher
    pushTarget(this)
    const value = this.getters()
    // 取消 watcher
    popTarget()
    return value
  }
```

> 代码并不是最终代码，只是跟watch有关的代码还是比较多的，展示的都是一些比较核心的，通过本篇文章可以加深理解watch的实现原理，其实就是借助watcher更新，调用我们传入的回调方法而已
