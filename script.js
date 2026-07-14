/* ═══════════════════════════════════════════════════════════
   Cheng Real Estates — Supabase Integration
   ═══════════════════════════════════════════════════════════
   HOW TO USE
   1. Add the Supabase SDK to your <head>, above this file:
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

   2. Add this file just before </body>, AFTER your existing
      <script> block that defines submitBooking()/resetForm():
        <script src="supabase-booking.js"></script>

      (Loading it after your original script is what lets it
      safely override submitBooking() with the Supabase version
      below — no need to edit your existing code.)

   3. Fill in SUPABASE_URL and SUPABASE_ANON_KEY below.

   4. Run schema.sql in your Supabase project's SQL editor to
      create the "appointments" and "properties" tables.
   ═══════════════════════════════════════════════════════════ */

const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';       // e.g. https://xxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_PUBLIC_KEY';

let supabaseClient = null;
try {
    if (window.supabase && SUPABASE_URL.startsWith('http')) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn('Supabase SDK not found or SUPABASE_URL not set — add the SDK <script> tag and your project URL/key.');
    }
} catch (e) {
    console.warn('Supabase client not initialised:', e);
}

/* Creates (or reuses) a small error message element under the submit button */
function getSubmitErrorEl() {
    let el = document.getElementById('submit-error');
    if (!el) {
        el = document.createElement('p');
        el.id = 'submit-error';
        el.style.color = '#c0392b';
        el.style.fontSize = '0.9rem';
        el.style.marginTop = '10px';
        el.style.textAlign = 'right';
        el.style.display = 'none';
        const btn = document.getElementById('submit-btn');
        if (btn && btn.parentNode) {
            btn.parentNode.appendChild(el);
        }
    }
    return el;
}

/* Overrides the page's submitBooking() to save into Supabase */
async function submitBooking() {
    if (typeof validateForm === 'function' && !validateForm()) {
        const firstInvalid = document.querySelector('.invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const submitError = getSubmitErrorEl();
    submitError.style.display = 'none';
    submitError.textContent = '';

    const val = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    };

    const payload = {
        full_name:          val('full-name'),
        email:               val('email'),
        phone:               val('phone'),
        nationality:         val('nationality'),
        gender:              val('gender'),
        property_interest:   val('property-interest') || null,
        preferred_date:      val('preferred-date') || null,
        notes:               val('notes') || null,
    };

    if (!supabaseClient) {
        submitError.textContent = 'Booking service is not configured yet. Please contact us directly by phone or email.';
        submitError.style.display = 'block';
        console.warn('Supabase is not configured — set SUPABASE_URL and SUPABASE_ANON_KEY in supabase-booking.js.');
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const originalLabel = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting…';
    }

    try {
        const { error } = await supabaseClient
            .from('appointments')
            .insert([payload]);

        if (error) throw error;

        const formContainer = document.getElementById('booking-form-container');
        const success = document.getElementById('booking-success');
        if (formContainer) formContainer.style.display = 'none';
        if (success) success.style.display = 'block';

        const nameSpan = document.getElementById('success-name');
        const emailSpan = document.getElementById('success-email');
        if (nameSpan) nameSpan.textContent = payload.full_name;
        if (emailSpan) emailSpan.textContent = payload.email;
    } catch (err) {
        console.error('Error saving booking:', err);
        submitError.textContent = 'Something went wrong submitting your request. Please try again or contact us directly.';
        submitError.style.display = 'block';
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel || 'Submit Appointment Request';
        }
    }
}

/* Optional: loads listings from a "properties" table in Supabase.
   Falls back silently to whatever rows are already in the HTML
   if Supabase isn't configured or the table is empty. */
async function loadProperties() {
    if (!supabaseClient) return;

    const tbody = document.getElementById('properties-tbody')
        || document.querySelector('#properties table tbody');
    if (!tbody) return;

    try {
        const { data, error } = await supabaseClient
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (!data || data.length === 0) return;

        tbody.innerHTML = data.map(p => `
            <tr>
                <td>${p.title ?? ''}</td>
                <td>${p.location ?? ''}</td>
                <td>${Number(p.price ?? 0).toLocaleString()}</td>
                <td>${p.bedrooms ?? 'N/A'}</td>
                <td>${p.type ?? ''}</td>
                <td>${p.status ?? 'Available'}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.warn('Could not load properties from Supabase, showing static list:', err);
    }
}

window.addEventListener('DOMContentLoaded', loadProperties);
