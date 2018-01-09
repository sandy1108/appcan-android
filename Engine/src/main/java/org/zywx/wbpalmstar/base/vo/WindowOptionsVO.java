package org.zywx.wbpalmstar.base.vo;

import java.util.List;

/**
 * Created by zhangyipeng on 2018/1/9.
 */

public class WindowOptionsVO {
    public String windowTitle;
    public boolean isBottomBarShow;
    public String titleLeftIcon;
    public String titleRightIcon;
    public List<MPWindowMenuVO> menuList;

    public static class MPWindowMenuVO {
        public String menuId;
        public String menuTitle;
        public List<MPWindowMenuItemVO> subItems;

        public static class MPWindowMenuItemVO {
            public String itemId;
            public String itemTitle;
        }
    }
}
