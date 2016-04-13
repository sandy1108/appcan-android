var widgetId = null,
    appKey = null,
    uploadWgt = {},
    opening = 0,
    hasInit = null,
    initErro = null,
    refreshFlag = null,
    widgetParam = null,
    isIOS = false,
    srcType = "install";
appcan.ready(function() {
    isIOS = uexWidgetOne.platformName=='iOS'?true:false;
    if (!isSML) {//手机上
        loadAppStore();
    }
    appcan.window.subscribe("EPORTAL_LOAD_APP",function(m){
        if(m){
            var appInfo = JSON.parse(m);
            startAppFromStore(appInfo.appId,appInfo.param);
        }
    
    });
    appcan.window.subscribe("GET_APPLIST",function(){
        var dataJson={"type":"installAppFromAllList", "key":""};
        srcType = "install";
        uexAppStoreMgr.getAppList(JSON.stringify(dataJson));
    })
    appcan.window.subscribe("YGET_APPLIST",function(){
        var dataJson={"type":"searchAppList","key":""};
        srcType = "search";
        uexAppStoreMgr.getAppList(JSON.stringify(dataJson));
    })
    appcan.window.subscribe("START_WGT",function(data){
        var data = JSON.parse(decodeURIComponent(data));
        var appCategory = data.appCategoryName?data.appCategoryName:data.appCategory;
        switch(appCategory){
            case  "AppCanNative":
                startWgt(data);
                break;
            case  "AppCanWgt":
                widgetParam = '';
                startWgt(data);
                break;
            case  "Web":
                var json = {name:data.name,url:data.pkgUrl,"extraInfo":{"opaque":"true","bgColor":"#ecf3f7","delayTime":"250"}}
                appcan.setLocVal("CARD_PARAM",json);
                appcan.window.open("webWind","webWind.html",10)
                break;
            case  "Native":
                startWgt(data);
                break;
                
        }
    })
   
});




function getTiles(cb){
    uexAppStoreMgr.cbGetTiles = function(a, b, c) {
        cb(c);
    }
    uexAppStoreMgr.getTiles();
}


/**下载子应用**/
function loadAppStore() {
    var toastopen=0;
    var storeIp = server_emm + "storeIn/";
    try{
        uexAppStoreMgr.cbLoadWidget = function(a, b, c) {
            var obj = JSON.parse(c);
            var status = obj.status;
            if (status == 0) {
                uexToast.close();
                //appcan.window.openToast("下载失败",1500,5);
            } else if (status == 1) {
                uexToast.close();
                if (opening == 1)
                    return;
                appcan.window.openToast('正在打开');
                opening = 1;
                if(typeof(widgetParam)!="string"){
                    widgetParam = JSON.stringify(widgetParam);
                }
                uexWidget.cbStartWidget = function(opId, dataType, data) {
                    opening = 0;
                    appcan.window.closeToast();
                }
               // alert(widgetId+'/n'+widgetParam+'/n'+appKey)
               
                uexWidget.startWidget(obj.data.appId, '10', '', widgetParam, '250', obj.data.appKey);
            } else if (status ==  2) {
                uexToast.close();
                
                startWgt(obj.data);
                appcan.window.publish("YGET_APPLIST",'');
            }
        }
        //退出按钮点击状态回调
        uexToast.cbExitBtnOnClick = function(){
            uexToast.close();
        }
        uexAppStoreMgr.onStartDownload = function(){
            uexToast.open("loading...","#5ebbe8","#ffffff","","3","res://loading.png");
            uexAppStoreMgr.cbGetProgress = function(a, b, c) {           
                uexToast.updateLoading(c);
                
                if (c >= 100){
                    uexToast.close();
                    appcan.window.publish("YGET_APPLIST",'');
                }
                    
            }
        }
        
        uexAppStoreMgr.cbGetSoftToken = function(a, b, c) {
            appcan.logs(c+'----softtoken');
            appcan.setLocVal('softToken', c);
            cardInit();
        }
        
        uexAppStoreMgr.cbGetAppList = function(mid,type,data){
            if(srcType == "search"){
                appcan.window.publish("YGET_APPLIST_CB",data);
            }else{
                appcan.window.publish("GET_APPLIST_CB",data);
            }
        }
            
        
        uexAppStoreMgr.open(storeIp);
        
        uexAppStoreMgr.getSoftToken();
    }catch(E){
        alert(E)
    }
}

function startWgt(appInfo) {
    widgetId = appInfo.appId;
    appKey = appInfo.appKey;
    var json = JSON.stringify(appInfo);
    appcan.logs(json);
    uexAppStoreMgr.loadWidget(json);
}

function getapp (appId,param) {
    var data = appcan.locStorage.val("TILES_WORK_ALL");
    var data = JSON.parse(data);
    widgetParam = param;
    for (var i in data) {
        if (data[i].appId == appId) {
            startWgt(data[i]);
            break;
        }
    }
}

function getEntranceApp(data,param){
    widgetParam = param;
    startWgt(data);
}

function startAppFromStore (appId,param) {
    var data = appcan.getLocVal("STORE_APP_INFO");
    var data = JSON.parse(data);
    widgetParam = param;
    for (var i in data) {
        if (data[i].appId == appId) {
            startWgt(data[i]);
            break;
        }
    }
}





function getNativeApp(cardId,param){
    try{
        uexWidget.cbIsAppInstalled = function(){
            var result = JSON.parse(info);
            if(result.installed == 0){
                if(isIOS){
                    uexWidget.loadApp(param.mainInfo+'://'+param.optInfo);
                }else{
                    uexWidget.startApp(param.startMode, param.mainInfo, param.addInfo, param.optInfo)
                }
            }else{
                var data = appcan.locStorage.val("TILES_WORK_ALL");
                var data = JSON.parse(data);
                for (var i in data) {
                    if (data[i].tilesList.param.cardId == cardId) {
                      // data[i].pkgUrl
                      if (!isIOS) {
                            uexWidget.startApp("1", "android.intent.action.VIEW", JSON.stringify({"data":{"mimeType":"text/html","scheme":data[i].pkgUrl}}));
                        } else {
                            uexWidget.loadApp(data[i].pkgUrl);
                        }
                      break;
                    }
                }
            }
        }
        uexWidget.isAppInstalled({appData:param.mainInfo});
        
    }catch(e){
        alert(e)
    }
} 