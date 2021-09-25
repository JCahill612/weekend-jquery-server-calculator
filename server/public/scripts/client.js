$(onReady);

function onReady (){
    console.log('JQ');
    // on click of equal button, send the object (equation) to the server to calculate
    $('#equals').on('click', calculate);
    // on click of 'C' reset the object, clear the DOM area that display current calculation.
    $('#clear').on('click', clearInputs);
    // on click of calculator operator, assign that operator to the object (equation)
    $('.operator').on('click', getOperator);
    // on click of a number, catch the number and assign it to the object (equation)
    $('.button').on('click', getNumbers);
    // allows the page to not clear information on refresh,
    getAnswer();
}

// ! GLOBAL VARIABLES !
let num1= '';
let num2= '';
let operator = '';

function getNumbers(){
    // jQuery finds the click and assigns it to variable
    let numberClicked = $(this).text();
    
    // checks if there is a click, stops check when an operator is clicked
    if ( numberClicked && operator === '' ) {
        num1 = num1 + numberClicked;
        $('.answer').empty()
    } 
    // if num1 has a value and operator has a value, start building num2
    if ( num1 != '' && operator != '') {
        num2 = num2 + numberClicked
    }   

    // append the clicks to the DOM
    $('.answer').empty().append(`${num1} ${operator} ${num2}`);
}

function getOperator() {
    // assigns operate to the symbal that was clicked
    operator = $(this).text();
    console.log('clicked!', operator);
    $('.answer').empty().append(`${num1} ${operator} ${num2}`)
}

// gets calculationHistory array from server to use on the DOM
function getAnswer(){
    // Ajax sends a get request to server for information on /calculate
    $.ajax({
        method: 'GET',
        url: '/calculate',
    })
        // after getting request, show information on the DOM
        .then(function(response){
            console.log('response from server:', response)
            render(response);
        })
        // if request fails, display alert on DOM
        .catch(function (error){
            console.log('error from server:', error);
            alert('Sorry, something is no workie with getAnswer function!');
        })
}

function render(response) {
    // empty history to display only current array
    $('#history').empty();
    // loop thru the calculationHistory array and append each equation to the DOM
    for(let index of response){
        $('#history').append(`
        <li>${index.numberOne} ${index.operator} ${index.numberTwo} = ${index.result}</li>
        `)
        // render answer to DOM!
        $('.answer').empty().append(`${response[response.length -1].result}`);
    }
    
}

function calculate(){
    // create object that captures the inputs
    let calculateInputs = {
        numberOne: num1, 
        numberTwo: num2,
        operator: operator,
    }

    // Ajax sends object to the server, posts to /calculate
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: calculateInputs,
    })
        // After posting information to server, console log on client side to confirm
        .then(function(response){
            console.log('Calculating..', calculateInputs);
        })
        // if post fails, alert user.
        .catch(function( error ) {
            console.log('error from server:', error);
            alert('Sorry, something is no workie with calculate function!');
        })
    
    // sends a get request to server for calculation results
    getAnswer();
    clearInputs();
}

// clears number inputs
function clearInputs() {
    console.log('Clicked! Clearing Inputs..')
    num1 = '';
    num2 = '';
    operator = '';
    $('.answer').empty();
}