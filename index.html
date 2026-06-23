/* ═══════════════════════════════════════════════════
   Cheng Real Estates — External JavaScript
   cheng-scripts.js
   ═══════════════════════════════════════════════════ */

/* ── Father's Day Pop-up ─────────────────────────── */

/**
 * Close the promo overlay and remove it from the tab order.
 */
function closePromo() {
    const overlay = document.getElementById('promo-overlay');
    if (!overlay) return;
    overlay.style.transition = 'opacity 0.3s ease';
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
}

// Show popup automatically after 1.2 s (gives the page time to paint)
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const overlay = document.getElementById('promo-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }, 1200);

    // Close on overlay background click
    document.getElementById('promo-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closePromo();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePromo();
    });

    // Wire close button
    document.getElementById('promo-close').addEventListener('click', closePromo);

    // Set minimum date on booking date input to today
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});


/* ── Appointment Booking Form ────────────────────── */

/**
 * Validate a single field.
 * Returns true if valid, false if not (and shows an error message).
 */
function validateField(id, errorId, message) {
    const el = document.getElementById(id);
    const err = document.getElementById(errorId);
    const value = el.value.trim();
    let valid = true;

    if (!value) {
        err.textContent = message;
        el.classList.add('invalid');
        valid = false;
    } else {
        err.textContent = '';
        el.classList.remove('invalid');
    }
    return valid;
}

/**
 * Extra validation for email format.
 */
function validateEmail() {
    const el = document.getElementById('email');
    const err = document.getElementById('err-email');
    const value = el.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
        err.textContent = 'Email address is required.';
        el.classList.add('invalid');
        return false;
    } else if (!emailRegex.test(value)) {
        err.textContent = 'Please enter a valid email address.';
        el.classList.add('invalid');
        return false;
    }
    err.textContent = '';
    el.classList.remove('invalid');
    return true;
}

/**
 * Run full form validation.
 * Returns true only if all required fields pass.
 */
function validateForm() {
    const nameOk    = validateField('full-name',   'err-name',        'Full name is required.');
    const emailOk   = validateEmail();
    const phoneOk   = validateField('phone',        'err-phone',       'Phone number is required.');
    const natOk     = validateField('nationality',  'err-nationality', 'Nationality is required.');
    const genderOk  = validateField('gender',       'err-gender',      'Please select a gender.');
    return nameOk && emailOk && phoneOk && natOk && genderOk;
}

/**
 * Handle form submission (client-side demo — no server call).
 */
function submitBooking() {
    if (!validateForm()) {
        // Scroll to first invalid field
        const firstInvalid = document.querySelector('.invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const name  = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();

    // Show success message
    document.getElementById('booking-form-container').style.display = 'none';
    const success = document.getElementById('booking-success');
    success.style.display = 'block';
    document.getElementById('success-name').textContent  = name;
    document.getElementById('success-email').textContent = email;
}

/**
 * Reset the form back to its initial state.
 */
function resetForm() {
    const fields = ['full-name', 'email', 'phone', 'nationality', 'gender',
                    'property-interest', 'preferred-date', 'notes'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const errors = document.querySelectorAll('.field-error');
    errors.forEach(e => { e.textContent = ''; });

    const invalids = document.querySelectorAll('.invalid');
    invalids.forEach(el => el.classList.remove('invalid'));

    document.getElementById('booking-success').style.display       = 'none';
    document.getElementById('booking-form-container').style.display = 'block';
}
