/**
 * MovieCrop.js
 *
 * @author mach3
 * @version 0.9
 * @require jQuery 1.7+
 */
(function($, undefined){

	/**
	 * MovieCrop Class
	 * @class Create MovieCrop instance
	 * @constructor
	 */
	var MovieCrop = function(ele, config){
		this.init(ele, config);
	};
	$.extend(MovieCrop.prototype, {
		type : "MovieCrop",
		option : {
			fps : 20,
			frames : 20,
			repeat : true,
			direction : "vertical"
		},
		ele : null,
		ms : 0,
		frame : 1,
		timer : null,

		/**
		 * Initilize
		 * @param HTMLElement ele
		 * @param Object config
		 * @return MovieCrop
		 */
		init : function(ele, config){
			this.option = $.extend({}, this.option, config);
			this.ele = $(ele);
			this.ms = Math.floor(1000 / this.option.fps);
			this.setFrame(1);
			return this;
		},

		/**
		 * Set position of background
		 * @param Integer x
		 * @param Integer y
		 * @return MovieCrop
		 */
		setPos : function(x, y){
			if( this.ele.css("background-position-x") ){
				this.ele.css({
					"background-position-x" : x,
					"background-position-y" : y
				});
			} else {
				this.ele.css("background-position", x + "px " + y + "px");
			}
			return this;
		},

		/**
		 * Get position of background (unused now)
		 * @return Object
		 */
		getPos : function(){
			var m = this.ele.css("background-position").match(/([-\d]+?)px\s([-\d]+?)px/);
			return {
				x : parseInt(m[1]),
				y : parseInt(m[2])
			};
		},

		/**
		 * Set frame for the movie, and update background position
		 * @param Integer frame
		 * @return MovieCrop
		 */
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

		/**
		 * Go to next frame of the movie
		 * @return MovieCrop
		 */
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

		/**
		 * Go to previous frame of the movie
		 * @return MovieCrop
		 */
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

		/**
		 * Update frame by interval
		 * @param Boolean back Playback or not
		 * @param Function callback Callback function when movie complete.
		 */
		run : function(back, callback){
			var go, method;
			callback = $.isFunction(callback) ? callback : function(){};
			method = back ? "prevFrame" : "nextFrame";
			clearTimeout(this.timer);
			go = function(){
				var self = this;
				if(this[method]()){
					this.timer = setTimeout(
						function(){ go.call(self); },
						self.ms
					);
				} else {
					callback();
				}
			};
			go.call(this);
		},

		/**
		 * Play the movie
		 * @param Function callback Callback function when movie complete.
		 * @return MovieCrop
		 */
		play : function(callback){
			this.run(false, callback);
			return this;
		},

		/**
		 * Playback the movie
		 * @param Function callback Callback function when movie complete.
		 * @return MovieCrop
		 */
		playback : function(callback){
			this.run(true, callback);
			return this;
		},

		/**
		 * Stop the movie
		 * @return MovieCrop
		 */
		stop : function(){
			clearTimeout(this.timer);
			return this;
		},

		/**
		 * Go to the first frame
		 * @return MovieCrop
		 */
		rewind : function(){
			this.setFrame(1);
			return this;
		}
	});

	window.MovieCrop = MovieCrop;

	/**
	 * Adaptation for jQuery
	 */
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
		moviePlay : function(config, callback){
			this.each(function(){
				$.initMovieCrop(this, config).play(callback);
			});
			return this;
		},
		moviePlayBack : function(config, callback){
			this.each(function(){
				$.initMovieCrop(this, config).playback(callback);
			});
			return this;
		},
		movieStop : function(){
			this.each(function(){
				$.initMovieCrop(this, {}).stop();
			});
			return this;
		},
		movieRewind : function(){
			this.each(function(){
				$.initMovieCrop(this, {}).rewind();
			});
			return this;
		}
	});

}(jQuery));