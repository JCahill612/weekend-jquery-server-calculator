$(onReady);

function onReady (){
    console.log('JQ');
    // on click of equal button
    $('#equals').on('click', calculate);
    // on click of 'C' 
    $('#clear').on('click', clearInputs);
    // on click of calculator operator, assign that operator to the object
    $('.operator').on('click', getOperator);
    // on click of a number, get the number and assign it to the object
    $('.button').on('click', getNumbers);
    
    getAnswer();
}

// ! GLOBAL VARIABLES !
let num1= '';
let num2= '';
let operator = '';

function getNumbers(){
    // find the click and assign it to variable
    let numClicked = $(this).text();
    
    // check if there is a click and stops check when an operator is clicked
    if ( numClicked && operator === '' ) {
        num1 = num1 + numClicked;
        $('.answer').empty()
    } 
    // if num1 has a value and the operator have a value move to num2
    if ( num1 != '' && operator != '') {
        num2 = num2 + numClicked
    }   

    // append the clicks to the DOM
    $('.answer').empty().append(`${num1} ${operator} ${num2}`);
}

function getOperator() {
    // assign to the symbol that was clicked
    operator = $(this).text();
    console.log('Clicked:', operator);
    $('.answer').empty().append(`${num1} ${operator} ${num2}`)
}

// get calculatorHistory array from server to use on the DOM
function getAnswer(){
    // send a get request to server for information
    $.ajax({
        method: 'GET',
        url: '/calculate',
    })
        // then show information on the DOM
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
    // loop thru the calculatorHistory array and append each equation to the DOM
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

    // send object to the server, posts to /calculate
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: calculateInputs
    })
        // then console log on client side to confirm
        .then(function(response){
            console.log('Calculating:', calculateInputs);
        })
        // if post fails, alert user.
        .catch(function( error ) {
            console.log('error from server:', error);
            alert('Sorry, something is no workie with calculate function!');
        })
    
    getAnswer();
    clearInputs();
}


// clears number inputs
function clearInputs() {
    console.log('Click cleared!')
    num1 = '';
    num2 = '';
    operator = '';
    $('.answer').empty();
}