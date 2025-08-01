
function calculateDuration() {
  const start = localStorage.getItem("sessionStart");
  const end = Date.now();
  if (!start) return 0;
  return Math.round((end - parseInt(start, 10)) / 60000);
}

function sendReportToRovas(durationMinutes) {
  const apiKey = localStorage.getItem("rovasApiKey");
  const token = localStorage.getItem("rovasToken");
  const changesetId = localStorage.getItem("changesetId") || "unknown";
  const comment = localStorage.getItem("changesetComment") || "No comment";

  if (!apiKey || !token) {
    console.error("Missing ROVAS API credentials.");
    return;
  }

  const payload = {
    duration: durationMinutes,
    changeset_id: changesetId,
    comment: comment
  };

  fetch("https://dev.rovas.app/api/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-API-KEY": apiKey
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    console.log("✅ Report submitted:", data);
    chrome.storage.local.remove("manualDuration");
  })
  .catch(error => {
    console.error("❌ Error submitting report:", error);
  });
}

function handleSubmitReport() {
  chrome.storage.local.get(["manualDuration"], (result) => {
    const manual = result.manualDuration;
    const duration = manual && !isNaN(manual) ? Math.round(manual * 60) : calculateDuration();
    sendReportToRovas(duration);
  });
}

// Optional: example trigger (e.g., message from popup)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "submit_report") {
    handleSubmitReport();
    sendResponse({ status: "started" });
  }
});
