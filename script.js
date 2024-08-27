const MOBILE_IMAGE_WIDTH_PERCENTAGE = 0.85;
const INK_BLEED_WIDTH = 20; // Width of the ink bleed effect in pixels
let cursorX, containerRect, isLandscape;

const isMobileOrTablet = () => window.innerWidth <= 1024;
const isLandscapeMode = () => window.innerWidth > window.innerHeight;

const updateClipPath = (percentage) => {
    const redacted = document.getElementById('redacted');
    const unredacted = document.getElementById('unredacted');
    const inkBleed = document.getElementById('ink-bleed');
    
    const clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0% 100%)`;
    redacted.style.clipPath = clipPath;
    unredacted.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
};

const animate = () => {
    const width = isMobileOrTablet() ? containerRect.width * MOBILE_IMAGE_WIDTH_PERCENTAGE : containerRect.width;
    const percentage = Math.min(100, Math.max(0, (cursorX / width) * 100));
    updateClipPath(percentage);
};

const updateCursorPosition = (clientX, isTouchEvent = false) => {
    if (isMobileOrTablet() && isTouchEvent) {
        const imageWidth = containerRect.width * MOBILE_IMAGE_WIDTH_PERCENTAGE;
        const imageLeft = (containerRect.width - imageWidth) / 2;
        cursorX = Math.max(0, Math.min(clientX - containerRect.left - imageLeft, imageWidth));
    } else if (!isMobileOrTablet()) {
        cursorX = Math.max(0, Math.min(clientX - containerRect.left, containerRect.width));
    }
    updateSlider();
    animate();
};

const updateSlider = () => {
    const width = isMobileOrTablet() ? containerRect.width * MOBILE_IMAGE_WIDTH_PERCENTAGE : containerRect.width;
    const percentage = (cursorX / width) * 100;
    document.getElementById('camera-slider').value = Math.min(100, Math.max(0, percentage));
};

const switchToMobileImages = () => {
    document.querySelector('#redacted .poem-image').src = 'src/REDACTED-POEM-MOBILE.png';
    document.querySelector('#unredacted .poem-image').src = 'src/UNREDACTED-POEM-MOBILE.png';
};

const switchToDesktopImages = () => {
    document.querySelector('#redacted .poem-image').src = 'src/REDACTED-POEM.png';
    document.querySelector('#unredacted .poem-image').src = 'src/UNREDACTED-POEM.png';
};

const handleResize = () => {
    containerRect = document.getElementById('container').getBoundingClientRect();
    isLandscape = isLandscapeMode();
    const sliderContainer = document.getElementById('camera-slider-container');
    sliderContainer.style.display = isMobileOrTablet() ? 'block' : 'none';
    cursorX = isMobileOrTablet() ? containerRect.width * MOBILE_IMAGE_WIDTH_PERCENTAGE : containerRect.width;
    updateSlider();
    animate();

    // Switch images based on device
    if (isMobileOrTablet()) {
        switchToMobileImages();
    } else {
        switchToDesktopImages();
    }
};

const initializeFullRedacted = () => {
    handleResize();
    updateClipPath(100);
};

// Typing animation
const phrases = ["Enter your email here...", "To join our waiting list!"];
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeAnimation() {
    const placeholder = document.getElementById('animated-placeholder');
    const currentPhrase = phrases[currentPhraseIndex];

    if (isDeleting) {
        placeholder.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        placeholder.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 50;
        setTimeout(typeAnimation, 800); // Pause before deleting
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typingSpeed = 100;
        setTimeout(typeAnimation, 500); // Pause before typing next phrase
    } else {
        setTimeout(typeAnimation, typingSpeed);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const slider = document.getElementById('camera-slider');

    slider.addEventListener('input', () => {
        const width = isMobileOrTablet() ? containerRect.width * MOBILE_IMAGE_WIDTH_PERCENTAGE : containerRect.width;
        cursorX = (slider.value / 100) * width;
        animate();
    });

    container.addEventListener('mousemove', (e) => !isMobileOrTablet() && updateCursorPosition(e.clientX));
    container.addEventListener('touchstart', (e) => isMobileOrTablet() && updateCursorPosition(e.touches[0].clientX, true));
    container.addEventListener('touchmove', (e) => {
        if (isMobileOrTablet()) {
            e.preventDefault();
            updateCursorPosition(e.touches[0].clientX, true);
        }
    });

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    initializeFullRedacted();
    handleResize(); 

    // Start the typing animation
    typeAnimation();

    // Hide placeholder when input is focused
    document.getElementById('email').addEventListener('focus', function() {
        document.getElementById('animated-placeholder').style.display = 'none';
    });

    // Show placeholder when input is blurred and empty
    document.getElementById('email').addEventListener('blur', function() {
        if (this.value === '') {
            document.getElementById('animated-placeholder').style.display = 'block';
        }
    });
});

// Email form submission logic

document.getElementById('email-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var statusDiv = document.getElementById('status');
    
    statusDiv.textContent = 'Greatness takes time...';
    console.log('Attempting to submit email:', email);
    
    fetch('https://script.google.com/macros/s/AKfycbzIGpH52dMRf2CZhvQ4OVVEtNQrtKEOByTn8JsaNuvve5HM17hDOG9Q5rgfZc7jIXq1/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        console.log('Response received:', response);
        statusDiv.textContent = 'Thank you for joining!';
        document.getElementById('email').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        statusDiv.textContent = 'An error occurred. Please try again.';
    });
});