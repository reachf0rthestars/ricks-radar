import { DEFAULT_AVATAR } from "./auth-profile.js";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderCategories(categories = []) {
  const normalized = Array.isArray(categories) ? categories.filter(Boolean) : [];
  if (normalized.length === 0) {
    return "<span>Local deal</span>";
  }

  return normalized
    .map((category) => `<span class="deal-chip ${escapeHtml(category)}">${escapeHtml(category)}</span>`)
    .join("");
}

export function createDealCardElement(
  deal,
  {
    showDelete = false,
    onOpenProfile = null,
    onDelete = null
  } = {}
) {
  const card = document.createElement("article");
  card.classList.add("deal-card");
  card.dataset.dealId = deal.id;

  (deal.categories || []).forEach((category) => {
    if (category) {
      card.classList.add(category);
    }
  });

  const submitterName = deal.createdByDisplayName || deal.createdByUsername || "User";
  const submitterImage = deal.createdByProfileImage || DEFAULT_AVATAR;
  const hasImage = Boolean(deal.imageUrl);
  const showDeleteAction = Boolean(showDelete && typeof onDelete === "function");
  const submitterUid = deal.createdByUid || "";

  card.innerHTML = `
    <div class="deal-top-row">
      <div class="deal-tag">${renderCategories(deal.categories)}</div>
      <div class="deal-top-actions">
        <button type="button" class="deal-submitter" aria-label="View ${escapeHtml(submitterName)} profile">
          <img src="${escapeHtml(submitterImage)}" alt="${escapeHtml(submitterName)} avatar">
          <span>${escapeHtml(submitterName)}</span>
        </button>
        ${showDeleteAction ? '<button type="button" class="deal-delete-btn">Delete</button>' : ""}
      </div>
    </div>
    <div class="deal-main">
      <div class="deal-picture ${hasImage ? "deal-picture--image" : ""}">
        ${
          hasImage
            ? `<img src="${escapeHtml(deal.imageUrl)}" alt="${escapeHtml(deal.title || "Deal image")}">`
            : "No Image"
        }
      </div>
      <div class="deal-info">
        <h2 class="deal-title">${escapeHtml(deal.title || "Untitled Deal")}</h2>
        <p class="deal-discount">${escapeHtml(deal.discountText || "")}</p>
        <div class="deal-meta">
          <button type="button" class="badge badge--likes">Like</button>
          <button type="button" class="badge badge--dislikes">Dislike</button>
        </div>
      </div>
    </div>
    <div class="deal-details">
      <div><span class="label">Description:</span> ${escapeHtml(deal.description || "No description provided.")}</div>
      <div><span class="label">Location:</span> ${escapeHtml(deal.location || "Not specified")}</div>
      <div><span class="label">Time/Date:</span> ${escapeHtml(deal.timeText || "Not specified")}</div>
      <div><span class="label">Expires:</span> ${escapeHtml(deal.expirationDate || "Not specified")}</div>
    </div>
  `;

  const submitterButton = card.querySelector(".deal-submitter");
  if (submitterButton && typeof onOpenProfile === "function") {
    submitterButton.addEventListener("click", () => {
      onOpenProfile(submitterUid);
    });
  }

  if (showDeleteAction) {
    const deleteButton = card.querySelector(".deal-delete-btn");
    if (deleteButton) {
      deleteButton.addEventListener("click", async () => {
        await onDelete(deal);
      });
    }
  }

  card.querySelectorAll(".badge").forEach((badge) => {
    badge.addEventListener("click", () => {
      badge.classList.toggle("active");
    });
  });

  return card;
}
