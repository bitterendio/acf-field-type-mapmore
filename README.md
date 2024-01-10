# ACF MapMore Field

Complex map field for Advanced Custom Fields.

![Preview Field in Wordpress admin](https://raw.githubusercontent.com/sanatorium/acf-field-type-mapmore/master/screenshot.png)

**Supports**

- Areas
	- Circles
	- Polygons
- Routes
- Custom POIs

## Usage

### Displaying selected location


	$value = get_field('mapmore_field');

  	switch ( $value['type'] ) {

  		case 'rectangle':
  		?>
  		<script>
	      	new google.maps.Rectangle({
	      		bounds:     <?php echo json_encode($value['bounds']) ?>,
	      		map:        map
	      	});
		</script>
  		<?php
  		break;

      	case 'polyline':
		?>
		<script>
	      	new google.maps.Polyline({
	      		path:       <?php echo json_encode($value['path']) ?>],
	      		map:        map,
	      	});
      	</script>
      	<?php
      	break;

      	case 'polygon':
		?>
		<script>
	      	new google.maps.Polygon({
	      		path:       <?php echo json_encode($value['path']) ?>],
	      		map:        map
	      	});
      	</script>
      	<?php
      	break;

      	case 'circle':
		?>
		<script>
	      	new google.maps.Circle({
	      		center:     {lat: <?php echo $value['lat'] ?>], lng: <?php echo $value['lng'] ?>},
	      		radius:     <?php echo $value['radius'] ?>,
	      		map:        map
	      	});
      	</script>
      	<?php
      	break;

      	case 'marker':
		?>
		<script>
	      	new google.maps.Marker({
	      		position:   {lat: <?php echo $value['lat'] ?>], lng: <?php echo $value['lng'] ?>},
	      		map:        map,
	      		animation:  google.maps.Animation.DROP
	      	});
      	</script>
      	<?php
      	break;

  	}


### Adding marker icons

Add any *.svg files to ``images/icons`` they will be automatically available as Marker icons


### Setting Google API key

Add this to your theme's functions.php

```

function mapmore_acf_google_map_api() {

	acf_append_setting('mapmore_google_api_key', 'YOUR_GOOGLE_API_KEY');

}

add_filter('init', 'mapmore_acf_google_map_api');
```

-----------------------

### Description

EXTENDED_DESCRIPTION

### Compatibility

This ACF field type is compatible with:
* ACF 5
* ACF 4

### Installation

1. Copy the `acf-mapmore` folder into your `wp-content/plugins` folder
2. Activate the MapMore plugin via the plugins admin page
3. Create a new field via ACF and select the MapMore type
4. Please refer to the description for more info regarding the field type settings


### Tests

#### Unit Tests

```sh
composer run-script test
```

#### Integration Tests

With local setup

```sh
composer run-script test:wordpress
```

Using docker
```sh
docker-compose run phpunit
composer install
composer:test:wordpress
```



### Changelog
Please see `readme.txt` for changelog
### Credits

#### Icons

- Map Marker, Pin, thumb tack, Flag, Tree, forest, Flower, Sun, Crescent Moon, Tornado, Hail, Lightning, Day Fog, Bicycle, Car, Bus, Train, Hot Air Balloon, Departure, Airplane Mode, Tent, Image, Color, Shop, Hanging board by (Pham Thi Dieu Linh)[https://thenounproject.com/phdieuli/] from (the Noun Project)[https://thenounproject.com]




