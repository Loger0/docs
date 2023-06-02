---
highlight: a11y-dark
---
# axios二次封装

在项目中使用axios时通常需要二次封装，比如添加请求头，或者统一处理响应状态

## 设置默认配置

1. 引入`axios`库

```
npm install axios
```

2. 导入到项目中

在src目录下创建一个request文件夹，request文件夹下创建request.js封装我们的axios

```js
// 引入axios库
import axios from 'axios'
```

3. 使用axios提供的方法创建实例

`axios`提供了一个create方法，里面可以传入配置项，配置我们的axios默认的属性

- baseURL: 请求的url前缀

通常我们发请求，前面的域名都是一样的，每次都要写就会很麻烦，比如：`127.0.0.1/get` `127.0.0.1/post` 所以我们把前面的域名抽取出来，`axios`在每次发请求的时候就会帮我们把`baseURL`拼接上

- timeout: 请求时间

当我们后端接口发生错误时，或者前端接口写错了等等情况，请求得不到响应时，`timeout`会在设置的时间过了后提示我们发送的请求超时了

- responseType: 数据格式

`responseType`表示服务器响应的数据类型

```js
// 通过create方法创建实例
const request = axios.create({
    baseURL: '127.0.0.1' // 请求url的默认前缀,
    timeout: 30000,
    responseType: 'json'
})
```

## 设置请求拦截器

请求拦截器中可以在`Reaquet Headers`中添加上后端需要的属性

```js
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // config 中有我们请求的信息
    // 获取请求的url地址
    const url = config.url
    // 从缓存中读取token值
    const token = localStorage.getItem('token')
    // 当我们缓存中有token则把token添加到请求头中，携带到后端
    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error) => {
    return Promise.reject(new Error(error))
```

## 设置响应拦截器

响应拦截器中，可以拿到后端返回的数据,因为axios的响应数据是经过内部封装的对象，里面有很多属性我们是不需要的，我们只想看到后端返回的数据。通过返回的状态码，给用户提示信息或者返回数据，弹窗提示等等，状态码可以提前跟后端协商好，比如200为请求成功，401为权限不足等等......

```js
request.interceptors.response.use(
  (res) => {
    // 响应统一处理
    const status = res.data.code || 200
    const message = res.data.message || '未知错误'
    if (status === 401) {
      // 路由跳转
      alert('权限不足')
      return Promise.reject(new Error(message))
    }
    if (status !== 200) {
      alert('错误码' + status + '    ' + message)
      return Promise.reject(new Error(message))
    }
    return res.data
  },
  (error) => {
    return Promise.reject(new Error(error))
  }
)
```

最后把我们封装好的axios导出

```js
export default request
```

## 添加减少重复请求功能

再创建一个js文件，导入我们二次封装好的axios实例

分析需求：

- 当客户发送请求时，可能会频繁触发多次，那么要避免这种情况的发生
- 每次发请求前，把请求的url地址保存到一个数组中，请求完成时删除该url地址，每次请求前查看数组中是否有该url地址，如果有则不发送请求

1. 引入实例对象

```js
import request from './request/request.js'
```

2. 这里使用到自执行函数（后面会说原因）

```js
const myRequest = (function () {
  // 存储历史请求url
  let hasRequest = []
  return function (config) {
    // 或者当前请求url地址
    let url = config.url
    // 如果发起重复请求则忽略
    if (hasRequest.includes(url)) {
      return Promise.reject({ msg: '请求已提交' })
    }
    // 把请求的url放在请求历史记录里
    hasRequest.push(url)
    return request(config).then((res) => {
      // 请求完成后筛选已完成的请求
      hasRequest = hasRequest.filter((item) => item !== url)
      // 把数组返回
      return res
    })
  }
})()
```

## 缓存请求数据

可能有些数据并不会经常更新，这里用到了用空间换时间的思想，利用闭包的机制把数据存在缓存中，当我们发送了请求后把数据存到缓存中，再下一次请求，查看当前缓存有没有改url地址，如果有则不发送请求，直接从缓存中拿取数据返回，那么可以加快获取数据的时间，但是缓存在浏览器中无法释放

需求分析：

- 这里建议使用`Map`存放数据，`Map`中提供了很多便捷的方法操作数据
- 调用我们二次封装的`axios`实例发送请求，把数据存放到`Map`中
- 每一次请求，通过`Map.get(url)`判断当前url是否存在

```js
const myRequest = (function () {
  // 存储历史请求url
  let hasRequest = []
  // 缓存返回结果
  let memery = new Map()
  return function (config) {
    let url = config.url
    // 如果对象中存在url则返回对应的value
    if (memery.has(url)) {
      return Promise.resolve(memery.get(url))
    }
    // 如果发起重复请求则忽略
    if (hasRequest.includes(url)) {
      return Promise.reject({ msg: '请求已提交' })
    }
    // 把请求的url放在请求历史记录里
    hasRequest.push(url)
    return request(config).then((res) => {
      // 请求完成后筛选已完成的请求
      hasRequest = hasRequest.filter((item) => item !== url)
      // 保存返回结果
      memery.set(url, res)
      return res
    })
  }
})()
```

最后我们可以返回两个实例对象，供后期开发使用，因为我们并不会所有数据都放到缓存中，如果需要缓存则调用扩展的这个方法就可以

```js
export { request as initRequest, myRequest as request } // initRequest表示初始的 // request表示扩展的
```

> 这里为什么要使用自执行函数呢，在Vue初始化的时候，所有文件都会执行一次，使用自执行函数在初始化时就已经执行了,我们每次调用的时候，调用的是返回出来的函数，返回的函数对外部作用域的`hasRequest`和`memery`两个变量保持了引用，那么函数内的数据是无法被释放的，利用闭包的机制实现了我们数据缓存的需求，如果不了解的话可以看一下闭包的原理

## 如何调用

如果需要缓存数据，则要通过传配置项的形式去调用

```
<script>
import { request } from '@/api/request'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created() {},
  methods: {
    get() {
      request({
        url: '/test'
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err, message) => {
          console.log(err, message)
        })
    }
  }
}
</script>
```

如果使用普通的请求，用哪种方式都可以

```
<script>
import { initRequest } from '@/api/request'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created() {},
  methods: {
    get() {
      initRequest.get('/test')
        .then((res) => {
          console.log(res)
        })
        .catch((err, message) => {
          console.log(err, message)
        })
    }
  }
}
</script>
```
