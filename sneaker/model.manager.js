let Model = require('./model');

class ModelManager {

  constructor() {
    let _models = {};

    Object.defineProperty(this, 'models', {
      enumerable: true,
      get() {
        return _models;
      }
    });

  }

  getInstanceOf(modelName) {
    if(this.models[modelName]) {
      return new Model(this.models[modelName]);
    }
    else {
      return null;
    }
  }

  create() {
    //create a new JSON file in the dir
    //store it in the models object
  }

  delete() {
    //delete the JSON file in the dir
    //remove the model from the models object
  }

  update(name, updateJSON) {
    //update the key with the updateJSON, using object.assign
    //write the new JSON to the file in the models dir
  }

  loadModel(json) {
    //load the model into the models object
    this.models[json.name] = json;
  }

}

let manager = new ModelManager();
module.exports = manager;
