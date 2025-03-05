import mongoose from "mongoose";
class ModelInstance {
  constructor() {
    this.models = {};
  }

    static getModel(modelName) {
        if (mongoose.models[modelName]) {
            return mongoose.models[modelName]; 
        }

        const dynamicSchema = new mongoose.Schema({}, { strict: false });


        this.models[modelName] = mongoose.model(modelName, dynamicSchema);
        return this.models[modelName];
    }
  
}
export default ModelInstance