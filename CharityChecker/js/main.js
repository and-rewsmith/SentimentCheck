function search(){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "localhost:5000/charity?name=The\ Salvation\ Army",
        success: function(data) {
            console.log(data);
        }
    });
}
