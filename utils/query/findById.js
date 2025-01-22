const findById = async(modelName, id, select) =>{
    try {
      return await modelName.findById(id).select(select).exec();
    } catch (error) {
      return false;
    }
  }
  module.exports = findById;