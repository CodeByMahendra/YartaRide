// YatraRide Unified Theme Configuration
// Use these colors consistently across all pages

export const theme = {
    // Primary Colors
    primary: {
        main: 'indigo-600',
        light: 'indigo-500',
        dark: 'indigo-700',
        darker: 'indigo-800',
    },

    // Secondary/Neutral Colors
    secondary: {
        main: 'slate-900',
        light: 'slate-800',
        lighter: 'slate-700',
    },

    // Background Colors
    background: {
        main: 'slate-50',
        white: 'white',
        dark: 'slate-900',
    },

    // Accent Colors (Use sparingly)
    accent: {
        success: 'emerald-500',
        error: 'red-500',
        warning: 'amber-500',
    },

    // Gradients
    gradients: {
        primary: 'from-indigo-600 to-indigo-700',
        primaryVia: 'from-indigo-600 via-indigo-700 to-indigo-800',
        dark: 'from-slate-900 to-slate-800',
    },

    // Shadows
    shadows: {
        primary: 'shadow-indigo-500/30',
        primaryLight: 'shadow-indigo-500/20',
        primaryStrong: 'shadow-indigo-500/50',
        default: 'shadow-black/5',
    },

    // Text Colors
    text: {
        primary: 'slate-900',
        secondary: 'slate-600',
        tertiary: 'slate-400',
        white: 'white',
    },
};

// Helper function to get Tailwind class
export const getThemeClass = (category: keyof typeof theme, variant: string) => {
    return (theme[category] as any)[variant] || '';
};
