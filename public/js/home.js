$(document).ready(function () {
    enableSearch();
    searchQuery();
});

function enableSearch() { //on change
    $('#query').on('keyup', function () {
        console.log($('#query').val().trim())
        if($('#query').val().trim())
            $('#search').attr('disabled', false);
        else $('#search').attr('disabled', true);
    });      
}

function searchQuery() {
    $('form').on('submit', function (event) {
        let query = $('#query').val().trim();
        
    });
}

