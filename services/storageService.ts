
import { Embroidery } from '../types';
import { INITIAL_EMBROIDERIES } from '../constants';

const DB_NAME = 'XiangEmbroideryDB_V3'; // 升级版本以强制应用新的初始数据
const STORE_NAME = 'embroideries';
const DB_VERSION = 3;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject('数据库打开失败');
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const storageService = {
  getAll: async (): Promise<Embroidery[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = async () => {
        let results = request.result;
        
        // 只有在数据库为空时加载您指定的 4 张真实作品
        if (results.length === 0) {
          console.log("正在录入您的 4 张真实馆藏资产...");
          for (const item of INITIAL_EMBROIDERIES) {
            await storageService.add(item);
          }
          resolve(INITIAL_EMBROIDERIES);
        } else {
          resolve(results.sort((a, b) => a.displayOrder - b.displayOrder));
        }
      };
      request.onerror = () => reject('获取档案数据失败');
    });
  },

  add: async (item: Embroidery): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('录入失败：ID 重复或存储受限');
    });
  },

  update: async (item: Embroidery): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('更新档案失败');
    });
  },

  delete: async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('移除档案失败');
    });
  },

  reorder: async (items: Embroidery[]): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    for (const item of items) {
      store.put(item);
    }
    return new Promise((resolve) => {
      transaction.oncomplete = () => resolve();
    });
  },

  resetAll: async (): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();
    return new Promise((resolve) => {
      transaction.oncomplete = () => resolve();
    });
  }
};
