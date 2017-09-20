package org.zywx.wbpalmstar.base.vo;

import java.io.Serializable;

public class PushConfigVO implements Serializable {

    private boolean sound; //推送消息声音
    private boolean shake; //推送消息震动
    private boolean breathe; //推送消息呼吸灯
    private int times; //推送消息提醒次数
    private long interval; //推送消息提醒时间间隔

    public boolean isSound() {
        return sound;
    }

    public void setSound(boolean sound) {
        this.sound = sound;
    }

    public boolean isShake() {
        return shake;
    }

    public void setShake(boolean shake) {
        this.shake = shake;
    }

    public boolean isBreathe() {
        return breathe;
    }

    public void setBreathe(boolean breathe) {
        this.breathe = breathe;
    }

    public int getTimes() {
        return times;
    }

    public void setTimes(int times) {
        this.times = times;
    }

    public long getInterval() {
        return interval;
    }

    public void setInterval(long interval) {
        this.interval = interval;
    }
}
