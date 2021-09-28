$( document ).ready( onReady );

function onReady (){
    console.log('JQ');
    $('#equals').on('click', calculate);
    $('#clear').on('click', clearInputs);
    $('.operator').on('click', getOperator);
    $('.number').on('click', getNumbers);
    getAnswer();
}

// ! GLOBAL VARIABLES !
let num1= '';
let num2= '';
let operator = '';

function getNumbers(){
  
    let numClicked = $(this).text();

    if ( numClicked && operator === '' ) {
        num1 = num1 + numClicked;
        $('.answer').empty()
    } 

    if ( num1 != '' && operator != '') {
        num2 = num2 + numClicked
    }   
    $('.answer').empty().append(`${num1} ${operator} ${num2}`);
}


function getOperator() {
    operator = $(this).text();
    console.log('Clicked:', operator);
    $('.answer').empty().append(`${num1} ${operator} ${num2}`)
}


function getAnswer(){

    $.ajax({
        method: 'GET',
        url: '/calculate',
    }).then(function(response){
        console.log('response from server:', response)
        render(response);
    }).catch(function (error){
        console.log('error from server:', error);
        alert('Sorry, something is no workie with getAnswer function!');
    })
}


function render(response) {

    $('#history').empty();
    for(let index of response){
        $('#history').append(`
        <li>${index.numberOne} ${index.operator} ${index.numberTwo} = ${index.result}</li>
        `)
        $('.answer').empty().append(`${response[response.length -1].result}`);
    }
}


function calculate(){

    let calculateInputs = {
        numberOne: num1, 
        numberTwo: num2,
        operator: operator,
    }

    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: calculateInputs
    }).then(function(response){
        console.log('Calculating:', calculateInputs);
    }).catch(function( error ) {
        console.log('error from server:', error);
        alert('Sorry, something is no workie with calculate function!');
    })
    
    getAnswer();
    clearInputs();
}

function clearInputs() {
    console.log('Click cleared!')
    num1 = '';
    num2 = '';
    operator = '';
    $('.answer').empty();
}