import { BadRequestException, Injectable } from "@nestjs/common";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from './firebase.config';
import firebase from "firebase/compat";
import Storage = firebase.storage.Storage;

const metadata = { contentType: 'image/png' };

@Injectable()
export class FirebaseService {
  private storage;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    this.storage = getStorage(app);
  }

  async uploadImageToCloud(files: Express.Multer.File[], url: string): Promise<string> {
     let downloadURL: string = ''
    for (const file of files) {
      if (!file || !file.buffer) {
        throw new Error('No file uploaded');
      }

      const storageRef = ref(this.storage, `${url}/${file.originalname}`);
      const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);

      try {
        await uploadTask;
        downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);
      } catch (err) {
        throw new BadRequestException(`Error uploading file ${file.originalname}: ${err.message}`)
        console.error(`Error uploading file ${file.originalname}: ${err.message}`);
      }
    }
    return downloadURL;
  }
}