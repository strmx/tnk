define(['jquery'], function($) {

    return (function() {
        var $ibar = $('ul.infobar').eq(0);
        return {
            set:function(field, value) {
                $ibar.find('div[data-'+field+']').html(value);
            }
        };
    })();

});