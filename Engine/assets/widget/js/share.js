/**
 * @author 重庆正益无线前端开发者
 * 重庆自定义分享js代码文件--from:重庆正益无线
 * 其中微信uexWeiXin.registerApp、微博uexSina.registerApp需要先登录，QQ不用先uexQQ.login登录
 * 注意微信分享的图片icon不能超过32k、分辨率最好用256 以及注意QQ分享成功的返回数据data的格式
 */
//分享摘要或标题
var titleVal='';
var summaryVal = '';
//场景选择
var sceneVal=0;
//分享资讯ids
var obj_Share=[];
//分享链接地址
var targetUrl='';
//分享的地址类别
var share_type='';
//
var isOutLink="";

var shareTopicId="";
//分享接口认证，先appId注册===>用户授权
function oncSheet(shareType,scene){
    titleVal = isDefine(appcan.locStorage.val('shareTitle')) ? appcan.locStorage.val('shareTitle'): '';
    summaryVal = isDefine(appcan.locStorage.val('shareSummary')) ? appcan.locStorage.val('shareSummary'): '';
    shareTopicId = isDefine(appcan.locStorage.val('shareTopicId')) ? appcan.locStorage.val('shareTopicId'): '';
    obj_Share = isDefine(appcan.locStorage.val('shareId')) ? appcan.locStorage.val('shareId').split('_') : [];
    isOutLink = isDefine(appcan.locStorage.val('newsDetailLink')) ? appcan.locStorage.val('newsDetailLink'): '';
   //分享场景  weixin ：0->朋友圈;1->好友; QQ:0->QQ好友;1->QQ空间
    sceneVal=scene;
    //type不传默认资讯类分享地址--->type=active为活动类，type=interactive为互动类
    share_type=isDefine(appcan.locStorage.val('share_type')) ? appcan.locStorage.val('share_type'): '';
    
    if(share_type=="interactive"){//互动
         //targetUrl= "http://cms.cqliving.com/cq/app_share.html?dmnId=cq&type=interactive&objectId="+objAndNew_Share[0]+"&newsId="+objAndNew_Share[1];
         targetUrl= "http://cms.cqliving.com:81/photoInfo_getShareNews?newsId="+obj_Share[0];
    }else if(share_type=="active"){//活动
         //targetUrl= "http://cms.cqliving.com/cq/app_share.html?dmnId=cq&type=active&objectId="+objAndNew_Share[0]+"&newsId="+objAndNew_Share[1];
         targetUrl= "http://cms.cqliving.com:81/newsInfo_getShareNews?newsId="+obj_Share[0]+"&objectType="+obj_Share[1]+"&topicId="+shareTopicId;;
    }else if(share_type=="spe"){//专题
         //targetUrl= "http://cms.cqliving.com/cq/app_ztshare.html?spclId="+objAndNew_Share[0];
         targetUrl= "http://cms.cqliving.com:81/newsInfo_getShareNews?newsId="+obj_Share[0]+"&objectType="+obj_Share[1]+"&topicId="+shareTopicId;;
    }else if(isDefine(isOutLink)){//外链新闻分享
         targetUrl= isOutLink;
    }else{//默认资讯分享链接地址
         //targetUrl= "http://cms.cqliving.com/cq/app_share.html?dmnId=cq&objectId="+objAndNew_Share[0]+"&newsId="+objAndNew_Share[1];
         targetUrl= "http://cms.cqliving.com:81/newsInfo_getShareNews?newsId="+obj_Share[0]+"&objectType="+obj_Share[1]+"&topicId="+shareTopicId;
    }
    if(titleVal.length>30){
         titleVal=titleVal.substring(0,30)+'...';
    }
    if(summaryVal.length>40){
        summaryVal=summaryVal.substring(0,40)+'...';
    }
    
   // alert(obj_Share);
    
    if(shareType == '0'){//分享第三方类别
         //alert(titleVal+"\n"+summaryVal+"\n"+objAndNew_Share[0]+"\n"+objAndNew_Share[1]+"\n"+targetUrl);
        uexWeiXin.registerApp('wxaabe628d6c8a8984');
    }else if(shareType == '1'){
         var jsonstr = {
            "title" : titleVal,
            "summary" : summaryVal,
            "targetUrl" : targetUrl,
            "imageUrl" : 'res://icon.png',
            "appName" : "新版看重庆"
            //"cflag" : "1"
        };
        uexQQ.shareWebImgTextToQQ("1104630131", JSON.stringify(jsonstr));
    }else if(shareType == '2'){
        uexSina.registerApp("2065376324", "175971bf1da9d4d72579048fd91b87ab", "https://api.weibo.com/oauth2/default.html");
    }
}

//各第三方插件相关回调函数

//*****************************WeiXin相关回调函数********************************
function cbRegisterApp_weixin(opId, dataTpye, data){//应用授权成功后回调
    if(data==0){//格式：0
        //资讯类分享衔接地址
        var jsonstr = {"thumbImg":"res://icon.png","wedpageUrl":targetUrl,"scene":sceneVal,"title":titleVal,"description":summaryVal};
        uexWeiXin.shareLinkContent(JSON.stringify(jsonstr));
    }else{
        uexWindow.toast('0', '5', '微信登陆失败', '2000');
        setTimeout(function(){
            uexWindow.closePopover("scene_content");
        },2000);
    }
}

//SendImageContent分享链接后回调
function cbShareLinkContent_weixin(data){
    if(data == 0){//格式：0
        uexWindow.toast('0', '5', '分享成功', '2000');
        setTimeout(function(){
            uexWindow.closePopover("scene_content");
        },2000);
    }else{
       uexWindow.toast('0', '5', '分享失败', '2000');
       setTimeout(function(){
            uexWindow.closePopover("scene_content");
        },2000);
   }
}

//*********************************QQ相关回调函数**************************
function cbLogin_qq(opId, dataType, data){
    var jsondata=JSON.parse(data);
    if(jsondata.ret==0){
         uexWindow.toast('0', '5', '登录成功', '2000');
    }else{
         uexWindow.toast('0', '5', 'QQ登陆失败', '2000');
         setTimeout(function(){
            uexWindow.closePopover("share_content");
        },2000);
    }
}
//cbShareQQ 分享完成的回调方法
function cbShareQQ_qq(opId,dataType,data){
   var jsondata=JSON.parse(data); //格式{"errCode":"0","errStr":""}
   if(jsondata.errCode==0){
       uexWindow.toast('0', '5', '分享成功', '2000');
       setTimeout(function(){
            uexWindow.closePopover("share_content");
        },2000);
   }else{
       uexWindow.toast('0', '5', '分享失败', '2000');
       setTimeout(function(){
            uexWindow.closePopover("share_content");
        },2000);
   }
}

//*********************************sina相关回调函数*******************************
//注册成功后回调
function cbRegisterApp_sina(opCode, dataType, data){
    if (data == 0) {
        uexSina.sendImageContent("res://icon.png",titleVal+targetUrl);
    }else{
        uexWindow.toast('0', '5', '登陆失败', '2000');
        setTimeout(function(){
            uexWindow.closePopover("share_content");
        },2000);
    }
}
function cbShare_sina(opId, dataType, data){
    if (data == 0){//格式：0
        uexWindow.toast('0', '5', '分享成功', '2000');
        setTimeout(function(){
            uexWindow.closePopover("share_content");
        },2000);
        
    }else{
        uexWindow.toast('0', '5', '分享失败', '2000');
        setTimeout(function(){
            uexWindow.closePopover("share_content");
        },2000);
    }
}