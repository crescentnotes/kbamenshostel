
document.getElementById("menu-btn").addEventListener("click", function() {
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", function() {
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let slides = document.getElementsByClassName("slide");
        
        // Ensure there are slides to display
        if (slides.length === 0) {
            console.error("No slides found!");
            return;
        }

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none"; // Hide all slides
        }

        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }

        slides[slideIndex - 1].style.display = "block"; // Show the current slide

        setTimeout(showSlides, 2000); // Change slide every 2 seconds
    }
});
