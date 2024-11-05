const express = require('express')

const error_400 = async(error){
    return res.status(400).json({
        success:false,
        response:error
    })
}

module.exports = error_400;