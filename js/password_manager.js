selectors_login = [
    'input[type="email"]',
    'input[name="email"]',
    'input[name="username"]',
    'input[name="user"]',
    'input[name="userName"]',
    'input[name="login"]',
    'input[name="loginId"]',
    'input[name="loginid"]',
    'input[name="user"]',
    'input[name="userid"]',
    'input[type="text"]',
    'input[name="wpName"]',
    'input[name="_username"]'
];

var g_input_login = "";
var g_input_password = "";
var g_card = {};
var is_overlay = false;
var g_input_pass_and_login = [];
var setPassowrd = "";
var setLoginValue = "";
var g_show_header_bar = true;
var g_click_close = false;
var eventPerformed=0;
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.name == 'set_to_page_password') {
        set_to_page_password(message.password, "");
    }
    if (message.name == 'set_to_page_card') {
        set_card_to_page(message.card);
    }

    return true;
});


 function simulate(element, eventName) {
        var options = extend(defaultOptions, arguments[2] || {});
        var oEvent, eventType = null;

        for (var name in eventMatchers) {
            if (eventMatchers[name].test(eventName)) { eventType = name; break; }
        }

        if (!eventType)
            throw new SyntaxError("Only HTMLEvents and MouseEvents interfaces are supported");

        if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType == "HTMLEvents") {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            }
            else if (eventType == "MouseEvents") {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                    options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                    options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            else {
                var keyboardEvent = document.createEvent("KeyboardEvent");
                var initMethod = typeof oEvent.initKeyboardEvent !== "undefined" ? "initKeyboardEvent" : "initKeyEvent";
                oEvent[initMethod](eventName, options.bubbles, options.cancelable, document.defaultView,
                    options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                    options.keyCode, options.charCode);
            }
            element.dispatchEvent(oEvent);
        }
        else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            var evt = document.createEventObject();
            oEvent = extend(evt, options);
            element.fireEvent("on" + eventName, oEvent);
        }
		eventPerformed=eventPerformed+1;
        return element;
    }

    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }

    var eventMatchers = {
        "HTMLEvents": /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        "MouseEvents": /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/,
        "KeyboardEvent": /^(?:input|key(?:press|up|down))$/
    }

    var defaultOptions = {
        pointerX: 0,
        pointerY: 0,
        button: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true,
        keyCode: 0,
        charCode: 0
    }    


// Check element's existance
function isset_selector(selector) {
    return (document.querySelector('input[id="' + selector + '"]') || document.querySelector('input[name="' + selector + '"]'));
}

// Adds password to an element on a page
function set_to_page_password(text, selector) {

    if (selector && selector != "!" && isset_selector(selector)) {
        var default_val = "";
        for (var i = 0; i < g_input_pass_and_login.length; i++) {
            if (g_input_pass_and_login[i].password == selector)
                default_val = g_input_pass_and_login[i].password_value;
        }
        set_text_to_element('input[id="' + selector + '"]', text, default_val);
        set_text_to_element('input[name="' + selector + '"]', text, default_val);
        g_input_password = selector;

        // Create the event.
        var event = document.createEvent('Event');

        // Define that the event name is 'build'.
        event.initEvent('change', true, true);


        var newselector2 = "";
        if (document.querySelector('input[id="' + selector + '"]') != null) {
            newselector2 = document.querySelector('input[id="' + selector + '"]');
        } else {
            newselector2 = document.querySelector('input[name="' + selector + '"]');
        }

        // Listen for the event.
        newselector2.addEventListener('change', function(e) {
            // e.target matches elem
        }, false);

        // target can be any Element or other EventTarget.
        newselector2.dispatchEvent(event);
        var selecSubmitButtons = document.querySelectorAll('input[type="submit"]');
        for (var p = 0; p < selecSubmitButtons.length; p++) {
            var btn = document.querySelectorAll('input[type="submit"]')[p];
            if (btn.form.querySelector('input[type="password"]')) {
                btn.disabled = false;
            }
        }
    } else {
        for (var i = 0; i < g_input_pass_and_login.length; i++) {
            set_text_to_element('input[id="' + g_input_pass_and_login[i].password + '"]', text, g_input_pass_and_login[i].password_value);
            set_text_to_element('input[name="' + g_input_pass_and_login[i].password + '"]', text, g_input_pass_and_login[i].password_value);
        }
    }
    ///// NEWLY ADDED //////////
    if (!isset_selector(selector)) {
        setTimeout(function() {
            var loginId = "";
            var passwordId = "";
            var iframes = document.querySelectorAll('iframe');
            if (iframes.length > 0) {

                for (var j = 0; j < iframes.length; j++) {
                    try {
                        updateURL();
                        var checkFrame = iframes[j].contentDocument || iframes[j].contentWindow.document;
                        if (checkFrame.querySelectorAll('form[method="post"]').length > 0) {
                            var list = document.querySelectorAll('form[method="post"]');
                            if (list.length == 0) {
                                list = document.querySelectorAll('form');
                            }
                            if (list.length > 0) {

                                for (var i = list.length - 1; i >= 0; i--) {

                                    var password = list[i].querySelectorAll('input[type="password"]');
                                    if (password.length == 1 || password.length > 1) {
                                        for (var j = 0; j < password.length; j++) {
                                            if (password[j].currentStyle ? password[j].currentStyle.display :
                                                getComputedStyle(password[j], null).display != "none") {
                                                var input = {};
                                                input.password = password[j].id;
                                                if (input.password == "") {
                                                    input.password = password[j].name;
                                                }
                                                passwordId = input.password;
                                                if (passwordId != "") {
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    var selecSubmitButtons = list[i].querySelectorAll('input[type="submit"]');
                                    for (var p = 0; p < selecSubmitButtons.length; p++) {
                                        var btn = list[i].querySelectorAll('input[type="submit"]')[p];
                                        if (btn.form.querySelector('input[type="password"]')) {
                                            btn.disabled = false;
                                        }
                                    }

                                };
                            }
                        } else {
                            break;
                        }
                    } catch (e) {

                    }

                }
            }
            var list = document.querySelectorAll('form[method="post"]');
            if (list.length == 0) {
                list = document.querySelectorAll('form');
            }
            if (list.length > 0) {

                for (var i = list.length - 1; i >= 0; i--) {

                    var password = list[i].querySelectorAll('input[type="password"]');
                    if (password.length == 1 || password.length > 1) {
                        for (var j = 0; j < password.length; j++) {
                            if (password[j].currentStyle ? password[j].currentStyle.display :
                                getComputedStyle(password[j], null).display != "none") {
                                var input = {};
                                input.password = password[j].id;
                                if (input.password == "") {
                                    input.password = password[j].name;
                                }
                                passwordId = input.password;
                                if (passwordId != "") {
                                    break;
                                }
                            }
                        }
                    }
                    var selecSubmitButtons = list[i].querySelectorAll('input[type="submit"]');
                    for (var p = 0; p < selecSubmitButtons.length; p++) {
                        var btn = list[i].querySelectorAll('input[type="submit"]')[p];
                        if (btn.form.querySelector('input[type="password"]')) {
                            btn.disabled = false;
                        }
                    }

                };
            }
            var default_val = "";
            for (var i = 0; i < g_input_pass_and_login.length; i++) {
                if (g_input_pass_and_login[i].password == selector)
                    default_val = g_input_pass_and_login[i].password_value;
            }
            set_text_to_element('input[id="' + passwordId + '"]', text, default_val);
            set_text_to_element('input[name="' + passwordId + '"]', text, default_val);
            g_input_password = selector;


        }, 50);
    }
}

// Adds login to an element on a page
function set_to_page_login(text, selector) {
    
    if (selector && selector != "!" && isset_selector(selector)) {
        var default_val = "";
        for (var i = 0; i < g_input_pass_and_login.length; i++) {
            if (g_input_pass_and_login[i].login == selector)
                default_val = g_input_pass_and_login[i].login_value;
        }
        set_text_to_element('input[id="' + selector + '"]', text, default_val);
        set_text_to_element('input[name="' + selector + '"]', text, default_val);
        g_input_login = selector;

        var newselector = "";
        if (document.querySelector('input[id="' + selector + '"]') != null) {
            newselector = document.querySelector('input[id="' + selector + '"]');
        } else {
            newselector = document.querySelector('input[name="' + selector + '"]');
        }
        var event = document.createEvent('Event');
        event.initEvent('change', false, false);
        newselector.addEventListener('change', function(e) {}, false);
        newselector.dispatchEvent(event);
        if (newselector.type == "hidden") {

            var list = document.querySelectorAll('form[method="post"]');
            if (list.length == 0) {
                list = document.querySelectorAll('form');
            }
            if (list.length > 0) {

                for (var i = list.length - 1; i >= 0; i--) {
                    var count = 0;
                    var password = list[i].querySelectorAll('input[type="password"]');
                    if (password.length == 1 || password.length > 1) {
                        var input = {};
                        input.login = get_login_idToRefill(list);

                        document.querySelector('#' + input.login).value = text;
                        var event = document.createEvent('Event');
                        event.initEvent('change', false, false);

                        var newselector2 = "";
                        if (document.querySelector('input[id="' + input.login + '"]') != null) {
                            newselector2 = document.querySelector('input[id="' + input.login + '"]');
                        } else {
                            newselector2 = document.querySelector('input[name="' + input.login + '"]');
                        }

                        newselector2.addEventListener('change', function(e) {}, false);
                        newselector2.dispatchEvent(event);
                        var selecSubmitButtons = document.querySelectorAll('input[type="submit"]');
                        for (var p = 0; p < selecSubmitButtons.length; p++) {
                            var btn = list[i].querySelectorAll('input[type="submit"]')[p];
                            if (btn.form.querySelector('input[type="password"]')) {
                                btn.disabled = false;
                            }
                        }
                    }
                };
            }
        }


    } else {
        for (var i = 0; i < g_input_pass_and_login.length; i++) {
            set_text_to_element('input[id="' + g_input_pass_and_login[i].login + '"]', text, g_input_pass_and_login[i].login_value);
            set_text_to_element('input[name="' + g_input_pass_and_login[i].login + '"]', text, g_input_pass_and_login[i].login_value);
        }
    }
    ///// NEWLY ADDED //////////
    if (!isset_selector(selector)) {
        setTimeout(function() {
            var loginId = "";
            var passwordId = "";
            var iframes = document.querySelectorAll('iframe');
            if (iframes.length > 0) {

                for (var j = 0; j < iframes.length; j++) {
                    try {
                        updateURL();
                        var checkFrame = iframes[j].contentDocument || iframes[j].contentWindow.document;
                        if (checkFrame.querySelectorAll('form[method="post"]').length > 0) {
                            var list = document.querySelectorAll('form[method="post"]');
                            if (list.length == 0) {
                                list = document.querySelectorAll('form');
                            }
                            if (list.length > 0) {

                                for (var i = list.length - 1; i >= 0; i--) {
                                    var count = 0;
                                    var password = list[i].querySelectorAll('input[type="password"]');
                                    if (password.length == 1 || password.length > 1) {
                                        var input = {};
                                        input.login = get_login_idToRefill(list);
                                        loginId = input.login;
                                    }

                                    var selecSubmitButtons = list[i].querySelectorAll('input[type="submit"]');
                                    for (var p = 0; p < selecSubmitButtons.length; p++) {
                                        var btn = list[i].querySelectorAll('input[type="submit"]')[p];
                                        if (btn.form.querySelector('input[type="password"]')) {
                                            btn.disabled = false;
                                        }
                                    }
                                };
                            }
                        } else {
                            break;
                        }
                    } catch (e) {

                    }

                }
            }
            var list = document.querySelectorAll('form[method="post"]');
            if (list.length == 0) {
                list = document.querySelectorAll('form');
            }
            if (list.length > 0) {

                for (var i = list.length - 1; i >= 0; i--) {
                    var count = 0;
                    var password = list[i].querySelectorAll('input[type="password"]');
                    if (password.length == 1 || password.length > 1) {
                        var input = {};
                        input.login = get_login_idToRefill(list);
                        loginId = input.login;
                    }
                };
            }
            var default_val = "";
            for (var i = 0; i < g_input_pass_and_login.length; i++) {
                if (g_input_pass_and_login[i].login == selector)
                    default_val = g_input_pass_and_login[i].login_value;
            }
            set_text_to_element('input[id="' + loginId + '"]', text, default_val);
            set_text_to_element('input[name="' + loginId + '"]', text, default_val);
            g_input_login = selector;
            //var selecSubmitButtons = list[i].querySelectorAll('input[type="submit"]');
            //for (var p = 0; p < selecSubmitButtons.length; p++) {
            //    var btn = list[i].querySelectorAll('input[type="submit"]')[p];
            //    if (btn.form.querySelector('input[type="password"]')) {
            //        btn.disabled = false;
            //    }
            //}

        }, 50);
    }
}



// Get text for element by selector
function get_text_to_element(selector) {
    var element = document.querySelector('input[id="' + selector + '"]');
    if (!element) {
        element = document.querySelectorAll('input[name="' + selector + '"]');
        for (var i = 0; i < element.length; i++) {
            if (element[i].value != "") return element[i].value;
        }
    }
    if (element) {
        return element.value;
    }
    return "";
}

// Sets element's value by selector
function set_text_to_element(query, text, default_val) {
    var elements = document.querySelectorAll(query);
    if (elements.length) {
        for (var i = 0; i < elements.length; i++) {
           if ((elements[i].value == "") || (elements[i].value == default_val)){
				if(eventPerformed<=6){
			        elements[i].focus();
                    elements[i].value = text;
                   
                    simulate(elements[i], "change", {});
                    simulate(elements[i], "input", {});
                   
                    elements[i].blur();	
			}}
        }
    }
}

// Shows card with logins and passwords for a page
function get_card_to_page() {
    
    var card = {};
    for (var i = 0; i < g_input_pass_and_login.length; i++) {
        if (get_text_to_element(g_input_pass_and_login[i].login) != undefined && get_text_to_element(g_input_pass_and_login[i].login) != "") {
            card.password = get_text_to_element(g_input_pass_and_login[i].password);
            card.login = get_text_to_element(g_input_pass_and_login[i].login);

            //if (card.password == g_input_pass_and_login[i].password_value)
            //{ continue; }
            card.webpassword = g_input_pass_and_login[i].password;
            card.webuser = g_input_pass_and_login[i].login;

            if (card.webuser == "") {
                card.webuser = "!";
            }
            if (card.webpassword == "") {
                card.webpassword = "!";
            }
            return card;
        }
    }
    return {};
}


// Apply card with logins and passwords for a page
function set_card_to_page(card) {

    browser.runtime.sendMessage({ name: "get_selectors_for_website", url: document.URL }, function(response) {

        set_to_page_password(card.Password, response.selector.WebPassword_ID);
        set_to_page_login(card.UserName, response.selector.WebUser_ID);
    });
}

// Check if the form has an element for login input
function get_login_id(list) {
    for (var j = 0; j < list.length; j++) {
        for (var i = 0; i < selectors_login.length; i++) {
            var elem = "";
            var lisOfElem = list[j].querySelectorAll(selectors_login[i]);
            if (lisOfElem.length > 1) {
                for (var p = 0; p < lisOfElem.length; p++) {
                    if (lisOfElem[p].value != "") {
                        elem = lisOfElem[p];
                    }
                }
            } else {
                elem = list[j].querySelector(selectors_login[i]);
            }
            if (elem && elem.style.display != "none") {
                if (list.length > 1) {
                    var checkHidden = elem.currentStyle ? elem.currentStyle.display :
                        getComputedStyle(elem, null).display;
                    if (elem.id && elem.value != "" && (elem.value != elem.placeholder) && elem.type != "submit" && elem.type != "hidden" && checkHidden != "none") {
                        return (elem.id);
                    } else if (elem.name && elem.value != "" && (elem.value != elem.placeholder) && elem.type != "submit" && elem.type != "hidden" && checkHidden != "none") {
                        return (elem.name);
                    }
                } else {
                    if (elem.id && elem.type != "submit") {
                        return (elem.id);
                    } else if (elem.name && elem.type != "submit") {
                        return (elem.name);
                    }
                }
            }

        }
    }
    return "";
}

//get login Id in case to refilling the form

//function get_login_idToRefill(list) {
//    for (var j = 0; j < list.length; j++) {
//        for (var i = 0; i < selectors_login.length; i++) {
//            var elem = list[j].querySelector(selectors_login[i]);
//            if (elem && elem.style.display != "none") {
//                if (elem.currentStyle ? elem.currentStyle.display :
//                          getComputedStyle(elem, null).display != "none") {
//                    if (elem.id) {
//                        return (elem.id);
//                    } else if (elem.name) {
//                        return (elem.name);
//                    }
//                }
//            }
//        }
//    }
//    return "";
//}
function get_login_idToRefill(list) {
    for (var j = 0; j < list.length; j++) {
        for (var i = 0; i < selectors_login.length; i++) {
            var elem = "";
            var lisOfElem = list[j].querySelectorAll(selectors_login[i]);
            if (lisOfElem.length > 1) {
                for (var p = 0; p < lisOfElem.length; p++) {
                    if (lisOfElem[p]) {
                        elem = lisOfElem[p];
                    }
                }
            } else {
                elem = list[j].querySelector(selectors_login[i]);
            }
            if (elem && elem.style.display != "none") {
                if (elem.currentStyle ? elem.currentStyle.display :
                    getComputedStyle(elem, null).display != "none") {
                    if (elem.id) {
                        return (elem.id);
                    } else if (elem.name) {
                        return (elem.name);
                    }
                }
            }
        }

    }
    return "";
}


// Check element's existance
function isset_elem_input(elem) {

    for (var i = g_input_pass_and_login.length - 1; i >= 0; i--) {
        if ((g_input_pass_and_login[i].login == elem.login) && (g_input_pass_and_login[i].password == elem.password)) {
            return true;
        }
    }

    return false;
}

function updateURL() {
    if (history.pushState) {
        var newurl = "https:" + "//" + window.location.host + window.location.pathname;
        if (newurl != window.location) {
            e.preventDefault();
            window.history.pushState({ path: newurl }, '', newurl);
        }
    }
}

function saveHiddenPassword(list) {

    //var list = document.querySelectorAll('form[method="post"]');
    setPassowrd = document.querySelector('input[type="password"]').value;
    var cardPassword = "";
    var password = document.querySelectorAll('input[type="password"]');
    if (password.length == 1 || password.length > 1) {
        for (var j = 0; j < password.length; j++) {
            var input = {};
            input.password = password[j].id;
            if (input.password == "") {
                input.password = password[j].name;
            }
            setPassowrd = get_text_to_element(input.password);
            input.password_value = setPassowrd;
            setPassowrd = input.password_value;
            cardPassword = input.password;
            if (input.password_value != "") {
                break;
            }

        }
    }
    var card = get_card_to_page();
    card.login = setLoginValue;
    if (card.login == "" || card.login == undefined) {
        var username = get_login_id(list);
        var usernamevalue = get_text_to_element(username);
        card.login = usernamevalue;
        card.webuser = username;
    }
    if (setPassowrd != "" || card.password != undefined) {
        card.password = setPassowrd;
        card.url = get_url(document.URL);
        card.title = document.domain;
        card.description = document.title;
        card.webpassword = cardPassword;
        browser.runtime.sendMessage({ name: "preload_set_pass_and_login", card: card }, function(response) {});

    }
}

// Fetch from the page all forms that are similar to auth forms
function get_id_login_and_password() {
  
    var iframes = document.querySelectorAll('iframe');
    if (iframes.length > 0) {

        for (var j = 0; j < iframes.length; j++) {
            try {
                updateURL();
                var checkFrame = iframes[j].contentDocument || iframes[j].contentWindow.document;
                if (checkFrame.querySelectorAll('form[method="post"]').length > 0) {
                    var list = document.querySelectorAll('form[method="post"]');
                    if (list.length == 0) {
                        list = document.querySelectorAll('form');
                    }
                    if (list.length > 0) {

                        for (var i = list.length - 1; i >= 0; i--) {

                            var password = list[i].querySelectorAll('input[type="password"]');
                            if (password.length == 1 || password.length > 1) {
                                for (var k = 0; k < password.length; k++) {
                                    var input = {};
                                    input.password = password[k].id;
                                    if (input.password == "") {
                                        input.password = password[k].name;
                                    }
                                    setPassowrd = get_text_to_element(input.password);
                                    input.password_value = setPassowrd;
                                    setPassowrd = input.password_value;
                                    if (input.password_value != "") {
                                        break;
                                    }
                                }
                                input.login = get_login_id(list);
                                input.login_value = get_text_to_element(input.login);
                                setLoginValue = input.login_value;
                                if (window.location.href.indexOf('hootsuite') > -1) {
                                    if (!isset_elem_input(input) && input.login_value != "" && input.password_value != "") {
                                        g_input_pass_and_login.push(input);
                                    }
                                } else if (!isset_elem_input(input)) {
                                    g_input_pass_and_login.push(input);
                                }
                                list[i].addEventListener('submit', function() { saveHiddenPassword(list); });
                            }
                        };
                    }
                } else {
                    break;
                }
            } catch (e) {

            }

        }
    }
    var list = document.querySelectorAll('form[method="post"]');
    if (list.length == 0) {
        list = document.querySelectorAll('form');
    }
    if (list.length > 0) {

        for (var i = list.length - 1; i >= 0; i--) {
            var count = 0;
            var password = list[i].querySelectorAll('input[type="password"]');
            if (password.length == 1 || password.length > 1) {
                for (var j = 0; j < password.length; j++) {
                    var input = {};
                    input.password = password[j].id;
                    if (input.password == "") {
                        input.password = password[j].name;
                    }
                    setPassowrd = get_text_to_element(input.password);
                    input.password_value = setPassowrd;
                    setPassowrd = input.password_value;
                    if (input.password_value != "") {
                        break;
                    }
                }
                input.login = get_login_id(list);
                input.login_value = get_text_to_element(input.login);
                setLoginValue = input.login_value;
                if (window.location.href.indexOf('hootsuite') > -1) {
                    if (!isset_elem_input(input) && input.login_value != "" && input.password_value != "") {
                        g_input_pass_and_login.push(input);
                    }
                }
				else if (window.location.href.indexOf('google') > -1) {
                    if (!isset_elem_input(input) && input.login_value != "" && input.password_value != "") {
                        g_input_pass_and_login.push(input);
                    }
                }

				else if (!isset_elem_input(input)) {
                    g_input_pass_and_login.push(input);
                }
                list[i].addEventListener('submit', function() { saveHiddenPassword(list); });
            }
        };
    }

}


// Load all forms and cards for a site
function fill_password(callback) {
    get_id_login_and_password();
    browser.runtime.sendMessage({ name: "get_card_for_website", url: document.URL }, function(response) {

        if (response != undefined) {
            if (response.card) {
                g_card = response.card;
                callback(response.card);
            }
        }
    });
}

// Prepare url to valid format
function get_url(str) {
    var length = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] == "/") length++;
        if (length == 3) return str.substr(0, i + 1)
    }
}

// Create a panel that suggests to save password
function create_overlay() {

    if (is_overlay) return;
    var text = '<style type="text/css">.Logo {float: left !important; padding-top: 7px !important; padding-left: 7px !important;} .Message {margin-top: 0px !important; float: right !important; padding-right: 15px !important;} .SaveButton {margin-top: 0px !important; float: right !important; cursor: pointer !important; padding-right: 0px !important; }</style>';
    text += '<img alt="" class="Logo" src="data:image/png;base64,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/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAl5QTFRF4+Pl4+Tl5OTl5OTm5OXl5OXm5ebn5ubm5ufo5+fo5+fp6Ojp6+vs6+zt7Ozt7e7u7e7v7u/v7/Dx8PHx8fHy8/Pz8/P08/T09PT19PX19fX1+Pj5+Pn5+fn5+fr5+fr6+vr6/Pz8/P38/f39/f7+/v79/v7+////////5ebn////5OXm9fX25OTm5OXl5OXm5Obm5eXn5ebm5ebn////////////////////////7u/w/////v7+////9PT0+Pj5/Pz8////////6Ojp/////////////////v7+////9fX1////7+/v////////8/T0+Pj5/P38////////6Ojp/////////v7+/////////////////////v7+////+Pj5/v7+/////////////////////v7+/////////////v7+////+Pj5////////0dLU/////////v7+/////////v7+0dPU/////////Pz8/v7+////////9fX1/v7+/////Pz8/////////////v7+/////////////////v7+////////////7u7v9PT0+Pn5/Pz8////6enq////////4OHi4OHi////4OHi/////v7+4ODi////////////////////4OHi////0NDS////z9DS////////7+/w9PT1+Pn5/fz8/v7+////6enq////////6enq7u/v9PT0+fn5/Pz8////0NDS////z9HS0NDS0NHS////////////////4OHi6enq7u/v9PT0+Pj5+Pn4/Pz8/Pz9/v7+////VvTsXQAAAMB0Uk5TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEDAwQEBQUFBQUFBQUICQoLDQ8PEBESEhISExYYGhscICMlJScnKCkpKSkqLS0vMDEzNzg5QEJEUFBUVVhdYGFpb3Byc3N1dnh9f4KEj5CVnZ+fqKmrr7O0t7i5v7/Dx8vP0NHU1dXV1dXW1tfZ2trd3t/h5Ofo6err6+zs7e3u7+/v7+/v8PHy8/Pz8/Pz9PT19fX1+vv9GPc1GQAABV1JREFUWMPVmOd33EQQwM8mRyd0CAQIZ4NEN3AhpqwBQ0hECx3R1ogAwoi+IIoAUbKBKPQOAkK3KWscWgAHSOja/4qZ3VW5Zngvj+fn/WCNpNXu/GZmZ+Zcu+md6Y2dY/r92+z5OWqvyp+6AG2SG3p8YP2vg1DqbtsKtVfktaNqjIyMluPcH6bnBIhmGd9GoJfk+V3UPmXTVC7CHmrwgMwToEu14nffWgEa7QTKMkHnBijk3cPQ5/4sQCdvWN8TKGWMxQKInLkAIllGu05OMjYL0I3ylwvxuqwLEMcrSbOMzQWQ3wPIyWYFelLKO+Cy/NlVPYBsXwmwaZTgkTLupui6NPZJixxzrRfjPFQC55GaHYFZkpCYkIkswoRGYLAo9xwD5OA8wQMHZuEXXK/nx/g4VnyUw17w3NUvQKXYqwBd9bOU646y7Tvlvb2AtIAG00NpyPI72iJHxqoYp8bykTa2Po2u+ZagbWIVPmqEGsgTZiIrF4XHUS77asVi4+JFVAI9IKXccqW9dL18a7gHkGc8JBJGKe7jKrcLH+6SpFX2dTi4mZ6GaoESsIKAb2F7QfRDDm5AXzP1xuOZBsLopjSIM2JRBjcRHGK1XBxQGisjOQwmc3gOTgQzJD5FVwYIdBkoe9aHcu27cty+DrhW9zhDYMQAgRydepTKtBLHVZloxVjG9cmFzYnSkxrXRMa7iY4+Yd5w/V3LSeLlGXJMMlAPWL4fWDLFZYjIUlWHVo6N3Sfl1Y/INfaDAPTY2NgVp7UAJZQqQwlSJgWtvpuHj9Uq46ZE5aEwS5SGiZqQ5LhCa5SSfDH9xtMoQjm0E0gP1gYUoGcsHXkuAJ1zD1DIdUfcLKeveU9O4M1TJ23sVodcXYcI9RmL9HJJfhjbZHCgh4p7PpJ5anJQuJCrQASNwkLFwthcfw1BRDqBHBowxtuAIh2T+gUArRyfnJz4+AZ7xbR8Q25Z/czE5OTDyzqBROSoTsGNs+LEAhyGfZYqe1ZlisoijIPGDnMAVtWxvC8lE2yh2pGRViAvqWaC4iOelQOBVi3F7g10fQJ887Q9DDfDIx0h55hbV+BZ9GhhbqoAk3ZZwCVGMYHzkuQh9l+BIG9johNOFQhzZKSTSjuQ9hCmiLL1se1bAGjc7lVYzYjNMpUU4GDWDNpkmAdQDI2dWjoJdAm5diBSpgOsUCqjF0CizCktQDGGd2cvZ9srpuTU8n8DEuq0V7XRqsZtMpjTV2pTJfhW16TArK5JocwyFaDic96ZFKIS6MW/LxkYOPywwcZgo/H4Xw81BgYtq9E487svegClurCoRgguRZaKW2R9vME3KopiY4SkI23nNhF6VTQ2L9KzpYFyBzimSLvmDAV5TnFMsUO1rNoLf1y8+JB9d9xhlwOWHHT7n9cffOj+O++9ZPEZ337eAwhCKoETlGamDmGp8xN0QVU2OS8ySuZHrCysTisQFtagLKwZ1m4vLiIVd1RlLKY0FAbIVYXcd/TXIXzAEmbVnv/9okV71fsW9NX3WHTeo8fst7C/1rfngad/81kPINd0JV5qCmvRdNCWnkglKs9ERK54R+uTAxGTv6Da68KqR2LqpW59/PxXTFmFDVtYJt7ac79dsLDeX19Qr/fttPs+u23fV9+u3r/rqV9/WhBAf1n9xYppW8SuFWDLQgKO7VqMPqnKqnnkXAWak3eQedNZNqflDxrClP2hmw3zJhR/UuqzpHY0aTuNiBXp9QhmQu4UTW/GQ8eqvfzr5ccPNZsnNpvN444+cgjEE5pDx5791Zfz9Z8kr219+/XO8ebWD+Yr0F0ffT+zGYb6s/nHGS3OfHL/PAX6B66hObMiGGVVAAAAAElFTkSuQmCC" />';
    text += '<img alt="" class="SaveButton" id="HidePanel" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAmCAMAAACPg1dAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4OTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3MjY1NjQyOTc3RjExMUU3OTcwQ0YzNEVBQjM0OTg0RCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MjY1NjQyODc3RjExMUU3OTcwQ0YzNEVBQjM0OTg0RCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzOTI4NzVFRTQ3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg5ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2oT//QAAAQtQTFRFNTc9Njg+ODpAOTtBOjxCOz1DPD5EPT9FPkBGQEFIQEJIQURKREZMRUdNR0lPSEpQS01RTlBWU1VbVllfV1pfXl9jYmZsZWlvaGtybW50bnB2b292b3Bzb3F3cHR6cXF3cnN5d3h/fn+CiIqQiIuQiYyRioySio6SjY2QjpGWj4+Vj5GYkJKYkJKZmpudnJ2kn6KnoKCooKGooKKooaKpoqOqoqSqo6SrpKWspKespaitpaiup6iqqKqwqKuwqKyxq66zr7K4sLK4sbO0srO4s7C3tLS1vsDGv8DBy8vMz8/V0NLY1Nbc1tTa1tbX2NTb2Nrg2trg2tvi3N7k3+Hn4eHh6+vr9fX1////G7UUdQAAAUpJREFUSMftlNdWhDAQhodVF+ysihUb9hbrYou7VgQLNhLy/k/ihIWV4405Kzd6+G8yGch3/pmBwA0Ur5JZMkvmn2DuHtTdOupof2ekKGaU6eN9ujDm1oBmGHq19/xx9vurluiQudzXCvYe5ttJwoUIrc6Zay1m5ex5IcvRmIAZ+L9maoubY7XJwSSOnVzt0nOAq80FM3FhQvhKTK2rW9dhKroYlqfjXD8tQcBiFCCgQAkAR/ucqDBr2fSvcOPwHNOTptYZgB9C9owGKsyhxvVlo3kfPW3Lc3mfPs1IXuybQIRUqNZPqBowfrdawcjM97PtE4Vjc5jKjFbSGW3cTvSP9iSxx52kVsl0ZD85muU2eFgzhmZAf2AupT5PX+bg62PC+ux07hh7MicEs1pzD0zFf/P1baawO+TQPTlGuQXeIeU9XzJL5v9lfgL7okpxnmyGIAAAAABJRU5ErkJggg==" onmouseover="this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAmCAMAAACPg1dAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4OTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RDczOTg2RDc3RjExMUU3ODlGMDlEMDIyRTFEODYyNiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RDczOTg2Qzc3RjExMUU3ODlGMDlEMDIyRTFEODYyNiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzOTI4NzVFRTQ3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg5ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HVtKOgAAAQ5QTFRFSk5XS09YTFBZTVFaTlFaTlJbT1NcUFRdUVVeUlVeUlZfU1dgVFhhVFliV1tkWFxkWl5mW19nXF9nYGNsYGRsZGhxZmt0aGx0bG91cXZ/c3qBd3uEe32De32GfH+IfX+HfYCIfoCIfoOLf4KKhIaPiIqPk5aek5edlJielZeblZeflZmfmJyimZqimZykmpykmpylmp2loqOnpKaup6qxp6uxqKmxqKqyqauyqauzqqy0q621rK+1rLC2rq+yr7G4r7K5r7O5sbO0sbW7tbm/t7m/uLa+ubq9wsXLxMXHzs/R0dLY0tTa1dfd2Nbc2dbd2dnb2dvh2tvi29vh3N7k3+Hn4+Pk7O3t9vb2////Ej/4jwAAAUxJREFUSMftlNlSgzAUhg9uxdYVraLiLu4rarXVplWrSNxwgZD3fxFPKFTGm2YqN87kv8nPgXxzlhC4hfylmIqpmP+CeXpWrVVRl5Xjcl7MINXXx1JuzMMxrTisF0r155Xfn5q8R+ZWqW3On1Y7QYdx7pu9M/dG4rWv/rqexkjkgEG9PzO1jYPZ6YXx2Ed2pnaRM8XVYjw0cAk596SY2sCgrsNi0JgUu6NMP03ugBkSAEqAOAAM02eODHMqnX4LH2yWYboiqZ0QwPMhfUeoDHOi2bpr3jwGL0diXzZPj6QkN/IMcLiQL9dPKBRh7mG3H52R7WcnTxSOzQ5lZrSdzGj/fn50Zij2LrPjWgXTFv1kmCyzwMWa0RqUdGFuJufz+m0Nfg4T1mclc0fvihjnodmeOzUk/833z+Xc7pCL2lVNqHJSVneyYiqmYnbTNxUQTGyQAJEfAAAAAElFTkSuQmCC&quot;" onmouseout="this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAmCAMAAACPg1dAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4OTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3MjY1NjQyOTc3RjExMUU3OTcwQ0YzNEVBQjM0OTg0RCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MjY1NjQyODc3RjExMUU3OTcwQ0YzNEVBQjM0OTg0RCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzOTI4NzVFRTQ3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg5ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2oT//QAAAQtQTFRFNTc9Njg+ODpAOTtBOjxCOz1DPD5EPT9FPkBGQEFIQEJIQURKREZMRUdNR0lPSEpQS01RTlBWU1VbVllfV1pfXl9jYmZsZWlvaGtybW50bnB2b292b3Bzb3F3cHR6cXF3cnN5d3h/fn+CiIqQiIuQiYyRioySio6SjY2QjpGWj4+Vj5GYkJKYkJKZmpudnJ2kn6KnoKCooKGooKKooaKpoqOqoqSqo6SrpKWspKespaitpaiup6iqqKqwqKuwqKyxq66zr7K4sLK4sbO0srO4s7C3tLS1vsDGv8DBy8vMz8/V0NLY1Nbc1tTa1tbX2NTb2Nrg2trg2tvi3N7k3+Hn4eHh6+vr9fX1////G7UUdQAAAUpJREFUSMftlNdWhDAQhodVF+ysihUb9hbrYou7VgQLNhLy/k/ihIWV4405Kzd6+G8yGch3/pmBwA0Ur5JZMkvmn2DuHtTdOupof2ekKGaU6eN9ujDm1oBmGHq19/xx9vurluiQudzXCvYe5ttJwoUIrc6Zay1m5ex5IcvRmIAZ+L9maoubY7XJwSSOnVzt0nOAq80FM3FhQvhKTK2rW9dhKroYlqfjXD8tQcBiFCCgQAkAR/ucqDBr2fSvcOPwHNOTptYZgB9C9owGKsyhxvVlo3kfPW3Lc3mfPs1IXuybQIRUqNZPqBowfrdawcjM97PtE4Vjc5jKjFbSGW3cTvSP9iSxx52kVsl0ZD85muU2eFgzhmZAf2AupT5PX+bg62PC+ux07hh7MicEs1pzD0zFf/P1baawO+TQPTlGuQXeIeU9XzJL5v9lfgL7okpxnmyGIAAAAABJRU5ErkJggg==&quot;" />';
    text += '<img alt="" class="SaveButton" id="PanelIgnoreSite" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAmCAMAAAB+iAzNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4QTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRkNGMTIxRjc4MDMxMUU3OTQwOUFERTg1OTZEMjM5MSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRkNGMTIxRTc4MDMxMUU3OTQwOUFERTg1OTZEMjM5MSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU5QTEzRjJCRkI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhBODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+OyB63wAAAL1QTFRFNTc9NzpAOjxCPD9FQEJHQkVKRUdNR0pPSkxSS01RTE9UV1pfWlxjXV9lXl9jYGFoYmRqZWZtamxyb3BzcHF3dXZ9enyCfH+Efn+CgIGHh4mPioySjY2QjpKYkpSalJecl5mgmpudnJ6kp6iqp6mvqayyrK60rrG3sbO0srO6tLS1tLa8t7i/vL7EvsHHv8DBw8bMx8jPyczRy8vMzM3UztHW0tPa1tbX19je3N3j3+Hn4eHh6+vr9fX1////4Nid/wAAAWRJREFUSMft1V9PE0EUh+G3thaXytayVBZE7DKAUMBRaik9s/P7/h/Li9rsxia2id0Lk51kksm5eHKS82e4o8HT4i3e4v8h3m0Sv/zZIH772BB+NIL5ZHDcAN45X47p2enQJm/WsUWxH7x/b8+HvLfhwXf7drhf/MPc7t/CqfXo3tjrSYUnQZJS/DSozICilGaA91EZWZD8FtzssgNM5gDnS6vw6YIsZuBV4AOkKkiDAx9zoPSkZbEFX44BHr4CjF5r+Pp6B5lg6oGLsAqQl4Cb/R0/W9pVB16+rBL/XOF+QRbzlZWqZnoHFJKkxZaCDp7tqd+3Md1rexnVCuqj5KjwPzIPO7Vi79rGIxswtIeDeiuWF6v3Gs9VkJbuN07pSGZu+xB9PDmzLkefOtRxJym6CqeI0pQ1ngVpluwy/lc/NkJJzCFX8u+75elmE1cOLu5hcfXebcacpJC331yLt3iL73J+AR7BNIxAKHReAAAAAElFTkSuQmCC" onmouseover="this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAmCAMAAAB+iAzNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4QTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCODJEQkNCRTc4MDMxMUU3OTczMUEwODlGM0E3NTk4NiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCODJEQkNCRDc4MDMxMUU3OTczMUEwODlGM0E3NTk4NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU5QTEzRjJCRkI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhBODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+hTx1VAAAAL1QTFRFSk5XTFFaT1NbUFVeU1dgVVpiWFxlWl5mXF9nXWBpXmNraGx0a253bG91bXF4b3J7cXV9dHd/eXuEe32DfYCIgoWNh4mRiIqPiIyTi46VkpWdlZeblZifmJykm56lnaGooKOroqOnpaevrq+yrrG4sLO6sbO0s7W7tLe+t7nBubq9ubzCvL7FwcLKwsXMxMXHx8rQysvTy8/Uzs/Rz9DX0NPZ09Xc2Nnf2dnb3d7k3+Hn4+Pk7O3t9vb2////fquqgwAAAWRJREFUSMft1V1vEkEUxvE/gnQtbpFu6fZFK9tpq6W2o0VaOLPzfP+P5QWS3UgiJLIXJjvJJJNz8ctJzstwR4OnxVu8xf9DvNskfvWzQfzLt4bwoxHMJ4PjBvDOxXJMz86GNnmzji2K/eD9e3s+5L0ND77b0+F+8Q9zu38LZ9aje2uvJxWeBElK8dOgMgOKUpoB3kdlZEHyW3Czqw4wmQNcLK3CpwuymIFXgQ+QqiANDnzMgdKTlsUWfDkGePgKMHqt4evrHWSCqQcuwypAXgJu9nf8fGnXHXj5vEr8U4X7BVnMV1aqmukdUEiSFlsKOni2x37fxnRv7GVUK6iPkqPC/8g87NSKvRsbj2zA0B4O6q1YXq7eazxXQVq63zilI5m57UN0enJuXY4+dqjjTlJ0FU4RpSlrPAvSLNll/K9/bISSmEOu5N93y+PtJq4cXNzD4uq924w5SSFvv7kWb/EW3+X8AucfNDiDf5RDAAAAAElFTkSuQmCC&quot;" onmouseout="this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAmCAMAAAB+iAzNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4QTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRkNGMTIxRjc4MDMxMUU3OTQwOUFERTg1OTZEMjM5MSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRkNGMTIxRTc4MDMxMUU3OTQwOUFERTg1OTZEMjM5MSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU5QTEzRjJCRkI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhBODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+OyB63wAAAL1QTFRFNTc9NzpAOjxCPD9FQEJHQkVKRUdNR0pPSkxSS01RTE9UV1pfWlxjXV9lXl9jYGFoYmRqZWZtamxyb3BzcHF3dXZ9enyCfH+Efn+CgIGHh4mPioySjY2QjpKYkpSalJecl5mgmpudnJ6kp6iqp6mvqayyrK60rrG3sbO0srO6tLS1tLa8t7i/vL7EvsHHv8DBw8bMx8jPyczRy8vMzM3UztHW0tPa1tbX19je3N3j3+Hn4eHh6+vr9fX1////4Nid/wAAAWRJREFUSMft1V9PE0EUh+G3thaXytayVBZE7DKAUMBRaik9s/P7/h/Li9rsxia2id0Lk51kksm5eHKS82e4o8HT4i3e4v8h3m0Sv/zZIH772BB+NIL5ZHDcAN45X47p2enQJm/WsUWxH7x/b8+HvLfhwXf7drhf/MPc7t/CqfXo3tjrSYUnQZJS/DSozICilGaA91EZWZD8FtzssgNM5gDnS6vw6YIsZuBV4AOkKkiDAx9zoPSkZbEFX44BHr4CjF5r+Pp6B5lg6oGLsAqQl4Cb/R0/W9pVB16+rBL/XOF+QRbzlZWqZnoHFJKkxZaCDp7tqd+3Md1rexnVCuqj5KjwPzIPO7Vi79rGIxswtIeDeiuWF6v3Gs9VkJbuN07pSGZu+xB9PDmzLkefOtRxJym6CqeI0pQ1ngVpluwy/lc/NkJJzCFX8u+75elmE1cOLu5hcfXebcacpJC331yLt3iL73J+AR7BNIxAKHReAAAAAElFTkSuQmCC&quot;" />';
    text += '<img alt="" class="SaveButton" id="PanelAddSite" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAAmCAMAAADzyYncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ODgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMkNBQzM2RDc3RTkxMUU3QkFDMUJDMzAwM0UxQjJCRCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMkNBQzM2Qzc3RTkxMUU3QkFDMUJDMzAwM0UxQjJCRCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM4NTUxMDMwREI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg4ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Gb068gAAAJxQTFRFNTc9NzpAOjxCPD9FQkVKR0pPSkxSS01RV1pfWlxjXV9lXl9jYGFoZ2lwbG91b3BzdXZ9d3l/enyCfn+CjI6UjY2QjpKYlJecl5mgmpudnqKmpKatp6iqp6mvqayysbO0srO6tLS1tLa8t7i/vsHHv8DBx8jPyczRy8vMzM3UztHW1tbX19je2dzi3N3j3+Hn4eHh6+vr9fX1////sy4m4gAAAedJREFUWMPt1lt7lDAQgOGvx1ijxpauio5t0aWbbrQ5zP//b14AC3rR7qNWe5G5IQ8MyUsyAbjmuUUVVVEVVVEVVdFfE71axBlH5/9fFBexPl1fPQPRt49T3LzZro/+BUGbB0WbXfPifnsytb1qsg92K6qam6cRHbw+AA4+xO9n09k2Gbw8LOpBinkS0cv72/PD45sY387D+eFok6pAcWDU4JJqvxChdkqhV23BZU2GrgPJwz3GD3Npc1APvWp4fNUuYtzexnj5fnfWqTcAQXDqhhE85B6b21nU512KK8YG8IK0rAp4dUiAPhmkGKwGoM0Wv0cdvYsxxqvLuaRwXsNYR7nBFUgrmryYPlHV5HYpdhimDwAUZzQIXjBqgbTC6viI+1X25xjXR5vN8oIJGZqkqg3klS3QqqpqWKwac0oTUgt0pTfgZRXaRLETpB0budlTdPh1e8LPIqxiSjt0Il46aNIvlQ1zCji1AL6HVerEaJv47Tni+AVLURDoA0Ydog1YzQ7Igpm24CQaU6THFkd2dB6MZkcqAoRkkGxGkWRrHqvsu9Mp7mZRk1SDBVFNuQFCBnBJx5KfV21MGbecjO8xX0DUASYM9TaICKpdbvb9imyexZf2yyI+1b+RKqqiKqqiKqqiP4wfqSlNkmP8saQAAAAASUVORK5CYII=" onmouseover="this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAAmCAMAAADzyYncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ODgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxRDkwQzNCMzc3RTkxMUU3QTAyM0VBNzM4NkJCN0Q5NyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxRDkwQzNCMjc3RTkxMUU3QTAyM0VBNzM4NkJCN0Q5NyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM4NTUxMDMwREI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg4ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+v5VXGgAAAJxQTFRFSk5XTFFaT1NbUFVeVVpiWl5mXF9nXWBpaGx0a253bG91bXF4b3J7dnqCen6Ge32DgoWNhIePh4mRiIqPlZebl5qhmJyknaGooKOroqOnpqqwq662rq+yrrG4sLO6sbO0t7nBubq9ubzCvL7FwsXMxMXHysvTy8/Uzs/Rz9DX0NPZ2Nnf2dnb2dzi3d7k3+Hn4+Pk7O3t9vb2////FGd4yAAAAehJREFUWMPt1lt7lDAQgOGvp9TGQ2zZqujYFl266Rqbw/z//+YFsKAX7T5qtReZG/LAkLwkE4BrnltUURVVURVVURX9NdGrRZxxdP7/RXER69P11TMQffs4xc2b7froXxC0eVC02TUv7rcnU9urJvtgt6KquXka0cHrA+DgQ/x+Np1tk8HLw6IepJgnEb28vz0/PL6J8e08nB+ONqkKFAdGDS6p9gsRaqcUetUWXNZk6DqQPNxj/DCXNgf10KuGx1ftIsbtbYyX73dnnXoDEASnbhjBQ+6xuZ1Ffd6luGJsAC9Iy6qAV4cE6JNBisFqANps8XvU0bsYY7y6nEsK5zWMdZQbXIG0osmL6RNVTW6XYodh+gBAcUaD4AWjFkgrrI6PuF9lf45xfbTZLC+YkKFJqtpAXtkCraqqhsWqMac0IbVAV3oDXlahTRQ7QdqxkZs9RYdftyf8LMIqprRDJ+Klgyb9Utkwp4BTC+B7WKVOjLaJ354jjl+wFAWBPmDUIdqA1eyALJhpC06iMUV6bHFkR+fBaHakIkBIBslmFEm25rHKvjud4m4WNUk1WBDVlBsgZACXdCz5edXGlHHLyfge8wVEHWDCUG+DiKDa5Wbfr8jmWXxpvyziU/0bqaIqqqIqqqIq+sP4AX/FTXa0IQgJAAAAAElFTkSuQmCC&quot;" onmouseout="this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAAmCAMAAADzyYncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ODgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMkNBQzM2RDc3RTkxMUU3QkFDMUJDMzAwM0UxQjJCRCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMkNBQzM2Qzc3RTkxMUU3QkFDMUJDMzAwM0UxQjJCRCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM4NTUxMDMwREI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg4ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Gb068gAAAJxQTFRFNTc9NzpAOjxCPD9FQkVKR0pPSkxSS01RV1pfWlxjXV9lXl9jYGFoZ2lwbG91b3BzdXZ9d3l/enyCfn+CjI6UjY2QjpKYlJecl5mgmpudnqKmpKatp6iqp6mvqayysbO0srO6tLS1tLa8t7i/vsHHv8DBx8jPyczRy8vMzM3UztHW1tbX19je2dzi3N3j3+Hn4eHh6+vr9fX1////sy4m4gAAAedJREFUWMPt1lt7lDAQgOGvx1ijxpauio5t0aWbbrQ5zP//b14AC3rR7qNWe5G5IQ8MyUsyAbjmuUUVVVEVVVEVVdFfE71axBlH5/9fFBexPl1fPQPRt49T3LzZro/+BUGbB0WbXfPifnsytb1qsg92K6qam6cRHbw+AA4+xO9n09k2Gbw8LOpBinkS0cv72/PD45sY387D+eFok6pAcWDU4JJqvxChdkqhV23BZU2GrgPJwz3GD3Npc1APvWp4fNUuYtzexnj5fnfWqTcAQXDqhhE85B6b21nU512KK8YG8IK0rAp4dUiAPhmkGKwGoM0Wv0cdvYsxxqvLuaRwXsNYR7nBFUgrmryYPlHV5HYpdhimDwAUZzQIXjBqgbTC6viI+1X25xjXR5vN8oIJGZqkqg3klS3QqqpqWKwac0oTUgt0pTfgZRXaRLETpB0budlTdPh1e8LPIqxiSjt0Il46aNIvlQ1zCji1AL6HVerEaJv47Tni+AVLURDoA0Ydog1YzQ7Igpm24CQaU6THFkd2dB6MZkcqAoRkkGxGkWRrHqvsu9Mp7mZRk1SDBVFNuQFCBnBJx5KfV21MGbecjO8xX0DUASYM9TaICKpdbvb9imyexZf2yyI+1b+RKqqiKqqiKqqiP4wfqSlNkmP8saQAAAAASUVORK5CYII=&quot;" />';
    text += '<img alt="" class="Message" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPMAAAAlBAMAAABlv8I+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjgyNTlERTM3NzNCMTFFN0I0ODM4REUxRDg5QzQxQTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjgyNTlERTQ3NzNCMTFFN0I0ODM4REUxRDg5QzQxQTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2ODI1OURFMTc3M0IxMUU3QjQ4MzhERTFEODlDNDFBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2ODI1OURFMjc3M0IxMUU3QjQ4MzhERTFEODlDNDFBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoQnVuQAAAAwUExURTU3PUtNUV5fY29wc35/go2NkJqbnaeoqrS0tb/AwcvLzNbW1+Hh4evr6/X19f///yNJ93wAAAKLSURBVFjD7ZRBTxNRFIVP67RDp506P0Bpt0Zw5geYMj9A2u7FpGst4S21RmCnbqQ7FibSlS6tJkBwg2UBC0LA0FhjTDoJRJZtQ4KAwvPeN1TFxKQmJMQ4p01zm/NOv3fve1MgUKBAgQIF+k91p9eFcaE1v6hCHoke1ker9BH740pyGB0v94Q2C1mXi4L+4czQPXYN9E0qNIbS0eYhlRlE3nJFE2mzq2+EOlpzG4NTB5iRxG5KoUueVVSWMXzsqkBrD8opLu7RDtgBGq0lGJQYO8ClY2eECIk8J80ZLyrXfkEnCnZhgL6beUNw5aMjnrGrV013HHYtk+92PerwrJLua9R1L6ECubRyxspjVkywA3xynqIUamA7nr6vlVPOhMhYnDSXYLsThMr4A6f3Y9o+oFdSFlc+GlupeYNW2fQyRBe9rDZs8uTDbQ7cAy9SA0+6MaEc1DFkAdNoAKNpWrBaKamk6aLEA7f9a0Zd56ehbdBvdUrg6gT94mYxmdZbktCxH+g6dJpo+JnAuGyHO7fpJGQXbRKaHUZfTF+lAV/Zgb7q6K+2Os9VktDTCo0TtG35XWNuFlzFfPTIw1QRw459Cu13jdB7bTPcxvws7v68Zowmx+8aC0TB5QLoxuxVljunuh48QUcbyBUGebNFT1V6bYDRqc3EDm5ZL330BgPKeODkHOCGtRJ5Z7Qx6uGae91Vjo8mR531Ala0hlZLiLmIhzXxpKqShM65U93nJC6/CURb+1z3T6oqtL7PaMPTd8n20aH1CnChJfrkZxWqYvGwjf4yBfjcyPHR7AAfZQ3Zo3ksfkX22MWEMyTASULr8o0g/u9PXNI9o3+2+l8nsjg39KPzQwcKFCjQv6rv6OoFe6jiEfQAAAAASUVORK5CYII=" />';
    var body = document.body;

    var div = document.createElement("div");
    div.id = "SavePanelPopup";
    div.style.cssText = "left: 0px !important; top: 0px !important; width: 100% !important; height: 38px !important; visibility: visible !important; position: fixed !important; z-index: 9999999999 !important; border: 0px !important; color: #ffffff !important; text-align: right !important; background-color: #35373d !important;";
    div.className = "SavePanelPopup";

    //div.innerHTML += text;
    //div.appendChild( div );
    //div.innerHTML = text;

    // var parser = new DOMParser();
    // doc = parser.parseFromString(text, "text/html");
    // div.appendChild(doc.firstChild);


    var css = '.Logo {float: left !important; padding-top: 7px !important; padding-left: 7px !important;} .Message {margin-top: 0px !important; float: right !important; padding-right: 15px !important;} .SaveButton {margin-top: 0px !important; float: right !important; cursor: pointer !important; padding-right: 0px !important; }',
        style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    div.appendChild(style);

    var elem = document.createElement("img");
    elem.setAttribute("src", "data:image/png;base64,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/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAl5QTFRF4+Pl4+Tl5OTl5OTm5OXl5OXm5ebn5ubm5ufo5+fo5+fp6Ojp6+vs6+zt7Ozt7e7u7e7v7u/v7/Dx8PHx8fHy8/Pz8/P08/T09PT19PX19fX1+Pj5+Pn5+fn5+fr5+fr6+vr6/Pz8/P38/f39/f7+/v79/v7+////////5ebn////5OXm9fX25OTm5OXl5OXm5Obm5eXn5ebm5ebn////////////////////////7u/w/////v7+////9PT0+Pj5/Pz8////////6Ojp/////////////////v7+////9fX1////7+/v////////8/T0+Pj5/P38////////6Ojp/////////v7+/////////////////////v7+////+Pj5/v7+/////////////////////v7+/////////////v7+////+Pj5////////0dLU/////////v7+/////////v7+0dPU/////////Pz8/v7+////////9fX1/v7+/////Pz8/////////////v7+/////////////////v7+////////////7u7v9PT0+Pn5/Pz8////6enq////////4OHi4OHi////4OHi/////v7+4ODi////////////////////4OHi////0NDS////z9DS////////7+/w9PT1+Pn5/fz8/v7+////6enq////////6enq7u/v9PT0+fn5/Pz8////0NDS////z9HS0NDS0NHS////////////////4OHi6enq7u/v9PT0+Pj5+Pn4/Pz8/Pz9/v7+////VvTsXQAAAMB0Uk5TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEDAwQEBQUFBQUFBQUICQoLDQ8PEBESEhISExYYGhscICMlJScnKCkpKSkqLS0vMDEzNzg5QEJEUFBUVVhdYGFpb3Byc3N1dnh9f4KEj5CVnZ+fqKmrr7O0t7i5v7/Dx8vP0NHU1dXV1dXW1tfZ2trd3t/h5Ofo6err6+zs7e3u7+/v7+/v8PHy8/Pz8/Pz9PT19fX1+vv9GPc1GQAABV1JREFUWMPVmOd33EQQwM8mRyd0CAQIZ4NEN3AhpqwBQ0hECx3R1ogAwoi+IIoAUbKBKPQOAkK3KWscWgAHSOja/4qZ3VW5Zngvj+fn/WCNpNXu/GZmZ+Zcu+md6Y2dY/r92+z5OWqvyp+6AG2SG3p8YP2vg1DqbtsKtVfktaNqjIyMluPcH6bnBIhmGd9GoJfk+V3UPmXTVC7CHmrwgMwToEu14nffWgEa7QTKMkHnBijk3cPQ5/4sQCdvWN8TKGWMxQKInLkAIllGu05OMjYL0I3ylwvxuqwLEMcrSbOMzQWQ3wPIyWYFelLKO+Cy/NlVPYBsXwmwaZTgkTLupui6NPZJixxzrRfjPFQC55GaHYFZkpCYkIkswoRGYLAo9xwD5OA8wQMHZuEXXK/nx/g4VnyUw17w3NUvQKXYqwBd9bOU646y7Tvlvb2AtIAG00NpyPI72iJHxqoYp8bykTa2Po2u+ZagbWIVPmqEGsgTZiIrF4XHUS77asVi4+JFVAI9IKXccqW9dL18a7gHkGc8JBJGKe7jKrcLH+6SpFX2dTi4mZ6GaoESsIKAb2F7QfRDDm5AXzP1xuOZBsLopjSIM2JRBjcRHGK1XBxQGisjOQwmc3gOTgQzJD5FVwYIdBkoe9aHcu27cty+DrhW9zhDYMQAgRydepTKtBLHVZloxVjG9cmFzYnSkxrXRMa7iY4+Yd5w/V3LSeLlGXJMMlAPWL4fWDLFZYjIUlWHVo6N3Sfl1Y/INfaDAPTY2NgVp7UAJZQqQwlSJgWtvpuHj9Uq46ZE5aEwS5SGiZqQ5LhCa5SSfDH9xtMoQjm0E0gP1gYUoGcsHXkuAJ1zD1DIdUfcLKeveU9O4M1TJ23sVodcXYcI9RmL9HJJfhjbZHCgh4p7PpJ5anJQuJCrQASNwkLFwthcfw1BRDqBHBowxtuAIh2T+gUArRyfnJz4+AZ7xbR8Q25Z/czE5OTDyzqBROSoTsGNs+LEAhyGfZYqe1ZlisoijIPGDnMAVtWxvC8lE2yh2pGRViAvqWaC4iOelQOBVi3F7g10fQJ887Q9DDfDIx0h55hbV+BZ9GhhbqoAk3ZZwCVGMYHzkuQh9l+BIG9johNOFQhzZKSTSjuQ9hCmiLL1se1bAGjc7lVYzYjNMpUU4GDWDNpkmAdQDI2dWjoJdAm5diBSpgOsUCqjF0CizCktQDGGd2cvZ9srpuTU8n8DEuq0V7XRqsZtMpjTV2pTJfhW16TArK5JocwyFaDic96ZFKIS6MW/LxkYOPywwcZgo/H4Xw81BgYtq9E487svegClurCoRgguRZaKW2R9vME3KopiY4SkI23nNhF6VTQ2L9KzpYFyBzimSLvmDAV5TnFMsUO1rNoLf1y8+JB9d9xhlwOWHHT7n9cffOj+O++9ZPEZ337eAwhCKoETlGamDmGp8xN0QVU2OS8ySuZHrCysTisQFtagLKwZ1m4vLiIVd1RlLKY0FAbIVYXcd/TXIXzAEmbVnv/9okV71fsW9NX3WHTeo8fst7C/1rfngad/81kPINd0JV5qCmvRdNCWnkglKs9ERK54R+uTAxGTv6Da68KqR2LqpW59/PxXTFmFDVtYJt7ac79dsLDeX19Qr/fttPs+u23fV9+u3r/rqV9/WhBAf1n9xYppW8SuFWDLQgKO7VqMPqnKqnnkXAWak3eQedNZNqflDxrClP2hmw3zJhR/UuqzpHY0aTuNiBXp9QhmQu4UTW/GQ8eqvfzr5ccPNZsnNpvN444+cgjEE5pDx5791Zfz9Z8kr219+/XO8ebWD+Yr0F0ffT+zGYb6s/nHGS3OfHL/PAX6B66hObMiGGVVAAAAAElFTkSuQmCC");
    elem.setAttribute("alt", "");
    elem.setAttribute("class", "Logo");
    div.appendChild(elem);

    var elem2 = document.createElement("img");
    elem2.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAmCAMAAACPg1dAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4OTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3MjY1NjQyOTc3RjExMUU3OTcwQ0YzNEVBQjM0OTg0RCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MjY1NjQyODc3RjExMUU3OTcwQ0YzNEVBQjM0OTg0RCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzOTI4NzVFRTQ3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg5ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2oT//QAAAQtQTFRFNTc9Njg+ODpAOTtBOjxCOz1DPD5EPT9FPkBGQEFIQEJIQURKREZMRUdNR0lPSEpQS01RTlBWU1VbVllfV1pfXl9jYmZsZWlvaGtybW50bnB2b292b3Bzb3F3cHR6cXF3cnN5d3h/fn+CiIqQiIuQiYyRioySio6SjY2QjpGWj4+Vj5GYkJKYkJKZmpudnJ2kn6KnoKCooKGooKKooaKpoqOqoqSqo6SrpKWspKespaitpaiup6iqqKqwqKuwqKyxq66zr7K4sLK4sbO0srO4s7C3tLS1vsDGv8DBy8vMz8/V0NLY1Nbc1tTa1tbX2NTb2Nrg2trg2tvi3N7k3+Hn4eHh6+vr9fX1////G7UUdQAAAUpJREFUSMftlNdWhDAQhodVF+ysihUb9hbrYou7VgQLNhLy/k/ihIWV4405Kzd6+G8yGch3/pmBwA0Ur5JZMkvmn2DuHtTdOupof2ekKGaU6eN9ujDm1oBmGHq19/xx9vurluiQudzXCvYe5ttJwoUIrc6Zay1m5ex5IcvRmIAZ+L9maoubY7XJwSSOnVzt0nOAq80FM3FhQvhKTK2rW9dhKroYlqfjXD8tQcBiFCCgQAkAR/ucqDBr2fSvcOPwHNOTptYZgB9C9owGKsyhxvVlo3kfPW3Lc3mfPs1IXuybQIRUqNZPqBowfrdawcjM97PtE4Vjc5jKjFbSGW3cTvSP9iSxx52kVsl0ZD85muU2eFgzhmZAf2AupT5PX+bg62PC+ux07hh7MicEs1pzD0zFf/P1baawO+TQPTlGuQXeIeU9XzJL5v9lfgL7okpxnmyGIAAAAABJRU5ErkJggg==");
    elem2.setAttribute("onmouseover", "this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAmCAMAAACPg1dAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4OTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RDczOTg2RDc3RjExMUU3ODlGMDlEMDIyRTFEODYyNiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RDczOTg2Qzc3RjExMUU3ODlGMDlEMDIyRTFEODYyNiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzOTI4NzVFRTQ3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg5ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HVtKOgAAAQ5QTFRFSk5XS09YTFBZTVFaTlFaTlJbT1NcUFRdUVVeUlVeUlZfU1dgVFhhVFliV1tkWFxkWl5mW19nXF9nYGNsYGRsZGhxZmt0aGx0bG91cXZ/c3qBd3uEe32De32GfH+IfX+HfYCIfoCIfoOLf4KKhIaPiIqPk5aek5edlJielZeblZeflZmfmJyimZqimZykmpykmpylmp2loqOnpKaup6qxp6uxqKmxqKqyqauyqauzqqy0q621rK+1rLC2rq+yr7G4r7K5r7O5sbO0sbW7tbm/t7m/uLa+ubq9wsXLxMXHzs/R0dLY0tTa1dfd2Nbc2dbd2dnb2dvh2tvi29vh3N7k3+Hn4+Pk7O3t9vb2////Ej/4jwAAAUxJREFUSMftlNlSgzAUhg9uxdYVraLiLu4rarXVplWrSNxwgZD3fxFPKFTGm2YqN87kv8nPgXxzlhC4hfylmIqpmP+CeXpWrVVRl5Xjcl7MINXXx1JuzMMxrTisF0r155Xfn5q8R+ZWqW3On1Y7QYdx7pu9M/dG4rWv/rqexkjkgEG9PzO1jYPZ6YXx2Ed2pnaRM8XVYjw0cAk596SY2sCgrsNi0JgUu6NMP03ugBkSAEqAOAAM02eODHMqnX4LH2yWYboiqZ0QwPMhfUeoDHOi2bpr3jwGL0diXzZPj6QkN/IMcLiQL9dPKBRh7mG3H52R7WcnTxSOzQ5lZrSdzGj/fn50Zij2LrPjWgXTFv1kmCyzwMWa0RqUdGFuJufz+m0Nfg4T1mclc0fvihjnodmeOzUk/833z+Xc7pCL2lVNqHJSVneyYiqmYnbTNxUQTGyQAJEfAAAAAElFTkSuQmCC&quot;");
    elem2.setAttribute("alt", "");

    elem2.setAttribute("onmouseout", "this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAmCAMAAACPg1dAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4OTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3MjY1NjQyOTc3RjExMUU3OTcwQ0YzNEVBQjM0OTg0RCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MjY1NjQyODc3RjExMUU3OTcwQ0YzNEVBQjM0OTg0RCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzOTI4NzVFRTQ3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg5ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2oT//QAAAQtQTFRFNTc9Njg+ODpAOTtBOjxCOz1DPD5EPT9FPkBGQEFIQEJIQURKREZMRUdNR0lPSEpQS01RTlBWU1VbVllfV1pfXl9jYmZsZWlvaGtybW50bnB2b292b3Bzb3F3cHR6cXF3cnN5d3h/fn+CiIqQiIuQiYyRioySio6SjY2QjpGWj4+Vj5GYkJKYkJKZmpudnJ2kn6KnoKCooKGooKKooaKpoqOqoqSqo6SrpKWspKespaitpaiup6iqqKqwqKuwqKyxq66zr7K4sLK4sbO0srO4s7C3tLS1vsDGv8DBy8vMz8/V0NLY1Nbc1tTa1tbX2NTb2Nrg2trg2tvi3N7k3+Hn4eHh6+vr9fX1////G7UUdQAAAUpJREFUSMftlNdWhDAQhodVF+ysihUb9hbrYou7VgQLNhLy/k/ihIWV4405Kzd6+G8yGch3/pmBwA0Ur5JZMkvmn2DuHtTdOupof2ekKGaU6eN9ujDm1oBmGHq19/xx9vurluiQudzXCvYe5ttJwoUIrc6Zay1m5ex5IcvRmIAZ+L9maoubY7XJwSSOnVzt0nOAq80FM3FhQvhKTK2rW9dhKroYlqfjXD8tQcBiFCCgQAkAR/ucqDBr2fSvcOPwHNOTptYZgB9C9owGKsyhxvVlo3kfPW3Lc3mfPs1IXuybQIRUqNZPqBowfrdawcjM97PtE4Vjc5jKjFbSGW3cTvSP9iSxx52kVsl0ZD85muU2eFgzhmZAf2AupT5PX+bg62PC+ux07hh7MicEs1pzD0zFf/P1baawO+TQPTlGuQXeIeU9XzJL5v9lfgL7okpxnmyGIAAAAABJRU5ErkJggg==&quot;");
    elem2.setAttribute("class", "SaveButton");
    elem2.setAttribute("id", "HidePanel");
    div.appendChild(elem2);

    var elem3 = document.createElement("img");
    elem3.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAmCAMAAAB+iAzNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4QTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRkNGMTIxRjc4MDMxMUU3OTQwOUFERTg1OTZEMjM5MSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRkNGMTIxRTc4MDMxMUU3OTQwOUFERTg1OTZEMjM5MSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU5QTEzRjJCRkI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhBODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+OyB63wAAAL1QTFRFNTc9NzpAOjxCPD9FQEJHQkVKRUdNR0pPSkxSS01RTE9UV1pfWlxjXV9lXl9jYGFoYmRqZWZtamxyb3BzcHF3dXZ9enyCfH+Efn+CgIGHh4mPioySjY2QjpKYkpSalJecl5mgmpudnJ6kp6iqp6mvqayyrK60rrG3sbO0srO6tLS1tLa8t7i/vL7EvsHHv8DBw8bMx8jPyczRy8vMzM3UztHW0tPa1tbX19je3N3j3+Hn4eHh6+vr9fX1////4Nid/wAAAWRJREFUSMft1V9PE0EUh+G3thaXytayVBZE7DKAUMBRaik9s/P7/h/Li9rsxia2id0Lk51kksm5eHKS82e4o8HT4i3e4v8h3m0Sv/zZIH772BB+NIL5ZHDcAN45X47p2enQJm/WsUWxH7x/b8+HvLfhwXf7drhf/MPc7t/CqfXo3tjrSYUnQZJS/DSozICilGaA91EZWZD8FtzssgNM5gDnS6vw6YIsZuBV4AOkKkiDAx9zoPSkZbEFX44BHr4CjF5r+Pp6B5lg6oGLsAqQl4Cb/R0/W9pVB16+rBL/XOF+QRbzlZWqZnoHFJKkxZaCDp7tqd+3Md1rexnVCuqj5KjwPzIPO7Vi79rGIxswtIeDeiuWF6v3Gs9VkJbuN07pSGZu+xB9PDmzLkefOtRxJym6CqeI0pQ1ngVpluwy/lc/NkJJzCFX8u+75elmE1cOLu5hcfXebcacpJC331yLt3iL73J+AR7BNIxAKHReAAAAAElFTkSuQmCC");
    elem3.setAttribute("alt", "");

    elem3.setAttribute("onmouseover", "this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAmCAMAAAB+iAzNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4QTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCODJEQkNCRTc4MDMxMUU3OTczMUEwODlGM0E3NTk4NiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCODJEQkNCRDc4MDMxMUU3OTczMUEwODlGM0E3NTk4NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU5QTEzRjJCRkI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhBODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+hTx1VAAAAL1QTFRFSk5XTFFaT1NbUFVeU1dgVVpiWFxlWl5mXF9nXWBpXmNraGx0a253bG91bXF4b3J7cXV9dHd/eXuEe32DfYCIgoWNh4mRiIqPiIyTi46VkpWdlZeblZifmJykm56lnaGooKOroqOnpaevrq+yrrG4sLO6sbO0s7W7tLe+t7nBubq9ubzCvL7FwcLKwsXMxMXHx8rQysvTy8/Uzs/Rz9DX0NPZ09Xc2Nnf2dnb3d7k3+Hn4+Pk7O3t9vb2////fquqgwAAAWRJREFUSMft1V1vEkEUxvE/gnQtbpFu6fZFK9tpq6W2o0VaOLPzfP+P5QWS3UgiJLIXJjvJJJNz8ctJzstwR4OnxVu8xf9DvNskfvWzQfzLt4bwoxHMJ4PjBvDOxXJMz86GNnmzji2K/eD9e3s+5L0ND77b0+F+8Q9zu38LZ9aje2uvJxWeBElK8dOgMgOKUpoB3kdlZEHyW3Czqw4wmQNcLK3CpwuymIFXgQ+QqiANDnzMgdKTlsUWfDkGePgKMHqt4evrHWSCqQcuwypAXgJu9nf8fGnXHXj5vEr8U4X7BVnMV1aqmukdUEiSFlsKOni2x37fxnRv7GVUK6iPkqPC/8g87NSKvRsbj2zA0B4O6q1YXq7eazxXQVq63zilI5m57UN0enJuXY4+dqjjTlJ0FU4RpSlrPAvSLNll/K9/bISSmEOu5N93y+PtJq4cXNzD4uq924w5SSFvv7kWb/EW3+X8AucfNDiDf5RDAAAAAElFTkSuQmCC&quot;");
    elem3.setAttribute("onmouseout", "this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAmCAMAAAB+iAzNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4QTgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRkNGMTIxRjc4MDMxMUU3OTQwOUFERTg1OTZEMjM5MSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRkNGMTIxRTc4MDMxMUU3OTQwOUFERTg1OTZEMjM5MSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU5QTEzRjJCRkI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhBODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+OyB63wAAAL1QTFRFNTc9NzpAOjxCPD9FQEJHQkVKRUdNR0pPSkxSS01RTE9UV1pfWlxjXV9lXl9jYGFoYmRqZWZtamxyb3BzcHF3dXZ9enyCfH+Efn+CgIGHh4mPioySjY2QjpKYkpSalJecl5mgmpudnJ6kp6iqp6mvqayyrK60rrG3sbO0srO6tLS1tLa8t7i/vL7EvsHHv8DBw8bMx8jPyczRy8vMzM3UztHW0tPa1tbX19je3N3j3+Hn4eHh6+vr9fX1////4Nid/wAAAWRJREFUSMft1V9PE0EUh+G3thaXytayVBZE7DKAUMBRaik9s/P7/h/Li9rsxia2id0Lk51kksm5eHKS82e4o8HT4i3e4v8h3m0Sv/zZIH772BB+NIL5ZHDcAN45X47p2enQJm/WsUWxH7x/b8+HvLfhwXf7drhf/MPc7t/CqfXo3tjrSYUnQZJS/DSozICilGaA91EZWZD8FtzssgNM5gDnS6vw6YIsZuBV4AOkKkiDAx9zoPSkZbEFX44BHr4CjF5r+Pp6B5lg6oGLsAqQl4Cb/R0/W9pVB16+rBL/XOF+QRbzlZWqZnoHFJKkxZaCDp7tqd+3Md1rexnVCuqj5KjwPzIPO7Vi79rGIxswtIeDeiuWF6v3Gs9VkJbuN07pSGZu+xB9PDmzLkefOtRxJym6CqeI0pQ1ngVpluwy/lc/NkJJzCFX8u+75elmE1cOLu5hcfXebcacpJC331yLt3iL73J+AR7BNIxAKHReAAAAAElFTkSuQmCC&quot;");
    elem3.setAttribute("class", "SaveButton");
    elem3.setAttribute("id", "PanelIgnoreSite");
    div.appendChild(elem3);

    var elem4 = document.createElement("img");
    elem4.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAAmCAMAAADzyYncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ODgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMkNBQzM2RDc3RTkxMUU3QkFDMUJDMzAwM0UxQjJCRCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMkNBQzM2Qzc3RTkxMUU3QkFDMUJDMzAwM0UxQjJCRCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM4NTUxMDMwREI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg4ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Gb068gAAAJxQTFRFNTc9NzpAOjxCPD9FQkVKR0pPSkxSS01RV1pfWlxjXV9lXl9jYGFoZ2lwbG91b3BzdXZ9d3l/enyCfn+CjI6UjY2QjpKYlJecl5mgmpudnqKmpKatp6iqp6mvqayysbO0srO6tLS1tLa8t7i/vsHHv8DBx8jPyczRy8vMzM3UztHW1tbX19je2dzi3N3j3+Hn4eHh6+vr9fX1////sy4m4gAAAedJREFUWMPt1lt7lDAQgOGvx1ijxpauio5t0aWbbrQ5zP//b14AC3rR7qNWe5G5IQ8MyUsyAbjmuUUVVVEVVVEVVdFfE71axBlH5/9fFBexPl1fPQPRt49T3LzZro/+BUGbB0WbXfPifnsytb1qsg92K6qam6cRHbw+AA4+xO9n09k2Gbw8LOpBinkS0cv72/PD45sY387D+eFok6pAcWDU4JJqvxChdkqhV23BZU2GrgPJwz3GD3Npc1APvWp4fNUuYtzexnj5fnfWqTcAQXDqhhE85B6b21nU512KK8YG8IK0rAp4dUiAPhmkGKwGoM0Wv0cdvYsxxqvLuaRwXsNYR7nBFUgrmryYPlHV5HYpdhimDwAUZzQIXjBqgbTC6viI+1X25xjXR5vN8oIJGZqkqg3klS3QqqpqWKwac0oTUgt0pTfgZRXaRLETpB0budlTdPh1e8LPIqxiSjt0Il46aNIvlQ1zCji1AL6HVerEaJv47Tni+AVLURDoA0Ydog1YzQ7Igpm24CQaU6THFkd2dB6MZkcqAoRkkGxGkWRrHqvsu9Mp7mZRk1SDBVFNuQFCBnBJx5KfV21MGbecjO8xX0DUASYM9TaICKpdbvb9imyexZf2yyI+1b+RKqqiKqqiKqqiP4wfqSlNkmP8saQAAAAASUVORK5CYII=");
    elem4.setAttribute("onmouseover", "this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAAmCAMAAADzyYncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ODgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxRDkwQzNCMzc3RTkxMUU3QTAyM0VBNzM4NkJCN0Q5NyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxRDkwQzNCMjc3RTkxMUU3QTAyM0VBNzM4NkJCN0Q5NyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM4NTUxMDMwREI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg4ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+v5VXGgAAAJxQTFRFSk5XTFFaT1NbUFVeVVpiWl5mXF9nXWBpaGx0a253bG91bXF4b3J7dnqCen6Ge32DgoWNhIePh4mRiIqPlZebl5qhmJyknaGooKOroqOnpqqwq662rq+yrrG4sLO6sbO0t7nBubq9ubzCvL7FwsXMxMXHysvTy8/Uzs/Rz9DX0NPZ2Nnf2dnb2dzi3d7k3+Hn4+Pk7O3t9vb2////FGd4yAAAAehJREFUWMPt1lt7lDAQgOGvp9TGQ2zZqujYFl266Rqbw/z//+YFsKAX7T5qtReZG/LAkLwkE4BrnltUURVVURVVURX9NdGrRZxxdP7/RXER69P11TMQffs4xc2b7froXxC0eVC02TUv7rcnU9urJvtgt6KquXka0cHrA+DgQ/x+Np1tk8HLw6IepJgnEb28vz0/PL6J8e08nB+ONqkKFAdGDS6p9gsRaqcUetUWXNZk6DqQPNxj/DCXNgf10KuGx1ftIsbtbYyX73dnnXoDEASnbhjBQ+6xuZ1Ffd6luGJsAC9Iy6qAV4cE6JNBisFqANps8XvU0bsYY7y6nEsK5zWMdZQbXIG0osmL6RNVTW6XYodh+gBAcUaD4AWjFkgrrI6PuF9lf45xfbTZLC+YkKFJqtpAXtkCraqqhsWqMac0IbVAV3oDXlahTRQ7QdqxkZs9RYdftyf8LMIqprRDJ+Klgyb9Utkwp4BTC+B7WKVOjLaJ354jjl+wFAWBPmDUIdqA1eyALJhpC06iMUV6bHFkR+fBaHakIkBIBslmFEm25rHKvjud4m4WNUk1WBDVlBsgZACXdCz5edXGlHHLyfge8wVEHWDCUG+DiKDa5Wbfr8jmWXxpvyziU/0bqaIqqqIqqqIq+sP4AX/FTXa0IQgJAAAAAElFTkSuQmCC&quot;");
    elem4.setAttribute("onmouseout", "this.src=&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAAmCAMAAADzyYncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ODgwNDM4QjNFNzdFNzExODRDQ0FEREIzM0JCMDQ5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMkNBQzM2RDc3RTkxMUU3QkFDMUJDMzAwM0UxQjJCRCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMkNBQzM2Qzc3RTkxMUU3QkFDMUJDMzAwM0UxQjJCRCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM4NTUxMDMwREI3N0U3MTE5NjJFRDg0RjlBNjRCMkVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg4ODA0MzhCM0U3N0U3MTE4NENDQUREQjMzQkIwNDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Gb068gAAAJxQTFRFNTc9NzpAOjxCPD9FQkVKR0pPSkxSS01RV1pfWlxjXV9lXl9jYGFoZ2lwbG91b3BzdXZ9d3l/enyCfn+CjI6UjY2QjpKYlJecl5mgmpudnqKmpKatp6iqp6mvqayysbO0srO6tLS1tLa8t7i/vsHHv8DBx8jPyczRy8vMzM3UztHW1tbX19je2dzi3N3j3+Hn4eHh6+vr9fX1////sy4m4gAAAedJREFUWMPt1lt7lDAQgOGvx1ijxpauio5t0aWbbrQ5zP//b14AC3rR7qNWe5G5IQ8MyUsyAbjmuUUVVVEVVVEVVdFfE71axBlH5/9fFBexPl1fPQPRt49T3LzZro/+BUGbB0WbXfPifnsytb1qsg92K6qam6cRHbw+AA4+xO9n09k2Gbw8LOpBinkS0cv72/PD45sY387D+eFok6pAcWDU4JJqvxChdkqhV23BZU2GrgPJwz3GD3Npc1APvWp4fNUuYtzexnj5fnfWqTcAQXDqhhE85B6b21nU512KK8YG8IK0rAp4dUiAPhmkGKwGoM0Wv0cdvYsxxqvLuaRwXsNYR7nBFUgrmryYPlHV5HYpdhimDwAUZzQIXjBqgbTC6viI+1X25xjXR5vN8oIJGZqkqg3klS3QqqpqWKwac0oTUgt0pTfgZRXaRLETpB0budlTdPh1e8LPIqxiSjt0Il46aNIvlQ1zCji1AL6HVerEaJv47Tni+AVLURDoA0Ydog1YzQ7Igpm24CQaU6THFkd2dB6MZkcqAoRkkGxGkWRrHqvsu9Mp7mZRk1SDBVFNuQFCBnBJx5KfV21MGbecjO8xX0DUASYM9TaICKpdbvb9imyexZf2yyI+1b+RKqqiKqqiKqqiP4wfqSlNkmP8saQAAAAASUVORK5CYII=&quot;");
    elem4.setAttribute("alt", "");
    elem4.setAttribute("class", "SaveButton");
    elem4.setAttribute("id", "PanelAddSite");
    div.appendChild(elem4);

    var elem5 = document.createElement("img");
    elem5.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPMAAAAlBAMAAABlv8I+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjgyNTlERTM3NzNCMTFFN0I0ODM4REUxRDg5QzQxQTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjgyNTlERTQ3NzNCMTFFN0I0ODM4REUxRDg5QzQxQTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2ODI1OURFMTc3M0IxMUU3QjQ4MzhERTFEODlDNDFBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2ODI1OURFMjc3M0IxMUU3QjQ4MzhERTFEODlDNDFBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoQnVuQAAAAwUExURTU3PUtNUV5fY29wc35/go2NkJqbnaeoqrS0tb/AwcvLzNbW1+Hh4evr6/X19f///yNJ93wAAAKLSURBVFjD7ZRBTxNRFIVP67RDp506P0Bpt0Zw5geYMj9A2u7FpGst4S21RmCnbqQ7FibSlS6tJkBwg2UBC0LA0FhjTDoJRJZtQ4KAwvPeN1TFxKQmJMQ4p01zm/NOv3fve1MgUKBAgQIF+k91p9eFcaE1v6hCHoke1ker9BH740pyGB0v94Q2C1mXi4L+4czQPXYN9E0qNIbS0eYhlRlE3nJFE2mzq2+EOlpzG4NTB5iRxG5KoUueVVSWMXzsqkBrD8opLu7RDtgBGq0lGJQYO8ClY2eECIk8J80ZLyrXfkEnCnZhgL6beUNw5aMjnrGrV013HHYtk+92PerwrJLua9R1L6ECubRyxspjVkywA3xynqIUamA7nr6vlVPOhMhYnDSXYLsThMr4A6f3Y9o+oFdSFlc+GlupeYNW2fQyRBe9rDZs8uTDbQ7cAy9SA0+6MaEc1DFkAdNoAKNpWrBaKamk6aLEA7f9a0Zd56ehbdBvdUrg6gT94mYxmdZbktCxH+g6dJpo+JnAuGyHO7fpJGQXbRKaHUZfTF+lAV/Zgb7q6K+2Os9VktDTCo0TtG35XWNuFlzFfPTIw1QRw459Cu13jdB7bTPcxvws7v68Zowmx+8aC0TB5QLoxuxVljunuh48QUcbyBUGebNFT1V6bYDRqc3EDm5ZL330BgPKeODkHOCGtRJ5Z7Qx6uGae91Vjo8mR531Ala0hlZLiLmIhzXxpKqShM65U93nJC6/CURb+1z3T6oqtL7PaMPTd8n20aH1CnChJfrkZxWqYvGwjf4yBfjcyPHR7AAfZQ3Zo3ksfkX22MWEMyTASULr8o0g/u9PXNI9o3+2+l8nsjg39KPzQwcKFCjQv6rv6OoFe6jiEfQAAAAASUVORK5CYII=");
    elem5.setAttribute("alt", "");
    elem5.setAttribute("class", "Message");
    div.appendChild(elem5);


    if (window == window.top) {
        body.appendChild(div);
    }
    div = document.querySelector('#HidePanel');
    div.addEventListener('click', function() { hide_overlay(true); });
    div = document.querySelector('#PanelAddSite');
    div.addEventListener('click', save_pass_site);
    div = document.querySelector('#PanelIgnoreSite');
    div.addEventListener('click', add_ignore_site);
    is_overlay = true;
}

// Hide panel
function hide_overlay(is_send) {
  //setTimeout(function() {
        var div = document.querySelector('#SavePanelPopup');
        div.style.visibility = "hidden";
        is_overlay = false;
        if (is_send) {
            browser.runtime.sendMessage({ name: "delete_card_for_tab" }, function(response) {});
        }
        g_click_close = true;
   //, 200);
}

// Send card for saving
function save_pass_site() {
    browser.runtime.sendMessage({ name: "send_set_pass_and_login" }, function(response) {});
    hide_overlay(false);
}

function add_ignore_site() {
    browser.runtime.sendMessage({ name: "add_ignore_site", domain: document.domain }, function(response) {});
    hide_overlay(true);
}

function get_PasswordstateBrowserExtensionURL() {
    var elem = document.querySelector("#PasswordstateBrowserExtensionURL");
    if (elem) {
        browser.runtime.sendMessage({ name: "send_BrowserExtensionURL", value: elem.value }, function(response) {});
    }
}


var observer = new MutationObserver(function(mutationsList) {
// window.addEventListener("DOMSubtreeModified", function() {

    setTimeout(function() {
        //your code to be executed after 1 second
		isInputAdded = false;
		for (var i = 0; i < mutationsList.length; i++) {
			for (var j = 0; j < mutationsList[i].addedNodes.length; j++) {
				if (mutationsList[i].addedNodes[j].firstChild && mutationsList[i].addedNodes[j].querySelector("input")) {
					isInputAdded = true;
					break;
				}
			}
			if (isInputAdded) {
				break;
			}
		}
		if (!isInputAdded) {
			// console.log("	No inputs are addded, nothing to do");
			return false;
		}

        get_id_login_and_password();
		
        if (g_card.UserName && g_card.Password)
            set_card_to_page(g_card);
        
        if (is_overlay == false) {
            browser.runtime.sendMessage({ name: "is_overlay_for_tab" }, function(response) {
                if ((g_show_header_bar) && (!g_click_close)) {
                    if (response.is_overlay) {
                        create_overlay();
                        g_show_header_bar = false;
                    }
                }
            });
        }
		 fill_password(set_card_to_page);
    }, 1000);

});


window.onload = function() {
    fill_password(set_card_to_page);
    g_show_header_bar = true;
    g_click_close = false;
    browser.runtime.sendMessage({ name: "is_overlay_for_tab" }, function(response) {
        if (response.is_overlay) {
            create_overlay();
            g_show_header_bar = false;
        }
    });
	get_PasswordstateBrowserExtensionURL();
	observer.observe(document.getRootNode().body, {childList: true, subtree: true});
}


window.onbeforeunload = function() {
    var card = get_card_to_page();
    if (card.password) {
        card.url = get_url(document.URL);
        card.title = document.domain;
        card.description = document.title;
        browser.runtime.sendMessage({ name: "preload_set_pass_and_login", card: card }, function(response) {});
    }
};