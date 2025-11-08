// CSS preload helper - loads deferred CSS files
(function() {
    const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]');
    preloadLinks.forEach(function(link) {
        link.addEventListener('load', function() {
            this.onload = null;
            this.rel = 'stylesheet';
            this.media = 'all';
        });
        // Trigger load if already loaded
        if (link.sheet) {
            link.rel = 'stylesheet';
            link.media = 'all';
        }
    });
})();
