(function($, undefined){

	var AnimateCrop = function(ele, config){
		this.init(ele, config);
	};
	$.extend(AnimateCrop.prototype, {
		option : {
			fps : 30,
			frames : 30,
			repeat : true,
			direction : "vertical"
		},
		ele : null,
		ms : 0,
		frame : 1,
		timer : null,
		init : function(ele, config){
			this.option = $.extend({}, this.option, config);
			this.ele = $(ele);
			this.ms = Math.floor(1000 / this.option.fps);
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
		setFrame : function(frame){
			var index, x, y;
			this.frame = frame;
			index = this.frame - 1;
			x = 0;
			y = 0;
			if(this.frame !== 1){
				if(this.option.direction === "vertical" ){
					y = -(index * this.ele.height());
				} else {
					x = -(index * this.ele.width());
				}
			}
			this.setPos(x, y);
			return this;
		},
		nextFrame : function(){
			if(this.frame + 1 <= this.option.frames){
				this.setFrame(this.frame + 1);
			} else if(this.option.repeat){
				this.setFrame(1);
			} else {
				return false;
			}
			return this;
		},
		prevFrame : function(){
			if(this.frame - 1){
				this.setFrame(this.frame - 1);
			} else if(this.option.repeat){
				this.setFrame(this.option.frames);
			} else {
				return false;
			}
			return this;
		},
		play : function(){
			var self, run;
			self = this;
			run = function(){
				if(self.nextFrame()){
					self.timer = setTimeout(
						function(){ run.call(self); },
						self.ms
					);
				}
			};
			run.call(this);
		},
		playback : function(){

		},
		stop : function(){
			clearTimeout(this.timer);
		}
	});

	
	/**
	 * loading
	 */
	 new function(){
		var a, option;
		option = {
			frames : 12
		};
		a = new AnimateCrop($(".loading"), option);
		a.play();
		setTimeout(function(){
			console.log("stop");
			a.stop();
		}, 3000);
	};

	/**
	 * graph play
	 */
	new function(){
		var a, option;
		option = {
			frames : 11,
			fps : 20 
		};
		a = new AnimateCrop($(".graph.play"), option);
		a.play();
	};

	/**
	 * graph playback
	 */
	new function(){
		var a, option;
		option = {
			frames : 11,
			fps : 20
		};
		a = new AnimateCrop($(".graph.playback"), option);
		setTimeout(function(){
			a.prevFrame();

		}, 1000);

	};




}(jQuery));
