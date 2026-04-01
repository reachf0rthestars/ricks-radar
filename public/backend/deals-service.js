import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";
import { db, storage } from "./firebase-config.js";

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function uploadDealImage(uid, imageFile) {
  if (!imageFile) {
    return "";
  }

  const safeFileName = sanitizeFileName(imageFile.name);
  const imageRef = ref(storage, `dealImages/${uid}/${Date.now()}-${safeFileName}`);

  await uploadBytes(imageRef, imageFile);
  return getDownloadURL(imageRef);
}

export async function createDeal({ user, profile, dealInput, imageFile }) {
  if (!user?.uid) {
    throw new Error("You must be signed in to create a deal.");
  }

  const imageUrl = await uploadDealImage(user.uid, imageFile);

  const payload = {
    title: dealInput.title,
    discountText: dealInput.discountText,
    description: dealInput.description,
    categories: dealInput.categories,
    location: dealInput.location,
    timeInfo: dealInput.timeInfo,
    expirationDate: dealInput.expirationDate,
    imageUrl,
    createdByUid: user.uid,
    createdByUsername: profile?.username || user.displayName || "User",
    createdByDisplayName: profile?.displayName || user.displayName || profile?.username || "User",
    likes: 0,
    dislikes: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const dealDoc = await addDoc(collection(db, "deals"), payload);

  await setDoc(
    doc(db, "users", user.uid),
    {
      dealsPosted: increment(1),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  return dealDoc.id;
}

function getSortableDate(value) {
  if (!value) {
    return 0;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (value?.seconds) {
    return value.seconds * 1000;
  }

  const dateValue = Date.parse(value);
  return Number.isFinite(dateValue) ? dateValue : 0;
}

export async function getDealsByUser(uid) {
  if (!uid) {
    return [];
  }

  const dealsQuery = query(collection(db, "deals"), where("createdByUid", "==", uid));
  const snapshot = await getDocs(dealsQuery);

  const deals = snapshot.docs.map((dealDoc) => ({
    id: dealDoc.id,
    ...dealDoc.data()
  }));

  return deals.sort((a, b) => getSortableDate(b.createdAt) - getSortableDate(a.createdAt));
}
