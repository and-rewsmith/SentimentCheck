var lists = document.getElementsByTagName('ul');
var output = "var names = [\n"
for (var i = 0; i < lists.length; i++) {
    var items = lists[i].getElementsByTagName("a");
    for (var j = 0; j < items.length; j++) {
        var item = items[j];
        output += '"' + item.title + '",\n';
    }
}
output += "]";
console.log(output);
