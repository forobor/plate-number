const fs = require('fs');
const vision = require('@google-cloud/vision');
const sharp = require('sharp');

const client = new vision.ImageAnnotatorClient();

const testImage = async imagePath => {
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;

    const width = Math.abs(
        detections[0].boundingPoly.vertices[0].x -
            detections[0].boundingPoly.vertices[1].x
    );
    const height = Math.abs(
        detections[0].boundingPoly.vertices[0].y -
            detections[0].boundingPoly.vertices[2].y
    );

    console.log(width, height);
    sharp(imagePath)
        .extract({
            width: width,
            height: height,
            left: detections[0].boundingPoly.vertices[0].x,
            top: detections[0].boundingPoly.vertices[0].y
        })
        .toFile('croppedImage.jpg')
        .then(function(new_file_info) {
            console.log('Image cropped and saved');
        })
        .catch(function(err) {
            console.log('An error occured');
        });

    console.log(`File ${imagePath}`);
    console.log('Text:');
    detections.forEach(text => console.log(text.boundingPoly));
};

const testFolder = folderName =>
    fs.readdir(folderName, async (err, files) => {
        if (err) return err;
        for (const fileName of files) {
            const [result] = await client.textDetection(
                `${folderName}/${fileName}`
            );
            const detections = result.textAnnotations;
            console.log('=====');
            console.log(`File ${fileName}`);
            detections.forEach(text => console.log(text.description));
        }
    });

// testFolder('./assets/eu');
testImage('./assets/original.jpg');
