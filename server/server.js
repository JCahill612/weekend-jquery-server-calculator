// requires
const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
// uses
app.use( express.static( 'server/public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
// globals
const port = 5000;
app.listen( port, ()=>{
    console.log( 'server up on:', port );
});

// global array to hold history of every claculation send to server
let calculatorHistory = [];

function calculate(input){
    // log input to comfirm we are in the function
    console.log('in the calculator:', input);
    
    // switch statement performs math based on operator.
    switch ( input.operator ){
        case '+':
            input.result = Number(input.numberOne) + Number(input.numberTwo);
            break;
        case '-':
            input.result = Number(input.numberOne) - Number(input.numberTwo);
            break;
        case '*':
            input.result = Number(input.numberOne) * Number(input.numberTwo);
            break;
        case '/':
            input.result = Number(input.numberOne) / Number(input.numberTwo);
    }

}

// sends calculationHistory array to client
app.get('/calculate', (req, res) =>{
    console.log('calculate GET hit');
    res.send(calculatorHistory);
})

// recieves object from the DOM, sends to calculator!
app.post('/calculate', (req, res) =>{
    console.log( 'calculate POST hit:', req.body );
    
    // save the new calculation to later display in history
    calculatorHistory.push(req.body);
    
    // use new calculation object to perform math!
    calculate(req.body)
    // sending status OK!
    res.sendStatus(200);
})
