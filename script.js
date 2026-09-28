```javascript
const resumeInput = document.getElementById("resumeInput");
const dropZone = document.getElementById("dropZone");
const filePreview = document.getElementById("filePreview");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const analyzeBtn = document.getElementById("analyzeBtn");
const results = document.getElementById("results");
const toast = document.getElementById("toast");

let selectedFile = null;


/* ---------------------------
   SCROLL
---------------------------- */

function scrollToUpload() {
  document.getElementById("upload").scrollIntoView({
    behavior: "smooth"
  });
}


/* ---------------------------
   FILE SELECT
---------------------------- */

resumeInput.addEventListener("change", function () {

  if (this.files.length > 0) {
    handleFile(this.files[0]);
  }

});


/* ---------------------------
   DRAG & DROP
---------------------------- */

dropZone.addEventListener("dragover", function (e) {

  e.preventDefault();

  dropZone.classList.add("dragging");

});


dropZone.addEventListener("dragleave", function () {

  dropZone.classList.remove("dragging");

});


dropZone.addEventListener("drop", function (e) {

  e.preventDefault();

  dropZone.classList.remove("dragging");

  const file = e.dataTransfer.files[0];

  if (file) {
    handleFile(file);
  }

});


/* ---------------------------
   HANDLE FILE
---------------------------- */

function handleFile(file) {

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ];

  const extension = file.name
    .split(".")
    .pop()
    .toLowerCase();

  const allowedExtensions = [
    "pdf",
    "doc",
    "docx",
    "txt"
  ];

  if (!allowedExtensions.includes(extension)) {

    showToast("Please upload a PDF, DOCX or TXT file.");

    return;
  }


  if (file.size > 10 * 1024 * 1024) {

    showToast("File must be smaller than 10MB.");

    return;
  }


  selectedFile = file;

  fileName.textContent = file.name;

  fileSize.textContent =
    formatFileSize(file.size);

  filePreview.style.display = "flex";

  analyzeBtn.style.display = "inline-flex";

  analyzeBtn.style.alignItems = "center";

  analyzeBtn.style.gap = "10px";

  showToast("Resume selected successfully.");

}


/* ---------------------------
   REMOVE FILE
---------------------------- */

function removeFile(event) {

  event.stopPropagation();

  selectedFile = null;

  resumeInput.value = "";

  filePreview.style.display = "none";

  analyzeBtn.style.display = "none";

}


/* ---------------------------
   FILE SIZE
---------------------------- */

function formatFileSize(bytes) {

  if (bytes < 1024) {
    return bytes + " B";
  }

  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }

  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}


/* ---------------------------
   ANALYZE
---------------------------- */

function analyzeResume() {

  if (!selectedFile) {

    showToast("Upload your resume first.");

    return;
  }


  analyzeBtn.innerHTML =
    "Analyzing <span>✦</span>";

  analyzeBtn.disabled = true;


  /*
    DEMO ANALYSIS

    This currently displays the example
    analysis included in index.html.

    Later we can connect this function
    to an AI backend/API.
  */


  setTimeout(function () {

    results.classList.add("visible");

    analyzeBtn.innerHTML =
      "Analysis Complete ✓";

    analyzeBtn.disabled = false;

    results.scrollIntoView({
      behavior: "smooth"
    });

  }, 1800);

}


/* ---------------------------
   TOAST
---------------------------- */

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(function () {

    toast.classList.remove("show");

  }, 2500);

}


/* ---------------------------
   FIX BUTTONS
---------------------------- */

document.addEventListener("click", function (e) {

  if (e.target.classList.contains("fix-btn")) {

    e.target.textContent = "Suggestion applied ✓";

    e.target.style.opacity = ".6";

    showToast(
      "Suggestion marked as applied."
    );

  }

});
```
