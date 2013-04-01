/*global
    _gaq
*/

// Global Properties _________________________________________________________

var ELEMENT_LIST    = 'html,head,title,base,link,meta,style,script,noscript,body,article,nav,aside,section,header,footer,h1,h2,h3,h4,h5,h6,hgroup,address,p,hr,pre,blockquote,ol,ul,li,dl,dt,dd,figure,figcaption,div,table,caption,thead,tbody,tfoot,tr,th,td,col,colgroup,form,fieldset,legend,label,input,button,select,datalist,optgroup,option,textarea,keygen,output,progress,meter,details,summary,command,menu,del,ins,img,iframe,embed,object,param,video,audio,source,canvas,track,map,area,a,em,strong,i,b,u,s,small,abbr,q,cite,dfn,sub,sup,time,code,kbd,samp,var,mark,bdi,bdo,ruby,rt,rp,span,br,wbr',
    ONE_SECOND      = 1000,
    time_left       = 300000,
    elements        = ELEMENT_LIST.split(','),
    timer,
    intro,
    quiz,
    clock,
    input,
    remaining,
    start_button,
    solved,
    outro,
    replay,
    replay_button;

// Global Methods ____________________________________________________________

function buildQuiz() {
    var intro_html  = '<div id="intro"><h2>How To Play</h2><p>On the next screen, enter as many HTML5 elements as you can think of within five minutes. Correct answers will automatically be logged as you type within the input field. Once your time is up, any elements you missed will be listed so you can improve for next time!</p><h2>One more thing…</h2><p>I gave up a <a href="//twitter.com/#!/restlessdesign/status/143195426651254784" rel="external" target="_blank">Saturday night</a> to work on this; won’t you please consider <a href="https://www.paypal.com/sendmoney?amount=4.00&email=kevinsweeney@gmail.com" rel="external" target="_blank">repaying my efforts with a beer</a>?</p><button type="button" id="start_button" title="Leeeeeeeroy Jennnnnkinnnns!">Let’s do this!</button></div>',
        quiz_html   = '<div id="quiz"><div id="clock">5:00</div><input id="input"><p><b id="remaining"></b> elements remaining</p><ul id="solved" class="element_list"></ul></div>',
        outro_html  = '<div id="outro"><h2>Finished!</h2><p>You named <strong id="named">0</strong> HTML5 elements in five minutes!</p><div id="share"><h2>Share Your Score</h2></div><p id="missed_message">You missed the following elements:</p><ul id="missed_elements" class="element_list"></ul><button type="button" id="replay">Again?</button>',
        placeholder = $('#quiz_wrapper').append(intro_html, quiz_html, outro_html);

    intro           = $('#intro');
    quiz            = $('#quiz');
    clock           = $('#clock');
    input           = $('#input');
    remaining       = $('#remaining');
    start_button    = $('#start_button');
    solved          = $('#solved');
    outro           = $('#outro');
    replay_button   = $('#replay');

    start_button.click(startQuiz);
    replay_button.click(restart);
    input.keyup(function() {
        var val     = $(this).val().toLowerCase() || this.value.toLowerCase(),
            els     = elements,
            index   = $.inArray(val, els);

        if (index !== -1) {
            els.splice(index, 1);
            solved.append('<li>' + val + '</li>');
            this.value = '';

            update();
        }
    });

    update();
}

function startQuiz() {
    intro.hide();
    quiz.show();
    input.focus();

    trackEvent('Start');

    timer = setInterval(tick, ONE_SECOND);
}

function restart() {
    trackEvent('Restart');
    window.location = '';
}

function stopQuiz() {
    var solved_elements = solved.children().length,
        share_text      = 'I was able to name ' + solved_elements + ' HTML5 elements in 5 minutes!',
        missed_list     = $('#missed_elements'),
        share_box       = $('#share'),
        twitter_html    = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://thehtml5quiz.com/" data-text="' + share_text + '" data-count="vertical">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script>',
        plus_html       = '<div class="g-plusone" data-size="tall" data-href="http://thehtml5quiz.com"></div><script type="text/javascript">(function() {var po = document.createElement(\'script\'); po.type = \'text/javascript\'; po.async = true;po.src = \'https://apis.google.com/js/plusone.js\';var s = document.getElementsByTagName(\'script\')[0]; s.parentNode.insertBefore(po, s);})();</script>',
        facebook_html   = '<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fthehtml5quiz.com%2F&amp;send=false&amp;layout=box_count&amp;width=50&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=lucida+grande&amp;height=90&amp;appId=251751164868646" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:50px; height:90px;" allowTransparency="true"></iframe>';

    clearInterval(timer);

    trackEvent('Stop');

    share_box.append(twitter_html, plus_html, facebook_html);
    share_box.children(':not(h2)').wrap('<div class="share_item">');
    quiz.hide();
    outro.show();

    $('#named').text(solved_elements);

    if (elements.length > 0) {
        $.each(elements, function() {
            missed_list.append('<li>' + this + '</li>');
        });
    }
    else {
        $('#missed_message, missed_elements').hide();
    }

    trackScore(solved_elements);
}

function formatTime(ms) {
    var x,
        seconds,
        minutes,
        formatted_time,
        number;

    x       = ms / 1000;
    seconds = x % 60;
    x       /= 60;
    minutes = Math.floor(x % 60);

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    if (minutes < 1 && !clock.hasClass('warning')) {
        clock.addClass('warning');
    }

    formatted_time = [minutes, seconds].join(':');

    return formatted_time;
}

function tick() {
    time_left -= ONE_SECOND;
    clock.text(formatTime(time_left));

    if (time_left <= 0) {
        stopQuiz();
    }
}

function update() {
    var count = elements.length;

    remaining.text(count);

    if (count <= 0) {
        stopQuiz();
    }
}

function trackEvent(event_type) {
    if (_gaq) {
        _gaq.push(['_trackEvent', 'Quiz', event_type]);
    }
}

function trackScore(score) {
    if (_gaq) {
        _gaq.push(['_trackEvent', 'Score', 'Points', score]);
    }
}

// Initialization ____________________________________________________________

$(document).ready(function() {
    buildQuiz();
});