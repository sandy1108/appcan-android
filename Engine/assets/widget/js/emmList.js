var appList,appIdLoc="",rootWidgetId,rootappKey,opening=0;
function getlogin(){
    //alert("准备调用uexEMM==>");
    //登陆EMM
    uexEMM.cbLogin = function(opId,dataType,data){
        data = JSON.parse(data);
        if(data.status == "ok"){
            appcan.locStorage.setVal("emmLoginState",1);
            uexAppStoreMgr.open(emmUrl+'storeIn/');
            uexAppStoreMgr.getSoftToken();
            //uexWindow.toast('0','5',"加载成功",'2000');
        }else{
           appcan.locStorage.setVal("emmLoginState",0);
           emmlogin();//登陆失败再次登录
           //uexWindow.alert('友情提示',data.info,'确定');
        }
    }
    //alert("准备调用uexAppStoreMgr==>");
    //获取SoftToken
    uexAppStoreMgr.cbGetSoftToken = function(opId,dataType,data){
        startWgt(data);
    }
     //下载进度
   uexAppStoreMgr.cbGetProgress = function(opId,dataType,data){
      appcan.window.openToast("加载中...");
      //uexToast.open("loading...","#5ebbe8","#ffffff","","3","res://loading.png");
      if(data == 100){
         appcan.window.closeToast();
      }
   }
    //加载widget的回调
    uexAppStoreMgr.cbLoadWidget = function(opId,dataType,data){
         var widgetId = rootWidgetId;
         var appKey = rootappKey;
         var obj = JSON.parse(data);
         var status = obj.status;
         if(status==0){
            uexWindow.toast(0, 5, "加载失败，请稍后重试", "2000");
         }else if(status==1){
             if (opening == 1){return;}
             //appcan.window.openToast('正在打开');
             opening = 1;
             var appInfo={};
             var userInfo="";
             userInfo=appcan.locStorage.val("userInfo");
             appInfo={
                 "appId":"sdk10394",
                 "userInfo":isDefine(userInfo)?JSON.parse(userInfo):""
             };
             uexWidget.cbStartWidget = function(opId, dataType, data) {
                opening = 0;
                appcan.window.closeToast();
             }
             uexWidget.startWidget(obj.data.appId,'10','',JSON.stringify(appInfo),'200',obj.data.appKey);
         }else if(status==2){
             uexWindow.toast(0, 5, "更新成功", "2000");
             loadWight(obj.data);
             //uexAppStoreMgr.getSoftToken();//重新下载文件
         }
         uexWindow.closeToast();
      }
      
      var isDownLoadAppList=appcan.locStorage.val("isDownLoadAppList");
      if(!isDefine(isDownLoadAppList) || isDownLoadAppList==0){
          uexAppStoreMgr.open(emmUrl+'storeIn/');
          //uexWindow.toast(0, 5, "正在获取子应用列表...", "");
          uexAppStoreMgr.getSoftToken();
      }
}


//emm登录验证
function emmlogin(){
    //alert("emmlogin");
    var jsonStr = {"domainName":"重庆","authType":"邮箱","loginName":'cq',"loginPass":'123456'};
    uexEMM.login(JSON.stringify(jsonStr));
}

function getapp (appId) {
    appcan.window.openToast('正在打开...');
    appIdLoc = appId;
    var emmLoginState=appcan.locStorage.val("emmLoginState");
    if(emmLoginState!=1){//未登录过emm才进行登陆
         emmlogin();
         return false;
    }
    appList = appcan.locStorage.val("EMMList");;
    if(!isDefine(appList)){// 本地列表不存在则重新下载应用列表
       uexAppStoreMgr.open(emmUrl+'storeIn/');
       uexAppStoreMgr.getSoftToken();
       return false;
    }else{
       appList = JSON.parse(appList);
    }
   
   //下载打开子应用
   var isInList=0;
   for(var i = 0; i < appList.length;i++){
        if(appList[i].appId == appId){ //存在现有的列表中
           isInList=1;
           loadWight(appList[i]);
           break;
        }else if((i==appList.length) && isInList==0){ //不存在现有的列表中，为新添加应用，需要重新获取列表
            uexAppStoreMgr.open(emmUrl+'storeIn/');
            uexAppStoreMgr.getSoftToken();
        }
   }
}

//加载载widget
function loadWight(appInfo){
   rootWidgetId = appInfo.appId;
   rootappKey = appInfo.appKey;
   var json_str = JSON.stringify(appInfo);
   appcan.window.closeToast();
   uexAppStoreMgr.loadWidget(json_str);
}

//查找所有wight
function startWgt(softToken){
    var storeIps = emmUrl+'storeIn/store/defaultAppList?pageSize=100&softToken='+softToken;
    appcan.request.ajax({
        url:storeIps,
        type:'GET',
        data:{},
        dataType : "json",
        success : function(data) {
            uexWindow.closeToast();
            //记录最新一次的下载状态
            if(data.status == 'ok'){
                appList = data.appList;
                appcan.locStorage.setVal("isDownLoadAppList",1);
                setLocVal('EMMList',JSON.stringify(appList));
                //alert("EMMList===>"+JSON.stringify(appList));
                //uexWindow.toast(0, 5, "获取成功", "2000");
                isDefine(appIdLoc)?getapp(appIdLoc):"";
            }
        },
        error : function(xhr, errorType, error,msg) {
            uexWindow.closeToast();
        }
    })
}
