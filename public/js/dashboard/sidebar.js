window.Sidebar = {
    init() {
        this.sidebar = document.querySelector('.sidebar');
        this.toggleBtn = document.querySelector('.sidebar-toggle');
        this.mainContent = document.querySelector('.main-content');
        
        if (this.sidebar && this.toggleBtn) {
            this.setupEventListeners();
            this.loadSavedState();
            this.checkScreenSize();
        }
    },

    setupEventListeners() {
        // Toggle button click
        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSidebar();
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.sidebar.contains(e.target) && !this.toggleBtn.contains(e.target)) {
                    this.sidebar.classList.remove('active');
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.checkScreenSize());
    },

    toggleSidebar() {
        if (window.innerWidth <= 768) {
            this.sidebar.classList.toggle('active');
        } else {
            this.sidebar.classList.toggle('collapsed');
            this.saveState();
        }
    },

    checkScreenSize() {
        if (window.innerWidth <= 768) {
            this.sidebar.classList.remove('collapsed');
            this.sidebar.classList.remove('active');
        } else {
            const savedState = this.loadSavedState();
            if (savedState === 'collapsed') {
                this.sidebar.classList.add('collapsed');
            }
        }
    },

    saveState() {
        const state = this.sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded';
        localStorage.setItem('sidebarState', state);
    },

    loadSavedState() {
        const savedState = localStorage.getItem('sidebarState');
        if (savedState === 'collapsed') {
            this.sidebar.classList.add('collapsed');
        }
        return savedState;
    }
};