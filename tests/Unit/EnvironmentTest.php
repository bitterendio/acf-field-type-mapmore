<?php

namespace AcfFieldTypeMapMore\Tests\Unit;

use AcfFieldTypeMapMore\AcfPluginMapMore;
use Brain\Monkey\Functions;

/**
 * These tests prove test setup works.
 *
 * They are useful for debugging.
 */
class EnvironmentTest extends TestCase
{
    /**
     * A sample test showing that polyfills work
     *
     * @see https://github.com/Yoast/PHPUnit-Polyfills#using-this-library
     */
    public function testSomething()
    {
        $this->assertIsBool( true );
        self::assertIsNotIterable( new \stdClass() );
    }

    /**
     * A test ensuring that the composer autoloader works
     */
    public function testAutoloaderWorks()
    {
        $this->assertSame('v4', AcfPluginMapMore::version(4));
    }

    /**
     * Test that we can mock WordPress functions
     *
     * @see https://giuseppe-mazzapica.gitbook.io/brain-monkey/functions-testing-tools/functions-when#justreturn
     */
    public function testMockWordPressFunction(){
        Functions\when('wp_insert_post')->justReturn(1);
        $this->assertIsNumeric(
            wp_insert_post([
                'post_title' => 'If I learn it again, I would recommend:',
                'post_content' => 'grow aloe. then grow cactus. then grow sempervivum. then grow lithops and echeveria'
            ])
        );
        $this->assertSame(1,wp_insert_post());
    }
}