function search(){
    $.ajax({
        type: "GET",
        dataType: "JSON",
        url: "https://console.firebase.google.com/project/charitycheck-check/database/charitycheck-check/data",
        success: function(data) {
            console.log(data);
        }
    });
}
