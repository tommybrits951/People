const fs = require("fs")
const fsPromises = require("fs/promises")
const sharp = require('sharp')
const path = require("path")

async function createOutput(img) {
    const outputPath = path.join(__dirname, "..", "images", "output.png")
    await fsPromises.writeFile(outputPath, img.data)
    
}


async function extractImage(x, y, width, height) {
    const outputPath = path.join(__dirname, "..", "images", "output.png")
    const img = await sharp(outputPath).extract({left: parseInt(x), top: parseInt(y), width: parseInt(width), height: parseInt(height)}).toBuffer()
    return img;
}

async function saveImage(filePath, imgData) {
        await fsPromises.writeFile(filePath, imgData)
}


module.exports = {
    createOutput,
    extractImage,
    saveImage
}