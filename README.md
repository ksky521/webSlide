# webSlide — PPT演示文档javascript框架
[webSlide](https://github.com/ksky521/webSlide)是用于在线PPT演示文档的javascript框架。
另外提供[nodePPT](https://github.com/ksky521/nodePPT)使用nodejs写的，可以手机端控制pc端的演示文档框架。
## 鸣谢
webSlide的想法来自于impress.js，但是本人在使用过程中发现impress.js经常卡，尤其是当演示文档页面和图片比较多之时，经常出现动画效果不流畅。

写webSlide代码过程中，研究过[impress.js](http://bartaz.github.com/impress.js)和[reveal.js](http://lab.hakim.se/reveal-js/)，向两位作者表示感谢。

## 演示页面

演示页面地址[http://ksky521.github.com/webSlide/](http://ksky521.github.com/webSlide/)，由于页面比较多，所以需要一定的加载时间。

国内可以访问SAE上的演示页面：[http://qdemo.sinaapp.com/ppt/udc.htm](http://qdemo.sinaapp.com/ppt/udc.htm)。

演示页面内容为给公司UDC部门同事进行javascript入门培训的内容~

## 说明

因为是PPT演示文档，所以需要投影仪分辨率，所以演示页面的最佳分辨率为全屏模式下的 ``1024*768`` ，如果在自己电脑上查看，可以通过 ``ctrl + -`` 和 ``ctrl + +`` 缩放到合适的比例查看效果。

建议浏览器chrome 16+，全屏模式（F11），以达到最佳动画效果。在Firefox下会出现拖尾现象，个人认为是Firefox 8下对CSS3动画效果渲染太慢导致，其他浏览器未测试。

## 使用示例

    wSlide({
		slideId:'slide',//演示文档id
		canvasId:'myCanvas',//画板id
		ctrlId:'slideCtrl'//控制部分id
    });


#### 参数说明
> * slideId: 演示文档内容部分ID，class为step为每页，slide为带边框的页面，**必填**
> * canvasId: canvas元素画板部分ID，**选填**
> * ctrlId: 控制部分ID，class为home代表返回首页，class为paint开启画板，class为clearIt清除画板，**选填**
> * presentClass: 当前幻灯片class，**选填，默认为present**
> * pastClass: 上一页幻灯片class，**选填，默认为past**
> * futureClass: 下一页幻灯片class，**选填，默认为future**


## 快捷键

* 空格/→/↓/Tab/pageDown：下一页
* ←/↑/pageUp：上一页
* P：开画板
* C：清除画板

## 版本库地址

支持三种访问协议：

* HTTP协议： `https://ksky521@github.com/ksky521/webSlide.git` 。
* Git协议： `git://github.com/ksky521/webSlide.git` 。
* SSH协议： `ssh://git@github.com:ksky521/webSlide.git` 。

## 克隆版本库

操作示例：

    $ git clone git://github.com/ksky521/webSlide.git
	
## 联系方式

作者博客：[js8.in](http://js8.in)

作者新浪微博：[@三水清](http://weibo.com/sanshuiqing)
