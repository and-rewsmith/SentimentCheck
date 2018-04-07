function search(){
    var name = document.getElementById("input").value.toLowerCase();
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://charitycheck-check.firebaseio.com/" + name + ".json",
        success: function(data) {
            if (data == null) {
                // Let user know what's good
                // Call flask endpoint
            }
        }
    });
}
