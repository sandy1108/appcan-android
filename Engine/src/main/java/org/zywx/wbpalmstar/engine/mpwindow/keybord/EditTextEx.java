package org.zywx.wbpalmstar.engine.mpwindow.keybord;

import android.content.Context;
import android.text.Editable;
import android.text.style.ForegroundColorSpan;
import android.util.AttributeSet;
import android.view.KeyEvent;
import android.view.View;

/**
 * Created by ylt on 16/7/15.
 */

public class EditTextEx extends android.support.v7.widget.AppCompatEditText {

    public EditTextEx(Context context) {
        super(context);
        init();
    }

    public EditTextEx(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public EditTextEx(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init(){
        setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (KeyEvent.KEYCODE_DEL==keyCode&&event.getAction()!= KeyEvent.ACTION_UP) {
                    int selection=getSelectionEnd();
                    Editable editable=getEditableText();
                    ForegroundColorSpan[] spans=editable.getSpans(0,editable.length(),ForegroundColorSpan.class);
                    for (ForegroundColorSpan span :spans){
                        int spanStart=editable.getSpanStart(span);
                        int spanEnd=editable.getSpanEnd(span);
                        if (selection>spanStart&&selection<=spanEnd){
                            editable.delete(spanStart,spanEnd);
                            return true;
                        }
                    }
                }
                return false;
            }
        });
    }

    @Override
    protected void onSelectionChanged(int selStart, int selEnd) {
        Editable editable = getEditableText();
        ForegroundColorSpan[] spans = getText().getSpans(0, getText().length(), ForegroundColorSpan.class);
        for (ForegroundColorSpan span : spans) {
            int spanStart = editable.getSpanStart(span);
            int spanEnd = editable.getSpanEnd(span);
            if (selStart == selEnd) {
                if (selStart > spanStart && selStart < spanEnd) {
                    setSelection(spanEnd);
                    return;
                }
            } else {
                if (selStart > spanStart && selStart < spanEnd) {
                    setSelection(spanStart, selEnd);
                }
                if (selEnd > spanStart && selEnd < spanEnd) {
                    setSelection(selStart, spanEnd);
                }
            }
        }
        super.onSelectionChanged(selStart, selEnd);
    }

}
