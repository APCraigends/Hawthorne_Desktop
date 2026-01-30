const modal = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalWindow = document.querySelector('.modal-window');

// Botões de ferramenta
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnMax = document.getElementById('btn-maximize');

let currentScale = 1;

// FUNÇÃO DE FILTRO DA BARRA LATERAL
function filterFiles(type) {
    const menuItems = document.querySelectorAll('.menu li');
    menuItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const audios = document.querySelectorAll('.audio-file');
    const images = document.querySelectorAll('.image-file');
    const docs = document.querySelectorAll('.doc-file');
    const media = document.querySelectorAll('.media-file'); // Nova classe

    const allFiles = [...audios, ...images, ...docs, ...media];

    allFiles.forEach(f => f.style.display = 'none');

    if (type === 'all') {
        allFiles.forEach(f => f.style.display = 'block');
    } else if (type === 'audio') {
        audios.forEach(f => f.style.display = 'block');
    } else if (type === 'image') {
        images.forEach(f => f.style.display = 'block');
    } else if (type === 'doc') {
        docs.forEach(f => f.style.display = 'block');
    } else if (type === 'media') {
        media.forEach(f => f.style.display = 'block');
    }
}

function closeModal() {
    modal.classList.add('hidden');
    modalContent.innerHTML = '';
    modalWindow.classList.remove('maximized'); // Reseta tamanho
    currentScale = 1; // Reseta zoom
}

// Fechar ao clicar fora
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// --- FUNÇÕES DE MÍDIA ---

// Tocar Áudio
function playAudio(filename, title) {
    toggleTools(false); // Esconde botões de zoom
    modalTitle.textContent = title;
    const audioPath = 'assets/audio/' + filename;

    // Fundo branco para áudio
    modalContent.style.background = "#fbfbfb";
    modalContent.style.cursor = "default";

    modalContent.innerHTML = `
        <div style="width: 100%; text-align: center; margin-top: 30px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🔊</div>
            <p style="color: #666;">${filename}</p>
            <!-- REMOVIDO ATRIBUTO AUTOPLAY ABAIXO -->
            <audio controls style="width: 80%;">
                <source src="${audioPath}" type="audio/mpeg">
                Seu navegador não suporta áudio.
            </audio>
        </div>
    `;
    modal.classList.remove('hidden');
}
let currentWidth = 90; // Começa com 90% da largura do modal

// Abrir Imagem com Zoom
function openImage(filename) {
    toggleTools(true); // Mostra botões de zoom
    modalTitle.textContent = "Evidence Viewer: " + filename;
    const imgPath = 'assets/images/cloud/' + filename;

    // ADICIONA O MAXIMIZE AUTOMÁTICO
    modalWindow.classList.add('maximized');

    // Fundo preto para imagem
    modalContent.style.background = "#1a1a1a";

    // Resetamos a largura inicial toda vez que abre
    currentWidth = 90;

    modalContent.innerHTML = `
        <img id="modal-image" src="${imgPath}" draggable="false">
    `;
    modal.classList.remove('hidden');
}
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
// --- LÓGICA DE ZOOM E MAXIMIZAR ---

function toggleTools(show) {
    const display = show ? 'inline-block' : 'none';
    btnZoomIn.style.display = display;
    btnZoomOut.style.display = display;
    btnMax.style.display = display;
}

function zoomImage(factor) {
    const img = document.getElementById('modal-image');
    if (!img) return;

    // Calcula novo zoom
    if (factor > 1) currentScale += 0.2;
    if (factor > 1) currentWidth += 20; // Aumenta 20%
    else currentScale -= 0.2;
    currentWidth -= 20; // Diminui 20%

    // Limites de zoom
    if (currentScale < 0.5) currentScale = 0.5;
    if (currentScale > 3) currentScale = 3;
    if (currentWidth < 40) currentWidth = 40;
    if (currentWidth > 500) currentWidth = 500;

    img.style.transform = `scale(${currentScale})`;

    // Se der zoom, muda o cursor para indicar que pode arrastar (scroll)
    if (currentScale > 1) img.style.cursor = "default";
    else img.style.cursor = "default";
}

function toggleMaximize() {
    modalWindow.classList.toggle('maximized');
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
function triggerLockedZip() {
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    const title = document.getElementById('modal-title');

    // Título técnico
    title.innerText = "SECURITY HANDSHAKE FAILED";
    title.style.color = "#1a1a1a";

    // O conteúdo simula um log de sistema falhando (Estilo "Guardião")
    content.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #e0e0e0; font-family: 'Inter', sans-serif;">
            
            <div style="font-size: 48px; margin-bottom: 15px;">🛡️🚫</div>
            
            <h3 style="margin-bottom: 20px; letter-spacing: 1px; color: #fff;">MISSING SECURITY CERTIFICATE</h3>

            <!-- Caixa simulando o Terminal de erro -->
            <div style="background: #1a1a1a; border: 1px solid #ff4444; padding: 15px; border-radius: 6px; width: 90%; max-width: 450px; font-family: 'Courier New', monospace; font-size: 13px; text-align: left; margin-bottom: 20px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
                <span style="color: #4caf50;">> Initiating SSL handshake... OK</span><br>
                <span style="color: #4caf50;">> Verifying user permissions... OK</span><br>
                <span style="color: #ffeb3b;">> Searching for local hardware token (CS_Key_v2)...</span><br>
                <span style="color: #ff4444; font-weight: bold;">> ERROR: DEVICE NOT RECOGNIZED.</span><br>
                <br>
                <span style="color: #ff4444;">FATAL: Decryption key not found on this machine. Access is restricted to physically authorized terminals only.</span>
            </div>

            <p style="text-align: center; font-size: 0.9rem; color: #999; max-width: 400px;">
                This file is locked to the specific hardware ID of Cassandra Snow's laptop. It cannot be opened on external devices.
            </p>

            <br>
            <button onclick="closeModal()" style="padding: 10px 25px; background: #ff4444; border: none; color: white; cursor: pointer; border-radius: 4px; font-weight: 600; letter-spacing: 1px;">CLOSE</button>
        </div>
    `;

    modal.classList.remove('hidden');
}
// === LEITOR PDF INTELIGENTE ===

function openPDF(fileName) {
    const viewer = document.getElementById('win-pdf-viewer');
    document.getElementById('pdf-frame').src = 'assets/docs/' + fileName;
    document.getElementById('pdf-title').textContent = "SecureViewer - " + fileName;
    viewer.classList.remove('hidden');    
}
