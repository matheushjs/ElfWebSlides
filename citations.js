allCitations = {
    "junqueira2022solar": 'Junqueira Saldanha, Matheus Henrique, and Yoshito Hirata. "Solar activity facilitates daily forecasts of large earthquakes." Chaos: An Interdisciplinary Journal of Nonlinear Science 32.6 (2022).'
}

makeCitations = function(){
    var slides = document.querySelectorAll(".reveal .slides section");
    slides.forEach( slide => {
        var spans = slide.querySelectorAll("span");
        if(spans.length === 0){
            return;
        }
        var footnoteDiv = document.createElement("div");
        footnoteDiv.classList = ["footnotes"];
        var citationCounter = 1;
        spans.forEach( span => {
            if(span.classList.contains("footfullcite")){
                handle = span.innerText;
                span.innerHTML = "<sup>" + String(citationCounter) + "</sup>";
                footnoteDiv.innerText = footnoteDiv.innerText + allCitations[handle];
                citationCounter = citationCounter + 1;
            }
        });
        if(citationCounter !== 1){
            slide.appendChild(footnoteDiv);
        }
    });
}