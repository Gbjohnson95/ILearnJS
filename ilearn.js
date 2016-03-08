var matches = document.body.innerHTML.match(/##(.*?)##/g); // Need function to filter duplicates

// First release v0.1 will include 3 catagories of replace strings/macros. CD: for course data, UD: for user data, TEX: for LaTex
for (var i = 0; i < matches.length; i++) {
    if (matches[i].indexOf("##CD:") === 0) {
        CourseDataHandler(matches[i]);
    } else if (matches[i].indexOf("##TeX:") === 0) {
        TeXHandler(matches[i]);
    }
}

// --- --- --- --- --- --- REPLACE STRING CATAGORY HANDLERS --- --- --- --- --- --- 
function CourseDataHandler(request) {
    // Clean up request test
    var requestText = request.replace(/##CD:/, "");
    requestText = requestText.replace(/##/, "");
    requestText = requestText.toLocaleLowerCase();

    // This function will need some attention, because this feels messy
    // When filter fuction is implimented set regex flags to global
    switch (requestText) {
    case "coursecalendar":
        document.body.innerHTML = document.body.innerHTML.replace(/##CD:CourseCalendar##/i, getCourseCalendarLink());
        break;
    case "coursehome":
        document.body.innerHTML = document.body.innerHTML.replace(/##CD:CourseHome##/i, getCourseHomeLink());
        break;
    }
}

function TeXHandler(request) {
    if (!window.katex) {
        loadKaTeX();
    } else {
        renderAllTeX();
    }
}

// --- --- --- --- --- --- LMS DEPENDANT FUNCTIONS --- --- ---  --- --- --- 
function getOrgUnitID() {
    if (getUrlParameterByName("ou", parent.document.URL) !== null) {
        return getUrlParameterByName("ou", parent.document.URL);
    } else {
        return parent.document.URL.split('/')[4];
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


// KaTeX is a latex renderer from Khan Acadamy. 
function loadKaTeX() {
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.js", function () { // Shouldn't use JQuery...
        var head = document.querySelector("head");
        var katexCss = document.createElement("link");
        katexCss.setAttribute("rel", "stylesheet");
        katexCss.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css");
        head.appendChild(katexCss);

        renderAllTeX();
    });
}

function renderAllTeX() {
    var matches = document.body.innerHTML.match(/##TeX(.*?)##/g); // Need function to filter duplicates
    for (var i = 0; i < matches.length; i++) {
        var requestText = matches[i].replace(/##TeX:/, "");
        requestText = requestText.replace(/##/, "");
        requestText = requestText.replace(/\//, "//");
        var container = document.createElement("div");
        katex.render(requestText, container);
        document.body.innerHTML.replace(matches[i], container.innerHTML);
    }
}
