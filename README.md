#HideSeek
A jQuery plugin that make element hide and seek.
***
##Demo
You can try the [parallel demo]().

You can try the [vertical demo]().
***
##Dependency
[jQuery](https://github.com/jquery/jquery)
***
##Install
Just download the repository and link to the local minimized script:

    <script src="noisy/jquery/jquery.noisy.min.js"></script>
***
##Usage
An example showing all parameters would be the following:

    $('ul.slideshow').hideseek({
        start_index: 0,  // 0 is the first element
        animate_time: 600, 
        animate_interval_time: 2000,
        type: 'vertical' // 'horizon' by default
    });
    
But since all parameters are optional you can just use it like this:

    $('ul.slideshow').hideseek();
    
you can use data-api:

    <ul class="slideshow clearfix" data-cat="hideseek" data-autoplay="false">
***
##Contact
If you have any questions or suggestions that don't fit GitHub, send them to [@choizhang](https://github.com/choizhang)