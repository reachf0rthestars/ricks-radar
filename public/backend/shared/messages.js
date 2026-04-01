export function setStatusMessage(messageEl, text = "", type = "error") {
  if (!messageEl) {
    return;
  }

  if (!text) {
    messageEl.textContent = "";
    messageEl.style.color = "";
    return;
  }

  messageEl.textContent = text;
  if (type === "success") {
    messageEl.style.color = "#137333";
    return;
  }

  if (type === "info") {
    messageEl.style.color = "#1a73e8";
    return;
  }

  messageEl.style.color = "#b3261e";
}
