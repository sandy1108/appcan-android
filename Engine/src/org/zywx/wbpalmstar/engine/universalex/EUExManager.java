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

import android.content.Context;
import android.os.Build;
import android.webkit.WebView;
import org.zywx.wbpalmstar.engine.EBrowserView;
import org.zywx.wbpalmstar.engine.ELinkedList;
import org.zywx.wbpalmstar.widgetone.WidgetOneApplication;

import java.lang.reflect.Constructor;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class EUExManager {

	private Context mContext;
	private ELinkedList<EUExBase> mThirdPlugins;
	private HashMap<String,EUExBase> pluginEUExBaseMap;

	public EUExManager(Context context) {
		mContext = context;
		mThirdPlugins = new ELinkedList<EUExBase>();
		pluginEUExBaseMap = new HashMap<String, EUExBase>();
	}

	public void addJavascriptInterface(EBrowserView brwView) {
		WidgetOneApplication app = (WidgetOneApplication)mContext.getApplicationContext();
		ThirdPluginMgr tpm = app.getThirdPlugins();
		Map<String, ThirdPluginObject> thirdPlugins = tpm.getPlugins();
		Set<Map.Entry<String, ThirdPluginObject>> pluginSet = thirdPlugins.entrySet();
		for (Map.Entry<String, ThirdPluginObject> entry : pluginSet) {
			String uName = entry.getKey();
			ThirdPluginObject scriptObj = entry.getValue();
			EUExBase objectIntance = null;
			try {
				
				if (scriptObj.isGlobal == true && scriptObj.pluginObj != null) {
					
					objectIntance = scriptObj.pluginObj;
					objectIntance.mBrwView = brwView;
					
				} else {
					Constructor<?> init = scriptObj.jobject;
					objectIntance = (EUExBase)init.newInstance(mContext, brwView);
				}
				
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (null != objectIntance) {
				objectIntance.setUexName(uName);
				
				if (scriptObj.isGlobal == true) {
					scriptObj.pluginObj = objectIntance;
				} else {
					mThirdPlugins.add(objectIntance);
					pluginEUExBaseMap.put(uName, objectIntance);
				}
			}
		}
	}

	public EUExBase getPluginEUExBase(String uexName) {
		return pluginEUExBaseMap.get(uexName);
	}
	
	public void notifyReset() {
		for (EUExBase uex : mThirdPlugins) {
			uex.reset();
		}
	}

	public void notifyDocChange() {
		for (EUExBase uex : mThirdPlugins) {
			uex.clean();
		}
	}
	
	public void notifyStop() {
		notifyDocChange();
		for (EUExBase uex : mThirdPlugins) {
			uex.stop();
		}
	}

	public void notifyDestroy(WebView view) {
		notifyDocChange();
		for(EUExBase uex : mThirdPlugins){
			if(Build.VERSION.SDK_INT >= 11){
				String uexName = uex.getUexName();
				view.removeJavascriptInterface(uexName);
			}
			uex.destroy();
		}
		mThirdPlugins.clear();
		mThirdPlugins = null;
		mContext = null;
	}
}
