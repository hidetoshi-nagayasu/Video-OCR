const { PerformanceObserver, performance } = require('perf_hooks');

// Moment js
const moment = require('moment');
require("moment-duration-format");

// Command Line
const readline = require('readline');

// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');
const { setFlagsFromString } = require('v8');
const { exit } = require('process');

const commandMessage = 'Which file do you want to process? (ex: /Users/xxx/Downloads/sample.mp4)';

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage();
// Makes an authenticated API request.
const listBuckets = async () => {
  try {
    const results = await storage.getBuckets();
    const [buckets] = results;

    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}


const main = async () => {

  // File path obtained from command line
  const path = await prompt(commandMessage);

  // Benchmark
  const benchStart = performance.now();

  await listBuckets();

  // Imports the Google Cloud Video Intelligence library + Node's fs library
  const Video = require('@google-cloud/video-intelligence');
  const fs = require('fs');
  const util = require('util');
  // Creates a client
  const video = new Video.VideoIntelligenceServiceClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const path = '/Users/hide/Downloads/enojam_sample.mp4';

  // Reads a local video file and converts it to base64
  const file = await util.promisify(fs.readFile)(path);
  const inputContent = file.toString('base64');

  const request = {
    inputContent: inputContent,
    features: ['TEXT_DETECTION'],
  };
  // Detects text in a 4 BT[:]
  const [operation] = await video.annotateVideo(request);
  console.log('Waiting for operation to complete...');
  const results = await operation.promise();

  var records = [];
  var i = 1;

  // Gets annotations for video
  const textAnnotations = results[0].annotationResults[0].textAnnotations;

  textAnnotations.some(textAnnotation => {
    var record = {}

    textAnnotation.segments.some(segment => {

      if(segment.frames) {
        var frame = segment.frames[0];
        var vertices = frame.rotatedBoundingBox.vertices;

        // 座標絞り
        if(
          (vertices[0].x >= 0 && vertices[0].y >= 0.7) &&
          (vertices[1].x <= 1 && vertices[1].y >= 0.7) &&
          (vertices[2].x <= 1 && vertices[2].y <= 0.97) &&
          (vertices[3].x >= 0 && vertices[3].y <= 0.97)
          ) {
            record.is_ok = true;
            record.no = i;
            record.text = textAnnotation.text;

            const time = segment.segment;
            if (time.startTimeOffset.seconds === undefined) {
              time.startTimeOffset.seconds = 0;
            }
            if (time.startTimeOffset.nanos === undefined) {
              time.startTimeOffset.nanos = 0;
            }
            if (time.endTimeOffset.seconds === undefined) {
              time.endTimeOffset.seconds = 0;
            }
            if (time.endTimeOffset.nanos === undefined) {
              time.endTimeOffset.nanos = 0;
            }

            let startTime = parseFloat(`${time.startTimeOffset.seconds || 0}` + `.${(time.startTimeOffset.nanos / 1e6).toFixed(3)}`) * 1000;
            let endTime = parseFloat(`${time.endTimeOffset.seconds || 0}.` + `${(time.endTimeOffset.nanos / 1e6).toFixed(3)}`) * 1000;

            record.start = moment.duration(startTime, 'ms').format('H:mm:ss.SSS', { trim: false });
            record.end = moment.duration(endTime, 'ms').format('H:mm:ss.SSS', { trim: false });
            record.confidence = `${(segment.confidence * 100)}%`;

            var j = 1;
            frame.rotatedBoundingBox.vertices.forEach(vertex => {
              record[`vertex_${j}`] = `(${vertex.x}, ${vertex.y})`;
              j++;
            });

            i++;
            records.push(record);
        }
      }
    });
  });

  records = [...new Set(records)];

  records.sort(function(a,b){
    if(a.start < b.start) return -1;
    if(a.start > b.start) return 1;
    return 0;
  });

  let output = '';

  for (const key in records) {
    const obj = records[key];
    const startTime = obj['start'];
    const endTime = obj['end'];
    const text = obj['text'];

    const outputText = `${startTime},${endTime}\n${text}\n\n`;

    output += outputText;
  }

  // Output
  fs.writeFile("output.txt", output, (err) => {
    if (err) throw err;
    console.log('Done!');
    console.log(`Execution time: ${Math.round((performance.now() - benchStart) / 1000)} sec`);
  });

};


const prompt = async (msg) => {
  console.log(msg);
  const answer = await question('> ');
  if(!answer) {
    exit();
  }
  return answer.trim();
};


const question = (question) => {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    readlineInterface.question(question, (answer) => {
      resolve(answer);
      readlineInterface.close();
    });
  });
};


(async () => {
  await main();
})();
