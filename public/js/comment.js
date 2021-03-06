
$(document.body).on('click', '.post-comment', function() {
    $(this).addClass('disabled');
    var author = $('#author').val().trim();
    var comment = $('#comment').val();

    $.ajax({
        url: '/saved/post_comment',
        type: 'PUT',
        data: {
            id: this.id,
            author: author,
            comment: comment
        },
        success: function(response) {
            if (response === "fail") {
                console.log("Save FAILED");
            } else {
                location.reload();
            }
        }
    });
});

$(document.body).on('click', '.glyphicon-remove', function() {
    $(this).addClass('disabled');
    var articleId = $(this).attr("data-articleId");

    console.log("+++++++++ " + articleId + " +++++++++");

    $.ajax({
        url: '/saved/delete_comment',
        type: 'PUT',
        data: {
            commentId: this.id,
            articleId: articleId

        },
        success: function(response) {
            if (response === "fail") {
                console.log("Save FAILED");
            } else {
                location.reload();
            }
        }
    });
});