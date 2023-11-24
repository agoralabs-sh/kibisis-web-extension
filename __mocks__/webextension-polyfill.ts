interface Browser {
  storage: Storage;
}

interface LocalStorage {
  clear: jest.SpyInstance;
  get: jest.SpyInstance;
  remove: jest.SpyInstance;
  set: jest.SpyInstance;
}

interface Storage {
  local: LocalStorage;
}

const browser: Browser = {
  storage: {
    local: {
      clear: jest.fn(),
      get: jest.fn(),
      remove: jest.fn(),
      set: jest.fn(),
    },
  },
};

export default browser;
