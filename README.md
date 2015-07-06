# Zen

**Web framework based on KOA**

## Install

```js
git clone https://github.com/ygm125/Zen.git
npm install 
gulp server
gulp start
```

## Introduction

- src为需要编译的源码目录
- controller使用es6语法
- js同样使用es6语法，模块化书写，自动合并打包，无需加载器
- image自动压缩
- css采用less编写
- 引用资源md5更新
- 资源修改自动reload

## Issue

目标 co-views ==》co-render ==> consolidate.js

缓存参数设置丢失，目前人工hack

exports.swig.render增加如下判断

```js
if(!options.cache){
  engine.setDefaults({cache:false});
}
```

## TODO
- lazypipe的管道问题
- session缓存增加





