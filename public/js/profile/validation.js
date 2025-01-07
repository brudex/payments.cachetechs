// Profile form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profileForm');
    const phoneInput = document.getElementById('phoneNumber');

    form.addEventListener('submit', function(e) {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    });

    // Phone number validation
    phoneInput.addEventListener('input', function() {
        const isValid = /^\+?[1-9]\d{1,14}$/.test(this.value);
        if (this.value && !isValid) {
            this.setCustomValidity('Please enter a valid phone number');
        } else {
            this.setCustomValidity('');
        }
    });
});