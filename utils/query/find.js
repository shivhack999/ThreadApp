const find = async(modelName, select, condition) =>{
  try {
    return await modelName.find(condition).select(select).lean();
  } catch (error) {
    return false;
  }
}
module.exports = find;