
function getManualDurationDecimal() {
  const hours = parseInt(document.getElementById("manualHours").value, 10) || 0;
  const minutes = parseInt(document.getElementById("manualMinutes").value, 10) || 0;
  return hours + (minutes / 60);
}

// Example of integrating labels into localization init
function applyTranslations(locale) {
  document.getElementById("manualHoursLabel").textContent = locale.manual_hours_label;
  document.getElementById("manualMinutesLabel").textContent = locale.manual_minutes_label;
}
