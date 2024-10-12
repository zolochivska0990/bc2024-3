const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .option('-i, --input <path>', 'Path to input JSON file', 'data.json') // default name
  .option('-o, --output <path>', 'Path to output file')
  .option('-d, --display', 'Display result in console')
  .parse(process.argv);

const options = program.opts();

// Check if the input file is specified
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

// Check if the input file exists
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Read the input file
const inputData = fs.readFileSync(options.input, 'utf-8');
let jsonData;

try {
  jsonData = JSON.parse(inputData); // Parse the JSON data
} catch (err) {
  console.error("Error parsing JSON:", err.message);
  process.exit(1);
}

// Ensure jsonData is an array
if (!Array.isArray(jsonData)) {
  console.error("Input data is not an array");
  process.exit(1);
}

// Find the maximum exchange rate
let maxRate = Number.NEGATIVE_INFINITY; // Start with the lowest possible number
jsonData.forEach(entry => {
  // Check if the 'rate' field exists and is a number
  if (typeof entry.rate === 'number' && entry.rate > maxRate) {
    maxRate = entry.rate;
  }
});

// If maxRate was not updated, it means no valid rates were found
if (maxRate === Number.NEGATIVE_INFINITY) {
  console.error("No valid exchange rates found in the input data");
  process.exit(1);
}

// Prepare the output message
const outputMessage = `Максимальний курс: ${maxRate}`;

// Display the result if -d is specified
if (options.display) {
  console.log(outputMessage);
}

// Write to output file if -o is specified
if (options.output) {
  fs.writeFileSync(options.output, outputMessage);
}
