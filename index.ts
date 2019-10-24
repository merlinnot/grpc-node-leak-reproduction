import { clearFirestoreData } from './firestore';

const run = async (): Promise<void> => {
  while (true) {
    global.gc();

    // console.log(process.memoryUsage().heapUsed);

    await clearFirestoreData();
  }
};

run().catch((error: Error): void => {
  console.error(error);
});
