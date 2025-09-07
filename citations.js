allCitations = {
    "junqueira2022solar": 'Junqueira Saldanha, M. H., & Hirata, Y. (2022). Solar activity facilitates daily forecasts of large earthquakes. Chaos: An Interdisciplinary Journal of Nonlinear Science, 32(6).',
    "junqueira2025role": 'Junqueira Saldanha, M. H., Shiro, M., Yagi, Y., & Hirata, Y. (2025). The role of solar heat in earthquake activity. Chaos: An Interdisciplinary Journal of Nonlinear Science, 35(3).'
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
        spans.forEach(span => {
            if(span.classList.contains("footfullcite")){
                var handle = span.innerHTML; // Using innerHTML since innerText apparently is blank when inside a 'fragment'
                var superscript = "<sup>" + String(citationCounter) + "</sup>"
                span.innerHTML = superscript;
                var newP = document.createElement("p");
                newP.innerHTML = superscript + " " + allCitations[handle];
                footnoteDiv.appendChild(newP);
                citationCounter = citationCounter + 1;
            }
        });
        if(citationCounter !== 1){
            slide.appendChild(footnoteDiv);
        }
    });
}