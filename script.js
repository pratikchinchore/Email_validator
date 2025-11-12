/* script.js - Neon Corporate Edition 2025
   Now includes progress bar, beautiful UI messages, and full error handling.
*/

const AppState = {
  emailsForValidation: [],
  unwantedEmails: [],
  emailsForDuplicates: [],
};

///// Utility helpers /////
function showLoader(id) { $(`#${id}`).show(); }
function hideLoader(id) { $(`#${id}`).hide(); }

function safeText(v) {
  return (v === undefined || v === null) ? '' : String(v).trim();
}
function isExcelExtension(filename) {
  const ext = filename?.split('.').pop().toLowerCase();
  return ['xls', 'xlsx'].includes(ext);
}
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
function buildTableHtml(headerHtml, rows) {
  return headerHtml + (rows.length ? rows.join('') : '');
}

///// Alert system (for professional messages) /////
function showAlert(targetId, type, msg) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.classList.remove('d-none', 'alert-info', 'alert-warning', 'alert-danger', 'alert-success');
  el.classList.add(`alert-${type}`);
  el.innerHTML = `<strong>${type === 'danger' ? 'Error:' : ''}</strong> ${msg}`;
  el.style.display = 'block';
}
function hideAlert(targetId) {
  const el = document.getElementById(targetId);
  if (el) el.classList.add('d-none');
}

///// Excel reading /////
function readExcelFileAsJson(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target.result;
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
          resolve(jsonData);
        } catch (err) {
          reject(new Error('Invalid or corrupted Excel file.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsArrayBuffer(file);
    } catch (err) {
      reject(new Error('FileReader not supported.'));
    }
  });
}

///// Upload & Parse for Validation /////
async function upload() {
  hideAlert('display_first_msg');
  hideAlert('display_first_msg3');
  const file = document.getElementById('file_upload').files[0];
  if (!file) return showAlert('display_first_msg3', 'danger', 'Please select an Excel file.');
  if (!isExcelExtension(file.name)) return showAlert('display_first_msg3', 'danger', 'Only .xls or .xlsx files are supported.');

  showLoader('loader');
  try {
    // const jsonData = await readExcelFileAsJson(file);
    const jsonData = await readExcelFileWithProgress(file, 'progressBar', 'errorBox');
    if (!jsonData.length) throw new Error('The uploaded Excel file is empty.');

    const emails = [];
    jsonData.forEach(row => {
      const email = safeText(row.Email || row.email || row.EMAIL || row['E-mail']);
      if (email) emails.push(email);
    });

    AppState.emailsForValidation = emails;
    document.getElementById('display_first_msg3').innerHTML = `<p>✅ Records loaded: <b>${emails.length}</b></p>`;
    $('#display_first_msg3').removeClass('d-none alert-danger').addClass('alert-success');
  } catch (err) {
    showAlert('display_first_msg3', 'danger', err.message);
  } finally {
    hideLoader('loader');
  }
}

///// Validation Logic /////
const UNWANTED_SUBSTRINGS = [
  "..", ".comm", ".coml", ".comb", ".educ", ".eduu", ".eduf", ".comc", ".comq", ".comf", ".comu",
  ".comn", ".orgb", ".orgc", ".orgq", ".orgg", ".orgf", ".comd", ".comg", ".coma", ".comx", ".mili",
  ".govc", ".milv", ".saxo", ".govq", "o.ukk", ".comi", "comrh", "grada", ".govw", "com.a", ".coms",
  "lilli", "comen", "e.coo", ".como", ".govt", "com.t", ".idit", "org.a", ".comk", ".nett", "org.t",
  "com.p", ".comz", ".comv", "e.cob", ".govo", ".edum", ".comh", "org.e", "h.cat", "bbr.c", "ca.mi",
  "wwww", ".com."
];
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,12}$/i;

async function remove_unwanted() {
  hideAlert('display_first_msg');
  const emails = AppState.emailsForValidation;
  if (!emails.length) return showAlert('display_first_msg', 'danger', 'Please upload a file first.');

  showLoader('loader');
  const progress = createProgressBar('loader', 'progress_valid');

  const rows = [];
  let validCount = 0, invalidCount = 0;
  for (let i = 0; i < emails.length; i++) {
    const email = safeText(emails[i]);
    let status = 'Valid';

    if (!EMAIL_REGEX.test(email) || UNWANTED_SUBSTRINGS.some(b => email.toLowerCase().includes(b))) {
      invalidCount++;
      status = 'Invalid';
    } else {
      validCount++;
    }

    rows.push(`<tr><td>${email}</td><td>${status}</td></tr>`);
    if (i % 100 === 0 || i === emails.length - 1) {
      progress.value = Math.round(((i + 1) / emails.length) * 100);
      await sleep(1);
    }
  }

  const table = document.getElementById('display_excel_data2');
  table.innerHTML = buildTableHtml('<tr><th>Email</th><th>Status</th></tr>', rows);
  $(table).show();

  showAlert('display_first_msg', 'info', `✅ Valid: <b>${validCount}</b> | ❌ Invalid: <b>${invalidCount}</b>`);
  progress.remove();
  hideLoader('loader');
}

///// Duplicate Finder /////
async function upload1() {
  hideAlert('duplicate_msg_1');
  const file = document.getElementById('file_upload1').files[0];
  if (!file) return showAlert('duplicate_msg_1', 'danger', 'Please select an Excel file.');
  if (!isExcelExtension(file.name)) return showAlert('duplicate_msg_1', 'danger', 'Only .xls or .xlsx files are supported.');

  showLoader('loader2');
  try {
    const jsonData = await readExcelFileAsJson(file);
    if (!jsonData.length) throw new Error('The uploaded Excel file is empty.');

    const emails = [];
    jsonData.forEach(row => {
      const email = safeText(row.Email || row.email || row.EMAIL || row['E-mail']);
      if (email) emails.push(email);
    });

    AppState.emailsForDuplicates = emails;
    showAlert('duplicate_msg_1', 'success', `✅ Records loaded: <b>${emails.length}</b>`);
  } catch (err) {
    showAlert('duplicate_msg_1', 'danger', err.message);
  } finally {
    hideLoader('loader2');
  }
}

async function remove_duplicate() {
  hideAlert('duplicate_msg_2');
  const emails = AppState.emailsForDuplicates;
  if (!emails.length) return showAlert('duplicate_msg_2', 'danger', 'Please upload a file first.');

  showLoader('loader2');
  const progress = createProgressBar('loader2', 'progress_duplicate');
  const seen = new Map();
  const rows = [];
  let dupCount = 0;

  for (let i = 0; i < emails.length; i++) {
    const email = safeText(emails[i]);
    let status = '-';
    if (seen.has(email)) {
      status = 'Duplicate';
      dupCount++;
    }
    seen.set(email, true);
    rows.push(`<tr><td>${email}</td><td>${status}</td></tr>`);

    if (i % 100 === 0 || i === emails.length - 1) {
      progress.value = Math.round(((i + 1) / emails.length) * 100);
      await sleep(1);
    }
  }

  const table = document.getElementById('display_excel_data3');
  table.innerHTML = buildTableHtml('<tr><th>Email</th><th>Status</th></tr>', rows);
  $(table).show();

  showAlert('duplicate_msg_2', 'info', `🔁 Duplicates: <b>${dupCount}</b> | ✅ Unique: <b>${seen.size}</b>`);
  progress.remove();
  hideLoader('loader2');
}

///// Progress bar creation /////
function createProgressBar(loaderId, barId) {
  const loader = document.getElementById(loaderId);
  const bar = document.createElement('progress');
  bar.id = barId;
  bar.max = 100;
  bar.value = 0;
  bar.style.cssText = 'width: 100%; height: 10px; border-radius: 10px; margin-top: 8px;';
  loader.parentNode.insertBefore(bar, loader.nextSibling);
  return bar;
}

///// Download Handlers /////
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clickme1').addEventListener('click', () => {
    $('#display_excel_data2').table2excel({
      filename: 'Validated_Emails.xls',
      fileext: '.xls'
    });
  });
  document.getElementById('clickme2').addEventListener('click', () => {
    $('#display_excel_data3').table2excel({
      filename: 'Duplicates_Emails.xls',
      fileext: '.xls'
    });
  });

  // Expose global functions for HTML onclick attributes
  window.upload = upload;
  window.remove_unwanted = remove_unwanted;
  window.upload1 = upload1;
  window.remove_duplicate = remove_duplicate;
});
///// Excel reading with Progress & Error Handling /////
async function readExcelFileWithProgress(file, progressId, errorId) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const progressBar = document.getElementById(progressId);
    const errorBox = document.getElementById(errorId);

    if (errorBox) errorBox.classList.add('d-none');
    if (progressBar) {
      progressBar.style.width = '0%';
      progressBar.classList.remove('d-none');
    }

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        // Simulate chunk processing to update progress
        let processed = 0;
        const total = rows.length;
        const chunkSize = Math.ceil(total / 20); // smooth updates

        function processChunk() {
          processed += chunkSize;
          const percent = Math.min(100, Math.round((processed / total) * 100));
          if (progressBar) progressBar.style.width = percent + "%";
          if (processed < total) {
            setTimeout(processChunk, 50);
          } else {
            if (progressBar) progressBar.classList.add('bg-success');
            resolve(rows);
          }
        }
        processChunk();
      } catch (err) {
        if (errorBox) {
          errorBox.classList.remove('d-none');
          errorBox.innerHTML = `<strong>Error:</strong> Unable to process file. Check if it's a valid Excel sheet.`;
        }
        reject(err);
      }
    };

    reader.onerror = () => {
      if (errorBox) {
        errorBox.classList.remove('d-none');
        errorBox.innerHTML = `<strong>Error:</strong> Failed to read the file.`;
      }
      reject(new Error('FileReader error'));
    };

    reader.readAsArrayBuffer(file);
  });
}
