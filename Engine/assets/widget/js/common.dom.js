/** 定义slider图层的相关变量及相关方法
 * @author jun.zheng 
 * @param <object> sliderDomShow 轮播展示内部方法01
 * @param <int> styleId   样式id
 * @param <int> index  数组索引开始位置
 * @param <object> datas  传入的json对象数组
 * @param <object> callback  回调函数
 */
var sliderItem={
    newsIds:[],//slider需要保存的id
    picArrLists:[],//slider需要set的数据
    itemInfo:{}, //列表详细json数据
    listcontent:{},
    domItem : {},
    resDatas:{},
    conNum:5,
    domShow:function(styleId,index,datas,callback,conditions){
        var listcontent=this.listcontent;
        listcontent=datas;
        switch(styleId){
            case 1:  //slider为轮播图
                this.a_domShow(index,listcontent);
                this.resDatas={
                   "picArrLists":this.picArrLists,
                   "itemInfo":this.itemInfo,
                   "newsIds":this.newsIds
                };
                break;
            case 2:
                this.b_domShow(index,listcontent,conditions);
                this.resDatas={
                   "dom":this.domItem,
                   "itemInfo":this.itemInfo
                };
                break;
            case 3:
                break;
        }
        callback(this.resDatas);
    },
    a_domShow:function(index,list){
        this.newsIds=[];//slider需要保存的id
        this.picArrLists=[];//slider需要set的数据
        this.itemInfo={}; //列表详细json数据
        var picUrl="";
        if(list.length < 5){
            this.conNum = list.length;
        }
        for(var i=0;i<this.conNum;i++){
            var id=list[i].newsId;
            picUrl=list[i].boardImgUrl;
            this.newsIds[i]=id;
            this.itemInfo[id]=list[i];//保存列表对应的json信息
            var title=list[i].newsTitle.length > 17 ? list[i].newsTitle.substring(0,15) + '..' : list[i].newsTitle;
            var x=$(window).width();
            if((isAndroid && x>1080) || (!isAndroid && x>=375)){
                title=list[i].newsTitle.length > 20 ? list[i].newsTitle.substring(0,18) + '..' : list[i].newsTitle;
            }
            var picUrl=getImgUrl("0",picUrl,1);
            var instance={"img":picUrl,"label":title};
            this.picArrLists.push(instance);
        }
    },
    b_domShow:function(index,list,conditions){
            this.domItem = $('<div class="ub ub-ver"></div>');
            itemInfo[list.newsId]=list;//保存列表对应的json信息 
            var objAndNew = list.newsId;
            var picUrls="";
            picUrls=isDefine(list.picturesUrls)?list.picturesUrls.split(','):"";
            var attcUrl = picUrls[0];
            var picUrl = getImgUrl("0",isDefine(attcUrl)?attcUrl:"",1); //大图片路径原图
            var titVal = list.newsTitle;//list.newsTitle.length > 20 ? list.newsTitle.substring(0,20) + '...' : list.newsTitle;
            //var titVal = list.newsTitle;
            //var titSmm = list[i].newsSmmr.length > 15 ? list[i].newsSmmr.substring(0,15) + '..' : list[i].newsSmmr;
            var titSmm = isDefine(list.summary) ? list.summary : "";
            sliderId=objAndNew;
            if(list.newsType == 3){//视频新闻显示视频logo
                var pic = $('<div class="ub ub-ac ub-pc ub-img1 ub-f1 pHeight btnDetile" id="'+list.newsId+'" style="background-image: url(\'image/noPic.png\');min-width: 100%;">'
                                +'<div class="ub ub-ac ub-pc ub-img vodeoLogo"></div>'
                            +'</div>');
            }else{//文字新闻
                var pic = $('<div class="ub-img1 ub-f1 pHeight btnDetile " id="'+list.newsId+'" style="background-image: url(\'image/noPic.png\');min-width: 100%;">'
                            +'</div>');
            }
            
            if(isDefine(picUrl)){
               icache.run({dom:pic,url:picUrl});
            }
            var item = $('<div class="ub ub-ac ub-f1 uinn-tb35" style="color:#fff;background-color:rgba(0,0,0,0.3);margin-top:-1.85em;"></div>');
            var title = $('<div class="ub ub-f1 wrap" style="height:1.2em;-webkit-box-orient: vertical;font-size:1em;">'+titVal+'</div>');
            item.append(title);
            this.domItem.append(pic);
            this.domItem.append(item);
            //摘要显示
            if(isDefine(conditions) && conditions.isSummary==1 && isDefine(list.summary)){
                var summaryDom=$('<div class="uinn ub-pj summary_div" id="summary"><span class="summary_span">摘要</span></div>');
                var summaryVal=$('<span class="ub-f4 line_height01" id="summaryVal">'+list.summary+'</span>');
                //summaryDom.find('span').eq(0).after(summaryVal);
                summaryDom.append(summaryVal);
                this.domItem.append(summaryDom);
            }
    }
}

/** 定义资讯列表item的相关变量及相关方法
 * @param <int> styleId   样式id
 * @param <int> index  数组索引开始位置
 * @param <object> datas  传入的json对象数组
 * @param <object> callback  回调函数
 */
var newsItem={
    itemInfo:{}, //列表详细json数据
    idVal:0,
    itemImgList:{},//json存放图片链接及id（图片预加载使用）
    list:{},
    resDatas:{},
    domItem : {},
    domItemLeft:{},
    domItemRight:{},
    domShow:function(styleId,index,datas,callback,conditions){ 
            var list=this.list;
            list=datas;
            switch(styleId){
                case 1:  //图片+标题(如重庆栏目列表)
                    this.a_domShow(index,list,conditions);
                    this.resDatas={
                        "dom":this.domItem,
                        "itemInfo":this.itemInfo
                    };
                    break;
                case 2:   //图片+标题+摘要(如名家栏目列表)
                    this.b_domShow(index,list,conditions);
                    this.resDatas={
                        "dom":this.domItem,
                        "itemInfo":this.itemInfo
                    };
                    break;
                case 3:   //图片+标题(左右布局)(如椒言栏目列表)
                    this.c_domShow(index,list,conditions);
                    this.resDatas={
                        "domLeft":this.domItemLeft,
                        "domRight":this.domItemRight,
                        "itemInfo":this.itemInfo
                    };
                    break;
                case 4:   //图片(如随手拍列表)
                    this.d_domShow(index,list,conditions);
                    this.resDatas={
                        "dom":this.domItem,
                        "itemInfo":this.itemInfo
                    };
                    break;
                case 5:   //图片(如正事儿列表)
                    this.e_domShow(index,list,conditions);
                    this.resDatas={
                        "domLeft":this.domItemLeft,
                        "itemInfo":this.itemInfo
                    };
                    break;
                case 6:   //图片(如乐活默认推荐列表)
                    this.f_domShow(index,list,conditions);
                    this.resDatas={
                        "dom":this.domItem,
                        "itemInfo":this.itemInfo
                    };
                    break;
            }
            callback(this.resDatas);
      },
      a_domShow:function(index,list,conditions){ 
        this.domItem = $('<ul class="ub ub-ver"></ul>');
        this.itemInfo={};//保存列表对应的json信息 
        var isSummary=isDefine(conditions.isSummary)||(typeof(conditions.isSummary)=='number')?conditions.isSummary:1;
        var isComment=isDefine(conditions.isComment)||(typeof(conditions.isComment)=='number')?conditions.isComment:1;
        var isPtime=isDefine(conditions.isPtime)||(typeof(conditions.isPtime)=='number')?conditions.isPtime:1;
        
        var picUrls=[];
        var title="";
        var newsSmmr="";
        var isSpecial=0;
        var tagDom="";
        var tempDom=$('<div></div>');
        var titleLen,tempLen;
         //字号适配
        var titleFont="myh3";
        var x=$(window).width();
        if((isAndroid && x>1080) || (!isAndroid && x>375)){
            titleFont="font-size02";
        }
        for(var i = index;i < list.length;i++){
            var imgId="";
            tempDom.html('');
            tagDom="";
            titleLen=0;
            tempLen=0;
            this.itemInfo[list[i].newsId]=list[i];//保存列表对应的json信息
            
            isSpecial=(list[i].newsTypeId==5)?1:0;
            var objAndNew = list[i].newsId;
            picUrls=isDefine(list[i].picturesUrls)?list[i].picturesUrls.split(','):"";
            
            if(isSpecial==1){
                //title+='<div class="label-zt fz-68">专题</div>';
                tagDom=$('<div class="ub tagStyle fz-68"></div>');
                var speTagDom=$('<div class="ub tagChild">专题</div>');
                tempLen=2;
                tagDom.append(speTagDom);
            }
            //标签显示
            if(isDefine(list[i].markId)){
                if(isDefine(list[i].markContent)){
                    if(!isDefine(tagDom)){
                        tagDom=$('<div class="ub tagStyle fz-68"></div>');
                    }
                    var tagChildDom=$('<div class="ub tagChild">'+list[i].markName+'</div>');
                    tagDom.append(tagChildDom);
                }
                if(list[i].markName){
                    tempLen+=(list[i].markName).length;
                }
            } 
            tempDom.append(tagDom);
            if(isDefine(list[i].newsTitle)){
                title = list[i].newsTitle;
                if(!isDefine(list[i].showType) || !isDefine(picUrls[0])){//无图模式
                    if((isAndroid && x>=1080) || (!isAndroid && x>=375)){
                        titleLen=40-tempLen;
                    }else{
                        titleLen=36-tempLen;
                    }
                    //titleLen=(!isAndroid && x>=375)?(30-tempLen):(26-tempLen);
                    title = title.length > titleLen ? title.substring(0,titleLen) : title;
                }else if(list[i].showType==1){ //有图模式(单图)
                    if((isAndroid && x>=1080) || (!isAndroid && x>=375)){
                        titleLen=30-tempLen;
                    }else{
                        titleLen=(tempLen==0)?(24-tempLen):(23-tempLen);
                    }
                    //titleLen=(!isAndroid && x>=375)?(24-tempLen):(20-tempLen);
                    title = title.length > titleLen ? title.substring(0,titleLen) : title;
                }
            }
            
            if(isDefine(list[i].summary)){
                newsSmmr = list[i].summary.length > 26 ? list[i].summary.substring(0,26)+"..." : list[i].summary;
            }
            //var browseQuantity=list[i].brwsCnt;//浏览量
            var wordCnt = list[i].commentNum;
            //var prseCnt = list[i].prseCnt;
            var dateTime =NYR(list[i].publishTime,'1');
            var item=$('<li class="ink_item"></li>');
            var itemHtml = "";
            title+=tempDom.html();
            
            if(!isDefine(list[i].showType)){
                    //无图模式
                    itemHtml= $('<div class="ub ub-ac ubb b-dd myItem_padding btnDetile" id="'+objAndNew+'">'
                                   +'<div class="ub ub-ver ub-f1" >'
                                        +'<h3 class="ub-f1 lin2-hiden wrap '+titleFont+'" name="newsTitle">'
                                            +title
                                        +'</h3>'
                                        +'<p class="ub ub-ae c-b3 fz-68 uinn '+(((isComment==0)&&(isPtime==0))?'uhide':'')+'">'
                                         +'评论&nbsp;<span class="ub ub-pc '+((isComment==1)?'':'uhide')+'" id="commentNum_'+objAndNew+'">'
                                            +wordCnt
                                         +'</span>'
                                         +'<span class="ub ub-f1 ub-pe '+((isPtime==1)?'':'uhide')+'">'
                                            +dateTime
                                         +'</span>'
                                        +'</p>'
                                   +'</div>'
                                +'</div>');
            }else if(list[i].showType == 3){  //三图模式(不控制title字数)
                    var itemHtml = $('<div class="ub ub-ver ubb b-dd myItem_padding btnDetile" id="'+objAndNew+'"></div>');
                    //item = $('<div class="ub ub-ver ubb b-dd uinn-b05 umar-a btnDetile" id="'+objAndNew+'"></div>');
                     var imgDiv = $('<div class="ub ub-ac ub-pc"></div>');
                    //var imgDiv = $('<div class="ub ub-pj ub-ac"></div>');
                    for(var t = 0;t < picUrls.length;t++){
                        var sClass = 'm-r05';
                        if(t == 2){
                            sClass = '';
                        }
                        if(t < 3){
                            if(picUrls[t]!=null){
                                var attcUrl = picUrls[t];
                            }else{
                                var attcUrl = "";
                            }
                            var picUrl = getImgUrl("0",isDefine(attcUrl)?attcUrl:"",3); //图片路径原图
                            //图片预加载赋值
                            // imgId=list[i].picArr[t].url;
                            // this.itemImgList[this.idVal++]={
                                 // "imgId":imgId,
                                 // "imgUrl":url
                             // }
                            if(list[i].newsTypeId=="3"){//视频新闻显示视频logo
                                var cqImg=$('<div class="ub-img1 ub-f1 m-r05" id="img_'+picUrl+'" style="width:30%;">'
                                               +'<div class="ub-img vodeoLogo" style="position:absolute;top:3em;left:45%;"></div>'
                                            +'</div>');
                                //var cqImg = $('<div class="h4d3 ub-img1 ub-f1 '+sClass+'" id="img_'+imgId+'" style="background-image:url(\'image/noPic.png\');position:relative;"><div class="ub-img vodeoLogo"></div></div>');
                            }else{
                                var cqImg=$('<div class="ub-img1 ub-f1" id="img_'+picUrl+'" style="width:32%;">'
                                            +'</div>');
                                //var cqImg = $('<div class="h4d3 ub-img1 ub-f1 '+sClass+'" id="img_'+imgId+'" style="background-image:url(\'image/noPic.png\')"></div>');
                            }
                            var imgTag=$('<img class="myImg itemHeight" src="image/noPic.png" alt="" style="width:95%;"/>');
                            icache.run({dom:imgTag,url:picUrl});//缓存
                            cqImg.append(imgTag);
                            imgDiv.append(cqImg);
                        }  
                    }
                    var title=$('<h3 class="ub-f1 wrap font-size02 itemTitle03 '+titleFont+'" name="newsTitle">'
                                  +title
                                +'</h3>');
                    //var title = $('<div class="ub wrap font-size01" name="newsTitle">'+title+'</div>');
                    
                    var content = $('<p class="ub ub-ac c-b3 fz-68 uinn '+(((isComment==0)&&(isPtime==0))?'uhide':'')+'">'
                                        +'评论&nbsp;<span class="ub ub-pc '+((isComment==1)?'':'uhide')+'" id="commentNum_'+objAndNew+'">'
                                         +wordCnt
                                        +'</span>'
                                        +'<sapn class="ub-f1 ub ub-pe '+((isPtime==1)?'':'uhide')+'">'
                                         +dateTime
                                        +'</span>'
                                    +'</p>');
                    itemHtml.append(title);
                    itemHtml.append(imgDiv);
                    itemHtml.append(content);   
            }else if(list[i].showType == 2){   //插入广告模式(大图,不控制title字数)
                    var itemHtml = $('<div class="ub ub-ver ubb b-dd myItem_padding btnDetile" id="'+objAndNew+'"></div>');
                    var imgDiv = $('<div class="ub ub-pj ub-ac"></div>');
                    var attcUrl = picUrls[0];
                    var picUrl = getImgUrl("0",isDefine(attcUrl)?attcUrl:"",1); //图片路径原图
                    
                    //图片预加载赋值
                    // imgId=list[i].picArr[t].url;
                    // this.itemImgList[this.idVal++]={
                         // "imgId":imgId,
                         // "imgUrl":url
                     // }
                    
                    if(list[i].newsTypeId=="3"){//视频新闻显示视频logo
                        var cqImg=$('<div class="ub-img1 ub-f1 m-r05" id="img_'+picUrl+'">'
                                       +'<div class="ub-img vodeoLogo"  style="position:absolute;top:3em;left:45%;"></div>'
                                    +'</div>');
                    }else{
                        var cqImg=$('<div class="ub-img1 ub-f1" id="img_'+picUrl+'">'
                                    +'</div>');
                    }
                    var imgTag=$('<img class="myImg itemBigPic" src="image/noPic.png" alt=""/>');
                    icache.run({dom:imgTag,url:picUrl});//缓存
                    cqImg.append(imgTag);
                    imgDiv.append(cqImg);
                    
                    var title=$('<h3 class="ub-f1 wrap font-size02 itemTitle03 '+titleFont+'" name="newsTitle">'
                                  +title
                                +'</h3>');
                    var content = $('<p class="ub ub-ac c-b3 fz-68 uinn '+(((isComment==0)&&(isPtime==0))?'uhide':'')+'">'
                                        +'评论&nbsp;<span class="ub ub-pc '+((isComment==1)?'':'uhide')+'" id="commentNum_'+objAndNew+'">'
                                         +wordCnt
                                        +'</span>'
                                        +'<sapn class="ub-f1 ub ub-pe '+((isPtime==1)?'':'uhide')+'">'
                                         +dateTime
                                        +'</span>'
                                    +'</p>');
                    itemHtml.append(title);
                    itemHtml.append(imgDiv);
                    itemHtml.append(content);  
            }else{    //单图模式(默认 if(list[i].showType == 1))
                    if(!isDefine(picUrls[0])){
                        itemHtml= $('<div class="ub ub-ac ubb b-dd myItem_padding btnDetile" id="'+objAndNew+'">'
                                       +'<div class="ub ub-ver ub-f1" >'
                                            +'<h3 class="ub-f1 lin2-hiden wrap '+titleFont+'" name="newsTitle">'
                                                +title
                                            +'</h3>'
                                            +'<p class="ub ub-ae c-b3 fz-68 uinn '+(((isComment==0)&&(isPtime==0))?'uhide':'')+'">'
                                             +'评论&nbsp;<span class="ub ub-pc '+((isComment==1)?'':'uhide')+'" id="commentNum_'+objAndNew+'">'
                                                +wordCnt
                                             +'</span>'
                                             +'<span class="ub-f1 ub ub-pe '+((isPtime==1)?'':'uhide')+'">'
                                                +dateTime
                                             +'</span>'
                                            +'</p>'
                                       +'</div>'
                                    +'</div>');
                    }else{
                         itemHtml = $('<div class="ub ub-ac ubb b-dd myItem_padding btnDetile" id="'+objAndNew+'"></div>');
                         //item = $('<div class="ub ub-ac umar-a ubb b-dd uinn-b05 btnDetile" id="'+objAndNew+'"></div>');
                         
                         var attcUrl = picUrls[0];
                         var picUrl = getImgUrl("0",isDefine(attcUrl)?attcUrl:"",3); //图片路径原图
                         
                         //图片预加载赋值
                         // imgId=list[i].picArr[0].url;
                         // this.itemImgList[this.idVal++]={
                             // "imgId":imgId,
                             // "imgUrl":url
                         // }
                         
                         if(list[i].newsTypeId== 3 ){//视频新闻显示视频logo
                             var cqPic=$('<div class="itemImg" id="img_'+attcUrl+'">'
                                             +'<div class="ub-img vodeoLogo" style="position:absolute;left:2em;bottom:1.5em;"></div>'
                                         +'</div>');
                             //var cqPic = $('<div class="oc_hw3 ub-img1" id="img_'+imgId+'" style="background-image: url(\'image/noPic.png\');position:relative;"><div class="ub-img vodeoLogo01"></div></div>');
                         }else{
                             var cqPic=$('<div class="itemImg" id="img_'+attcUrl+'">'
                                         +'</div>');
                             //var cqPic = $('<div class="oc_hw3 ub-img1" id="img_'+imgId+'" style="background-image: url(\'image/noPic.png\');"></div>');
                         }
                         var imgTag=$('<img class="itemImg" src="image/noPic.png" alt=""/>');
                         cqPic.append(imgTag);
                         icache.run({dom:imgTag,url:picUrl});
                         
                         var con=$('<div class="ub ub-ver ub-f1 uinn-l05" >'
                                        +'<h3 class="ub-f1 wrap lin2-hiden '+titleFont+'" name="newsTitle">'
                                         +title
                                        +'</h3>'
                                        +'<p class="ub ub-ae c-b3 fz-68 uinn '+(((isComment==0)&&(isPtime==0))?'uhide':'')+'">'
                                         +'评论&nbsp;<span class="ub ub-pc '+((isComment==1)?'':'uhide')+'" id="commentNum_'+objAndNew+'">'
                                          +wordCnt
                                         +'</span>'
                                         +'<span class="ub-f1 ub ub-pe '+((isPtime==1)?'':'uhide')+'">'
                                          +dateTime
                                         +'</span>'
                                        +'</p>'
                                   +'</div>');
                         itemHtml.append(cqPic);
                         itemHtml.append(con);
                   }
                }
                
                item.append(itemHtml);
                this.domItem.append(item);
            }
        },
        b_domShow:function(index,list,conditions){ //鸣家类
            this.domItem = $('<ul class="ub ub-ver"></ul>');
            this.itemInfo={};//保存列表对应的json信息 
            var picUrls=[];
            var isSummary=isDefine(conditions.isSummary)||(typeof(conditions.isSummary)=='number')?conditions.isSummary:1;
            var isComment=isDefine(conditions.isComment)||(typeof(conditions.isComment)=='number')?conditions.isComment:1;
            var isPtime=isDefine(conditions.isPtime)||(typeof(conditions.isPtime)=='number')?conditions.isPtime:1;
            var isSpecial=0;
            var tagDom="";
            var tempDom=$('<div></div>');
             //字号适配
            var titleFont="myh4";
            var x=$(window).width();
            if((isAndroid && x>1080) || (!isAndroid && x>375)){
                titleFont="myh3";
            }
            for(var i = index;i < list.length;i++){
                tempDom.html('');
                tagDom="";
                this.itemInfo[list[i].newsId]=list[i];//保存列表对应的json信息
                isSpecial=(list[i].newsTypeId==5)?1:0;
                var objAndNew = list[i].newsId;
                picUrls=isDefine(list[i].picturesUrls)?list[i].picturesUrls.split(','):"";
                var attcUrl = picUrls[0];
                var picUrl = getImgUrl("0",isDefine(attcUrl)?attcUrl:"",3); //图片路径原图
                var titVal = list[i].newsTitle.length > 15 ? list[i].newsTitle.substring(0,15) + '...' : list[i].newsTitle;
                
                if(isSpecial==1){
                    //title+='<div class="label-zt fz-68">专题</div>';
                    tagDom=$('<div class="ub tagStyle fz-68"></div>');
                    var speTagDom=$('<div class="ub tagChild">专题</div>');
                    tagDom.append(speTagDom);
                }
                //标签显示
                if(isDefine(list[i].markId)){
                    if(isDefine(list[i].markContent)){
                        if(!isDefine(tagDom)){
                            tagDom=$('<div class="ub tagStyle fz-68"></div>');
                        }
                        var tagChildDom=$('<div class="ub tagChild">'+list[i].markName+'</div>');
                        tagDom.append(tagChildDom);
                    }
                } 
                tempDom.append(tagDom);
                titVal+=tempDom.html();
                 
                //var titVal = list[i].newsTitle;
                var titSmm = list[i].summary.length > 20 ? list[i].summary.substring(0,20) + '..' : list[i].summary;
                //var titSmm = isDefine(list[i].summary) ? list[i].summary : "　";
                var browseQuantity=list[i].pageViewNum;//浏览量
                var wordCnt = list[i].commentNum;      //评论
                var prseCnt = list[i].supportNum;      //赞
                var dateTime = NYR(list[i].publishTime,'1');   //时间
        
                var item = $('<li class="ub ub-ac umar-a05 bg-wh ink_item btnDetile" id="'+objAndNew+'"></li>');
                
                //var pic = $('<div class="oc_hw3 ub-img1" style="background-image: url(\'image/noPic.png\')"></div>');
                var imgId=picUrls[0];
                var pic=$('<div class="itemImg" id="img_'+imgId+'"></div>');
                var imgTag=$('<img class="itemImg" src="image/noPic.png" alt=""/>');
                pic.append(imgTag);
                if(isDefine(picUrl)){
                  icache.run({dom:imgTag,url:picUrl});
                }
                var content = $('<div class="ub ub-ver ub-f1 itemImg" style="margin-left:.7em;">'
                               +'<h3 class="ub-f1 '+titleFont+'">'+titVal+'</h3>'
                               +'<p class="ub-f1 ulev-1 c-88 '+((isSummary==1)?'':'uhide')+'">'+titSmm+'</p>'
                               +'<div class="ub ub-ac fz-68 '+(((isComment==0) && (isPtime==0))?'uhide':'')+'">'
                                    //+'<div class="ub ub-ac">'
                                      // +'<div class="ofont c-88">浏览量&nbsp;&nbsp;<span id="bq_'+list[i].newsId+'">'+browseQuantity+'</span></div>'
                                    //+'</div>'
                                   +'<div class="ub ub-ac '+((isComment==1)?'':'uhide')+'">'
                                       +'<div class="ub-img ojyp"></div>'
                                       +'<span class="ofont" style="margin-left:0.2em;" id="commentNum_'+objAndNew+'"> '+wordCnt+'</span>'
                                   +'</div>'
                                   // +'<div class="ub ub-ac" style="margin-left:0.8em;">'
                                       // +'<div class="ub-img oztz"></div>'
                                       // +'<div class="ofont" id="'+list[i].newsId+'" style="margin-left:0.2em;"> '+prseCnt+'</div>'
                                   // +'</div>'
                                   +'<span class="ub-f1 ub ub-pe c-88 '+((isPtime==1)?'':'uhide')+'" style="margin-right:.5em">'+dateTime+'</span>'
                               +'</div>'
                           +'</div>');
               item.append(pic);
               item.append(content);
               this.domItem.append(item);
            }
        },
        c_domShow:function(index,list,conditions){ //椒言类
            this.domItem = $('<ul class="ub-ver"></ul>');
            this.itemInfo={};//保存列表对应的json信息 
            this.domItemLeft = $('<ul class="ub-ver"></ul>');
            this.domItemRight = $('<ul class="ub-ver"></ul>');
            var jsq = 1;
            var picUrls=[];
            var isSummary=isDefine(conditions.isSummary)||(typeof(conditions.isSummary)=='number')?conditions.isSummary:1;
            var isComment=isDefine(conditions.isComment)||(typeof(conditions.isComment)=='number')?conditions.isComment:1;
            var isPtime=isDefine(conditions.isPtime)||(typeof(conditions.isPtime)=='number')?conditions.isPtime:1;
            var isSpecial=0;
            var tagDom="";
            var tempDom=$('<div></div>');
            var isSideLong=0;//放在左边
            var isSideShort=1;//放在右边
            var isShowTag=0;
            var titleLen,tempLen;
            //字号适配
            var titleFont="myh3";
            var x=$(window).width();
            if((isAndroid && x>1080) || (!isAndroid && x>375)){
                titleFont="font-size02";
            }
            for(var i = index;i < list.length;i++){
                tempDom.html('');
                tagDom="";
                isShowTag=0;
                this.itemInfo[list[i].newsId]=list[i];//保存列表对应的json信息 
                isSpecial=(list[i].newsTypeId==5)?1:0;
                var objAndNew = list[i].newsId;
                var title = list[i].newsTitle;        //标题
                if((isAndroid && x>=1080) || (!isAndroid && x>=375)){
                    titleLen=17;
                }else{
                    titleLen=15;
                }
                title=title.length > titleLen ? title.substring(0,titleLen)+'...' : title;
                
                if(isSpecial==1){
                    isShowTag=1;
                    //title+='<div class="label-zt fz-68">专题</div>';
                    tagDom=$('<div class="ub tagStyle01 fz-68 tag-l"></div>');
                    var speTagDom=$('<div class="ub tagChild01">专题</div>');
                    tagDom.append(speTagDom);
                }
                //标签显示
                if(isDefine(list[i].markId)){
                    if(isDefine(list[i].markContent)){
                        if(!isDefine(tagDom)){
                            tagDom=$('<div class="ub tagStyle01 fz-68 tag-l"></div>');
                        }
                        var tagChildDom=$('<div class="ub tagChild01">'+list[i].markName+'</div>');
                        tagDom.append(tagChildDom);
                        isShowTag=1;
                    }
                } 
                tempDom.append(tagDom);
                //title+=tempDom.html();
                
                var cont = list[i].summary;        //简要
                
                var newsTagVal=isDefine(list[i].newsTag)?list[i].newsTag[0]:"";
                
                var browseQuantity=list[i].pageViewNum;//浏览量
                var wordCnt = list[i].commentNum;      //评论
                var prseCnt = list[i].supportNum;      //赞
                var dateTime = timePoor(list[i].publishTime);   //时间
                picUrls=isDefine(list[i].picturesUrls)?list[i].picturesUrls.split(','):"";
                var attcUrl = picUrls[0];
                var picUrl = getImgUrl("0",isDefine(attcUrl)?attcUrl:"",3); //图片路径原图
                
                if(cont.length > 30){
                    cont = cont.substring(0,30)+'...';
                }
                
                if(jsq%2 != 0){//长图（已改成统一的短图）
                    var item = $('<li class="ub ub-ver itemBorder ink_item btnDetile" id="'+objAndNew+'"></li>');
                    
                    var newsTag=$('<div class="ub ub-ac uinnTag">'
                                    +'<div class="ub ub-ac ub-img newsTag"></div>'  
                                    +'<span class="ub ub-ac newsTagFont">'+newsTagVal+'</span>' 
                                 +'</div>');
                    //var imgDom = $('<div class="ub-img1 ojy2" style="background-image:url(\'image/noPic.png\')"></div>');
                    if(list[i].newsTypeId == 3 ){//视频新闻显示视频logo
                        var imgDom = $('<div class="ub ub-ac ub-pc ub-img1 ojy1" style="background-image:url(\'image/noPic.png\')"><div class="ub ub-img vodeoLogo"></div></div>');
                    }else{//文字新闻
                       var imgDom = $('<div class="ub-img1 ojy1" style="background-image:url(\'image/noPic.png\')"></div>');
                    }
                    icache.run({dom:imgDom,url:picUrl});
                    //var imgDom = $('<div class="ub-img1 ojy2" style="background-image:url(\''+picUrl+'\')"></div>');
                    
                    var content = $('<h3 class="ub uinnTit lin2-hiden wrap '+titleFont+'">'+title+'</h3>'
                                   +(((isSummary==1)||(isComment==1)||(isPtime==1))?'<p class="ubb b-ad" style="padding:.3em;margin:0;"></p>':'')
                                   +((isSummary==1)?'<p class="ub ub-ae ulev-1 uinnTit c-88 wrap">'+cont+'</p>':'')
                                   +'<div class="ub ub-ac fz-68 uinnTit '+(((isComment==0) && (isPtime==0))?'uhide':'')+'">'
                                       +'<div class="ub ub-ac">'
                                           //+'<div class="ofont c-88">浏览量&nbsp;&nbsp;<span id="bq_'+list[i].newsId+'">'+browseQuantity+'</span></div>'
                                       +'</div>'
                                       +'<div class="ub ub-ac '+((isComment==1)?'':'uhide')+'">'
                                           +'<div class="ub-img ojyp"></div>&nbsp;'
                                           +'<span class="ofont" id="commentNum_'+objAndNew+'">'+wordCnt+'</span>'
                                       +'</div>'
                                       // +'<div class="ub ub-ac" style="margin-left:0.8em;">'
                                           // +'<div class="ub-img oztz"></div>'
                                           // +'<div class="ofont" id="'+list[i].newsId+'">'+prseCnt+'</div>'
                                       // +'</div>'
                                       +'<div class="ub ub-ac ub-pc ub-f1 ub-pe">'
                                            +'<span class="c-88 '+((isPtime==1)?'':'uhide')+'">'+dateTime+'</span>'
                                            +((isShowTag==1)?tempDom.html():'')
                                       +'</div>'
                                   +'</div>');
                    if(isDefine(newsTagVal)){
                       item.append(newsTag);
                    }
                    item.append(imgDom);
                    item.append(content);
                    //this.domItemLeft.append(item);
                    if(isSideLong== 0){//追加在左边
                         this.domItemLeft.append(item);
                         isSideLong=1;
                    }else{//追加在右边
                         this.domItemRight.append(item);
                         isSideLong=0;
                    }
                }else{//短图
                    var item = $('<li class="ub ub-ver itemBorder btnDetile" id="'+objAndNew+'"></li>');
                    
                    var newsTag=$('<div class="ub ub-ac uinnTag">'
                                    +'<div class="ub ub-ac ub-img newsTag"></div>'  
                                    +'<sapn class="ub ub-ac newsTagFont">'+newsTagVal+'</sapn>' 
                                 +'</div>');
                    //var imgDom = $('<div class="ub-img1 ojy1" style="background-image:url(\'image/noPic.png\')"></div>');
                    if(list[i].newsTypeId== 3 ){//视频新闻显示视频logo
                        var imgDom = $('<div class="ub ub-ac ub-pc ub-img1 ojy1" style="background-image:url(\'image/noPic.png\')"><div class="ub ub-img vodeoLogo"></div></div>');
                    }else{//文字新闻
                       var imgDom = $('<div class="ub-img1 ojy1" style="background-image:url(\'image/noPic.png\')"></div>');
                    }
                    icache.run({dom:imgDom,url:picUrl});
                    //var imgDom = $('<div class="ub-img1 ojy2" style="background-image:url(\''+picUrl+'\')"></div>');
                   
                    var content = $('<h3 class="ub uinnTit lin2-hiden wrap '+titleFont+'">'+title+'</h3>'
                                   +(((isSummary==1)||(isComment==1)||(isPtime==1))?'<p class="ubb b-ad" style="padding:.3em;margin:0;"></p>':'')
                                   +((isSummary==1)?'<p class=" ub ub-ae ulev-1 uinnTit c-88 wrap">'+cont+'</p>':'')
                                   +'<div class="ub ub-ac fz-68 uinnTit '+(((isComment==0) && (isPtime==0))?'uhide':'')+'">'
                                       //+'<div class="ub ub-ac">'
                                           //+'<div class="ofont c-88">浏览量&nbsp;&nbsp;<span id="bq_'+list[i].newsId+'">'+browseQuantity+'</span></div>'
                                       //+'</div>'
                                       +'<div class="ub ub-ac '+((isComment==1)?'':'uhide')+'">'
                                           +'<div class="ub-img ojyp"></div>&nbsp;'
                                           +'<span class="ofont" id="commentNum_'+objAndNew+'">'+wordCnt+'</span>'
                                       +'</div>'
                                       // +'<div class="ub ub-ac" style="margin-left:0.8em;">'
                                           // +'<div class="ub-img oztz"></div>'
                                           // +'<div class="ofont" id="'+list[i].newsId+'">'+prseCnt+'</div>'
                                       // +'</div>'
                                       +'<div class="ub ub-ac ub-pc ub-f1 ub-pe">'
                                            +'<span class="c-88 '+((isPtime==1)?'':'uhide')+'">'+dateTime+'</span>'
                                            +((isShowTag==1)?tempDom.html():'')
                                       +'</div>'
                                   +'</div>');
                        if(isDefine(newsTagVal)){
                           item.append(newsTag);
                        }
                        item.append(imgDom);
                        item.append(content);
                        //this.domItemLeft.append(item);
                        if(isSideShort == 0){//追加在左边
                             this.domItemLeft.append(item);
                             isSideShort=1;
                        }else{ //追加在右边
                             this.domItemRight.append(item);
                             isSideShort=0;
                        }
                    }
                    jsq++;
            }
        },
        d_domShow:function(index,list,conditions){
            this.domItem = $('<ul class="ub ub-ver"></ul>');
            this.itemInfo={};//保存列表对应的json信息 
            var photoId="";
            var photoUserId="";
            var picUrl="";
            var bannPic = 'image/noPic.png';   //大图
            var userIcon = 'css/img/oheadpic.png';        //头像
            var nickName="";
            var time="";
            var content="";
            var praiseIcon="res-praiseIcon";
            for(var i = index;i < list.length;i++){
                this.itemInfo[list[i].photoId]=list[i];//保存列表对应的json信息
                
                time = timePoor(list[i].cTime);           //计算时间差
                content = list[i].content;
                if(content.length > 25){
                    content = content.substring(0,25)+"...";
                }
                photoId = list[i].photoId;
                
                if(isDefine(list[i].picUrls)){
                    picUrl=list[i].picUrls.split(",")[0];
                    //bannPic = getPictureUrl("1",list[i].attachment[0].attcId,1);
                   bannPic = getImgUrl("1",picUrl,4);
                }
                
                if(isDefine(list[i].userIcon)&&list[i].userIcon!=""){
                    userIcon = getImgUrl("1",list[i].userIcon,2);
                }
                
                nickName=(list[i].userName).substring(0,3)+"***";
                if(isDefine(list[i].nickName)&&list[i].nickName!=""){
                    nickName = list[i].nickName;
                } 
                
                (list[i].isSupport==1)?(praiseIcon="dogood"):"";
                
                var cls = "ub-img";
                var heiLs = '15.18em';
                
                var item = $('<li class="ub ub-ver bg-wh ink_item" style="margin-bottom: 0.5em;"></li>');
                var seeten = $('<div class="ub ub-ver"></div>');
                var shootPic = $('<div class="ub ub-ac ub-pc shootImgs" id="id_'+photoId+'"></div>');
                var banner = $('<img src="image/noPic.png" alt="" style="height:15em; max-width:100%;" />');
                //var banner = $('<div class="'+cls+' shootImgs" id="img_'+interId+'" style="background-image: url(\'image/noPic.png\')"></div>');
                icache.run({dom:banner,url:bannPic});
                
                var content = $('<div class="ub" style="padding:.5em .5em">'
                                +'<div class="ub ub-ver ub-ac" style="width:12%;">'
                                    +'<div class="ub-img1" style="width: 2.3em;height: 2.3em;border-radius:50%;background-image: url('+userIcon+')"></div>'
                                    +'<div class="ub ub-ver ub-ac">'
                                        +'<span class="c-99" style="font-size:0.825em;margin-top:0.25em;">'+nickName+'</span>'
                                    +'</div>'
                                +'</div>'
                                +'<p class="ub font-size01" name="commentVal" style="width:80%;padding-left:0.35em;">'+content+'</p>'
                            +'</div>'
                            +'<p class="ub ub-pe c-99 fz-8" style="margin-top:-1.8em;">'+time+'&nbsp;</p>');
                var footer = $('<div class="ub uinn c-99 fz-8" style="border-top:1px solid #DDDDDD;margin-top:0.25em;">'
                            +'<div class="ub ub-f1 ub-pc ub-ac ubr b-ce onzambia" id="support_'+photoId+'">'
                                +'<div class="ub-img1 '+praiseIcon+'" id="supportIcon_'+photoId+'" style="height:1.5em;width:1.5em;"></div>'
                                +'<div class="" style="padding-left: .2em"></div>'
                                +'<span class="uinn-l1" id="supportSum_'+photoId+'">'+list[i].supportSum+'</span>'
                            +'</div>'
                            +'<div class="ub ub-f1 ub-pc ub-ac ubr b-ce listInfo" id="comment_'+photoId+'">'
                                +'<div class="ub-img1 res-commentIcon" style="height:1.5em;width:1.5em;"></div>'
                                +'<div class="" style="padding-left: .2em"></div>'
                                +'<span class="uinn-l1" id="commentSum_'+photoId+'">'+list[i].commentSum+'</span>'
                            +'</div>'
                            +'<div class="ub ub-f1 ub-pc ub-ac shareInfo" id="share_'+photoId+'" style="padding:0 1em;">'
                                +'<div class="ub-img1 res-shareIcon" style="height:1.5em;width:1.5em;"></div>'
                            +'</div>'
                        +'</div>');
                    shootPic.append(banner);
                    seeten.append(shootPic);
                    seeten.append(content);
                    item.append(seeten);
                    item.append(footer);
                    this.domItem.append(item);
                }
        },
        e_domShow:function(index,list,conditions){ //正事儿类
            this.domItem = $('<ul class="ub ub-ver"></ul>');
            this.itemInfo={};//保存列表对应的json信息 
            this.domItemLeft = $('<ul class="ub ub-ver"></ul>');
            var picUrls=[];
            var isSummary=isDefine(conditions.isSummary)||(typeof(conditions.isSummary)=='number')?conditions.isSummary:1;
            var isComment=isDefine(conditions.isComment)||(typeof(conditions.isComment)=='number')?conditions.isComment:1;
            var isPtime=isDefine(conditions.isPtime)||(typeof(conditions.isPtime)=='number')?conditions.isPtime:1;
            var isSpecial=0;
            var tagDom="";
            var tempDom=$('<div></div>');
            var isShowTag=0;
            var titleLen,tempLen;
            //字号适配
            var titleFont="myh3";
            var x=$(window).width();
            if((isAndroid && x>1080) || (!isAndroid && x>375)){
                titleFont="font-size02";
            }
            
            for(var i = index;i < list.length;i++){
                tempDom.html('');
                tagDom="";
                isShowTag=0;
                this.itemInfo[list[i].newsId]=list[i];//保存列表对应的json信息 
                isSpecial=(list[i].newsTypeId==5)?1:0;
                var objAndNew = list[i].newsId;
                var title = list[i].newsTitle;        //标题
                if((isAndroid && x>=1080) || (!isAndroid && x>=375)){
                    titleLen=40;
                }else{
                    titleLen=36;
                }
                title=title.length > titleLen ? title.substring(0,titleLen)+'...' : title;
                
                if(isSpecial==1){
                    //title+='<div class="label-zt fz-68">专题</div>';
                    tagDom=$('<div class="ub tagStyle01 fz-68 tag-l"></div>');
                    var speTagDom=$('<div class="ub tagChild01">专题</div>');
                    tagDom.append(speTagDom);
                    isShowTag=1;
                }
                //标签显示
                if(isDefine(list[i].markId)){
                    if(isDefine(list[i].markContent)){
                        if(!isDefine(tagDom)){
                            tagDom=$('<div class="ub tagStyle01 fz-68 tag-l"></div>');
                        }
                        var tagChildDom=$('<div class="ub tagChild01">'+list[i].markName+'</div>');
                        tagDom.append(tagChildDom);
                        isShowTag=1;
                    }
                } 
                tempDom.append(tagDom);
                //title+=tempDom.html();
                
                var cont = list[i].summary;        //简要
                
                var newsTagVal=isDefine(list[i].newsTag)?list[i].newsTag[0]:"";
                
                var browseQuantity=list[i].pageViewNum;//浏览量
                var wordCnt = list[i].commentNum;      //评论
                var prseCnt = list[i].supportNum;      //赞
                var dateTime = timePoor(list[i].publishTime);   //时间
                picUrls=isDefine(list[i].picturesUrls)?list[i].picturesUrls.split(','):"";
                var attcUrl = picUrls[0];
                var picUrl = getImgUrl("0",isDefine(attcUrl)?attcUrl:"",3); //图片路径原图
                // if(title.length > 15){
                    // title = title.substring(0,15)+'...';
                // }
                if(cont.length > 30){
                    cont = cont.substring(0,30)+'...';
                }
                
                //长图
                var item = $('<li class="ub ub-ver itemBorder ink_item btnDetile" id="'+objAndNew+'"></li>');
                
                var newsTag=$('<div class="ub ub-ac uinnTag">'
                                +'<div class="ub ub-ac ub-img newsTag"></div>'  
                                +'<span class="ub ub-ac newsTagFont">'+newsTagVal+'</span>' 
                             +'</div>');
                //var imgDom = $('<div class="ub-img1 ojy2" style="background-image:url(\'image/noPic.png\')"></div>');
                if(list[i].newsTypeId == 3 ){//视频新闻显示视频logo
                    var imgDom = $('<div class="ub ub-ac ub-pc ub-img1 ojy2" style="background-image:url(\'image/noPic.png\')"><div class="ub ub-img vodeoLogo"></div></div>');
                }else{//文字新闻
                   var imgDom = $('<div class="ub-img1 ojy2" style="background-image:url(\'image/noPic.png\')"></div>');
                }
                icache.run({dom:imgDom,url:picUrl});
                //var imgDom = $('<div class="ub-img1 ojy2" style="background-image:url(\''+picUrl+'\')"></div>');
                
                var content = $('<h3 class="ub uinnTit wrap '+titleFont+'">'+title+'</h3>'
                               +(((isSummary==1)||(isComment==1)||(isPtime==1))?'<p class="ubb b-ad" style="padding:.3em;margin:0;"></p>':'')
                               +((isSummary==1)?'<p class="ub ub-ae ulev-1 uinnTit c-88 wrap">'+cont+'</p>':'')
                               +'<div class="ub ub-ac fz-68 uinnTit '+(((isComment==0) && (isPtime==0))?'uhide':'')+'">'
                                   +'<div class="ub ub-ac">'
                                       //+'<div class="ofont c-88">浏览量&nbsp;&nbsp;<span id="bq_'+list[i].newsId+'">'+browseQuantity+'</span></div>'
                                   +'</div>'
                                   +'<div class="ub ub-ac '+((isComment==1)?'':'uhide')+'">'
                                       +'<div class="ub-img ojyp"></div>&nbsp;'
                                       +'<span class="ofont" id="commentNum_'+objAndNew+'">'+wordCnt+'</span>'
                                   +'</div>'
                                   // +'<div class="ub ub-ac" style="margin-left:0.8em;">'
                                       // +'<div class="ub-img oztz"></div>'
                                       // +'<div class="ofont" id="'+list[i].newsId+'">'+prseCnt+'</div>'
                                   // +'</div>'
                                   +'<div class="ub ub-ac ub-pc ub-f1 ub-pe">'
                                        +'<span class="c-88 '+((isPtime==1)?'':'uhide')+'">'+dateTime+'</span>'
                                        +((isShowTag==1)?tempDom.html():'')
                                   +'</div>'
                               +'</div>');
                if(isDefine(newsTagVal)){
                   item.append(newsTag);
                }
                item.append(imgDom);
                item.append(content);
                this.domItemLeft.append(item);
            }
        },
        f_domShow:function(index,list,conditions){ //推荐资讯列表显示布局
            
            //alert(JSON.stringify(list));
            
            this.domItem = $('<ul class="ub ub-ver"></ul>');
            this.itemInfo={};//保存列表对应的json信息 
            var isSummary=isDefine(conditions.isSummary)||(typeof(conditions.isSummary)=='number')?conditions.isSummary:1;
            var isComment=isDefine(conditions.isComment)||(typeof(conditions.isComment)=='number')?conditions.isComment:1;
            var isPtime=isDefine(conditions.isPtime)||(typeof(conditions.isPtime)=='number')?conditions.isPtime:1;
            
            var picUrls=[];
            var title="";
            var newsSmmr="";
            var isSpecial=0;
            var tagDom="";
            var tempDom=$('<div></div>');
            var titleLen,tempLen;
             //字号适配
            var titleFont="myh3";
            var x=$(window).width();
            if((isAndroid && x>1080) || (!isAndroid && x>375)){
                titleFont="font-size02";
            }
            
            var columnNameColor="#FF8A00";
            for(var i = index;i < list.length;i++){
                var imgId="";
                tempDom.html('');
                tagDom="";
                titleLen=0;
                tempLen=0;
                this.itemInfo[list[i].newsId]=list[i];//保存列表对应的json信息
                
                isSpecial=(list[i].newsTypeId==5)?1:0;
                var objAndNew = list[i].newsId;
                picUrls=isDefine(list[i].picturesUrls)?list[i].picturesUrls.split(','):"";
                
                //标签显示
                if(isDefine(list[i].markId)){
                    if(isDefine(list[i].markContent)){
                        if(!isDefine(tagDom)){
                            tagDom=$('<div class="ub tagStyle fz-68"></div>');
                        }
                        var tagChildDom=$('<div class="ub tagChild">'+list[i].markName+'</div>');
                        tagDom.append(tagChildDom);
                    }
                    if(list[i].markName){
                        tempLen+=(list[i].markName).length;
                    }
                } 
                tempDom.append(tagDom);
                if(isDefine(list[i].newsTitle)){
                    title = list[i].newsTitle;
                    if(!isDefine(list[i].showType) || !isDefine(picUrls[0])){//无图模式
                        if((isAndroid && x>=1080) || (!isAndroid && x>=375)){
                            titleLen=40-tempLen;
                        }else{
                            titleLen=36-tempLen;
                        }
                        title = title.length > titleLen ? title.substring(0,titleLen) : title;
                    }else if(list[i].showType==1){ //有图模式(单图)
                        if((isAndroid && x>=1080) || (!isAndroid && x>=375)){
                            titleLen=30-tempLen;
                        }else{
                            titleLen=(tempLen==0)?(24-tempLen):(23-tempLen);
                        }
                        title = title.length > titleLen ? title.substring(0,titleLen) : title;
                    }
                }
                
                if(isDefine(list[i].summary)){
                    newsSmmr = list[i].summary.length > 26 ? list[i].summary.substring(0,26)+"..." : list[i].summary;
                }
                var wordCnt = list[i].commentNum;
                var dateTime =NYR(list[i].publishTime,'1');
                var item=$('<li class="ink_item"></li>');
                var itemHtml = "";
                title+=tempDom.html();
                
                //资讯来源哪个栏目
                columnNameColor=(i%2==0)?'#FF8A00':'#217CEE';
                var selfColumnNames=appcan.locStorage.val("selfColumnNames");
                //alert(JSON.stringify(selfColumnNames));
                selfColumnNames=isDefine(selfColumnNames)?JSON.parse(selfColumnNames):"";
                var selfColumnName=selfColumnNames[list[i].selfColumnId].columnName;
                var columnNameDom="";
                if(isDefine(selfColumnName)){
                    columnNameDom='<span class="tagChild01 ub-f1 ub-pe" style="margin-left:0.5em;color:'+columnNameColor+';border-color:'+columnNameColor+'">'+selfColumnName+'</span>';
                }
                
                if(!isDefine(list[i].showType)){
                        //无图模式
                        itemHtml= $('<div class="ub ub-ac ubb b-dd myItem_padding btnDetile" id="'+objAndNew+'">'
                                       +'<div class="ub ub-ver ub-f1" >'
                                            +'<h3 class="ub-f1 lin2-hiden wrap '+titleFont+'" name="newsTitle">'
                                                +title
                                            +'</h3>'
                                            +'<p class="ub ub-ae c-b3 fz-68 uinn '+(((isComment==0)&&(isPtime==0))?'uhide':'')+'">'
                                             +'评论&nbsp;<span class="ub ub-pc '+((isComment==1)?'':'uhide')+'" id="commentNum_'+objAndNew+'">'
                                                +wordCnt
                                             +'</span>'
                                             +'<span class="ub ub-f1 ub-pe '+((isPtime==1)?'':'uhide')+'">'
                                                +dateTime
                                             +'</span>'
                                             +columnNameDom
                                            +'</p>'
                                       +'</div>'
                                    +'</div>');
                }else if(list[i].showType == 3){  //三图模式(不控制title字数)
                        var itemHtml = $('<div class="ub ub-ver ubb b-dd myItem_padding btnDetile" id="'+objAndNew+'"></div>');
                        var imgDiv = $('<div class="ub ub-ac ub-pc"></div>');
                        for(var t = 0;t < picUrls.length;t++){
                            var sClass = 'm-r05';
                            if(t == 2){
                                sClass = '';
                            }
                            if(t < 3){
                                if(picUrls[t]!=null){
                                    var attcUrl = picUrls[t];
                                }else{
                                    var attcUrl = "";
                                }
                                var picUrl = getImgUrl("0",isDefine(attcUrl)?attcUrl:"",3); //图片路径原图
                                
                                if(list[i].newsTypeId=="3"){//视频新闻显示视频logo
                                    var cqImg=$('<div class="ub-img1 ub-f1 m-r05" id="img_'+picUrl+'" style="width:30%;">'
                                                   +'<div class="ub-img vodeoLogo" style="position:absolute;top:3em;left:45%;"></div>'
                                                +'</div>');
                                }else{
                                    var cqImg=$('<div class="ub-img1 ub-f1" id="img_'+picUrl+'" style="width:32%;">'
                                                +'</div>');
                                }
                                var imgTag=$('<img class="myImg itemHeight" src="image/noPic.png" alt="" style="width:95%;"/>');
                                icache.run({dom:imgTag,url:picUrl});//缓存
                                cqImg.append(imgTag);
                                imgDiv.append(cqImg);
                            }  
                        }
                        var title=$('<h3 class="ub-f1 wrap font-size02 itemTitle03 '+titleFont+'" name="newsTitle">'
                                      +title
                                    +'</h3>');
                        
                        var content = $('<p class="ub ub-ac c-b3 fz-68 uinn '+(((isComment==0)&&(isPtime==0))?'uhide':'')+'">'
                                            +'评论&nbsp;<span class="ub ub-pc '+((isComment==1)?'':'uhide')+'" id="commentNum_'+objAndNew+'">'
                                             +wordCnt
                                            +'</span>'
                                            +'<sapn class="ub-f1 ub ub-pe '+((isPtime==1)?'':'uhide')+'">'
                                             +dateTime
                                            +'</span>'
                                            +columnNameDom
                                        +'</p>');
                        itemHtml.append(title);
                        itemHtml.append(imgDiv);
                        itemHtml.append(content);   
                }else if(list[i].showType == 2){   //插入广告模式(大图,不控制title字数)
                        var itemHtml = $('<div class="ub ub-ver ubb b-dd myItem_padding btnDetile" id="'+objAndNew+'"></div>');
                        var imgDiv = $('<div class="ub ub-pj ub-ac"></div>');
                        var attcUrl = picUrls[0];
                        var picUrl = getImgUrl("0",isDefine(attcUrl)?attcUrl:"",1); //图片路径原图
                        
                        if(list[i].newsTypeId=="3"){//视频新闻显示视频logo
                            var cqImg=$('<div class="ub-img1 ub-f1 m-r05" id="img_'+picUrl+'">'
                                           +'<div class="ub-img vodeoLogo"  style="position:absolute;top:3em;left:45%;"></div>'
                                        +'</div>');
                        }else{
                            var cqImg=$('<div class="ub-img1 ub-f1" id="img_'+picUrl+'">'
                                        +'</div>');
                        }
                        var imgTag=$('<img class="myImg itemBigPic" src="image/noPic.png" alt=""/>');
                        icache.run({dom:imgTag,url:picUrl});//缓存
                        cqImg.append(imgTag);
                        imgDiv.append(cqImg);
                        
                        var title=$('<h3 class="ub-f1 wrap font-size02 itemTitle03 '+titleFont+'" name="newsTitle">'
                                      +title
                                    +'</h3>');
                        var content = $('<p class="ub ub-ac c-b3 fz-68 uinn '+(((isComment==0)&&(isPtime==0))?'uhide':'')+'">'
                                            +'评论&nbsp;<span class="ub ub-pc '+((isComment==1)?'':'uhide')+'" id="commentNum_'+objAndNew+'">'
                                             +wordCnt
                                            +'</span>'
                                            +'<sapn class="ub-f1 ub ub-pe '+((isPtime==1)?'':'uhide')+'">'
                                             +dateTime
                                            +'</span>'
                                            +columnNameDom
                                        +'</p>');
                        itemHtml.append(title);
                        itemHtml.append(imgDiv);
                        itemHtml.append(content);  
                }else{    //单图模式(默认 if(list[i].showType == 1))
                        if(!isDefine(picUrls[0])){
                            itemHtml= $('<div class="ub ub-ac ubb b-dd myItem_padding btnDetile" id="'+objAndNew+'">'
                                           +'<div class="ub ub-ver ub-f1" >'
                                                +'<h3 class="ub-f1 lin2-hiden wrap '+titleFont+'" name="newsTitle">'
                                                    +title
                                                +'</h3>'
                                                +'<p class="ub ub-ae c-b3 fz-68 uinn '+(((isComment==0)&&(isPtime==0))?'uhide':'')+'">'
                                                 +'评论&nbsp;<span class="ub ub-pc '+((isComment==1)?'':'uhide')+'" id="commentNum_'+objAndNew+'">'
                                                    +wordCnt
                                                 +'</span>'
                                                 +'<span class="ub-f1 ub ub-pe '+((isPtime==1)?'':'uhide')+'">'
                                                    +dateTime
                                                 +'</span>'
                                                 +columnNameDom
                                                +'</p>'
                                           +'</div>'
                                        +'</div>');
                        }else{
                             itemHtml = $('<div class="ub ub-ac ubb b-dd myItem_padding btnDetile" id="'+objAndNew+'"></div>');
                             //item = $('<div class="ub ub-ac umar-a ubb b-dd uinn-b05 btnDetile" id="'+objAndNew+'"></div>');
                             
                             var attcUrl = picUrls[0];
                             var picUrl = getImgUrl("0",isDefine(attcUrl)?attcUrl:"",3); //图片路径原图
                             
                             if(list[i].newsTypeId== 3 ){//视频新闻显示视频logo
                                 var cqPic=$('<div class="itemImg" id="img_'+attcUrl+'">'
                                                 +'<div class="ub-img vodeoLogo" style="position:absolute;left:2em;bottom:1.5em;"></div>'
                                             +'</div>');
                             }else{
                                 var cqPic=$('<div class="itemImg" id="img_'+attcUrl+'">'
                                             +'</div>');
                             }
                             var imgTag=$('<img class="itemImg" src="image/noPic.png" alt=""/>');
                             cqPic.append(imgTag);
                             icache.run({dom:imgTag,url:picUrl});
                             
                             var con=$('<div class="ub ub-ver ub-f1 uinn-l05" >'
                                            +'<h3 class="ub-f1 wrap lin2-hiden '+titleFont+'" name="newsTitle">'
                                             +title
                                            +'</h3>'
                                            +'<p class="ub ub-ae c-b3 fz-68 uinn '+(((isComment==0)&&(isPtime==0))?'uhide':'')+'">'
                                             +'评论&nbsp;<span class="ub ub-pc '+((isComment==1)?'':'uhide')+'" id="commentNum_'+objAndNew+'">'
                                              +wordCnt
                                             +'</span>'
                                             +'<span class="ub-f1 ub ub-pe '+((isPtime==1)?'':'uhide')+'">'
                                              +dateTime
                                             +'</span>'
                                             +columnNameDom
                                            +'</p>'
                                       +'</div>');
                             itemHtml.append(cqPic);
                             itemHtml.append(con);
                       }
                    }
                    
                    item.append(itemHtml);
                    this.domItem.append(item);
                }
        }
}

