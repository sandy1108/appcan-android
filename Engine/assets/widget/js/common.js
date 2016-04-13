/*
 *@method JS 公用js方法及对象
 *@author jun.zheng
 */

//测试统计
//var chongqingUrl= 'http://119.84.15.207:9085/cmstj/app';
//新CMS数据接口地址
var chongqingUrl= 'http://119.84.15.207:8200/xhlcq/app';
//var chongqingUrl= 'http://192.168.1.83:9002/default/app';
//var chongqingUrl="http://cms.cqliving.com:9084/chongqing_new/app";
var uploadHttp = "http://119.84.15.207:8200/xhlcq/upload"; //头像和随手拍拍上传接口
//var uploadHttp = "http://119.84.15.207:9085/cmstj/upload";
//var uploadHttp = "http://cms.cqliving.com:9084/chongqing_new/upload"; //头像和随手拍拍上传接口
//七牛图片地址
var pictureUrl_qn="http://7xlbef.com1.z0.glb.clouddn.com/";
//emm链接地址
var emmUrl="http://emm.cqliving.com/";

// //北京演示环境地址
// var chongqingUrl="http://119.253.41.173:18085/chongqing_new/app";
// var uploadHttp = "http://119.253.41.173:18085/chongqing_new/upload"; //头像和随手拍拍上传接口
// //七牛图片地址
// var pictureUrl_qn="http://7xlbef.com1.z0.glb.clouddn.com/";
// var emmUrl="http://cloud.appcan.cn/v4/";


//old域名地址(活动模块使用)
var chongqingUrl_old = 'http://cms.cqliving.com/chongqing/cms'; //cms后台地址
var pictureUrl_old="http://cms.cqliving.com/sdk10394/public/3.0/files/";  //图片地址
var uploadHttp1_old="http://cms.cqliving.com/chongqing/upload"; //随手拍上传接口
var uploadHttp_old= "http://cms.cqliving.com/chongqing/upload"; //头像拍上传接口
var headImgHttp_old = "http://cms.cqliving.com/sdk00000/public/3.0/files/"; //头像显示数据
//七牛图片地址
var pictureUrl_qn_old="http://7xkrlu.com1.z0.glb.clouddn.com/";

var uploadHttp_qn="";

var winPlat = window.navigator.platform; 
var isPhone = !(winPlat == 'Win32' || winPlat == 'Win64' || winPlat == 'MacIntel' || winPlat == 'Linux i686' || winPlat == 'Linux x86_64');
var isAndroid = (window.navigator.userAgent.indexOf('Android')>=0)?true : false;
var isSML = (window.navigator.platform=='Win32')?1:0; /*是否在模拟器上运行, 1是0否*/
//上拉下拉显示的动画显示及背景色
var imgSettingsVal='{"imagePath":"res://jiantou.png","textColor":"#999999","pullToReloadText":"　　拖动刷新","releaseToReloadText":"　　释放刷新","loadingText":"　　加载中","loadingImagePath":"res://load.png"}';
var bounceBgColor="#e8e8e8";
//弹出加载效果动画的默认ID
var loaderAnimationId=4;

 /* 新cms根据前端展示类型获取图片地址返回
 * @param Int identification 标识：0==>后台上传图片 or 1==>客户端上传图片（随手拍、头像）
 * @param StringOrObject picId 传入的图片id（字符串或数组对象）
 * @param String type 1==>普通图片;2==>头像
 */
function getImgUrl(identification,picId,type){
    var resolution_slider="?imageView2/2/w/682/h/373"; //轮播列表图分辨率682*373
    var resolution_head="?imageView2/2/w/125/h/125"; //头像列表图分辨率125*125
    var resolution_item="?imageView2/2/w/330/h/260"; //资讯列表图分辨率330*260
    var resolution_shoot="?imageView2/2/w/682/h/373"; //随手拍列表图分辨率682*373
    var resolution_advert="?imageView2/2/w/550/h/976"; //全屏图分辨率682*373
    var resolutionVal="";//根据type确定分辨率
    var picUrl=""; //返回处理后的的地址串
    switch(type){
        case 1: //轮播图
            resolutionVal=resolution_slider;
            break;
        case 2: //头像处理（直接取七牛）
            resolutionVal=resolution_head;
            picUrl="css/img/oheadpic.png";
            break;
        case 3: //列表图
            resolutionVal=resolution_item;
            break;
        case 4: //随手拍(直接取七牛)
            resolutionVal=resolution_shoot;
            break;
        case 5: //预加载页分辨率
            resolutionVal=resolution_advert;
            break;
        default:  //默认原图
            picUrl=picId;
            break;
    }
    picUrl=picId+resolutionVal;
    return picUrl;
}

/* 根据前端展示类型获取图片地址返回
 * @param Int identification 标识：0==>后台上传图片 or 1==>客户端上传图片（随手拍、头像）
 * @param StringOrObject picId 传入的图片id（字符串或数组对象）
 * @param String type 1==>普通图片;2==>头像
 */
function getPictureUrl(identification,picId,type){
    var resolution_slider="?imageView2/2/w/682/h/373"; //轮播列表图分辨率682*373
    var resolution_head="?imageView2/2/w/125/h/125"; //头像列表图分辨率125*125
    var resolution_item="?imageView2/2/w/330/h/260"; //资讯列表图分辨率330*260
    var resolution_shoot="?imageView2/2/w/682/h/373"; //随手拍列表图分辨率682*373
    var resolutionVal="";//根据type确定分辨率
    var picUrl=""; //返回处理后的的地址串
    switch(type){
        case 1: //轮播图
            resolutionVal=resolution_slider;
            //picUrl=setPicUrl(picId,resolutionVal);
            if(typeof(picId)=="object"){
                if(isArray(picId)){
                    picUrl=pictureUrl_qn+picId[0].attcOriginal+resolutionVal;
                }else{
                    picUrl=pictureUrl_qn+picId.attcOriginal+resolutionVal;
                }
            }else{
                picUrl=pictureUrl_qn+picId+resolutionVal;
            }
            break;
        case 2: //头像处理（直接取七牛）
            resolutionVal=resolution_head;
            if(isDefine(picId)){
                if((picId).indexOf("qn_")!=-1){
                    var pictrueId=pictrueId.substring(3,picId.length);
                    picUrl=pictureUrl_qn+pictrueId+resolutionVal;//七牛图片
                }else{
                    //picUrl=headImgHttp+picId;//数据库图片
                    picUrl=pictureUrl_qn+picId+resolutionVal;//七牛库图片
                }
            }else{
               picUrl="css/img/oheadpic.png";
            }
            break;
        case 3: //列表图
            resolutionVal=resolution_item;
            //picUrl=setPicUrl(picId,resolutionVal);
            if(typeof(picId)=="object"){
                if(isArray(picId)){
                    picUrl=pictureUrl_qn+picId[0].attcOriginal+resolutionVal;
                }else{
                    picUrl=pictureUrl_qn+picId.attcOriginal+resolutionVal;
                }
            }else{
                picUrl=pictureUrl_qn+picId+resolutionVal;
            }
            break;
        case 4: //随手拍(直接取七牛)
            resolutionVal=resolution_shoot;
            //picUrl=setPicUrl(picId,resolutionVal);
            if(typeof(picId)=="object"){
                if(isArray(picId)){
                    picUrl=pictureUrl_qn+picId[0].attcId+resolutionVal;
                }else{
                    picUrl=pictureUrl_qn+picId.attcId+resolutionVal;
                }
            }else{
                picUrl=pictureUrl_qn+picId+resolutionVal;
            }
            break;
        default:  //默认原图
            picUrl=setPicUrl(picId,resolutionVal);
            //picUrl=pictureUrl_qn+picId[0].attcOriginal+resolutionValue;
    }
    return picUrl;
}

/* 图片地址赋值，返回需要的分辨率图片地址
 * @param StringOrObject picId 传入的图片id（字符串或数组对象）
 * @param String resolutionValue 需要的图片分辨率
 */
function setPicUrl(picId,resolutionValue){
   if(isDefine(picId[0]) && isArray(picId)){//************传入数组的情况
        if(isDefine(picId[0].attcIcon)){//存在判断是否为七牛
            var pictrueId=picId[0].attcIcon;
            if((pictrueId).indexOf("qn_")!=-1){
                pictrueId=picId[0].attcOriginal;
                return (pictureUrl_qn+pictrueId+resolutionValue);//七牛图片
            }else{
                if(isDefine(picId[0].attcOriginal)){
                    var pictrueId=picId[0].attcOriginal;
                    return (pictureUrl+pictrueId);//数据库图片
                }else if(isDefine(picId[0].attcId)){
                   var pictrueId=picId[0].attcId;
                   return (pictureUrl+pictrueId);//数据库图片
                }else{
                   return (pictureUrl+pictrueId);//数据库缩略图片
                }
            }
        }else if(isDefine(picId[0].attcOriginal)){//数据库原图
            var pictrueId=picId[0].attcOriginal;
            return (pictureUrl+pictrueId);
        }else if(isDefine(picId[0].attcId)){//数据库图片
           var pictrueId=picId[0].attcId;
           return (pictureUrl+pictrueId);
        }else{
            return 'image/noPic.png';//默认图片
        }
    }else{//**************直接传入图片Id、对象的情况
        if(typeof(picId)=="object"){//传入的是对象
            if((picId.attcIcon).indexOf("qn_")!=-1){
                    return (pictureUrl_qn+picId.attcOriginal+resolutionValue);//七牛图片
                }else{
                    return (pictureUrl+picId.attcOriginal);//数据库图
                }
        }else{//直接传入id
            if((picId).indexOf("qn_")!=-1){
                return (pictureUrl_qn+picId+resolutionValue);//七牛图片
            }else{
                return (pictureUrl+picId);//数据库图
            }
        }
    }
}

/* 图片预加载
 * @param String imgId div的ID，图片加载成功后给该div换背景
 * @param String imgUrl 图片路径
 */
function preloadImg(imgId,imgUrl){
    var newImg = new Image();
    newImg.src = imgUrl;
    newImg.onload=function(){
        document.getElementById(imgId).style.backgroundImage = "url("+newImg.src+")";
        newImg = null;
    }
}

 /* 利用flag 512打开外链
 * @param String fName div的ID，图片加载成功后给该div换背景
 * @param String url 图片路径
 * @param Int x 对应左边的距离
 * @param Int y 对应上边的距离
 * @param String id dom的id选择器
 */
function openPop512(fName,url,x,y,id){
   var w = $('#'+id).offset().width;
   var h = $('#'+id).offset().height;
   var cont = '';
   // alert(url);
   uexWindow.openPopover(fName,0,url,cont,x,y,w,h,'',512,'0','{"extraInfo":{"opaque":"true","bgColor":"#fff","delayTime":"100"}}');
}

function getPicArray(data1,idx,no,storArray,callback){
    if (idx >= data1.length) {
        callback();
        return;
    } else if (data1[idx].attcTypeId == no) {
        var attcId = data1[idx].attcId;
        //callback(attcId);
        storArray.push(attcId)
    }
    getPicArray(data1, ++idx, no, storArray,callback);
}

//判断是否定义或存在
function isDefine(para) {
    if ( typeof para == "undefined" || para == "" || para == "[]" || para == null || para == undefined || para == "undefined") {
        return false;
    } else if(typeof para == "number" || para=="number" ||  para == "null"){
        return true;
    }else{
        for (var o in para) {
            return true;
        }
        return false;
    }
}

//是否为数组
function isArray(arg){
  return Object.prototype.toString.call(arg) === '[object Array]';
}

/**
 * localStorage保存数据
 * @param String key  保存数据的key值
 * @param String value  保存的数据
 */
function setLocVal(key, value) {
    window.localStorage[key] = value;
}

/**
 * 根据key取localStorage的值
 * @param Stirng key 保存的key值
 */
function getLocVal(key) {
    if (window.localStorage[key]){
        return window.localStorage[key];
    }else{
        return "";
    }
}

/**
 * 清除缓存
 * @param Striong key  保存数据的key，如果不传清空所有缓存数据
 */
function clearLocVal(key){
    if(key){
        window.localStorage.removeItem(key);
    }else{
        window.localStorage.clear();
    }
}

function isUser(){
    var userStrat = getLocVal('loginState');
    if(userStrat == 'yes'){
        return true;
    }else{
        return false;
    }
}

/**
 * 计算两个时间的时间差
 * @param author jun.zheng
 */
function dateBetween(date1,date2){
    var date3=date2.getTime()-date1.getTime();  //时间差的毫秒数
    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000));
    //计算出小时数
    var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));
    //计算相差秒数
    var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);
    var res={
        "days":days,
        "hours":hours,
        "minutes":minutes,
        "seconds":seconds
    };
    return res;
    //alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
}

//获取年份//获取月份//获取日期
function NYR(date, flag) {
    var da = new Date(date);
    if (isDefine(flag)) {
        if (flag == 1) {
            return da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
        } else {
            return ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
        }
    } else {
        return da.getFullYear() + "年" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "月" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate()) + "日";
    }
}

/**
 * 日期 转换为 Unix时间戳
 * @param <string> 2014-01-01 20:20:20  日期格式
 * @return <int>        unix时间戳(秒)
 */
function DateToUnix(string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(parseInt(d[0], 10) || null, (parseInt(d[1], 10) || 1) - 1, parseInt(d[2], 10) || null, parseInt(t[0], 10) || null, parseInt(t[1], 10) || null, parseInt(t[2], 10) || null)).getTime();
}

/**
 * 时间戳转换日期
 * @param <int> unixTime   待时间戳(秒)
 * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
 * @param <int>  timeZone  时区
 */
function UnixToDate(unixTime, isFull, timeZone) {
    if ( typeof (timeZone) == 'number') {
        unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
    }
    var time = new Date(unixTime);
    var ymdhis = "";
    ymdhis += time.getFullYear() + "-";
    ymdhis += ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)) + "-";
    ymdhis += time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    if (isFull === true) {
        ymdhis += " " + (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ":";
        ymdhis += (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ":";
        ymdhis += time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    }
    return ymdhis;
}

//计算时间差
function timePoor(date){
    var date1=new Date(date);  //开始时间
    var date2=new Date();    //结束时间
    var date3=date2.getTime()-date1.getTime();  //时间差的毫秒数
    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000));
    //计算出小时数
    var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));
    //计算相差秒数
    //var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
    //var seconds=Math.round(leave3/1000);
    var yy = date1.getFullYear();
    var mm = date1.getMonth() + 1;
    var dd = date1.getDate();
    var str = yy + "-" + mm + "-" + dd;
    if(days < 3){
         if(days > 0){
            str = days + '天前';
        }else if(hours > 0){
            str = hours + '小时前';
        }else if(minutes>0){
            str = minutes + '分钟前';
        }else{
            str = '刚刚';
        }
    }
    return str;
}

function GetInfoDevice(callback){
    if(!isSML){
       uexDevice.cbGetInfo=function (opCode,dataType,data){
            var device = eval('('+data+')');
            var connectStatus=device.connectStatus;
            if(connectStatus!=null&&connectStatus.length>0){
                if(connectStatus==-1){
                    appcan.window.openToast('网络不可用!',2000,8);
                    callback(false);
                }else{
                    callback(true);
                }
            }
        }
        uexDevice.getInfo('13'); 
    }
    else{
        callback(true);
    }
}

//广告跳转管理，浮动页部分
function goAdDetail(itemInfo){
    // if(!isDefine(itemInfo)){
        // appcan.window.openToast('请刷新以后重试',2000);
        // return false;
    // }
    console.log(itemInfo);
    //传递点击列表信息
    appcan.locStorage.setVal('newsItemInfo',JSON.stringify(itemInfo));
    //console.log(JSON.stringify(itemInfo[newsIdVal]));
    if(itemInfo.billBoardTypeId==2){
        //跳转图片新闻展示页面
        appcan.window.open('home_DetailsPictures','home_DetailsPictures.html',10);
    }else if(itemInfo.billBoardTypeId==5){
        //跳转专题列表
        appcan.window.open('spe_page','spe_page.html',10);
    }else if(itemInfo.billBoardTypeId==6){
        //跳转栏目
        var goColumnId=itemInfo.columnId;
        //alert(goColumnId);
        uexWindow.evaluateScript("home_page", 0, "openFrame("+goColumnId+")");
        // appcan.locStorage.setVal("govermentColumnDomIndex","id_"+goColumnId);
        // uexWindow.evaluateScript("", 0, "goGoverment("+goColumnId+")");
    }else{
        //跳转新闻详细页面
        appcan.window.open('home_Details','home_Details.html',10,1024);
    }
}

//广告跳转管理，浮动页部分
function goAdDetailItaly(itemInfo){
    // if(!isDefine(itemInfo)){
        // appcan.window.openToast('请刷新以后重试',2000);
        // return false;
    // }
    console.log(itemInfo);
    //传递点击列表信息
    appcan.locStorage.setVal('newsItemInfo',JSON.stringify(itemInfo));
    //console.log(JSON.stringify(itemInfo[newsIdVal]));
    if(itemInfo.billBoardTypeId==2){
        //跳转图片新闻展示页面
        appcan.window.open('home_DetailsPictures','home_DetailsPictures.html',10);
    }else if(itemInfo.newsTypeId==5){
        //跳转专题列表
        appcan.window.open('spe_page','spe_page.html',10,1024);
    }else if(itemInfo.billBoardTypeId==6){
        //跳转栏目
        var goColumnId=itemInfo.columnId;
        //alert(goColumnId);
        
        uexWindow.evaluateScript("home_page", 0, "openFrame("+goColumnId+")");
        uexWindow.evaluateScript("", 0, "appcan.window.close(-1);");
        // appcan.locStorage.setVal("govermentColumnDomIndex","id_"+goColumnId);
        // uexWindow.evaluateScript("", 0, "goGoverment("+goColumnId+")");
    }else{
        //跳转新闻详细页面
        appcan.window.open('home_Details','home_Details.html',10,1024);
    }
}

//栏目定位
function menuLocation(elem){
    var desRes="";
    var scrollLen="";
    desRes=slideDes(elem);
    //alert(JSON.stringify(desRes));
    if(desRes.des!="middle"){//需要向左滚动
        scrollLen=desRes.distance;
        $('#menu').scrollLeft(scrollLen);
    }
}

//是否需要滑动栏目(核心算法逻辑 From:)
var slideDes=function(elem){
    var direction="middle";
    var scrollLen=0;
    var preDom="";
    var nextDom="";
    var preElemDistance="";
    var preElemWidth="";
    var nextElemDistance="";
    var nextElemWidth="";
    
    preDom=elem.previousSibling;
    nextDom=elem.nextSibling;
    
    var viewWidth = parseInt(document.documentElement.clientWidth);//可视化区域的宽度
    var scrollDistance = parseInt(document.getElementById('menu').scrollLeft);//当前滚动条横向滚动的距离
    
    var elemDistance = parseInt(elem.getBoundingClientRect().right);//当前点击元素距离最左边的宽度
    var elemWidth = parseInt(elem.offsetWidth);//当前点击元素的宽度
    
    //alert(viewWidth+" "+scrollDistance+" "+elemDistance+" "+elemWidth);
    
    if(isDefine(preDom)){
        preElemDistance=parseInt(preDom.getBoundingClientRect().left);//前一个元素距离最左边的宽度
        preElemWidth=parseInt(preDom.offsetWidth);//前一个元素的宽度
    }
    
    if(isDefine(nextDom)){
        nextElemDistance=parseInt(nextDom.getBoundingClientRect().right);//下一个元素距离最左边的宽度
        nextElemWidth=parseInt(nextDom.offsetWidth);//下一个元素的宽度
    }
    
    //先判断定位的栏目是否在可视化区域类
    var _isInViewport=isInViewport(elem);
    if( _isInViewport ){//在可视化区域类
        if(isDefine(preDom) && !isInViewport(preDom)){//视为左边第一个，向右移动
            direction="right";
            //scrollLen=(preElemDistance+preElemWidth)-(viewWidth+scrollDistance);
            scrollLen=scrollDistance-preElemWidth;
        }else if(isDefine(preDom) && !isInViewport(nextDom)){
            direction="left";
            //scrollLen=(nextElemDistance+nextElemWidth)-(viewWidth+scrollDistance);
            scrollLen=scrollDistance+nextElemWidth;
        }
    }else{//不在可视化区域类
        if(elemDistance<(viewWidth+scrollDistance)){//在左边，需要向右移
            direction="right";
            scrollLen=elemDistance-elemWidth;
        }else{//在右边，需要向左移
            direction="left";
            scrollLen=(elemDistance+elemWidth)-(viewWidth+scrollDistance);
            scrollLen+=scrollDistance;
        }
    }
    
    var res={
        "des":direction,
        "distance":scrollLen
    }
    return res;
}


//判断元素是否在可视化之内
var isInViewport = function ( elem ) {
    var distance = elem.getBoundingClientRect();
        return (
            distance.top >= 0 &&
            distance.left >= 0 &&
            distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            distance.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
}

//加载效果自定义动画
var loader={
    windowName:"",
    animationId:"",
    open:function(animationId,windowName){
        this.windowName=windowName;
        this.animationId=animationId;
        isDefine(animationId)?appcan.locStorage.setVal("loaderAnimationId",this.animationId):appcan.locStorage.setVal("loaderAnimationId",loaderAnimationId);
        //var executeJS='uexWindow.openPopover("loader",0,"loading.html","",0,0,document.body.clientWidth,document.body.clientHeight,32,0,0);';
        var executeJS='uexWindow.openPopover("loader",0,"loading.html","",document.body.clientWidth/3.25,document.body.clientHeight/3.25,document.body.clientWidth/2.5,document.body.clientHeight/3,32,0,0);';
        if(isDefine(windowName)){//根据窗口弹出loader
            uexWindow.evaluateScript(this.windowName,0,executeJS + 'uexWindow.bringPopoverToFront("loader");');
        }else{
            uexWindow.evaluateScript("",0,executeJS + 'uexWindow.bringPopoverToFront("loader");');
        }
    },
    close:function(){
        uexWindow.closePopover("loader");
    }
}

//获取打开页面地址传入的参数
function zy_parse(){
    var params = {};
    var loc = String(document.location);
    if (loc.indexOf("?") > 0) {
        loc = loc.substr(loc.indexOf('?') + 1);
    }else {
        loc = uexWindow.getUrlQuery();
    }
    if(loc){
        loc = String(loc);
        if(loc.indexOf("&")>0){
            var pieces = loc.split('&');
        }else{
            var pieces = [loc];
        }
        params.keys = [];
        for (var i = 0; i < pieces.length; i += 1) {
            var keyVal = pieces[i].split('=');
            params[keyVal[0]] = decodeURIComponent(keyVal[1]);
            params.keys.push(keyVal[0]);
        }
    }
    return params;
}

//创建文件
function createFile(path) {
    uexFileMgr.isFileExistByPath(path);//先判断是否已存在，在判断结果中决定是否从创建 
}

//打开文件并写入文件(写入json数据)
 function writeFile(num,path,data) {
    uexFileMgr.openFile(num, path, '1');
    uexFileMgr.writeFile(num, '0', data);
}

//打开文件并读取文件
 function readFile(num,path){
    uexFileMgr.openFile(num, path, '1');
    uexFileMgr.readFile(num, "-1");
}


//请求校验app后台栏目管理信息是否修改，用于更新本地版本
var path_myColumns= "wgt://data/columnsData20160303.txt",
    path_sign='20160303',
    demos=['home_page1_content.html','home_page2_content.html','home_page3_content.html','home_page4_content.html','home_page5_content.html','home_page6_content.html','shoot.html','italy.html','home_page9_content.html','home_page10_content.html'],                
    locColumnsData={},
    topColumnsData={},
    sideColumnsData={},
    governmentColumnsData={};
    
var columnInfo={
    updateIdentification:"20160301",
    newIdentification:"",
    getColumnsUpdateTime:function(callback){
      var tempStr=appcan.locStorage.val("updateIdentification");
      var getColumns= this.getColumns;
      var newIdentification=this.newIdentification;
      var updateIdentification=this.updateIdentification;
      var if_list = {
           transcode : "column_getColumnEditTime"
      };
      appcan.request.ajax({
            url : chongqingUrl,
            headers : {
                token : appcan.locStorage.val("token") || '',
                deviceId : appcan.locStorage.val("deviceId") || ''
            },
            appVerify:true,
            data : JSON.stringify(if_list),
            timeout : "15000",
            type : "POST",
            contentType : "application/json",
            dataType : "json",
            success : function(res) {
                console.log("校验==>重庆app栏目是否修改返回====>");
                console.log(res);
                if(res.status == '000'){
                    newIdentification=res.data;//后台数据库请求结果
                    updateIdentification=isDefine(tempStr)?tempStr:'20160301';
                    //alert(updateIdentification+" "+newIdentification);
                    if(updateIdentification!=newIdentification){ //标识改变，需要重新获取栏目数据
                        getColumns(newIdentification,callback);//获取栏目信息
                    }else{ //无更新直接读取旧文件
                        callback(0);
                    }
                }else{
                    //uexWindow.toast(1, 5, res.msg, 2000);
                    callback(0);
                }
            },
            error : function(xhr, errorType, error,msg) {
                callback(0);
                //uexWindow.toast(1, 5, "获取栏目更新时间失败", 2000);
            }
        })
    },
    getColumns:function(newDate,callback){
      var if_list = {
        transcode : "column_getAllList"
      };
      appcan.request.ajax({
            url : chongqingUrl,
            headers : {
                token : appcan.locStorage.val("token") || '',
                deviceId : appcan.locStorage.val("deviceId") || ''
            },
            appVerify:true,
            data : JSON.stringify(if_list),
            timeout : "15000",
            type : "POST",
            contentType : "application/json",
            dataType : "json",
            success : function(res) {
                console.log("栏目===>重庆app所有栏目信息返回====>");
                console.log(res);
                if(res.status == '000'){
                    var datas=res.data;//后台数据库请求结果
                    //alert(JSON.stringify(datas));
                    if(isDefine(datas)){
                        //alert("获取数据成功,存入最新更新时间===>"+newDate);
                        appcan.locStorage.setVal("updateIdentification",newDate);
                        locColumnsCallBack(newDate,datas,callback);
                    }else{
                        callback(0);
                    }
                }else{
                    callback(0);
                    //uexWindow.toast(1, 5, res.msg, 2000);
                }
            },
            error : function(xhr, errorType, error,msg) {
                callback(0);
                //uexWindow.toast(1, 5, "获取服务器栏目信息失败", 2000);
            }
        })
    }
}

//处理获取到的本地栏目信息
function locColumnsCallBack(updateDate,res,callback){
        var datas=res;
        console.log(">>>>服务器返回给本地处理====>");
        console.log(datas);
        var topColumns=isDefine(datas.News)?getNewsColumns(datas.News):"";
        var sideColumns=isDefine(datas.Side)?getSideColumns(datas.Side):"";
        var govermentColumns=isDefine(datas.Goverment)?getGovermentColumns(datas.Goverment):"";
        locColumnsData={
            "update":updateDate,
            "topColumns":topColumns,
            "sideColumns":sideColumns,
            "govermentColumns":govermentColumns
        };
        console.log(">>>>>>>>locColumnsData文件分离处理后存入本地的数据====>");
        console.log(locColumnsData);
        
         //临时存储最新栏目数据(首选方式)
        appcan.locStorage.setVal("columnsDataTemp",JSON.stringify(locColumnsData));
       
        //存储本地文件txt（第二方式）
        createFile(path_myColumns);
        //写入文件
        uexFileMgr.cbWriteFile = function(opCode,dataType,data) {
            if(data==0){
                //uexWindow.toast(0, 5, "写入文件成功", 2000);
                callback(1);
            }else{
                //uexWindow.toast(0, 5, "写入文件失败", 2000);
                callback(0);
            }
            uexFileMgr.closeFile(num);
        }
        //创建文件回掉
        uexFileMgr.cbCreateFile = function(opId, dataType, data) {
            if(data == 0){//创建成功
                console.log("===>创建文件成功");
                //并写入初始数据
                writeFile(path_sign,path_myColumns,JSON.stringify(locColumnsData));
                if(isSML){
                    callback(1);
                }
            }else{
                //uexWindow.toast(0, 5, "创建文件失败", 2000);
                callback(0);
            }
        }
        //根据路径判断文件是否存在
        uexFileMgr.cbIsFileExistByPath = function(opId, dataType, data) {
            if(data == 0){//不存在该文件先传创建并 写入数据
                //不存在文件 先创建默认文件再写入
                uexFileMgr.createFile(path_sign, path_myColumns);
            }else if(data == 1) {//存在该文件 直接写入
                 //直接覆盖写入初始数据
                //alert("文件已存在，直接写入====>");
                writeFile(path_sign,path_myColumns,JSON.stringify(locColumnsData));
                if(isSML){
                    callback(1);
                }
            }else{
                //uexWindow.toast(0, 5, "无法读取判断文件是否存在", 2000);
                callback(0);
            }
        }
    }
    
    function getNewsColumns(data){
        //console.log(data);
        var pageData={},
            res=[],
            res_f=[],
            res_r=[],
            inPageName="",
            columnName="",
            demoId=1,
            isTemplate=1,
            isDefined=0,
            status=1,
            columnsType='f',
            columnStatus=appcan.locStorage.val("columnStatus")||[];
        for(index in data){//便利新闻栏目列表数据
            inPageName=data[index].columnId;
            columnName=data[index].columnName;
            var isShowDate=isDefine(data[index].isShowDate)?data[index].isShowDate:"";
            isDefined=data[index].isDefined;
            if(isDefine(columnStatus)){
                var tempStatus=JSON.parse(columnStatus)[inPageName];
                status=isDefine(tempStatus)?tempStatus:1;
            }
            
            demoId=data[index].templateStyle;
            isTemplate=isDefine(data[index].isTemplate)?data[index].isTemplate:0;
            //columnsType=((demoId==6)||(demoId==7))?'r':'f';
            switch(demoId){
                case 6:
                case 7:
                    columnsType='r';
                    break;
                default:
                    columnsType='f';
                    break;
            };
            
            if(isTemplate==1){//模板选择处理
                pageData={
                    "inPageName":inPageName,
                    "templateStyle":demoId,
                    "inUrl":demos[demoId]+'?pageName='+inPageName+'&isShowDate='+data[index].isShowDate+'&isShowSummary='+data[index].isShowSummary,
                    "inData":"",
                    "childColumn":data[index].childColumn,
                    "id":'id_'+inPageName,
                    "columnName":columnName,
                    "isDefined":isDefined,
                    "columnsType":columnsType,
                    "isShowDate":data[index].isShowDate,
                    "isShowSummary":data[index].isShowSummary,
                    "status":status
                };
            }else if(data[index].isLink==1){//外链
                 pageData={
                     "inPageName":inPageName,
                     "inUrl":data[index].linkUrl,
                     "inData":"",
                     "childColumn":data[index].childColumn,
                     "flag":"512",
                     "id":'id_'+inPageName,
                     "columnName":columnName,
                     "isDefined":isDefined,
                     "columnsType":"f",
                     "isShowDate":isDefine(data[index].isShowDate)?data[index].isShowDate:"",
                     "isShowSummary":isDefine(data[index].isShowSummary)?data[index].isShowSummary:"",
                     "status":status
                 };
            }else{//非模板选择处理（组合形式）
                 pageData={
                    "inPageName":inPageName,
                    "templateStyle":demoId,
                    "inUrl":'home_pageCompositeDemo_content.html?pageName='+inPageName+'&isBillBoard='+data[index].isBillBoard+'&columnStyle='+data[index].columnStyle+'&isShowDate='+data[index].isShowDate+'&isShowSummary='+data[index].isShowSummary,
                    "inData":"",
                    "childColumn":data[index].childColumn,
                    "id":'id_'+inPageName,
                    "columnName":columnName,
                    "isDefined":isDefined,
                    "columnsType":columnsType,
                    "isBillBoard":data[index].isBillBoard,
                    "columnStyle":data[index].columnStyle,
                    "isShowDate":isDefine(data[index].isShowDate)?data[index].isShowDate:"",
                    "isShowSummary":isDefine(data[index].isShowSummary)?data[index].isShowSummary:"",
                    "status":status
                };
                if(columnsType == 'r'){
                    pageData.inUrl = 'home_pageCompositeDemo.html?pageName='+inPageName+'&isBillBoard='+data[index].isBillBoard+'&columnStyle='+data[index].columnStyle+'&isShowDate='+data[index].isShowDate+'&isShowSummary='+data[index].isShowSummary;
                }
            }
            //前端过滤分离控制栏目(让跳转新页面的栏目放在最后)
            if(columnsType=='r'){
                res_r.push(pageData);
            }else{
                res_f.push(pageData);
            }
          //res.push(pageData);
        }
        
        res=res_f.concat(res_r);
        topColumnsData={
            "content":res
        };
        //console.log(JSON.stringify(topColumnsData));
        return(this.topColumnsData);
    }
    
    function getSideColumns(data){
        var News=[],
            Goverment=[],
            Enter=[];
        News=getData(data.News);
        Goverment=getData(data.Goverment);
        Enter=getData(data.Enter);
        sideColumnsData={
            "News":News,
            "Goverment":Goverment,
            "Enter":Enter
        };
        //console.log(JSON.stringify(sideColumnsData));
        return(this.sideColumnsData);
    }
    
    function getGovermentColumns(data){
        var pageData={},
            columnId="",
            columnName="",
            childColumn="",
            res=[];
        for(index in data){ //便利新闻栏目列表数据
            columnId=data[index].columnId;
            columnName=data[index].columnName;
            childColumn=isDefine(data[index].childColumn)?data[index].childColumn:"";
            pageData={
                "columnId":columnId,
                "columnName":columnName,
                "childColumn":childColumn  //子栏目
            };
            res.push(pageData);
        }
        governmentColumnsData={
            "content":res
        }
        //console.log(JSON.stringify(governmentColumnsData));
        return(governmentColumnsData);
    }
    
    function getData(data){
        var res=[],
            pageDate={},
            columnId="",
            columnName="";
        for(index in data){ //便利新闻栏目列表数据
            columnId=data[index].columnId;
            columnName=data[index].columnName;
            pageData={
                "columnId":columnId,
                "columnName":columnName
            };
            res.push(pageData);
        }
        return res;
    }

    /* @method userAction 用户行为操作
     * objId <Number> 对象ID
     * objType <Number> 对象类型  1-资讯，2-活动，3-评论，4-政务
     * operType <Number> 操作类型 1-点赞，2-收藏，3-分享，4-踩
     * sharingChannel <Number> 分享渠道   1-微信，2-QQ，3-新浪微博
     * userId <String> 操作者
     */
    function userAction(objId,objType,operType,sharingChannel,userId,callback,newsTypeId) {
        var conditions={};
        if(operType==3){
            conditions={
                "objType":objType,
                "operType":operType,
                "userId":userId,
                "sharingChannel":sharingChannel
            }
        }else{
            conditions={
                "objType":objType,
                "operType":operType,
                "userId":userId,
                "newsTypeId":newsTypeId
            }
        }
        var if_list = getInterface('userAction',objId,"",conditions);//接口封装配置函数
        console.log("用户行为接口======>"+JSON.stringify(if_list));
        appcan.request.ajax({
            url : chongqingUrl,
            headers : {
                token : appcan.locStorage.val("token") || '',
                deviceId : appcan.locStorage.val("deviceId") || ''
            },
            data : JSON.stringify(if_list),
            type : "POST",
            appVerify:true,
            timeout : "15000",
            dataType : "json",
            contentType : "application/json",
            success : function(res) {
                console.log("用户行为操作返回=====>");
                console.log(res);
                callback(res);
            },
            error : function(err) {
                
            }
        });
    }
    
    /* @method userAction 用户行为操作取消(remove)
     * objId <Number> 对象ID
     * objType <Number> 对象类型  1-资讯，2-活动，3-评论，4-政务
     * operType <Number> 操作类型 1-点赞，2-收藏，3-分享，4-踩
     * userId <String> 操作者
     */
    function userActionRemove(objId,objType,operType,userId,callback,newsTypeId) {
        var conditions={};
        conditions={
            "objType":objType,
            "operType":operType,
            "userId":userId,
            "newsTypeId":newsTypeId
        };
        var if_list = getInterface('userActionRemove',objId,"",conditions);//接口封装配置函数
        console.log("用户行为取消接口======>"+JSON.stringify(if_list));
        appcan.request.ajax({
            url : chongqingUrl,
            headers : {
                token : appcan.locStorage.val("token") || '',
                deviceId : appcan.locStorage.val("deviceId") || ''
            },
            data : JSON.stringify(if_list),
            type : "POST",
            appVerify:true,
            timeout : "15000",
            dataType : "json",
            contentType : "application/json",
            success : function(res) {
                console.log("用户行为取消操作返回=====>");
                console.log(res);
                callback(res);
            },
            error : function(err) {
                
            }
        });
    }
    
   //按钮点击波纹动画效果
   function btn_ink(id,e){
        var ink, d, x, y;
        $(".ink").remove();
        id.prepend("<span class='ink'></span>")
        ink = id.find(".ink");
        ink.removeClass("animate-ink");
        if (!ink.height() && !ink.width()) {
            d = Math.max(id.width(),id.height());
            ink.css({
                height: id.height(),
                width: id.width()
            })
        }
        x = e.pageX - id.offset().left - ink.width() / 2;
        y = e.pageY - id.offset().top - ink.height() / 2;
        ink.css({
            top:y-80,
            left:x-300
        }).addClass("animate-ink")
    }
    
     //指定页面显示是否可以横屏，解决多页面横屏冲突（也可以关闭弹出框，屏幕改变后再自行点击打开）
    function orientationChange(){ 
        switch(window.orientation) { 
            case 0:
                //alert(window.orientation);
                uexWindow.setOrientation(1);
                break;
            case 180: 
                //alert(window.orientation);
                uexWindow.setOrientation(4);
                break;
            case -90:
                //alert(window.orientation);
                uexWindow.setOrientation(8);
                break;
            case 90: 
                //alert(window.orientation);
                uexWindow.setOrientation(2);
                break;
        } 
    } 
    
    var pushRes="";
   //获取推送详情相关信息
   function getPushData(newsId){
        var userInfo=isDefine(getLocVal('userInfo')) ? getLocVal('userInfo'):"";
        var userId = isDefine(userInfo)?JSON.parse(userInfo).userId:"";
        var conditions={
                "userId":userId
            };
        var if_list=getInterface('newsInfoGetOne',newsId,1,conditions);//接口封装配置函数
        console.log(JSON.stringify(if_list));
        appcan.request.ajax({
            url : chongqingUrl,
            headers : {
                token : appcan.locStorage.val("token") || '',
                deviceId : appcan.locStorage.val("deviceId") || ''
            },
            appVerify:true,
            data : JSON.stringify(if_list),
            type : "POST",
            timeout : "15000",
            contentType : "application/json",
            dataType : "json",
            success : function(res) {
                console.log("推送相关信息返回====>");
                console.log(res);
                if(res.status == '000'){
                    pushRes=res.data;
                    //传递点击列表信息
                    appcan.locStorage.setVal('newsItemInfo',JSON.stringify(pushRes));
                    if(pushRes.newsTypeId==2){
                        //跳转图片新闻展示页面
                        appcan.window.open('home_DetailsPictures','home_DetailsPictures.html',10);
                    }else if(pushRes.newsTypeId==5){
                        //跳转专题列表
                        appcan.window.open('spe_page','spe_page.html',10,1024);
                    }else if(pushRes.newsTypeId==6){
                        //跳转栏目
                        var goColumnId=pushRes.columnId;
                        //alert(goColumnId);
                        uexWindow.evaluateScript("home_page", 0, "openFrame("+goColumnId+")");
                    }else{
                        //跳转新闻详细页面
                        appcan.window.open('home_Details','home_Details.html',10,1024);
                    }
                    //恢复推送消息值
                    appcan.locStorage.setVal('pushData','');
                }
            },
            error : function() {
                appcan.locStorage.setVal('pushData','');
            }
        })
   }
  
  var cA="";
  //完全退出app处理推送信息
  function closeAdvert(){
      cA=appcan.locStorage.val("isOpenAdvertShow");
      if(cA==1){
          uexWindow.evaluateScript("",0,"$('#header').removeClass('myVisibilityHide');$('#menu').removeClass('myVisibilityHide');$('#myColumns').removeClass('myVisibilityHide');$('#content').removeClass('myVisibilityHide');$('#footer').removeClass('myVisibilityHide');");
          //数据显示完成，关闭预加载页
          uexWindow.evaluateScript("", 0, "uexWindow.closePopover('advertShow');");
          appcan.locStorage.setVal("isOpenAdvertShow",0);
          //若为推送打开，直接打开对应的详情页
          var pushData=appcan.locStorage.val("pushData")||"";//'{"newsId":"50"}';
          if(isDefine(pushData)){
              //alert(pushData+"ahahaha");
              getPushData(JSON.parse(pushData).newsId);
          }
          //标识记录app已打开
          appcan.locStorage.setVal("appIsOpen",1);
      }
   }
   //程序挂起时处理推送信息
   function showPushData(){
       //若为推送打开，直接打开对应的详情页
      var pushData=appcan.locStorage.val("pushData")||"";
      if(isDefine(pushData)){
          //alert(pushData+"ahahaha");
          getPushData(JSON.parse(pushData).newsId);
      }
   }
   
   //获取预加载页数据
   var advertImgUrlVal="";
   function getAdvertShowData(callBack){
        var if_list={
            "transcode" : "startinfo_getList",
            "content" : {
                "isStartPage":1
            }
        };
        appcan.request.ajax({                                                                                                                                                                                                                                                                                                                                                                                                                                              
            url : chongqingUrl,
            headers : {
                token : appcan.locStorage.val("token") || '',
                deviceId : appcan.locStorage.val("deviceId") || ''
            },
            appVerify:true,
            data : JSON.stringify(if_list),
            timeout : "5000",
            type : "POST",
            contentType : "application/json",
            dataType : "json",
            success : function(res,status) {
                console.log("预加载页数据返回>>>");
                console.log(res);
                //alert(JSON.stringify(res));
                if(res.status != '000'){
                    //uexWindow.toast(1, 5, res.msg, 2000);
                    callBack(advertImgUrlVal);
                    return false;
                }
                var datas=res.data;//后台数据库请求
                if(isDefine(datas.list)){
                    advertImgUrlVal=datas.list[0].startUrls;
                    if(isDefine(advertImgUrlVal)){
                        appcan.locStorage.setVal('advertImgUrl',advertImgUrlVal);
                    }
                }
                callBack(advertImgUrlVal);
            },
            error : function(xhr, errorType, error,msg) {
                console.log("预加载获取失败！！！！！！");
                callBack(advertImgUrlVal);
            }
        });
    }
    
   /**
    * @param method base64_encode() base64加密函数 用于生成字符串对应的base64加密字符串
    * @param string str 原始字符串
    * @return string 加密后的base64字符串
    */
    function base64_encode(str){
            var c1, c2, c3;
            var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";                
            var i = 0, len= str.length, string = '';
            while (i < len){
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len){
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        string += "==";
                        break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len){
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        string += "=";
                        break;
                }
                c3 = str.charCodeAt(i++);
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                string += base64EncodeChars.charAt(c3 & 0x3F)
           }
        return string
    }

   /**
    * @param method base64_decode() base64解密函数 用于解密base64加密的字符串
    * @param string str base64加密字符串
    * @return string 解密后的字符串
    */
    function base64_decode(str){
        var c1, c2, c3, c4;
        var base64DecodeChars = new Array(
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
                58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,
                7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
                -1, -1
        );
        var i=0, len = str.length, string = '';
        while (i < len){
                do{
                    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
                } while (
                    i < len && c1 == -1
                );
                if (c1 == -1) {
                    break;
                }
                do{
                    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
                } while (
                    i < len && c2 == -1
                );
                if (c2 == -1){
                    break;
                } 
                string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                do{
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61)
                            return string;

                    c3 = base64DecodeChars[c3]
                } while (
                    i < len && c3 == -1
                );
                if (c3 == -1) {break;}
                string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                do{
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61) return string;
                    c4 = base64DecodeChars[c4]
                } while (
                    i < len && c4 == -1
                );
                if (c4 == -1) break;
                string += String.fromCharCode(((c3 & 0x03) << 6) | c4)
        }
        return string;
    }
    
  //自定义原生ajax请求JSAjax
    function JSAjax(options) {
        options = options || {};
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        var params = formatParams(options.data);

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        }

        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(params);
        }
    }
    //ajax格式化参数
    function formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".",""));
        return arr.join("&");
    }
    
   /**
   * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
   * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
   *
   * 000000 - 00007F(128个代码)   0zzzzzzz(00-7F)               一个字节
   * 000080 - 0007FF(1920个代码)   110yyyyy(C0-DF) 10zzzzzz(80-BF)       两个字节
   * 000800 - 00D7FF
   * 00E000 - 00FFFF(61440个代码)  1110xxxx(E0-EF) 10yyyyyy 10zzzzzz      三个字节
   * 010000 - 10FFFF(1048576个代码) 11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz 四个字节
   *
   * 注: Unicode在范围 D800-DFFF 中不存在任何字符
   * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
   * 000000 - 00FFFF 两个字节
   * 010000 - 10FFFF 四个字节
   *
   * @param {String} str
   * @param {String} charset utf-8, utf-16
   * @return {Number}
   */
  var sizeof = function(str, charset){
    var total = 0,
        charCode,
        i,
        len;
    charset = charset ? charset.toLowerCase() : '';
    if(charset === 'utf-16' || charset === 'utf16'){
      for(i = 0, len = str.length; i < len; i++){
          charCode = str.charCodeAt(i);
          if(charCode <= 0xffff){
              total += 2;
          }else{
              total += 4;
          }
      }
    }else{
      for(i = 0, len = str.length; i < len; i++){
          charCode = str.charCodeAt(i);
          if(charCode <= 0x007f) {
              total += 1;
          }else if(charCode <= 0x07ff){
              total += 2;
          }else if(charCode <= 0xffff){
              total += 3;
          }else{
              total += 4;
          }
       }
    }
    return total;
  }
  
  //字节数转换为对应大小
  function bytesToSize(bytes) {  
       if (bytes === 0){
           return '0 B';
       }  
       var k = 1024;  
       sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];  
       i = Math.floor(Math.log(bytes) / Math.log(k));  //对数
       //toPrecision(3) 后面保留一位小数，如1.0GB     
       return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];   
  }  
