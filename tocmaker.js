(function buildTOC() {
  // Helper: run callback when Reveal is ready (if available), else on DOMContentLoaded
  function onReady(cb) {
    if (window.Reveal && typeof Reveal.addEventListener === 'function') {
      // wait until reveal is fully initialized
      Reveal.addEventListener('ready', cb);
      // if already ready, the event may not fire — call immediately if available indices exist
      if (Reveal.getIndices && Reveal.getIndices()) {
        // slight async to allow other listeners to run
        setTimeout(cb, 0);
      }
    } else {
      document.addEventListener('DOMContentLoaded', cb);
    }
  }

  onReady(function () {
    const tocContainer = document.querySelectorAll('.toc');
    if (!tocContainer) {
        console.warn('TOC: No element with class ".toc" found.');
        return;
    }

    // Find all section elements inside reveal slides container
    const allSections = document.querySelectorAll('.reveal .slides > section');
    var toctree = {};

    allSections.forEach((slide, idx) => {
        const seq = idx + 1; // slide sequence number starting at 1
        // Find h1 and h2 inside this slide
        const h1 = slide.querySelector('h1');
        // For h2s: collect h2 elements that are descendants of the slide (but after an h1 if desired)
        const h2 = slide.querySelector('h2');

        const idName = slide.id || "slide" + String(seq);
        slide.id = idName;

        if(!h1 || !h1.textContent){
            return;
        } else if(h1.textContent.trim() in toctree && h2){
            toctree[h1.textContent.trim()][h2.textContent.trim()] = {"slideid": idName}
        } else {
            toctree[h1.textContent.trim()] = {"slideid": idName}
            if(h2){
                toctree[h1.textContent.trim()][h2.textContent.trim()] = {"slideid": idName}
            }
        }
    });

    // Build the hierarchical list
    const ol = document.createElement('ol');
    ol.className = 'toc-root';
    
    for(var h1 in toctree){
        const li = document.createElement('li');

        // create link for h1
        const a = document.createElement('a');
        a.href = '#' + toctree[h1]["slideid"]; // user-friendly anchor
        a.textContent = h1;
        
        li.appendChild(a);

        const innerOl = document.createElement('ol');
        innerOl.className = 'toc-sub';
        for(var h2 in toctree[h1]){
            if(h2 === "slideid")
                continue;

            const li2 = document.createElement('li');
            const a2 = document.createElement('a');
            a2.href = '#' + toctree[h1][h2]["slideid"]; // human-friendly but not used for navigation
            a2.textContent = h2;
            li2.appendChild(a2);
            innerOl.appendChild(li2);
        }
        li.appendChild(innerOl);
        ol.appendChild(li);
    }
    // optionally add the sequence number before the text (uncomment if desired)
    // const numberSpan = document.createElement('span'); numberSpan.className = 'toc-num'; numberSpan.textContent = seq + ' '; li.appendChild(numberSpan);

    // Clear previous TOC content and append new list
    tocContainer.forEach(elem => {        
        // First add header
        var header = document.createElement('h1');
        header.innerText = "Table of Contents";
        elem.parentNode.prepend(header);
        elem.parentNode.classList.add("noslidenumber")

        elem.innerHTML = '';
        elem.appendChild(ol);
    })

    // OPTIONAL: update active TOC item on slide change
    function highlightActive(ev) {
      // ev may be Reveal 'slidechanged' event or null (we can read Reveal.getIndices())
      let indices = {h:0,v:0};
      if (ev && ev.currentSlide) {
        const slide = ev.currentSlide;
        indices = Reveal.getIndices ? Reveal.getIndices(slide) : {h:0,v:0};
      } else if (Reveal && typeof Reveal.getIndices === 'function') {
        indices = Reveal.getIndices();
      }
      // find the sequence number corresponding to indices by scanning leafSlides
      let seqNum = null;
      for (let i = 0; i < leafSlides.length; i++) {
        const s = leafSlides[i];
        const hv = computeHVIndices(s);
        if (hv.h === indices.h && hv.v === indices.v) {
          seqNum = i + 1;
          break;
        }
      }
      // remove current highlight
      tocContainer.querySelectorAll('.toc-current').forEach(el => el.classList.remove('toc-current'));
      if (seqNum !== null) {
        // find anchor with matching data-slide-seq
        const a = tocContainer.querySelector('a[data-slide-seq="' + seqNum + '"]');
        if (a) a.classList.add('toc-current');
      }
    }

    // if (window.Reveal && typeof Reveal.addEventListener === 'function') {
    //   Reveal.addEventListener('slidechanged', highlightActive);
    //   // initial highlight
    //   highlightActive();
    // } else {
    //   // fallback: on hashchange or load, try to highlight
    //   window.addEventListener('hashchange', highlightActive);
    //   highlightActive();
    // }
  });
})();
