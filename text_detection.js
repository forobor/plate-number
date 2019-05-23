const fs = require('fs');
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */


// const fileName = './crop1.png';

const testImage = async (imagePath) => {
  const [result] = await client.textDetection(imagePath);
  const detections = result.textAnnotations;
  console.log(`File ${imagePath}`);
  console.log('Text:');
  detections.forEach(text => console.log(text.boundingPoly));
};


const testFolder = (folderName) => fs.readdir(folderName, async (err, files) => {
  if (err) return err;
  for (const fileName of files) {
    const [result] = await client.textDetection(`${folderName}/${fileName}`);
    const detections = result.textAnnotations;
    console.log('=====');
    console.log(`File ${fileName}`);
    detections.forEach(text => console.log(text.description));
  }
});



// testFolder('./assets/eu');
testImage('./assets/original.jpg')