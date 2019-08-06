<?php

// exit if accessed directly
if( ! defined( 'ABSPATH' ) ) exit;


// check if class already exists
if( !class_exists('acf_field_mapmore') ) :


class acf_field_mapmore extends acf_field {
	
	
	/*
	*  __construct
	*
	*  This function will setup the field type data
	*
	*  @type	function
	*  @date	5/03/2014
	*  @since	5.0.0
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function __construct() {
		
		/*
		*  name (string) Single word, no spaces. Underscores allowed
		*/
		
		$this->name = 'mapmore';
		
		
		/*
		*  label (string) Multiple words, can include spaces, visible when selecting a field type
		*/
		
		$this->label = __('MapMore', 'acf-mapmore');
		
		
		/*
		*  category (string) basic | content | choice | relational | jquery | layout | CUSTOM GROUP NAME
		*/
		
		$this->category = 'basic';
		
		
		/*
		*  defaults (array) Array of default settings which are merged into the field object. These are used later in settings
		*/
		
		$this->defaults = array(
			'height'		=> '',
			'center_lat'	=> '',
			'center_lng'	=> '',
			'zoom'			=> ''
		);

		$this->default_values = array(
			'height'		=> '400',
			'center_lat'	=> '50.0665797',
			'center_lng'	=> '13.794696',
			'zoom'			=> '4'
		);
		
		
		/*
		*  l10n (array) Array of strings that are used in JavaScript. This allows JS strings to be translated in PHP and loaded via:
		*  var message = acf._e('mapmore', 'error');
		*/
		
		$this->l10n = array(
			'error'	=> __('Error! Please enter a higher value', 'acf-mapmore'),
		);
		
				
		// do not delete!
    	parent::__construct();
    	
	}
	
	
	/*
	*  render_field_settings()
	*
	*  Create extra settings for your field. These are visible when editing a field
	*
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field (array) the $field being edited
	*  @return	n/a
	*/
	
	function render_field_settings( $field ) {
		
		/*
		*  acf_render_field_setting
		*
		*  This function will create a setting for your field. Simply pass the $field parameter and an array of field settings.
		*  The array of settings does not require a `value` or `prefix`; These settings are found from the $field array.
		*
		*  More than one setting can be added by copy/paste the above code.
		*  Please note that you must also have a matching $defaults value for the field name (font_size)
		*/
	
		// height
		acf_render_field_setting( $field, array(
			'label'			=> __('Height','acf-mapmore'),
			'instructions'	=> __('Customise the map height','acf-mapmore'),
			'type'			=> 'text',
			'name'			=> 'height',
			'append'		=> 'px',
			'placeholder'	=> $this->default_values['height']
		));

		// center_lat
		acf_render_field_setting( $field, array(
			'label'			=> __('Center','acf-mapmore'),
			'instructions'	=> __('Center the initial map','acf-mapmore'),
			'type'			=> 'text',
			'name'			=> 'center_lat',
			'prepend'		=> 'lat',
			'placeholder'	=> $this->default_values['center_lat']
		));
		
		
		// center_lng
		acf_render_field_setting( $field, array(
			'label'			=> __('Center','acf-mapmore'),
			'instructions'	=> __('Center the initial map','acf-mapmore'),
			'type'			=> 'text',
			'name'			=> 'center_lng',
			'prepend'		=> 'lng',
			'placeholder'	=> $this->default_values['center_lng'],
			'wrapper'		=> array(
				'data-append' => 'center_lat'
			)
		));
		
		// zoom
		acf_render_field_setting( $field, array(
			'label'			=> __('Zoom','acf-mapmore'),
			'instructions'	=> __('Set the initial zoom level','acf-mapmore'),
			'type'			=> 'text',
			'name'			=> 'zoom',
			'placeholder'	=> $this->default_values['zoom']
		));

	}
	
	
	
	/*
	*  render_field()
	*
	*  Create the HTML interface for your field
	*
	*  @param	$field (array) the $field being rendered
	*
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field (array) the $field being edited
	*  @return	n/a
	*/
	
	function render_field( $field ) {
		
		/*
		*  Create a map input
		*/
		
		$map_id 					= 'map-' 		. esc_attr($field['key']);		# Map unique identifier
		$controls_id 				= 'controls-' 	. esc_attr($field['key']);		# Map controls unique identifier
		$map_id_js					= esc_attr($field['key']);						# Map unique identifier used in js
		$field_name 				= esc_attr($field['name']);

		?>

		<div class="acf-hidden">
			<input type="hidden" name="<?php echo $field_name ?>" value="<?php echo esc_attr( $field['value'] ); ?>">
		</div>

		<script type="text/javascript">
		jQuery(function($){

			var locations<?= $map_id_js ?> = [];

			<?php if ( !empty($field['value']) ) : ?>

				<?php $current_value = json_decode($field['value']); ?>

				<?php if ( json_last_error() === JSON_ERROR_NONE ) : ?>

					locations<?= $map_id_js ?> = <?= $field['value'] ?>;

				<?php endif; ?>

			<?php endif; ?>

			var map<?= $map_id_js ?> = new google.maps.Map(
				document.getElementById('<?= $map_id ?>'), 
				{
					center: {
						lat: <?= ($field['center_lat'] ?: $this->default_values['center_lat'] ) ?>, 
						lng: <?= ($field['center_lng'] ?: $this->default_values['center_lng'] ) ?>
					},
					zoom: <?= ( $field['zoom'] ?: $this->default_values['zoom'] ) ?>,
					disableDefaultUI: true
				}
			);

			$('#<?= $map_id ?>').mapMore({
				map: map<?= $map_id_js ?>,
				fieldname: '<?= $field_name ?>',
				locations: locations<?= $map_id_js ?>
			});

		});

		</script>
		<div class="acf-field-mapmore-row">
			<div class="acf-field-mapmore-content">
				<div id="<?= $map_id ?>" style="<?php echo esc_attr('height: '.$field['height'].'px'); ?>"></div>
			</div>
		</div>
		<div class="acf-field-mapmore-row">
			<p style="text-align: center;">
				<a class="button button-primary" id="mapmore-clear-map">Clear Map</a>
			</p>
		</div>
		<?php

		/*
	    * Marker icons
		*/
		
		$icons = $this->get_icons();

		if ( is_array($icons) ) : 
		
			$icons_count = count($icons);

		?>

			<div class="acf-field-mapmore-row">

		<?php

			foreach( $icons as $icon ) :

				?>
				
				<a href="#" class="acf-field-mapmore-icon-select" data-acf-field-mapmore-icon="<?= $icon ?>">
					
					<img src="<?= $icon ?>" alt="Marker icon" width="48" height="48">

				</a>

				<?php

			endforeach;

			?>

			</div>

			<div class="acf-field-mapmore-row" <?php echo $icons_count == 0 ? 'style="display: none;"' : '' ?> >
				<p style="text-align: center;">
					<a class="button button-primary" id="mapmore-clear-marker">Clear Marker</a>
				</p>
			</div>

			<?php

		endif;


		/*
		*  Review the data of $field.
		*  This will show what data is available
		*/
		/*
		echo '<pre>';
			print_r( $field );
		echo '</pre>';
		*/
	}

	function get_icons() {

		// Prepare icons array
		$icons = [];

		// Define directory where icons are stored
		$dir = __DIR__ . '/../assets/images/icons/';

		// If directory does not exist, return empty result
		if ( !file_exists($dir) )
			return $icons;

		$files = scandir($dir);
		
		// If no file is found, return empty result
		if ( !is_array($files) )
			return $icons;

		foreach( $files as $file ) {

			$filepath = $dir . $file;

			$ext = pathinfo($filepath, PATHINFO_EXTENSION);

			switch ( $ext ) {

				case 'svg':
					
					$icons[] = plugins_url( 'assets/images/icons/'.$file, dirname(__FILE__) );

				break;

				default:
					// @todo - support png
				break;

			}

		}

		return $icons;

	}
	
		
	/*
	*  input_admin_enqueue_scripts()
	*
	*  This action is called in the admin_enqueue_scripts action on the edit screen where your field is created.
	*  Use this action to add CSS + JavaScript to assist your render_field() action.
	*
	*  @type	action (admin_enqueue_scripts)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function input_admin_enqueue_scripts() {
		
		$dir = str_replace( 'fields/', '', plugin_dir_url( __FILE__ ) );

		// @hotfix: google api key
		$key = '';
		$keys = acf_get_setting('mapmore_google_api_key');
	 	if (isset($keys[0])) {
	 		$key = $keys[0];
	 	}

		// register & inlcude Google maps
		wp_register_script( 'googlemaps-api', '//maps.googleapis.com/maps/api/js?v=3&key='.$key.'&libraries=drawing', array(), '3', false );
		wp_enqueue_script('googlemaps-api');


		// register & include JS
		wp_register_script( 'acf-input-mapmore', "{$dir}assets/js/input.js" );
		wp_enqueue_script('acf-input-mapmore');
		
		
		// register & include CSS
		wp_register_style( 'acf-input-mapmore', "{$dir}assets/css/input.css" ); 
		wp_enqueue_style('acf-input-mapmore');
		
		
	}
	
	
	/*
	*  input_admin_head()
	*
	*  This action is called in the admin_head action on the edit screen where your field is created.
	*  Use this action to add CSS and JavaScript to assist your render_field() action.
	*
	*  @type	action (admin_head)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	/*
		
	function input_admin_head() {
	
		
		
	}
	
	*/
	
	
	/*
   	*  input_form_data()
   	*
   	*  This function is called once on the 'input' page between the head and footer
   	*  There are 2 situations where ACF did not load during the 'acf/input_admin_enqueue_scripts' and 
   	*  'acf/input_admin_head' actions because ACF did not know it was going to be used. These situations are
   	*  seen on comments / user edit forms on the front end. This function will always be called, and includes
   	*  $args that related to the current screen such as $args['post_id']
   	*
   	*  @type	function
   	*  @date	6/03/2014
   	*  @since	5.0.0
   	*
   	*  @param	$args (array)
   	*  @return	n/a
   	*/
   	
   	/*
   	
   	function input_form_data( $args ) {
	   	
		
	
   	}
   	
   	*/
	
	
	/*
	*  input_admin_footer()
	*
	*  This action is called in the admin_footer action on the edit screen where your field is created.
	*  Use this action to add CSS and JavaScript to assist your render_field() action.
	*
	*  @type	action (admin_footer)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	/*
		
	function input_admin_footer() {
	
		
		
	}
	
	*/
	
	
	/*
	*  field_group_admin_enqueue_scripts()
	*
	*  This action is called in the admin_enqueue_scripts action on the edit screen where your field is edited.
	*  Use this action to add CSS + JavaScript to assist your render_field_options() action.
	*
	*  @type	action (admin_enqueue_scripts)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	/*
	
	function field_group_admin_enqueue_scripts() {
		
	}
	
	*/

	
	/*
	*  field_group_admin_head()
	*
	*  This action is called in the admin_head action on the edit screen where your field is edited.
	*  Use this action to add CSS and JavaScript to assist your render_field_options() action.
	*
	*  @type	action (admin_head)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	/*
	
	function field_group_admin_head() {
	
	}
	
	*/


	/*
	*  load_value()
	*
	*  This filter is applied to the $value after it is loaded from the db
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value (mixed) the value found in the database
	*  @param	$post_id (mixed) the $post_id from which the value was loaded
	*  @param	$field (array) the field array holding all the field options
	*  @return	$value
	*/
	
	/*
	
	function load_value( $value, $post_id, $field ) {
		
		return $value;
		
	}
	
	*/
	
	
	/*
	*  update_value()
	*
	*  This filter is applied to the $value before it is saved in the db
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value (mixed) the value found in the database
	*  @param	$post_id (mixed) the $post_id from which the value was loaded
	*  @param	$field (array) the field array holding all the field options
	*  @return	$value
	*/
	
	/*
	
	function update_value( $value, $post_id, $field ) {
		
		return $value;
		
	}
	
	*/
	
	
	/*
	*  format_value()
	*
	*  This filter is appied to the $value after it is loaded from the db and before it is returned to the template
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value (mixed) the value which was loaded from the database
	*  @param	$post_id (mixed) the $post_id from which the value was loaded
	*  @param	$field (array) the field array holding all the field options
	*
	*  @return	$value (mixed) the modified value
	*/
		
	/*
	
	function format_value( $value, $post_id, $field ) {
		
		// bail early if no value
		if( empty($value) ) {
		
			return $value;
			
		}
		
		
		// apply setting
		if( $field['font_size'] > 12 ) { 
			
			// format the value
			// $value = 'something';
		
		}
		
		
		// return
		return $value;
	}
	
	*/
	
	
	/*
	*  validate_value()
	*
	*  This filter is used to perform validation on the value prior to saving.
	*  All values are validated regardless of the field's required setting. This allows you to validate and return
	*  messages to the user if the value is not correct
	*
	*  @type	filter
	*  @date	11/02/2014
	*  @since	5.0.0
	*
	*  @param	$valid (boolean) validation status based on the value and the field's required setting
	*  @param	$value (mixed) the $_POST value
	*  @param	$field (array) the field array holding all the field options
	*  @param	$input (string) the corresponding input name for $_POST value
	*  @return	$valid
	*/
	
	/*
	
	function validate_value( $valid, $value, $field, $input ){
		
		// Basic usage
		if( $value < $field['custom_minimum_setting'] )
		{
			$valid = false;
		}
		
		
		// Advanced usage
		if( $value < $field['custom_minimum_setting'] )
		{
			$valid = __('The value is too little!','acf-mapmore'),
		}
		
		
		// return
		return $valid;
		
	}
	
	*/
	
	
	/*
	*  delete_value()
	*
	*  This action is fired after a value has been deleted from the db.
	*  Please note that saving a blank value is treated as an update, not a delete
	*
	*  @type	action
	*  @date	6/03/2014
	*  @since	5.0.0
	*
	*  @param	$post_id (mixed) the $post_id from which the value was deleted
	*  @param	$key (string) the $meta_key which the value was deleted
	*  @return	n/a
	*/
	
	/*
	
	function delete_value( $post_id, $key ) {
		
		
		
	}
	
	*/
	
	
	/*
	*  load_field()
	*
	*  This filter is applied to the $field after it is loaded from the database
	*
	*  @type	filter
	*  @date	23/01/2013
	*  @since	3.6.0	
	*
	*  @param	$field (array) the field array holding all the field options
	*  @return	$field
	*/
	
	/*
	
	function load_field( $field ) {
		
		return $field;
		
	}	
	
	*/
	
	
	/*
	*  update_field()
	*
	*  This filter is applied to the $field before it is saved to the database
	*
	*  @type	filter
	*  @date	23/01/2013
	*  @since	3.6.0
	*
	*  @param	$field (array) the field array holding all the field options
	*  @return	$field
	*/
	
	/*
	
	function update_field( $field ) {
		
		return $field;
		
	}	
	
	*/
	
	
	/*
	*  delete_field()
	*
	*  This action is fired after a field is deleted from the database
	*
	*  @type	action
	*  @date	11/02/2014
	*  @since	5.0.0
	*
	*  @param	$field (array) the field array holding all the field options
	*  @return	n/a
	*/
	
	/*
	
	function delete_field( $field ) {
		
		
		
	}	
	
	*/
	
	
}


// create initialize
new acf_field_mapmore();


// class_exists check
endif;

?>
