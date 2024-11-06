var turn = "x";
// document.getElement("td").......
$("td").on("click", function () {
	console.log("clicked");
    var $square = $(this);
    if ($square.text() == "") {
        $square.text(turn);
        if (turn == "x") {
            turn = "o";
        } else {
            turn = "x";
        }
        $("#turn").text(turn + "'s turn");
    }
});
