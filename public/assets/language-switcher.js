document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('language-button');
    const dropdown = document.getElementById('language-dropdown');
    const items = document.querySelectorAll('.dropdown-item');

    if (!button || !dropdown) return;

    // Toggle dropdown
    button.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!button.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    }, { passive: true });

    // Pages that only exist in Serbian – switching language redirects to homepage
    const srOnlyPrefixes = [
        '/online-psihoterapija-anksioznost',
        '/online-psihoterapija-depresija',
        '/online-psihoterapija-burnout',
        '/online-psihoterapija-za-dijasporu',
        '/online-individualna-psihoterapija',
        '/online-psihoterapija-partnerski-i-porodicni-odnosi',
        '/online-psihoterapija-za-nisko-samopouzdanje',
        '/online-psihoterapija-perfekcionizam-samokriticnost-i-samosabotaza',
    ];

    function isSrOnlyPage(path) {
        return srOnlyPrefixes.some(prefix => path.startsWith(prefix));
    }

    // Handle language selection
    items.forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.getAttribute('data-lang');
            if (!lang) return;

            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/').filter(Boolean);
            let newPath;

            // If current page doesn't exist in other languages, go to homepage
            if (isSrOnlyPage(currentPath)) {
                newPath = `/${lang}/`;
                window.location.href = window.location.origin + newPath;
                return;
            }

            if (currentPath === '/' || pathParts.length === 0) {
                newPath = `/${lang}`;
            } else {
                const supportedLanguages = ['sr', 'en', 'nl'];
                if (supportedLanguages.includes(pathParts[0])) {
                    pathParts[0] = lang;
                } else {
                    pathParts.unshift(lang);
                }
                newPath = '/' + pathParts.join('/');
            }

            if (!newPath.endsWith('/')) {
                newPath += '/';
            }

            window.location.href = window.location.origin + newPath;
        });
    });
});
