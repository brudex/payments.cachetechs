window.PasswordModal = {
    init() {
        // Initialize elements
        this.modal = document.getElementById('changePasswordModal');
        this.form = document.getElementById('passwordForm');
        this.newPassword = document.getElementById('newPassword');
        this.confirmPassword = document.getElementById('confirmPassword');
        this.submitBtn = document.getElementById('submitBtn');
        this.strengthBar = document.getElementById('passwordStrength');
        this.requirements = {
            length: document.getElementById('length'),
            uppercase: document.getElementById('uppercase'),
            lowercase: document.getElementById('lowercase'),
            number: document.getElementById('number'),
            match: document.getElementById('match')
        };

        if (this.modal) {
            this.setupEventListeners();
            this.setupPasswordToggles();
            this.setupModalReset();
        }
    },

    setupEventListeners() {
        // Password validation events
        this.newPassword.addEventListener('input', () => this.validatePassword());
        this.confirmPassword.addEventListener('input', () => this.validatePassword());

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    setupPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', () => {
                const input = button.previousElementSibling;
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                
                const icon = button.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        });
    },

    setupModalReset() {
        this.modal.addEventListener('hidden.bs.modal', () => {
            this.form.reset();
            this.strengthBar.innerHTML = '';
            this.submitBtn.disabled = true;
            
            // Reset requirement indicators
            Object.values(this.requirements).forEach(element => {
                element.classList.remove('valid');
            });

            // Reset password toggles
            document.querySelectorAll('.toggle-password i').forEach(icon => {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            });

            // Reset password input types
            document.querySelectorAll('input[type="text"]').forEach(input => {
                if (input.classList.contains('form-control')) {
                    input.type = 'password';
                }
            });
        });
    },

    validatePassword() {
        const password = this.newPassword.value;
        const confirm = this.confirmPassword.value;
        
        // Check requirements
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            match: password === confirm && password.length > 0
        };

        // Update requirement indicators
        Object.entries(checks).forEach(([check, isValid]) => {
            this.requirements[check].classList.toggle('valid', isValid);
        });

        // Update strength bar
        this.updateStrengthBar(checks);

        // Enable/disable submit button
        this.submitBtn.disabled = !Object.values(checks).every(Boolean);
    },

    updateStrengthBar(checks) {
        const strength = Object.values(checks).filter(Boolean).length;
        this.strengthBar.innerHTML = '<div></div>';
        const strengthDiv = this.strengthBar.firstChild;

        if (strength < 3) {
            strengthDiv.className = 'strength-weak';
        } else if (strength < 5) {
            strengthDiv.className = 'strength-medium';
        } else {
            strengthDiv.className = 'strength-strong';
        }
    },

    handleSubmit(e) {
        if (!this.form.checkValidity()) {
            e.preventDefault();
            return;
        }

        // Show loading state
        this.submitBtn.disabled = true;
        const originalText = this.submitBtn.innerHTML;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Changing Password...';

        // Reset button state after submission (server will handle redirect)
        setTimeout(() => {
            this.submitBtn.innerHTML = originalText;
            this.submitBtn.disabled = false;
        }, 2000);
    }
};