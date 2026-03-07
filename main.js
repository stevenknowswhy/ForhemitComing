document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const joinBtn = document.getElementById('join-btn');
    const earlyAccessBtn = document.getElementById('early-access-btn');
    const emailReveal = document.getElementById('email-reveal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const recruitmentForm = document.getElementById('recruitment-form');
    const positionSelect = document.getElementById('position');
    const otherPositionWrapper = document.getElementById('other-position-wrapper');
    const otherPositionInput = document.getElementById('other-position');
    const nextStepBtns = document.querySelectorAll('.next-step');
    const finishBtn = document.getElementById('finish-btn');
    const submitEmailBtn = document.getElementById('submit-email');
    const emailInput = document.getElementById('email-input');

    // --- Position Dropdown Options ---
    const positions = [
        "Managing Director",
        "Investment Analyst",
        "Portfolio Manager",
        "Venture Associate",
        "Marketing Specialist",
        "Compliance Officer",
        "Executive Assistant",
        "Legal Counsel",
        "Other"
    ].sort((a, b) => {
        if (a === 'Other') return 1;
        if (b === 'Other') return -1;
        return a.localeCompare(b);
    });

    positions.forEach(pos => {
        const option = document.createElement('option');
        option.value = pos;
        option.textContent = pos;
        positionSelect.appendChild(option);
    });

    // --- Modal Logic ---
    const openModal = () => {
        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Reset steps
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById('step-1').classList.add('active');
        recruitmentForm.reset();
        otherPositionWrapper.classList.add('hidden');
    };

    joinBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Step Transitions
    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStepId = `step-${btn.dataset.next}`;
            document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
            document.getElementById(nextStepId).classList.add('active');
        });
    });

    // Other Position Toggle
    positionSelect.addEventListener('change', () => {
        if (positionSelect.value === 'Other') {
            otherPositionWrapper.classList.remove('hidden');
            otherPositionInput.setAttribute('required', 'true');
        } else {
            otherPositionWrapper.classList.add('hidden');
            otherPositionInput.removeAttribute('required');
        }
    });

    // Form Submission
    recruitmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send data to a server
        console.log('Recruitment form submitted');
        
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById('step-3').classList.add('active');
    });

    finishBtn.addEventListener('click', closeModal);

    // --- Early Access Logic ---
    earlyAccessBtn.addEventListener('click', () => {
        emailReveal.classList.add('visible');
        earlyAccessBtn.style.opacity = '0';
        earlyAccessBtn.style.pointerEvents = 'none';
        emailInput.focus();
    });

    submitEmailBtn.addEventListener('click', () => {
        if (emailInput.value && emailInput.checkValidity()) {
            console.log('Early access email:', emailInput.value);
            
            // Success animation
            submitEmailBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            `;
            submitEmailBtn.style.background = '#00C853';
            emailInput.value = 'Thank you!';
            emailInput.style.color = '#00C853';
            emailInput.disabled = true;
            
            setTimeout(() => {
                emailReveal.classList.remove('visible');
                earlyAccessBtn.style.opacity = '1';
                earlyAccessBtn.style.pointerEvents = 'auto';
                // Reset after fade out
                setTimeout(() => {
                    submitEmailBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    `;
                    submitEmailBtn.style.background = 'var(--primary)';
                    emailInput.value = '';
                    emailInput.style.color = 'white';
                    emailInput.disabled = false;
                }, 1000);
            }, 3000);
        } else {
            emailInput.classList.add('shake');
            setTimeout(() => emailInput.classList.remove('shake'), 500);
        }
    });
});
