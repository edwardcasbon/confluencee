<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

$plugin_info = array(
	'pi_name'			=> 'ConfluencEE',
	'pi_version'		=> '1.0',
	'pi_author'			=> 'Edward Casbon',
	'pi_author_url'		=> 'http://www.edwardcasbon.co.uk',
	'pi_description'	=> 'Confluence plugin description goes here.',
	'pi_usage'			=> Confluencee::usageNotes()
);


class Confluencee {
	
	var $url 			= "";
	var $pageId 		= 0;
	var $element 		= "div";
	var $elementClass 	= "confluence";
	
	var $return_data; // Data outputted to the template.
	
	public function __construct () {
		$this->url 			= !ee()->TMPL->fetch_param('url') ? $this->apiUrl : ee()->TMPL->fetch_param('url');
		$this->pageId 		= !ee()->TMPL->fetch_param('page_id') ? $this->pageId : ee()->TMPL->fetch_param('page_id');
		$this->element 		= !ee()->TMPL->fetch_param('element') ? $this->element : ee()->TMPL->fetch_param('element');
		$this->elementClass = !ee()->TMPL->fetch_param('element_class') ? $this->elementClass : ee()->TMPL->fetch_param('element_class');
				
		$this->return_data = '<' . $this->element . ' class="' . $this->elementClass . '" data-confluenceurl="' . $this->url . '" data-confluencepageid="' . $this->pageId . '"></' . $this->element . '>';		
	}
	
	public static function usageNotes () {
		ob_start(); 
		?>
			This plugin allows you to get page content from Atlassian's Confluence wiki software. It's to be used in page templates.
			
			To use this plugin, firstly, add the '{exp:confluencee:script}' tag to the footer of your web page, then use the tag '{exp:confluencee:content}' with the following parameters:
			
			1. url (Mandatory) - The URL for the Confluence website including the version (e.g. http://documentation.red-gate.com/)
			
			2. page_id (Mandatory) - The ID of the page that you want to pull content from.
			
			3. element (Optional) - The HTML element that wraps the Confluence content. Defaults to 'div'.
			
			4. element_class (Optional) - The class name for the HTML element. Defaults to 'confluence'.
			
			Example tag: 
			{exp:confluencee url="http://documentation.red-gate.com" page_id="10617318"}

		<?php
		$buffer = ob_get_contents();
		ob_end_clean(); 
		return $buffer;
	}
	
	public function script () {
		return '<script src="' . URL_THIRD_THEMES . 'confluencee/js/confluencee.js"></script>';
	}
}