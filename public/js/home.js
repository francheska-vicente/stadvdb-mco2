//const { DateTime } = require("luxon");

$(document).ready(function () {
    enableSearch();
    enableAddMovie();
    enableUpdateMovie();
    initializeMovieModalFields();
    submitEditForm();
});

function submitEditForm() {
    $(".update-movie").on('submit', function (event) {
        event.preventDefault();
        console.log("hello");
        const id = $(this).children('.id').val();

        let data = {
            old_name: $("#movie-name-copy-" + id).val(),
            new_name: $("#update-movie-name-" + id).val(),
            old_year: $("#movie-year-copy-" + id).val(),
            new_year: $("#update-movie-year-" + id).val(),
            old_rank: $("#movie-rank-copy-" + id).val(),
            new_rank: $("#update-movie-rank-" + id).val(),
        };

        $.ajax({
            type: 'PUT',
            url: '/edit/' + id,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                window.location.href = '/'
            }
        });
    });
}

/**
 * Checks if the input for movie name is valid.
 * 
 * @param       input - movie name input
 * @returns     result: [validity(boolean), error message(string)]
 */
function validateMovieName(input) {
    if (!input)
        return [false, 'Movie name cannot be empty.']
    else
        return [true, '']
}
/**
 * Checks if the input for movie year is valid.
 * @param       input - movie year input
 * @returns     result: [validity(boolean), error message(string)]
 */
function validateMovieYear(input) {
    if (!input)
        return [false, 'Movie year cannot be empty.']
    else if (parseInt(input) < 1700)
        return [false, 'Invalid year.']
    else
        return [true, '']
}

/**
 * Checks if the input for mvie rank is valid.
 * @param       input  - movie rank input
 * @returns     result: [validity(boolean), error message(string)]
 */
function validateMovieRank(input) {
    if (!input)
        return [true, '']
    else if (parseInt(input) <= 0)
        return [false, 'Invalid rank.']
    else
        return [true, '']
}

/**
 * Checks if the input for SELECT query is valid. 
 * @param       input - SELECT query input
 * @returns     result: [validity(boolean), error message(string)] 
 */
function validateQuery(input) {
    var substr = input.substring(0, 6);
    substr = substr.toUpperCase();
    if (!input)
        return [true, '']
    else {
        if (substr == 'SELECT')
            return [true, '']
        else
            return [false, 'Invalid SELECT query.']
    }
}

/**
 * Checks if at least one of the input fields has invalid input.
 * @param       moviename 
 * @param       year 
 * @param       rank 
 * @returns     validity result for each field 
 */
function validateMovieEntry(moviename, year, rank) {
    var resultyear = validateMovieYear(year);
    var resultrank = validateMovieRank(rank);

    if (
        (moviename && resultyear[0] && resultrank[0]) ||
        (moviename == year && year == rank)
    )
        return [true, ''];
    else {
        if (!moviename) {
            if(!resultyear[0]) {
                return [
                    false, 'Invalid year.',
                    resultyear[0], resultyear[1],
                    resultrank[0], resultrank[1]];                
            } else {
                return [
                    false, 'Movie name cannot be empty.',
                    resultyear[0], resultyear[1],
                    resultrank[0], resultrank[1]];                
            }
        } else {
            if (!resultyear[0])
                return [
                    false, 'Invalid year.',
                    resultyear[0], resultyear[1],
                    resultrank[0], resultrank[1]];
            else  {
                if(!resultrank[0])
                    return [
                        false, 'Invalid rank.',
                        resultyear[0], resultyear[1],
                        resultrank[0], resultrank[1]];
                else return [true, ''];
            }
        }
    }
}

/**
 * For displaying the error for the fields with invalid input.
 * @param       inputField - ID of the input field where the invalid input is.
 * @param       errorField - ID of the field where the error message will be displayed.
 * @param       errorText - error message for the invalid input
 */
function displayError(inputField, errorField, errorText) {
    errorField.text(errorText);
    inputField.addClass('is-invalid');
}

/**
 * For resetting the visual of the invalid fields.
 * @param       inputField - ID of the input field where the invalid input was.
 * @param       errorField - ID of the field where the error message was displayed. 
 */
function resetField(inputField, errorField) {
    errorField.text('');
    inputField.removeClass('is-invalid');
}


/**
 * Enables the search button for the query input whenever the input is valid.
 */
function enableSearch() {
    $('#query').on('change', function () {
        var query = $('#query').val().trim();
        var result = validateQuery(query);

        if (result[0]) {
            resetField($('#query'), $('#query-error'))
            $('#search').attr('disabled', !result[0]);
            if (!query)
                $('#search').attr('disabled', result[0]);
        }
        else {
            displayError($('#query'), $('#query-error'), result[1])
            $('#search').attr('disabled', !result[0]);
        }
    });
}

/**
 * Enables the Add Movie button of movie name, year, and rank inputs are valid.
 */
function enableAddMovie() {
    $('#add-movie-name, #add-movie-year, #add-movie-rank').on('change', function () {
        var aname = $('#add-movie-name').val().trim();
        var ayear = $('#add-movie-year').val().trim();
        var arank = $('#add-movie-rank').val().trim();
        var result = validateMovieEntry(aname, ayear, arank);
        $('.add-movie-button').attr('disabled', !result[0]);

        if (!result[0]) {
            if (result[1] == 'Movie name cannot be empty.' || !aname) {
                displayError(
                    $('#add-movie-name'),
                    $('#add-movie-error'),
                    result[1]
                );
                $('#add-movie-year').removeClass('is-invalid');
                $('#add-movie-rank').removeClass('is-invalid');
            } else if (result[1] == 'Invalid year.') {
                displayError(
                    $('#add-movie-year'),
                    $('#add-movie-error'),
                    result[1]
                );
                $('#add-movie-name').removeClass('is-invalid');
                $('#add-movie-rank').removeClass('is-invalid');
            } else {
                displayError(
                    $('#add-movie-rank'),
                    $('#add-movie-error'),
                    result[1]
                );
                $('#add-movie-name').removeClass('is-invalid');
                $('#add-movie-year').removeClass('is-invalid');
            }
        } else {
            resetField($('#add-movie-year'), $('#add-movie-error'));
            resetField($('#add-movie-rank'), $('#add-movie-error'));
            resetField($('#add-movie-name'), $('#add-movie-error'));
            if (!aname)
                $('.add-movie-button').attr('disabled', result[0]);
        }
    });
}

/**
 * Enables the Update Movie button of movie name, year, and rank inputs are valid.
 * The Update Movie button remains disabled if there are no changes.
 */
function enableUpdateMovie() {
    $('.update-movie-name, .update-movie-year, .update-movie-rank').on('change', function () {
        var input = {
            aname: $('.update-movie-name').val().trim(),
            ayear: $('.update-movie-year').val().trim(),
            arank: $('.update-movie-rank').val().trim()
        }
        var copy = {
            aname: $('.movie-name-copy').val().trim(),
            ayear: $('.movie-year-copy').val().trim(),
            arank: $('.movie-rank-copy').val().trim()
        }
        
        if(input.aname == copy.aname && input.ayear == copy.ayear && input.arank == copy.arank) {
            resetField($('.update-movie-year'), $('.update-movie-error'));
            resetField($('.update-movie-rank'), $('.update-movie-error'));
            resetField($('.update-movie-name'), $('.update-movie-error'));
            $('.update-movie-button').attr('disabled', true);
        }
        else {
            var result = validateMovieEntry(input.aname, input.ayear, input.arank);
            $('.update-movie-button').attr('disabled', !result[0]);
        
            if (!result[0]) {
                if (result[1] == 'Movie name cannot be empty.' || !input.aname) {
                    displayError(
                        $('.update-movie-name'),
                        $('.update-movie-error'),
                        result[1]
                    );
                    $('.update-movie-year').removeClass('is-invalid');
                    $('.update-movie-rank').removeClass('is-invalid');
                } else if (result[1] == 'Invalid year.') {
                    displayError(
                        $('.update-movie-year'),
                        $('.update-movie-error'),
                        result[1]
                    );
                    $('.update-movie-name').removeClass('is-invalid');
                    $('.update-movie-rank').removeClass('is-invalid');
                } else {
                    displayError(
                        $('.update-movie-rank'),
                        $('.update-movie-error'),
                        result[1]
                    );
                    $('.update-movie-name').removeClass('is-invalid');
                    $('.update-movie-year').removeClass('is-invalid');
                }
            } else {
                resetField($('.update-movie-year'), $('.update-movie-error'));
                resetField($('.update-movie-rank'), $('.update-movie-error'));
                resetField($('.update-movie-name'), $('.update-movie-error'));
                if (!input.aname)
                    $('.update-movie-button').attr('disabled', result[0]);
            }
        }
    });
}

/**
 * Resets the values of the Add/Update Modal fields.
 */
function initializeMovieModalFields() {
    $('.modal-insert').on('hidden.bs.modal', function () {
        $('#add-movie-name, #add-movie-year, #add-movie-rank').val('');
        resetField($('#add-movie-year'), $('#add-movie-error'));
        resetField($('#add-movie-rank'), $('#add-movie-error'));
        resetField($('#add-movie-name'), $('#add-movie-error'));
        $('.add-movie-button').attr('disabled', true);
    });

    $('.modal-update').on('hidden.bs.modal', function () {
        $('.update-movie-name').val($('.movie-name-copy').val());
        $('.update-movie-year').val($('.movie-year-copy').val());
        $('.update-movie-rank').val($('.movie-rank-copy').val());
        resetField($('.udpate-movie-year'), $('.update-movie-error'));
        resetField($('.update-movie-rank'), $('.update-movie-error'));
        resetField($('.update-movie-name'), $('.update-movie-error'));
        $('.update-movie-button').attr('disabled', true);
    });
} 7