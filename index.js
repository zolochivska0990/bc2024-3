const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .option('-i, --input <path>', 'Path to input JSON file') // без значення за замовчуванням
  .option('-o, --output <path>', 'Path to output file')
  .option('-d, --display', 'Display result in console')
  .parse(process.argv);

const options = program.opts();


if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}


if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}


const inputData = fs.readFileSync(options.input, 'utf-8');
let jsonData;

try {
  jsonData = JSON.parse(inputData); 
} catch (err) {
  console.error("Error parsing JSON:", err.message);
  process.exit(1);
}

if (!Array.isArray(jsonData)) {
  console.error("Input data is not an array");
  process.exit(1);
}


let maxRate = Number.NEGATIVE_INFINITY; 
jsonData.forEach(entry => {

  if (typeof entry.rate === 'number' && entry.rate > maxRate) {
    maxRate = entry.rate;
  }
});


if (maxRate === Number.NEGATIVE_INFINITY) {
  console.error("No valid exchange rates found in the input data");
  process.exit(1);
}


const outputMessage = `Максимальний курс: ${maxRate}`;


if (options.display) {
  console.log(outputMessage);
}

if (options.output) {
  fs.writeFileSync(options.output, outputMessage);
}
