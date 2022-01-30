$(document).ready(function () {
	document.cookie = "SameSite=None; Secure";
	$("#codeInput").on("keydown", function (e) {
		if (e.keyCode == 13) {
			login();
		}
	});
	rotate(0.0001);
});

function login() {
	//
	result = true;
	if (result == true) {
		startGraf();
	} else {
		alert("Wrong login");
	}
}

function startGraf() {
	document.getElementById("loginBody").style.marginLeft = "-100%";
	translateCanvas(0.5, 0.5);

	stopInterval("canvasRotate");
	var to_rotate = conjunt.rotation % (2 * Math.PI);
	var int = setInterval(function () {
		conjunt.rotation -= to_rotate / 60;
		to_rotate -= to_rotate / 60;
	}, 1 / 60);
	setTimeout(function () {
		clearInterval(int);
		conjunt.rotation = 0;
		names.visible = true;
		document.getElementById("grafBody").style.display = "flex";
	}, 1000);
}
