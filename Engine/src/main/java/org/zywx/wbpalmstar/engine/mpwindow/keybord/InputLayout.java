package org.zywx.wbpalmstar.engine.mpwindow.keybord;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.LinearLayout;

/**
 * Created by ylt on 2017/2/22.
 */

public class InputLayout extends LinearLayout {

    private OnSizeChangedListener mOnSizeChangedListener;

    public InputLayout(Context context) {
        super(context);
    }

    public InputLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }


    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (mOnSizeChangedListener!=null){
            mOnSizeChangedListener.onSizeChanged(w,h,oldw,oldh);
        }

    }

    public void setOnSizeChangedListener(OnSizeChangedListener onSizeChangedListener) {
        mOnSizeChangedListener = onSizeChangedListener;
    }

    interface OnSizeChangedListener{
        void onSizeChanged(int w, int h, int oldw, int oldh);
    }

}
