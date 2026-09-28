```javascript
document.addEventListener("DOMContentLoaded", () => {

  const resumeInput = document.getElementById("resumeInput");
  const dropZone = document.getElementById("dropZone");
  const filePreview = document.getElementById("filePreview");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const results = document.getElementById("results");
  const toast = document.getElementById("toast");

  let selectedFile = null;


  // =========================
  // OPEN FILE PICKER
  // =========================

  dropZone.addEventListener("click", () => {
    resumeInput.click();
  });


  // =========================
  // FILE SELECTED
  // =========================

  resumeInput.addEventListener("change", (event) => {

    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    handleFile(files[0]);

  });


  // =========================
  // DRAG OVER
  // =========================

  dropZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    dropZone.classList.add("dragging");

  });


  // =========================
  // DRAG LEAVE
  // =========================

  dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("dragging");

  });


  // =========================
  // DROP FILE
  // =========================

  dropZone.addEventListener("drop", (event) => {

    event.preventDefault();

    dropZone.classList.remove("dragging");

    const files = event.dataTransfer.files;

    if (!files || files.length === 0) {
      return;
    }

    handleFile(files[0]);

  });


  // =========================
  // HANDLE FILE
  // =========================

  function handleFile(file) {

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

      showToast(
        "Please upload PDF, DOC, DOCX or TXT."
      );

      return;
    }


    // Maximum 10 MB

    if (file.size > 10 * 1024 * 1024) {

      showToast(
        "File is too large. Maximum size is 10MB."
      );

      return;
    }


    selectedFile = file;


    // Show file name

    fileName.textContent = file.name;


    // Show file size

    fileSize.textContent = formatFileSize(
      file.size
    );


    // Show preview

    filePreview.style.display = "flex";


    // Show analyze button

    analyzeBtn.style.display = "inline-flex";

    analyzeBtn.style.alignItems = "center";

    analyzeBtn.style.gap = "10px";


    showToast(
      "Resume uploaded successfully ✓"
    );

  }


  // =========================
  // FORMAT FILE SIZE
  // =========================

  function formatFileSize(bytes) {

    if (bytes < 1024) {
      return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(1) + " MB";

  }


  // =========================
  // REMOVE FILE
  // =========================

  window.removeFile = function(event) {

    if (event) {
      event.stopPropagation();
    }

    selectedFile = null;

    resumeInput.value = "";

    filePreview.style.display = "none";

    analyzeBtn.style.display = "none";

  };


  // =========================
  // ANALYZE
  // =========================

  window.analyzeResume = function() {

    if (!selectedFile) {

      showToast(
        "Please upload your resume first."
      );

      return;
    }


    analyzeBtn.disabled = true;

    analyzeBtn.innerHTML =
      'Analyzing <span>✦</span>';


    setTimeout(() => {

      results.classList.add("visible");

      analyzeBtn.disabled = false;

      analyzeBtn.innerHTML =
        'Analysis Complete ✓';


      results.scrollIntoView({
        behavior: "smooth"
      });

    }, 1800);

  };


  // =========================
  // SCROLL TO UPLOAD
  // =========================

  window.scrollToUpload = function() {

    document
      .getElementById("upload")
      .scrollIntoView({
        behavior: "smooth"
      });

  };


  // =========================
  // TOAST
  // =========================

  function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

      toast.classList.remove("show");

    }, 2500);

  }

});
```
