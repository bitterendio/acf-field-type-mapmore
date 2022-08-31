#!/bin/bash
set -e

if [ ! -f /var/www/html/wp-content/plugins/acf-field-type-mapmore/tests/bootstrap.php ]
then
    /usr/local/bin/wp-cli.phar scaffold plugin-tests --path=/var/www/html acf-field-type-mapmore --allow-root
else
    echo "Test files already scaffolded"
fi
