---
highlight: a11y-dark
---
## 准备工作

1. 我使用的是class类来实现Promise的构造函数，如果不会class可以学习一下他的语法
2. 了解原生Primise的特性，需要学会使用Promise才可以通过他的功能来思考是如何实现的
3. 我们创建的类名叫做myPromise,我会用原生Promise去举例子，大家不要看错了

## 创建Promise类

```js
class myPromise{
    construtor(){
    }
}
```

## 调用执行器函数

执行器函数就是我我们每次new Promise时传入的参数，他是一个同步执行的函数，在每次new时就会执行

```js
// 原生Promise
new Promise(() => {})
```

```js
class myPromise{
    construtor(executor){
        // （executor 是一个同步函数） 我们每次new Promise时就会执行
        executor()
    }
}
```

## 向执行器传入两个参数

通常我们在使用`Promise`的时候，首先 new Promise() 并且传入一个函数，函数接收两个参数 `resolve` 成功时调用的函数 `reject` 失败时执行的函数

```js
// 原生promise
new Promise((resolve,reject) => {
    // 成功时
    resolve('成功')
    //失败时
    reject('失败')
})
```

通过原生Promise的代码，我们可以传入两个函数 `resolve` 代表成功 `reject` 代表失败

```js
class myPromise{
      // executor 执行器  执行 new Promise((resolve,reject)
      // => {函数体}) 中传入的函数 (resolve,reject) => {函数体}
    construtor(executor){
        // 我们需要定义这两个函数
        // 成功执行的函数
        const resolve = (data) => {}
        // 失败执行的函数
        const reject = (reason) => {}
        // （executor 是一个同步函数） 我们每次new Promise时就会执行
        executor(resolve,reject)
    }
}
```

 两个方法都需要使用箭头函数，否则this会指向window则无法调用实例方法,如果非要用function定义可以使用bind更改this指向`executor(resolve,reject)`更改为`executor(resolve.bind(this),reject.bind(this))`

## 改变状态

当我们调用了`resolve`或者`reject`函数时状态会改变,并且状态是不可逆的，只有`pending`变成`fulfilled`和`pending`变成`rejected`

```js
// 原生promise
new Promise((resolve,reject) => {
    // 当我们调用resolve函数时 Promise内部会把状态修改为 fulfilled reject同理
    resolve('成功')
})
```

我们就需要添加上修改状态的代码,并且保存调用传入的结果

```js
// 定义状态常量 易于后期维护
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class myPromise {
   // 也可以定义在类里面
   // static PENDING = "pending";
   // static FULFILLED = "fulfilled";
   // static REJECTED = "rejected";
  // 返回的结果
  #result = undefined;
  // 当前 Primise 的状态 默认为 pending
  #state = PENDING;

  constructor(executor) {
    // 执行器中传入两个函数

    // 成功的函数
    const resolve = (data) => {
      this.#changeState(FULFILLED, data);
    };

    // 失败的函数
    const reject = (reason) => {
      this.#changeState(REJECTED, reason);
    };

      executor(resolve, reject);
  }

  // 抽离出修改状态的函数 state 代表要修改的状态 (fulfilled/rejected) result 代表结果
  // 修改Promise状态，并且把结果传递过去
  #changeState(state, result) {
    // Promise的特性 状态不可逆 只有状态为 pending 时才可以修改 状态
    if (this.#state !== PENDING) return;
    // 修改我们当前的状态
    this.#state = state;
    // 保存传入的结果
    this.#result = result;
  }
}
```

## 添加上捕获执行器的报错

如果我们在传入的函数发生报错时原生Promise是怎么处理的

```js
new Promise(() => {
    throw 'err'  // 原生Promise在捕获到异常时会调用rejected函数并且把error信息当作参数传入
})
```

我们只需要通过try catch即可实现这个效果

```js
// 在我们的执行器中添加上 try catch
try{
   executor(resolve, reject);
}catch(err){
   // 调用reject方法并传入错误信息
   reject(err)
}
```

>这个时候要注意 try catch 并不能捕获到 异步执行的函数抛出的错误 原生Promise也并没有实现

## 编写then方法

then方法是Promise中的关键

```js
// 原生promise
let p = new Promise((resolve,reject) => {
    resolve('成功')
})

p.then(
    // 状态成功时的函数
    res => {
        console.log(res)
    // 状态为失败时的函数
    },err => {
        console.log(err)
    }
)
```

```js
/*
  then方法两个参数就是我们调用时传入的两个
  .then(res => {},err => {})
*/
then(onFulfilled, onRejected) {
  // return 一个Promise实例就是链式调用的关键
  return new myPromise((resolve, reject) => {
    // 当状态为成功时执行的函数
    if(this.#state === FULFILLED){
        if(typeof onFulfilled === 'function'){
            // 调用成功的回调并把结果传入
            onFulfilled(this.#result)
        }
    }
    if(this.#state === REJECTED){
        if(typeof onRejected === 'function'){
            // 调用失败的回调并把结果传入
            onRejected(this.#result)
        }
    }
  });
}
```

## 解决异步修改状态时 then方法的bug

>当我们执行器中使用了异步函数调用resolve或者reject时，我们在调用then方式时，状态为pending是得不到值的,我们需要把then方法中的函数保存到一个数组中，接下来用代码演示

```js
new Promise((resolve,reject) => {
    // 在1秒后再执行修改状态
    setTimeout(() => {
        resolve('成功')
    }, 1000)
})
```

我们只需要定义一个数组把then方法的参数储存起来即可，在适当的时候取出执行，那么我们在那里执行呢，我们之前定义了一个 `#changeState` 方法，专门修改状态的函数，那么当状态修改时我们再从数组中取出函数执行不就可以了

1. 定义一个数组 `#handles`
2. 每次调用`then`方法把参数`push`到数组中
3. 定义一个`#run`方法 用来执行 `#handle` 中的方法
4. 每次修改状态都会触发`#changeState`方法，在`#changeState`方法中调用`#run`方法即可

第一步：定义空数组

```js
// 返回的结果
#result = undefined;
// 当前 Primise 的状态 默认为 pending
#state = PENDING;
// 储存then方法中的参数 首先定义一个数组用于储存
#handles = [];
```

第二步：添加then方法

```js
/*
    then方法两个参数就是我们调用时传入的两个
    .then(res => {},err => {})
*/
then(onFulfilled, onRejected) {
  // return 一个Promise实例就是链式调用的关键
  return new myPromise((resolve, reject) => {
    // 把属性push到一个数组中是因为
    // 当遇到异步函数是，调用then方法，这是promise的状态为pending
    this.#handles.push({
      onFulfilled,
      onRejected,
      resolve,
      reject,
    });
    this.#run();
  });
}
```

第三步：添加#run方法
>当每次调用run方法时，如果状态为pending则不执行，当状态发生了修改时，通过数组shift方法，提取数组第一个元素，当状态为成功时调用`onFulfilled`当状态为失败时调用`onRejected`

```js
// 执行储存器内的方法
#run() {
  // 当状态为pending时不执行
  if (this.#state === PENDING) return;
  // 当储存器中没有数据时不执行
  while (this.#handles.length) {
    // 解构出所有的属性
    const { onFulfilled, onRejected, resolve, reject } =
      this.#handles.shift();
    // 当状态为成功时
    if (this.#state === FULFILLED) {
      // 判断是否为函数 可能是null 或者其他属性
      if (typeof onFulfilled === "function") {
        onFulfilled(this.#result);
      }
    }
    // 当状态为失败时
    if (this.#state === REJECTED) {
      // 判断是否为函数 可能是null 或者其他属性
      if (typeof onRejected === "function") {
        onRejected(this.#result);
      }
    }
  }
}
```

第四步： 在#changeState中调用#run方法

```js
#changeState(state, result) {
 if (this.#state !== PENDING) return;
 this.#state = state;
 this.#result = result;
 // 在最后执行#run即可
 this.#run();
}
```

**大家可以通过 new一个我们自己创建的实例 测试执行异步代码时是否可以获得值**

```js
let p = new myPromise((resolve,reject) => {
     setTimeout(() => {
        resolve('成功')
     })
})
p.then(res => {
  // 如果获取到值证明成功
  console.log(res)
})

```

## 处理then方法的返回值

then方法的返回值会有3种情况

### 第一种情况：then方法的参数不为函数时

```js
let p = new Promise((resolve,reject) => {
    resolve('成功')
})

p.then() // 没有传递回调函数
```

Promise有一个特性就是穿透效果，当你调用了then方法但是没有传参，那么promise内部会调用当前promise的resolve方法并且把当前promise的结果传递进去，返回的就是一个成功状态的promise，下一次调用then方法依然可以获得值

```js
#run() {
  if (this.#state === PENDING) return;
  while (this.#handles.length) {
    const { onFulfilled, onRejected, resolve, reject } =
      this.#handles.shift();
    // 当状态为成功时
    if (this.#state === FULFILLED) {
      // 判断是否为函数 可能是null 或者其他属性
      if (typeof onFulfilled === "function") {
          onFulfilled(this.#result); 
      }else{
        // 当 onFulfilled 不是一个函数时 调用 resolve 方法
        resolve(this.#result)
      }
    }
    // 当状态为失败时
    if (this.#state === REJECTED) {
      // 判断是否为函数 可能是null 或者其他属性
      if (typeof onRejected === "function") {
          onRejected(this.#result); 
      }else{
          reject(this.#result)
      }
    }
  }
}
```

这里可能大家会有疑惑，当then方法的参数不为函数时，什么时候调用 resolve 什么时候调用 reject 呢，可以通过原生Promise得出结论

```js
let p = new Promise((resolve,reject) => {
    resolve('成功')
})
.then()
.then(res => {
    // 当调用了resolve方法 当前 Promise 的状态为 fulfilled 当然执行的是 onFulfilled
    console.log(res)
}).catch(err => {
    console.log(err)
})
// 这里打印的结果是 成功
```

那如果一开始Promise的状态为 rejected 呢，后面的then方法还会执行吗

```js
let p = new Promise((resolve,reject) => {
    reject('失败')
})
.then()
.then()
.then()
.then()
.then()
.then()
.catch(err => {
    console.log(err)
})
// 无论你在这里调用了多少个 then 方法都不会执行的 因为只要状态为 reject 时就会跑到 catch 方法中
```

我们可以得出结论,什么时候该调用 resolve 方法呢,当前状态为 fulfilled 时调用 resolve 方法，当前状态为 rejected 时调用 reject 方法，传递到后面的链式调用中

### 第二种情况：当回调函数执行有报错

使用 try catch 捕获调用函数时的报错，在我们的 #run 方法中添加 try catch 即可，当我们的回调函数执行没有错误时就调用 resolve 方法，有错误则调用 reject 方法，我这里展示部分代码

```js
// 当状态为成功时
if (this.#state === FULFILLED) {
  // 判断是否为函数 可能是null 或者其他属性
  if (typeof onFulfilled === "function") {
      try{
          const data = onFulfilled(this.#result);   
          resolve(data)
      }catch(err){
          reject(this.#result)
      }
  }else{
    // 当 onFulfilled 不是一个函数时 调用 resolve 方法
    resolve(this.#result)
  }
}
// 当状态为失败时
if (this.#state === REJECTED) {
  // 判断是否为函数 可能是null 或者其他属性
  if (typeof onRejected === "function") {
      try{
          const data = onRejected(this.#result);
          resolve(data)
      }catch(err){
          reject(this.#result)
      }
  }else{
      reject(this.#result)
  }
}
```

这边的重复代码比较多，我们可以进行一个抽取，定义一个 #runOne 方法

```js
// 接收一个回调函数 callback 还有 成功/失败时需要调用的函数 resolve reject
#runOne(callback,resolve,reject){
    // 首先要判断当回调函数不为函数时
    if(typeof callback !== 'function'){
        // 判断当前状态决定调用 resolve 还是 reject
        const settled = this.#state === FULFILLED ? resolve : reject
        // 调用方法传递参数
        settled(this.#result)
    }
    
    // 下面使用 try catch 捕获函数可能发生的错误
    try{
       // 没有报错则调用resolve方法把函数的返回值添加到返回的Promise的结果
       const data = callback(this.#result)
       resolve(data)
    }catch(err){
       // 如果有报错则调用 reject 方法把错误信息传递进去
       reject(err)
    }
}

```

我们原来的函数调用这个函数就可以了

```js
if (this.#state === FULFILLED) {
  this.#runOne(onFulfilled,resolve,reject)
}
// 当状态为失败时
if (this.#state === REJECTED) {
  this.#runOne(onRejected, resolve, reject);
}
```

### 第三种情况：当回调函数的返回值为 Promise 时

首先我们需要定义一个函数，专门判断当前返回值是不是 promise，判断是否为promise正确来说是判断是否符合promise的A+规范，判断条件是，当我们的返回值是一个对象或者函数，并且有then方法，就是符合条件的

```js
// 判断是否为Promise
#isPromiseLike(data) {
  // 当你的返回值为构造函数或者是对象
  if (data !== null && typeof data === "object") || typeof data === "function" {
    // 并且有一个then方法 就满足了 A+ 规范
    return typeof data.then === "function";
  }
  return false;
}
```

```js
#runOne(callback, resolve, reject) {
    if (typeof callback !== "function") {
      const settled = this.#state === FULFILLED ? resolve : reject;
      settled(this.#result);
      return;
    }
    try {
      const data = callback(this.#result);
      // 第三种情况 返回值为 Promise 时
      if (this.#isPromiseLike(data)) {
        // promise成功则调用 resolve 方法 失败调用 reject 方法
        data.then(resolve, reject);
      } else {
        // 不是 promise 则直接添加到 resolve
        resolve(data);
      }
    } catch (err) {
      // 当 then 方法内报错时 我们手动添加到 reject 方法中
      reject(err);
    }
}
```

## 添加到微任务

Promise是一个异步任务，并且是微任务，我们需要把then方法的回调函数添加到微任务中，首先我们定义一个添加到微任务的函数

**我们需要判断代码的运行环境，对应不同的方法添加到微队列**

我们定义一个名为 #runMicroTask 的函数传入一个函数

```js
#runMicroTask(func) {
  // 这里是判断当前是否为node环境
  if (typeof process === "object" && typeof process.nextTick === "function") {
    process.nextTick(func);
    // 这里是判断浏览器环境
  } else if (typeof MutationObserver === "function") {
    const ob = new MutationObserver(func);
    const textNode = document.createTextNode("1");
    ob.observe(textNode, {
      characterData: true,
    });
    textNode.data = "2";
    // 当没有api时，只能调用定时器了
  } else {
    setTimeout(func, 0);
  }
}
```

Vue中的$nextTick()使用的也是MutationObserver这个api实现微任务，[可以看看这篇文章帮助理解](https://juejin.cn/post/7026744896820084766)

**最后我们把回调函数的执行全部放在这个函数当中**

```js
#runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
        ......
    }
)}
```

>上面的代码实现的是Promise的A+规范，下面的代码是es6新增的方法，便于我们开发

## 实现catch方法

catch方法的实现很简单，他代替的是then方法的第二个参数，所以我们直接调用then方法，把第二个参数传递进去即可

```js
catch(onRejected){
   return this.then(null, onRejected);
}
```

## 实现静态resolve方法

官网描述的非常清晰，我们就是根据官网的描述去写代码[MDN官网对Promise静态方法的描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise#%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95)

官方描述：
返回一个状态由给定 value 决定的 `Promise` 对象。如果该值是 thenable（即，带有 `then` 方法的对象），返回的 Promise 对象的最终状态由 then 方法执行结果决定；否则，返回的 Promise 对象状态为已兑现，并且将该 value 传递给对应的 then 方法

1. **当resolve方法传入的参数为我们自己写的myPromise**

官方描述的意思就是当我们传入一个promise对象时，我们直接返回这个promise即可

```js
const p = new Promise((resolve,reject) => {
    resolve(1)
})
Promise.resolve(p) === p // true
```

2. **当resolve方法传入的参数满足了A+规范时**

官方描述的意思是，当满足A+规范时，就调用他的then方法

```js
const p = new Promise((resolve,reject) => {
    resolve(1)
})
```

3. **当不满足以上情况则直接返回把值传入一个promise对象返回即可**

```js
Promise.resolve(123).then(res => {
    console.log(res) // 123
})
```

*根据以上描述来书写我们的resolve方法*

```js
static resolve(value) {
  // 首先判断参数是否是我们myPromise的实例对象，如果是则直接返回
  if (value instanceof myPromise) return value;
  let _resolve, _reject;
  // 因为静态方法中是无法调用this的，所以我们需要借助实例对象来调用实例方法
  // 创建一个promise供后期返回
  const p = new myPromise((resolve, reject) => {
    _reject = reject;
    _resolve = resolve;
  });
  // 当参数满足了A+规范时，调用他的then方法即可
  if (p.#isPromiseLike(value)) {
    value.then(_resolve, _reject);
  } else {
  // 最后一种情况，调用成功函数传入参数
    _resolve(value);
  }
  // 最后把promise返回出去
  return p;
}
```

## 实现静态reject方法

官方描述：返回一个状态为已拒绝的 `Promise` 对象，并将给定的失败信息传递给对应的处理函数。

无论你传什么参数进来，我给你返回一个 rejected 的对象

```js
// 返回一个失败的promise即可
static reject(reason) {
  return new myPromise((resolve, reject) => {
    reject(reason);
  });
}
```
