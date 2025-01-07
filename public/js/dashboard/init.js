// Dashboard Initialization
function initializeDashboard() {
    // Initialize sidebar
    if (window.Sidebar) {
        Sidebar.init();
    }

    // Initialize app list if on apps page
    if (window.AppList && document.querySelector('.app-list')) {
        AppList.init();
    }

    // Initialize password modal if it exists
    if (window.PasswordModal && document.getElementById('changePasswordModal')) {
        PasswordModal.init();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);