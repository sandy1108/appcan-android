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

package org.zywx.wbpalmstar.widgetone.dataservice;

import android.content.ContentValues;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Color;
import android.support.annotation.Keep;
import android.text.TextUtils;
import android.util.Xml;

import org.xmlpull.v1.XmlPullParser;
import org.zywx.wbpalmstar.acedes.ACEDes;
import org.zywx.wbpalmstar.base.BDebug;
import org.zywx.wbpalmstar.base.BUtility;
import org.zywx.wbpalmstar.base.ResoureFinder;
import org.zywx.wbpalmstar.base.vo.WidgetConfigVO;
import org.zywx.wbpalmstar.base.zip.CnZipInputStream;
import org.zywx.wbpalmstar.base.zip.ZipEntry;
import org.zywx.wbpalmstar.engine.EBrowserView;
import org.zywx.wbpalmstar.engine.ESystemInfo;
import org.zywx.wbpalmstar.engine.universalex.EUExUtil;
import org.zywx.wbpalmstar.platform.certificates.Http;
import org.zywx.wbpalmstar.platform.encryption.PEncryption;
import org.zywx.wbpalmstar.platform.myspace.CommonUtility;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipException;

@Keep
public class WDataManager {
    private static Context m_context;
    // private static WDataBaseAdapter1 m_mdba = null;
    private final static String WIDGET_REG_KEY_1 = "hd5lg[fq,xcnza!df/cv@m";
    private final static String WIDGET_REG_KEY_2 = "ci8df|ape\"ew&d0(9Pdxm";
    private final static String WIDGET_REG_KEY_3 = "sfxnv/.*3dkei#e^d5d;fd";
    private final static String WIDGET_REG_KEY_4 = "ypei$dow9l|df?zx>md<eg";

    public final static String F_SPACE_APPID = "9999999";

    public static final String F_ROOT_WIDGET_PATH = "widget/";
    public static final String F_SPACE_WIDGET_PATH = "space/";
    public String m_rootWidgetConfigPath = F_ROOT_WIDGET_PATH + "config.xml";
    public String m_spaceWidgetConfigPath = F_SPACE_WIDGET_PATH + "config.xml";
    // public boolean m_resPath = false;
    public static SharedPreferences m_preferences;
    public static String m_widgetOneConfig = "widgetOneConfig";
    private static String m_widgetOneId = "widgetOneId";
    // private static String m_rootWidgetVer = "rootWidgetVer";
    private static String m_rootWidgetDBId = "rootwidgetdbid";
    // private static String m_spaceWidgetVer = "spaceWidgetVer";
    private static String m_spaceWidgetDBId = "spaceWidgetDBId";
    // private String m_widgetlistPath = "/widgetone/widgetapp";

    @Keep
    public static WWidgetData sRootWgt = null;

    // public static String m_wgtPath =null;
    public static String m_wgtsPath = null;
    public static String m_sboxPath = null;
    public static String m_exterboxPath = null;
    // public static Map<String, WWidgetData> widgetMap = null;
    public static List<String> appIDList = null;
    public static boolean isUpdateWidget = false;
    public static boolean isCopyAssetsFinish = false;
    public static String m_copyAssetsFinish = "copyAssetsFinish";
    public static boolean isWidgetOneSBox = false;
    // private int m_count = 0;

    /**
     * 用来记录全局控制加密的开关。-1：未配置；0：全局不加密；1：全局加密
     */
    private static int globalObfuscationConfigInMainWidget = -1;

    public WDataManager(Context context) {
        m_context = context;
        // m_mdba = new WDataBaseAdapter1(m_context);
        // WDBAdapter db = new WDBAdapter(m_context);
        // db.open();
        // db.close();
        m_preferences = m_context.getSharedPreferences(m_widgetOneConfig,
                Context.MODE_PRIVATE);

        m_sboxPath = BUtility.getSBoxRootPath(context);
        m_exterboxPath = BUtility.getExterBoxPath(context);
    }

    public static WWidgetData getLoginListWgt(String mainAppId,
                                              String sessionKey) {
        WWidgetData wgt = new WWidgetData();
        wgt.m_appId = "9999998";// 9999998 11007818
        wgt.m_ver = "00.00.0000";
        wgt.m_updateurl = "http://discuz.3g2win.com/source/plugin/zywx/rpc/widget_upgrade.php";
        wgt.m_indexUrl = CommonUtility.URL_OPEN_LOGIN_URL + "txSessionKey="
                + sessionKey + "&appId=" + mainAppId;
        wgt.m_orientation = 1;
        wgt.m_description = "8";
        wgt.m_wgtType = 1;
        wgt.m_widgetPath = sRootWgt.m_widgetPath + wgt.m_appId + "/";
        return wgt;
    }

    public static WWidgetData getMoreWgt() {
        WWidgetData wgt = new WWidgetData();
        wgt.m_appId = "9999997";
        wgt.m_ver = "00.00.0000";
        wgt.m_widgetName = EUExUtil.getString("more");
        wgt.m_updateurl = "http://discuz.3g2win.com/source/plugin/zywx/rpc/widget_upgrade.php";
        wgt.m_indexUrl = CommonUtility.URL_MORE_WIDGET_URL
                + "platFormId=1&pageindex=1";
        wgt.m_orientation = 1;
        wgt.m_description = "8";
        wgt.m_wgtType = 1;
        wgt.m_widgetPath = sRootWgt.m_widgetPath + wgt.m_appId + "/";
        return wgt;
    }

    public static int getGlobalObfuscationConfigInMainWidget() {
        BDebug.d("getGlobalObfuscationConfigInMainWidget: " + globalObfuscationConfigInMainWidget);
        return globalObfuscationConfigInMainWidget;
    }

    public static void setGlobalObfuscationConfigInMainWidget(int globalObfuscationConfigInMainWidget) {
        WDataManager.globalObfuscationConfigInMainWidget = globalObfuscationConfigInMainWidget;
    }

    /**
     * WidgetOne 注册
     */
    // public void widgetOneRegist(WWidgetOneData widgetOneData) {
    //
    // String widgetOneId = getWidgetOneId();
    // if (widgetOneId == null || widgetOneId.length() == 0) {
    // // m_mdba.open();
    // try {
    // TelephonyManager telephonyManager = (TelephonyManager) m_context
    // .getSystemService(Context.TELEPHONY_SERVICE);
    // widgetOneId = WHttpManager.widgetOneRegist(
    // widgetOneData.m_widgetOneVer,
    // widgetOneData.m_screenSize,
    // telephonyManager.getDeviceId());
    // if (widgetOneId != null) {
    //
    // Editor editor = m_preferences.edit();
    // editor.putString(m_widgetOneId, widgetOneId);
    // editor.commit();
    //
    // m_count = 0;
    // } else if (m_count < 3) {
    // m_count++;
    // widgetOneRegist(widgetOneData);
    //
    // }
    //
    // } catch (Exception e) {
    // e.printStackTrace();
    // }
    //
    // }
    //
    // }

    /**
     * Widget 注册
     *
     */
    // public void widgetRegist(WWidgetData widgetData) {
    // try {
    // if (widgetData.m_widgetOneId == null
    // || widgetData.m_widgetOneId.length() == 0) {
    // widgetData.m_widgetOneId = getWidgetOneId();
    // }
    // if (widgetData.m_widgetOneId == null
    // || widgetData.m_widgetOneId.length() == 0) {
    // return;
    // }
    // WDBAdapter db = new WDBAdapter(m_context);
    // db.open();
    // widgetData.m_md5Code = getMD5Code(widgetData.m_imei,
    // widgetData.m_widgetOneId, widgetData.m_appId,
    // widgetData.m_ver, widgetData.m_channelCode);
    // String widgetId = WHttpManager.widgetRegist(
    // widgetData.m_widgetOneId, widgetData.m_appId,
    // widgetData.m_ver, widgetData.m_channelCode,
    // widgetData.m_imei, widgetData.m_md5Code);
    // if (widgetId != null) {
    // if ("-1".equals(widgetId)) {
    // return;
    // }
    // String sql = "update " + WDBAdapter.F_WIDGET_TABLE_NAME
    // + " set " + WDBAdapter.F_COLUMN_WIDGETID + " = '"
    // + widgetId + "', " + WDBAdapter.F_COLUMN_WIDGETONEID
    // + " = '" + widgetData.m_widgetOneId + "', "
    // + WDBAdapter.F_COLUMN_MD5CODE + " = '"
    // + widgetData.m_md5Code + "' where "
    // + WDBAdapter.F_COLUMN_ID + " = " + widgetData.m_id;
    // db.update(sql);
    // widgetData.m_widgetId = widgetId;
    //
    // m_count = 0;
    // } else if (m_count < 3) {
    // m_count++;
    // widgetRegist(widgetData);
    //
    // }
    //
    // db.close();
    // } catch (Exception e) {
    // // TODO: handle exception
    // e.printStackTrace();
    // }
    //
    // }

    /**
     * 检查注册
     *
     * @param ver
     */
    public ReData ChekeUpdate(Context context, String udateurl, String appId,
                              String ver) {
        return WHttpManager.getUpdate(context, udateurl, appId, ver);
    }

    /**
     * Widget 上报
     * <p/>
     * 应用程序标识
     */
    // public void widgetReport(WWidgetData widgetData) {
    // if (widgetData.m_widgetId == null
    // || widgetData.m_widgetId.length() == 0) {
    // return;
    // }
    // ReData reData = WHttpManager.widgetReport(widgetData.m_widgetId);
    // if (reData != null && widgetData.m_wgtType == 0) {
    // int spaceStatus = reData.mySpaceMoreApp | reData.mySpaceStatus;
    // if (widgetData.m_spaceStatus != spaceStatus) {
    // sRootWgt.m_spaceStatus = spaceStatus;
    //
    // String upSql = "UPDATE " + WDBAdapter.F_WIDGET_TABLE_NAME
    // + " SET " + WDBAdapter.F_COLUMN_SHOWSPACE + " = "
    // + spaceStatus + " WHERE " + WDBAdapter.F_COLUMN_APPID
    // + " = " + widgetData.m_appId;
    // WDBAdapter db = new WDBAdapter(m_context);
    // db.open();
    // db.update(upSql);
    // db.close();
    // }
    //
    // widgetData.m_widgetAdStatus = reData.widgetAdStatus;
    //
    // }
    // }
    public int getWidgetNumber() {

        if (appIDList == null) {
            getAllWidget();
            return appIDList.size();
        } else {
            return appIDList.size();
        }

    }

    public WWidgetData getWidgetInfoById(int id) {
        if (appIDList == null) {
            return null;
        }
        return getWidgetDataByAppId(appIDList.get(id), null);
    }

    public void getAllWidget() {
        if (appIDList == null) {
            appIDList = new ArrayList<String>();
        }
        if (BUtility.sdCardIsWork()) {
            WDBAdapter db = new WDBAdapter(m_context);
            db.open();
            db.deleteByType(3);
            db.close();
            // File SDFile =
            // android.os.Environment.getExternalStorageDirectory();
            if (ESystemInfo.getIntence().mIsDevelop) {

                String developPath = BUtility.getSdCardRootPath()
                        + BUtility.F_WIDGET_APP_PATH + "hiAppcan/";
                if (isWidgetOneSBox) {
                    developPath = BUtility.getSBoxRootPath(m_context)
                            + BUtility.F_WIDGET_APP_PATH + "hiAppcan/";
                }
                File test = new File(developPath);
                if (!test.exists()) {

                    test.mkdirs();
                    try {
                        unzip(m_context.getAssets().open("widget/hiAppcan.zip"),
                                developPath, null);
                    } catch (IOException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }

            }
            String widgetlistPath = BUtility.getSdCardRootPath()
                    + BUtility.F_WIDGET_APP_PATH;
            if (isWidgetOneSBox) {
                widgetlistPath = BUtility.getSBoxRootPath(m_context)
                        + BUtility.F_WIDGET_APP_PATH;
            }
            File appFileDir = new File(widgetlistPath);
            if (!appFileDir.exists()) {
                return;
            }

            m_wgtsPath = widgetlistPath;

            String[] appListPath = appFileDir.list();
            for (String appPath : appListPath) {
                File appFile = new File(widgetlistPath + appPath
                        + "/config.xml");
                if (!appFile.exists()) {
                    continue;
                }
                try {
                    InputStream inputStream = new FileInputStream(appFile);
                    WWidgetData widgetData = getWidgetDataOfXML(inputStream);
                    if (widgetData != null) {
                        if ("#".equals(widgetData.m_indexUrl)
                                || widgetData.m_indexUrl == null
                                || widgetData.m_indexUrl.length() == 0) {
                            widgetData.m_indexUrl = "file://" + widgetlistPath
                                    + appPath + "/index.html";
                        } else if (widgetData.m_indexUrl != null
                                && !widgetData.m_indexUrl
                                .startsWith("file:///")
                                && !widgetData.m_indexUrl.startsWith("http://")) {
                            widgetData.m_indexUrl = "file://" + widgetlistPath
                                    + appPath + "/" + widgetData.m_indexUrl;
                        }
                        if (widgetData.m_iconPath != null
                                && !widgetData.m_iconPath
                                .startsWith("file:///")
                                && !widgetData.m_iconPath.startsWith("http://")) {
                            widgetData.m_iconPath = "file://" + widgetlistPath
                                    + appPath + "/" + widgetData.m_iconPath;
                        }
                        widgetData.m_widgetPath = widgetlistPath + appPath
                                + "/";
                        widgetData.m_wgtType = 2;
                        addWidgetIntoDB(widgetData,
                                WDBAdapter.F_WIDGET_TABLE_NAME);
                        appIDList.add(widgetData.m_appId);
                    }
                } catch (FileNotFoundException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }

            }
        }

    }

    public WWidgetData getWidgetByID(String tableName, long id, int type) {
        WWidgetData widgetData = null;
        WDBAdapter db = new WDBAdapter(m_context);
        db.open();
        Cursor cursor = db.select(tableName, null, WDBAdapter.F_COLUMN_ID + "=?", new String[]{String.valueOf(id)}, null, null, null);
        if (cursor != null) {
            while (cursor.moveToNext()) {
                widgetData = new WWidgetData();
                widgetData.m_id = cursor.getInt(0);
                widgetData.m_widgetOneId = cursor.getString(1);
                widgetData.m_widgetId = cursor.getString(2);
                widgetData.m_appId = cursor.getString(3);
                widgetData.m_widgetName = cursor.getString(4);
                widgetData.m_ver = cursor.getString(5);
                widgetData.m_channelCode = cursor.getString(6);
                widgetData.m_imei = cursor.getString(7);
                widgetData.m_md5Code = cursor.getString(8);
                widgetData.m_widgetPath = cursor.getString(9);
                widgetData.m_indexUrl = cursor.getString(10);
                widgetData.m_iconPath = cursor.getString(11);
                widgetData.m_obfuscation = cursor.getInt(12);
                widgetData.m_logServerIp = cursor.getString(13);
                widgetData.m_wgtType = cursor.getInt(14);
                widgetData.m_updateurl = cursor.getString(15);
                widgetData.m_spaceStatus = cursor.getInt(16);
                widgetData.m_description = cursor.getString(17);
                widgetData.m_email = cursor.getString(18);
                widgetData.m_author = cursor.getString(19);
                widgetData.m_license = cursor.getString(20);
                widgetData.m_orientation = cursor.getInt(21);
                widgetData.m_opaque = cursor.getString(cursor.getColumnIndex(WDBAdapter.F_COLUMN_OPAQUE));
                widgetData.m_bgColor = cursor.getString(cursor.getColumnIndex(WDBAdapter.F_COLUMN_BGCOLOR));
                widgetData.mProgressColor1 = cursor.getString(cursor.getColumnIndex(WDBAdapter.F_COLUMN_PROGRESS_COLOR_1));
                widgetData.mProgressColor2 = cursor.getString(cursor.getColumnIndex(WDBAdapter.F_COLUMN_PROGRESS_COLOR_2));
                // widgetData.m_widgetAdStatus = cursor.getInt(22);
            }
            cursor.close();
            cursor = null;
        }
        db.close();
        return widgetData;
    }

    public WWidgetData getWidgetDataByAppIdFromDB(String appId) {
        WWidgetData widgetData = null;
        // ArrayList<WWidgetData> list = new ArrayList<WWidgetData>();
        WDBAdapter db = new WDBAdapter(m_context);
        db.open();
        Cursor cursor = db.select(WDBAdapter.F_WIDGET_TABLE_NAME, null, WDBAdapter.F_COLUMN_APPID + "=?", new String[]{appId}, null, null, null);
        if (cursor != null) {
            while (cursor.moveToNext()) {
                widgetData = new WWidgetData();
                widgetData.m_id = cursor.getInt(0);
                widgetData.m_widgetOneId = cursor.getString(1);
                widgetData.m_widgetId = cursor.getString(2);
                widgetData.m_appId = cursor.getString(3);
                widgetData.m_widgetName = cursor.getString(4);
                widgetData.m_ver = cursor.getString(5);
                widgetData.m_channelCode = cursor.getString(6);
                widgetData.m_imei = cursor.getString(7);
                widgetData.m_md5Code = cursor.getString(8);
                widgetData.m_widgetPath = cursor.getString(9);
                widgetData.m_indexUrl = cursor.getString(10);
                widgetData.m_iconPath = cursor.getString(11);
                widgetData.m_obfuscation = cursor.getInt(12);
                widgetData.m_logServerIp = cursor.getString(13);
                widgetData.m_wgtType = cursor.getInt(14);
                widgetData.m_updateurl = cursor.getString(15);
                widgetData.m_spaceStatus = cursor.getInt(16);
                widgetData.m_description = cursor.getString(17);
                widgetData.m_email = cursor.getString(18);
                widgetData.m_author = cursor.getString(19);
                widgetData.m_license = cursor.getString(20);
                widgetData.m_orientation = cursor.getInt(21);
                widgetData.m_opaque = cursor.getString(cursor.getColumnIndex(WDBAdapter.F_COLUMN_OPAQUE));
                widgetData.m_bgColor = cursor.getString(cursor.getColumnIndex(WDBAdapter.F_COLUMN_BGCOLOR));
                widgetData.mProgressColor1 = cursor.getString(cursor.getColumnIndex(WDBAdapter.F_COLUMN_PROGRESS_COLOR_1));
                widgetData.mProgressColor2 = cursor.getString(cursor.getColumnIndex(WDBAdapter.F_COLUMN_PROGRESS_COLOR_2));
                // widgetData.m_widgetAdStatus = cursor.getInt(22);
            }
            cursor.close();
            cursor = null;
        }
        db.close();
        return widgetData;
    }

    public WWidgetData getWidgetDataByAppId(String appId,
                                            WWidgetData currentWidget) {
        // if ("9999998".equals(appId)) {
        // return getLoginListWgt();
        // } else if ("9999997".equals(appId)) {
        // return getMoreWgt();
        // }
        WWidgetData widgetData = getWidgetDataByAppIdFromDB(appId);

        if (widgetData != null) {
            if (widgetData.m_widgetPath != null) {
                WWidgetData xmlWidgtData = getWidgetDataByXML(
                        widgetData.m_widgetPath + "config.xml",
                        widgetData.m_wgtType);
                if (xmlWidgtData != null && xmlWidgtData.m_ver != null) {
                    if (!xmlWidgtData.m_ver.equals(widgetData.m_ver)) {
                        WDBAdapter db = new WDBAdapter(m_context);
                        db.open();
                        db.deleteByAppID(WDBAdapter.F_WIDGET_TABLE_NAME, appId);
                        db.close();
                        widgetData = xmlWidgtData;
                        addWidgetIntoDB(widgetData,
                                WDBAdapter.F_WIDGET_TABLE_NAME);
                    }
                }
            }
        } else {
            String wgtPath = null;
            // if (currentWidget == null || currentWidget.m_wgtType == 1) {
            wgtPath = m_wgtsPath + appId + "/config.xml";

            widgetData = getWidgetDataByXML(wgtPath, 2);
            // 启动 widgt
            if (widgetData != null) {
                if (widgetData.m_obfuscation == 1) {
                    String contentPrefix = "content://";
                    String packg = m_context.getPackageName();
                    String spPostFix = ".sp/";
                    BUtility.g_desPath = contentPrefix + packg + spPostFix
                            + "android_asset" + m_sboxPath;
                    widgetData.m_indexUrl = contentPrefix + packg + spPostFix + "android_asset/"
                            + widgetData.m_indexUrl.substring("file:///".length());
                    widgetData.m_obfuscation = 0;
                    BUtility.isDes = true;
                }
                return widgetData;
            }

            // 启动 plugin
            if (currentWidget.m_wgtType == 0) {
                wgtPath = F_ROOT_WIDGET_PATH + "plugin/" + appId
                        + "/config.xml";
                if (isUpdateWidget && isCopyAssetsFinish) {
                    wgtPath = m_sboxPath + wgtPath;
                }
            } else if (currentWidget.m_wgtType == 2) {
                wgtPath = currentWidget.m_widgetPath + "plugin/" + appId
                        + "/config.xml";
            } else {
                wgtPath = m_wgtsPath + "plugin/" + appId + "/config.xml";
            }
            widgetData = getWidgetDataByXML(wgtPath, 3);
            if (widgetData == null && !ESystemInfo.getIntence().mIsDevelop) {
                wgtPath = sRootWgt.getWidgetPath() + BUtility.F_APP_MYSPACE
                        + "plugin/" + appId + "/config.xml";
                widgetData = getWidgetDataByXML(wgtPath, 3);
            }

            if (widgetData != null) {
                widgetData.m_widgetPath = currentWidget.m_widgetPath;
                if (widgetData.m_obfuscation == 1) {
                    String preString = BUtility.F_ASSET_PATH;
                    String contentPrefix = "content://";
                    String packg = m_context.getPackageName();
                    String spPostFix = ".sp/";
                    if (isUpdateWidget && isCopyAssetsFinish) {
                        BUtility.g_desPath = contentPrefix + packg + spPostFix
                                + "android_asset" + m_sboxPath;
                        widgetData.m_indexUrl = contentPrefix + packg + spPostFix
                                + "android_asset/" + widgetData.m_indexUrl.substring("file:///".length());
                    } else {
                        BUtility.g_desPath = contentPrefix + packg + spPostFix;
                        widgetData.m_indexUrl = contentPrefix + packg + spPostFix
                                + "android_asset/" + widgetData.m_indexUrl.substring(preString.length());
                    }
                    widgetData.m_obfuscation = 0;
                    BUtility.isDes = true;
                }
            }

            // }

        }

        return widgetData;
    }

    public WWidgetData getWidgetDataByAppPath(String appPath) {
        if (TextUtils.isEmpty(appPath)) {
            return null;
        }
        if (!appPath.endsWith("/")) {
            appPath += appPath + "/";
        }
        WWidgetData xmlWidgtData = getWidgetDataByXML(
                appPath + "config.xml",
                3);
        return xmlWidgtData;
    }

    /**
     * 查询数据库得到应用
     */
    public ArrayList<WWidgetData> getWidgetDataByDB(String tableName) {
        ArrayList<WWidgetData> appList = new ArrayList<WWidgetData>();

        WDBAdapter db = new WDBAdapter(m_context);
        db.open();
        Cursor cursor = db.select(tableName, null, null, null, null, null, null);
        if (cursor != null) {
            while (cursor.moveToNext()) {
                WWidgetData widgetData = new WWidgetData();
                widgetData.m_id = cursor.getInt(0);
                widgetData.m_widgetOneId = cursor.getString(1);
                widgetData.m_widgetId = cursor.getString(2);
                widgetData.m_appId = cursor.getString(3);
                widgetData.m_widgetName = cursor.getString(4);
                widgetData.m_ver = cursor.getString(5);
                widgetData.m_channelCode = cursor.getString(6);
                widgetData.m_imei = cursor.getString(7);
                widgetData.m_md5Code = cursor.getString(8);
                widgetData.m_widgetPath = cursor.getString(9);
                widgetData.m_indexUrl = cursor.getString(10);
                widgetData.m_iconPath = cursor.getString(11);
                widgetData.m_obfuscation = cursor.getInt(12);
                widgetData.m_logServerIp = cursor.getString(13);
                widgetData.m_wgtType = cursor.getInt(14);
                widgetData.m_updateurl = cursor.getString(15);
                widgetData.m_spaceStatus = cursor.getInt(16);
                widgetData.m_description = cursor.getString(17);
                widgetData.m_email = cursor.getString(18);
                widgetData.m_author = cursor.getString(19);
                widgetData.m_license = cursor.getString(20);
                widgetData.m_orientation = cursor.getInt(21);
                // widgetData.m_widgetAdStatus = cursor.getInt(22);
                appList.add(widgetData);

            }
            cursor.close();
            cursor = null;
        }
        db.close();

        return appList;
    }

    /**
     * 向数据库中添加widget 数据
     */
    public long addWidgetIntoDB(WWidgetData widgetData, String tableName) {
        if (widgetData == null) {
            return -1;
        }
        WDBAdapter db = new WDBAdapter(m_context);
        db.open();

        long widgetDBId = -1;

        ContentValues cv = new ContentValues();
        cv.put(WDBAdapter.F_COLUMN_WIDGETONEID, widgetData.m_widgetOneId);

        cv.put(WDBAdapter.F_COLUMN_WIDGETID, widgetData.m_widgetId);

        cv.put(WDBAdapter.F_COLUMN_APPID, widgetData.m_appId);

        cv.put(WDBAdapter.F_COLUMN_NAME, widgetData.m_widgetName);

        cv.put(WDBAdapter.F_COLUMN_VER, widgetData.m_ver);

        cv.put(WDBAdapter.F_COLUMN_CHANNELCODE, widgetData.m_channelCode);

        cv.put(WDBAdapter.F_COLUMN_IMEI, widgetData.m_imei);

        cv.put(WDBAdapter.F_COLUMN_MD5CODE, widgetData.m_md5Code);

        cv.put(WDBAdapter.F_COLUMN_FILEPATH, widgetData.m_widgetPath);

        cv.put(WDBAdapter.F_COLUMN_INDEXURL, widgetData.m_indexUrl);

        cv.put(WDBAdapter.F_COLUMN_ICON, widgetData.m_iconPath);

        cv.put(WDBAdapter.F_COLUMN_OBFUSCATION, widgetData.m_obfuscation);
        cv.put(WDBAdapter.F_COLUMN_LOGSERVERIP, widgetData.m_logServerIp);
        cv.put(WDBAdapter.F_COLUMN_WGTTYPE, widgetData.m_wgtType);
        cv.put(WDBAdapter.F_COLUMN_updateurl, widgetData.m_updateurl);
        cv.put(WDBAdapter.F_COLUMN_SHOWSPACE, widgetData.m_spaceStatus);
        cv.put(WDBAdapter.F_COLUMN_DESCRIPTION, widgetData.m_description);
        cv.put(WDBAdapter.F_COLUMN_EMAIL, widgetData.m_email);
        cv.put(WDBAdapter.F_COLUMN_AUTHOR, widgetData.m_author);
        cv.put(WDBAdapter.F_COLUMN_LICENSE, widgetData.m_license);
        cv.put(WDBAdapter.F_COLUMN_ORIENTATION, widgetData.m_orientation);
        cv.put(WDBAdapter.F_COLUMN_OPAQUE, widgetData.m_opaque);
        cv.put(WDBAdapter.F_COLUMN_BGCOLOR, widgetData.m_bgColor);
        cv.put(WDBAdapter.F_COLUMN_PROGRESS_COLOR_1, widgetData.mProgressColor1);
        cv.put(WDBAdapter.F_COLUMN_PROGRESS_COLOR_2, widgetData.mProgressColor2);
        widgetDBId = db.insert(cv, tableName);
        widgetData.m_id = Integer.parseInt(String.valueOf(widgetDBId));

        db.close();
        return widgetDBId;
    }

    // /**
    // * 判断是否有增量更新包，如果有，继续判断版本号是否大于当前APK的版本号
    // */
    // private boolean isHasUpdateZip(String zipPath) {
    // SharedPreferences preferences = m_context.getSharedPreferences(
    // "updateInfo", Context.MODE_PRIVATE);
    // int totalSize = preferences.getInt("totalSize", 0);
    // int downloaded = preferences.getInt("downloaded", 0);
    // if (totalSize == 0 || downloaded == 0 || totalSize != downloaded) {
    // return false;
    // }
    // String filePath = preferences.getString("filePath", null);
    // if (TextUtils.isEmpty(filePath)) {
    // return false;
    // }
    //
    // try {
    // File dir = new File(zipPath);
    // // 建立与目标文件的输入连接
    // FileInputStream inputStream = new FileInputStream(filePath);
    // CnZipInputStream in = new CnZipInputStream(inputStream, "UTF-8");
    // ZipEntry entry = in.getNextEntry();
    // byte[] c = new byte[1024];
    // int slen;
    // while (entry != null) {
    // String zename = entry.getName();
    // if (zename.toLowerCase().equals("config.xml")) {
    // File files = new File(dir.getAbsolutePath() + "/" + zename)
    // .getParentFile();// 当前文件所在目录
    // if (!files.exists()) {// 如果目录文件夹不存在，则创建
    // files.mkdirs();
    // }
    // //得到config.xml文件的内容
    // FileOutputStream out = new FileOutputStream(
    // dir.getAbsolutePath() + "/" + zename);
    // while ((slen = in.read(c, 0, c.length)) != -1)
    // out.write(c, 0, slen);
    //
    // //对config.xml文件进行XML解析
    // File file = new File(dir.getAbsolutePath() + "/" + zename);
    // if (!file.exists()) {
    // return false;
    // }
    // FileInputStream input = new FileInputStream(file);
    // //得到增量更新包config.xml文件中的版本号
    // String m_verString = BUtility.parserXmlLabel(input,
    // "config", "widget", "version");
    // //比较增量更新包和当前APK的版本号大小
    // String dbVerString = m_preferences.getString("dbVer", null);
    // if (m_verString != null && dbVerString != null) {
    // //格式化版本号内容，去掉"."
    // m_verString = formatVerString(m_verString.split("\\."));
    // dbVerString = formatVerString(dbVerString.split("\\."));
    // //转换成long型
    // long m_verLong = Long.parseLong(m_verString);
    // long dbVerLong = Long.parseLong(dbVerString);
    // if (m_verLong > dbVerLong) {
    // return true;
    // }
    // }
    // out.close();
    // input.close();
    // }
    // entry = in.getNextEntry();
    // }
    // in.close();
    // } catch (Exception i) {
    // return false;
    // }
    // return false;
    // }

    // private String formatVerString(String[] s) {
    // if (s.length == 1 && s[0].length() == 1) {
    // s[0] = 0 + s[0];
    // }
    // if (s.length == 2 && s[1].length() == 1) {
    // s[1] = "0" + s[1];
    // }
    // if (s.length == 3 && s[2].length() == 1) {
    // s[2] = "000" + s[2];
    // }
    // if (s.length == 3 && s[2].length() == 2) {
    // s[2] = "00" + s[2];
    // }
    // if (s.length == 3 && s[2].length() == 3) {
    // s[2] = "0" + s[2];
    // }
    // StringBuffer sbf = new StringBuffer("");
    // if (s.length == 1) {
    // sbf.append(s[0]).append("000000");
    // } else if (s.length == 2) {
    // sbf.append(s[0]).append(s[1]).append("0000");
    // } else if (s.length == 3) {
    // sbf.append(s[0]).append(s[1]).append(s[2]);
    // }
    // return sbf.toString();
    // }

    public boolean isHasAssetsWidget() {
        try {
            InputStream in = m_context.getAssets().open(m_rootWidgetConfigPath);
            if (in != null) {
                in.close();
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return false;
    }

    public WWidgetData getDefaultWidgetData() {
        WWidgetData widgetData = new WWidgetData();
        widgetData.m_appId = "default";
        widgetData.m_indexUrl = "index.html";
        return widgetData;
    }

    /**
     * 得到当前应用
     *
     * @return
     */
    public WWidgetData getWidgetData() {
        PackageManager pm = m_context.getPackageManager();
        String ver = null;
        String dbVer = null;


        WWidgetData widgetData = null;
        WWidgetData assetsData = getWidgetDataByXML(m_rootWidgetConfigPath, 0);// apk打包预置的config.xml解析结果
        isUpdateWidget = checkAppStatus(m_context, assetsData.m_appId);
        isCopyAssetsFinish = m_preferences.getBoolean(m_copyAssetsFinish, false);
        try {
            if (isUpdateWidget) {
                PackageInfo pinfo = pm.getPackageInfo(
                        m_context.getPackageName(),
                        PackageManager.GET_CONFIGURATIONS);
                ver = pinfo.versionName;
                dbVer = m_preferences.getString("dbVer", null);
                BDebug.i("getWidgetData", ver, dbVer, isCopyAssetsFinish);
                if (dbVer == null || !ver.equals(dbVer) || !isCopyAssetsFinish) {
                    Editor editor = m_preferences.edit();
                    editor.putString("dbVer", ver);
                    editor.putBoolean(m_copyAssetsFinish, false);
                    isCopyAssetsFinish = false;
                    editor.commit();
                    File flie = new File(m_sboxPath + "widget/");
                    if (flie.exists()) {
//						deleteFile(flie);
                    }
                    //如果有增量更新包，且其版本号大于当前APK的版本号，则进行同步拷贝操作，防止再次弹出增量更新提示框，否则，才进行异步拷贝操作
                    if (WidgetPackageMgr.isHasUpdateZip(m_context,
                            m_sboxPath, assetsData.m_appId)) {
                        BDebug.i("getWidgetData", "isHasUpdateZip CopyAssets");
                        CopyAssets("widget", m_sboxPath + "widget/");
                        isCopyAssetsFinish = true;
                        editor.putBoolean(m_copyAssetsFinish, true);
                        editor.commit();
                        BDebug.i("CopyAssets", "finish");
                    } else {
                        BDebug.i("getWidgetData", "copyAssetsThread");
                        copyAssetsThread("widget", m_sboxPath + "widget/");
                    }
                }
            }
        } catch (Exception e) {
            // TODO: handle exception
        }
        long widgetDBId = m_preferences.getLong(m_rootWidgetDBId, -1);
        if (widgetDBId != -1) {
            if (!isCopyAssetsFinish || !WidgetPackageMgr.unZip(m_context,
                    assetsData.m_appId, BUtility.INSTALL_PATCH_WIDGET)) {
                int webapp = 0;
                if (null != assetsData) {
                    webapp = assetsData.m_webapp;
                }
                widgetData = getWidgetByID(WDBAdapter.F_WIDGET_TABLE_NAME,
                        widgetDBId, 0);
                if (null != widgetData) {
                    widgetData.m_webapp = webapp;
                }
            } else {
                widgetData = getWidgetDataByXML(m_sboxPath
                        + m_rootWidgetConfigPath, 0);
            }

        }
//		File flie = new File(m_sboxPath + "widget/");
        if (isUpdateWidget && isCopyAssetsFinish) {
//			if (widgetData == null) {
//				CopyAssets("widget", m_sboxPath + "widget/");
//			} 
//			else {
//
//				if (assetsData != null
//						&& !assetsData.m_ver.equals(widgetData.m_ver)) {
//					if (flie.exists()) {
//						deleteFile(flie);
//					}
//					CopyAssets("widget", m_sboxPath + "widget/");
//				}
//			}
            m_rootWidgetConfigPath = m_sboxPath + m_rootWidgetConfigPath;
        }

        WWidgetData xmlWidgetData = getWidgetDataByXML(m_rootWidgetConfigPath,
                0); // 拷贝到沙箱空间的config.xml解析结果

        if (xmlWidgetData != null) {
            if (widgetData == null) {
                widgetData = xmlWidgetData;
                widgetDBId = addWidgetIntoDB(xmlWidgetData,
                        WDBAdapter.F_WIDGET_TABLE_NAME);

                Editor editor = m_preferences.edit();

                editor.putLong(m_rootWidgetDBId, widgetDBId);

                editor.commit();
            } else {
                if (widgetData.m_ver != null && xmlWidgetData.m_ver != null) {
                    if (!widgetData.m_ver.equals(xmlWidgetData.m_ver)) {

                        WDBAdapter db = new WDBAdapter(m_context);
                        db.open();
                        db.delete(widgetData.m_id,
                                WDBAdapter.F_WIDGET_TABLE_NAME);
                        db.close();
                        widgetData = xmlWidgetData;
                        widgetDBId = addWidgetIntoDB(xmlWidgetData,
                                WDBAdapter.F_WIDGET_TABLE_NAME);

                        Editor editor = m_preferences.edit();

                        editor.putLong(m_rootWidgetDBId, widgetDBId);

                        editor.commit();
                    }
                }
            }
        }else{
            // 如果没有
            xmlWidgetData = assetsData;
        }

        widgetData.m_appdebug = xmlWidgetData.m_appdebug;
        widgetData.m_logServerIp = xmlWidgetData.m_logServerIp;
        widgetData.m_obfuscation = xmlWidgetData.m_obfuscation;
        widgetData.m_opaque = xmlWidgetData.m_opaque;
        widgetData.mErrorPath=xmlWidgetData.mErrorPath;
        widgetData.noHardwareList=xmlWidgetData.noHardwareList;
        widgetData.splashDialogPageVersion=xmlWidgetData.splashDialogPageVersion;
        widgetData.mProgressColor1=assetsData.mProgressColor1;
        widgetData.mProgressColor2=assetsData.mProgressColor2;

        // 处理index url
        if (isUpdateWidget && isCopyAssetsFinish) {
            String matchAssetPath = BUtility.F_ASSET_PATH + "widget/";
            if (widgetData.m_indexUrl.startsWith(matchAssetPath)) {
                String indexPath = widgetData.m_indexUrl.substring(matchAssetPath.length());
                String matchContentPath = "file://" + m_sboxPath + "widget/";
                widgetData.m_indexUrl = matchContentPath + indexPath;
                String finalIndexPath = m_sboxPath + "widget/" + indexPath;
                widgetData.m_indexUrl = BUtility.getUriForFileWithFileProvider(m_context, finalIndexPath).toString();
                BDebug.i("WDataManager", "widgetData.m_indexUrl=" + widgetData.m_indexUrl);
            }
        } else {
            widgetData.m_indexUrl = assetsData.m_indexUrl;
        }
        // 处理splash page url
        if (isUpdateWidget && isCopyAssetsFinish) {
            if (!TextUtils.isEmpty(widgetData.splashDialogPagePath)){
                String matchAssetPath = BUtility.F_ASSET_PATH + "widget/";
                if (widgetData.splashDialogPagePath.startsWith(matchAssetPath)) {
                    String splashDialogPagePath = widgetData.splashDialogPagePath.substring(matchAssetPath.length());
                    String matchContentPath = "file://" + m_sboxPath + "widget/";
                    widgetData.splashDialogPagePath = matchContentPath + splashDialogPagePath;
                }
            }
        } else {
            widgetData.splashDialogPagePath = xmlWidgetData.splashDialogPagePath;
        }

        if (widgetData.m_obfuscation == 1) {
            String preString = BUtility.F_ASSET_PATH;
            String contentPrefix = "content://";
            String packg = m_context.getPackageName();
            String spPostFix = ".sp/";

            if (isUpdateWidget && isCopyAssetsFinish) {
                BUtility.g_desPath = contentPrefix + packg + spPostFix + "android_asset" + m_sboxPath;
                widgetData.m_indexUrl = contentPrefix + packg + spPostFix + "android_asset/" + widgetData.m_indexUrl.substring("file:///".length());
                if (!TextUtils.isEmpty(widgetData.splashDialogPagePath)){
                    widgetData.splashDialogPagePath = contentPrefix + packg + spPostFix + "android_asset/" + widgetData.splashDialogPagePath.substring("file:///".length());
                }
            } else {
                BUtility.g_desPath = contentPrefix + packg + spPostFix;
                widgetData.m_indexUrl = contentPrefix + packg + spPostFix + "android_asset/" + widgetData.m_indexUrl.substring(preString.length());
                if (!TextUtils.isEmpty(widgetData.splashDialogPagePath)){
                    widgetData.splashDialogPagePath = contentPrefix + packg + spPostFix + "android_asset/" + widgetData.splashDialogPagePath.substring(preString.length());
                }
            }

            widgetData.m_obfuscation = 0;
            BUtility.isDes = true;
        }
        sRootWgt = widgetData;
        if (m_wgtsPath == null) {
            File file = new File(sRootWgt.m_widgetPath);

            m_wgtsPath = file.getParentFile().getParentFile().getAbsolutePath()
                    + "/widgets/";

        }
        return widgetData;
    }

    /**
     * 从Json配置中解析widget基本信息
     *
     * @return
     */
    public WWidgetData getWidgetDataByConfigJson(WidgetConfigVO configVO){
        if (configVO == null){
            return null;
        }
        int wgtType = WWidgetData.WGT_TYPE_CLOUD;//此处目前写死，指定应用类型，不支持传入自定义。否则可能会与之前的子应用逻辑有一些冲突。
        String widgetPath = null;
        if (!configVO.indexUrl.startsWith("/")) {
            if (isUpdateWidget && isCopyAssetsFinish) {
                widgetPath = m_sboxPath + F_ROOT_WIDGET_PATH;
            }else{
                widgetPath = BUtility.F_ASSET_PATH + F_ROOT_WIDGET_PATH;
            }
        } else {
            File file = new File(configVO.indexUrl);
            widgetPath = BUtility.F_FILE_SCHEMA
                    + file.getParentFile().getAbsolutePath() + "/";
        }
        String indexUrl = configVO.indexUrl;
        if ("#".equals(configVO.indexUrl)
                || configVO.indexUrl == null
                || configVO.indexUrl.length() == 0) {
            indexUrl = widgetPath + "index.html";
        } else {
            if (!BUtility.uriHasSchema(configVO.indexUrl)) {
                indexUrl = widgetPath + configVO.indexUrl;
            }
        }
        String errorPath = null;
        if ("#".equals(configVO.errorPath)
                || configVO.errorPath == null
                || configVO.errorPath.length() == 0) {
            errorPath = widgetPath + "error.html";
        } else {
            if (!BUtility.uriHasSchema(configVO.errorPath)) {
                errorPath = widgetPath + configVO.errorPath;
            }
        }
        String splashDialogPath = null;
        if (!TextUtils.isEmpty(configVO.splashDialogPath)) {
            if (!BUtility.uriHasSchema(configVO.splashDialogPath)) {
                splashDialogPath = widgetPath + configVO.splashDialogPath;
            }
        }else{
            // 没有配置splash path，则无需处理
            splashDialogPath = configVO.splashDialogPath;
        }
        WWidgetData widgetData = new WWidgetData();
        widgetData.m_appId = configVO.appId;
        widgetData.m_appkey = configVO.appkey;
        widgetData.m_appdebug = "true".equals(configVO.debug) ? 1 : 0;
        widgetData.m_obfuscation = "true".equals(configVO.obfuscation) ? 1 : 0;
        widgetData.m_widgetName = configVO.widgetName;
        widgetData.m_indexUrl = indexUrl;
        widgetData.m_widgetPath = widgetPath;
        widgetData.m_description = configVO.description;
        widgetData.mErrorPath = errorPath;
        widgetData.splashDialogPagePath = splashDialogPath;
        widgetData.splashDialogPageVersion = configVO.splashDialogVersion;
        widgetData.m_wgtType = wgtType;
        widgetData.m_indexWindowOptions = configVO.indexWindowOptions;
        return widgetData;
    }

    public boolean checkAppStatus(Context inActivity, String appId) {
        try {
            String appstatus = ResoureFinder.getInstance().getString(
                    inActivity, "appstatus");
            byte[] appstatusToByte = HexStringToBinary(appstatus);
            String appstatusDecrypt = new String(PEncryption.os_decrypt(
                    appstatusToByte, appstatusToByte.length, appId));
            String[] appstatuss = appstatusDecrypt.split(",");
            if (appstatuss == null || appstatuss.length == 0) {
                return false;
            }
            if (appstatuss.length > 14) {
                if ("1".equals(appstatuss[14])) {
                    Http.setCheckTrustCert(true);
                }
            }
            if ("1".equals(appstatuss[9])) {
                return true;
            }
        } catch (Exception e) {
            // TODO: handle exception
        }
        return false;
    }

    /**
     * @param hexString
     * @return 将十六进制转换为字节数组
     */
    public byte[] HexStringToBinary(String hexString) {
        // hexString的长度对2取整，作为bytes的长度
        String hexStr = "0123456789ABCDEF";
        int len = hexString.length() / 2;
        byte[] bytes = new byte[len];
        byte high = 0;// 字节高四位
        byte low = 0;// 字节低四位

        for (int i = 0; i < len; i++) {
            // 右移四位得到高位
            high = (byte) ((hexStr.indexOf(hexString.charAt(2 * i))) << 4);
            low = (byte) hexStr.indexOf(hexString.charAt(2 * i + 1));
            bytes[i] = (byte) (high | low);// 高地位做或运算
        }
        return bytes;
    }

    // private boolean unZIP(String targetFile) {
    // SharedPreferences preferences = m_context.getSharedPreferences(
    // "updateInfo", Context.MODE_PRIVATE);
    // int totalSize = preferences.getInt("totalSize", 0);
    // int downloaded = preferences.getInt("downloaded", 0);
    //
    // if (totalSize == 0 || downloaded == 0 || totalSize != downloaded) {
    // return false;
    // }
    // String filePath = preferences.getString("filePath", null);
    // if (TextUtils.isEmpty(filePath)) {
    // return false;
    // }
    // Editor editor = preferences.edit();
    // editor.clear();
    // editor.commit();
    // try {
    // FileInputStream inputStream = new FileInputStream(filePath);
    // if (unzip(inputStream, targetFile, null)) {
    // File file = new File(filePath);
    // if (file.exists()) {
    // file.delete();
    // }
    // return true;
    // } else {
    // return false;
    // }
    // } catch (FileNotFoundException e) {
    // // TODO Auto-generated catch block
    // e.printStackTrace();
    // }
    // // unzip(,box,null);
    // return false;
    // }

    private void copyAssetsThread(final String assetDir, final String dir) {
        Thread thread = new Thread("copyAssetsThread") {
            @Override
            public void run() {
                try {
                    CopyAssets(assetDir, dir);
                    Editor editor = m_preferences.edit();
                    editor.putBoolean(m_copyAssetsFinish, true);
                    editor.commit();
                    BDebug.i("copyAssetsThread", "finish");
                } catch (Exception e) {
                }
            }
        };
        thread.start();
    }

    private void CopyAssets(String assetDir, String dir) {
        String[] files;
        try {
            files = m_context.getResources().getAssets().list(assetDir);
        } catch (IOException e1) {
            return;
        }
        File mWorkingPath = new File(dir);
        // if this directory does not exists, make one.
        if (!mWorkingPath.exists()) {
            if (!mWorkingPath.mkdirs()) {
                BDebug.e("--CopyAssets--", "cannot create directory.");
            }
        }

        for (int i = 0; i < files.length; i++) {
            try {
                String fileName = files[i];
                /** folder name can be contains '.' */
                if (m_context.getResources().getAssets().list(assetDir + "/" + fileName).length != 0) {
                    if (0 == assetDir.length()) {
                        CopyAssets(fileName, dir + fileName + "/");
                    } else {
                        CopyAssets(assetDir + "/" + fileName, dir + fileName
                                + "/");
                    }
                    continue;
                }
                File outFile = new File(mWorkingPath, fileName);
                if (outFile.exists())
                    outFile.delete();
                InputStream in = null;
                if (0 != assetDir.length())
                    in = m_context.getAssets().open(assetDir + "/" + fileName);
                else
                    in = m_context.getAssets().open(fileName);
                OutputStream out = new FileOutputStream(outFile);

                // Transfer bytes from in to out
                byte[] buf = new byte[1024];
                int len;
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }

                in.close();
                out.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public WWidgetData getSpaceWidgetData() {
        WWidgetData widgetData = null;
        if (sRootWgt == null) {
            return null;
        }
        long widgetDBId = m_preferences.getLong(m_spaceWidgetDBId, -1);
        if (widgetDBId != -1) {
            widgetData = getWidgetByID(WDBAdapter.F_WIDGET_TABLE_NAME,
                    widgetDBId, 1);
        }
        StringBuffer Path = new StringBuffer();
        Path.append(sRootWgt.getWidgetPath());
        Path.append(BUtility.F_APP_MYSPACE);
        Path.append("config.xml");
        WWidgetData xmlWidgetData = getWidgetDataByXML(Path.toString(), 1);
        if (xmlWidgetData != null) {
            if (widgetData == null) {
                widgetData = xmlWidgetData;
                widgetDBId = addWidgetIntoDB(widgetData,
                        WDBAdapter.F_WIDGET_TABLE_NAME);

                Editor editor = m_preferences.edit();

                editor.putLong(m_spaceWidgetDBId, widgetDBId);

                editor.commit();
            } else {
                if (widgetData.m_ver != null && xmlWidgetData.m_ver != null) {
                    if (!widgetData.m_ver.equals(xmlWidgetData.m_ver)) {

                        WDBAdapter db = new WDBAdapter(m_context);
                        db.open();
                        db.delete(widgetData.m_id,
                                WDBAdapter.F_WIDGET_TABLE_NAME);
                        db.close();
                        widgetData = xmlWidgetData;
                        widgetDBId = addWidgetIntoDB(widgetData,
                                WDBAdapter.F_WIDGET_TABLE_NAME);

                        Editor editor = m_preferences.edit();

                        editor.putLong(m_spaceWidgetDBId, widgetDBId);

                        editor.commit();
                    }
                }
            }
        }

        return widgetData;
    }

    public String removeWgtByAppID(String appId) {
        WDBAdapter db = new WDBAdapter(m_context);
        db.open();
        db.deleteByAppID(WDBAdapter.F_WIDGET_TABLE_NAME, appId);
        db.close();
        String rootWgtPath = sRootWgt.getWidgetPath();
        String wgtPath = null;
        if (F_SPACE_APPID.equals(appId)) {
            File rootFile = new File(rootWgtPath);
            if (rootFile.exists()) {
                wgtPath = rootWgtPath + BUtility.F_APP_MYSPACE;
            }
        } else {
            wgtPath = m_wgtsPath + appId + "/";
        }

        if (wgtPath != null) {
            File wgtFile = new File(wgtPath);

            if (wgtFile.exists()) {
                deleteFile(wgtFile);
                // wgtFile.delete();
            } else {
                return String.format(EUExUtil.getString("widget_not_exist_id_path"), wgtPath, appId);
            }
        } else {
            return EUExUtil.getString("not_any_widget");
        }

        return "0";
    }

    public WWidgetData getWidgetDataByXML(String path, int type) {
        WWidgetData widgetData = null;
        InputStream inputStream = null;
        try {
            if (!path.startsWith("/")) {
                widgetData = getWidgetDataOfXML(m_context.getAssets()
                        .open(path));
            } else {
                File file = new File(path);
                if (!file.exists()) {
                    return null;
                }
                inputStream = new FileInputStream(file);
                widgetData = getWidgetDataOfXML(inputStream);
            }

            if (widgetData == null) {
                return null;
            }

            // 用于处理全局强制加密控制开关（逻辑上来说，仅主应用有效）
            if (type == WWidgetData.WGT_TYPE_MAIN) {
                setGlobalObfuscationConfigInMainWidget(widgetData.m_globalObfuscation);
            }
            if (getGlobalObfuscationConfigInMainWidget() != -1) {
                // 不等于-1，则认为配置了全局控制开关，所以需要改写加密开关
                widgetData.m_obfuscation = getGlobalObfuscationConfigInMainWidget();
            }

            String widgetPath = null;
            if (!path.startsWith("/")) {
                if (type == 3) {
                    widgetPath = BUtility.F_ASSET_PATH
                            + path.substring(0, path.lastIndexOf('/') + 1);
                } else {
                    widgetPath = BUtility.F_ASSET_PATH + F_ROOT_WIDGET_PATH;
                }

            } else {
                File file = new File(path);
                widgetPath = BUtility.F_FILE_SCHEMA
                        + file.getParentFile().getAbsolutePath() + "/";
            }
            if ("#".equals(widgetData.m_indexUrl)
                    || widgetData.m_indexUrl == null
                    || widgetData.m_indexUrl.length() == 0) {
                widgetData.m_indexUrl = widgetPath + "index.html";
            } else {
                if (!BUtility.uriHasSchema(widgetData.m_indexUrl)) {
                    widgetData.m_indexUrl = widgetPath + widgetData.m_indexUrl;
                }
            }
            if (!TextUtils.isEmpty(widgetData.splashDialogPagePath)) {
                if (!BUtility.uriHasSchema(widgetData.splashDialogPagePath)) {
                    widgetData.splashDialogPagePath = widgetPath + widgetData.splashDialogPagePath;
                }
            }
            if (widgetData.m_iconPath != null
                    && !BUtility.uriHasSchema(widgetData.m_iconPath)) {
                widgetData.m_iconPath = widgetPath + widgetData.m_iconPath;
            }
            // 移除引擎中自动获取IMEI的代码。
            widgetData.m_imei = "";
//            widgetData.m_imei = BUtility.getIMEI(m_context);

            try {
                if (!isWidgetOneSBox) {
                    String appstatus = ResoureFinder.getInstance().getString(
                            m_context, "appstatus");
                    String appstatusDecrypt = BUtility.decryptString(appstatus,
                            widgetData.m_appId);
                    String[] appstatuss = appstatusDecrypt.split(",");
                    if (appstatuss != null && appstatuss.length > 16) {
                        if ("1".equals(appstatuss[16])) {
                            widgetData.m_widgetOneLocation = 1;
                        }
                    }
                    isWidgetOneSBox = widgetData.m_widgetOneLocation == 1 ? true : false;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            widgetData.m_wgtType = type;
            if (type == 3) {
                widgetData.m_widgetPath = widgetPath
                        .substring(BUtility.F_FILE_SCHEMA.length());
            } else {
                widgetData.m_widgetPath = getWidgetPath(type,
                        widgetData.m_appId);
            }

        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                inputStream = null;
            }
        }

        return widgetData;
    }

    private String getWidgetPath(int type, String appId) {
        String appPath = null;
        if (type == 0) {
            appPath = BUtility.F_APP_PATH;
        } else if (type == 1) {
            appPath = BUtility.F_APP_PATH;
        } else {
            appPath = BUtility.F_WIDGET_PATH;
        }
        String appIdPath = null;
        if (WDataManager.F_SPACE_APPID.equals(appId)) {
            appIdPath = F_SPACE_APPID;
        } else {
            appIdPath = appId;
        }
        if (BUtility.sdCardIsWork() && !isWidgetOneSBox) {

            if (type == 1) {
                return BUtility.getSdCardRootPath() + appPath + appIdPath + "/"
                        + BUtility.F_APP_MYSPACE;
            } else {
                return BUtility.getSdCardRootPath() + appPath + appIdPath + "/";
            }

        } else {
            if (type == 1) {
                return m_context.getFilesDir().getPath() + "/" + appPath
                        + appIdPath + "/" + BUtility.F_APP_MYSPACE;
            } else {
                return m_context.getFilesDir().getPath() + "/" + appPath
                        + appIdPath + "/";
            }

        }

    }

    /**
     * 查询widgetOne id信息；
     */
    public static String getWidgetOneId() {
        if (m_preferences == null) {
            return null;
        }
        String widgetOneId = m_preferences.getString(m_widgetOneId, null);
        return widgetOneId;
    }

    /**
     * 查询是否存在当前 id 的widget 信息；
     */

    public static WWidgetData getWidgetDataOfXML(InputStream is) {

        WWidgetData widgetData = null;
        try {

            XmlPullParser parser = Xml.newPullParser();


            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            byte[] buffer = new byte[1024];
            int len;
            while ((len = is.read(buffer)) > -1) {
                baos.write(buffer, 0, len);
            }
            baos.flush();


            InputStream is1 = new ByteArrayInputStream(baos.toByteArray());
            InputStream is2 = new ByteArrayInputStream(baos.toByteArray());

            boolean isV = ACEDes.isEncrypted(is1);

            if (isV) {

                InputStream resStream = null;
                byte[] data = null;
                String fileName = "config";
                String result = null;

                data = BUtility.transStreamToBytes(is2, is2.available());
                result = ACEDes.htmlDecode(data, fileName);
                resStream = new ByteArrayInputStream(result.getBytes());
                parser.setInput(resStream, "utf-8");
            } else {
                parser.setInput(is2, "utf-8");
            }


            int tokenType = 0;
            boolean needContinue = true;
            do {
                tokenType = parser.next();
                if (widgetData == null) {
                    widgetData = new WWidgetData();
                }

                switch (tokenType) {
                    case XmlPullParser.START_TAG:
                        String localName = (parser.getName()).toLowerCase();
                        if ("widget".equals(localName)) {

                            widgetData.m_appId = parser.getAttributeValue(null,
                                    "appId");
                            widgetData.m_channelCode = parser.getAttributeValue(
                                    null, "channelCode");
                            widgetData.m_ver = parser.getAttributeValue(null,
                                    "version");

                            // persion.setId(Integer.parseInt(attributes.getValue(0)));
                        } else if ("content".equals(localName)) {

                            widgetData.m_indexUrl = parser.getAttributeValue(null,
                                    "src");
                        } else if (WWidgetData.TAG_WIN_BG.equals(localName)) {
                            widgetData.m_opaque = parser.getAttributeValue(null,
                                    WWidgetData.TAG_WIN_BG_OPAQUE);
                            widgetData.m_bgColor = parser.getAttributeValue(null,
                                    WWidgetData.TAG_WIN_BG_COLOR);
                        } else if ("icon".equals(localName)) {
                            widgetData.m_iconPath = parser.getAttributeValue(null,
                                    "src");
                        } else if ("name".equals(localName)) {
                            widgetData.m_widgetName = parser.nextText();

                        } else if ("md5code".equals(localName)) {
                            widgetData.m_md5Code = parser.nextText();
                        } else if ("obfuscation".equals(localName)) {
                            if ("true".equals(parser.nextText())) {
                                widgetData.m_obfuscation = 1;
                                ACEDes.setEncryptcj(true);
                            }
                        } else if ("globalobfuscation".equals(localName)) {
                            // 用于处理全局强制加密控制开关（逻辑上来说，仅主应用有效）
                            String value = parser.nextText();
                            if ("1".equals(value)) {
                                widgetData.m_globalObfuscation = 1;
                                ACEDes.setEncryptcj(true);
                            } else if ("0".equals(value)) {
                                widgetData.m_globalObfuscation = 0;
                            }
                        } else if ("logserverip".equals(localName)) {
                            widgetData.m_logServerIp = parser.nextText();
                        } else if ("updateurl".equals(localName)) {
                            widgetData.m_updateurl = parser.nextText();
                        } else if ("showmyspace".equals(localName)) {
                            String text = parser.nextText();
                            if ("true".equals(text)) {
                                widgetData.m_spaceStatus = WWidgetData.F_SPACESTATUS_OPEN
                                        | WWidgetData.F_MYSPACEMOREAPP_OPEN;
                            } else if ("false".equals(text)) {
                                widgetData.m_spaceStatus = WWidgetData.F_SPACESTATUS_CLOSE
                                        | WWidgetData.F_MYSPACEMOREAPP_CLOSE;
                            }

                        } else if ("description".equals(localName)) {
                            widgetData.m_description = parser.nextText();
                        } else if ("author".equals(localName)) {
                            widgetData.m_email = parser.getAttributeValue(null,
                                    "email");
                            widgetData.m_author = parser.nextText();
                        } else if ("license".equals(localName)) {
                            widgetData.m_license = parser.getAttributeValue(null,
                                    "href");
                        } else if ("orientation".equals(localName)) {
                            String value = parser.nextText();
                            if (value == null || value.length() == 0) {
                                widgetData.m_orientation = 1;
                            } else {
                                widgetData.m_orientation = Integer.parseInt(value);
                            }
                        } else if ("webapp".equals(localName)) {
                            widgetData.mProgressColor1 = parser.getAttributeValue(null,
                                    "progressColor1");
                            widgetData.mProgressColor2 = parser.getAttributeValue(null,
                                    "progressColor2");
                            String text = parser.nextText();
                            if ("true".equals(text)) {
                                widgetData.m_webapp = 1;
                            }
                        } else if ("debug".equals(localName)) {
                            String text = parser.nextText();
                            if ("true".equals(text)) {
                                widgetData.m_appdebug = 1;
                            }
                        } else if ("removeloading".equals(localName)) {
                            String text = parser.nextText();
                            if ("true".equals(text)) {
                                WWidgetData.m_remove_loading = 0;
                            }
                        }else if ("fullscreen".equals(localName)){
                            String text = parser.nextText();
                            if ("true".equals(text)) {
                                WWidgetData.sFullScreen = true;
                            }
                        } else if ("hardware".equals(localName)) {
                            String text = parser.nextText();
                            if ("false".equals(text)) {
                                EBrowserView.sHardwareAccelerate = false;
                            }
                        }else if ("error".equals(localName)){
                            widgetData.mErrorPath = parser.getAttributeValue(null,
                                    "src");
                        }else if ("splashdialog".equals(localName)){
                            widgetData.setSplashDialogPagePath(parser.getAttributeValue(null,
                                    "src"));
                            widgetData.setSplashDialogPageVersion(parser.getAttributeValue(null,
                                    "version"));
                        }else if("statusbar".equals(localName)){
                            WWidgetData.sStatusBarColor= Color.parseColor(parser.getAttributeValue(null,"color"));
                        } else if ("statusfontblack".equals(localName)) {
                            String text = parser.nextText();
                            if ("true".equals(text)) {
                                WWidgetData.sStatusfontBlack = true;
                            }
                        }else if ("deviceitem".equals(localName)) {
                            String text = parser.nextText();
                            if (!widgetData.noHardwareList.contains(text)) {
                                widgetData.noHardwareList.add(text);
                            }
                        } else if ("widgetonelocation".equals(localName)) {
                            String value = parser.nextText();
                            if (value == null || value.length() == 0) {
                                widgetData.m_widgetOneLocation = 0;
                            } else {
                                widgetData.m_widgetOneLocation = Integer.parseInt(value);
                            }
                            if (!isWidgetOneSBox) {
                                isWidgetOneSBox = widgetData.m_widgetOneLocation == 1 ? true : false;
                            }
                        }
                        break;
                    case XmlPullParser.END_DOCUMENT:

                        needContinue = false;
                        break;
                }
            } while (needContinue);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (is != null) {
                try {
                    is.close();
                    is = null;
                } catch (IOException e1) {
                    // TODO Auto-generated catch block
                    e1.printStackTrace();
                }

            }
        }
        return widgetData;
    }

    public void unZipSpace() {
        if (sRootWgt == null) {
            return;
        }

        new Thread("Appcan-WDataManagerUnZipSpace") {
            public void run() {
                try {
                    if (!ESystemInfo.getIntence().mIsDevelop) {

                        String spacePath = sRootWgt.getWidgetPath()
                                + BUtility.F_APP_MYSPACE;
                        File test = new File(spacePath + "config.xml");
                        if (test.exists()) {
                            return;
                        }
                        unzip(m_context.getAssets().open("space/space.zip"),
                                spacePath, null);
                    }

                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();

                }
            }
        }.start();

    }

    public static boolean unzip(InputStream inputStream, String decompression,
                                String encoding) {
        if (encoding == null || encoding.equals(""))
            encoding = "UTF-8";
        // File infile = new File(compress);
        File dir = new File(decompression);

        try {
            // // 检查是否是ZIP文件
            // ZipFile zip = new ZipFile(infile);
            // zip.close();
            // 建立与目标文件的输入连接
            CnZipInputStream in = new CnZipInputStream(inputStream, encoding);
            ZipEntry file = in.getNextEntry();
            // System.out.println(in.encoding);
            byte[] c = new byte[1024];
            int slen;
            while (file != null) {
                String zename = file.getName();
                if (file.isDirectory()) {
                    File files = new File(dir.getAbsolutePath() + "/" + zename); // 在指定解压路径下建子文件夹
                    // System.out.println(files.getAbsolutePath());
                    files.mkdirs();// 新建文件夹
                } else {
                    File files = new File(dir.getAbsolutePath() + "/" + zename)
                            .getParentFile();// 当前文件所在目录
                    // System.out.println(files.getAbsolutePath());
                    if (!files.exists()) {// 如果目录文件夹不存在，则创建
                        files.mkdirs();
                    }
                    FileOutputStream out = new FileOutputStream(
                            dir.getAbsolutePath() + "/" + zename);
                    while ((slen = in.read(c, 0, c.length)) != -1)
                        out.write(c, 0, slen);
                    out.close();
                }
                // System.out.print(zename+" O.K.\n");
                file = in.getNextEntry();
            }
            in.close();
        } catch (ZipException zipe) {

            return false;
        } catch (IOException ioe) {
            return false;
        } catch (Exception i) {
            return false;
        }
        return true;
    }

    private String getMD5Code(String imei, String widgetOneId, String appId,
                              String ver, String channelCode) {
        try {
            if (imei == null || imei.length() == 0) {
                return null;
            }
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.reset();
            md.update(imei.getBytes());
            md.update(WIDGET_REG_KEY_1.getBytes());
            md.update(widgetOneId.getBytes());
            md.update(WIDGET_REG_KEY_2.getBytes());
            md.update(appId.getBytes());
            md.update(WIDGET_REG_KEY_3.getBytes());
            md.update(ver.getBytes());
            md.update(WIDGET_REG_KEY_4.getBytes());
            md.update(channelCode.getBytes());
            byte[] md5Bytes = md.digest();
            StringBuffer hexValue = new StringBuffer();
            for (int i = 0; i < md5Bytes.length; i++) {
                int val = ((int) md5Bytes[i]) & 0xff;
                if (val < 16)
                    hexValue.append("0");
                hexValue.append(Integer.toHexString(val));
            }
            return hexValue.toString();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    private void deleteFile(File file) {
        if (file.exists()) {
            if (file.isFile()) {
                file.delete();
            } else if (file.isDirectory()) {
                File files[] = file.listFiles();
                for (int i = 0; i < files.length; i++) {
                    this.deleteFile(files[i]);
                }
            }
            file.delete();
        }
    }
}
