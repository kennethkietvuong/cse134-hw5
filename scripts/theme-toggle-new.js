window.addEventListener('DOMContentLoaded', init);

const BACKGROUND_PRESETS = {
    light: {
        key: 'light',
        body: '#f0f0f0',
        header: '#f8f8f8',
        text: '#222',
        centerLine: 'gray'
    },
    sunset: {
        key: 'sunset',
        body: '#1b1020',
        header: '#2a1724',
        text: '#ffeadd',
        centerLine: '#f97316'
    },
    midnight: {
        key: 'midnight',
        body: '#020617',
        header: '#020617',
        text: '#e5e7ef',
        centerLine: '#4b5563'
    }
};

const ACCENT_PRESETS = {
    blue: {
        key: 'blue',
        accent: '#4da3ff',
        hover: '#8bc2ff'
    },
    teal: {
        key: 'teal',
        accent: '#14b8a6',
        hover: '#2dd4bf'
    },
    purple: {
        key: 'purple',
        accent: '#a855f7',
        hover: '#c4b5fd'
    },
    orange: {
        key: 'orange',
        accent: '#f97316',
        hover: '#fdba74'
    }
};

const FONT_PRESETS = {
    rounded: {
        key: 'rounded',
        font: '"Montserrat", system-ui, sans-serif'
    },
    system: {
        key: 'system',
        font: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    serif: {
        key: 'serif',
        font: '"Georgia", "Times New Roman", serif'
    },
    mono: {
        key: 'mono',
        font: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    }
};

const DEFAULT_CUSTOM = {
    backgroundKey: 'sunset',
    accentKey: 'blue',
    fontKey: 'rounded'
};

function init() {
    const LOCAL_STORAGE_KEY = 'kv-portfolio-theme';
    const CUSTOM_STORAGE_KEY = 'kv-portfolio-custom-theme';

    let root = document.documentElement;
    let widget = document.querySelector('theme-widget');
    let toggle = widget.querySelector("#theme-toggle-btn");
    let panel = widget.querySelector("#theme-window");
    let options = widget.querySelectorAll("[data-theme]");

    // Custom theme controls
    let customPanel = widget.querySelector('[data-custom-panel]');
    let backgroundSelect = widget.querySelector('[data-custom-background]');
    let accentSelect = widget.querySelector('[data-custom-accent]');
    let fontSelect = widget.querySelector('[data-custom-font]');
    let customApplyBtn = widget.querySelector('[data-custom-apply]');

    // Load theme from localStorage
    function loadTheme() {
        return localStorage.getItem(LOCAL_STORAGE_KEY) || "light";
    }

    // Load custom theme from localStorage
    function loadCustomTheme() {
        try {
            let raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
            if (!raw) return {...DEFAULT_CUSTOM};
            let parsed = JSON.parse(raw);
            return {...DEFAULT_CUSTOM, ...parsed};
        }

        catch {
            return {...DEFAULT_CUSTOM};
        }
    }

    function saveCustomTheme(theme) {
        localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(theme));
    }

    function clearInlineCustomVars() {
        const keys = [
            '--body-background-color',
            '--header-footer-color',
            '--text-color',
            '--accent-color',
            '--accent-hover',
            '--button-color',
            '--font-theme',
            '--center-line-color'
        ];
        keys.forEach(k => root.style.removeProperty(k));
    }

    function applyCustomVars(theme) {
        let background = BACKGROUND_PRESETS[theme.backgroundKey] || BACKGROUND_PRESETS.light;
        let accent = ACCENT_PRESETS[theme.accentKey] || ACCENT_PRESETS.blue;
        let font = FONT_PRESETS[theme.fontKey] || FONT_PRESETS.rounded;

        root.style.setProperty('--body-background-color', background.body);
        root.style.setProperty('--header-footer-color', background.header);
        root.style.setProperty('--text-color', background.text);
        root.style.setProperty('--center-line-color', background.centerLine);
        root.style.setProperty('--accent-color', accent.accent);
        root.style.setProperty('--accent-hover', accent.hover);
        root.style.setProperty('--button-color', background === BACKGROUND_PRESETS.light ? '#333' : background.text);
        root.style.setProperty('--font-theme', font.font);
    }

    function updateActiveButtons(theme) {
        options.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        widget.classList.toggle('show-custom', theme === 'custom');
    }   

    function syncCustoms(theme) {
        if (!backgroundSelect || !accentSelect || !fontSelect) return;
        backgroundSelect.value = theme.backgroundKey;
        accentSelect.value = theme.accentKey;
        fontSelect.value = theme.fontKey;
    }

    function applyTheme(theme, custom) {
        if (theme === 'custom') {
            let settings = custom || loadCustomTheme();
            clearInlineCustomVars();
            applyCustomVars(settings);
            saveCustomTheme(settings);
            root.setAttribute('data-theme', 'custom');
        }

        else {
            clearInlineCustomVars();
            root.setAttribute('data-theme', theme);
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, theme);
        updateActiveButtons(theme);
    }

    // Initialize theme
    let initialTheme = loadTheme();
    if (initialTheme === 'custom') {
        let settings = loadCustomTheme();
        applyTheme('custom', settings);
        syncCustoms(settings);
    }

    else {
        applyTheme(initialTheme);
        syncCustoms(loadCustomTheme());
    }

    // Event Listeners
    toggle.addEventListener('click', () => {
        panel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target)) {
            widget.classList.remove('open');
        }
    });

    options.forEach(btn => {
        btn.addEventListener('click', () => {
            let theme = btn.dataset.theme;
            if (theme === 'custom') {
                applyTheme('custom');
            }

            else {
                applyTheme(theme);
            }
        });
    });

    if (customApplyBtn) {
        customApplyBtn.addEventListener('click', () => {
            let newSettings = {
                backgroundKey: backgroundSelect.value,
                accentKey: accentSelect.value,
                fontKey: fontSelect.value
            };
            applyTheme('custom', newSettings);
        })
    }

    preventFooter();

    console.log('theme toggle loaded.');
}

function preventFooter() {
    let footer = document.querySelector('footer');
    let widget = document.querySelector('theme-widget');

    function updateWidgetPos() {
        let footerBound = footer.getBoundingClientRect();

        if (footerBound.top <= window.innerHeight - 20) {
            widget.classList.add('stuck-to-footer');
        }

        else {
            widget.classList.remove('stuck-to-footer');
        }
    }
    
    window.addEventListener('scroll', updateWidgetPos);
    window.addEventListener('resize', updateWidgetPos);
    updateWidgetPos();
}