/*Show up a 'element' in 'time' seconds.*/
function fadeIn(element,time){
    fadeAnimation(element,time,100);
}

/*Hide down a 'element' in 'time' seconds.*/
function fadeOut(element,time, onEndCallback){
    fadeAnimation(element,time,0, undefined, onEndCallback);
}

/* Define a fadeAnimation in a 'element' (from 'actual' or 'from' to end) 1 by each 'msInterval' milliseconds.
   from is optional if not defined starts from*/
function fadeAnimation(element,seconds,end, from, onEndCallback){
    if (from !== undefined)
        element.style.opacity = from/100;
    var initial = (parseFloat(element.style.opacity) || 1) * 100;
    var increment = initial > end ? -1 : 1;
    var curOpacity = initial;
    fadeAnimation.running = fadeAnimation.running || {};


    clearInterval(fadeAnimation.running[element.id]);
    var changeOpacity = function(){
        if (increment > 0 ? curOpacity >= end : curOpacity <= end){
            onEndCallback && onEndCallback();
            clearInterval(fadeAnimation.running[element.id]);
        } else {
            curOpacity += increment;
            element.style.opacity = curOpacity/100;
            element.style.filter = "alpha(opacity="+curOpacity+")";
        }
    };
    changeOpacity();
    fadeAnimation.running[element.id] = setInterval(changeOpacity,seconds * 10);
}
