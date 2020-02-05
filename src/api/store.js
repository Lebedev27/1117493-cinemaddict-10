export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey));
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getAll();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        )
    );
  }

  setComments(id, comments, movieFlag) {
    const store = this.getAll();
    if (movieFlag) {
      store[id].comments = comments.map((comment) => comment.id);
    } else {
      store[id] = comments;
    }
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }

  removeComment(dataId, key, movieFlag) {
    const store = this.getAll();

    if (movieFlag) {
      store[dataId].comments.filter((comment) => comment !== key);
    } else {
      store[dataId].filter((comment) => comment !== key);
    }

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }

  removeItem(id) {
    const store = this.getAll();

    delete store[id];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }
}
