$(document).ready(function () {
    // Get the text for the Handlebars template from the script element.
    var templateText = $("#tableTemplate").html();

    // Compile the Handlebars template.
    var tableTemplate = Handlebars.compile(templateText);

    // Define an array of people.
    var people = [
        { "Id": 1, "First Name": "Anthony", "Last Name": "Nelson", "Age": 25 },
        { "Id": 2, "First Name": "Helen", "Last Name": "Garcia", "Age": 32 },
        { "Id": 3, "First Name": "John", "Last Name": "Williams", "Age": 48 }
    ];
    
    // Evaluate the template with an array of people and set the HTML
    // for the people table.
    $("#movies-table").html(tableTemplate({ array: people }));

    // enableSearch();
    // searchQuery();
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


