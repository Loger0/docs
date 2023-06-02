---
highlight: a11y-dark
---
# Vue动态绑定样式

```html
<!-- 第一种方式 -->
<div :class="['classA','classB']"></div>
<!-- 第二种方式 -->
<div :class="{classA:true,classB:false}"></div>
<!-- 第三种方式 -->
<div :class="{fontSize:'16px',color: 'red'}"></div>
<!-- 第四种方式 -->
<div :class="[{fontSize:'16px',color: 'red'}]"></div>
```

# vue-router的实现原理

**hash模式**

1. localtion.hash 的值就是 url 地址 # 后的值，优点就是：在我们请求HTTP时，并不会把#后的值携带过去，
对后端没有影响，所以不会刷新页面

2. 可以给 hash 的改变添加事件

```js
window.addEventListener('hashchange', func)
```

每一次改变 hash（window.location.hash），都会在浏览器的访问历史中增加一个记录利用 hash 的以上特点，就可以来实现前端路由“更新视图但不重新请求页面”的功能了

> 缺点： 路径中多了一个 # 号不美观

**history模式**

利用H5的新特性，pushState() 和 replaceState() 两个方法

这两个方法应用于浏览器的历史记录站，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。这两个方法有个共同的特点：当调用他们修改浏览器历史记录栈后，虽然当前 URL 改变了，但浏览器不会刷新页面，这就为单页应用前端路由“更新视图但不重新请求页面”提供了基础

> 但是页面可能会出现404，需要后端配合

# vue-router 有几种导航钩子？

1. 全局守卫： `router.beforeEach`
2. 全局解析守卫： `router.beforeResolve`
3. 全局后置钩子： `router.afterEach`
4. 路由独享的守卫： `beforeEnter`
5. 组件内的守卫： `beforeRouteEnter、beforeRouteUpdate (2.2 新增)、beforeRouteLeave`

# 前端路由和后端路由的区别

**前端路由**

1. 在页面不刷新的前提下，前端通过监听 url 地址的变化，展示不同的页面
2. 实现前后端分离，SPA单页面的发展，目前项目用的都是前端路由

优点：
  
1. 用户体验良好，切换页面时不需要刷新页面，也不需要向后端发送请求，可以快速展示页面
2. 可以通过手动修改 url 地址，访问指定路径
3. 前后端分离，提高开发效率，现在很多框架都有路由模块

缺点：

1. 使用浏览器的前进，后退键的时候会重新发送请求，没有合理地利用缓存  
2. 单页面无法记住之前滚动的位置，无法在前进，后退的时候记住滚动的位置

**后端路由**

1. 浏览器在每次修改 url 地址时都会向后端发送请求，后端通过拼接html文件给前端渲染
2. 如果用户网速较慢，可能会出现白屏的情况

优点：

1. 分担了前端的压力，网页都是通过后端传过来的html渲染的

缺点：

1. 当项目比较大时，后端的压力就比较大

# \$refs 和 $el的用法

**$refs有三种用法**

1. ref加在普通标签身上，通过 $refs.(ref的值) 得到 dom 元素

```html
<div ref="div"></div>
```

```js
this.$refs.div // 这样就可以获取div的dom元素
```

2. ref加在子组件标签身上，通过 $refs.(ref的值) 得到的是子组件的实例，可以使用组件的方法属性

```html
<child ref="child"></child>
```

```js
this.$refs.child // 这样就可以获取子组件的实例
```

3. 获取自定义组件的dom元素的属性，比如获取child组件的offsetTop值, $el获取的是真实的dom

```html
<child ref="child"></child>
```

```js
this.$refs.child.$el.offsetTop // 这样就可以获取子组件的offsetTop
```

# Vue常用的修饰符

1. .prevent 阻止默认行为
2. .stop 阻止事件冒泡
3. .self 当 event.target 等于 被绑定的元素时触发，相当于事件发生在元素本身才会触发
4. .capture: 事件侦听，事件发生的时候会调用
5. .enter 点击了确认按钮
6. .lazy 懒更新
7. .trim 清空两侧空格
8. .number 只能输入数字
 ......

# v-if和v-show的区别以及使用场景

**区别**

1. 隐藏原理： v-if通过控制dom节点是否存在控制显示隐藏，v-show通过切换display属性的 block 和 none 控制显示隐藏
2. 编译过程： v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；v-show只是简单的基于css切换
3. 编译条件： v-if只有当条件为true时才会编译，v-show在任何条件下都会渲染，然后被缓存
4. 性能消耗： v-if在切换时消耗，v-show在初次渲染时消耗

**使用场景**

基于以上区别，因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

# v-if和v-for避免一起用

1. v2和v3 v-if和v-for的优先级是不一样的，在v2中，v-for的优先级要高于v-if，先循环再控制显示隐藏
2. v-for的优先级更高，如果v-if的条件为false，v-for渲染完了，v-if又把元素删除了，比较浪费性能

# Vuex 为什么要分模块并且加命名空间

每一个模块都有一个独自的状态树，所有的状态最终会集中到一个比较大的对象中，当你的项目比较大时，state文件的代码看起来就会非常的臃肿，不好维护，为了解决问题，vuex允许我们通过module对象引入模块，每个模块都有独立的state,getters,mutations,actions,甚至可以引入子模块

如果希望模块具有更高的**封装度和复用性**，你可以通过添加 `namespaced: true` 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

# Vue SSR

SSR也就是服务端渲染，也就是Vue在客户端把标签渲染成html的工作放在服务器完成，然后发html传给客户端直接渲染

**优点：**

SSR有更好的SEO，并且首屏加载更快

**缺点：**

开发条件会受到限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子，当我们需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于 Node.js 的运行环境。

服务器会有更大的负载需求

# 函数式组件和普通组件有啥区别？

1. 不维护响应数据
2. 没有instance实例  
   所以在组件内部没有办法像传统组件一样通过this来访问组件属性  
   实现原理见下面代码中的中文注释
3. 渲染快
4. 没有实例，意味着没有（this）
5. 有生命周期（没有钩子函数，没有响应式数据）

# Vue的性能优化

- 使用函数式组件
- data中的数据嵌套层级不要太深
- 在不同的场景合理运用 `v-if` `v-show`
- 图片懒加载
- 路由懒加载
- 预渲染 添加 loading 或者 骨架屏
- SSR服务端渲染
- 第三方的插件按需引入
- 提高代码复用率 组件化 模块化
- 使用 CDN 加速
- `keep-alive`缓存组件
- 合理运用 `computed`
- 表格或者列表数据较多时，使用虚拟表格或者虚拟列表
- v-for必须添加key值，key值最好是唯一的

# mixin混入运用场景

在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立，可以通过 Vue 的 mixin 功能抽离公共的业务逻辑，原理类似“对象的继承”，当组件初始化时会调用 mergeOptions 方法进行合并，采用策略模式针对不同的属性进行合并。当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。

# keep-alive使用场景原理

keep-alive是vue内置的组件，可以实现对组件的缓存，切换组件时不会对组件进行销毁

- 常用的两个属性 `include` 包含的组件被缓存 `exclude` 包含的组件不被缓存
- 被缓存的组件会多两个生命周期 actived/deactived 用来得知当前组件激活状态
- keep-alive 的中还运用了 LRU(最近最少使用) 算法，选择最近最久未使用的组件予以淘汰

# Vue.set方法原理

有两种修改数据的方式是不会触发视图更新的

1. 初始化完成，data中的数据已经劫持完了，给响应式的对象新增属性
2. 通过数组索引修改值

**Vue.set的原理**

因为响应式数据 我们给对象和数组本身都增加了__ob__属性，代表的是 Observer 实例。当给对象新增不存在的属性 首先会把新的属性进行响应式跟踪 然后会触发对象__ob__的 dep 收集到的 watcher 去更新，当修改数组索引时我们调用数组本身的 splice 方法去更新数组

# Vue.extend 作用和原理

官方解释：Vue.extend 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。

其实就是一个子类构造器 是 Vue 组件的核心 api 实现思路就是使用原型继承的方法返回了 Vue 的子类 并且利用 mergeOptions 把传入组件的 options 和父类的 options 进行了合并

# 自定义指令

指令本质上是装饰器，是 vue 对 HTML 元素的扩展，给 HTML 元素增加自定义功能。vue 编译 DOM 时，会找到指令对象，执行指令的相关方法。

自定义指令有五个生命周期（也叫钩子函数），分别是 bind、inserted、update、componentUpdated、unbind

```js
1. bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

2. inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

3. update：被绑定于元素所在的模板更新时调用，而无论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。

4. componentUpdated：被绑定元素所在模板完成一次更新周期时调用。

5. unbind：只调用一次，指令与元素解绑时调用。
```

**原理**

1.在生成 ast 语法树时，遇到指令会给当前元素添加 directives 属性

2.通过 genDirectives 生成指令代码

3.在 patch 前将指令的钩子提取到 cbs 中,在 patch 过程中调用对应的钩子

4.当执行指令对应钩子函数时，调用对应指令定义的方法

# Vue模板编译

在我之前的文章里有详细说明
[Vue渲染流程](https://juejin.cn/post/7225891176532721725#heading-1)

# 监听路由参数发生变化

1. Vue-router在地址上的params发生变化时是做了优化的，比如商品详情页需要更新不同的商品，其实只需要更新数据即可，如果路由重新跳转本页面，则要经过组件初始化，生成dom等操作，是非常消耗性能的，所以Vue-router在地址相同参数不同时，选择复用组件，如果想监听路由参数发生变化也是有办法的

```js
// 第一种写法
watch: {
  $route(to,from){
    console.log(to) // to 表示 去
    console.log(from) // from 表示 来自
    // 路由变化后的操作
    .....
  }
}

// 第二种写法
watch: {
  $route: {
    handler(to,from){
        console.log(to)
        console.log(from)
        // 路由变化后的操作
        .....
    },
    deep: true // 深度监听
  }
}

// 第三种写法
watch: { 
    '$route':'getPath'
},
methods: {
    getPath(to, from){
     console.log(this.$route.path);
    }
}
```

# Vue中data的数据失去响应式的原因

1. 在数据初始化后给data中的对象添加属性，添加的属性是没有getter和setter的，可以使用Vue提供的$set方法

```js
const obj = {}
Vue.set(obj,key,value)
```

# 多层父子组件通讯

有时候需要通讯的组件不是直接的父子组件，而是祖父和孙子，嵌套的层级比较多的情况下，需要传递的事件和属性比较多，会导致代码混乱，这个时候就需要用到Vue提供的更高阶方法：provide/inject

```js
// 父级组件提供 'foo' 
var Provider = { 
    data(){ 
        return {
            foo: 'bar' 
        } 
    } 
    provide: {
        fooProvide: this.fooFn // 传递一个引用类型函数过去 
    },
    methods:{
        fooFn() {
            return this.foo
        } 
    } 
} 
var Child = {
    inject: ['fooProvide'],
    computed:{
        fooComputed(){
            return this.fooProvide() // 因为传递过来是个引用类型的函数 
        } 
    },
    created () {
        console.log(this.fooComputed) 
    } // ... 
}
```

# Vuex刷新页面数据丢失怎么解决？

1. 把vuex的数据存储到localStorage中,每次页面刷新在localStorage中取
2. 在页面刷新的时候向后端获取数据，动态更新数据
3. 在父页面向后台请求远程数据，并且在页面刷新前将vuex的数据先保存至sessionStorage（以防请求数据量过大页面加载时拿不到返回的数据

# 简述Vuex

Vex有5种属性，分别是 state、getter、mutation、action、module：

**1、state**

Vuex 使用单一状态树,即每个应用将仅仅包含一个store 实例，但单一状态树和模块化并不冲突。存放的数据状态，不可以直接修改里面的数据。

**2、getters**

类似vue的计算属性，主要用来过滤一些数据。

**3、mutations**

mutations定义的方法动态修改Vuex 的 store 中的状态或数据。

**4、actions**

actions可以理解为通过将mutations里面处里数据的方法变成可异步的处理数据的方法，简单的说就是异步操作数据。view 层通过 store.dispath 来分发 action。

```js
const store = new Vuex.Store({ //store实例
  state: {
    count: 0
  },
  mutations: {                
    increment (state) {
      state.count++
    }
  },
  actions: { 
    increment (context) {
      context.commit('increment')
    }
  }
})
```

**5、modules**

项目特别复杂的时候，可以让每一个模块拥有自己的state、mutation、action、getters,使得结构非常清晰，方便管理。

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}
            
const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
 }

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
```

# 强制刷新视图更新

```js
this.forceUpdate() // 调用后页面视图就达到最新了
```

# 过滤器

1. 局部过滤器

```html
<div>{{ num | filter }}</div>
```s
```js
filters: {
    filter(val){
        return val +1
    }
}
```

2. 全局过滤器

```html
<div>{{ num | filter }}</div>
```

```js
Vue.filter('filter', (val) => {
    return val + 1
})
```

# Vue 组件 data 为什么必须是函数

data是一个函数的话，这样每复用一次组件，就会返回一份新的`data`，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。而单纯的写成对象形式，就使得所有组件实例共用了一份`data`，就会造成一个变了全都会变的结果。

# 自定义指令

1. 全局注册

```js
Vue.directive('focus', {
    inseted(el){
        el.focus()
    }
})
```

2. 局部注册

```js
directives:{
    focus: {
        inserted(el){
            el.focus()
        }
    }
}
```

# nextTick用法及原理

1. nextTick存在的意义

因为 vue 采用的**异步更新策略**，当监听到数据发生变化的时候不会立即去更新DOM，  
而是开启一个任务队列，并缓存在同一事件循环中发生的所有数据变更;  
这种做法带来的好处就是可以将多次数据更新合并成一次，减少操作DOM的次数，  
如果不采用这种方法，假设数据改变100次就要去更新100次DOM，而频繁的DOM更新是很耗性能的；

2. nextTick的作用

nextTick 接收一个回调函数作为参数，并将这个回调函数延迟到DOM更新后才执行；  
**使用场景**：想要操作 *基于最新数据生成的DOM* 时，就将这个操作放在 nextTick 的回调中

3. nextTick 实现原理

将传入的回调函数包装成异步任务，异步任务又分微任务和宏任务，为了尽快执行所以优先选择微任务；
nextTick 提供了四种异步方法 Promise.then、MutationObserver、setImmediate、setTimeout(fn,0)

# \$router和$route的区别

1. `$router`是`VueRouter`的实例对象，想跳转页面，可以使用`this.$router.push`或者`go`,`back`
2. `$route`指的是当前路由地址信息，有`path`,`params`,`query`....

# vue-cli生成的项目文件夹assets和public(static) 的区别

vue-cli2生成的项目目录是static

vue-cli3以上生成的项目目录是public

- 相同点：

assets和public(static) 都是存放静态资源的文件。项目所需要的静态文件、图片、样式文件都可以放在这两个文件夹下

- 不同点：

在assets中存放的静态资源，在项目打包时会将这些静态资源与代码、index.html文件一起一同进行打包压缩，上传到服务器

在public(static)中存放的静态资源，不会被打包压缩格式化等流程，而是直接进入打包好的目录，直接上传到服务器

# .sync修饰符

1. `.sync`用于父传子时使用,类似于`v-model`，`.sync`也是语法糖，v-model针对的是表单元素，sync是在父子传值时使用
2. 平时我们父子传值使用的是自定义属性，和自定义事件

*用简单的代码来描述*

**父组件**

```
<template>
  <div>
    <Child :num="num" @add="add"/>
  </div>
</template>

<script>
import child from '@/views/child.vue'
export default {
  data() {
    return {
      num: 1
    }
  },
  methods: {
    add(val){
      this.num += val
    }
  },
  components: {
    Child: child
  }
}
</script>
```

**子组件**

```
<template>
  <div>
    <div>{{ num }}</div>
    <button @click="add">按钮</button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['num'],
  methods: {
    add() {
      this.$emit('add', this.num + 1)
    }
  }
}
</script>
```

`.sync`修饰符就是我们上述操作的语法糖，内部帮我们修改了数据，简单看一下如何使用

**父组件**

```
<template>
  <div>
    <Child :num.sync="num" />
  </div>
</template>

<script>
import child from '@/views/child.vue'
export default {
  data() {
    return {
      num: 1
    }
  },
  components: {
    Child: child
  }
}
</script>
```

父组件在传值的时候加上`.sync`修饰符等于 `<Child :num="num" @update:num="val => num = val"/>`,我们可以节省了监听自定义事件触发的代码

**子组件**

```
<template>
  <div>
    <div>{{ num }}</div>
    <button @click="add">按钮</button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['num'],
  methods: {
    add() {
      this.$emit('update:num', this.num + 1)
    }
  }
}
</script>
```

使用`this.$emit('update:属性名',要修改的值)`触发自定义事件Vue内部监听到就会修改父组件的数据

# 什么是虚拟dom

虚拟dom就是把页面上的标签转换成js对象，用对象属性来描述节点，最后通过虚拟dom生成真实dom

通过真实dom映射虚拟dom

```html
<div class="box">
  <h1 class="title">标题</h1>
</div>
```

虚拟dom

```js
var element = {
 tagName: 'div', // 节点标签名
 props: { // DOM的属性，用一个对象存储键值对
     class: 'box'
 },
 children: [ // 该节点的子节点
   {tagName: 'h1', props: {class: 'title'}, children: []} // 以此类推
 ]
}
```

# 为什么需要虚拟dom

1. **操作原生DOM慢，js运行效率高**，我们可以将DOM对比操作放在JS层，提高效率。 因为DOM操作的执行速度远不如Javascript的运算速度快，因此，把大量的DOM操作搬运到Javascript中，运用patching算法来计算出真正需要更新的节点，最大限度地减少DOM操作，从而显著提高性能
2. 操作真实DOM会触发浏览器渲染，又需要走一次渲染流程，引发重排等等，效率非常低
3. vnode的关键在于，大量的数据操作，vnode可以避免很多dom不必要的修改，提升渲染性能

# Vue2如何监听数组变化

因为Object.defineProperty()只能监听对象，所以Vue对数组劫持，使用的是重写数组方法，当数组中嵌套了对象，还是使用Object.defineProperty()，我们在项目通常都是使用数组方法更改数组，splice,pop,push......

直接上代码

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
    // 这里做了不同方法的一些操作
    return result
  }
})
```

后面把data中的数组原型指向我们重写的原型对象，每次调用方法就可以监听到了，这也是为什么vue2无法监听通过索引值修改数组的值

# computed和watch

`Computed`本质是一个具备缓存的watcher，依赖的属性发生变化就会更新视图。 适用于计算比较消耗性能的计算场景。当表达式过于复杂时，在模板中放入过多逻辑会让模板难以维护，可以将复杂的逻辑放入计算属性中处理。

`Watch`没有缓存性，更多的是观察的作用，可以监听某些数据执行回调。当我们需要深度监听对象中的属性时，可以打开`deep：true`选项，这样便会对对象中的每一项进行监听。这样会带来性能问题，优化的话可以使用`字符串形式`监听
