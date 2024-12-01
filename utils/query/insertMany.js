const insertMany = async(modelName, data) =>{
  try {
    const responseData = await modelName.insertMany(data, { validateBeforeSave: true });
    return responseData;
  } catch (error) {
    console.log(error)
    return false;
  }
}
module.exports = insertMany;