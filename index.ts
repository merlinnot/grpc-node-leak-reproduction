import { clearFirestoreData } from './firestore';

const run = async (): Promise<void> => {
  while (true) {
    await clearFirestoreData();
  }
};

run().catch((error: Error): void => {
  console.error(error);
});
