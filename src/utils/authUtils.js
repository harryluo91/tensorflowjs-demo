import { storageManager, STORAGE_TYPES } from './storageUtils';

const isAuthed = () => {
  const loggedInUserId = storageManager.createOrFetchStorage('userId', STORAGE_TYPES.session);
  return loggedInUserId.get() ? true : false;
}

export {
  isAuthed
}