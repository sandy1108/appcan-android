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

import android.os.Parcel;
import android.os.Parcelable;

import org.zywx.wbpalmstar.base.BDebug;
import org.zywx.wbpalmstar.base.vo.WidgetConfigVO.IndexWindowOptionsVO;

import java.util.ArrayList;

public class WWidgetData implements Parcelable,Cloneable {

    // m_wgtType定义widget类型
    /**
     * 主Widget标识
     */
    public static final int WGT_TYPE_MAIN = 0;
    /**
     * EMM应用商店下发的常规子Widget标识
     */
    public static final int WGT_TYPE_SUB = 2;
    /**
     * 预置在主widget内部的plugin子widget标识（widget/plugin/）
     */
    public static final int WGT_TYPE_PLUGIN = 3;
    /**
     * 动态配置的子widget，一般为云应用
     */
    public static final int WGT_TYPE_CLOUD = 4;

    // 表示我的空间按钮显示，单击按钮进入我的空间
    public static final int F_SPACESTATUS_OPEN = 0x1;

    // 表示我的空间功能关闭
    public static final int F_SPACESTATUS_CLOSE = 0x2;

    // 表示开我的空间内的更多按钮显示
    public static final int F_MYSPACEMOREAPP_OPEN = 0x4;
    // 表示开我的空间内的更多按钮不显示
    public static final int F_MYSPACEMOREAPP_CLOSE = 0x8;

    // 广告开启
    public static final int F_WIDGETADSTATUS_OPEN = 1;
    // 广告关闭
    public static final int F_WIDGETADSTATUS_CLOSE = 0;

    public static final String TAG_WIN_BG = "windowbackground";
    public static final String TAG_WIN_BG_OPAQUE = "opaque";
    public static final String TAG_WIN_BG_COLOR = "bgColor";
    // 数据库中的主键id
    public int m_id;
    // 手机端WidgetOne系统的唯一标识
    public String m_widgetOneId;
    // 应用软件唯一的标识，对于不同的手机或者同一手机上的不同应用，该值唯一
    public String m_widgetId;
    // 应用程序标识
    public String m_appId;
    // Widget版本号（String类型）
    public String m_ver;
    // 渠道号
    public String m_channelCode;
    // 手机IMEI号码
    public String m_imei;
    // 上传参数校验码
    public String m_md5Code;
    // widget 名称
    public String m_widgetName;
    //
    public String m_description;
    //
    public String m_email;
    //
    public String m_author;
    //
    public String m_license;
    // widget 的Icon 路径
    public String m_iconPath;
    // widget 在sdcard的路径
    public String m_widgetPath;
    // widget首页 路径
    public String m_indexUrl;
    // 是否加密
    public int m_obfuscation;
    // 全局加密开关（用于强制主应用和所有子应用开启和关闭加密开关，适用于某些特殊情况下，子应用未加密但是开关不统一的情况）
    public int m_globalObfuscation = -1; // 默认值-1，代表没有配置此开关，忽略之。
    // log服务器ip
    public String m_logServerIp;
    // widget类型（0-主widget；1-我的空间；2-空间的widget；3-Plug-in）
    public int m_wgtType;
    // widget更新地址
    public String m_updateurl;
    // 主widget是否显示space:(0：表示我的空间功能关闭;1：表示我的空间按钮显示，单击按钮进入我的空间;2：表示开启我的空间二级菜单功能，可展开二级菜单)
    public int m_spaceStatus;
    //
    public int m_orientation = 1;
    // 是否显示广告(0,关闭；1，开启)
    public int m_widgetAdStatus;
    // 是否是webApp(0-不是; 1-是)
    public int m_webapp = 0;
    // 进度条颜色1
    public String mProgressColor1 = null;
    // 进度条颜色2
    public String mProgressColor2 = null;
    /**
     * 被禁用的插件
     * @deprecated
     */
    public String[] disablePlugins;
    public ArrayList<String> disablePluginsList = new ArrayList<String>();
    /**
     * 被禁用的窗口
     * @deprecated
     */
    public String[] disableRootWindows;
    public ArrayList<String> disableRootWindowsList = new ArrayList<String>();
    /**
     * 被禁用的子窗口
     * @deprecated
     */
    public String[] disableSonWindows;
    public ArrayList<String> disableSonWindowsList = new ArrayList<String>();

    public ArrayList<String> noHardwareList = new ArrayList<String>();
    public String m_appkey;

    public int m_appdebug = 0;//是否开启debug模式，0：关闭，1：开启

    public String m_opaque = "";

    public String m_bgColor = "#00000000";
    public int m_widgetOneLocation = 0;  //0:SD卡; 1:沙箱; 默认SD卡
    public static int m_remove_loading = 1;//1,引擎关闭loading页；0，web调接口关闭loading页

    public static boolean sFullScreen = false;//是否全屏

    public String mErrorPath;//页面加载错误时的错误页面路径

    public String splashDialogPagePath;//App首次启动提示对话框页面路径

    public String splashDialogPageVersion;//App首次启动提示对话框页面版本，用于决定何时需要再次显示

    public static int sStatusBarColor=-16777216;
    public static boolean sStatusfontBlack = false;//状态栏上字体的颜色
    public IndexWindowOptionsVO m_indexWindowOptions;//root窗口的相关配置参数，目前用于公众号样式窗口的配置

    public static final Parcelable.Creator<WWidgetData> CREATOR = new Creator<WWidgetData>() {
        public WWidgetData createFromParcel(Parcel source) {
            WWidgetData widget = new WWidgetData();
            widget.m_id = source.readInt();
            widget.m_widgetOneId = source.readString();
            widget.m_widgetId = source.readString();
            widget.m_appId = source.readString();
            widget.m_ver = source.readString();
            widget.m_channelCode = source.readString();
            widget.m_imei = source.readString();
            widget.m_md5Code = source.readString();
            widget.m_widgetName = source.readString();
            widget.m_description = source.readString();
            widget.m_email = source.readString();
            widget.m_author = source.readString();
            widget.m_license = source.readString();
            widget.m_iconPath = source.readString();
            widget.m_widgetPath = source.readString();
            widget.m_indexUrl = source.readString();
            widget.m_obfuscation = source.readInt();
            widget.m_globalObfuscation = source.readInt();
            widget.m_logServerIp = source.readString();
            widget.m_wgtType = source.readInt();
            widget.m_updateurl = source.readString();
            widget.m_spaceStatus = source.readInt();
            widget.m_orientation = source.readInt();
            widget.m_widgetAdStatus = source.readInt();
            widget.m_webapp = source.readInt();
            widget.mProgressColor1 = source.readString();
            widget.mProgressColor2 = source.readString();
            widget.m_opaque = source.readString();
            widget.m_bgColor = source.readString();
            widget.m_appkey = source.readString();
            widget.mErrorPath=source.readString();
            widget.splashDialogPagePath=source.readString();
            widget.splashDialogPageVersion=source.readString();
            widget.m_appdebug=source.readInt();
            widget.m_widgetOneLocation = source.readInt();
            if (widget.disablePluginsList != null) {
                source.readStringList(widget.disablePluginsList);
            }
            if (widget.disableRootWindowsList != null) {
                source.readStringList(widget.disableRootWindowsList);
            }
            if (widget.disableSonWindowsList != null) {
                source.readStringList(widget.disableSonWindowsList);
            }
            if (widget.noHardwareList != null) {
                source.readStringList(widget.noHardwareList);
            }
            return widget;
        }

        public WWidgetData[] newArray(int size) {
            return new WWidgetData[size];
        }
    };

    public int describeContents() {
        return 0;
    }

    public String getWidgetPath() {

        return m_widgetPath;
    }

    public boolean getOpaque() {
        return Boolean.valueOf(m_opaque);
    }

    public int getSpaceStatus() {
        if ((m_spaceStatus & F_SPACESTATUS_OPEN) == F_SPACESTATUS_OPEN) {
            return F_SPACESTATUS_OPEN;
        } else {
            return F_SPACESTATUS_CLOSE;
        }
    }

    public int getSpaceMoreAppStatus() {
        if ((m_spaceStatus & F_MYSPACEMOREAPP_OPEN) == F_MYSPACEMOREAPP_OPEN) {
            return F_MYSPACEMOREAPP_OPEN;
        } else {
            return F_MYSPACEMOREAPP_CLOSE;
        }
    }

    public String getSplashDialogPagePath() {
        return splashDialogPagePath;
    }

    public void setSplashDialogPagePath(String splashDialogPagePath) {
        this.splashDialogPagePath = splashDialogPagePath;
    }

    public String getSplashDialogPageVersion() {
        return splashDialogPageVersion;
    }

    public void setSplashDialogPageVersion(String splashDialogPageVersion) {
        this.splashDialogPageVersion = splashDialogPageVersion;
    }

    public void writeToParcel(Parcel parcel, int flags) {
        parcel.writeInt(m_id);
        parcel.writeString(m_widgetOneId);
        parcel.writeString(m_widgetId);
        parcel.writeString(m_appId);
        parcel.writeString(m_ver);
        parcel.writeString(m_channelCode);
        parcel.writeString(m_imei);
        parcel.writeString(m_md5Code);
        parcel.writeString(m_widgetName);
        parcel.writeString(m_description);
        parcel.writeString(m_email);
        parcel.writeString(m_author);
        parcel.writeString(m_license);
        parcel.writeString(m_iconPath);
        parcel.writeString(m_widgetPath);
        parcel.writeString(m_indexUrl);
        parcel.writeInt(m_obfuscation);
        parcel.writeInt(m_globalObfuscation);
        parcel.writeString(m_logServerIp);
        parcel.writeInt(m_wgtType);
        parcel.writeString(m_updateurl);
        parcel.writeInt(m_spaceStatus);
        parcel.writeInt(m_orientation);
        parcel.writeInt(m_widgetAdStatus);
        parcel.writeInt(m_webapp);
        parcel.writeString(mProgressColor1);
        parcel.writeString(mProgressColor2);
        parcel.writeString(m_opaque);
        parcel.writeString(m_bgColor);
        parcel.writeString(m_appkey);
        parcel.writeString(mErrorPath);
        parcel.writeString(splashDialogPagePath);
        parcel.writeString(splashDialogPageVersion);
        parcel.writeInt(m_appdebug);
        parcel.writeInt(m_widgetOneLocation);
        parcel.writeStringList(disablePluginsList);
        parcel.writeStringList(disableRootWindowsList);
        parcel.writeStringList(disableSonWindowsList);
        parcel.writeStringList(noHardwareList);
    }

    @Override
    public String toString() {
        StringBuffer sb = new StringBuffer();
        sb.append("widgetInfo: ");
        sb.append("\n");
        sb.append("m_id: " + m_id);
        sb.append("\n");
        sb.append("m_widgetOneId: " + m_widgetOneId);
        sb.append("\n");
        sb.append("m_widgetId: " + m_widgetId);
        sb.append("\n");
        sb.append("m_appId: " + m_appId);
        sb.append("\n");
        sb.append("m_ver: " + m_ver);
        sb.append("\n");
        sb.append("m_channelCode: " + m_channelCode);
        sb.append("\n");
        sb.append("m_imei: " + m_imei);
        sb.append("\n");
        sb.append("m_md5Code: " + m_md5Code);
        sb.append("\n");
        sb.append("m_widgetName: " + m_widgetName);
        sb.append("\n");
        sb.append("m_description: " + m_description);
        sb.append("\n");
        sb.append("m_email: " + m_email);
        sb.append("\n");
        sb.append("m_author: " + m_author);
        sb.append("\n");
        sb.append("m_license: " + m_license);
        sb.append("\n");
        sb.append("m_iconPath: " + m_iconPath);
        sb.append("\n");
        sb.append("m_widgetPath: " + m_widgetPath);
        sb.append("\n");
        sb.append("m_indexUrl: " + m_indexUrl);
        sb.append("\n");
        sb.append("m_obfuscation: " + m_obfuscation);
        sb.append("\n");
        sb.append("m_globalObfuscation: " + m_globalObfuscation);
        sb.append("\n");
        sb.append("m_opaque: " + m_opaque);
        sb.append("\n");
        sb.append("m_bgColor: " + m_bgColor);
        sb.append("\n");
        sb.append("m_logServerIp: " + m_logServerIp);
        sb.append("\n");
        sb.append("m_wgtType: " + m_wgtType);
        sb.append("\n");
        sb.append("m_updateurl: " + m_updateurl);
        sb.append("\n");
        sb.append("m_spaceStatus: " + m_spaceStatus);
        sb.append("\n");
        sb.append("m_orientation: " + m_orientation);
        sb.append("\n");
        sb.append("m_widgetAdStatus: " + m_widgetAdStatus);
        sb.append("\n");
        sb.append("m_webapp: " + m_webapp);
        sb.append("\n");
        sb.append("mProgressColor1: " + mProgressColor1);
        sb.append("\n");
        sb.append("mProgressColor2: " + mProgressColor2);
        sb.append("\n");
        sb.append("m_appkey: " + m_appkey);
        sb.append("\n");
        sb.append("m_id: " + m_id);
        sb.append("\n");
        sb.append("m_id: " + m_id);
        sb.append("\n");
        sb.append("m_remove_loading:" + m_remove_loading);
        sb.append("\n");
        sb.append("mErrorPath:" + mErrorPath);
        sb.append("\n");
        sb.append("splashDialogPagePath:" + splashDialogPagePath);
        sb.append("\n");
        sb.append("splashDialogPageVersion:" + splashDialogPageVersion);
        sb.append("\n");
        sb.append("m_widgetOneLocation: " + m_widgetOneLocation);
        sb.append("\n");
        return sb.toString();
    }

    @Override
    public WWidgetData clone() {
        try {
            return (WWidgetData) super.clone();
        } catch (CloneNotSupportedException e) {
            if (BDebug.DEBUG){
                e.printStackTrace();
            }
            return null;
        }
    }

}
