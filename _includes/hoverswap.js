/* Change image when hovering.
 Selector '.hoverswap'
 Properties swaped:
 1) 'src' and 'hoversrc'
 2) 'srcset' and 'hoversrcset'
*/
$(document).ready(function () {
    if (window.hoverswap_ === undefined) {
        window.hoverswap_ = {};
        $(".hoverswap").each(function () {
            if ($(this).attr("hoversrc")) {
                window.hoverswap_[$(this).attr("hoversrc")] = $(this).attr("src");
                window.hoverswap_[$(this).attr("hoversrcset")] = $(this).attr("data-srcset");
            }
        });
        $(".hoverswap").hover(function onHover() {
                if ($(this).attr("hoversrc"))
                    $(this).attr("src", $(this).attr("hoversrc"));
                if ($(this).attr("hoversrcset"))
                    $(this).attr("srcset", $(this).attr("hoversrcset"));
            },
            function outHover() {
                if ($(this).attr("hoversrc"))
                    $(this).attr("src", window.hoverswap_[$(this).attr("hoversrc")]);
                if ($(this).attr("hoversrcset"))
                    $(this).attr("srcset", window.hoverswap_[$(this).attr("hoversrcset")]);
            }
        );
    }
});


