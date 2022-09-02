<?php

/*
Plugin Name: Advanced Custom Fields: MapMore
Plugin URI: https://rozklad.dev
Description: Map complex field for Advanced Custom Fields
Version: 0.4.0
Author: rozklad
Author URI: https://rozklad.dev
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

add_action('plugins_loaded', function () {
    if (file_exists(__DIR__ . '/vendor/autoload.php')) {
      // Composer autoload
      include __DIR__ . '/vendor/autoload.php';
    } else {
      // Manual autoload
      include __DIR__ . '/src/AcfPluginMapMore.php';
    }
});

add_action('init', 'acf_field_type_mapmore', 1);

function acf_field_type_mapmore() {
  new AcfFieldTypeMapMore\AcfPluginMapMore();
}
