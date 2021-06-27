$('#slider').owlCarousel({
    loop:true,
    margin:18,
    nav:false,
    autoplay: false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:3
        },
        1400:{
            items:4
        }
    }
})

$('#slider2').owlCarousel({
    loop:false,
    margin:18,
    nav:false,
    autoplay: false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:3
        },
        1400:{
            items:4
        }
    }
})

function toggle(){
    var blur = document.getElementById('blur');
    blur.classList.toggle('active');
    var popup = document.getElementById('pop-up');
    popup.classList.toggle('active')
}

function landing() {
    window.location = "./";
  }