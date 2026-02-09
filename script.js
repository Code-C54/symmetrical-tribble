document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const els = {
        recipientInput: document.getElementById('input-recipient'),
        questionInput: document.getElementById('input-question'),
        msgInput: document.getElementById('input-message'),
        imgInput: document.getElementById('input-image'),
        musicInput: document.getElementById('input-music'),
        successInput: document.getElementById('input-success-msg'),
        
        mainHeading: document.getElementById('main-heading'),
        subMessage: document.getElementById('sub-message'),
        teddyDefault: document.getElementById('teddy-default'),
        teddySuccess: document.getElementById('teddy-success'),
        customImg: document.getElementById('custom-image'),
        
        btnYes: document.getElementById('btn-yes'),
        btnNo: document.getElementById('btn-no'),
        
        modal: document.getElementById('success-modal'),
        modalHeading: document.getElementById('modal-heading'),
        modalBody: document.getElementById('modal-body'),
        closeModal: document.getElementById('btn-close-modal'),
        
        adminPanel: document.getElementById('admin-panel'),
        btnCustomize: document.getElementById('customize-btn'),
        btnCloseAdmin: document.getElementById('close-admin'),
        btnGenerate: document.getElementById('btn-generate-link'),
        copyFeedback: document.getElementById('copy-feedback'),
        
        audio: document.getElementById('bg-music'),
        musicToggle: document.getElementById('music-toggle'),
        
        swatches: document.querySelectorAll('.color-swatch')
    };

    // State
    let currentState = {
        recipient: '',
        question: 'Will you be my Valentine?',
        message: 'I have a question for you...',
        image: '',
        music: '',
        success: 'Yay! Best day ever!',
        theme: 'pink'
    };

    // 1. Parse URL Parameters on Load
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('r')) currentState.recipient = params.get('r');
    if (params.has('q')) currentState.question = params.get('q');
    if (params.has('m')) currentState.message = params.get('m');
    if (params.has('i')) currentState.image = params.get('i');
    if (params.has('mu')) currentState.music = params.get('mu');
    if (params.has('s')) currentState.success = params.get('s');
    if (params.has('t')) currentState.theme = params.get('t');

    // 2. Render View based on State
    renderView();

    function renderView() {
        // Text
        const namePart = currentState.recipient ? `, ${currentState.recipient}` : '';
        els.mainHeading.innerText = currentState.question + namePart;
        els.subMessage.innerText = currentState.message;
        
        // Image
        if (currentState.image) {
            els.teddyDefault.classList.add('hidden');
            els.teddySuccess.classList.add('hidden');
            els.customImg.src = currentState.image;
            els.customImg.classList.remove('hidden');
        } else {
            els.customImg.classList.add('hidden');
            els.teddyDefault.classList.remove('hidden');
        }

        // Theme
        document.body.className = `theme-${currentState.theme}`;

        // Music
        if (currentState.music) {
            els.audio.src = currentState.music;
            els.musicToggle.classList.remove('hidden');
        }

        // Populate Admin Inputs (Syncing state to inputs)
        els.recipientInput.value = currentState.recipient;
        els.questionInput.value = currentState.question;
        els.msgInput.value = currentState.message;
        els.imgInput.value = currentState.image;
        els.musicInput.value = currentState.music;
        els.successInput.value = currentState.success;
    }

    // 3. Admin Panel Logic (Live Preview)
    
    // Toggle Panel
    els.btnCustomize.addEventListener('click', () => els.adminPanel.classList.remove('hidden'));
    els.btnCloseAdmin.addEventListener('click', () => els.adminPanel.classList.add('hidden'));

    // Live Updates
    const updateStateFromInput = (key, value) => {
        currentState[key] = value;
        renderView();
    };

    els.recipientInput.addEventListener('input', (e) => updateStateFromInput('recipient', e.target.value));
    els.questionInput.addEventListener('input', (e) => updateStateFromInput('question', e.target.value));
    els.msgInput.addEventListener('input', (e) => updateStateFromInput('message', e.target.value));
    els.imgInput.addEventListener('input', (e) => updateStateFromInput('image', e.target.value));
    els.musicInput.addEventListener('input', (e) => updateStateFromInput('music', e.target.value));
    els.successInput.addEventListener('input', (e) => updateStateFromInput('success', e.target.value));

    // Theme Swatches
    els.swatches.forEach(btn => {
        btn.addEventListener('click', () => {
            updateStateFromInput('theme', btn.dataset.theme);
        });
    });

    // 4. Generate Shareable Link
    els.btnGenerate.addEventListener('click', () => {
        const baseUrl = window.location.origin + window.location.pathname;
        const query = new URLSearchParams({
            r: currentState.recipient,
            q: currentState.question,
            m: currentState.message,
            i: currentState.image,
            mu: currentState.music,
            s: currentState.success,
            t: currentState.theme
        });

        const finalUrl = `${baseUrl}?${query.toString()}`;
        
        navigator.clipboard.writeText(finalUrl).then(() => {
            els.copyFeedback.innerText = "Copied to clipboard! Send it to them!";
            setTimeout(() => els.copyFeedback.innerText = "", 3000);
        });
    });

    // 5. Interaction Logic (Yes/No/Music)

    // Music Toggle
    let isPlaying = false;
    els.musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            els.audio.pause();
            els.musicToggle.innerText = "🎵";
        } else {
            els.audio.play().catch(e => alert("Please interact with the page first to play audio."));
            els.musicToggle.innerText = "⏸";
        }
        isPlaying = !isPlaying;
    });

    // "No" Button - Polite interaction
    const noTexts = ["Are you sure?", "Pretty please?", "Really?", "Okay :("];
    let noClickCount = 0;
    
    els.btnNo.addEventListener('click', () => {
        if (noClickCount < noTexts.length) {
            els.btnNo.innerText = noTexts[noClickCount];
            noClickCount++;
            // Gentle shake animation
            els.btnNo.style.transform = "translateX(10px)";
            setTimeout(() => els.btnNo.style.transform = "translateX(0)", 100);
        }
    });

    // "Yes" Button - Success!
    els.btnYes.addEventListener('click', () => {
        // 1. Confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFB6C1', '#C23B59', '#FFF']
        });

        // 2. Change Teddy (if using SVG)
        if (!currentState.image) {
            els.teddyDefault.classList.add('hidden');
            els.teddySuccess.classList.remove('hidden');
        }

        // 3. Show Modal
        els.modalHeading.innerText = `Yay! ${currentState.recipient || 'Valentine'}!`;
        els.modalBody.innerText = currentState.success;
        els.modal.classList.add('visible');
    });

    els.closeModal.addEventListener('click', () => {
        els.modal.classList.remove('visible');
    });
});