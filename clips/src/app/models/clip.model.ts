import firebase from 'firebase/compat/app'

export default interface IClip {
  docID?: string;
  uid: string;
  displayName: string;
  videoTitle: string | null;
  clipFileName: string;
  url: string;
  timestamp: firebase.firestore.FieldValue;
}
