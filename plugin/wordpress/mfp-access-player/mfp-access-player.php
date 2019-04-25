<?php
/**
 * Plugin Name: MFP Access Player
 * Plugin URI: https://github.com/mfpaccessibilite/MFP_AccessPlayer
 * Version: 1.2
 * Author: Simon DE CHABANEIX
 * Author URI: http://www.chabaneix.com
 * Description: Add MFP Access Player support to WP and add button in the Visual Editor + oconfig to choose loading from CDN or local
 * License: GPL2
 */
 
 class MFP_Access_Player{
    /**
	* Constructor. Called when the plugin is initialised.
	*/
	function __construct() {
		if ( is_admin() ) {
            add_action( 'init', array(  $this, 'setup_tinymce_plugin' ) );
            add_action( 'wp_ajax_tmce_button_mfp-access-player', array( &$this, 'wp_ajax_fct' ) );
            add_filter('upload_mimes', array(&$this,'add_upload_type'), 1, 1);
            add_action('admin_init',array(&$this,'register_settings'));
            add_action('admin_menu',array(&$this,'register_options_page'));
            
        }
        add_action( 'wp_head', array( &$this, 'head_js' ) );
        add_action( 'wp_footer', array( &$this, 'player_js' ) );
	}
    function register_options_page(){
        add_options_page('CDN MFPAccessPlayer', 'MFPAccessPlayer', 'manage_options', 'MFPAccessPlayer', array(&$this,'options_page'));
    }
    function options_page(){
        ?>
        <div>
            <?php screen_icon(); ?>
            <h2>MFPAccessPlayer CDN Options</h2>
            <form method="post" action="options.php">
                <?php settings_fields( 'MFPAccessPlayer' ); ?>
                <h3>Do you want to load the plugin from the CDN or from the plugin folder?</h3>
                <table>
                  <tr valign="top">
                    <th scope="row"><label for="MFPAccessPlayer_CDN">Load from CDN</label></th>
                    <td><select name="MFPAccessPlayer_CDN" id="MFPAccessPlayer_CDN">
                        <option value="0">No</option>
                        <option value="1"<?php
                        $opt = get_option('MFPAccessPlayer_CDN');
                        if($opt==1){
                            echo ' selected';
                        }
                        ?>>Yes</option>

                    </select></td>
                  </tr>
                </table>
                <?php  submit_button(); ?>
            </form>
        </div>
        <?php
    }
    function register_settings(){
        add_option('MFPAccessPlayer_CDN',1);
        register_setting('MFPAccessPlayer','MFPAccessPlayer_CDN');
    }
    function add_upload_type($mime_types){
        $mime_types['vtt'] = 'text/vtt'; //Adding vtt extension
        $mime_types['srt'] = 'text/srt'; //Adding srt extension
        $mime_types['stl'] = 'application/octet-stream'; //Adding stl extension
        return $mime_types;
    }
	function head_js(){
	    ?>
	<script>
		var mfpsp_jquery_old = jQuery.noConflict();
		jQuery = null;
	</script>
	<script src="https://code.jquery.com/jquery-3.1.1.js"></script>
    <script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js"></script>
    <script>
    	var mfpsp_jquery_new = jQuery.noConflict();
    	jQuery = mfpsp_jquery_old;
    </script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css" type="text/css">
	    <?php
	}
	function player_js(){
	    ?>
	<script>
		jQuery=mfpsp_jquery_new;
		$=jQuery;
	</script>
    <?php
    $opt = get_option('MFPAccessPlayer_CDN');
    if($opt==1){
        ?>
        <script src="https://cdn.jsdelivr.net/gh/mfpaccessibilite/MFP_AccessPlayer@latest/MFP/mfp.js"></script>
        <?php
    }
    else{
        ?>
    <script src="<?php echo plugin_dir_url( __FILE__ );?>MFP/mfp.js"></script>
    <?php
    }
    ?>
    <script>
    	jQuery=mfpsp_jquery_old;
    </script>
	    <?php
	}
	/*
	* The content of the javascript popin for the insertion
	*
	*/
	function wp_ajax_fct(){
	    include(__DIR__.'/add_mfp_access_player.php');
		die();
	}
	
	
    /**
    * Check if the current user can edit Posts or Pages, and is using the Visual Editor
    * If so, add some filters so we can register our plugin
    */
    function setup_tinymce_plugin() {

        // Check if the logged in WordPress User can edit Posts or Pages
        // If not, don't register our TinyMCE plugin
    
        if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) ) {
                    return;
        }

        // Check if the logged in WordPress User has the Visual Editor enabled
        // If not, don't register our TinyMCE plugin
        if ( get_user_option( 'rich_editing' ) !== 'true' ) {
            return;
        }

        // Setup some filters
        add_filter( 'mce_external_plugins', array( &$this, 'add_tinymce_plugin' ) );
        add_filter( 'mce_buttons', array( &$this, 'add_tinymce_toolbar_button' ) );
	}
	/**
    * Adds a TinyMCE plugin compatible JS file to the TinyMCE / Visual Editor instance
    *
    * @param array $plugin_array Array of registered TinyMCE Plugins
    * @return array Modified array of registered TinyMCE Plugins
    */
    function add_tinymce_plugin( $plugin_array ) {

        $plugin_array['mfp_access_player'] = plugin_dir_url( __FILE__ ) . 'tinymce-mfp-access-player.js';
        return $plugin_array;

    }
    /**
    * Adds a button to the TinyMCE / Visual Editor which the user can click
    * to insert a link with a custom CSS class.
    *
    * @param array $buttons Array of registered TinyMCE Buttons
    * @return array Modified array of registered TinyMCE Buttons
    */
    function add_tinymce_toolbar_button( $buttons ) {

        array_push( $buttons, '|', 'mfp_access_player' );
        return $buttons;
    }

 }
 $mfp_access_player = new MFP_Access_Player();