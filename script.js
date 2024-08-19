document.getElementById('email-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var statusDiv = document.getElementById('status');
    
    statusDiv.textContent = 'Submitting...';
    console.log('Attempting to submit email:', email);
    
    var script = document.createElement('script');
    script.src = 'https://script.google.com/macros/s/AKfycbwdyu9qhjJ-iGdqYKP1w9jNjRi6ZCgpMsMQovtuhmdcaPViOLPw4wYUHsetrcObyDys/exec?callback=handleResponse&email=' + encodeURIComponent(email);
    document.body.appendChild(script);
});

function handleResponse(response) {
    var statusDiv = document.getElementById('status');
    console.log('Response:', response);
    if (response.result === "success") {
        statusDiv.textContent = 'Thank you for signing up!';
        document.getElementById('email').value = '';
    } else {
        statusDiv.textContent = 'Error: ' + response.message;
    }
}