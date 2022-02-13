//const { DateTime } = require("luxon");

$(document).ready(function () {
    enableSearch();
});

/**
 * Enables the search button whenever the input is valid.
 */
function enableSearch() { //on change
    $('#query').on('change', function () {
        var query = $('#query').val().trim();
        var result = validateQuery(query);
        
        if(!result[0]) {
            resetField($('#query'), $('#query-error'))
            $('#search').attr('disabled', result[0]);
            if(!query)
                $('#search').attr('disabled', !result[0]);
        }
        else {
            displayError($('#query'), $('#query-error'), result[1])
            $('#search').attr('disabled', result[0]);            
        }
    });      
}

/**
 * Checks if the input for movie name is valid.
 * 
 * @param       input - movie name input
 * @returns     result: [validity(boolean), error message(string)]
 */
function validateMovieName(input) {
    if(!input)
        return [true, 'Movie name cannot be empty.']
    else
        return [false, '']
}
/**
 * Checks if the input for movie year is valid.
 * @param       input - movie year input
 * @returns     result: [validity(boolean), error message(string)]
 */
function validateMovieYear(input) {
    if(!input)
        return [true, 'Movie year cannot be empty.']
    else if (parseInt(input) < 1600)
        return [true, 'Invalid year.']
    else 
        return [false, ''] 
}

/**
 * Checks if the input for mvie rank is valid.
 * @param       input  - movie rank input
 * @returns     result: [validity(boolean), error message(string)]
 */
function validateMovieRank(input) {
    if(!input)
        return [true, 'Movie rank cannot be empty.']
    else if (parseInt(input) <= 0)
        return [true, 'Invalid rank.']
    else 
        return [false, '']     
}

/**
 * Checks if the input for SELECT query is valid. 
 * @param       input - SELECT query input
 * @returns     result: [validity(boolean), error message(string)] 
 */
function validateQuery(input) { 
    var substr = input.substring(0,6);
    substr = substr.toUpperCase();
    if(!input)
        return [false, '']
    else {
        if(substr == 'SELECT')
            return [false, '']
        else
            return [true, 'Invalid SELECT query.']
    }
}

// Error Visuals 
function displayError(inputField, errorField, errorText) {
    errorField.text(errorText);
    inputField.addClass('is-invalid');
}

function resetField(inputField, errorField) {
    errorField.text('');
    inputField.removeClass('is-invalid');
}

function submitQuery() {
    $('form').on('submit', function (event) {
        let query = $('#query').val().trim();
        
    });
}
