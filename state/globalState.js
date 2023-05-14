class GlobalState {
    constructor() {
      if (!GlobalState.instance) {
        this._data = {}; // Aquí se almacenará tu estado global
        GlobalState.instance = this;
      }
  
      return GlobalState.instance;
    }
  
    set(key, val) {
      this._data[key] = val;
    }
  
    get(key) {
      return this._data[key];
    }
  
    update(key, newVal) {
      if (this._data[key]) {
        this._data[key] = { ...this._data[key], ...newVal };
      } else {
        this._data[key] = newVal;
      }
    }
  }
  
  const instance = new GlobalState();
  Object.freeze(instance);
  
  module.exports = instance;