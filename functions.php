<?php
/**
 * Rank and Play Child Theme Functions
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Enqueue parent theme (Astra) stylesheet
 */
function rankandplay_enqueue_parent_styles() {
    wp_enqueue_style( 'astra-parent-style', get_template_directory_uri() . '/style.css', array(), wp_get_theme( 'astra' )->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', 'rankandplay_enqueue_parent_styles' );

/**
 * Enqueue child theme custom CSS and JS
 */
function rankandplay_enqueue_custom_scripts() {
    // Custom CSS
    wp_enqueue_style(
        'rankandplay-custom-css',
        get_stylesheet_directory_uri() . '/css/custom.css',
        array( 'astra-parent-style' ),
        '1.0.0'
    );

    // Custom JS
    wp_enqueue_script(
        'rankandplay-custom-js',
        get_stylesheet_directory_uri() . '/js/custom.js',
        array( 'jquery' ), // Optional: remove if you don't need jQuery
        '1.0.0',
        true // Load in footer
    );
}
add_action( 'wp_enqueue_scripts', 'rankandplay_enqueue_custom_scripts', 20 ); // Higher priority to load after parent

/**
 * Register Custom Post Types (unchanged from before)
 */
function rankandplay_register_custom_post_types() {
    // Game Reviews CPT
    register_post_type( 'game_review', array(
        'labels'      => array(
            'name'          => _x( 'Game Reviews', 'Post type general name', 'rankandplay' ),
            'singular_name' => _x( 'Game Review', 'Post type singular name', 'rankandplay' ),
            'menu_name'     => _x( 'Game Reviews', 'Admin Menu text', 'rankandplay' ),
            'add_new_item'  => __( 'Add New Game Review', 'rankandplay' ),
            'all_items'     => __( 'All Game Reviews', 'rankandplay' ),
        ),
        'public'      => true,
        'has_archive' => true,
        'rewrite'     => array( 'slug' => 'game-reviews' ),
        'supports'    => array( 'title', 'editor', 'thumbnail', 'excerpt', 'comments', 'custom-fields' ),
        'show_in_rest'=> true,
        'menu_icon'   => 'dashicons-star-filled',
    ));

    // Hall of Fames CPT
    register_post_type( 'hall_of_fame', array(
        'labels'      => array(
            'name'          => _x( 'Hall of Fames', 'Post type general name', 'rankandplay' ),
            'singular_name' => _x( 'Hall of Fame', 'Post type singular name', 'rankandplay' ),
            'menu_name'     => _x( 'Hall of Fames', 'Admin Menu text', 'rankandplay' ),
            'add_new_item'  => __( 'Add New Hall of Fame Entry', 'rankandplay' ),
            'all_items'     => __( 'All Hall of Fame Entries', 'rankandplay' ),
        ),
        'public'      => true,
        'has_archive' => true,
        'rewrite'     => array( 'slug' => 'hall-of-fame' ),
        'supports'    => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest'=> true,
        'menu_icon'   => 'dashicons-awards',
    ));

    // Profiles CPT
    register_post_type( 'profile', array(
        'labels'      => array(
            'name'          => _x( 'Profiles', 'Post type general name', 'rankandplay' ),
            'singular_name' => _x( 'Profile', 'Post type singular name', 'rankandplay' ),
            'menu_name'     => _x( 'Profiles', 'Admin Menu text', 'rankandplay' ),
            'add_new_item'  => __( 'Add New Profile', 'rankandplay' ),
            'all_items'     => __( 'All Profiles', 'rankandplay' ),
        ),
        'public'      => true,
        'has_archive' => true,
        'rewrite'     => array( 'slug' => 'profiles' ),
        'supports'    => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest'=> true,
        'menu_icon'   => 'dashicons-id',
    ));
}
add_action( 'init', 'rankandplay_register_custom_post_types' );