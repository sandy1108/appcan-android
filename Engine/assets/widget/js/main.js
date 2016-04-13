//var objBQ = {'重庆':'E14d850a0cae2915','热点':'E14d850a252b9613','椒言重庆':'E14d850a6b536763','山城名家':'E14d9426c91e4563','娱体':''}
var objBQ = ['E14d9ed3ea751069','E14dbdc4e58f5688','E14d9db224fe7508','E14d9e69c8f88023','','E14d9f0911a81919'];
var columnTypeText = 1;
var pageNum = 1;
var newsDateTime = 0;
var newsDateTime1 = 0;
var newsDateTime2 = 0;
var newsDateTime3 = 0;

//var icache = appcan.icache({maxtask:3});
function slist(pageNo,columnType){
    if(isDefine(columnType)){
        columnTypeText = columnType;
    }
    var getTime = new Date().getTime();
    var addTime = 3600000;
    switch(columnTypeText){
        case '2':
            var list = getLocVal('homeNewsListCq');
            if(isDefine(list) && getTime < (newsDateTime+addTime)){
                list = JSON.parse(list);
                listCq(list,picArrList);
                upLoadList();
                uexWindow.closeToast();
            }else{
                newsDateTime = getTime;
                slists(pageNo,columnType);
            }
            break;
        case '1':
            var list = getLocVal('homeNewsListRd');
            if(isDefine(list) && getTime < (newsDateTime1+addTime)){
                list = JSON.parse(list);
                listRd(list);
                upLoadList();
                uexWindow.closeToast();
            }else{
                newsDateTime1 = getTime;
                slists(pageNo,columnType);
            }
            break;
        case '6':
            var list = getLocVal('homeNewsListYt');
            if(isDefine(list) && getTime < (newsDateTime1+addTime)){
                list = JSON.parse(list);
                listRd(list);
                upLoadList();
                uexWindow.closeToast();
            }else{
                newsDateTime1 = getTime;
                slists(pageNo,columnType);
            }
            break;
        case '3':
            var list = getLocVal('homeNewsListJy');
            if(isDefine(list) && getTime < (newsDateTime2+addTime)){
                list = JSON.parse(list);
                listJy(list);
                upLoadList();
                uexWindow.closeToast();
            }else{
                newsDateTime2 = getTime;
                slists(pageNo,columnType);
            }
            break;
        case '4':
            var lists = getLocVal('homeNewsListMj');
            if(isDefine(lists) && getTime < (newsDateTime3+addTime)){
                lists = JSON.parse(lists);
                listMj(lists);
                upLoadList();
                var list = JSON.parse(getLocVal('homeNewsListMj1'));
                var tmpl = '';
                for(var i = 0;i < 5;i++){
                    if(isDefine(list[i])){
                        list[i].nickname = list[i].nickname.length > 3 ? list[i].nickname.substring(0,3) + '..' : list[i].nickname;
                        list[i].userIcon = isDefine(list[i].userIcon) ? pictureUrl+list[i].userIcon : 'css/img/mrtx.png';
                        var mar = (i == 0) ? '' : 'mar-l05';
                        tmpl += '<div class="ub ub-ver ub-f1 '+mar+'" style="max-width: 3.8em;height: 4.8em;" onclick="appcan.window.open(\'home_User\',\'home_User.html\',\'10\');setLocVal(\'supUserId\',\''+list[i].objectId+'_'+list[i].userId+'\')">'
                                  +'<div class="ub ub-f1 ub-img7" style="background-image:url(\''+list[i].userIcon+'\')"></div>'
                                  +'<div class="ub ub-ac ub-pc c-wh oc_header fz-8">'+list[i].nickname+'</div>'
                               +'</div>';
                    }else{
                        tmpl += '<div class="ub ub-ver ub-f1 h-5em mar-l05 ma-w4">'
                                    +'　'
                               +'</div>';
                    }
                }
                setTimeout(function(){
                   $("#userSSS").html(tmpl); 
                },200)
                uexWindow.closeToast();
            }else{
                newsDateTime3 = getTime;
                slists(pageNo,columnType);
            }
            break;
    }
}
function upLoadList(){
    appcan.frame.setBounce([0, 1], null, null, function(type) {
        if (type == 1) {
            pageNum++;
            var list = appcan.locStorage.val("newsnum");        //总条数
            if ((pageNum - 1) * 10 > list) {
                appcan.frame.resetBounce(type);
            } else {
                slists(pageNum,'');
            }
        }
        if (type == 0) {
            slists(1,'');
            appcan.frame.resetBounce(type);
        }
    },bounceBgColor,imgSettingsVal)
}
function slists(pageNo,columnType) {
    if(isDefine(columnType)){
        columnTypeText = columnType;
    }
    if(pageNo == 1){
        pageNum = 1;
    }
    var clsId = objBQ[parseInt(columnTypeText)-1];
    uexWindow.toast(1, 5, "", "");
    var list = {
        "ifno" : "CMS-NEWS-0001",
        "condition" : {
            "dmnId" : "cq",
            "grpId" : "",
            "roleId" : "",
            "chnlId" : "",
            "rowCnt" : "10",
            "pageNo" : pageNum,
            "newsClsId" : clsId,
            "attnId" : "",
            "findCtt" : ""
        },
        "content" : {}
    };
    appcan.request.ajax({
        url : chongqingUrl,
        headers : {
            token : appcan.locStorage.val("token") || '',
            deviceId : appcan.locStorage.val("deviceId") || ''
        },
        appVerify:true,
        data : list,
        type : "POST",
        timeout : "15000",
        contentType : "application/json",
        dataType : "json",
        success : function(data) {
            uexWindow.closeToast();
            if(data.dispose.status != '000'){
                uexWindow.toast(1, 5, data.dispose.msg, 2000);
                return false;
            }
            var page = data.total.list;
            appcan.locStorage.setVal("newsnum",pageNum);
            if(data.info.list.length == 0){
                $('#ocontent').html('<div class="ub ub-f1 ub-ac ub-pc c-66" style="margin-top:1em;">暂无信息</div>');
                return false;
            }else{
                upLoadList(page);
            }
            switch(columnTypeText){
                case '2':
                    cqAdvert(data.info.list);
                    setLocVal('homeNewsListCq',JSON.stringify(data.info.list));
                    break;
                case '1':
                    listRd(data.info.list);
                    setLocVal('homeNewsListRd',JSON.stringify(data.info.list));
                    break;
                case '6':
                    listRd(data.info.list);
                    setLocVal('homeNewsListYt',JSON.stringify(data.info.list));
                    break;
                case '3':
                    listJy(data.info.list);
                    setLocVal('homeNewsListJy',JSON.stringify(data.info.list));
                    break;
                case '4':
                    listMj(data.info.list);
                    setLocVal('homeNewsListMj',JSON.stringify(data.info.list));
                    break;
            }
        },
        error : function(xhr, errorType, error,msg) {
            alert("err==>"+msg)
        }
    });
}
var newsId=new Array();
var adTitle=new Array();
var picArrList=new Array();
function cqAdvert(list){
     var list3 = {
        "ifno" : "CMS-NEWS-0001",
        "condition" : {
            "dmnId" : "cq",
            "grpId" : "",
            "roleId" : "",
            "chnlId" : "",
            "rowCnt" : "10",
            "pageNo" : 1,
            "newsClsId" : "",
            "attnId" : "",
            "findCtt" : "",
            "advertFlg":'01',
        },
        "content" : {}
    };
    appcan.request.ajax({
        url:chongqingUrl,
        headers : {
            "Access-Control-Allow-Headers":"X-Requested-With"
        },
        appVerify:true,
        data : JSON.stringify(list3),
        type : "POST",
        timeout : "15000",
        contentType : "application/json",
        dataType:"json",
        success : function(data) {
           var listcontent=data.info.list;
           var conNum = 3;
           if(listcontent.length < 3){
               conNum = listcontent.length;
           }
           if(conNum==0){
               var instance={
                   "img":"image/adpic.png",
                   "label":"广告火热招商中"
               };
               picArrList.push(instance);
           }
           for(var i=0;i<conNum;i++){
               var title=listcontent[i].newsTtl.length > 20 ? listcontent[i].newsTtl.substring(0,17) + '..' : listcontent[i].newsTtl;
               var picId=listcontent[i].attachment[0].attcId;
               var id=listcontent[i].newsId;
               var picUrl=pictureUrl+picId;
               newsId[i]=id;
               adTitle[i]=title;
               var instance={"img":picUrl,"label":adTitle[i]};
               picArrList.push(instance);
           }
           if(adTitle.length == 0){
               adTitle[0] = '广告火热招商中';
           }
           listCq(list,picArrList);
        },
        error : function(err) {

        }
    });
}
function listCq(list,list1){
    var adResText = '<div class="ub-img res-cfull" name="adCqDian"></div>';
    var titText = isDefine(adTitle[0]) ? adTitle[0] : '广告火热招商中';
    for(var i = 0;i < adTitle.length;i++){
        adResText = '<div class="ub-img '+(i==0?'res-cfull':'res-cempty')+' mar-l" name="adCqDian"></div>';
    }
    var tmpl = '';
    var cTmpl = '';
    for(var i = 0;i < list.length;i++){
        var objAndNew = list[i].objectId + '_' + list[i].newsId;
        var title = list[i].newsTtl.length > 25 ? list[i].newsTtl.substring(0,25)+"..." : list[i].newsTtl;
        var newsSmmr = list[i].newsSmmr.length > 50 ? list[i].newsSmmr.substring(0,50)+"..." : list[i].newsSmmr;
        // var title = list[i].newsTtl;
        // var newsSmmr = list[i].newsSmmr;
        var wordCnt = list[i].wordCnt;
        var prseCnt = list[i].prseCnt;
        var dateTime = NYR(list[i].rlsTime,'1');
        var redianText = '';
        var styleText = 'margin-right: 1em;';
        if(isDefine(list[i].newsFlg)){
            switch(list[i].newsFlg){
                case '01':
                    styleText = 'width:4em;margin-right:1em';
                    redianText = '<div class="ub-img bg-ff fz-8 c-wh uinn-tb12">热</div>';
                    break;
                case '02':
                    styleText = 'width:4em;margin-right:1em';
                    redianText = '<div class="ub-img bg-ff fz-8 c-wh uinn-tb12">政务</div>';
                    break;
                case '03':
                    styleText = 'width:4em;margin-right:1em';
                    redianText = '<div class="ub-img bg-ff fz-8 c-wh uinn-tb12">推荐</div>';
                    break;
            }
        }
        if(list[i].attachment.length == 0){
            cTmpl += '<div class="ub ub-ver ubb b-dd umar-a uinn-b05 btnDetile" id="'+objAndNew+'">'
                       +'<div class="">'+title+'</div>'
                       +'<div class="ulev-1 c-88" style="margin-top:0.5em;">'+newsSmmr
                       +'</div>'
                       +'<div class="ub ub-ac c-b3 fz-68" style="margin-top:0.5em;">'+redianText
                           +'<div class="ub ub-pc" style="'+styleText+'">评论 '+wordCnt+'</div>'
                           +'<div class="" style="width:3em;">赞 <span id="'+list[i].newsId+'">'+prseCnt+'</span></div>'
                           +'<div class=" ub-f1 ub ub-pe" style="margin-right:0.5em;">'+dateTime+'</div>'
                       +'</div>'
                   +'</div>';
        }else if(list[i].attachment.length == 1){
            if(!isDefine(list[i].attachment[0].attcId)){
                cTmpl += '<div class="ub ub-ver umar-a ubb b-dd uinn-b05 btnDetile" id="'+objAndNew+'" style="margin-bottom:0;">'
                           +'<div class="">'+title+'</div>'
                           +'<div class="ulev-1 c-88" style="margin-top:0.5em;">'+newsSmmr
                           +'</div>'
                           +'<div class="ub ub-ac c-b3 fz-68" style="margin-top:0.5em;">'+redianText
                               +'<div class="ub ub-pc" style="'+styleText+'">评论 '+wordCnt+'</div>'
                               +'<div class="" style="width:3em;">赞 <span id="'+list[i].newsId+'">'+prseCnt+'</span></div>'
                               +'<div class="ub-f1 ub ub-pe" style="margin-right:0.5em;">'+dateTime+'</div>'
                           +'</div>'
                       +'</div>';
            }else{
            cTmpl += '<div class="ub ub-ac umar-a ubb b-dd uinn-b05 btnDetile" id="'+objAndNew+'">' 
                       +'<div class="ub ub-ver ub-f1" style="min-height: 4em;">'
                       +'<div class="ub-f1" style="">'+title+'</div>'
                       +'<div class="ub ub-ae c-b3 fz-68" style="height:2em;">'+redianText
                           +'<div class="ub ub-pc" style="'+styleText+'">评论 '+wordCnt+'</div>'
                           +'<div class="" style="width:3em;">赞 <span id="'+list[i].newsId+'">'+prseCnt+'</span></div>'
                           +'<div class="ub-f1 ub ub-pe" style="margin-right:0.5em;">'+dateTime+'</div>'
                       +'</div>'
                   +'</div>'
                   +'<div class="oc_hw3 ub-img1" style="background-image: url(\''+pictureUrl+list[i].attachment[0].attcId+'\');"></div>'
               +'</div>';
               }
        }else{
            var imgDiv = '';
            for(var t = 0;t < list[i].attachment.length;t++){
                var sClass = 'm-r05'
                if(t == 3){
                    sClass = '';
                }
                if(t < 3){
                    imgDiv += '<div class="h4d3 ub-img1 ub-f1 '+sClass+'" style="background-image:url(\''+pictureUrl+list[i].attachment[t].attcId+'\')"></div>';
                }
            }
            cTmpl += '<div class="ub ub-ver ubb b-dd uinn-b05 umar-a btnDetile" id="'+objAndNew+'">'
                       +'<div class="">'+title+'</div>'
                       +'<div class="ub ub-pj ub-ac" style="margin:0.5em 0;">'+imgDiv
                       +'</div>'
                       +'<div class="ub ub-ac c-b3 fz-68">'+redianText
                           +'<div class="ub ub-pc" style="'+styleText+'">评论 '+wordCnt+'</div>'
                           +'<div class="" style="width:3em;">赞 <span id="'+list[i].newsId+'">'+prseCnt+'</span></div>'
                           +'<div class="ub-f1 ub ub-pe" style="margin-right:0.5em;">'+dateTime+'</div>'
                       +'</div>'
                   +'</div>';
        }
    }
    tmpl = '<div class="ub ub-ver ubb b-dd uinn">'
                +'<div id="slider" class="slider"></div>'
           +'</div>'
           +'<div id="olist" class="ub ub-ver">'+cTmpl
           +'</div>';
    if(pageNum == 1){
        $('#ocontent').html(tmpl);
    }else{
        $('#ocontent').append(tmpl);
    }
    $("#ocontent").removeClass('bg-e8');
    sliderLoad(list1);  //初始化滑动块
    buttonLoad();       //初始化详情页
}

function listRd(list){
    var tmpl = '';
    var cTmpl = '';
    var container = $('<div id="olist" class="ub ub-ver"></div>');
    for(var i = 0;i < list.length;i++){
        var objAndNew = list[i].objectId + '_' + list[i].newsId;
        var title = list[i].newsTtl.length > 18 ? list[i].newsTtl.substring(0,18)+"..." : list[i].newsTtl;
        var newsSmmr = list[i].newsSmmr.length > 40 ? list[i].newsSmmr.substring(0,40)+"..." : list[i].newsSmmr;
        var wordCnt = list[i].wordCnt;
        var prseCnt = list[i].prseCnt;
        var dateTime = NYR(list[i].rlsTime,'1');
        var redianText = '';
        var styleText = 'margin-right: 1em;';
        if(isDefine(list[i].newsFlg)){
            switch(list[i].newsFlg){
                case '01':
                    styleText = 'width:4em;margin-right:1em';
                    redianText = '<div class="ub-img bg-ff fz-8 c-wh uinn-tb12">热</div>';
                    break;
                case '02':
                    styleText = 'width:4em;margin-right:1em';
                    redianText = '<div class="ub-img bg-ff fz-8 c-wh uinn-tb12">政务</div>';
                    break;
                case '03':
                    styleText = 'width:4em;margin-right:1em';
                    redianText = '<div class="ub-img bg-ff fz-8 c-wh uinn-tb12">推荐</div>';
                    break;
            }
        }
        var item = null;
        if(list[i].attachment.length == 0){
            item = $('<div class="ub ub-ver ubb b-dd umar-a uinn-b05 btnDetile" id="'+objAndNew+'">'
                       +'<div class="">'+title+'</div>'
                       +'<div class="ulev-1 c-88" style="margin-top:0.5em;">'+newsSmmr
                       +'</div>'
                       +'<div class="ub ub-ac c-b3 fz-68" style="margin-top:0.5em;">'+redianText
                           +'<div class="ub ub-pc" style="'+styleText+'">评论 '+wordCnt+'</div>'
                           +'<div class="" style="width:3em;">赞 <span id="'+list[i].newsId+'">'+prseCnt+'</span></div>'
                           +'<div class="ub-f1 ub ub-pe" style="margin-right:0.5em;">'+dateTime+'</div>'
                       +'</div>'
                   +'</div>');
        }else if(list[i].attachment.length == 1){
            if(!isDefine(list[i].attachment[0].attcId)){
                item = $('<div class="ub ub-ver umar-a ubb b-dd uinn-b05 btnDetile" id="'+objAndNew+'" style="margin-bottom:0;">'
                           +'<div class="">'+title+'</div>'
                           +'<div class="ulev-1 c-88" style="margin-top:0.5em;">' +newsSmmr+'</div>'
                           +'<div class="ub ub-ac c-b3 fz-68" style="margin-top:0.5em;">'+redianText
                               +'<div class="ub ub-pc" style="'+styleText+'">评论 '+wordCnt+'</div>'
                               +'<div class="" style="width:3em;">赞 <span id="'+list[i].newsId+'">'+prseCnt+'</span></div>'
                               +'<div class="ub-f1 ub ub-pe" style="margin-right:0.5em;">'+dateTime+'</div>'
                           +'</div>'
                       +'</div>');
            }else{
                item = $('<div class="ub ub-ac umar-a ubb b-dd uinn-b05 btnDetile" id="'+objAndNew+'">' 
                           +'<div class="ub ub-ver ub-f1">'
                               +'<div class="ub-f1" style="">'+title+'</div>'
                               +'<div class="ub ub-ae c-b3 fz-68" style="height:2em;">'+redianText
                                   +'<div class="ub ub-pc" style="'+styleText+'">评论 '+wordCnt+'</div>'
                                   +'<div class="" style="width:3em;">赞 <span id="'+list[i].newsId+'">'+prseCnt+'</span></div>'
                                   +'<div class="ub-f1 ub ub-pe" style="margin-right:0.5em;">'+dateTime+'</div>'
                               +'</div>'
                           +'</div></div>');
                var pic = $('<div class="oc_hw3 ub-img1" style="background-image: url(\'image/noPic.png\');"></div>');
                item.append(pic);
                var url = pictureUrl + list[i].attachment[0].attcId;
                icache.run({dom:pic,url:url});
           }
        }else{
            var imgDiv = $('<div class="ub ub-pj ub-ac" style="margin:0.5em 0;"></div>');
            for(var t = 0;t < list[i].attachment.length;t++){
                var sClass = 'm-r05'
                if(t == 3){
                    sClass = '';
                }
                if(t < 3){
                    var img = $('<div class="h4d3 ub-img1 ub-f1 '+sClass+'" style="background-image:url(\'image/noPic.png\')"></div>');
                    imgDiv.append(img);
                    var url = pictureUrl+list[i].attachment[t].attcId;
                    icache.run({dom:img,url:url});
                }
            }
            item = '<div class="ub ub-ver ubb b-dd uinn-b05 umar-a btnDetile" id="'+objAndNew+'"></div>';
            var title = $('<div class="">'+title+'</div>');
                       +'<div class="ub ub-pj ub-ac" style="margin:0.5em 0;">'
                           +imgDiv
                       +'</div>'
            var content = $('<div class="ub ub-ac c-b3 fz-68">'
                           +redianText
                           +'<div class="ub ub-pc" style="'+styleText+'">评论 '+wordCnt+'</div>'
                           +'<div class="" style="width:3em;">赞 <span id="'+list[i].newsId+'">'+prseCnt+'</span></div>'
                           +'<div class="ub-f1 ub ub-pe" style="margin-right:0.5em;">'+dateTime+'</div>'
                       +'</div>');
            item.append(title);
            item.append(imgDiv);
            item.append(content);
        }
        container.append(item);
    }
    if(pageNum == 1){
        $("#ocontent").empty();
        $('#ocontent').append(container);
    }else{
        $('#ocontent').append(container);
    }
    $("#ocontent").removeClass('bg-e8');
    buttonLoad();       //初始化详情页
}
function listJy(list){
    var tmpl = '';
    var lTmpl = '';
    var rTmpl = '';
    var jsq = 1;
    var jsq1 = 1;
    var jsq2 = 1;
    for(var i = 0;i < list.length;i++){
        var objAndNew = list[i].objectId + '_' + list[i].newsId;
        var title = list[i].newsTtl;        //标题
        var cont = list[i].newsSmmr;        //简要
        var wordCnt = list[i].wordCnt;      //评论
        var prseCnt = list[i].prseCnt;      //赞
        var dateTime = timePoor(list[i].rlsTime);   //时间
        var picUrl = pictureUrl + list[i].attachment[0].attcId;     //图片路径
        if(!isDefine(list[i].attachment[0].attcId)){
            picUrl = 'image/noPic.png';
        }
        if(title.length > 15){
            title = title.substring(0,15)+'...';
        }
        if(cont.length > 15){
            cont = cont.substring(0,15)+'...';
        }
        //jsq取余为0就是右边
        if(jsq%2 != 0){
            //jsq1取余为0图比较长,否则图比较短
            lTmpl += '<div class="ub ub-ver uinn-t05 btnDetile" id="'+objAndNew+'">'
                       +'<div class="ub-img1 '+(jsq1%2 == 0?'ojy2':'ojy1')+'" style="background-image:url(\''+picUrl+'\')"></div>'
                       +'<div class="ub ub-ae ubb b-ad uinn50" style="">'+title+'</div>'
                       +'<div class="ub ub-ae ulev-1 uinn50 c-88">'+cont+'</div>'
                       +'<div class="ub ub-ac fz-68">'
                           +'<div class="ub ub-ac">'
                               +'<div class="ub-img ojyp"></div>'
                               +'<div class="ofont">'+wordCnt+'</div>'
                           +'</div>'
                           +'<div class="ub ub-ac" style="margin-left:0.8em;">'
                               +'<div class="ub-img oztz"></div>'
                               +'<div class="ofont" id="'+list[i].newsId+'">'+prseCnt+'</div>'
                           +'</div>'
                           +'<div class="ub-f1 ub ub-pe c-88">'+dateTime+'</div>'
                       +'</div>'
                   +'</div>'
            jsq1++;
        }else{
            //jsq1取余为0图比较长,否则图比较短
            rTmpl += '<div class="ub ub-ver uinn-t05 btnDetile" id="'+objAndNew+'">'
                       +'<div class="ub-img1 '+(jsq1%2 != 0?'ojy1':'ojy2')+'" style="background-image:url(\''+picUrl+'\')"></div>'
                       +'<div class="ub ub-ae ubb b-ad uinn50" style="">'+title+' </div>'
                       +'<div class="ub ub-ae ulev-1 uinn50 c-88">'+cont+'</div>'
                       +'<div class="ub ub-ac fz-68">'
                           +'<div class="ub ub-ac">'
                               +'<div class="ub-img ojyp"></div>'
                               +'<div class="ofont">'+wordCnt+'</div>'
                           +'</div>'
                           +'<div class="ub ub-ac" style="margin-left:0.8em;">'
                               +'<div class="ub-img oztz"></div>'
                               +'<div class="ofont" id="'+list[i].newsId+'">'+prseCnt+'</div>'
                           +'</div>'
                           +'<div class="ub-f1 ub ub-pe c-88">'+dateTime+'</div>'
                       +'</div>'
                   +'</div>';
            jsq2++;
        }
        jsq++;
    }
    tmpl = '<div class="ub ">'
               +'<div class="ub ub-ver uinn05" style="width:46%;">'+lTmpl+'</div>'
               +'<div class="ub ub-ver ub-f1 uinn05">'+rTmpl+'</div>'
           +'</div>';
    if(pageNum == 1){
        $('#ocontent').html(tmpl);
    }else{
        $('#ocontent').append(tmpl);
    }
    $("#ocontent").removeClass('bg-e8');
    buttonLoad();       //初始化详情页
}
function listMj(list){
    var tmpl = '';
    var tTmpl = '';
    var cTmpl = '';
    var tmplNo1 = '';
    var tmplNoto = '';
    for(var i = 0;i < list.length;i++){
        var objAndNew = list[i].objectId + '_' + list[i].newsId;
        var UrlPic = isDefine(list[i].attachment) ? list[i].attachment[0].attcId : '';
        var picText = '';
        var minPicText = isDefine(list[i].supUserIcon) ? '<div class="ub-img1 omj" style="background-image:url(\''+pictureUrl+list[i].supUserIcon+'\')"></div>' : '';
        var urlPics = pictureUrl + UrlPic;
        if(isDefine(UrlPic)){
            picText = '<div class="oc_hw3 ub-img1" style="background-image: url(\''+ pictureUrl + UrlPic +'\')"></div>';
        }else{
            urlPics = 'image/noPic.png';
        }
        var titVal = list[i].newsTtl.length > 15 ? list[i].newsTtl.substring(0,13) + '..' : list[i].newsTtl;
        var titSmm = list[i].newsSmmr.length > 15 ? list[i].newsSmmr.substring(0,15) + '..' : list[i].newsSmmr;
        var wordCnt = list[i].wordCnt;      //评论
        var prseCnt = list[i].prseCnt;      //赞
        var dateTime = NYR(list[i].rlsTime,'1');   //时间
        if(i == 0){
            tmplNo1 = '<div class="oc_hw2 ub-img1 ub-f1 btnDetile" id="'+objAndNew+'" style="background-image: url(\''+urlPics+'\')"></div>'
                       +'<div class="ub ub-ac ub-f1 uinn-tb35 bg-wh" style="">'+minPicText
                           +'<div class="ub ub-ae ub-f1 mar-l1">'+titVal+'</div>'
                       +'</div>';
        }else{
            tmplNoto += '<div class="ub ub-ac umar-a05 bg-wh btnDetile" id="'+objAndNew+'">'+picText
                           +'<div class="ub ub-ver ub-f1" style="margin-left:.7em;">'
                               +'<div class="ub-f1">'+titVal+'</div>'
                               +'<div class="ub-f1 ulev-1 ut-s c-88" style="margin-bottom:.3em;margin-top:0.3em;">'+titSmm+'</div>'
                               +'<div class="ub ub-ac fz-68">'
                                   +'<div class="ub ub-ac">'
                                       +'<div class="ub-img ojyp"></div>'
                                       +'<div class="ofont" style="margin-left:0.2em;"> '+wordCnt+'</div>'
                                   +'</div>'
                                   +'<div class="ub ub-ac" style="margin-left:0.8em;">'
                                       +'<div class="ub-img oztz"></div>'
                                       +'<div class="ofont" id="'+list[i].newsId+'" style="margin-left:0.2em;"> '+prseCnt+'</div>'
                                   +'</div>'
                                   +'<div class="ub-f1 ub ub-pe c-88" style="margin-right:.5em">'+dateTime+'</div>'
                               +'</div>'
                           +'</div>'
                       +'</div>';
        }
    }
    tmpl = '<div id="" class="ub ub-ver">'+tmplNo1+'</div>'
           +'<div class="ub ub-ver">'
               +'<div class="ubb ubt b-bf ub ub-ac c-66 fz-8" style="min-height:2em;padding-left:0.5em;">最热大咖</div>'
               +'<div class="ub ub-ac uinn" id="userSSS">'
               +'</div>'
           +'</div>'
           +'<div class="ub ub-ver">'+tmplNoto+'</div>';
    if(pageNum == 1){
        $('#ocontent').html(tmpl);
    }else{
        $('#ocontent').append(tmpl);
    }
    $("#ocontent").addClass('bg-e8');
    userList();
    buttonLoad();       //初始化详情页
}
function userList(){
    var list = {
        "ifno": "CMS-USER-0002",
        "condition": {
            "dmnId": "cq",//域标识
            "roleId": "03"//角色标识
        },
        "content": {}
    }
    appcan.request.ajax({
        url : chongqingUrl,
        headers : {
            token : appcan.locStorage.val("token") || '',
            deviceId : appcan.locStorage.val("deviceId") || ''
        },
        appVerify:true,
        data : JSON.stringify(list),
        type : "POST",
        timeout : "15000",
        contentType : "application/json",
        dataType : "json",
        success : function(data) {
            var list = data.info.list;
            setLocVal('homeNewsListMj1',JSON.stringify(list));
            var tmpl = '';
            for(var i = 0;i < 5;i++){
                if(isDefine(list[i])){
                    list[i].nickname = list[i].nickname.length > 3 ? list[i].nickname.substring(0,3) + '..' : list[i].nickname;
                    list[i].userIcon = isDefine(list[i].userIcon) ? pictureUrl+list[i].userIcon : 'css/img/mrtx.png';
                    var mar = (i == 0) ? '' : 'mar-l05';
                    tmpl += '<div class="ub ub-ver ub-f1 '+mar+'" style="max-width: 3.8em;height: 4.8em;" onclick="appcan.window.open(\'home_User\',\'home_User.html\',\'10\');setLocVal(\'supUserId\',\''+list[i].objectId+'_'+list[i].userId+'\')">'
                              +'<div class="ub ub-f1 ub-img1" style="background-image:url(\''+list[i].userIcon+'\')"></div>'
                              +'<div class="ub ub-ac ub-pc c-wh oc_header fz-8">'+list[i].nickname+'</div>'
                           +'</div>';
                }else{
                    tmpl += '<div class="ub ub-ver ub-f1 h-5em mar-l05 ma-w4">'
                                +'　'
                           +'</div>';
                }
            }
            $("#userSSS").html(tmpl);
        }
    })
}

//区县app下载地址
var appobj = {
    "bishan":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/bishan/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10384",
        "appname":"bishan",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/bishan/index.html",
        "ituName":"bishan://"
    },
    "changshou":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/changshou/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10501",
        "appname":"changshou",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/changshou/index.html",
        "ituName":"changshou://"
    },
    "fengjie":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/fengjie/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10423",
        "appname":"fengjie",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/fengjie/index.html",
        "ituName":"fengjie://"
    },
    "jiangbei":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/jiangbei/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10504",
        "appname":"jiangbei",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/jiangbei/index.html",
        "ituName":"jiangbei://"
    },
    "jiangjin":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/jiangjin/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10459",
        "appname":"jiangjin",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/jiangjin/index.html",
        "ituName":"jiangjin://"
    },
    "qijiang":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/qijiang/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10594",
        "appname":"qijiang",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/qijiang/index.html",
        "ituName":"qijiang://"
    },
    "shizhu":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/shizhu/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10393",
        "appname":"shizhu",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/shizhu/index.html",
        "ituName":"shizhu://"
    },
    "tongliang":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/tongliang/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10566",
        "appname":"tongliang",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/tongliang/index.html",
        "ituName":"tongliang://"
    },
    "wansheng":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/wansheng/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10300",
        "appname":"wansheng",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/wansheng/index.html",
        "ituName":"wansheng://"
    },
    "xiushan":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/xiushan/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10383",
        "appname":"xiushan",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/xiushan/index.html",
        "ituName":"xiushan://"
    },
    "yunyang":{
        "appurl":"http://cqliving.cqnews.net/uploads/download/yunyang/index.html",
        "packagename":"org.zywx.wbpalmstar.widgetone.uexsdk10395",
        "appname":"yunyang",
        "ituUrl":"http://cqliving.cqnews.net/uploads/download/yunyang/index.html",
        "ituName":"yunyang://"
    }
};
