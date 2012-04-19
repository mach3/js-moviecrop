(function($, undefined){

	var MovieCrop = function(ele, config){
		this.init(ele, config);
	};
	$.extend(MovieCrop.prototype, {
		type : "MovieCrop",
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
		run : function(back, callback){

		},
		play : function(back){
			var self, run, method;
			self = this;
			method = back ? "prevFrame" : "nextFrame";
			run = function(){
				if(self[method]()){
					self.timer = setTimeout(
						function(){ run.call(self); },
						self.ms
					);
				}
			};
			run.call(this);
			return this;
		},
		playback : function(){
			this.play(true);
			return this;
		},
		stop : function(){
			clearTimeout(this.timer);
			return this;
		}
	});

	$.extend($,	{
		initMovieCrop : function(ele, config){
			var o, key;
			o = $(ele);
			key = "movie-crop";
			if(! o.data(key)){
				o.data(key, new MovieCrop(ele, config));
			}
			return o.data(key);
		}
	});

	$.fn.extend({
		movieInit : function(config){
			this.each(function(){
				$.initMovieCrop(this, config);
			});
			return this;
		},
		moviePlay : function(config){
			this.each(function(){
				$.initMovieCrop(this, config).play();
			});
			return this;
		},
		moviePlayback : function(config){
			this.each(function(){
				$.initMovieCrop(this, config).playback();
			});
			return this;
		},
		movieStop : function(){
			this.each(function(){
				$.initMovieCrop(this, {}).stop();
			});
			return this;
		}
	});

	$(".loading").moviePlay({
		frames : 12
	});

	$("#button-stop-loading").on("click", function(){
		$(".loading").movieStop();
	});


	$(".graph.play").moviePlay({
		frames : 11
	});

	$(".graph.playback").moviePlayback({
		frames : 11
	});

	new function(){
		var o = $(".circle").movieInit({frames:12});

		o.moviePlay();

	};









	return;

	
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
			return;
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
		a.playback();
		setTimeout(function(){
			return;
			a.stop();
		}, 3000);
	};





}(jQuery));
