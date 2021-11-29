let slides;

function getActiveSlides () {

    slides = document.querySelectorAll('.splide__slide')
    //console.log(slides)

    slides.forEach(function(slide) {
        console.log(slide)
        if (slide.classList.contains('.is-active')){
            
            slide.classList.add('.storyActiveSlide')

            activateClass = false
            
        }
    })

}

function timeoutBeforeGetActiveSlides () {
    setInterval(getActiveSlides, 10000);
}

function here () {
    console.log('here')
}

window.addEventListener("DOMContentLoaded", () => {

    setTimeout(timeoutBeforeGetActiveSlides, 10)
    

    setInterval(here, 1000)
    if (document.getElementById("btnDef").checked === true) {
        document.getElementById("ctDefinition").style.display="block !important";
    }
    else{
        document.getElementById("ctDefinition").style.display="none";
    }

})