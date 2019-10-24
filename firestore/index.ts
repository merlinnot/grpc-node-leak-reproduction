import {
  Client,
  credentials,
  GrpcObject,
  loadPackageDefinition,
} from '@grpc/grpc-js';
import { load } from '@grpc/proto-loader';
import { resolve } from 'path';
import { path } from 'ramda';

import {
  FIRESTORE_PORT,
  FIRESTORE_SERVICE_HOSTNAME,
  PROJECT_ID,
} from '../configuration';

const PROTO_ROOT = resolve(__dirname, 'protocols');
const PROTO_FILE = 'google/firestore/emulator/v1/firestore_emulator.proto';

export const makeEmulatorClient = async (): Promise<Client & any> => {
  const packageDefinition = await load(PROTO_FILE, {
    includeDirs: [PROTO_ROOT],
  });

  const protoDescriptor = loadPackageDefinition(packageDefinition);
  const service = path(
    ['google', 'firestore', 'emulator', 'v1'],
    protoDescriptor,
  ) as GrpcObject;
  const FirestoreEmulator = service.FirestoreEmulator as typeof Client;

  const address = `${FIRESTORE_SERVICE_HOSTNAME}:${FIRESTORE_PORT}`;
  const sslCredentials = credentials.createInsecure();

  return new FirestoreEmulator(address, sslCredentials);
};

export const clearFirestoreData = async (): Promise<void> => {
  const client = await makeEmulatorClient();
  const database = `projects/${PROJECT_ID}/databases/(default)`;

  /*
   * Do not convert this implementation to use `promisify` as it seemingly
   * breaks the functionality.
   */
  await new Promise((resolvePromise): void => {
    client.clearData({ database }, resolvePromise);
  });

  await client.close();
};
