(function($, undefined){

	var AnimateCrop = function(ele, config){
		this.init(ele, config);
	};
	$.extend(AnimateCrop.prototype, {
		ele : null,
		option : {
			fps : 30,
			frames : 30,
			repeat : true,
			direction : "vertical"
		},
		ms : 0,
		frame : 1,
		init : function(ele, config){
			this.option = $.extend({}, this.option, config);
			this.ele = $(ele);
			this.ms = Math.floor(1000 / 30);
			this.setFrame(1);
		},
		setPos : function(x, y){
			if( this.ele.css("background-position-x") ){
				this.ele.css({
					"background-position-x" : x,
					"background-position-y" : y
				});
			} else {
				this.ele.css("background-position", x + "px " + y + "px");
			}
		},
		getPos : function(){
			var m = this.ele.css("background-position").match(/([-\d]+?)px\s([-\d]+?)px/);
			return {
				x : parseInt(m[1]),
				y : parseInt(m[2])
			};
		},
		setFrame : function(index){
			var x, y;
			x = 0;
			y = 0;
			this.frame = index;
			if(this.frame !== 1){
				if(this.option.direction === "vertical" ){
					y = -(this.frame * this.ele.height());
				} else {
					x = -(this.frame * this.ele.width());
				}
			}
			this.setPos(x, y);
			return this;

		},
		nextFrame : function(){
			if(this.frame + 1 < this.option.frames){
				this.setFrame(this.frame + 1);
			} else if(this.option.repeat){
				this.setFrame(1);
			}
			return this;
		},
		prevFrame : function(){
			

		}

	});



	var c = {
		frames : 12
	};
	var a = new AnimateCrop($(".loading"), c);

	var limit = 30;
	var test = function(){
		//if(! limit-- ){ return; }
		a.nextFrame();
		setTimeout(test, 50);
	};

	test();






}(jQuery));
