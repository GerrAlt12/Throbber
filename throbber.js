/*	ThrobberJS - ES5, Chrome 52+, FF 47+, IE 11+
 * 	
 * 
 * 
 * */

define(["text!throbber.css"], function(cssText) {
	'use strict';
	
	/*add correct styles, try to add it before any <link> for not overriding other styles*/
	
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css"
	link.href = "data:text/css;base64,"+btoa(cssText);
	var cssLinks = document.querySelectorAll("link[rel=stylesheet]");
	
	if (cssLinks.length > 0) {
		cssLinks[0].parentElement.insertBefore(link, cssLinks[0]);
	} else {
		if (document.querySelector("head")) {
			document.querySelector("head").appendChild(link);
		} else {
			document.childNodes[1].appendChild(link);
		}
	}
	
	/**
	 * @property {Node} parentElement - where graphical elements should be attached, root document displaying node is default
	 * @property {number} visibleBlockingDelay - timeout (milliseconds) for switch from glass overlay to grayed visible overlay, default 5000
	 * @property {number} visibleBlockingDuration - duration (milliseconds) of visible overlay, default 15000
	 * @property {function} timeoutExpired - callback which will be called if  visibleBlockingDelay+visibleBlockingDuration expires and at least 1 throbber not hided, default - hide throbbers
	 * @property {function} showGlassOverlay - callback which will be called when throbber initial shows
	 * @property {function} showGrayedOverlay - callback which will be called when visibleBlockingDelay expires
	 * @property {function} hideOverlay - callback which will be called when all throbber stack emptyfied
	 *
	 *
	 *
	 *
	 */
	
	return function Throbber(config) {
		var cfg = {
			parentElement: document.querySelector("body") || document.childNodes[1], /* if we discover that <body> is ommited - parent should be second cild of document (usually its <html> or root content element) */	
			visibleBlockingDelay: 5000,
			visibleBlockingDuration: 15000,
			throbberElement: function() {
				var throbberElement = document.querySelector(".throbberGlassOverlay");
				if (!throbberElement) {
					throbberElement = document.createElement("div");
					throbberElement.className = "throbberGlassOverlay";
				}
				return throbberElement;
			},
			showGlassOverlay: function() {
				cfg.parentElement.appendChild(typeof cfg.throbberElement === 'function' ? cfg.throbberElement(): cfg.throbberElement);
			},
			showGrayedOverlay: function() {
				(typeof cfg.throbberElement === 'function' ? cfg.throbberElement(): cfg.throbberElement).classList.add("throbberGlassOverlayGrayed");
			},
			hideOverlay: function() {
				(typeof cfg.throbberElement === 'function' ? cfg.throbberElement(): cfg.throbberElement).remove();
			},
			timeoutExpired: function() {
				cfg.hideOverlay();
			}
		};
		//
		Object.keys(config).forEach(function(key) {
			cfg[key] = config[key];
		});

		
		var throbberIds = [];
		var timer = null;
		
		function fromTransparentToVisible() {
			cfg.showGrayedOverlay();
			timer = setTimeout(cfg.timeoutExpired, cfg.visibleBlockingDuration);
			console.log("Show visible overlay");
		}
		
		function showThrobber(throbberId) {
			throbberIds.push(throbberId);
			if (throbberIds.length == 1) {
				cfg.showGlassOverlay();
				timer = setTimeout(fromTransparentToVisible, cfg.visibleBlockingDelay);
				console.log("Show transparent overlay");
			}
		}
		
		function hideThrobber(throbberId) {
			var index = throbberIds.indexOf(throbberId);
			if (index != -1) {
				throbberIds.splice(index, 1);
			}
			if (throbberIds.length < 1) {
				cfg.hideOverlay();
			}
		}

		var throbber = {};
		
		/**
		 * @property throbberId - any object which may be stored into array. It should identifictes throbber for correct timing expiration;
		 */
		throbber.show = function(params) {
			showThrobber(params.throbberId);
		};
		
		/**
		 * @property throbberId - any object which may be stored into array. It should identifictes throbber for correct timing expiration;
		 */
		throbber.hide = function(params) {
			hideThrobber(params.throbberId);
		};
		
		return Object.freeze(throbber);
	};
});