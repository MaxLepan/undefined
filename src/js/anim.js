var splide = new Splide('.splide');

splide.on('autoplay:playing', function (rate) {
    console.log(rate); // 0-1
});

splide.mount();