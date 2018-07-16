$(function(){
    var signup = $('#embed-signup');

    $.get(signup.data('src'), function(embed){
        $(embed)
            .replaceAll(signup)
            .addClass('topnav-request-form')
            .find('.signup-queue-button')
                .addClass('btn btn-complementary');
    });
});
