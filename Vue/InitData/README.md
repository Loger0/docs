---
highlight: a11y-dark
---

# Vue2中初始化数据做了些什么

我们定义在data中的数据，在`vue`初始化的时候做了以下几步：

1. 在vue实例上添加`_data`属性，把`data`中的属性赋值到`_data`中，我们可以通过`this._data`获取属性值
2. 通过`Object.defineProperty`递归遍历`data`劫持所有数据
3. 通过`proxy`函数，把`data`中的属性代理到`Vue`实例上

## 添加\_data属性

data中有两种情况：

```js
// 对象形式
data: {
  name: 'zs'
}

// 函数形式
data(){
  return {
    name: 'zs'
  }
}

```

我们通过判断是否为函数来获取data中的属性，这里需要通过`call`方式把this指向到`Vue`实例上，因为data中的数据可能会依赖Vue的其他模块，比如 vuex，不更改指向则获取不到Vue实例上的数据

```js
// 在赋值的时候在vue实力上添加了一个_data属性，是和data相同的
data = vm._data = typeof data === 'function' ? data.call(vm) : data
```

## 把属性代理到Vue实例上

在平时的开发中，我们通常会使用`this.xxx`来获取或者修改data中的属性，但是我们只是在Vue实例中添加了一个`_data`属性，每次再调用时会非常麻烦`this._data.xxx`，所以我们通过`proxy`函数把数据代理到实例上

1. 在数据完成了劫持之后，使用for in遍历data中的数据，通过`Object.defineProperty`给实例添加数据，当我们使用`this.xxx`就等同于`this._data.xxx`，也是便捷于我们开发，而且代码漂亮许多

```js
for (let k in data) {
    proxy(vm, '_data', k)
  }

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    },
  })
}
```
