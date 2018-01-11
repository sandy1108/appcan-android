//var ip = 'http://192.168.1.174:8001/mobileClaims/'
//var ip = 'http://10.2.1.64:8001/mobileClaims/'
var ip ="http://10.2.20.211:8001/mobileClaims/"
var ftpIP="http://10.10.11.29:8080/fileSrv/File/FileUpload"
    /*
     * @Author: Administrator
     * @Date:   2015-09-23 15:40:48
     * @Last Modified by:   Administrator
     * @Last Modified time: 2015-09-24 10:52:05
     */
    /*--------------获取DOM节点------------------*/
function $$(id) {
    return document.getElementById(id);
}

/*--------------清空对应输入框------------------*/
function clearInput(id) {
    document.getElementById(id).value = "";
}

/*----------------验证密码------------------*/
function checkPassword(id) {
    var newPw = $$(id).value;
    var flag = false;
    //密码长度不能小于8位，大于15位，且必须由数字、大写字母、小写字母三种类型组成，密码至少含有五个不同的字符组成
    var regPW = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,15}$/;
    if (!regPW.test(newPw)) {
        appcan.window.alert({
            title: '提示',
            content: '密码必须由大小写字母和数字组成！',
            buttons: '确定'
        });
        return flag;
    }
    if (newPw.split('').sort().join('').replace(/(.)\1+/g, '$1').length < 5) {
        appcan.window.alert({
            title: '提示',
            content: '密码至少包含5个不同字符！',
            buttons: '确定'
        });
        return flag;
    }
    flag = true;
    return flag;
}

/*-----------------验证名字----------------*/
function checkName(id) {
    var name = $$(id).value;
    if (isEmpty(name)) {
        alert("姓名不能为空！");
        return;
    }
    if (!lengthCheck(4, 120, name)) {
        alert("姓名长度不能小于4个字符或大于120字符！");
        return;
    }
    if (hasNum(name)) {
        alert('不能含有数字!');
        return;
    }
    if (hasDoubleSymbol(name)) {
        alert('不能含有连续的符号!');
        return;
    }
}
var isAndroid = (window.navigator.userAgent.indexOf('Android') >= 0) ? true : false;
/*----------------验证搜索头部-----------------*/
function checkTitle() {
    var caseId = $$("caseId").value;
    var regCaseId = /^\d{7,}$/;
    var flag = false;
    // 长度至少6个字符，且纯数字
    if (caseId != "" && regCaseId.test(caseId)) {
        appcan.window.alert({
            title: '提示',
            content: '赔案号不能超过6位纯数字！',
            buttons: '确定'
        });
        return flag;
    }
    //姓名长度不能小于4个字符，大于120字符，不能含有数字，不能含有连续的符号，不能全部为符号
    var name = $$("name").value;
    if (name != "" && !lengthCheck(4, 120, name)) {
        appcan.window.alert({
            title: '提示',
            content: '姓名长度不能小于4个字符或大于120字符！',
            buttons: '确定'
        });
        return flag;
    }
    if (name != "" && hasNum(name)) {
        appcan.window.alert({
            title: '提示',
            content: '不能含有数字！',
            buttons: '确定'
        });
        return flag;
    }
    if (name != "" && hasDoubleSymbol(name)) {
        appcan.window.alert({
            title: '提示',
            content: '不能含有连续的符号！',
            buttons: '确定'
        });
        return flag;
    }
    //证件号长度至少6个字符
    var numId = $$("numId").value;
    var regNumId = /^.{6,}$/;
    if (numId != "" && !regNumId.test(numId)) {
        appcan.window.alert({
            title: '提示',
            content: '至少输入6个字符的证件号！',
            buttons: '确定'
        });
        return flag;
    }

    //移动电话应为11位数字，移动电话不能使用13、14、15、17、18以外开头的数字
    var phone = $$("phone").value;
    var regPhone = /^(13|14|15|17|18|19)\d{9}$/;
    if (phone != "" && !regPhone.test(phone)) {
        appcan.window.alert({
            title: '提示',
            content: '请输入正确手机号！',
            buttons: '确定'
        });
        return flag;
    }
    //移动电话不能包含9位连续数字或连续9位重复数字
    if (phone != "" && phone.substr(phone.length - 9).split('').sort().join('').replace(/(.)\1+/g, '$1').length < 2) {
        appcan.window.alert({
            title: '提示',
            content: '请输入正确手机号,连续重复不能超过9位！',
            buttons: '确定'
        });
        return flag;
    }
    flag = true;
    return flag;
}

/*-----------------------------搜索日期的校验--------------------------------------*/
function compareDate() {
    try{
        startDay = startDay+'';
        endDay = endDay+'';
        if(startDay.length==1){
            startDay = '0'+startDay;
        }
        //alert(startDay.length)
        if(endDay.length==1){
            endDay = '0'+endDay;
        }
        var startSum = startMonth + ''+startDay;
        startSum = parseInt(startSum)
        var endSum = endMonth + ''+ endDay;
        endSum = parseInt(endSum)
    }catch(e){
        
    }
    if ($$("startTime").value != "" && $$("endTime").value != "") {
        if (startYear == endYear) {
            // alert(endSum+'=='+startSum)
            if ((endSum - startSum) < 0) {
                appcan.window.alert("提示", "开始时间不能晚于结束时间！");
                return false;
            } else if ((endSum - startSum) > 100) {
                appcan.window.alert("提示", "检索时间范围不能超过一个月！");
                return false;
            }
        } else if (startYear > endYear) {
            appcan.window.alert("提示", "开始时间不能晚于结束时间！");
            return false;
        } else {
            if (startMonth == 12 && endMonth == 1) {
                if (startDay < endDay) {
                    appcan.window.alert("提示", "检索时间范围不能超过一个月！");
                    return false;
                }
            } else {
                appcan.window.alert("提示", "检索时间范围不能超过一个月！");
                return false;
            }
        }
        if(parseInt(startYear)>parseInt(str1)){
            appcan.window.alert("提示", "起止时间不能超过今天！");
            return false;
        }else if(parseInt(startMonth)>parseInt(str2)){
            appcan.window.alert("提示", "起止时间不能超过今天！");
            return false;
        }else if(parseInt(startDay)>parseInt(str3)&&parseInt(startMonth)==parseInt(str2)){
            appcan.window.alert("提示", "起止时间不能超过今天！");
            return false;
        }
        if(parseInt(endYear)>parseInt(str1)){
            appcan.window.alert("提示", "起止时间不能超过今天！");
            return false;
        }else if(parseInt(endMonth)>parseInt(str2)){
            appcan.window.alert("提示", "起止时间不能超过今天！");
            return false;
        }else if(parseInt(endDay)>parseInt(str3)&&parseInt(endMonth)==parseInt(str2)){
            appcan.window.alert("提示", "起止时间不能超过今天！");
            return false;
        }
    } else if (($$("startTime").value != "" && $$("endTime").value == "") || ($$("startTime").value == "" && $$("endTime").value != "")) {
        appcan.window.alert("提示", "检索时间范围不完整！");
        return false;
    }

    return true;
}

/**************账单录入页js功能实现*****************/
//输入框右侧删除功能
function deleteThis(id) {
    document.getElementById(id).value = "";
}

//输入框失焦后保留两位小数
function checkmoney(id) {
    document.getElementById(id).value = parseFloat(document.getElementById(id).value).toFixed(2);
    if (isNaN(document.getElementById(id).value)) {
        document.getElementById(id).value = 0;
    }
    getAllMoney();
}

//重症天数必须是整型数据
function checkdays(id) {
    document.getElementById(id).value = parseInt(document.getElementById(id).value);
    if (isNaN(document.getElementById(id).value)) {
        document.getElementById(id).value = 0;
    }
}

//住院天数加“1”
function addone(id) {
    document.getElementById(id).value++;
}

//住院天数减“1”
function removeone(id) {
    document.getElementById(id).value--;
}

//住院天数不小于重症天数
function checkDay(id1, id2) {
    document.getElementById(id1).value = document.getElementById(id2).value;
}

//删除账单及其账单内容
function deleDiv(id1, id2) {
    document.getElementById(id1).style.cssText = "display:none !important";
    document.getElementById(id2).style.cssText = "display:none !important";
}

/*
 * @Author: Administrator
 * @Date:   2015-09-23 15:40:48
 * @Last Modified by:   Administrator
 * @Last Modified time: 2015-09-23 19:54:17
 */
/*为空*/
function isEmpty(str) {
    if (str == '' || str == null || str.length == 0) {
        return true;
    }
    return false;
}

/*长度检验*/
String.prototype.getBytes = function() {
    var cArr = this.match(/[^x00-xff]/ig);
    return this.length + (cArr == null ? 0 : cArr.length);
}

function lengthCheck(a, b, str) {
    if (str.getBytes() < a || str.getBytes() > b) {
        return false;
    }
    return true;
}

/*含数字*/
function hasNum(str) {
    reg = /[0-9]/g;
    return reg.test(str)
}

/*含有连续的符号*/
function hasDoubleSymbol(str) {
    reg = /[^a-zA-Z0-9\u4e00-\u9fa5]{2}/;
    return reg.test(str)

}

/*含有符号*/
function hasSymbol(str) {
    var result = str.match(/[^a-zA-Z0-9\u4e00-\u9fa5]/);

    return !(result == null);

}

//是字母
function isEng(str) {
    reg = /^[A-Za-z]+$/;
    return reg.test(str)

}

//通讯地址必须包含市、州或县或区、乡或镇或街或路或道、村或组或号或室，港澳台除外
function checkAddress(str) {
    var result = str.match(/市|州|县|区|乡|镇|街|路|道|村|组|号|室|港|澳|台/);
    if (result == null)
        return true;
    return false;
}

function checkMobilephone(phone) {
    if (phone == '' || phone == null) {
        appcan.window.alert({
            title: '提示',
            content: '请输入手机号！',
            buttons: '确定'
        });
        return false;
    }
    //移动电话应为11位数字，移动电话不能使用13、14、15、17、18以外开头的数字
    var regPhone = /^(13|14|15|17|18|19)\d{9}$/;
    if (phone != "" && !regPhone.test(phone)) {
        appcan.window.alert({
            title: '提示',
            content: '请输入正确手机号！',
            buttons: '确定'
        });
        return false;
    }
    //移动电话不能包含9位连续数字或连续9位重复数字
    if (phone != "" && phone.substr(phone.length - 9).split('').sort().join('').replace(/(.)\1+/g, '$1').length < 2) {
        appcan.window.alert({
            title: '提示',
            content: '请输入正确手机号,连续重复不能超过9位！',
            buttons: '确定'
        });
        return false;
    }
    return true;
}

function getNowDay(){
    var d = new Date();
    var str1 = d.getFullYear()
    var str2 = d.getMonth() + 1;
    var str3 = d.getDate();
    if(str2<10){
        str2 = '0'+str2;
    }
    return str1+'-'+str2+'-'+str3;
}
function getNowTime(){
    var d = new Date();
    var str1 = d.getHours();
    var str2 = d.getMinutes();
    var str3 = d.getSeconds();
    str1 = parseInt(str1)
    str2 = parseInt(str2)
    str3 = parseInt(str3)
    if(str1<10){
        str1 = '0'+str1;
    }
    if(str2<10){
        str2 = '0'+str2;
    }
    if(str3<10){
        str3 = '0'+str3;
    }
    return str1+':'+str2+':'+str3;
}
var sexArr = ['男','女','不详'];
var IDTypeArr = ['身份证','护照','军官证','驾照','出生证明','户口簿','港澳台胞证','','其他','士兵证']
