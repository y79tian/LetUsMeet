import cuid from "cuid";
import firebase from "../config/firebase";

const db = firebase.firestore();

// solve the problem for returned data formatting
export function dataFromSnapshot(snapshot) {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();

  for (const prop in data) {
    // prop: description, venue, city, etc.
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof firebase.firestore.Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }
  return { ...data, id: snapshot.id }; // add doc id
}

export function listenToEventsFromFirestore() {
  return db.collection("events").orderBy("date");
}

export function listenToEventFromFirestore(eventId) {
  return db.collection("events").doc(eventId);
}

export function addEventToFirestore(event) {
  return db.collection("events").add({
    ...event,
    hostedBy: "Diana",
    hostPhotoURL: "https://randomuser.me/api/portraits/women/20.jpg",
    attendees: firebase.firestore.FieldValue.arrayUnion({
      id: cuid(),
      displayName: "Diana",
      photoURL: "https://randomuser.me/api/portraits/women/20.jpg",
    }),
  });
}

export function updateEventInFirestore(event) {
  return db.collection("events").doc(event.id).update(event);
}
export function deleteEventInFirestore(eventId) {
  return db.collection("events").doc(eventId).delete();
}

export function cancelEventToggle(event) {
  return db.collection("events").doc(event.id).update({
    isCancelled: !event.isCancelled,
  });
}

export function setUserProfile(user) {
  // previously we user add function to add new data, but
  // here we use set (ref the doc itself even though we need to create it at the same time)
  // cuz we use user.uid as the doc id
  return db
    .collection("user")
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

export function getUserProfile(userId) {
  return db.collection("user").doc(userId);
}

export async function updateUserProfile(profile) {
  const user = firebase.auth().currentUser;
  try {
    if (user.displayName !== profile.displayName) {
      await user.updateProfile({ displayName: profile.displayName });
    }
    return await db.collection("user").doc(user.uid).update(profile);
  } catch (error) {
    throw error;
  }
}
