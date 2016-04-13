getInterface/*
 * 前端接口配置
 * @author jun.zheng
 */
//模块接口路由配置
var if_route={
    news:{//资讯路由
        billboardGetList:"billboard_getList",//轮播
        newsInfoGetList:"newsInfo_getList", //资讯列表
        newsInfoGetOne:"newsInfo_getOne"  //资讯详情
        
    },
    user:{
        userInfoGet:"userInfo_getList", //获取用户列表（名家）
        userInfoUserLogin:"userInfo_userLogin", //用户登录
        userAction:"userS_add", //用户行为添加
        userActionRemove:"userS_remove"  //用户行为取消（取消收藏）
    },
    comment:{
        commentInfoAdd:"commentInfo_add",  //添加评论
        commentInfoGetList:"commentInfo_getList" //评论列表获取
    }
}
//设备类型（自定义1-->IOS,2-->android）;
var deviceType=isAndroid?2:1;
var listType=1;//新闻列表类型  固定值：0名家新闻  专题新闻；1：栏目新闻；2：相关新闻

//获取接口并返回前端
function getInterface(typeId,id,pageNum,condition){
    interfaceVal = setNewsInterface(typeId,id,pageNum,condition);
    return interfaceVal;
}

//资讯列表接口设置
var newsType="";
var list="";
function setNewsInterface(typeIdVal,idVal,pageNumVal,condition){
    newsType=typeIdVal;
    switch(newsType){
        case "billboardGetList":  //slider 轮播图
            list = {
                "transcode": if_route.news.billboardGetList,
                "content": {
                    "columnId": idVal,
                    "deviceType": deviceType,
                    "page": {
                        "pageNo": 1,
                        "pageSize": 5
                    }
                }
            };
            break;
        case "newsInfoGetList":  //newslist 资讯列表
            if(isDefine(condition)){//附加条件
                if(isDefine(condition.listType)){
                    listType=condition.listType;
                    var list = {
                        "transcode": if_route.news.newsInfoGetList,
                        "content": {
                            "newsId": idVal,
                            "listType" : parseInt(listType), //0名家新闻  专题新闻；1：栏目新闻；2：相关新闻
                            "deviceType": deviceType     // 选填
                            }
                    };
                }else if(isDefine(condition.keyWord)){
                    var list = {
                        "transcode": if_route.news.newsInfoGetList,
                        "content": {
                            "columnIds":idVal,
                            "keywords" : condition.keyWord,
                            "deviceType": deviceType,
                            "listType" : parseInt(listType),
                            "page": {
                                "pageNo": pageNumVal,
                                "pageSize": 10
                            }
                        }
                    };
                }else if(isDefine(condition.isFocus)){
                    var list = {
                        "transcode": if_route.news.newsInfoGetList,
                        "content": {
                            "columnIds":idVal,
                            "isFocus":parseInt(condition.isFocus),
                            "deviceType": deviceType,
                            "listType" : parseInt(listType),
                            "page": {
                                "pageNo": pageNumVal,
                                "pageSize": 10
                            }
                        }
                     };
                }else if(isDefine(condition.isRecommendation)){
                    var list = {
                        "transcode": if_route.news.newsInfoGetList,
                        "content": {
                            "columnIds":idVal,
                            "isRecommendation":parseInt(condition.isRecommendation),
                            "deviceType": deviceType,
                            "listType" : parseInt(listType),
                            "page": {
                                "pageNo": pageNumVal,
                                "pageSize": 10
                            }
                        }
                     };
                }
            }else{
                var list = {
                    "transcode": if_route.news.newsInfoGetList,
                    "content": {
                        "columnIds":idVal,
                        "deviceType": deviceType,
                        "listType" : parseInt(listType),
                        "page": {
                            "pageNo": pageNumVal,
                            "pageSize": 10
                        }
                    }
                 };
            }
            break;
        case "newsInfoGetOne":  //newsDetail 资讯详情
            list = {
                    "transcode": if_route.news.newsInfoGetOne,
                    "content": {
                        "newsId": idVal,
                        "userId": condition.userId,
                        "deviceType": deviceType
                    }
            };
            break;
        case "userInfoGetList": //获取名家
            list = {
                "transcode": if_route.user.userInfoGet,
                "content": {
                    "deviceType": deviceType,
                    "type":1,
                    "page": {
                        "pageNo": pageNumVal,
                        "pageSize": 5
                    }
                }
             };
            break;
        case "userInfoUserLogin": //用户登录
             list={
                "transcode": if_route.user.userInfoUserLogin,
                "content": {
                        "loginName": condition.name,
                        "password": condition.password
                }
             };
            break;
        case "userAction": //用户行为action
            if(condition.operType==3){//分享成功上传统计接口
                 list={
                       "transcode": if_route.user.userAction,
                       "content": {
                           "objId": parseInt(idVal),
                           "objType": parseInt(condition.objType),
                           "operType": condition.operType,
                           "sharingChannel":condition.sharingChannel,
                           "userId": condition.userId
                        }
                   };
                 
             }else{
                  list={
                       "transcode": if_route.user.userAction,
                       "content": {
                           "objId": parseInt(idVal),
                           "objType": parseInt(condition.objType),
                           "operType": condition.operType,
                           "userId": condition.userId,
                           "newsTypeId":isDefine(condition.newsTypeId)?condition.newsTypeId:""
                        }
                   };
             }
            break;
        case "userActionRemove": //用户行为action取消
              list={
                   "transcode": if_route.user.userActionRemove,
                   "content": {
                       "objId": parseInt(idVal),
                       "objType": parseInt(condition.objType),
                       "operType": condition.operType,
                       "userId": condition.userId,
                       "newsTypeId":isDefine(condition.newsTypeId)?condition.newsTypeId:""
                    }
               };
            break;
        case "commentInfoAdd": //用户行为action
                list={
                    "transcode": "commentInfo_add",
                    "content": {
                        "objId": parseInt(idVal),
                        "objType": parseInt(condition.objType),
                        "parentCommentId": condition.parentCommentId,
                        "commentedUserId": condition.commentedUserId,
                        "userId": condition.userId,
                        "content": condition.content
                    }
              };
            break;
        case "commentInfoGetList": //获取评论列表
            var objType=1;
            if(isDefine(condition)){//附加条件
                isDefine(condition.objType)?(objType=condition.objType):"";
                if(isDefine(condition.isFamous)){//名家评论
                    list={
                        "transcode": if_route.comment.commentInfoGetList,
                        "content": {
                            "objId": parseInt(idVal),
                            "objType":parseInt(objType),
                            "isFamous":condition.isFamous,
                            "userId":condition.userId,
                            "page": {
                                "pageNo": pageNumVal,
                                "pageSize": 10
                             }
                        }
                    };
                }else if(isDefine(condition.isHot)){ //热门评论
                    list={
                        "transcode": if_route.comment.commentInfoGetList,
                        "content": {
                            "objId": parseInt(idVal),
                            "objType":parseInt(objType),
                            "isHot":condition.isHot,
                            "userId":condition.userId,
                            "page": {
                                "pageNo": pageNumVal,
                                "pageSize": 10
                             }
                        }
                    };
                }else{ //最新评论
                    list={
                        "transcode": if_route.comment.commentInfoGetList,
                        "content": {
                            "objId": parseInt(idVal),
                            "objType":parseInt(objType),
                            "userId":condition.userId,
                            "page": {
                                "pageNo": pageNumVal,
                                "pageSize": 10
                             }
                        }
                    };
                }
            }
            break;
    }
    return list;
}

