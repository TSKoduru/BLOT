// Todo:
// 1. Allow the file to just take in image.txt as an input

// Imports
// -------

const fs = require("fs");

// Dimensions, DO NOT CHANGE
// -------------------------
const WIDTH = 125;
const HEIGHT = 125;

// Greyscaled image, get from the preprocessor.py file and paste here.
// Might be pretty big, so don't get jumpscared :)
// ----------------------------------------
let INPUT_FILE = "";
let OUTPUT_FILE = "";
let GREYSCALED = [];

// Read in the greyscaled image. The contents are located within the
// variable INPUT_FILE. It's already formatted as a 2D array, so we
// just need to read it in.

/*

  The idea is to draw one sin line for each row of the image (HEIGHT rows)
  depending on the magnitude of the pixel, we edit both the amplitude
  and the frequency of the sin wave at that position.
  Now, keep in mind, we aren't actually just making sin functions, we're going
  to get a bunch of points that are on the sin function and then connect those.

  The sin function is defined as:
  y = A * sin(B(x - C)) + D
  where:
  A = amplitude
  B = frequency
  C = phase shift
  D = vertical shift

*/

// HELPERS
// ------------------

const PIXEL_SIZE = 0.5; // Pixels are 0.5 x 0.5 mm
const NUM_ROWS = Math.floor(HEIGHT / PIXEL_SIZE);
const NUM_COLS = Math.floor(WIDTH / PIXEL_SIZE);
const MAX_AMPLITUDE = 0.95 * PIXEL_SIZE;
const MAX_FREQUENCY = 2.5; // 0.5 Hz

class Line {
  constructor() {
    this.points = [];
  }

  // Add a point to the Line
  addPoint(x, y) {
    this.points.push({ x, y });
  }

  getPoints() {
    return this.points;
  }
}

function output(lines) {
  // We need to output an array of arrays of arrays.

  let output = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let points = line.getPoints();
    let lineArray = [];

    for (let j = 0; j < points.length; j++) {
      let point = points[j];
      lineArray.push([point.x, point.y]);
    }

    output.push(lineArray);
  }

  // Save the output in a text file using JSON.stringify
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output), "utf8");

  // Add a semi-colon at the end of the file
  fs.appendFileSync(OUTPUT_FILE, ";", "utf8");

  // Print out how many unique lines we have
  console.log("Image outputted!");
  console.log(`You can now paste it into the template script.`);
}

function readIn() {
  GREYSCALED = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
}

// MAIN
// ------------------

function blot() {
  // Iterate through the image. Find the pixel closest to that location
  // by using Math.min. If the pixel is white, we don't draw anything.
  // Otherwise, we begin a sin line at that location, and modify the
  // amplitude and frequency based on the pixel's magnitude.

  let lines = []; // Each sin line is a Line object

  for (let i = 0; i < NUM_ROWS; i++) {
    let current_line = new Line();
    for (let j = 0; j < NUM_COLS; j++) {
      let x = Math.floor(j * PIXEL_SIZE);
      let y = Math.floor(i * PIXEL_SIZE);
      let pixel = GREYSCALED[x][y];

      // Store and reset the current line if we hit white.
      // We don't want to store empty lines, though.

      if (pixel > 250) {
        if (current_line.getPoints().length > 0) {
          lines.push(current_line);
          current_line = new Line();
        }
        continue;
      } else {
        // Otherwise just append a new point to the current line
        // based on the pixel's magnitude.

        let amplitude = (MAX_AMPLITUDE / 255) * pixel;
        let frequency = (MAX_FREQUENCY / 255) * pixel;

        let y = amplitude * Math.sin(frequency * j) + i * PIXEL_SIZE;
        current_line.addPoint(x, y);
      }
    }
  }

  return lines;
}

// Get command line arguments
// --------------------------

if (process.argv.length !== 4) {
  console.error("Usage: node blot.js <inputFile> <outputFile>");
  process.exit(1);
}

// Read in the input and output files
// ----------------------------------

INPUT_FILE = process.argv[2];
OUTPUT_FILE = process.argv[3];

readIn();
let lines = blot();
output(lines);
