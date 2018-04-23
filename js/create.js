var g_login = "";

// Creates an elemenet to select password
function set_list_for_select(list) {
    if (list.length) {
        var div = document.querySelector("#select");
        var select = document.createElement('select');
        select.setAttribute('id', 'select_value');
        select.style.width= '412px';
        for (var i = 0; i < list.length; i++) {
            var option = document.createElement('option');
            option.setAttribute('value', list[i].PasswordListID );
            option.appendChild( document.createTextNode( list[i].TreePath ) );
            select.appendChild(option);
        };
        //div.innerHTML = select.outerHTML;
		
		div.appendChild(select);
		
		
    }
    else {
        browser.runtime.sendMessage({'name': 'on_popup_show'}, function(response) {});
        window.close();
    }
}

// Apply card to the page elements
function set_card_for_page(card) {
    if (card) {
        var user = document.querySelector('#user');
        var password = document.querySelector('#password');
        var url = document.querySelector('#url');
        var title = document.querySelector('#title');
        var webuser = document.querySelector('#webuser');
        var webpassword = document.querySelector('#webpassword');

        user.value = card.login;
        password.value = card.password;
        url.value = card.url;
        title.value = card.title;
        description.value = card.description;
        webuser.value = card.webuser;
        webpassword.value = card.webpassword;
        g_login = card.login;
    }
    else {
        browser.runtime.sendMessage({'name': 'on_popup_show'}, function(response) {});
        window.close();
    }

}

// Get user data and send it to create a new card
function create_click(e) {
    var card = {};
    card.PasswordListID = document.querySelector('#select_value').value;
    card.Title = document.querySelector('#title').value;
    card.UserName = document.querySelector('#user').value;
    card.Description = document.querySelector('#description').value;
    card.Password = document.querySelector('#password').value;
    card.URL = document.querySelector('#url').value;
    card.WebPassword_ID = document.querySelector('#webpassword').value;
    if (g_login != card.UserName) {
        card.WebUser_ID = "!";
    }
    else {
        card.WebUser_ID = document.querySelector('#webuser').value;
    }
    if (card.UserName != "" && card.Password != "") {
        browser.runtime.sendMessage({'name': 'set_new_card_for_user', 'card': card}, function(response) {});
    }
    else {

    }
}

// Show/Hide password
function ShowHidePassword() {
    var elem = document.querySelector('#check');
    if(elem.checked) {
        document.getElementById('password').type='text';
    }
    else {
        document.getElementById('password').type='password';
    }
}

browser.runtime.sendMessage({'name': 'get_list_password'}, function(response) {
    set_list_for_select( response.list );
});

browser.runtime.sendMessage({'name': 'get_card_for_create'}, function(response) {
    set_card_for_page( response.card );
});

window.onload = function () {
    var save = document.querySelector('#save');
    var check = document.querySelector('#check');
    save.addEventListener('click', create_click);
    check.addEventListener('click', ShowHidePassword);
};