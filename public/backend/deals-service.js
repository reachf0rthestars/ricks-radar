import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";
import { db, storage } from "./firebase-config.js";
import { DEFAULT_AVATAR, getDisplayName, getProfileImage } from "./shared/auth-profile.js";

const DEALS_COLLECTION = "deals";
const USERS_COLLECTION = "users";

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function toTimestampMs(value) {
  if (!value) {
    return 0;
  }

  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeCategories(categories = []) {
  if (!Array.isArray(categories)) {
    return [];
  }

  return categories
    .map((category) => String(category || "").trim().toLowerCase())
    .filter(Boolean);
}

function normalizeDeal(id, data = {}) {
  return {
    id,
    title: data.title || "",
    discountText: data.discountText || "",
    description: data.description || "",
    categories: normalizeCategories(data.categories),
    location: data.location || "",
    timeText: data.timeText || "",
    expirationDate: data.expirationDate || "",
    imageUrl: data.imageUrl || "",
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    createdByUid: data.createdByUid || "",
    createdByUsername: data.createdByUsername || "",
    createdByDisplayName: data.createdByDisplayName || "User",
    createdByProfileImage: data.createdByProfileImage || DEFAULT_AVATAR
  };
}

async function uploadDealImageIfNeeded(user, imageFile) {
  if (!imageFile) {
    return "";
  }

  const safeFileName = sanitizeFileName(imageFile.name);
  const imageRef = ref(storage, `dealImages/${user.uid}/${Date.now()}-${safeFileName}`);
  await uploadBytes(imageRef, imageFile);
  return getDownloadURL(imageRef);
}

function buildDealPayload(user, profile, dealInput = {}, imageUrl = "") {
  const categories = normalizeCategories(dealInput.categories);

  return {
    title: String(dealInput.title || "").trim(),
    discountText: String(dealInput.discountText || "").trim(),
    description: String(dealInput.description || "").trim(),
    categories,
    location: String(dealInput.location || "").trim(),
    timeText: String(dealInput.timeText || "").trim(),
    expirationDate: String(dealInput.expirationDate || "").trim(),
    imageUrl: String(imageUrl || "").trim(),
    createdByUid: user.uid,
    createdByUsername: profile?.username || "",
    createdByDisplayName: getDisplayName(user, profile),
    createdByProfileImage: getProfileImage(user, profile, DEFAULT_AVATAR),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

export async function createDeal({ user, profile = null, dealInput = {}, imageFile = null }) {
  if (!user?.uid) {
    throw new Error("You must be signed in to create a deal.");
  }

  const imageUrl = await uploadDealImageIfNeeded(user, imageFile);
  const dealPayload = buildDealPayload(user, profile, dealInput, imageUrl);
  const dealDocRef = doc(collection(db, DEALS_COLLECTION));
  const userDocRef = doc(db, USERS_COLLECTION, user.uid);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userDocRef);
    if (!userSnap.exists()) {
      throw new Error("Create your profile before posting deals.");
    }

    const userData = userSnap.data() || {};
    const nextDealCount = Math.max(0, Number(userData.dealsPosted || 0)) + 1;

    transaction.set(dealDocRef, dealPayload);
    transaction.update(userDocRef, {
      dealsPosted: nextDealCount,
      updatedAt: serverTimestamp()
    });
  });

  return normalizeDeal(dealDocRef.id, dealPayload);
}

export async function listDeals() {
  const snapshot = await getDocs(collection(db, DEALS_COLLECTION));
  const deals = snapshot.docs.map((docSnap) => normalizeDeal(docSnap.id, docSnap.data()));
  deals.sort((a, b) => toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt));
  return deals;
}

export async function listDealsByUser(uid) {
  if (!uid) {
    return [];
  }

  const dealsQuery = query(collection(db, DEALS_COLLECTION), where("createdByUid", "==", uid));
  const snapshot = await getDocs(dealsQuery);
  const deals = snapshot.docs.map((docSnap) => normalizeDeal(docSnap.id, docSnap.data()));
  deals.sort((a, b) => toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt));
  return deals;
}

export async function getPublicProfileByUid(uid) {
  if (!uid) {
    return null;
  }

  const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!userDoc.exists()) {
    return null;
  }

  const data = userDoc.data() || {};
  return {
    uid,
    username: data.username || "",
    displayName: data.displayName || data.username || "User",
    bio: data.bio || "",
    profileImage: data.profileImage || DEFAULT_AVATAR,
    dealsPosted: Number(data.dealsPosted || 0),
    likes: Number(data.likes || 0),
    followers: Number(data.followers || 0),
    savedDeals: Number(data.savedDeals || 0)
  };
}

export async function deleteDeal(dealId, requesterUid) {
  if (!dealId) {
    throw new Error("Missing deal id.");
  }

  if (!requesterUid) {
    throw new Error("You must be signed in to delete a deal.");
  }

  const dealDocRef = doc(db, DEALS_COLLECTION, dealId);

  await runTransaction(db, async (transaction) => {
    const dealSnap = await transaction.get(dealDocRef);
    if (!dealSnap.exists()) {
      throw new Error("Deal not found.");
    }

    const dealData = dealSnap.data() || {};
    if (dealData.createdByUid !== requesterUid) {
      throw new Error("You can only delete deals you created.");
    }

    const ownerDocRef = doc(db, USERS_COLLECTION, requesterUid);
    const ownerSnap = await transaction.get(ownerDocRef);

    if (ownerSnap.exists()) {
      const ownerData = ownerSnap.data() || {};
      const nextDealCount = Math.max(0, Number(ownerData.dealsPosted || 0) - 1);
      transaction.update(ownerDocRef, {
        dealsPosted: nextDealCount,
        updatedAt: serverTimestamp()
      });
    }

    transaction.delete(dealDocRef);
  });
}
