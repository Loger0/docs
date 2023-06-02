---
highlight: a11y-dark
---
## 微信登录流程

*微信官方的流程图*

![微信登录流程图.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c36e9a0ebea488f9f622201da0eadd2~tplv-k3u1fbpfcp-watermark.image?)

这边附上微信官方的文档：[https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)

1. 第三方 （第三方即我们开发的网页应用，称为第三方是站在微信官方的角度来说）发起微信授权登录请求 （即让用户扫码） ，微信用户允许授权第三方应用后 （用户扫码并点击手机微信的确认授权） ，微信会拉起应用或重定向到第三方网站，并且带上授权临时票据code参数 （我们开发的网页应用会重定向，并且路径会携带上code参数） ；
2. 通过code参数加上AppID和AppSecret等，通过API换取access_token（前端将code通过接口传给后端，后端将code、AppID和AppSecret通过接口传给微信服务器并换取access_token）；
3. 通过access_token进行接口调用，获取用户基本数据资源或帮助用户实现基本操作。

### 跳转到微信二维码页面

```js
// 替换当前
const state = encodeURIComponent(
  // http://127.0.0.1:8080替换成你自己的本地开发地址
  // 加上this.$route.path的原因是，当前路径不一定是首页，也可能是其他页面，因此需要携带当前页面的路径供扫码后返回
  window.btoa('http://127.0.0.1:8080' + this.$route.path)
)
window.open(
  `https://open.weixin.qq.com/connect/qrconnect?appid=wx67cfaf9e3ad31a0d
  &redirect_uri=http://sc.wolfcode.cn/wechatLogin
  &response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`,
  '_self'
)
```
>
>1. `redirect_uri`是重定向地址，正常开发流程中，我们扫码后网页重定向地址是`redirect_uri`对应地址，此地址需要在微信公众平台进行配置，且和`appid`配对。如果`redirect_uri`与`appid`不匹配则会提示错误
>2. 这边的`state`是我们自己项目的地址，拼接到是`state`属性中,再扫码完成会跳转到`state`属性的地址
>3. `scope`属性值不为`snsapi_login`也会报错

### 用户确认登录后

1. 扫码成功后会根据我们传入的`redirect_uri`路径，重定向到我们传入的路径中
2. 重定向到我们的项目中，路径会携带了code值，我们需要拿到code值发送到后端
3. 在vue2中路由跳转是异步执行的，我们通过`this.$route.query`可能会获取不到查询字符串
   这个时候我们可以通过路由钩子完成 `this.$router.onReady(()=>{})` 在回调函数中就可以获取到我们想要的值
4. 这个时候又会有2种情况，看具体需求，第一种情况：微信未与手机号绑定 第二种情况：后端返回token登录成功
5. 第一种情况：当微信与手机号未绑定时，后端会返回一个约定好的状态码，并且还有一个`uuid`表示在微信中的唯一标识，我们把`uuid`保存起来供后期使用，然后打开你们项目的登录框，拿到用户的手机号/账号，结合`uuid`发送给后端，后端返回token则绑定成功啦

```js
// 路由切换异步执行 onReady 路由切换完成钩子
this.$router.onReady(async () => {
  // 微信返回的code
  const queryCode = this.$route.query.code
  if (queryCode) {
    // 把code传到后端获取token
    const res = await wechatLogin({
      code: queryCode
    })
    // code为407表示未绑定微信
    if (res.code === 407) {
      // uuid表示微信中的唯一标识
      const uuid = res.uuid
      // 把uuid保存到vuex
      this.updateUserUuid(uuid)
      // 打开登录框
      this.changeLoginDialogVisible(true)
      // code为0表示微信已绑定直接登录就行
    } else if (res.code === 0) {
      this.asyncShow({
        text: '登录成功！',
        type: 'success',
        duration: 5000
      })
      localStorage.setItem('token', res['x-auth-token'])
      this.handleLogin(true)
      this.changeLoginDialogVisible(false)
    }
    // 路由跳转到当前页面 防止用户查看到路径中的数据code
    this.$router.push(this.$route.path)
  }
})
```

>登录流程大概就是这样的啦，大家可以上手项目试一试
