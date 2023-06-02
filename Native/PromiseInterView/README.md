---
highlight: a11y-dark
---
这篇文章根据A+规范和Promise官网描述实现的Promise，看完对Promise的理解增加90%

[手写原生Promise](https://juejin.cn/post/7232459954582126648)

# Promise的特性无非就这几种

1. `Promise`的状态是不可逆的
2. `Promise`通过调用`resolve`和`reject`方法修改当前`Promise`的状态
3. `then`方法是异步执行的，是`微任务`,通过传入回调函数得到成功或失败后的结果
4. `then`方法不传入回调函数会有穿透效果，结果会传递到下一个`then`方法
5. `then`方法的返回值是立即成功的`Promise`对象，除非`then`方法内的回调函数发生报错
6. `then`方法是可以链式调用的，每个`then`得到的结果就是上一个`then`方法的返回值
7. `catch`方法在`Promise`状态为失败时执行，传入回调函数得到失败的结果
8. `catch`方法返回值是立即成功的`Promise`对象，除非`catch`方法内的回调函数发生报错
9. `finally`方法无论当前`Promise`状态成功还是失败都会执行，并且返回值为与当前`Promise`状态一致的`Promise`对象
10. `Promise.all()`方法将多个多个Promise实例，包装成一个新的`Promise`实例，该方法接受一个由`Promise`对象组成的数组作为参数(`Promise.all()`方法的参数可以不是数组，但必须具有`Iterator`接口，且返回的每个成员都是`Promise`实例)，注意参数中只要有一个实例触发`catch`方法，都会触发`Promise.all()`方法返回的新的实例的`catch`方法，如果参数中的某个实例本身调用了`catch`方法，将不会触发`Promise.all()`方法返回的新实例的`catch`方法
11. `Promise.race()`方法的参数与`Promise.all`方法一样，参数中的实例只要有一个率先改变状态就会将该实例的状态传给`Promise.race()`方法，并将返回值作为`Promise.race()`方法产生的Promise实例的返回值
12. `Promise.resolve()`方法返回一个立即成功的`Promise`对象，并且传入的参数分3种情况：`Promise自己的实例对象` `满足A+规范的实例对象` `传入值` 三种情况的结果都不一样
13. `Promise.reject()`方法相对简单，返回值是立即失败的`Promise`对象，传入的参数是什么返回的`Promise`对象的值就是什么

## 状态不可逆

在我们调用`resolve`方法或者`reject`方法时，只有当`Promise`的状态为`pending`时才可以修改为成功或者失败，先调用了`resolve`后调用`reject`，那么`reject`方法是没有效果的，比如：

```js
new Promise((resolve,reject) => {
    resolve('成功')
    reject('失败')
})
```

这段代码最后的结果返回的是状态为`fulfilled`值为`成功`的`Promise`对象，`reject`方法执行了但是内部不会做任何行为

## 异步调用resolve和reject方法

我们使用`Promise`更多情况是发送`AJAX`请求，`AJAX`是一个异步任务，所以我们在发送请求成功后调用`resolve`方法时为什么会等待异步任务完成后，还能获取到数据呢？ 这里使用定时器模拟请求，比如：

```js
new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve('成功')
    })
})
```

因为我们传入的函数是同步执行的，所以修改不到状态，那么`Promise`内部通过把回调函数中所有的参数保存到对象中推到一个队列里面，当异步任务完成时修改了状态，就从队列中把所需的参数拿出来执行

## then方法

`then`方法最关键的地方就在于他返回的是一个新的`Promise`对象，才足以实现这么多功能

### then内的回调函数是微任务

`then`方法中是异步执行的，有3种方法，首先判断你所处的是什么环境，使用不同的方法

1. 首先判断有没有`process`对象，如果有则调用`precess.nextTick`方法实现微任务
2. 判断有没有`MutationObserver`这个构造函数，如果有就使用`MutationObserver`实现微任务
3. 都没有那只能使用`setTimeout`来实现异步，`setTimeout`内的回调会添加到延时队列，执行优先级会低于微任务

### then方法的穿透效果

执行`then`时会去判断传入的回调函数是否为`function`类型，如果不为`function`那么会返回一个新的`Promise`对象，调用`resolve`方法把当前回调的结果传进去，那么下一个`then`方法就可以接收到上一个`then`的结果了

### 链式调用

`then`方法返回的是一个`Promise`对象，那么我们就可以调用他的原型方法了，返回`Promise`对象是链式调用的关键

## resolve静态方法

我们传入的参数分三种情况

1. 由`Promise`实例化的对象

返回值为`Promise`对象，调用`resolve`方法，把传入这个对象，作为参数传入，调用`then`方法时得到的就是传入的`Promise`对象，举个例子：

```js
const p = new Promise((resolve,reject) => {
    resolve('成功')
})

console.log(Promise.resolve(p) === p) // true
```

2. 传入一个满足A+规范的对象

不管你是函数，构造函数，还是对象，只要你满足了`then`方法就是满足了A+规范，`Promise`内容判断你符合了A+规范时，会调用你自身的`then`方法，返回的结果取决于`then`方法

3. 传入普通值

返回的就是一个成功状态的`Promise`，结果就为传入的参数

## await async 跟 Promise 的区别

1. 都是用来处理异步代码请求的
2. Promise是es6出的，async await是es7出的
3. async await是基于Promise实现的，都是非阻塞性的
4. Promise是通过then()和catch()处理结果和捕获异常，可以链式调用，还是会出现回调地狱的情况
5. async await是通过try catch捕获异常
6. 最大的区别就是async await代码看起来跟同步一样，当遇到await就会立即返回结果
