const yargs = require('yargs');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const {SimAnneal, SimAnnealSolution} = require('./modules/algo/SimAnneal');
const {RPointFactory} = require('./modules/RPointFactory');
const moment = require('moment');

//let [input, output, maxT, minT] = process.argv.slice(2);

const argv = yargs
    .option('input', {
        alias: 'i',
        describe: 'Specifies input file path.',
        type: 'string',
        requiresArg: true
    })
    .option('output', {
        alias: 'o',
        describe: 'Specifies output file path.',
        type: 'string',
        default: 'output.csv'
    })
    .option('maxTemperature', {
        alias: 'max',
        describe: 'Max temperature to start with',
        type: 'number',
        default: 10
    })
    .option('minTemperature', {
        alias: 'min',
        describe: 'Min temperature to finish the search',
        type: 'number',
        default: 0.00003
    })
    .help('help')
    .alias('h', 'help')
    .argv;
const start = moment();
const pointData = fs.readFileSync(argv.input, 'utf8');
const points = buildPreset(pointData);
const minCost = SimAnnealSolution.calculateCost(points);
const simAnneal = new SimAnneal(points, argv.maxTemperature, argv.minTemperature);

console.log(`Straight route cost: ${minCost}`);

do {
    simAnneal.next();
} while(!simAnneal.isDone);
const solution = simAnneal.getLastSolution();
console.log(`Optimal route cost: ${solution.cost}. Search took ${moment().diff(start)}ms and ${simAnneal._step} steps;`);

fs.writeFileAsync(argv.output, solution.export(), 'utf8').then(() => {
    process.exit(0);
}).catch((err) => {
    console.warn(err);
    process.exit(1);
});


function buildPreset(data){
    return data.split('\n').map((str) =>
        RPointFactory.getPoint(...str
            .split(',')
            .map((v) => parseInt(v))
        )
    );
}
