document.addEventListener('DOMContentLoaded', function () {
    const themes = {
        light: 'claro',
        dark: 'escuro'
    };

    function initThemeLoader() {
        const themeLoader = document.getElementById('theme')
        const themeStylesheetLink = document.getElementById('themeStylesheetLink')
        let currentTheme = localStorage.getItem('theme') || 'light'

        updateTheme(currentTheme)

        function changeTheme () {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light'
            themeStylesheetLink.setAttribute('href', `css/${currentTheme}.css`)
            localStorage.setItem('theme', currentTheme)
            updateTheme(currentTheme)
            console.log(`O estilo atual é ${currentTheme}`)
        }

        function updateTheme(theme) {
            if (themeLoader) {
                const oppositeTheme = theme === 'light' ? 'dark' : 'light'
                themeLoader.innerHTML = `Modo ${themes[oppositeTheme]}`
            }
        }

        if (themeLoader) {
            themeLoader.addEventListener('click', changeTheme)
        }
        activateTheme(currentTheme)
    }

    function activateTheme(themeName) {
        const themeStylesheetLink = document.getElementById('themeStylesheetLink')
        themeStylesheetLink.setAttribute('href', `css/${themeName}.css`)
    }
    initThemeLoader()
})