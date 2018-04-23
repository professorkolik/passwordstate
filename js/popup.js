
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.name == 'set_show_site_passwordstate') {
        on_show_hide("temp", "show_site_passwordstate");
        document.querySelector('#url_temp').value = message.url;
    }

    return true;
});

//Send command to show site from Passwordstate in new tab
function show_site_passwordstate_click() {
    var url_temp = document.querySelector('#url_temp').value;
    document.querySelector('#url_temp').value = "";
    browser.runtime.sendMessage({'name': 'on_show_site_passwordstate', url: url_temp});
    window.close();
}

// Send command to show url from settings in new tab
function my_password_state_item_click(e) {
    browser.runtime.sendMessage({'name': 'on_my_password_state_item_click'});
    window.close();
}

// Send command to show help from Passwordstate in new tab
function my_help_item_click(e) {
    browser.runtime.sendMessage({ 'name': 'on_my_help_item_click' });
    window.close();
}

// Hide first element and show second
function on_show_hide(elem1, elem2) {
    document.getElementById(elem1).style.display = 'none';
    document.getElementById(elem2).style.display = 'block';
}

// open passsword generation window
function generate_password_item_click(e) {
    on_show_hide("popup", "generate");
}

// Logout user
function logout_item_click(e) {
    browser.runtime.sendMessage({'name': 'on_logout_item_click'});
    window.close();
}

// send card to generate new one
function gen_generate_click(e) {
    browser.runtime.sendMessage({'name': 'get_new_generate_password'}, function(response) {
        set_password_generate( response.password );
    });
}

// Send command to apply generated password
function set_generate_click(e) {
    var password = document.querySelector('#pass_generate').value;
    browser.runtime.sendMessage({'name': 'set_to_page_password', 'password': password}, function(response) {});
}

// Send command to apply generated password to clipboard
function copy_generate_click(e) {
    var password = document.querySelector('#pass_generate').value;
	var copyFrom = document.createElement("textarea");
    copyFrom.textContent = password;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    body.removeChild(copyFrom);
    browser.runtime.sendMessage({'name': 'copy_to_clipboard_password', 'password': password}, function(response) {
	});
}

// show generated password
function set_password_generate(password) {
    var password_field = document.querySelector('#pass_generate');
    password_field.value = password;
}

// show main popup
function backrow_generate_click() {
    on_show_hide("generate", "popup");
}

document.addEventListener('DOMContentLoaded', function () {
    var my_password_state_item = document.querySelector('#my_password_state_item');
    var my_help_item = document.querySelector('#my_help_item');
    var generate_password_item = document.querySelector('#generate_password_item');
    var logout_item = document.querySelector('#logout_item');
    var gen_generate = document.querySelector('#gen_generate');
    var set_generate = document.querySelector('#set_generate');
    var copy_generate = document.querySelector('#copy_generate');
    var backrow_generate = document.querySelector('#backrow_generate');
    var show_site_passwordstate = document.querySelector('#show_site_passwordstate');

    my_password_state_item.addEventListener('click', my_password_state_item_click);
    my_help_item.addEventListener('click', my_help_item_click);
    generate_password_item.addEventListener('click', generate_password_item_click);
    logout_item.addEventListener('click', logout_item_click);
    gen_generate.addEventListener('click', gen_generate_click);
    set_generate.addEventListener('click', set_generate_click);
    copy_generate.addEventListener('click', copy_generate_click);
    backrow_generate.addEventListener('click', backrow_generate_click);
    show_site_passwordstate.addEventListener('click', show_site_passwordstate_click);
});

browser.runtime.sendMessage({'name': 'get_show_site_passwordstate'}, function(response) {});

window.onload = function() {
    on_show_hide("generate", "popup");
    on_show_hide("show_site_passwordstate", "popup");
    gen_generate_click();
    var builds = document.querySelectorAll('#build');
    for(var i = builds.length - 1; i >= 0; i--) {        
        builds[i].appendChild( document.createTextNode( browser.extension.getBackgroundPage().GetBuild() ) );
    }
}