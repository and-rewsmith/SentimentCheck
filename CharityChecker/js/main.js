function search(){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://charitycheck-check.firebaseio.com/lol.json",
        success: function(data) {
            console.log(data);
        }
    });
}
