const fs = require('fs');

class GlobalState {
  constructor() {
    if (!GlobalState.instance) {
      this._data = this.loadState(); // Carga el estado al iniciar la aplicación
      GlobalState.instance = this;
    }

    return GlobalState.instance;
  }

  set(key, val) {
    this._data[key] = val;
    this.saveState(); // Guarda el estado cada vez que se modifica
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
    this.saveState(); // Guarda el estado cada vez que se modifica
  }

  // Guarda el estado en un archivo JSON
  saveState() {
    fs.writeFileSync('state.json', JSON.stringify(this._data));
  }

  // Carga el estado desde un archivo JSON
  loadState() {
    if (fs.existsSync('state.json')) {
      const stateData = fs.readFileSync('state.json');
      return JSON.parse(stateData);
    } else {
      return {}; // Retorna un estado vacío si el archivo no existe
    }
  }
}

const instance = new GlobalState();
Object.freeze(instance);

module.exports = instance;
