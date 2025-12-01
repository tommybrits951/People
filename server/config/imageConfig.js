const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const fsPromises = require("fs/promises");


async function createOutput(img) {
    const outputDir = path.join(__dirname, '..', "images", "output.png");
    await fsPromises.appendFile(outputDir, img.data);
}

async function extractImage(x, y, width, height) {
    const outputDir = path.join(__dirname, '..', "images", "output.png");
    const image = await sharp(outputDir).extract({ left: parseInt(x), top: parseInt(y), width: parseInt(width), height: parseInt(height) }).toBuffer();
    return image;   
}
async function saveImage(imgBuffer, filename) {
    await fsPromises.appendFile(path.join(__dirname, "..", "images", "profile", filename), imgBuffer);
}

module.exports = {
    createOutput,
    extractImage, 
    saveImage
};