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

// global array
let calculatorHistory = [];

function calculate(input){
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

app.get('/calculate', (req, res) =>{
    console.log('calculate GET hit');
    res.send(calculatorHistory);
})

app.post('/calculate', (req, res) =>{
    console.log( 'calculate POST hit:', req.body );
    calculatorHistory.push(req.body);
    calculate(req.body)
    res.sendStatus(200);
})
