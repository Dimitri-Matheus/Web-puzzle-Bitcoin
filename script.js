// start puzzle
document.addEventListener('DOMContentLoaded', function () {
    let performance = localStorage.getItem('performanceMode') === 'true'
    let vibration = localStorage.getItem('vibration') === 'true'
    let autoMode = localStorage.getItem('autoMode') === 'true'
    let convertMode = localStorage.getItem('convertMode') === 'true'

    let count = 0

    function vibration_mode() {
        vibration = !vibration
        localStorage.setItem('vibration', vibration)
    }

    function convert_wif() {
        convertMode = !convertMode
        localStorage.setItem('convertMode', convertMode)
    }

    function performance_mode() {
        performance = !performance
        localStorage.setItem('performanceMode', performance)
    }

    function auto_mode() {
        autoMode = !autoMode
        localStorage.setItem('autoMode', autoMode)
    }

    const vibrationToggle = document.getElementById('vibrationToggle')
    if (vibrationToggle) {
        vibrationToggle.checked = vibration
        vibrationToggle.addEventListener('click', vibration_mode)
    }

    const wifToggle = document.getElementById('wifToggle')
    if (wifToggle) {
        wifToggle.checked = convertMode
        wifToggle.addEventListener('click', convert_wif)
    }

    const performanceToggle = document.getElementById('performanceToggle')
    if (performanceToggle) {
        performanceToggle.checked = performance
        performanceToggle.addEventListener('click', performance_mode)
    }
    
    const autoToggle = document.getElementById('autoToggle')
    if (autoToggle) {
        autoToggle.checked = autoMode
        autoToggle.addEventListener('click', auto_mode)
    }

    const stopButton = document.getElementById('stop')
    if (stopButton) {
        stopButton.addEventListener('click', () => {
            location.reload()
        })
    }

    window.start = async function () {
        clearLog()
        disable_button()
        console.time('Tempo total de execução')
        await new Promise(resolve => setTimeout(resolve, 100))
        loop(performance, autoMode, convertMode)

        if (vibration && "vibrate" in navigator) {
            navigator.vibrate(200)
        }
    }

    function disable_button(){
        document.getElementById("start").setAttribute('disabled', '')
        document.getElementById("console").style.backgroundColor = ''
        document.getElementById("console").style.animation = ''
    }

    function clearLog(){
        document.getElementById('console').innerHTML = `<span class="auto-type">Loading...</span>`
    }

    async function loop(performanceMode, autoMode, convertMode){
        let found_address = false

        while (!found_address) {
            // Carteira 20
            // let privateKeyInt = generateRandomNumber(0xc0000,0xe0000)
            // Carteira 65
            let privateKeyInt = generateRandomNumber(0x1a838b13505b20000,0x1a838b13505b30000)
            // Carteira 66
            // let privateKeyInt = generateRandomNumber(0x2832ed74f2b5e2000,0x2832ed74f2b5e3000)
            // Carteira 67
            //let privateKeyInt = generateRandomNumber(0x40000000000000000,0x7ffffffffffffffff)
            const limit = performanceMode ? 50000 : 100000
            console.log(`Modo performance: ${performance ? 'ativado' : 'desativado'}`)
            console.log(`Modo automático: ${autoMode ? 'ativado' : 'desativado'}`)
            console.log(`Converter: ${convertMode ? 'ativado' : 'desativado'}`)
            console.log(`Vibração: ${vibration ? 'ativado' : 'desativado'}`)
            console.log('Primeira chave: ', privateKeyInt.toString(16))

            for (i = 0; i < limit; i++){
                const address = generateAddress(privateKeyInt.toString(16))
                const wifkey = generateWIF(privateKeyInt)
                //console.log(privateKeyInt.toString(16), address) //modo desenvolvedor
                // Carteira 20
                // if (address == '1HsMJxNiV7TLxmoF6uJNkydxPFDog4NQum'){
                // Carteira 65
                if (address == '18ZMbwUFLMHoZBbfpCjUJQTCMCbktshgpe'){
                // Carteira 66
                // if (address == '13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so'){
                // Carteira 67
                //if (address == '1BY8GQbnueYofwSuFAT3USAhGjPrkxDdW9'){
                    log(`Resultado: Deu certo!!<br>`)
                    if (convertMode) {
                        log(`Endereço premiado: ${wifkey}`)
                    } else {
                        log(`Chave premiada: ${privateKeyInt.toString(16)}`)
                    }
                    document.getElementById("console").style.animation = 'scale-in 1s forwards'
                    document.getElementById("console").style.backgroundColor = '#A7C957'
                    document.getElementById("start").style.cursor = 'default'
                    document.getElementById("stop").style.cursor = 'cursor'
                    document.querySelector("span").style.display = 'none'
                    console.timeEnd('Tempo total de execução')
                    found_address = true
                    break
                }
                privateKeyInt++

                if(i % 1000 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0))
                }
            }
            count++
            if (autoMode & !found_address) {
                const console_element = document.getElementById('console')

                console_element.style.animation = 'wiggle 1s ease-in'
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        console_element.innerHTML = `<span class="auto-type">Contagens de ciclos: ${count}</span>`
                        console_element.style.animation = ''
                    })
                })
            }

            if (!found_address && !autoMode) {
                log(`Resultado: Infelizmente não deu certo!<br>`)
                log(`Chave checada: ${privateKeyInt.toString(16)}`)
                document.getElementById("console").style.animation = 'scale-in 1s forwards'
                document.getElementById("console").style.backgroundColor = '#E63946'
                document.getElementById("start").removeAttribute('disabled')
                document.querySelector("span").style.display = 'none'
                console.timeEnd('Tempo total de execução')
                break
            }
        }
    }
    

    function log(message){
        const consoleDiv = document.getElementById('console')
        consoleDiv.innerHTML += `${message}`
    }

    function generateAddress(privateKeyInt) {
        const privateKey = BigInt('0x' + privateKeyInt);
        
        // Use elliptic library to get the public key
        const EC = elliptic.ec;
        const ec = new EC('secp256k1');
        const keyPair = ec.keyFromPrivate(privateKeyInt, 'hex');
        const publicKey = keyPair.getPublic(true, 'hex'); // Compressed public key
    
        // Hash the public key with SHA-256
        const sha256Hash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(publicKey));
        // Hash the result with RIPEMD-160
        const ripemd160Hash = CryptoJS.RIPEMD160(sha256Hash);
    
        // Add version byte (0x00 for Main Network)
        const version = '00';
        const versionedHash = version + ripemd160Hash.toString();
    
        // Double SHA-256 hash the versioned hash and take the first 4 bytes for the checksum
        const checksum = CryptoJS.SHA256(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(versionedHash))).toString().substring(0, 8);
    
        // Combine the versioned hash and checksum
        const addressHex = versionedHash + checksum;
    
        // Convert the result to Base58
        const address = hexToBase58(addressHex);
    
        return address;
    }

    function generateWIF(privateKeyInt) {
        const privateKeyHex = privateKeyInt.toString(16).padStart(64, '0')
        const versionedPrivateKey = '80' + privateKeyHex
        const compressedPrivateKey = versionedPrivateKey + '01'

        const sha256Hash1 = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(compressedPrivateKey))
        const sha256Hash2 = CryptoJS.SHA256(sha256Hash1)

        const checksum = sha256Hash2.toString().substring(0, 8)
        const finalKey = compressedPrivateKey + checksum
        const WIF = hexToBase58(finalKey)

        return WIF
    }

    function hexToBase58(hex) {
        const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const base = BigInt(58);
        let num = BigInt('0x' + hex);
        let encoded = '';
        
        while (num > 0) {
            const remainder = num % base;
            num = num / base;
            encoded = alphabet[remainder] + encoded;
        }
    
        // Handle leading zeros
        for (let i = 0; i < hex.length && hex[i] === '0'; i += 2) {
            encoded = '1' + encoded;
        }
    
        return encoded;
    }

    function generateRandomNumber(min, max) {
        const range = BigInt(max-min); // Example range, adjust as needed
        const randomBytes = new Uint8Array(32);
        window.crypto.getRandomValues(randomBytes);
    
        let hexString = "";
        for (let i = 0; i < randomBytes.length; i++) {
            hexString += randomBytes[i].toString(16).padStart(2, "0");
        }
    
        const randomBigInt = BigInt(`0x${hexString}`);
        const result = BigInt(min) + (randomBigInt % range);
    
        return result
    }
})

// dark-mode
document.addEventListener('DOMContentLoaded', function () {
    function initThemeLoader() {
        const themeLoader = document.getElementById('themeToggle')
        const themeStylesheetLink = document.getElementById('themeStylesheetLink')
        let currentTheme = localStorage.getItem('theme') || 'light'

        if (themeLoader) {
            themeLoader.checked = currentTheme === 'dark'

            themeLoader.addEventListener('click', function () {
                currentTheme = themeLoader.checked ? 'dark' : 'light'
                
                const body = document.querySelector('body')
                body.style.transition = 'background-color .5s, color .5s linear'
                body.style.transition = ''
                void body.offsetWidth
                body.style.transition = 'background-color .5s, color .5s linear'

                themeStylesheetLink.setAttribute('href', `css/${currentTheme}.css`)
                localStorage.setItem('theme', currentTheme)
            })
        }
        console.log(`O estilo atual é ${currentTheme}`)
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
        help: 'help.html',
        index: 'index.html',
    }

    if (page in urls) {
        window.location.href = urls[page]
    }
}