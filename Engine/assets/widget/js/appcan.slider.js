appcan.define("slider", function($, exports, module) {
    var model_item = '<div class="slider-item ub-fh ub-fv ub-img7" style="background-image:url(<%=data.img%>)">\
    <span class="uabs"><%=data.label%></span>\
    </div>';
    var itemTmp = appcan.view.template(model_item);
    function isWindows(){
        if(!('ontouchstart' in window)) {return true};
    }
    var bounceState = 0;
    function SliderView(option) {
        appcan.extend(this, appcan.eventEmitter);
        var self = this;
        self.option = $.extend({
            selector : "body",
            dir:'hor',
            hasIndicator:true,
            hasLabel:false,
            aspectRatio:0,
            index:0,
            auto:false
        }, option, true); 
        
        this.isReset = true;
        
        // appcan.window.getBounceStatus(function(dt,dataType,opId){
            // bounceState = dt;
        // });
        bounceState =1;
            
        self.ele = $(self.option.selector);
        $(document).on('touchstart',function(evt){
                var left = self.ele.offset().left;
                var top = self.ele.offset().top;
                var width = self.ele.width();
                var height = self.ele.height();
                var touch = evt.touches[0];
                if(touch.pageX > left && touch.pageX < left+width && touch.pageY > top && touch.pageY < top+height){
                    if(bounceState == 1){
                        appcan.window.disableBounce();
                    }
                    appcan.window.setMultilPopoverFlippingEnbaled(1);
                    return false;
                }else{
                    if(bounceState == 1){
                        appcan.window.enableBounce();
                    }
                    //appcan.window.setMultilPopoverFlippingEnbaled(0);
                }
            });
            $(document).on('touchmove',function(evt){
                var left = self.ele.offset().left;
                var top = self.ele.offset().top;
                var width = self.ele.width();
                var height = self.ele.height();
                var touch = evt.touches[0];
                if(touch.pageX > left && touch.pageX < left+width && touch.pageY > top && touch.pageY < top+height){
                    if(bounceState == 1){
                        appcan.window.disableBounce();
                    }
                    appcan.window.setMultilPopoverFlippingEnbaled(1);
                    if(self.timer) {clearInterval(self.timer)};
                    return false;
                }
                
            });
            $(document).on('touchcancel',function(evt){
                var left = self.ele.offset().left;
                var top = self.ele.offset().top;
                var width = self.ele.width();
                var height = self.ele.height();
                var touch = evt.touches[0];
                if(bounceState == 1){
                    appcan.window.enableBounce();
                }
                if(touch.pageX > left && touch.pageX < left+width && touch.pageY > top && touch.pageY < top+height){
                    //appcan.window.setMultilPopoverFlippingEnbaled(0);
                    return false;
                } 
            });
            $(document).on('touchend',function(evt){
                var left = self.ele.offset().left;
                var top = self.ele.offset().top;
                var width = self.ele.width();
                var height = self.ele.height();
                var touch = evt.touches[0];
                if(bounceState == 1){
                    appcan.window.enableBounce();
                }
                if(touch.pageX > left && touch.pageX < left+width && touch.pageY > top && touch.pageY < top+height){
                    //appcan.window.setMultilPopoverFlippingEnbaled(0);
                    return false;
                }
                
            });
        if(self.option.aspectRatio)
            self.ele.css("height",self.ele.offset().width*self.option.aspectRatio);
        
        if (self.option.data) {
            self.set(data);
        }
        if(self.option.auto){
            self.autoMove(self.option.auto);
        }
    };

    SliderView.prototype = {
        buildItem:function(data){
            var self = this;
            var item = $(itemTmp({
                    data : data,
                    option : self.option
                }));
            item[0]["lv_data"]=data;
            self.option.icache.run({dom:item,url:data.img});
            return item;
        },
        _moveTo:function(index,anim){
            var self = this;
            if(!(anim === false )){
                self.transition = true;

                self.container.addClass("slider-anim");
                self.container.on("webkitTransitionEnd",function(){
                    self.container.off("webkitTransitionEnd");
                    self.container.removeClass("slider-anim");
                    if(self.option.index >= self.option.itemCount){
                        self.option.index = 0;
                    }
                    if(self.option.index < 0){
                        self.option.index = self.option.itemCount-1;
                    }
                    self.emit("change",self,self.option.index);
                    self._moveTo(self.option.index,false);
                    self.transition = false;
                    self.isReset = true;
                });
            }

            var w=(-(self.option.index+1)*self.ele.offset().width);
            self.container.css("-webkit-transform", "translateX("+w+"px)");
            var width = self.ele.offset().width / self.option.itemCount;
            self.focus.css("-webkit-transform", "translateX("+self.option.index * width+"px)");
            if(self.option.hasLabel){
                self.label.label.html(self.option.data[self.option.index+1].label);
            }
            
        },
        drag:function(d){
            var self = this;
            if(!self.transition){
                var w=(-(self.option.index+1)*self.ele.offset().width)+d;
                self.container.css("-webkit-transform", "translateX("+w+"px)");
                self.isReset = false;
            }
        },
        reset:function(){
            var self = this;
            if(!this.isReset && Math.abs(self.dragX)<40){
                //if(Math.abs(self.dragX)<30){
                    self._moveTo(self.option.index);
                    self.autoMove(self.option.auto);
                //}
            }
        },
        set:function(data){
            var self = this;
            self.option.itemCount = data.length;
            self.container = self.container || $('<div class="slider-group ub-fh ub-fv"></div>');
            self.container.empty();
            data.unshift(data[data.length-1]);
            data.push(data[1]);
            self.option.data = data;
            
            for(var i in data){
                var item = self.buildItem(data[i]);
                self.container.append(item);
            }
            self.ele.append(self.container);
            var width = self.ele.offset().width / self.option.itemCount;
            if(self.option.hasLabel){
                self.label = $('<div class="label1"></div>');
                self.label.label = $('<div class="ulev-1 ut-s label sc-text-hint uinn-l1"></div>');
                var dian = $('<div class="labelzan"></div>');
                var zamcon = $('<div class="labelcon1" name="labContent"></div>');
                var zamcon1 = $('<div class="labelcon" name="labContent"></div>');

                for(var tt = 0;tt < self.option.itemCount;tt++){
                    if(tt == 0){
                        dian.append(zamcon);
                    }else{
                        dian.append('<div class="labelcon" name="labContent"></div>');
                    }
                }
                self.label.append(self.label.label);
                self.label.append(dian);
                self.ele.append(self.label);
            }
            self.focus = self.focus || $('<div class="utra focus bc-head"></div>');
            self.focus.css("width", width);
            self.focus.css("-webkit-transform", "translateX("+self.option.index * width+"px)");
            //self.ele.append(self.focus);
            
            self._moveTo(self.option.index,false);
            self.ele.off("swipeMoveLeft").on("swipeMoveLeft",function(evt){
                if(self.timer) {
                    clearInterval(self.timer);
                }
                self.drag(-evt._args.dx);
                self.dragX = -evt._args.dx;
            });
            self.ele.off("swipeMoveRight").on("swipeMoveRight",function(evt){
                if(self.timer) {
                    clearInterval(self.timer);
                }
                self.drag(evt._args.dx);
                self.dragX = evt._args.dx;
            });
            
            //结束的时候
            self.ele.off("touchend touchcancel").on("touchend touchcancel",function(evt){
                appcan.window.setMultilPopoverFlippingEnbaled(0);
                self.reset();
                
            });
            
            self.ele.off("tap").on("tap",function(evt){
                self.emit("clickItem",self,self.option.index,data[self.option.index+1]);
            });
            self.ele.off("swipeLeft").on("swipeLeft",function(evt){
                //if(!self.transition){
                    var name = $("div[name=labContent]");
                    var index = self.option.index + 1;
                    if(index >= self.option.itemCount){
                        index = 0;
                    }
                    for(var i = 0;i < name.length;i++){
                        if(i == index){
                            name[i].className = 'labelcon1';
                        }else{
                            name[i].className = 'labelcon';
                        }
                    }
                    self._moveTo(++self.option.index);
                    self.autoMove(self.option.auto)
                //}
            });
            self.ele.off("swipeRight").on("swipeRight",function(evt){
                //if(!self.transition){
                    console.log("===>"+self.option.index);
                    var name = $("div[name=labContent]");
                    var index = self.option.index - 1;
                    if(index < 0){
                        index = self.option.itemCount - 1;
                    }
                    for(var i = 0;i < name.length;i++){
                        if(i == index){
                            name[i].className = 'labelcon1';
                        }else{
                            name[i].className = 'labelcon';
                        }
                    }
                    self._moveTo(--self.option.index);
                    self.autoMove(self.option.auto);
                //}
            });
            
            self.ele.off("swipeUp").on("swipeUp",function(evt){
                self._moveTo(self.option.index);
                self.autoMove(self.option.auto);
                
            });
            self.ele.on("swipeDown",function(evt){
                self._moveTo(self.option.index);
                self.autoMove(self.option.auto)
            });
            return self;
        },
        autoMove:function(auto){
            if(auto){
                var self = this;
                if(self.timer) {
                    clearInterval(self.timer);
                }
                self.timer = setInterval(function(){
                    var name = $("div[name=labContent]");
                    var index = self.option.index + 1;
                    if(index >= self.option.itemCount){
                        index = 0;
                    }
                    for(var i = 0;i < name.length;i++){
                        if(i == index){
                            name[i].className = 'labelcon1';
                        }else{
                            name[i].className = 'labelcon';
                        }
                    }
                    self._moveTo(++self.option.index,true);
                },auto);
            }
        }
    }
    module.exports = function (option) {
        return new SliderView(option);
    };
});
