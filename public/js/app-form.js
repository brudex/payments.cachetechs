// App form handling
const AppForm = {
    init() {
        this.form = document.getElementById('createAppForm');
        this.shouldSendCallback = document.getElementById('shouldSendCallback');
        this.callbackUrlContainer = document.getElementById('callbackUrlContainer');
        this.callbackUrl = document.getElementById('callbackUrl');

        if (this.form) {
            this.setupEventListeners();
        }
    },

    setupEventListeners() {
        // Toggle callback URL field
        this.shouldSendCallback.addEventListener('change', () => this.toggleCallbackUrl());
        
        // Form validation
        this.form.addEventListener('submit', (e) => this.validateForm(e));
    },

    toggleCallbackUrl() {
        const isChecked = this.shouldSendCallback.checked;
        this.callbackUrlContainer.style.display = isChecked ? 'block' : 'none';
        this.callbackUrl.required = isChecked;
        
        if (!isChecked) {
            this.callbackUrl.value = '';
        }
    },

    validateForm(e) {
        // Validate payment modes
        const checkedModes = document.querySelectorAll('input[name="paymentModes[]"]:checked');
        if (checkedModes.length === 0) {
            e.preventDefault();
            alert('Please select at least one payment mode');
            return;
        }

        // Validate callback URL if enabled
        if (this.shouldSendCallback.checked) {
            const url = this.callbackUrl.value.trim();
            if (!url) {
                e.preventDefault();
                alert('Please enter a callback URL');
                this.callbackUrl.focus();
                return;
            }

            try {
                new URL(url);
            } catch (err) {
                e.preventDefault();
                alert('Please enter a valid URL (must start with http:// or https://)');
                this.callbackUrl.focus();
                return;
            }
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => AppForm.init());