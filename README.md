#HideSeek
A jQuery plugin that make element hide and seek.

##Demo
You can try the [parallel demo]().

You can try the [vertical demo]().

##Dependency
[jQuery](https://github.com/jquery/jquery)

##Install
Just download the repository and link to the local minimized script:

    <script src="noisy/jquery/jquery.noisy.min.js"></script>

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
    
You can modify the default arguments like this:

    $.fn.hideseek.Constructor.DEFAULTS.start_index = 2;
    
In my code I have two event give to you

**animate_start**: when animate start, it will callback this funcion.

**animate_end**: when animate end, it will callback this funcion.

you can use like this:

    $('ul.slideshow').data('hideseek').on('animate_start', function(e) {
        //some code
    //});

You can also add methods in your scripts like this:

    $.fn.hideseek.Constructor.prototype.to = function(num) {
        this.$element.find('> li').eq(num).trigger('mouseenter');
        this.index = num;
        this.options.animate_interval_time && this.pause().autoPlay();  // new position to recycle again
        return this;
    }
    $('ul.slideshow').data('hideseek').to(2);
You can use data-api:

<table style="width: 100%">
   <tr>
      <th>data-api</th>
      <th> type </th>
      <th>value</th>
   </tr>
   <tr>
      <td>data-startIndex</td>
      <td>number</td>
      <td><em>0</em></td>
   </tr>
   <tr>
      <td>data-animateTime</td>
      <td>number</td>
      <td><em>600</em></td>
   </tr>
   <tr>
      <td>data-animateIntervalTime</td>
      <td>number</td>
      <td><em>2000</em>, 0(not auto annimate)</td>
   </tr>
   <tr>
      <td>data-type</td>
      <td>string</td>
      <td><em>'horizon'</em>, vertical</td>
   </tr>
</table>

##Contact
If you have any questions or suggestions that don't fit GitHub, send them to [@choizhang](https://github.com/choizhang)