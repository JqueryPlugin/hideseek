/*
 * hideseek 0.1
 * Copyright (c) 2013 choizhang
 * Date: 2013-10-30
 * 鼠标所在的地方显示完全的区域，鼠标移开后只显示一部分
 * 算法：当鼠标在模块区域内，当前子模块前面的子模块的left值是:((总宽度(900)-子模块的宽度(540)) / (总个数 -1)) * i,当前子模块后面的子模块的left值是：(子模块的宽度(540) + 120* (n-1))
 */
(function($){ "use strict";
	//函数截流函数，在一定的时间间隔里面才执行一次函数
	$.throttle = function(fn, delay) {
		"use strict";
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

 	$.log = function(arg) {
 		return window.console && window.console.log(arg)
 	}

    var Hideseek = function(element, options) {
    	//jquery对象变量
    	this.$element = $(element);
    	this.$li = this.$element.children();
    	//可变参数决定的变量
    	this.options = $.extend({}, Hideseek.DEFAULTS, options || {});
    	//this.options = $.extend(true, {}, Hideseek.DEFAULTS, options || {});
    	var width_height = this.options.type == 'horizon' ? 'width' : 'height';
    	this.left_top = this.options.type == 'horizon' ? 'left' : 'top';
    	this.index = this.options.start_index;
    	//下面是初始化就决定的变量
    	this.wraper_width = parseInt(this.$element.css(width_height));  //900
    	this.total_li_length = this.$li.length;    //4
        this.li_width = parseInt(this.$li.css(width_height));   //540
        this.min_li_width = Math.floor((this.wraper_width - this.li_width) / (this.total_li_length -1 ));  //120
        this.average_width = Math.floor(this.wraper_width / this.total_li_length);   //225
        //后续会变化的变量
    	this.tid = null;
    	
    	this.init();
    }

    Hideseek.DEFAULTS = {
    	start_index: 0,
    	animate_time: 600,
        animate_interval_time: 2000,
        type: 'horizon'
    }

    Hideseek.prototype.init = function() {
        //console.log('wraper_width:' + this.wraper_width + ';total_li_length:' + this.total_li_length + ';li_width:' + this.li_width + ';min_li_width:' + this.min_li_width + ';average_width:' + this.average_width);

    	this.$element.on('mouseenter mouseEnter', this.$li[0].tagName, $.throttle($.proxy(this.mouseEnter, this), 200)).on('mouseleave', $.throttle($.proxy(this.mouseLeave,this), 200));  //mouseenter除了要暂停自动播放还有其他动作所以绑定在li上，通过参数e来知道具体是哪一个li

    	this.options.animate_interval_time && this.pause().autoPlay();
    }

    Hideseek.prototype.autoPlay = function() {
		//this.index = 0;  //被用户终止后的起始位置
		var that = this;
        this.tid = setInterval(function() {
        	that.$li.eq(that.index).trigger('mouseEnter');
        }, this.options.animate_interval_time);
        return this;
    }

    Hideseek.prototype.pause = function() {
        this.tid && (this.tid = clearInterval(this.tid));  //因为在li直接切换就会触发此函数，clearInterval的返回值是undefine，不然每次都
        return this;
    }

    Hideseek.prototype.mouseEnter = function(e) {  //原型的函数里面的this都是类对象的，如果想获取当前事件的this，用$(e.currentTarget)来获取
    	var index = this.index,
    	    obj = {},
    	    that = this,
    	    i;
    	index = $(e.currentTarget).index(); //当前事件子模块的位置
        e.type == 'mouseover' && this.pause();  //如果是用户主动触发的行为就要停止全局时间

        that.$element.trigger(e = $.Event('animate_start'));
        if(e.isDefaultPrevented()) return;
        for(i=0;i<index;){
            if(++i != index) this.$li.eq(i).addClass('slide_hover0' + (i+1));
            
            obj[this.left_top] = this.min_li_width*i;
            this.$li.eq(i).animate(obj, {duration: this.options.animate_time, queue: false});  //核心算法，hover当前元素的前面元素
            //complete: function() {$( this ).after( "<div>Animation complete.</div>" );}也是在上面第二个参数的json里面
        }

        for(i=index;i<this.total_li_length;i++){
        	obj[this.left_top] = this.li_width + this.min_li_width*i;
            this.$li.eq(i+1).addClass('slide_hover0' + (i+2)).animate(obj, {duration: this.options.animate_time, queue: false}); //核心算法，hover当前元素的后面元素
        }
        this.index = ++index % this.total_li_length;

        setTimeout(function() {  //动画结束后执行的回调函数，因为有多个动画，所以不便于写在animate的回调函数里面
        	that.$element.trigger('animate_end');
        }, this.options.animate_time)

        return this;
    }

    Hideseek.prototype.mouseLeave = function(e) {
    	var obj = {}, i;
    	for(i=0;i<this.total_li_length;i++){
        	obj[this.left_top] = this.average_width*i;
            this.$li.eq(i).animate(obj, {duration: this.options.animate_time, queue: false});
        }

        this.options.animate_interval_time && this.pause().autoPlay();

        return this;
    }

    var old = $.fn.hideseek;

    $.fn.hideseek = function(option, _relatedTarget) {
    	//var arg = arguments;
        return this.each(function() {
        	var $this = $(this),
        	    data = $this.data('hideseek'),
        	    options = typeof option == 'object' && option;  //只传递对象过去
        	if(!data)$this.data('hideseek', (data = new Hideseek(this, options)));

        	//$.log(Array.prototype.slice.call(arg, 1))  返回的是一个数组，调用的时候仍是数组的方式，而且每次都要显示的将arg闭包，还不如直接传数组进来

            if(typeof option == 'string') data[option](_relatedTarget); //可以通过字符串来调用方法，不可以让用户自定义方法
                                        //data[option].call($this),如果这个方法里面的this是html的则需要这样来执行，参考alert
        });
    };

    $.fn.noConflict = function() {     //var bootstrapButton = $.fn.button.noConflict()
        $.fn.hideseek = old;           //$.fn.bootstrapBtn = bootstrapButton , bootstrapButton是给我们这个插件重新的命名
        return this;
    }

    //$parent.trigger(e = $.Event('close.bs.alert'))  这使用$.Event主要是要e，下面有判断，如果你在自定义的close里面return false;是会阻止后面函数的执行的
    //if (e.isDefaultPrevented()) return  如果后面的事件被阻止了就return，那后面的closed就不会执行

    $.fn.hideseek.Constructor = Hideseek; 
    //因为闭包，类在外部是不能访问的，这里让hideseek的构造函数重新指向，就可以在外部调用api了
    //var abc = new $.fn.hideseek.Constructor('.slideshow')
    //abc.pause();   abc.autoPlay();

    $(window).on('load.hideseek.data-api', function() {
        $('[data-cat="hideseek"]').each(function() {
            var $this = $(this),
                auto_play = $this.attr('data-autoplay');

            auto_play === 'true' ? $this.hideseek() : $this.hideseek({animate_interval_time: false});

        })
    })
})(window.jQuery);
