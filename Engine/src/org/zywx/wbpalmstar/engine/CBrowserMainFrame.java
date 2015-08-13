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

package org.zywx.wbpalmstar.engine;


import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;
import org.zywx.wbpalmstar.engine.universalex.EUExBase;
import org.zywx.wbpalmstar.engine.universalex.EUExManager;
import org.zywx.wbpalmstar.engine.universalex.EUExScript;
import org.zywx.wbpalmstar.engine.universalex.ThirdPluginMgr;
import org.zywx.wbpalmstar.engine.universalex.ThirdPluginObject;
import org.zywx.wbpalmstar.widgetone.WidgetOneApplication;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.content.Intent;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.EditText;

public class CBrowserMainFrame extends WebChromeClient {

    public Context mContext;
    private boolean mIsInjectedJS;

	/**
	 *android version < 2.1 use 
	 */
	public CBrowserMainFrame(Context context){
        this.mContext=context;
	}

	@Override
	public void onProgressChanged(WebView view, int newProgress) {
		if (view != null) {

	        //为什么要在这里注入JS
	        //1 OnPageStarted中注入有可能全局注入不成功，导致页面脚本上所有接口任何时候都不可用
	        //2 OnPageFinished中注入，虽然最后都会全局注入成功，但是完成时间有可能太晚，当页面在初始化调用接口函数时会等待时间过长
	        //3 在进度变化时注入，刚好可以在上面两个问题中得到一个折中处理
	        //为什么是进度大于25%才进行注入，因为从测试看来只有进度大于这个数字页面才真正得到框架刷新加载，保证100%注入成功
			if (newProgress <= 25) {
				mIsInjectedJS = false;
			} else if (!mIsInjectedJS) {
				view.loadUrl(EUExScript.F_UEX_SCRIPT);
				Log.i("jiangpingping","CBrowserMainFrame onProgressChanged F_UEX_SCRIPT "+EUExScript.F_UEX_SCRIPT);
				mIsInjectedJS = true;
			}
	        
			EBrowserView target = (EBrowserView)view;
			EBrowserWindow bWindow = target.getBrowserWindow();
			if (bWindow != null) {
				bWindow.setGlobalProgress(newProgress);
				if (100 == newProgress) {
					bWindow.hiddenProgress();
				}
			}
		}
	}

	@Override
	public boolean onJsAlert(WebView view, String url, String message, final JsResult result) {
		if (!((EBrowserActivity)view.getContext()).isVisable()){
			result.confirm();
		}
		AlertDialog.Builder dia = new AlertDialog.Builder(view.getContext());
		dia.setTitle("提示消息");
		dia.setMessage(message);
		dia.setCancelable(false);
		dia.setPositiveButton("确定", new OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				result.confirm();
			}
		});
		dia.create();
		dia.show();
		return true;
	}

	@Override
	public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
		if (!((EBrowserActivity)view.getContext()).isVisable()){
			result.cancel();
			return true;
		} 
		AlertDialog.Builder dia = new AlertDialog.Builder(view.getContext());
		 dia.setMessage(message);
		 dia.setTitle("确认消息");
		 dia.setCancelable(false);
		 dia.setPositiveButton("确定", 
         	new DialogInterface.OnClickListener() {
             	public void onClick(DialogInterface dialog, int which) {
             		result.confirm();
                 }
             });
		 dia.setNegativeButton("取消", 
                 	new DialogInterface.OnClickListener() {
             	public void onClick(DialogInterface dialog, int which) {
             		result.cancel();
                 }
             });
		 dia.create();
		 dia.show();
         return true;
	}

	@Override
	public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, final JsPromptResult result) {
		if (message != null
				&& message.startsWith(EUExScript.JS_APPCAN_ONJSPARSE)) {
			result.cancel();
			handleUexFunction(view,
					message.substring(EUExScript.JS_APPCAN_ONJSPARSE.length()));
		} else {
			if (!((EBrowserActivity) view.getContext()).isVisable()) {
				result.cancel();
				return true;
			}
			AlertDialog.Builder dia = new AlertDialog.Builder(view.getContext());
			dia.setTitle(null);
			dia.setMessage(message);
			final EditText input = new EditText(view.getContext());
			if (defaultValue != null) {
				input.setText(defaultValue);
			}
			input.setSelectAllOnFocus(true);
			dia.setView(input);
			dia.setCancelable(false);
			dia.setPositiveButton("确定", new DialogInterface.OnClickListener() {
				public void onClick(DialogInterface dialog, int which) {
					result.confirm(input.getText().toString());
				}
			});
			dia.setNegativeButton("取消", new DialogInterface.OnClickListener() {
				public void onClick(DialogInterface dialog, int which) {
					result.cancel();
				}
			});
			dia.create();
			dia.show();
		}
		return true;
	}

	private void handleUexFunction(WebView view, String parseStr) {
		Log.i("jiangpingping", "CBrowserMainFrame handleUexFunction parseStr "
				+ parseStr);
		try {
			if (!(view instanceof EBrowserView)) {
				return;
			}
			JSONObject json = new JSONObject(parseStr);
			String uexName = json.optString("uexName");
			String method = json.optString("method");
			JSONArray jsonArray = json.getJSONArray("args");
			JSONArray typesArray = json.getJSONArray("types");
			int length = jsonArray.length();
			String[] args = new String[length];
			for (int i = 0; i < length; i++) {
				String type = typesArray.getString(i);
				String arg = jsonArray.getString(i);
				if ("undefined".equals(type) && "null".equals(arg)) {
					args[i] = null;
				} else {
					args[i] = arg;
				}
			}

			WidgetOneApplication app = (WidgetOneApplication) mContext
					.getApplicationContext();
			ThirdPluginMgr tpm = app.getThirdPlugins();
			Map<String, ThirdPluginObject> enginePlugins = tpm
					.getPlugins();
			ThirdPluginObject object = enginePlugins.get(uexName);
			if (object != null && !TextUtils.isEmpty(method)
					&& object.jmethod.containsKey(method)) {
				EBrowserView browserView = (EBrowserView) view;
				EUExManager uexManager = browserView.getEUExManager();
				if (uexManager != null) {
					EUExBase uexBase = uexManager.getPluginEUExBase(uexName);
					if (uexBase != null) {
						if (uexBase.termination()) {
							return;
						}
						Class<?> c = Class.forName(object.jclass);
						Method m = c.getMethod(method,
								new Class[] { String[].class });
						if (null != m) {
							m.invoke(uexBase, new Object[] { args });
							Log.i("jiangpingping",
									"CBrowserMainFrame handleUexFunction invoke");
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
    // For Android 3.0-
    public void openFileChooser(ValueCallback<Uri> uploadMsg) {
        ((EBrowserActivity)mContext).setmUploadMessage(uploadMsg);
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("image/*");
        ((EBrowserActivity)mContext).startActivityForResult(Intent.createChooser(i, "File Chooser"),
                EBrowserActivity.FILECHOOSER_RESULTCODE);
    }

    // For Android 3.0+
    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
        ((EBrowserActivity)mContext).setmUploadMessage(uploadMsg);
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("*/*");
        ((EBrowserActivity)mContext).startActivityForResult(Intent.createChooser(i, "File Browser"),
                EBrowserActivity.FILECHOOSER_RESULTCODE);
    }

    // For Android 4.1
    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
        ((EBrowserActivity)mContext).setmUploadMessage(uploadMsg);
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("image/*");
        ((EBrowserActivity)mContext).startActivityForResult(Intent.createChooser(i, "File Chooser"),
                EBrowserActivity.FILECHOOSER_RESULTCODE);
    }

}
