// Password change functionality
document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.getElementById('passwordForm');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn');
    const requirements = {
        length: document.getElementById('length'),
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        number: document.getElementById('number'),
        match: document.getElementById('match')
    };

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });

    // Password strength and validation
    function validatePassword() {
        const password = newPassword.value;
        const confirm = confirmPassword.value;
        
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            match: password === confirm && password.length > 0
        };

        // Update requirement indicators
        Object.keys(checks).forEach(check => {
            requirements[check].classList.toggle('valid', checks[check]);
        });

        // Calculate strength
        const strength = Object.values(checks).filter(Boolean).length;
        const strengthBar = document.getElementById('passwordStrength');
        strengthBar.innerHTML = '<div></div>';
        const strengthDiv = strengthBar.firstChild;

        if (strength < 3) {
            strengthDiv.className = 'strength-weak';
        } else if (strength < 5) {
            strengthDiv.className = 'strength-medium';
        } else {
            strengthDiv.className = 'strength-strong';
        }

        // Enable/disable submit button
        submitBtn.disabled = !Object.values(checks).every(Boolean);
    }

    newPassword.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validatePassword);

    // Reset form when modal is closed
    const modal = document.getElementById('changePasswordModal');
    modal.addEventListener('hidden.bs.modal', function () {
        passwordForm.reset();
        document.getElementById('passwordStrength').innerHTML = '';
        submitBtn.disabled = true;
        document.querySelectorAll('.requirements-list li').forEach(li => li.classList.remove('valid'));
    });
});