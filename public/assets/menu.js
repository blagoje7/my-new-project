function toggleMenu(isOpen) {
    const hamburger = document.querySelector('.hamburger');
    const navItems = document.querySelector('.nav-items');
    
    if (isOpen) {
        hamburger?.classList.add('active');
        navItems?.classList.add('show');
        document.body.classList.add('menu-open');
    } else {
        hamburger?.classList.remove('active');
        navItems?.classList.remove('show');
        document.body.classList.remove('menu-open');
    }
}

function initializeMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navItems = document.querySelector('.nav-items');

    // Toggle menu on hamburger click
    hamburger?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCurrentlyOpen = navItems?.classList.contains('show');
        toggleMenu(!isCurrentlyOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!hamburger?.contains(target) && 
            !navItems?.contains(target) && 
            navItems?.classList.contains('show')) {
            toggleMenu(false);
        }
    }, { passive: true });

    // Close menu when clicking a nav link
    navItems?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
        });
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navItems?.classList.contains('show')) {
            toggleMenu(false);
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMenu);
} else {
    initializeMenu();
}

// Handle window resize - optimized with requestAnimationFrame
let resizeRaf;
let isResizing = false;

window.addEventListener('resize', () => {
    if (!isResizing) {
        isResizing = true;
        
        if (resizeRaf) {
            cancelAnimationFrame(resizeRaf);
        }
        
        resizeRaf = requestAnimationFrame(() => {
            // Close menu if open during resize
            const navItems = document.querySelector('.nav-items');
            if (navItems?.classList.contains('show')) {
                toggleMenu(false);
            }
            isResizing = false;
        });
    }
}, { passive: true });
