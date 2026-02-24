// Custom JavaScript for Rank and Play

document.addEventListener('DOMContentLoaded', function() {
    console.log('Rank and Play custom.js loaded');

    // Example: Smooth scroll to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add your custom JS here
    // Example: Alert on button click
    // const buttons = document.querySelectorAll('.btn-primary');
    // buttons.forEach(btn => {
    //     btn.addEventListener('click', () => alert('Button clicked!'));
    // });
});