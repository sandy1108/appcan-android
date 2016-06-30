package org.zywx.wbpalmstar.engine.universalex;

import android.content.pm.PackageInfo;
import android.content.res.AssetManager;
import android.content.res.Resources;
import dalvik.system.DexClassLoader;

public class PluginInfo {
	/**
	 * 
	 */
	public final static int TYPE_STATIC = 0;
	public final static int TYPE_DEX = 1;
	public final static int TYPE_DYNAMIC = 2;

	private int type;
	private String version;
	private int buildVersion;

	public String packageName;
	public String defaultActivity;
	public DexClassLoader classLoader;
	public AssetManager assetManager;
	public Resources resources;
	public PackageInfo packageInfo;
}
