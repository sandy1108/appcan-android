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


import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.annotation.RequiresApi;
import android.text.TextUtils;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebStorage.QuotaUpdater;
import android.webkit.WebView;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.Toast;

import org.zywx.wbpalmstar.base.BDebug;
import org.zywx.wbpalmstar.base.BUtility;
import org.zywx.wbpalmstar.base.WebViewSdkCompat;
import org.zywx.wbpalmstar.base.vo.ValueCallbackVO;
import org.zywx.wbpalmstar.engine.callback.IActivityCallback;
import org.zywx.wbpalmstar.engine.universalex.EUExManager;
import org.zywx.wbpalmstar.engine.universalex.EUExScript;
import org.zywx.wbpalmstar.engine.universalex.EUExUtil;
import org.zywx.wbpalmstar.widgetone.dataservice.WDataManager;

import java.io.File;


public class CBrowserMainFrame7 extends WebChromeClient implements IActivityCallback {

    final long MAX_QUOTA = 104857600L;

    private static final String TAG = "CBrowserMainFrame7";

    private AlertDialog mGeoPromptAlertDialog;
    private AlertDialog mResourcesPromptAlertDialog;

    public static final int REQUEST_SELECT_FILE = 100;
    public static final int FILECHOOSER_RESULTCODE = 101;
    public static final int REQUEST_CAPTURE_PICTURE = 102;

    public static final int REQUEST_PERMISSION_CAPTURE_PICTURE = 202;

    /**
     * 用于接收文件选择结果的回调（Api21以下）
     */
    private WebViewSdkCompat.ValueCallback<Uri> mUploadMessage;
    /**
     * 用于接收文件选择结果的回调（Api21以上）
     */
    private ValueCallbackVO mValueCallbackVO;

    private final Handler mainThreadHandler;
    private Context mContext;

    public CBrowserMainFrame7(Context context) {
        this.mContext = context;
        mainThreadHandler = new Handler(Looper.myLooper());
    }

    @Override
    public void onProgressChanged(WebView view, int newProgress) {
        if (view != null) {
            EBrowserView target = (EBrowserView) view;
//            EBrowserWindow bWindow = target.getBrowserWindow();
//            if (bWindow != null) {
//                bWindow.setGlobalProgress(newProgress);
//                if (100 == newProgress) {
//                    bWindow.hiddenProgress();
//                }
//            }
            EBrowserView.WebProgressHandler webProgressHandler = target.getWebProgressHandler();
            if (webProgressHandler != null) {
                webProgressHandler.changeLoadingWebProgressValue(newProgress);
            }
        }
    }

    @Override
    public boolean onJsAlert(WebView view, String url, String message, final JsResult result) {
        if (!((EBrowserActivity) view.getContext()).isVisable()) {
            result.confirm();
        }
        AlertDialog.Builder dia = new AlertDialog.Builder(view.getContext());
        dia.setTitle(EUExUtil.getResStringID("prompt"));
        dia.setMessage(message);
        dia.setCancelable(false);
        dia.setPositiveButton(EUExUtil.getResStringID("confirm"), new DialogInterface.OnClickListener() {
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
        if (!((EBrowserActivity) view.getContext()).isVisable()) {
            result.cancel();
            return true;
        }
        AlertDialog.Builder dia = new AlertDialog.Builder(view.getContext());
        dia.setMessage(message);
        dia.setTitle(EUExUtil.getResStringID("prompt"));
        dia.setCancelable(false);
        dia.setPositiveButton(EUExUtil.getResStringID("confirm"),
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        result.confirm();
                    }
                });
        dia.setNegativeButton(EUExUtil.getResStringID("cancel"),
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
            appCanJsParse(result, view,
                    message.substring(EUExScript.JS_APPCAN_ONJSPARSE.length()));
            result.cancel();
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
            dia.setPositiveButton(EUExUtil.getResStringID("confirm"),
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            result.confirm(input.getText().toString());
                        }
                    });
            dia.setNegativeButton(EUExUtil.getResStringID("cancel"),
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            result.cancel();
                        }
                    });
            dia.create();
            dia.show();
        }
        return true;
    }

    /**
     * 用于解析基于prompt的AppCanJS桥。
     *（由于此方式存在字符串最大上限10240个字符的问题，已经不再使用，具体控制在于EUExScript中的JS注入。）
     *
     */
    private void appCanJsParse(final JsPromptResult result, WebView view, String parseStr) {
        try {
            if (!(view instanceof EBrowserView)) {
                return;
            }
            EBrowserView browserView = (EBrowserView) view;
            final EUExManager uexManager = browserView.getEUExManager();
            if (uexManager != null) {
                result.confirm(uexManager.dispatch(parseStr));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public WebViewSdkCompat.ValueCallback<Uri> getCompatCallback(final ValueCallback<Uri> uploadMsg){
        return new WebViewSdkCompat.ValueCallback<Uri>() {
            @Override
            public void onReceiveValue(Uri uri) {
                uploadMsg.onReceiveValue(uri);
            }
        };
    }

    @Override
    public void onHideCustomView() {
        ((EBrowserActivity) mContext).hideCustomView();
    }

    @Override
    public Bitmap getDefaultVideoPoster() {
        String packg = mContext.getPackageName();
        Resources res = mContext.getResources();
        int id = res.getIdentifier("plugin_file_video", "drawable", packg);
        Bitmap map = BitmapFactory.decodeResource(res, id);
        return map;
    }

    @Override
    public View getVideoLoadingProgressView() {
        EBrowserToast progress = new EBrowserToast(mContext);
        progress.setMsg(mContext.getString(EUExUtil.getResStringID("platform_myspace_loading")));
        progress.setInLargeModul();
        progress.showProgress();
        return progress;
    }

    @Override
    public void onShowCustomView(View view, int requestedOrientation, final CustomViewCallback callback) {
        FrameLayout container = new FrameLayout(mContext);
        container.setBackgroundColor(0xff000000);
        FrameLayout.LayoutParams parm = new FrameLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT);
        container.setLayoutParams(parm);
        container.setClickable(true);
        container.addView(view);
        WebViewSdkCompat.CustomViewCallback compatCallback= callback::onCustomViewHidden;
        ((EBrowserActivity) mContext).showCustomView(container, compatCallback);
    }

    @Override
    public void onShowCustomView(View view, final CustomViewCallback callback) {
        FullscreenHolder container = new FullscreenHolder(mContext);
        FrameLayout.LayoutParams parm = new FrameLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT);
        container.setLayoutParams(parm);
        container.addView(view);
        WebViewSdkCompat.CustomViewCallback compatCallback= callback::onCustomViewHidden;
        ((EBrowserActivity) mContext).showCustomView(container, compatCallback);
    }

    static class FullscreenHolder extends FrameLayout {

        public FullscreenHolder(Context ctx) {
            super(ctx);
            setBackgroundColor(0xFF000000);
        }

        @Override
        public boolean onTouchEvent(MotionEvent evt) {
            return true;
        }

    }

    @Override
    public void onExceededDatabaseQuota(String url, String databaseIdentifier, long currentQuota, long estimatedSize, long totalUsedQuota,
                                        QuotaUpdater quotaUpdater) {
        if (estimatedSize < MAX_QUOTA) {
            long newQuota = estimatedSize;
            quotaUpdater.updateQuota(newQuota * 2);
        } else {
            quotaUpdater.updateQuota(currentQuota);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(requestCode == REQUEST_SELECT_FILE) {
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP){
                if (mValueCallbackVO == null){
                    return;
                }
                WebViewSdkCompat.ValueCallback<Uri[]> api21UploadMessage = mValueCallbackVO.getValueCallbackForApi21();
                api21UploadMessage.onReceiveValue(WebViewSdkCompat.fileChooserParamsParseResult(resultCode, data));
                mValueCallbackVO = null;
            }

        } else if(requestCode == REQUEST_CAPTURE_PICTURE){
            if (mValueCallbackVO == null){
                return;
            }
            Uri[] uriResult = WebViewSdkCompat.fileChooserParamsParseResult(resultCode, data);
            if (uriResult == null){
                String imgSaveUrl = mValueCallbackVO.getCameraImgSaveUrl();
                if (!TextUtils.isEmpty(imgSaveUrl) && new File(imgSaveUrl).exists()){
                    Uri imgSaveUri = Uri.fromFile(new File(imgSaveUrl));
                    uriResult = new Uri[]{imgSaveUri};
                }
            }
            WebViewSdkCompat.ValueCallback<Uri[]> api21UploadMessage = mValueCallbackVO.getValueCallbackForApi21();
            api21UploadMessage.onReceiveValue(uriResult);
            mValueCallbackVO = null;
        } else if (requestCode == FILECHOOSER_RESULTCODE) {
            if (null == mUploadMessage)
                return;
            Uri result = data == null || resultCode != Activity.RESULT_OK ? null : data.getData();
            mUploadMessage.onReceiveValue(result);
            mUploadMessage = null;
        }
    }

    @Override
    public void onRequestPermissionResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode == REQUEST_PERMISSION_CAPTURE_PICTURE){
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
                // note: 如果直接在监听权限授权的方法中执行相机，当首次执行时，可能由于权限还未彻底授权完成，最终则无法收到onActivityResult。小米华为均测试如此。故使用了handler将操作带入下一个loop执行，则不会有此问题。
                mainThreadHandler.post(this::openCameraForImageCapture);
            }else{
                Toast.makeText(mContext, EUExUtil.getResStringID("ac_engine_webview_file_chooser_request_camera_permission_denied"), Toast.LENGTH_LONG).show();
                if (mValueCallbackVO != null){
                    WebViewSdkCompat.ValueCallback<Uri[]> uploadMessage = mValueCallbackVO.getValueCallbackForApi21();
                    // 兼容特殊情况下上次文件上传发生异常的情况，可能导致callback依然保持，需要给一个结果，才能继续下一个上传
                    if (uploadMessage != null) {
                        uploadMessage.onReceiveValue(null);
                    }
                    mValueCallbackVO = null;
                }
            }
        }
    }

    /**
     * 打开相机捕获图片的操作
     */
    private void openCameraForImageCapture(){
        Uri imageUri;
        String filePath = mContext.getExternalFilesDir(Environment.DIRECTORY_PICTURES) + File.separator;
        BDebug.i(TAG, "openActionDialog DIRECTORY_PICTURES=" + filePath);
        String fileName = "appcan_engine_capture_" + System.currentTimeMillis()+ ".jpg";
        String imageDstUrl = filePath + fileName;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            imageUri = BUtility.getUriForFileWithFileProvider(mContext, imageDstUrl);
        } else {
            imageUri = Uri.fromFile(new File(imageDstUrl));
        }
        Intent chooserIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        chooserIntent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
        BDebug.i(TAG, "openActionDialog EXTRA_OUTPUT=" + imageUri);
        chooserIntent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        chooserIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        ((EBrowserActivity)mContext).startActivityForResult(CBrowserMainFrame7.this, chooserIntent, REQUEST_CAPTURE_PICTURE);
        // 记住指定的照片位置，直接使用。否则onActivityResult中无法返回地址。
        if (mValueCallbackVO != null){
            mValueCallbackVO.setCameraImgSaveUrl(imageDstUrl);
        }
    }

    // For Android 3.0-
    public void openFileChooser(ValueCallback<Uri> uploadMsg) {
        openFileChooser(uploadMsg, null, null);
    }

    // For Android 3.0+
    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
        openFileChooser(uploadMsg, acceptType, null);
    }

    // For Android 4.1
    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
        // 兼容特殊情况下上次文件上传发生异常的情况，可能导致callback依然保持，需要给一个结果，才能继续下一个上传
        if (mUploadMessage != null) {
            mUploadMessage.onReceiveValue(null);
        }
        mUploadMessage = getCompatCallback(uploadMsg);
        // 前往选择文件
        String title = EUExUtil.getString("ac_engine_webview_file_chooser_title");
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        if (!TextUtils.isEmpty(acceptType)){
            i.setType(acceptType);
        }else{
            i.setType("*/*");
        }
        try {
            ((EBrowserActivity)mContext).startActivityForResult(this, Intent.createChooser(i, title), FILECHOOSER_RESULTCODE);
        } catch (Exception e) {
            BDebug.w(TAG, "openFileChooser exception", e);
            uploadMsg.onReceiveValue(null);
        }
    }

    /**
     * API21以上选择文件走这里
     * 需要注意的一个区别在于ValueCallback的泛型不同
     *
     * @param webView webview实例
     * @param filePathCallback 选择回调
     * @param fileChooserParams 选择文件的类型
     * @return
     */
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
        if (mValueCallbackVO != null){
            WebViewSdkCompat.ValueCallback<Uri[]> uploadMessage = mValueCallbackVO.getValueCallbackForApi21();
            // 兼容特殊情况下上次文件上传发生异常的情况，可能导致callback依然保持，需要给一个结果，才能继续下一个上传
            if (uploadMessage != null) {
                uploadMessage.onReceiveValue(null);
            }
        }
        openActionDialog(fileChooserParams, filePathCallback);
        return true;
    }

    /**
     * 打开拍照或选择文件的选择对话框
     *
     * @param fileChooserParams
     * @param filePathCallback
     */
    private void openActionDialog(WebChromeClient.FileChooserParams fileChooserParams,
                                  final ValueCallback<Uri[]> filePathCallback) {
        String[] acceptTypes = fileChooserParams.getAcceptTypes();
        boolean isImage = false;
        // 判断所需文件类型是否为图片
        if (acceptTypes != null){
            for (String acceptType : acceptTypes){
                if (!TextUtils.isEmpty(acceptType) && acceptType.contains("image")){
                    isImage = true;
                    break;
                }
            }
        }

        // 前往选择文件
        final String title = EUExUtil.getString("ac_engine_webview_file_chooser_title");
        AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
        //设置标题
        builder.setTitle(title);
        builder.setCancelable(false);
        //底部的取消按钮
        builder.setNegativeButton(EUExUtil.getString("cancel"), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if(filePathCallback != null){
                    filePathCallback.onReceiveValue(null);
                    mValueCallbackVO = null;
                }
            }
        });
        String[] buttonItems;
        // 如果是图片，则需要提供给用户选择拍照功能。否则只有跳转文件选择界面。
        if (isImage){
            buttonItems = new String[]{EUExUtil.getString("ac_engine_webview_file_chooser_gallery"), EUExUtil.getString("ac_engine_webview_file_chooser_camera")};
        }else{
            buttonItems = new String[]{EUExUtil.getString("ac_engine_webview_file_chooser_file_manager")};
        }
        builder.setItems(buttonItems, new DialogInterface.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
            @Override
            public void onClick(DialogInterface dialog, int which) {

                switch (which) {
                    //从本地文件选择
                    case 0:
                        dialog.dismiss();
                        // TODO 此处还应当进一步处理fileChooserParams的多种情况，目前暂未实现。仅实现了单选文件。
                        // 前往选择文件
                        try {
                            Intent i = fileChooserParams.createIntent();
                            ((EBrowserActivity)mContext).startActivityForResult(CBrowserMainFrame7.this, Intent.createChooser(i, title), REQUEST_SELECT_FILE);
                            // 保存回调
                            mValueCallbackVO = new ValueCallbackVO(getApi21CompatCallback(filePathCallback));
                        } catch (Exception e) {
                            BDebug.w(TAG, "onShowFileChooser openActionDialog exception", e);
                            filePathCallback.onReceiveValue(null);
                            mValueCallbackVO = null;
                        }
                        break;
                    //从相机拍照获得
                    case 1:
                        dialog.dismiss();
                        // 保存回调
                        mValueCallbackVO = new ValueCallbackVO(getApi21CompatCallback(filePathCallback));
                        // 请求相机权限，然后在权限获取后继续调用相机。
                        ((EBrowserActivity)mContext).requsetPerssions(Manifest.permission.CAMERA,
                                CBrowserMainFrame7.this,
                                EUExUtil.getString("ac_engine_webview_file_chooser_request_camera_permission"),
                                REQUEST_PERMISSION_CAPTURE_PICTURE);
                        break;
                }
            }
        }).create().show();
    }

    @Override
    public void onGeolocationPermissionsHidePrompt() {
        // 这里需要对应的隐藏交互对话框。
        // 因为页面跳转等原因取消了请求时，会进行此回调
        if (mGeoPromptAlertDialog != null && mGeoPromptAlertDialog.isShowing()){
            mGeoPromptAlertDialog.dismiss();
            mGeoPromptAlertDialog = null;
        }
    }

    @Override
    public void onGeolocationPermissionsShowPrompt(final String origin, final GeolocationPermissions.Callback callback) {
        AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
        // 是否允许获取您的位置信息?
        builder.setMessage(EUExUtil.getString("ac_engine_webview_prompt_to_request_location_permission"));
        DialogInterface.OnClickListener dialogButtonOnClickListener = new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int clickedButton) {
                if (DialogInterface.BUTTON_POSITIVE == clickedButton) {
                    callback.invoke(origin, true, true);
                } else if (DialogInterface.BUTTON_NEGATIVE == clickedButton) {
                    callback.invoke(origin, false, false);
                }
            }
        };
        builder.setPositiveButton(EUExUtil.getString("ac_engine_webview_allow"), dialogButtonOnClickListener);
        builder.setNegativeButton(EUExUtil.getString("ac_engine_webview_deny"), dialogButtonOnClickListener);
        mGeoPromptAlertDialog = builder.create();
        mGeoPromptAlertDialog.show();
    }

    /**
     * 权限申请的可读文字转换
     *
     * @param permissionRes WebView返回的权限Resource
     */
    private String parsePermissionName(String permissionRes){
        if (permissionRes == null){
            return null;
        }else if (permissionRes.equals(PermissionRequest.RESOURCE_VIDEO_CAPTURE)){
            return EUExUtil.getString("ac_engine_webview_prompt_to_request_video");
        }else if (permissionRes.equals(PermissionRequest.RESOURCE_AUDIO_CAPTURE)){
            return EUExUtil.getString("ac_engine_webview_prompt_to_request_audio");
        }else{
            String permissionResStr = EUExUtil.getString("ac_engine_webview_prompt_to_request_unknown") + permissionRes;
            return permissionResStr;
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onPermissionRequest(final PermissionRequest request) {
        AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
        // 是否授权本页面访问以下资源？
        StringBuilder messageStrb = new StringBuilder();
        messageStrb.append(EUExUtil.getString("ac_engine_webview_prompt_to_request_resource_permission"));
        String[] resources = request.getResources();
        if (resources != null){
            for (String res : resources){
                String resStr = parsePermissionName(res);
                messageStrb.append("\r\n");
                messageStrb.append(resStr);
            }
        }
        builder.setMessage(messageStrb.toString());
        DialogInterface.OnClickListener dialogButtonOnClickListener = (dialog, clickedButton) -> {
            if (DialogInterface.BUTTON_POSITIVE == clickedButton) {
                request.grant(request.getResources());
            } else if (DialogInterface.BUTTON_NEGATIVE == clickedButton) {
                request.deny();
            }
        };
        builder.setPositiveButton(EUExUtil.getString("ac_engine_webview_allow"), dialogButtonOnClickListener);
        builder.setNegativeButton(EUExUtil.getString("ac_engine_webview_deny"), dialogButtonOnClickListener);
        mResourcesPromptAlertDialog = builder.create();
        mResourcesPromptAlertDialog.show();
    }

    @Override
    public void onPermissionRequestCanceled(PermissionRequest request) {
        // 因为页面跳转等原因取消了请求时，会进行此回调
        if (mResourcesPromptAlertDialog != null && mResourcesPromptAlertDialog.isShowing()){
            mResourcesPromptAlertDialog.dismiss();
            mResourcesPromptAlertDialog = null;
        }
    }

    @Override
    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
        if (WDataManager.sRootWgt!=null&&WDataManager.sRootWgt.m_appdebug==1 && !TextUtils.isEmpty(WDataManager.sRootWgt.m_logServerIp)) {
            if (consoleMessage.messageLevel() != ConsoleMessage.MessageLevel.WARNING) {//过滤掉warning
                BDebug.sendUDPLog(formatConsole(consoleMessage));
            }
        }
        return super.onConsoleMessage(consoleMessage);
    }

    private static String formatConsole(ConsoleMessage consoleMessage){
        StringBuilder stringBuilder=new StringBuilder();
        stringBuilder.append("[ ")
                .append(simpleSourceInfo(consoleMessage.sourceId()))
                .append(" line : ")
                .append(consoleMessage.lineNumber())
                .append(" ")
                .append(consoleMessage.messageLevel().toString().toLowerCase())
                .append(" ]\n")
                .append(consoleMessage.message())
                .append("\n");
        return stringBuilder.toString();
    }


    private static String simpleSourceInfo(String source){
        if (TextUtils.isEmpty(source)){
            return "";
        }
        if (source.contains("/")){
            return source.substring(source.lastIndexOf("/")+1);
        }
        return source;
    }

    private WebViewSdkCompat.ValueCallback<Uri[]> getApi21CompatCallback(final ValueCallback<Uri[]> uploadMsg){
        return new WebViewSdkCompat.ValueCallback<Uri[]>() {
            @Override
            public void onReceiveValue(Uri[] uri) {
                uploadMsg.onReceiveValue(uri);
            }
        };
    }
}
