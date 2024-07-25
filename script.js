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

            const body = document.querySelector('body')
            body.style.transition = 'background-color .5s, color .5s linear'
            body.style.transition = ''
            void body.offsetWidth
            body.style.transition = 'background-color .5s, color .5s linear'
            
            themeStylesheetLink.setAttribute('href', `css/${currentTheme}.css`)
            localStorage.setItem('theme', currentTheme)
            updateTheme(currentTheme)
            console.log(`O estilo atual é ${currentTheme}`)
            console.log(body)
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

function navigate(page) {
    const urls = {
        play: 'play.html',
        options: 'options.html',
        index: 'index.html',
    }

    if (page in urls) {
        window.location.href = urls[page]
    } else {
        window.alert('Em breve! Como a maioria das funções deste site skksksks')
    }
}