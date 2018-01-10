package org.zywx.wbpalmstar.engine.mpwindow;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.MeasureSpec;
import android.view.View.OnClickListener;
import android.view.ViewGroup.LayoutParams;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.PopupWindow.OnDismissListener;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;
import org.zywx.wbpalmstar.base.vo.WindowOptionsVO;
import org.zywx.wbpalmstar.widgetone.uex.R;

@SuppressLint({ "ResourceAsColor", "ShowToast" })
public class MPPopMenu {

	public interface PopMenuClickListener {
		public void onClick(String itemJsonData);
	}

	private Context mContext;
	private PopupWindow mPopupWindow;
	private LinearLayout mMenuListLayout;
	private int mWidth, mHeight;
	private View mContainerView;
	private PopMenuClickListener mPopMenuClickListener;

	public MPPopMenu(Context context, WindowOptionsVO.MPWindowMenuVO menuVO, int width, int height, PopMenuClickListener popMenuClickListener) {
		this.mContext = context;
		this.mWidth = width;
		this.mHeight = height;
		mPopMenuClickListener = popMenuClickListener;
		mContainerView = LayoutInflater.from(context).inflate(R.layout.platform_mp_window_popmenu_item, null);
		LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT, 1.0f);
		mContainerView.setLayoutParams(lp);
		// 设置 listview
		mMenuListLayout = (LinearLayout) mContainerView.findViewById(R.id.platform_mp_window_menu_items_container);
		try {
			setSubMenu();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		mMenuListLayout.setBackgroundColor(Color.parseColor("#ff646464"));
		mMenuListLayout.setFocusableInTouchMode(true);
		mMenuListLayout.setFocusable(true);
		mPopupWindow = new PopupWindow(mContainerView, width == 0 ? LayoutParams.WRAP_CONTENT : width, height == 0 ? LayoutParams.WRAP_CONTENT : height);
	}

	// 下拉式 弹出 pop菜单 parent 右下角
	public void showAsDropDown(View parent) {
		mPopupWindow.setBackgroundDrawable(new ColorDrawable());
		mPopupWindow.showAsDropDown(parent);
		// 设置允许在外点击消失
		mPopupWindow.setOutsideTouchable(true);
		// 使其聚集
		mPopupWindow.setFocusable(true);
		// 刷新状态
		mPopupWindow.update();

		mPopupWindow.setOnDismissListener(new OnDismissListener() {

			// 在dismiss中恢复透明度
			@Override
			public void onDismiss() {
			}
		});
	}

	public void showAtLocation(View parent) {
		mPopupWindow.setBackgroundDrawable(new ColorDrawable());
		mContainerView.measure(MeasureSpec.UNSPECIFIED, MeasureSpec.UNSPECIFIED);
		int[] location = new int[2];
		int popupWidth = mContainerView.getMeasuredWidth();
		int popupHeight =  mContainerView.getMeasuredHeight();
		parent.getLocationOnScreen(location);
		int x = (location[0]+parent.getWidth()/2)-popupWidth/2;
		int y = location[1]-popupHeight;
		mPopupWindow.showAtLocation(parent, Gravity.NO_GRAVITY,x , y);

		// 设置允许在外点击消失
		mPopupWindow.setOutsideTouchable(true);
		// 使其聚集
		mPopupWindow.setFocusable(true);
		// 刷新状态
		mPopupWindow.update();

		mPopupWindow.setOnDismissListener(new OnDismissListener() {

			// 在dismiss中恢复透明度
			@Override
			public void onDismiss() {
			}
		});
	}

	// 隐藏菜单
	public void dismiss() {
		mPopupWindow.dismiss();
	}

	void setSubMenu() throws JSONException {
		mMenuListLayout.removeAllViews();
		for (int i = 0; i < jsonArray.length(); i++) {
			final JSONObject ob = jsonArray.getJSONObject(i);
			LinearLayout layoutItem = (LinearLayout) ((LayoutInflater) mContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE)).inflate(R.layout.platform_mp_window_popmenu_item, null);
			LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT, 1.0f);
			mContainerView.setLayoutParams(lp);
			layoutItem.setFocusable(true);
			TextView tv_funbtntitle = (TextView) layoutItem.findViewById(R.id.platform_mp_window_pop_item_title_textview);
			View pop_item_line = layoutItem.findViewById(R.id.platform_mp_window_pop_item_line);
			if ((i + 1) == jsonArray.length()) {
				pop_item_line.setVisibility(View.GONE);
			}
			tv_funbtntitle.setText(ob.getString("title"));
			layoutItem.setOnClickListener(new OnClickListener() {

				@Override
				public void onClick(View v) {
					// TODO Auto-generated method stub
					try {
						mchatKeybordListerner.tabShowContent(ob.getString("title"));
					} catch (JSONException e) {
						e.printStackTrace();
					}
					dismiss();

				}
			});
			mMenuListLayout.addView(layoutItem);
		}
		mMenuListLayout.setVisibility(View.VISIBLE);
	}

}
