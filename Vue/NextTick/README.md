---
highlight: a11y-dark
---

# nextTick原理

1.  平时在获取真实DOM的时候获取不到最新的DOM元素，使用`$nextTick`就可以
2.  为什么`$nextTick`就可以获取到最新的DOM元素?

带着以上问题，来解析`nextTick`的原理

## 为什么获取不到最新的DOM元素?

因为Vue修改视图是异步执行的，这也是为了优化性能，在我们修改data中的数据时，Vue内部监听到依赖数据发生了改变，通过`dep`通知组件的`watcher`执行视图更新，每一次视图更新都需要重新生成`vnode`再进行新旧`vnode`比对，生成DOM元素挂载到页面上，这一轮操作是非常消耗性能的,所以Vue内部会把页面更新`watcher`推入到一个队列中，并加入了节流方法，当同步代码执行完了之后才会把队列中的`watcher`拿出来遍历更新视图，我们在使用`this.$refs`获取DOM的时候是同步代码，其实DOM还没有更新，所以是获取不到的

## 为什么使用\$nextTick就可以获取到最新DOM?

Vue的视图更新是异步执行的，使用的就是`nextTick`,这也是能获取到最新DOM的原因，在Vue内部有一个`nextTick`函数，他也是使用队列去处理回调函数，并不是调用后就马上执行，首先是推入到一个队列中，当所有的同步代码执行完的时候再通过循环取出调用，接下来可以通过代码了解

```js
let callback = []
let pending = false
let timerFunc

function flush() {
  callback.forEach((cb) => cb())
  pending = false
  callback = []
}

// 处理兼容问题
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flush)
  }
} else if (MutationObserver) {
  let observe = new MutationObserver(flush)
  let textNode = document.createTextNode(1)
  observe.observe(textNode, {
    characterData: true,
  })
  timerFunc = () => {
    textNode.textContent = 2
  }
} else if (setImmediate) {
  // ie浏览器支持得定时器
  timerFunc = () => {
    setImmediate(flush)
  }
}

export function nextTick(cb) {
  callback.push(cb)
  // Promise.then
  if (!pending) {
    console.log('执行了')
    timerFunc() // 这个方法就是异步方法
    pending = true
  }
}

```

1.  定义一个callback数组，每次调用nextTick就会把回调函数push到callback数组中，因为`callback.push`是同步代码，`timerFunc`是异步代码，所以执行完所有`push`后才会调用`timerFunc`
2.  那么视图更新和获取DOM的流程是怎么样的呢

通过伪代码来解释

```js
data(){
    return {
        name: 'zs',
        list: [1,2,3]
    }
}

this.name = 'ls'
this.list.push(4)
const fn = () => {
  this.$el.innerHTML // 获取最新DOM
}
this.$nextTick(fn)
```

`this.name`和`this.list`修改了2个数据，会触发两次视图更新，这个时候就会把`watcher`推入到队列中，下面调用了`$nextTick`获取DOM，`nextTick`中的`fn`函数也会推入到队列中，这个时候的数组是这样的`[watcher,fn]`通过循环调用，先执行视图更新，后获取DOM就可以获取到最新DOM了
