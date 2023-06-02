## 深浅拷贝的方法

**浅拷贝**

1. 可以通过扩展运算符，Object.assign()都可以实现浅拷贝

```js
const obj = {
    name: 'zs'
}

const obj2 = {...obj}

const obj3 = Object.assign(obj)
```

**深拷贝**

1. JSON.parse 搭配 JSON.stringify()

```js
const obj = {
    name: 'zs'
}

const obj2 = JSON.parse(JSON.stringify(obj))
```

2. 手写函数递归循环(这里不详细说)

```js
function isObject(obj) {
  return typeof obj === 'object' && obj != null
}
function deepCopy(source){
  // 判断如果参数不是一个对象，返回改参数
  if(!isObject(source)) return source;
  // 判断参数是对象还是数组来初始化返回值
  let res = Array.isArray(source)?[]:{};
  // 循环参数对象的key
  for(let key in source){
    // 如果该key属于参数对象本身
    if(Object.prototype.hasOwnProperty.call(source,key)){
      // 如果该key的value值是对象，递归调用深拷贝方法进行拷贝
      if(isObject(source[key])){
        res[key] = deepCopy(source[key]);
      }else{
        // 如果该key的value值不是对象，则把参数对象key的value值赋给返回值的key
        res[key] = source[key];
      }
    }
  }
  // 返回返回值
  return res;
};

const obj = {
    name: 'zs'
}

const obj2 = deepCopy(obj)

```

3. js内置api`structuredClone()`

```js
const obj = {
    name: 'zs'
}

const obj2 = structuredClone(obj)
```

## 深浅拷贝的区别

js数据类型分两种： 基本数据类型，引用数据类型

**基本数据类型**在拷贝的时候并不会有什么问题，因为基本数据类型是存放在栈内存中的，每个变量在栈内存中有独立的内存空间，所有变量与变量之间并不会有影响

**引用数据类型**在拷贝的时候就有区别了，引用数据类型是存放在堆内存中的，我们的变量保存的只是一个地址，这个地址指向的就是堆内存，在我们拷贝的时候只是把地址拷贝了一份，两个变量指向的是同一个内存，所有在修改值的时候会影响到指向同一个地址的变量

1. 浅拷贝

浅拷贝就是简单的把另外一个属性复制了一份，如果是基本数据类型则复制他的值，如果是引用类型复制的就是地址，简单演示

```js
const obj = {
    a:{
        b:1
    }
}

const obj2 = {...obj}

// 当修改里面的值时 obj的值也发生了改变
obj2.a.b = 2
```

2. 深拷贝

深拷贝就是遍历整个数据，当是基本数据类型则直接拷贝，如果是对象或者数组时，可以创建一个空对象或者空数组，然后继续递归遍历，把里面的属性添加进去

实际开发中一般只会考虑对象和数组类型两个情况，但是引用类型还有很多情况，比如`new Date`,`new Error`,`function`等等......如果需要考虑其他类型则要加更多的判断

>所以在开发中，如果变量内部有引用类型数据时，一定要使用深拷贝后再进行其他操作，否则在修改时会影响到原数据，可能会有难以想象的bug

## 不同深拷贝方法的区别

### JSON.parse + JSON.stringify

使用JSON在很多情况下都可以满足我们的需求，但是有几种特定的情况下，JSON是无法帮助我们实现深拷贝的

```js
const obj = {
  set: new Set([1, 3, 3]),
  map: new Map([[1, 2]]),
  regex: /foo/,
  deep: { array: [new File(someBlobData, "file.txt")] },
  error: new Error("Hello!"),
};

const objCopy = JSON.parse(JSON.stringify(obj))
```

我们会得到：

```js
{ set: {}, map: {}, regex: {}, deep: { array: [{}] }, error: {} }
```

这个方法对`Set` `Map` `正则` `构造函数`是无法实现深拷贝的，所以以后我们在遇到这些类型的时候就不要使用`JSON.parse`和`JSON.stringify`了

### structuredClone

这个是javascript新的内置API，可以做很多JSON没法实现的深拷贝，但是也是有某些情况无法拷贝

1. 不可以拷贝函数

会导致抛出 DATA_CLONE_ERR 的异常

2. 不可以拷贝 DOM节点

同样会抛出 DATA_CLONE_ERR 异常

3. 对象的某些特定参数也不会被保留
4. RegExp 对象的 lastIndex 字段不会被保留
5. 使用Object.defineProperty()添加的getter和setter也不会保留

### 手写深拷贝

手写只考虑两种情况，`object`非`null`类型，`array`类型，因为这是我们开发常用的，手写深拷贝，也可以根据不同的业务需求修改判断条件，
