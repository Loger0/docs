---
highlight: a11y-dark
---

# Vue2初始化生命周期的流程

1.  给生命周期添加`mergeHooks`函数
2.  合并配置项，比如：data、created、computed、watch ......
3.  还有一种情况`mixin`混入，执行优先级高于组件的生命周期

## 添加`mergeHooks`函数

Vue创建生命周期函数使用的是策略模式，先定义好生命周期函数名，通过遍历添加上`mergeHooks`函数

```js
// 生命周期函数名
const HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
]

// 遍历生命周期数组，添加mergeHooks函数
HOOKS.forEach((hooks) => {
  starts[hooks] = mergeHooks
})

// 添加获取合并配置项
function mergeHooks(parentVal, childrenVal) {
  if (childrenVal) {
    if (parentVal) {
      return parentVal.concat(childrenVal)
    } else {
      return [childrenVal]
    }
  } else {
    return parentVal
  }
}

// 把配置项和mixin混入的函数添加到实例上
function mergeOptions(parent, children) {
  // 转化成 Vue.options = {create: [a,b,c], watch: [a,b]}
  const options = {}
  // 如果有父亲没有儿子
  for (let key in parent) {
    mergeField(key)
  }

  // 儿子有父亲没有
  for (let key in children) {
    mergeField(key)
  }

// 执行配置项的函数
function mergeField(key) {
  if (starts[key]) {
    options[key] = starts[key](parent[key], children[key])
  } else {
    options[key] = children[key]
  }
}
    // 返回的配置项，赋值到实例的options上
    return options
}
```

## Mixin混入

Mixin混入在一开始的时候就已经执行了，组件的生命周期是在组件初始化的时候才合并到实例的options上，实例的生命周期的格式为`created: ['createdA','createdB']`以数组形式保存，通过`callHook`函数遍历配置项中的某一个生命周期

```js
function initGlobApi(Vue) {
  Vue.options = {}
  // 转化成 Vue.options = {created: [a,b,c], watch: {a,b}}
  Vue.Mixin = function (mixin) {
    // 对象的合并
    Vue.options = mergeOptions(this.options, mixin)
  }
}
```

调用实例上的生命周期

```js
function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}
```

为什么在`beforeCreate`获取不了数据，在`created`中可以获取数据，其实很简单，因为在调用生命周期的时候，数据还没开始初始化，看下面代码你就可以理解了，生命周期在何时执行，只是取决于我们什么时候调用`callHook`方法，这里的代码就是，在初始化前就调用的`beforeCreate`数据都还没拿到，所以调用数据的时候数据还没开始初始化，获取的值为undefined，找不到这个属性

```js
// new Vue() 后首先调用 callHook(vm, 'beforeCreate') 传入 beforeCreate 调用 beforeCreate 生命周期函数
callHook(vm, 'beforeCreate')
// 初始化data中的数据后调用 callHook(vm, 'created') 传入 created 调用 created 生命周期函数
callHook(vm, 'created')
```

> Mixin混入的函数，是先入栈的，所以在遍历的时候，是先进先出，所以混入的函数优先级更高
