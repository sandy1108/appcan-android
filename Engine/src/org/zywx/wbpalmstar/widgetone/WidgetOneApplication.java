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

package org.zywx.wbpalmstar.widgetone;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.res.AssetManager;
import android.content.res.Resources;
import android.os.Message;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.xmlpull.v1.XmlPullParser;
import org.zywx.wbpalmstar.base.BConstant;
import org.zywx.wbpalmstar.base.BDebug;
import org.zywx.wbpalmstar.base.BUtility;
import org.zywx.wbpalmstar.engine.EBrowserView;
import org.zywx.wbpalmstar.engine.ELinkedList;
import org.zywx.wbpalmstar.engine.EngineEventListener;
import org.zywx.wbpalmstar.engine.universalex.EUExUtil;
import org.zywx.wbpalmstar.engine.universalex.ThirdPluginMgr;
import org.zywx.wbpalmstar.engine.universalex.ThirdPluginObject;
import org.zywx.wbpalmstar.platform.push.PushEngineEventListener;
import org.zywx.wbpalmstar.widgetone.dataservice.WDataManager;
import org.zywx.wbpalmstar.widgetone.dataservice.WWidgetData;

import com.tencent.smtt.sdk.CookieManager;
import com.tencent.smtt.sdk.CookieSyncManager;
import com.tencent.smtt.sdk.QbSdk;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class WidgetOneApplication extends Application {

    private ThirdPluginMgr mThirdPluginMgr;
    private WDataManager mWDataManager;
    protected ECrashHandler mCrashReport;
    private ELinkedList<EngineEventListener> mListenerQueue;

    public WidgetOneApplication() {
        mListenerQueue = new ELinkedList<EngineEventListener>();
        PushEngineEventListener pushlistener = new PushEngineEventListener();
        mListenerQueue.add(pushlistener);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        EUExUtil.init(this);
        BDebug.init();
        initTencentX5();
        CookieSyncManager.createInstance(this);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().removeSessionCookie();
        CookieManager.getInstance().removeExpiredCookie();
        mCrashReport = ECrashHandler.getInstance(this);
        initPlugin();
        reflectionPluginMethod("onApplicationCreate");
        BConstant.app = this;
    }

    private final void initTencentX5() {
        int tbsVersion = 0;
        boolean noTencentX5 = false;
        try {
            String[] lists  = getAssets().list("widget");
            for (int i = 0; i < lists.length; i++) {
                if (lists[i].equalsIgnoreCase("notencentx5")) {
                    noTencentX5 = true;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        //初始化X5引擎SDK
        tbsVersion = QbSdk.getTbsVersion(getApplicationContext());
        if (noTencentX5 || (tbsVersion > 0 && tbsVersion < 30000)) {
            BDebug.i("AppCanTBS", "QbSdk.forceSysWebView()");
            QbSdk.forceSysWebView();
        }
        if(!QbSdk.isTbsCoreInited() && (tbsVersion == 0 || tbsVersion >= 30000) && !noTencentX5){
            final long timerCounter = System.currentTimeMillis();
            // 如果手机没有可以共享的X5内核，会先下载并安装，首次启动不会使用X5，再次启动才会使用X5；
            // 如果手机有可以共享的X5内核，但未安装，会先安装，首次启动不会使用X5，再次启动才会使用X5；
            // 如果手机有可以共享的X5内核，已经安装，首次启动会使用X5；
            QbSdk.initX5Environment(getApplicationContext(), new QbSdk.PreInitCallback(){

                @Override
                public void onViewInitFinished(boolean success) {
                    // TODO Auto-generated method stub
                    float deltaTime = (System.currentTimeMillis() - timerCounter);
                    BDebug.i("AppCanTBS", "success " + success + " x5初始化使用了" + deltaTime + "毫秒");
                }

                @Override
                public void onCoreInitFinished() {
                    // TODO Auto-generated method stub
                    BDebug.i("AppCanTBS", "onX5CoreInitFinished!!!!");
                }
            });
        }
    }

    private void reflectionPluginMethod(String method) {
        ThirdPluginMgr tpm = getThirdPlugins();
        Map<String, ThirdPluginObject> thirdPlugins = tpm.getPlugins();
        Set<Map.Entry<String, ThirdPluginObject>> pluginSet = thirdPlugins
                .entrySet();
        for (Map.Entry<String, ThirdPluginObject> entry : pluginSet) {
            try {
                String javaName = entry.getValue().jclass;
                Class c = Class.forName(javaName, true, getClassLoader());
                Method m = c.getMethod(method, new Class[]{Context.class});
                if (null != m) {
                    m.invoke(c, new Object[]{this});
                }
            } catch (Exception e) {
            }
        }
    }

    private final void initPlugin() {

        if (null == mThirdPluginMgr) {
            long time = System.currentTimeMillis();
            long cost = 0;
            mThirdPluginMgr = new ThirdPluginMgr(this);
            // 开始拷贝和加载旧版dex动态库插件
            mThirdPluginMgr.loadInitAllDexPluginClass();
            // 开始拷贝和加载动态库插件
            mThirdPluginMgr.loadInitAllDynamicPluginClass(mListenerQueue);
            EUExUtil.init(this);// TODO 暂时在这里初始化一下，要不然下面的资源获取不到
            // 开始加载打包内置的xml中的plugin文件
            XmlPullParser plugins = null;
            int id = EUExUtil.getResXmlID("plugin");
            if (id == 0) {
                throw new RuntimeException(
                        EUExUtil.getString("plugin_config_no_exist"));
            }
            plugins = getResources().getXml(id);
            mThirdPluginMgr.initClass(plugins, mListenerQueue, null);
            cost = System.currentTimeMillis() - time;
            BDebug.i("DL", "plugins loading total costs " + cost);
        }
    }

    public final void initApp(final Context ctx, final Message resultMsg) {

        new Thread("Appcan-WidgetOneInit") {
            public void run() {
                resultMsg.arg1 = 0;// default fail
                WDataManager wDataManager = new WDataManager(ctx);
                WWidgetData widgetData = wDataManager.getWidgetData();
                if (widgetData != null && widgetData.m_indexUrl != null) {
                    resultMsg.arg1 = 1;// success
                    resultMsg.obj = widgetData;
                    BUtility.initWidgetOneFile(ctx, widgetData.m_appId);
                }
                resultMsg.sendToTarget();
            }

            ;
        }.start();
    }

    public final WDataManager getWDataManager() {
        if (null == mWDataManager) {
            mWDataManager = new WDataManager(this);
        }
        return mWDataManager;
    }

    public final ThirdPluginMgr getThirdPlugins() {
        if (null == mThirdPluginMgr) {
            initPlugin();
        }
        return mThirdPluginMgr;
    }

    public final void exitApp() {
        stopAnalyticsAgent();
        CookieSyncManager.getInstance().stopSync();
    }

    private final void stopAnalyticsAgent() {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onAppStop();
        }
    }

    public final void widgetRegist(WWidgetData wgtData, Activity activity) {
        if (null == wgtData) {
            return;
        }
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onWidgetStart(EngineEventListener.WGT_TYPE_MAIN, wgtData,
                    activity);
        }
    }

    public final void widgetReport(WWidgetData wgtData, Activity activity) {
        if (null == wgtData) {
            return;
        }
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onWidgetStart(EngineEventListener.WGT_TYPE_SUB, wgtData,
                    activity);
        }
    }

    public final void disPatchWindowOpen(String beEndUrl, String beShowUrl,
                                         String[] beShowPopupUrls) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onWindowOpen(beEndUrl, beShowUrl, beShowPopupUrls);
        }
    }

    public final void disPatchWindowClose(String beEndUrl, String beShowUrl,
                                          String[] beEndPopupUrls, String[] beShowPopupUrls) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onWindowClose(beEndUrl, beShowUrl, beEndPopupUrls,
                    beShowPopupUrls);
        }
    }

    public final void disPatchWindowBack(String beEndUrl, String beShowUrl,
                                         String[] beEndPopupUrls, String[] beShowPopupUrls) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onWindowBack(beEndUrl, beShowUrl, beEndPopupUrls,
                    beShowPopupUrls);
        }
    }

    public final void disPatchWindowForward(String beEndUrl, String beShowUrl,
                                            String[] beEndPopupUrls, String[] beShowPopupUrls) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onWindowForward(beEndUrl, beShowUrl, beEndPopupUrls,
                    beShowPopupUrls);
        }
    }

    public final void disPatchPopupOpen(String curWindowUrl,
                                        String beShowPopupUrl) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onPopupOpen(curWindowUrl, beShowPopupUrl);
        }
    }

    public final void disPatchPopupClose(String beEndPopupUrl) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onPopupClose(beEndPopupUrl);
        }
    }

    public final void disPatchAppResume(String beEndUrl, String beShowUrl,
                                        String[] beShowPopupUrls) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onAppResume(beEndUrl, beShowUrl, beShowPopupUrls);
        }
    }

    public final void disPatchAppPause(String beEndUrl, String beShowUrl,
                                       String[] beEndPopupUrls) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onAppPause(beEndUrl, beShowUrl, beEndPopupUrls);
        }
    }

    public final void disPatchAppStart(String startUrl) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.onAppStart(startUrl);
        }
    }

    public final void setPushInfo(String userId, String userNick,
                                  Context mContext, EBrowserView mBrwView) {
        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();

        nameValuePairs.add(new BasicNameValuePair("userId", userId));
        nameValuePairs.add(new BasicNameValuePair("userNick", userNick));
        String id = WDataManager.F_SPACE_APPID
                .equals(WDataManager.m_rootWgt.m_appId) ? mBrwView
                .getCurrentWidget().m_appId : WDataManager.m_rootWgt.m_appId;
        nameValuePairs.add(new BasicNameValuePair("appId", id));
        nameValuePairs.add(new BasicNameValuePair("platform", "1"));
        nameValuePairs.add(new BasicNameValuePair("pushType", "mqtt"));
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.setPushInfo(mContext, nameValuePairs);
        }
    }

    public final void delPushInfo(String userId, String userNick,
                                  Context mContext, EBrowserView mBrwView) {
        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.delPushInfo(mContext, nameValuePairs);
        }
    }

    public final void setPushState(int state) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.setPushState(this, state);
        }
    }

    public final void getPushInfo(String userInfo, String occuredAt) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.getPushInfo(this, userInfo, occuredAt);
        }
    }

    public final void deviceBind(String userId, String userNick, Context mContext, EBrowserView mBrwView) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.deviceBind(userId, userNick, mContext);
        }
    }

    public final void deviceUnBind(Context mContext, EBrowserView mBrwView) {
        for (EngineEventListener Listener : mListenerQueue) {
            Listener.deviceUnBind(mContext);
        }
    }

    @Override
    public AssetManager getAssets() {
        // TODO Auto-generated method stub
        AssetManager assetManager = mThirdPluginMgr == null ? super.getAssets()
                : mThirdPluginMgr.getAssets();
        return assetManager == null ? super.getAssets() : assetManager;
    }

    @Override
    public Resources getResources() {
        // TODO Auto-generated method stub
        Resources resources = mThirdPluginMgr == null ? super.getResources()
                : mThirdPluginMgr.getResources();
        return resources == null ? super.getResources() : resources;
    }

    @Override
    public ClassLoader getClassLoader() {
        // TODO Auto-generated method stub
        ClassLoader classLoader = mThirdPluginMgr == null ? super
                .getClassLoader() : mThirdPluginMgr.getClassLoader();
        return classLoader == null ? super.getClassLoader() : classLoader;
    }
}
