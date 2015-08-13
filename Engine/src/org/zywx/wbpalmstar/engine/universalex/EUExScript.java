/*
 *  Copyright (C) 2014 The AppCan Open Source Project.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.

 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.

 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

package org.zywx.wbpalmstar.engine.universalex;

import android.os.Build;

public class EUExScript {

	public static String F_UEX_SCRIPT;
	public static final String F_UEX_SECURE;
	public static final String F_UEX_SCRIPT_SELF_FINISH;
	public static final String F_UEX_SCRIPT_TOP_FINISH;
	public static final String F_UEX_SCRIPT_BOTTOM_FINISH;
	public static final String F_UEX_SCRIPT_TOP_SHOW;
	public static final String F_UEX_SCRIPT_BOTTOM_SHOW;
	public static final String F_UEX_SCRIPT_APPPAUSE;
	public static final String F_UEX_SCRIPT_APPSTOP;
	public static final String F_UEX_SCRIPT_APPRESUME;
	public static final String F_UEX_SCRIPT_OC_LANDSCAPE;
	public static final String F_UEX_SCRIPT_OC_PORTRAIT;
	public static final String F_UEX_SCRIPT_ANIMATIONEND;
	public static final String F_UEX_SCRIPT_SET_WINDOW_FRAME_END;
	public static final String F_UEX_SCRIPT_SWIPE_RIGHT;
	public static final String F_UEX_SCRIPT_SWIPE_LEFT;
	public static final String F_UEX_SCRIPT_ENGINE_XML;
	public static final String JS_APPCAN_ONJSPARSE = "AppCan_onJsParse:";
	public static final String JS_APPCAN_ONJSPARSE_HEADER = "'"+JS_APPCAN_ONJSPARSE+"'+";
	
	static {
		F_UEX_SECURE = "window.uexSecure={ls:localStorage,open:function(p){try{this.t=true;this.o=uexCrypto.m(p)}catch(e){}},write:function(k,v){if(this.t){try{this.ls.setItem(this.o+k,uexCrypto.zy_rc4ex(v,this.o))}catch(e){}}},read:function(k){if(this.t){try{return uexCrypto.zy_rc4ex(this.ls.getItem(this.o+k),this.o)}catch(e){return null}}else{return null}},remove:function(k){if(this.t){try{this.ls.removeItem(this.o+k)}catch(e){}}},reencrypt:function(n){if(this.t){try{var np=uexCrypto.m(n);var ra=new Array();var ta=new Array();for(var m=0;m<this.ls.length;m++){ta[m]=this.ls.key(m)};for(var i=0;i<ta.length;i++){var tp=ta[i];if(tp.substring(0,this.o.length)==this.o){this.ls.setItem(np+tp.substring(this.o.length),uexCrypto.zy_rc4ex(uexCrypto.zy_rc4ex(this.ls.getItem(tp),this.o),np));this.ls.removeItem(tp)}};this.o=null;this.t=false}catch(e){this.o=null;this.t=false}}},close:function(){if(this.t){try{this.o=null;this.t=false}catch(e){}}},destory:function(){if(this.t){try{var ta=new Array();for(var m=0;m<this.ls.length;m++){ta[m]=this.ls.key(m)};for(var i=0;i<ta.length;i++){var tp=ta[i];if(tp.substring(0,this.o.length)==this.o){this.ls.removeItem(tp)}};this.o=null;this.t=false}catch(e){this.o=null;this.t=false}}}};uexCrypto={zt:function(key){var s=[],j=0,x,res='';for(var i=0;i<256;i++){s[i]=i};for(i=0;i<256;i++){j=(j+s[i]+key.charCodeAt(i%key.length))%256;x=s[i];s[i]=s[j];s[j]=x};return s},z4:function(str,s){var i=0;var j=0;var res='';var k=[];k=k.concat(s);for(var y=0;y<str.length;y++){i=(i+1)%256;j=(j+k[i])%256;x=k[i];k[i]=k[j];k[j]=x;var ztemp=str.charCodeAt(y)^k[(k[i]+k[j])%256];if(ztemp==0){res+=str.charAt(y)}else{res+=String.fromCharCode(ztemp)}};return res},zy_rc4ex:function(str,key){var s=this.zt(key);return this.z4(str,s)},m:function(zs){return hmd5(zs);var hs=0;function hmd5(s){return rx(r5(s8(s)))};function r5(s){return br(b5(rl(s),s.length*8))};function rx(it){try{hs}catch(e){hs=0};var hb=hs?'0123456789ABCDEF':'0123456789abcdef';var ot='';var x;for(var i=0;i<it.length;i++){x=it.charCodeAt(i);ot+=hb.charAt((x>>>4)&0x0F)+hb.charAt(x&0x0F)};return ot};function s8(it){var ot='';var i=-1;var x,y;while(++i<it.length){x=it.charCodeAt(i);y=i+1<it.length?it.charCodeAt(i+1):0;if(0xD800<=x&&x<=0xDBFF&&0xDC00<=y&&y<=0xDFFF){x=0x10000+((x&0x03FF)<<10)+(y&0x03FF);i++};if(x<=0x7F)ot+=String.fromCharCode(x);else if(x<=0x7FF)ot+=String.fromCharCode(0xC0|((x>>>6)&0x1F),0x80|(x&0x3F));else if(x<=0xFFFF)ot+=String.fromCharCode(0xE0|((x>>>12)&0x0F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));else if(x<=0x1FFFFF)ot+=String.fromCharCode(0xF0|((x>>>18)&0x07),0x80|((x>>>12)&0x3F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F))};return ot};function rl(it){var ot=Array(it.length>>2);for(var i=0;i<ot.length;i++)ot[i]=0;for(var i=0;i<it.length*8;i+=8)ot[i>>5]|=(it.charCodeAt(i/8)&0xFF)<<(i%32);return ot};function br(it){var ot='';for(var i=0;i<it.length*32;i+=8)ot+=String.fromCharCode((it[i>>5]>>>(i%32))&0xFF);return ot};function b5(x,len){x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=f(a,b,c,d,x[i+0],7,-680876936);d=f(d,a,b,c,x[i+1],12,-389564586);c=f(c,d,a,b,x[i+2],17,606105819);b=f(b,c,d,a,x[i+3],22,-1044525330);a=f(a,b,c,d,x[i+4],7,-176418897);d=f(d,a,b,c,x[i+5],12,1200080426);c=f(c,d,a,b,x[i+6],17,-1473231341);b=f(b,c,d,a,x[i+7],22,-45705983);a=f(a,b,c,d,x[i+8],7,1770035416);d=f(d,a,b,c,x[i+9],12,-1958414417);c=f(c,d,a,b,x[i+10],17,-42063);b=f(b,c,d,a,x[i+11],22,-1990404162);a=f(a,b,c,d,x[i+12],7,1804603682);d=f(d,a,b,c,x[i+13],12,-40341101);c=f(c,d,a,b,x[i+14],17,-1502002290);b=f(b,c,d,a,x[i+15],22,1236535329);a=g(a,b,c,d,x[i+1],5,-165796510);d=g(d,a,b,c,x[i+6],9,-1069501632);c=g(c,d,a,b,x[i+11],14,643717713);b=g(b,c,d,a,x[i+0],20,-373897302);a=g(a,b,c,d,x[i+5],5,-701558691);d=g(d,a,b,c,x[i+10],9,38016083);c=g(c,d,a,b,x[i+15],14,-660478335);b=g(b,c,d,a,x[i+4],20,-405537848);a=g(a,b,c,d,x[i+9],5,568446438);d=g(d,a,b,c,x[i+14],9,-1019803690);c=g(c,d,a,b,x[i+3],14,-187363961);b=g(b,c,d,a,x[i+8],20,1163531501);a=g(a,b,c,d,x[i+13],5,-1444681467);d=g(d,a,b,c,x[i+2],9,-51403784);c=g(c,d,a,b,x[i+7],14,1735328473);b=g(b,c,d,a,x[i+12],20,-1926607734);a=h(a,b,c,d,x[i+5],4,-378558);d=h(d,a,b,c,x[i+8],11,-2022574463);c=h(c,d,a,b,x[i+11],16,1839030562);b=h(b,c,d,a,x[i+14],23,-35309556);a=h(a,b,c,d,x[i+1],4,-1530992060);d=h(d,a,b,c,x[i+4],11,1272893353);c=h(c,d,a,b,x[i+7],16,-155497632);b=h(b,c,d,a,x[i+10],23,-1094730640);a=h(a,b,c,d,x[i+13],4,681279174);d=h(d,a,b,c,x[i+0],11,-358537222);c=h(c,d,a,b,x[i+3],16,-722521979);b=h(b,c,d,a,x[i+6],23,76029189);a=h(a,b,c,d,x[i+9],4,-640364487);d=h(d,a,b,c,x[i+12],11,-421815835);c=h(c,d,a,b,x[i+15],16,530742520);b=h(b,c,d,a,x[i+2],23,-995338651);a=ii(a,b,c,d,x[i+0],6,-198630844);d=ii(d,a,b,c,x[i+7],10,1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+5],21,-57434055);a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+3],10,-1894986606);c=ii(c,d,a,b,x[i+10],15,-1051523);b=ii(b,c,d,a,x[i+1],21,-2054922799);a=ii(a,b,c,d,x[i+8],6,1873313359);d=ii(d,a,b,c,x[i+15],10,-30611744);c=ii(c,d,a,b,x[i+6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21,1309151649);a=ii(a,b,c,d,x[i+4],6,-145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+2],15,718787259);b=ii(b,c,d,a,x[i+9],21,-343485551);a=add(a,olda);b=add(b,oldb);c=add(c,oldc);d=add(d,oldd)};return Array(a,b,c,d)};function mn(q,a,b,x,s,t){return add(bl(add(add(a,q),add(x,t)),s),b)};function f(a,b,c,d,x,s,t){return mn((b&c)|((~b)&d),a,b,x,s,t)};function g(a,b,c,d,x,s,t){return mn((b&d)|(c&(~d)),a,b,x,s,t)};function h(a,b,c,d,x,s,t){return mn(b^c^d,a,b,x,s,t)};function ii(a,b,c,d,x,s,t){return mn(c^(b|(~d)),a,b,x,s,t)};function add(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF)};function bl(num,cnt){return(num<<cnt)|(num>>>(32-cnt))}}};uexOFAuth={ls:window.localStorage,push:function(un,pwd,context){var key=uexCrypto.zy_rc4ex(un,pwd);var con=uexCrypto.zy_rc4ex(context,pwd);this.ls[un]=key;this.ls[key]=con;return 0},clear:function(un){try{delete this.ls[this.ls[un]];delete this.ls[un]}catch(e){};return 0},check:function(un,pwd){if(!this.ls[un]){return-1};var key=uexCrypto.zy_rc4ex(un,pwd);if(this.ls[un]==key){return uexCrypto.zy_rc4ex(this.ls[key],pwd)}else{return-1}}};";
		F_UEX_SCRIPT = "javascript:"
				+"function jo(){" +
					"var args_all = Array.prototype.slice.call(arguments, 0);"+
					"var uexName = args_all[0];"+
					"var method = args_all[1];"+
			        "var args = Array.prototype.slice.call(args_all[2], 0);"+
			        "var aTypes = [];"+
			        "var argStr = [];"+
			        "for (var i = 0;i < args.length;i++) {"+
			            "var arg = args[i];"+
			            "var type = typeof arg;"+
			            "aTypes[aTypes.length] = type;"+
						"if (arg instanceof Array || type=='number') {"+
							"argStr[i] = arg.toString();"+
						"} else {"+
							"argStr[i] = arg;"+
						"}"+
			       "}"+
			        "prompt("+JS_APPCAN_ONJSPARSE_HEADER+
			        	"JSON.stringify({uexName:uexName,method:method,args:argStr,types:aTypes}));"+
				"};"
				+ F_UEX_SECURE;
			
		F_UEX_SCRIPT_ENGINE_XML = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
							 +"<uexplugins>"
							 	+"<plugin build=\"0\" className=\"org.zywx.wbpalmstar.engine.universalex.EUExWidgetOne\" uexName=\"uexWidgetOne\" version=\"3.0\" >"
							        +"<method name=\"getId\" />"
							        +"<method name=\"getVersion\" />"
							        +"<method name=\"getPlatform\" />"
							        +"<method name=\"exit\" />"
							        +"<method name=\"getWidgetNumber\" />"
							        +"<method name=\"getWidgetInfo\" />"
							        +"<method name=\"getCurrentWidgetInfo\" />"
							        +"<method name=\"cleanCache\" />"
							        +"<method name=\"getMainWidgetId\" />"
							    +"</plugin>"
							    +"<plugin build=\"0\" className=\"org.zywx.wbpalmstar.engine.universalex.EUExWidget\" uexName=\"uexWidget\" version=\"3.0\" >"
							    	+"<method name=\"startWidget\" />"
							    	+"<method name=\"startWidgetWithPath\" />"
							    	+"<method name=\"finishWidget\" />"
							    	+"<method name=\"removeWidget\" />"
							    	+"<method name=\"getOpenerInfo\" />"
							    	+"<method name=\"setMySpaceInfo\" />"
							    	+"<method name=\"setPushNotifyCallback\" />"
							    	+"<method name=\"loadApp\" />"
							    	+"<method name=\"installApp\" />"
							    	+"<method name=\"checkUpdate\" />"
							    	+"<method name=\"setPushInfo\" />"
							    	+"<method name=\"setPushState\" />"
							    	+"<method name=\"getPushState\" />"
							    	+"<method name=\"startApp\" />"
							    	+"<method name=\"setSpaceEnable\" />"
							    	+"<method name=\"setLogServerIp\" />"
							    	+"<method name=\"delPushInfo\" />"
							    	+"<method name=\"isAppInstalled\" />"
							    	+"<method name=\"getPushInfo\" />"
							    +" </plugin>"
							    +"<plugin build=\"0\" className=\"org.zywx.wbpalmstar.engine.universalex.EUExWindow\" uexName=\"uexWindow\" version=\"3.0\" >"
							    	+"<method name=\"forward\" />"
							    	+"<method name=\"back\" />"
							    	+"<method name=\"pageBack\" />"
							    	+"<method name=\"pageForward\" />"
							    	+"<method name=\"showSoftKeyboard\" />"
							    	+"<method name=\"alert\" />"
							    	+"<method name=\"confirm\" />"
							    	+"<method name=\"prompt\" />"
							    	+"<method name=\"actionSheet\" />"
							    	+"<method name=\"setReportKey\" />"
							    	+"<method name=\"open\" />"
							    	+"<method name=\"setWindowFrame\" />"
							    	+"<method name=\"close\" />"
							    	+"<method name=\"openSlibing\" />"
							    	+"<method name=\"closeSlibing\" />"
							    	+"<method name=\"showSlibing\" />"
							    	+"<method name=\"evaluateScript\" />"
							    	+"<method name=\"windowForward\" />"
							    	+"<method name=\"windowBack\" />"
							    	+"<method name=\"setSwipeRate\" />"
							    	+"<method name=\"loadObfuscationData\" />"
							    	+"<method name=\"toast\" />"
							    	+"<method name=\"closeToast\" />"
							    	+"<method name=\"preOpenStart\" />"
							    	+"<method name=\"preOpenFinish\" />"
							    	+"<method name=\"openPopover\" />"
							    	+"<method name=\"openMultiPopover\" />"
							    	+"<method name=\"closeMultiPopover\" />"
							    	+"<method name=\"setSelectedPopOverInMultiWindow\" />"
							    	+"<method name=\"createProgressDialog\" />"
							    	+"<method name=\"destroyProgressDialog\" />"
							    	+"<method name=\"postGlobalNotification\" />"
							    	+"<method name=\"subscribeChannelNotification\" />"
							    	+"<method name=\"publishChannelNotification\" />"
							    	+"<method name=\"closeAboveWndByName\" />"
							    	+"<method name=\"setMultilPopoverFlippingEnbaled\" />"
							    	+"<method name=\"openAd\" />"
							    	+"<method name=\"closePopover\" />"
							    	+"<method name=\"setPopoverFrame\" />"
							    	+"<method name=\"evaluatePopoverScript\" />"
							    	+"<method name=\"setMultiPopoverFrame\" />"
							    	+"<method name=\"evaluateMultiPopoverScript\" />"
							    	+"<method name=\"getState\" />"
							    	+"<method name=\"statusBarNotification\" />"
							    	+"<method name=\"bringToFront\" />"
							    	+"<method name=\"sendToBack\" />"
							    	+"<method name=\"insertAbove\" />"
							    	+"<method name=\"insertBelow\" />"
							    	+"<method name=\"insertPopoverAbovePopover\" />"
							    	+"<method name=\"insertPopoverBelowPopover\" />"
							    	+"<method name=\"bringPopoverToFront\" />"
							    	+"<method name=\"sendPopoverToBack\" />"
							    	+"<method name=\"insertWindowAboveWindow\" />"
							    	+"<method name=\"insertWindowBelowWindow\" />"
							    	+"<method name=\"setWindowHidden\" />"
							    	+"<method name=\"setOrientation\" />"
							    	+"<method name=\"setWindowScrollbarVisible\" />"
							    	+"<method name=\"beginAnimition\" />"
							    	+"<method name=\"setAnimitionDelay\" />"
							    	+"<method name=\"setAnimitionDuration\" />"
							    	+"<method name=\"setAnimitionCurve\" />"
							    	+"<method name=\"setAnimitionRepeatCount\" />"
							    	+"<method name=\"setAnimitionAutoReverse\" />"
							    	+"<method name=\"makeTranslation\" />"
							    	+"<method name=\"makeScale\" />"
							    	+"<method name=\"makeRotate\" />"
							    	+"<method name=\"makeAlpha\" />"
							    	+"<method name=\"commitAnimition\" />"
							    	+"<method name=\"setSlidingWindow\" />"
							    	+"<method name=\"setSlidingWindowEnabled\" />"
							    	+"<method name=\"toggleSlidingWindow\" />"
							    	+"<method name=\"setBounce\" />"
							    	+"<method name=\"getBounce\" />"
							    	+"<method name=\"notifyBounceEvent\" />"
							    	+"<method name=\"showBounceView\" />"
							    	+"<method name=\"resetBounceView\" />"
							    	+"<method name=\"setBounceParams\" />"
							    	+"<method name=\"hiddenBounceView\" />"
							    	+"<method name=\"refresh\" />"
							    	+"<method name=\"reload\" />"
							    	+"<method name=\"reloadWidgetByAppId\" />"
							    	+"<method name=\"setAutorotateEnable\" />"
							    	+"<method name=\"getUrlQuery\" />"
							    +"</plugin>"
							    +"<plugin build=\"0\" className=\"org.zywx.wbpalmstar.engine.universalex.EUExAppCenter\" uexName=\"uexAppCenter\" version=\"3.0\" >"
							    	+"<method name=\"appCenterLoginResult\" />"
							    	+"<method name=\"downloadApp\" />"
							    	+"<method name=\"loginOut\" />"
							    	+"<method name=\"getSessionKey\" />"
							    +"</plugin>"
							+"</uexplugins>";
		
		F_UEX_SCRIPT_SELF_FINISH ="javascript:if(window.uexOnload){window.uexOnload(0);}";
		F_UEX_SCRIPT_TOP_FINISH = "javascript:if(window.uexOnload){window.uexOnload(1);}";
		F_UEX_SCRIPT_BOTTOM_FINISH = "javascript:if(window.uexOnload){window.uexOnload(2);}";
		F_UEX_SCRIPT_TOP_SHOW = "javascript:if(window.uexOnshow){window.uexOnshow(1);}";
		F_UEX_SCRIPT_BOTTOM_SHOW = "javascript:if(window.uexOnshow){window.uexOnshow(2);}";
		F_UEX_SCRIPT_OC_LANDSCAPE = "javascript:if(window.uexDevice && uexDevice.onOrientationChange){uexDevice.onOrientationChange(2);}";
		F_UEX_SCRIPT_OC_PORTRAIT = "javascript:if(window.uexDevice && uexDevice.onOrientationChange){uexDevice.onOrientationChange(1);}";
		F_UEX_SCRIPT_APPPAUSE = "javascript:if(uexWidget.onSuspend){uexWidget.onSuspend();}";
		F_UEX_SCRIPT_APPSTOP = "javascript:if(uexWidget.onTerminate){uexWidget.onTerminate();}";
		F_UEX_SCRIPT_APPRESUME = "javascript:if(typeof(uexWidget)!='undefined'&&uexWidget.onResume){uexWidget.onResume();}";
		F_UEX_SCRIPT_ANIMATIONEND = "javascript:if(uexWindow.onAnimationFinish){uexWindow.onAnimationFinish();}";
		F_UEX_SCRIPT_SET_WINDOW_FRAME_END = "javascript:if(uexWindow.onSetWindowFrameFinish){uexWindow.onSetWindowFrameFinish();}";
		F_UEX_SCRIPT_SWIPE_RIGHT = "javascript:if(uexWindow.onSwipeRight){uexWindow.onSwipeRight();}";
		F_UEX_SCRIPT_SWIPE_LEFT = "javascript:if(uexWindow.onSwipeLeft){uexWindow.onSwipeLeft();}";
	}
}
