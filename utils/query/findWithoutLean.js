const findWithoutLean = async(modelName, select, condition) =>{
  // console.log(modelName, select, condition)
  try {
    return await modelName.findOne(condition).select(select).exec();
  } catch (error) {
    return false;
  }
}
module.exports = findWithoutLean;