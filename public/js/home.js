//const { DateTime } = require("luxon");

$(document).ready(function () {
    enableSearch();
    // submitQuery();
});

function enableSearch() { //on change
    $('#query').on('keyup', function () {
        console.log($('#query').val().trim())
        if($('#query').val().trim())
            $('#search').attr('disabled', false);
        else $('#search').attr('disabled', true);
    });      
}

function submitQuery() {
    $('form').on('submit', function (event) {
        let query = $('#query').val().trim();
        
    });
}

function validateQuery() {
    
}