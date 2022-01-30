var two = new Two({
	autostart: true,
	width: document.body.clientWidth,
	height: document.body.clientHeight,
}).appendTo(document.getElementById("map"));

var nodes = new Two.Group();
var names = new Two.Group();
var conjNodes = [];

for (var i = 0; i < 10; i++) {
	var x = Math.random() * two.width * 2 - two.width;
	var y = Math.random() * two.height * 2 - two.height;
	x /= 2;
	y /= 2;
	var size = 50;
	conjNodes[i] = new Two.Circle(x, y, 5, size);
	conjNodes[i].rotation = Math.random() * Math.PI * 2;
	conjNodes[i].noStroke().fill = "#ccc";
	nodes.add(conjNodes[i]);

	var text = new Two.Text("uwu", x, y + 13, "normal");
	text.fill = "#FFFFFF";
	text.size = "11";
	names.add(text);
}
two.renderer.domElement.style.background = "rgb(0, 0, 0,0)";

var conjunt = two.makeGroup(nodes, names);
two.update();
for (var i = 0; i < 10; i++) {
	var elem = document.getElementById(conjNodes[i].id);
	elem.addEventListener("click", function (e) {
		console.log(e.target.id);
	});
}

names.visible = false;
addZUI();

function addZUI() {
	var domElement = two.renderer.domElement;
	var bodyElement = document.getElementById("map");
	var conjuntZUI = new Two.ZUI(conjunt);
	var mouse = new Two.Vector();
	var touches = {};
	var distance = 0;
	var dragging = false;

	bodyElement.addEventListener("mousedown", mousedown, false);
	bodyElement.addEventListener("dblclick", doubleclick, false);
	bodyElement.addEventListener("mousewheel", mousewheel, false);
	bodyElement.addEventListener("wheel", mousewheel, false);

	bodyElement.addEventListener("touchstart", touchstart, false);
	bodyElement.addEventListener("touchmove", touchmove, false);
	bodyElement.addEventListener("touchend", touchend, false);
	bodyElement.addEventListener("touchcancel", touchend, false);
	conjuntZUI.translateSurface(two.width * 0.5, two.height * 0.5);

	function doubleclick(e) {
		console.log("uwu");
		conjuntZUI.zoomSet(1, two.width * 0.5, two.height * 0.5);
	}

	function mousedown(e) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		var rect = conjNodes[0].getBoundingClientRect();
		dragging =
			mouse.x > rect.left &&
			mouse.x < rect.right &&
			mouse.y > rect.top &&
			mouse.y < rect.bottom;
		window.addEventListener("mousemove", mousemove, false);
		window.addEventListener("mouseup", mouseup, false);
	}

	function mousemove(e) {
		var dx = e.clientX - mouse.x;
		var dy = e.clientY - mouse.y;
		if (dragging) {
			conjuntZUI.position.x += dx / nodes.scale;
		} else {
			conjuntZUI.translateSurface(dx, dy);
		}
		mouse.set(e.clientX, e.clientY);
	}

	function mouseup(e) {
		window.removeEventListener("mousemove", mousemove, false);
		window.removeEventListener("mouseup", mouseup, false);
	}

	function mousewheel(e) {
		var dy = (e.wheelDeltaY || -e.deltaY) / 1000;
		conjuntZUI.zoomBy(dy, e.clientX, e.clientY);
	}

	function touchstart(e) {
		switch (e.touches.length) {
			case 2:
				pinchstart(e);
				break;
			case 1:
				panstart(e);
				break;
		}
	}

	function touchmove(e) {
		switch (e.touches.length) {
			case 2:
				pinchmove(e);
				break;
			case 1:
				panmove(e);
				break;
		}
	}

	function touchend(e) {
		touches = {};
		var touch = e.touches[0];
		if (touch) {
			// Pass through for panning after pinching
			mouse.x = touch.clientX;
			mouse.y = touch.clientY;
		}
	}

	function panstart(e) {
		var touch = e.touches[0];
		mouse.x = touch.clientX;
		mouse.y = touch.clientY;
	}

	function panmove(e) {
		var touch = e.touches[0];
		var dx = touch.clientX - mouse.x;
		var dy = touch.clientY - mouse.y;
		conjuntZUI.translateSurface(dx, dy);
		mouse.set(touch.clientX, touch.clientY);
	}

	function pinchstart(e) {
		for (var i = 0; i < e.touches.length; i++) {
			var touch = e.touches[i];
			touches[touch.identifier] = touch;
		}
		var a = touches[0];
		var b = touches[1];
		var dx = b.clientX - a.clientX;
		var dy = b.clientY - a.clientY;
		distance = Math.sqrt(dx * dx + dy * dy);
		mouse.x = dx / 2 + a.clientX;
		mouse.y = dy / 2 + a.clientY;
	}

	function pinchmove(e) {
		for (var i = 0; i < e.touches.length; i++) {
			var touch = e.touches[i];
			touches[touch.identifier] = touch;
		}
		var a = touches[0];
		var b = touches[1];
		var dx = b.clientX - a.clientX;
		var dy = b.clientY - a.clientY;
		var d = Math.sqrt(dx * dx + dy * dy);
		var delta = d - distance;
		conjuntZUI.zoomBy(delta / 250, mouse.x, mouse.y);
		distance = d;
	}
}

two.bind("update", update);

function update(frameCount) {}

var intervals = {};
function translateCanvas(x, y) {
	var diffX = x * two.width - conjunt.translation.x;
	var diffY = y * two.height - conjunt.translation.y;
	var int = setInterval(function () {
		conjunt.translation.set(x * two.width - diffX, y * two.height - diffY);
		diffX -= diffX / 60;
		diffY -= diffY / 60;
	}, 1 / 60);
	setTimeout(function () {
		clearInterval(int);
		conjunt.translation.set(x * two.width, y * two.height);
	}, 1000);
}

function stopInterval(name) {
	if (intervals[name] != null) {
		clearInterval(intervals[name]);
		return true;
	} else {
		return false;
	}
}
function rotate(speed) {
	var refreshrate = 60;
	var rotate = setInterval(function () {
		conjunt.rotation += speed;
	}, 1 / refreshrate);
	intervals["canvasRotate"] = rotate;
}
translateCanvas(0.75, 0.5);
