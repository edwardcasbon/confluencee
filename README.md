# ConfluencEE

ConfluencEE is an Expression Engine plugin that allows you to get page content from Atlassian's Confluence wiki software.

## Installation
Download the plugin and extract the plugin and javascript files into their relevant paths ('/system/expressionengine/third_party/confluencee/pi.confluencee.php' and '/themes/third_party/confluencee/js/confluencee.js').

Log into your Expression Engine admin system and enable the plugin.

## Usage
After you've enabled the plugin, you'll need to insert a reference to the javascript in the header or footer of your HTML template using the following tag: '<code>{exp:confluencee:script}</code>' (Please note that this script requires jQuery).

To insert content onto your page, use the following EE tag wherever you want the content to be displayed: '<code>{exp:confluencee url="http://documentation.red-gate.com/" page_id="10617318"}</code>'
