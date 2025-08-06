import { MemoryStorage } from './memory-storage';

export async function seedMemoryStorage(storage: MemoryStorage) {
  await storage.initialize();
}