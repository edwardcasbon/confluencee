$(function(){
	$("body").find("[data-confluencepageid]").each(function(){
		var $el = $(this);
		var $url = $el.data('confluenceurl');
		var $pageId = $el.data('confluencepageid');
		Confluencee.getContent($url, $pageId, function(content){
			$el.html(content);
		});
	});
});
	
var Confluencee = {
	currentSpaceKey: "",
	url: "",

	getContent: function (url, id, userCallback) {
		Confluencee.url = url;
		var callback = {
			callbackFunction: Confluencee.getContentCallback, 
			callbackArguments: [userCallback]
		};
		Confluencee.doAjax("content", url, id, false, callback);
	},
	
	getContentCallback: function (content, userCallback) {
		Confluencee.currentSpaceKey = content.space.key;
		var formattedContent = Confluencee.formatContent(content.body.value);
		if(typeof(userCallback) == "function") {
			userCallback.call(this, formattedContent);
		}
	},
	
	formatContent: function (content) {
		content = content.replace(/ (id|style|class)="[a-z0-9\s-_]*"/gi, "");
		content = content.replace(/\<ac:parameter[a-z0-9\s:=>"#]*\<\/ac:parameter\>/gi, Confluencee.formatContent_Parameters);
		content = content.replace(/\<ac:macro(.)*?\>/gi, "").replace(/<\/ac:macro\>/gi, "");
		content = content.replace(/\<ac:link\>(.)*?\<\/ac:link\>/gi, Confluencee.formatContent_Links);
		content = content.replace(/\<ac:image(.)*?\<\/ac:image\>/gi, Confluencee.formatContent_Images);
		content = content.replace(/\<ac:rich-text-body(.)*?\>/gi, "").replace(/<\/ac:rich-text-body\>/gi, "");
		content = content.replace(/\<ac:default-parameter(.)*?\<\/ac:default-parameter\>/gi, "");
		content = content.replace(/\<p\>(\s|&nbsp;)*?\<\/p\>/gi, "");
		return content;
	},
	
	formatContent_Parameters: function (content) {
		if(content.match('"title"')) {
			matches = content.replace(/\<ac:parameter ac:name="title"\>([a-z0-9\s]*)\<\/ac:parameter\>/gi, "$1");
			return "<h2>" + matches + "</h2>";
		}
		return "";
	},

	formatContent_Links: function(content) {
		var title = content.match(/title="(.)*?"/ig)[0].replace('title="', '').replace('"', '');	
		var spaceKey = content.match(/ri:space-key="(.)*?"/ig);
		if(spaceKey) spaceKey = spaceKey[0].replace('ri:space-key="', '').replace('"', '');
		var url = Confluencee.getPageUrlFromTitleAndSpace(title, spaceKey);
		return "<a href=\"" + url + "\">" + title + "</a>";
	},
	
	formatContent_Images: function(content) {
		return "";
	},
		
	doAjax: function (method, url, option, attribs, callback) {
		var apiUrl = url + 'rest/prototype/1/' + method + '/' + option + '.json';
		$.ajax({
			url: apiUrl,
			data: attribs,
			dataType: "jsonp",
			jsonp: "jsonp-callback",
			error: function(request, status, error) {
				console.log("Ajax error: " + status);
				console.log(error);
			},
			success: function(data, status, request) {				
				if(typeof(callback.callbackFunction) == "function") {
					if(typeof(callback.callbackArguments) == "undefined") {
						callback.callbackArguments = [];
					}
					callback.callbackArguments.unshift(data);
					callback.callbackFunction.apply(this, callback.callbackArguments);
				}
			},
			jsonpCallback: "jsonpCallback"
		});
	},
	
	getPageUrlFromTitleAndSpace: function (title, space, callback) {
		if(!space) space = Confluencee.currentSpaceKey; 
		return Confluencee.url + "display/" + space + "/" + title.replace(" ", "+", "ig");
	}	
}