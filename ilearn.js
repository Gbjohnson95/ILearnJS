var matches = document.body.innerHTML.match(/##(.*?):(.*?)##/g); // Need function to filter duplicates

var newhtml = document.body.innerHTML;
for (var i = 0; i < matches.length; i++) {
	var cleanedMatchText = matches[i].replace(/##/g, "");
	cleanedMatchText = cleanedMatchText.toLocaleLowerCase();
	var requestClass = cleanedMatchText.match(/^[a-z]*/)[0];
	cleanedMatchText = cleanedMatchText.replace(/^[a-z]*:/, "");
	newhtml = newhtml.replace(matches[i], '<span class="' + requestClass + '" id="replaceContainer">' + cleanedMatchText + '</span>');
}
document.body.innerHTML = newhtml;

var repleaceContainers = $("span#replaceContainer");
CourseDataHandler($(repleaceContainers).filter(".cd"));
DocDataHandler($(repleaceContainers).filter(".dd"));
TeXHandler($(repleaceContainers).filter(".tex"));
//UserDataHandler($(repleaceContainers).filter(".ud"));

// --- --- --- --- --- --- REPLACE STRING CATAGORY HANDLERS --- --- --- --- --- ---
function CourseDataHandler(elems) {
	$(elems).each(function () {
		switch ($(this).html()) {
		case "coursecalendar":
			$(this).html(getCourseCalendarLink());
			break;
		case "coursehome":
			$(this).html(getCourseHomeLink());
			break;
		}
	});
}

function DocDataHandler(elems) {
	$(elems).each(function () {
		switch ($(this).html()) {
		case "doctitle":
			$(this).html(getDocumentTitle());
			break;
		}
	});
}

function TeXHandler(elems) {
	if (!window.katex) {
		loadKaTeX(elems);
	} else {
		$(elems).each(function () {
			var tex = $(this).html();
			tex = tex.replace(/amp;/g, "");
			$(this).css({
				"padding-bottom" : "1.5rem;",
				"padding-top" : "1.5rem;",
				"text-align" : "left",
				"font-size" : "1.2em"
			});
			if (tex.indexOf("full:") === 0) {
				tex = tex.replace("full:", "");
				katex.render(tex, this, {
					displayMode : true
				});
			} else {
				katex.render(tex, this);
			}
		});
	}
}

function UserDataHandler(elems) {
	$(elems).each(function () {
		switch ($(this).html()) {
		case "FirstName":
			$(this).html(queryWhoAmI().LastName);
			break;
		case "LastName":
			$(this).html(queryWhoAmI().FirstName);
			break;
		}

	});
}

// --- --- --- --- --- --- LMS DEPENDANT FUNCTIONS --- --- ---  --- --- ---
function getOrgUnitID() {
	if (getUrlParameterByName("ou", parent.document.URL) !== null) {
		return getUrlParameterByName("ou", parent.document.URL);
	} else {
		return parent.document.URL.split('/')[4];
	}
}

function queryWhoAmI() {
	if ($("#WhoAmI").length !== 0) {
		$(document.body).append('<div id="WhoAmI" progress="started"></div>');
		$.getJSON("/d2l/api/lp/1.7/users/whoami", function (data) {
			var whoamicontainer = $("#WhoAmI");
			$(whoamicontainer).attr("FirstName", data.FirstName);
			$(whoamicontainer).attr("LastName", data.LastName);
			$(whoamicontainer).attr("progress", "completed");
		});
	} else if ($("#WhoAmI").attr("progress") == "completed") {
		var fname = $("#WhoAmI").attr("FirstName");
		var lname = $("#WhoAmI").attr("LastName");

		return {
			"FirstName" : fname,
			"LastName" : lname
		};
	}
}

function returnWhoAmI() {}

function getDocumentTitle() {
	if (top.document.querySelector("h1.d2l-page-title")) {
		if (top.document.querySelector("h1.d2l-page-title").innerHTML !== "Edit HTML File") {
			return top.document.querySelector("h1.d2l-page-title").innerHTML;
		}
	} else if (document.title) {
		return document.title;
	} else {
		return "No valid titles found";
	}
}

function getCourseCalendarLink() {
	return '<a href="/d2l/le/calendar/' + getOrgUnitID() + '">Course Calendar</a>';
}

function getCourseHomeLink() {
	return '<a href="/d2l/home/' + getOrgUnitID() + '">Course Home</a>';
}

// --- --- --- --- --- --- NON LMS DEPENDANT GENERAL FUNCTIONS --- --- ---  --- --- ---
function getUrlParameterByName(name, url) {
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadKaTeX(elems) {
	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.js", function () { // Shouldn't use JQuery...
		var head = document.querySelector("head");
		var katexCss = document.createElement("link");
		katexCss.setAttribute("rel", "stylesheet");
		katexCss.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css");
		head.appendChild(katexCss);
		TeXHandler(elems);
	});
}
