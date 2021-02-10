$(document).ready(function() {
    if (!(md.mobile())) {
        $.vegas('slideshow', {
            delay: 7000,
            backgrounds: [
                {src: 'images/backgrounds/pbg4.jpg', fade: 1000},
                {src: 'images/backgrounds/pbg5.jpg', fade: 1000},
                {src: 'images/backgrounds/pbg6.jpg', fade: 1000},
                {src: 'images/backgrounds/pbg7.jpg', fade: 1000},
                {src: 'images/backgrounds/pbg2.jpg', fade: 1000}
            ]
        });
    }

    $('.btn').click(function() {
      $.scrollTo($(this).attr('href'), 750, {
            axis: 'y',
            easing: 'swing',
            offset: {top: -76}
        });
    });

    $('.nx-more').on('click', function(event) {
        event.preventDefault();

        var href = $(this).attr('href') + ' .single-project',
            portfolioList = $('#nx-products'),
            content = $('#nx-loaded-content');

        portfolioList.animate({'marginLeft':'-120%'},{duration:400,queue:false});
        portfolioList.fadeOut(400);
        setTimeout(function(){ $('#nx-loader').show(); },400);
        setTimeout(function(){
            content.load(href, function() {
                $('#nx-loaded-content meta').remove();
                $('#nx-loader').hide();
                content.fadeIn(600);
                $('#nx-back-button').fadeIn(600);
            });
        },800);

    });

    $('#nx-back-button').on('click', function(event) {
        event.preventDefault();

        var portfolioList = $('#nx-products')
        content = $('#nx-loaded-content');

        content.fadeOut(400);
        $('#nx-back-button').fadeOut(400);
        setTimeout(function(){
            portfolioList.animate({'marginLeft':'0'},{duration:400,queue:false});
            portfolioList.fadeIn(600);
        },800);
    });
});
