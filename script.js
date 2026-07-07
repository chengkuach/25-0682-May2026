/* =========================================================
   Cheng Farmland — script.js
   Handles the contact form and (optionally) sends data to Supabase.

   HOW TO CONNECT SUPABASE
   ------------------------
   1. Create a project at https://supabase.com
   2. In your project settings, copy the "Project URL" and the
      "anon public" API key.
   3. Paste them into SUPABASE_URL and SUPABASE_ANON_KEY below.
   4. In the Supabase SQL editor, create a table like this:

        create table contact_submissions (
          id uuid primary key default gen_random_uuid(),
          first_name text not null,
          last_name text not null,
          email text not null,
          phone text,
          visit_date date,
          contact_type text,
          newsletter boolean default false,
          attachment_url text,
          created_at timestamptz default now()
        );

   5. If you want file uploads to work, create a Storage bucket
      named "attachments" (Storage -> New bucket -> public or
      private, your choice) in the Supabase dashboard.

   Until you fill in the two constants below, the form will just
   log the submission to the browser console instead of sending it
   anywhere, so the page still works out of the box.
   ========================================================= */

const SUPABASE_URL = "";       // e.g. "https://xyzcompany.supabase.co"
const SUPABASE_ANON_KEY = "";  // e.g. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

const TABLE_NAME = "contact_submissions";
const STORAGE_BUCKET = "attachments";

// Only create a Supabase client if credentials have been provided.
const supabaseClient =
  SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form-box");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const record = {
      first_name: formData.get("first_name")?.trim(),
      last_name: formData.get("last_name")?.trim(),
      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim() || null,
      visit_date: formData.get("visit_date") || null,
      contact_type: formData.get("contact_type"),
      newsletter: formData.get("newsletter") === "on",
    };

    const fileInput = document.getElementById("attachment");
    const file = fileInput.files[0] || null;

    submitBtn.disabled = true;
    setStatus("Sending...");

    try {
      if (supabaseClient) {
        await submitToSupabase(record, file);
        setStatus("Thanks! Your message has been sent.");
        form.reset();
      } else {
        // Fallback while Supabase keys are not configured yet.
        console.log("Form submission (Supabase not connected):", record, file);
        setStatus(
          "Form captured locally. Add your Supabase URL/key in script.js to store submissions."
        );
        form.reset();
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("Something went wrong. Please try again.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  function setStatus(message) {
    statusEl.textContent = message;
  }
});

/**
 * Uploads the optional attachment to Supabase Storage, then inserts
 * the form record (including the file's public URL, if any) into
 * the contact_submissions table.
 */
async function submitToSupabase(record, file) {
  let attachmentUrl = null;

  if (file) {
    const filePath = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    attachmentUrl = publicUrlData?.publicUrl || null;
  }

  const { error: insertError } = await supabaseClient
    .from(TABLE_NAME)
    .insert([{ ...record, attachment_url: attachmentUrl }]);

  if (insertError) throw insertError;
}
