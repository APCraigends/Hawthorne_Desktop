// Desabilita menu de contexto e teclas F12
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {
    if (e.keyCode == 123) { return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; }
}

// === LOGIN ===
function checkPassword() {
    const input = document.getElementById('password-input').value;
    const errorMsg = document.getElementById('error-msg');

    // Senha do Livro
    if (input === "C455@ndr4") {
        errorMsg.textContent = "Decrypting... Access Granted.";
        errorMsg.style.color = "#4CAF50";

        let audio = document.getElementById('access-sound');
        if (audio) audio.play().catch(e => console.log(e));

        setTimeout(() => {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('desktop-screen').classList.remove('hidden');
        }, 1000);
    } else {
        errorMsg.textContent = "INCORRECT PASSWORD.";
        errorMsg.style.color = "#ff4444";
        document.getElementById('password-input').value = "";
    }
}

document.getElementById('password-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkPassword();
});

// === GERENCIAMENTO DE JANELAS ===
function openWindow(id) {
    closeAll();
    const win = document.getElementById(id);
    if (win) win.classList.remove('hidden');
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) win.classList.add('hidden');
    if (id === 'win-projects') goBack('view-root'); // Reseta pasta
}

function closeAll() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(w => w.classList.add('hidden'));
    const viewer = document.getElementById('desktop-image-viewer');
    if (viewer) viewer.classList.add('hidden');
}

// === PREVIEW DE IMAGENS (NOVO) ===
function openImagePreview(filename, caption) {
    const viewer = document.getElementById('desktop-image-viewer');
    const img = document.getElementById('viewer-img');
    const txt = document.getElementById('viewer-caption');

    // Caminho da imagem
    img.src = 'assets/images/' + filename;
    txt.textContent = caption;

    viewer.classList.remove('hidden');
}

// === SUBPASTAS (Projetos) ===
function openSubfolder(viewId, pathName) {
    document.getElementById('view-root').classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');
    document.getElementById('path-display').textContent += pathName;
}

function goBack(rootId) {
    // Esconde todas as possíveis subpastas
    document.getElementById('view-finch').classList.add('hidden');
    document.getElementById('view-sharma').classList.add('hidden');
    document.getElementById('view-eu').classList.add('hidden');
    document.getElementById('view-ludger').classList.add('hidden');

    // Mostra a raiz
    document.getElementById(rootId).classList.remove('hidden');
    document.getElementById('path-display').textContent = "/System/Users/DH/Active Projects";
}

// === LEITOR PDF ===

function openPDF(fileName) {
    const isMobile = window.innerWidth <= 768;
    // URL completa do seu arquivo no GitHub
    const rawUrl = 'https://apcraigends.github.io/Hawthorne_Desktop/assets/docs/' + fileName;

    if (isMobile) {
        window.open(rawUrl, '_blank');
    } else {
        const viewer = document.getElementById('win-pdf-viewer');
        const iframe = document.getElementById('pdf-frame');
        
        // Usando o gview para renderizar o PDF de forma embutida
        iframe.src = 'https://docs.google.com/gview?url=' + encodeURIComponent(rawUrl) + '&embedded=true';

        document.getElementById('pdf-title').textContent = "SecureViewer - " + fileName;
        viewer.classList.remove('hidden');
    }
}
// === ERRO BIOMÉTRICO ===
function triggerBiometricError(folderName) {
    closeAll();
    const modal = document.getElementById('bio-prompt');
    const msg = document.getElementById('bio-msg');
    const title = document.getElementById('bio-title');
    const status = document.getElementById('bio-status');
    const bar = document.getElementById('bio-progress');
    const icon = document.getElementById('bio-icon');

    modal.classList.remove('hidden');
    modal.style.animation = 'none';
    modal.offsetHeight;

    msg.textContent = "Scanning: " + folderName;
    title.textContent = "BIOMETRIC SCAN";
    title.style.color = "#fff";
    status.textContent = "Acquiring fingerprint...";
    status.style.color = "#888";
    bar.style.width = "0%";
    bar.style.backgroundColor = "#00bcd4";
    icon.innerHTML = "🖐️";

    setTimeout(() => {
        bar.style.width = "100%";
    }, 50);

    setTimeout(() => {
        title.textContent = "ACCESS DENIED";
        title.style.color = "#ff4444";
        status.textContent = "Identity Mismatch. Admin alerted.";
        status.style.color = "#ff4444";
        bar.style.backgroundColor = "#ff4444";
        icon.innerHTML = "⚠️";
        modal.style.animation = "shakeCenter 0.5s ease-in-out";
    }, 1800);
}
// === ARQUIVOS BLOQUEADOS (VOLUME) ===
function triggerLockedPDF(fileName, type) {
    let msg = "";

    // Define o tipo de proteção baseado no parâmetro
    if (type === 'NI Number') {
        msg = `PROTECTED DOCUMENT: ${fileName}\n\nEnter the first 4 characters of your National Insurance Number to decrypt.`;
    } else if (type === 'SMS Code') {
        msg = `SECURE ACCESS: ${fileName}\n\nA 6-digit verification code has been sent to +44 •••• •••78. Enter code:`;
    } else if (type === 'Postcode') {
        msg = `LEGAL ENCRYPTION: ${fileName}\n\nEnter primary residential Postcode for authentication:`;
    }

    // Abre o prompt do navegador
    const password = prompt(msg);

    // Independente do que o usuário digitar, ele falha
    if (password !== null) {
        alert("CRITICAL ERROR: Decryption key mismatch. Your IP and Identity have been logged. Please contact System Admin (D. Hawthorne).");
    }
}
// Navegação para a pasta Saved HTML
function openSubfolderHTML(viewId, pathName) {
    document.getElementById('html-view-root').classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');
    document.getElementById('html-path-display').textContent += pathName;
}

function goBackHTML(rootId) {
    // Esconde todas as sub-views de HTML e mostra a raiz
    document.getElementById('html-view-ledger').classList.add('hidden');
    document.getElementById(rootId).classList.remove('hidden');
    document.getElementById('html-path-display').textContent = "/System/Users/DH/Saved HTML";
}
// Função para Maximizar/Restaurar janela
function toggleMaximize(id) {
    const win = document.getElementById(id);
    win.classList.toggle('maximized');

    // Opcional: Mudar o ícone do botão quando maximizado
    const btn = win.querySelector('.maximize-btn');
    if (win.classList.contains('maximized')) {
        btn.textContent = '❐'; // Ícone de restaurar
    } else {
        btn.textContent = '▢'; // Ícone de maximizar
    }
}

// Lembre-se de resetar o maximizado ao fechar a janela
function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.add('hidden');
        win.classList.remove('maximized'); // Remove o maximizar para a próxima vez que abrir
    }
    if (id === 'win-projects') goBack('view-root');
}
document.addEventListener('play', function (e) {
    // Busca todos os elementos de áudio na página
    const allAudios = document.getElementsByTagName('audio');

    for (let i = 0; i < allAudios.length; i++) {
        // Se o áudio encontrado não for o que acabou de dar "play", ele pausa
        if (allAudios[i] != e.target) {
            allAudios[i].pause();
            // Opcional: allAudios[i].currentTime = 0; // Se quiser que o áudio reset do início ao ser pausado
        }
    }
}, true); // O 'true' garante que capturemos o evento na fase de propagação
function stopAndResetAudios(windowId) {
    const container = document.getElementById(windowId);
    if (!container) return;

    const audios = container.querySelectorAll("audio");
    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}
function stopAndResetAudios(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    win.querySelectorAll("audio").forEach(a => {
        a.pause();
        a.currentTime = 0;
        // opcional: garante reset total em alguns browsers
        a.load();
    });
}
