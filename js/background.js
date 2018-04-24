var g_auth_request = "api/browser/authenticate/";
var g_generate_password_request = "api/browser/generatepassword/";
var g_websites_request = "api/browser/getwebsites/";
var g_get_password_request = "api/browser/getpassword/";
var g_get_password_list_requets = "api/browser/getpasswordlists/";
//var g_update_password_requets = "api/browser/updatepassword/";
var g_add_new_password_request = "api/browser/addpassword/";
var g_help_request = "help/browserextensionmanual/";
var g_ignored_urls_request = "api/browser/GetIgnoredURLs/";
var g_add_ignored_urls_request = "api/browser/AddIgnoredURL/";

var g_storage = {};
var save_password_list = [];

function setStorageMemory(key, value) {
	g_storage[key] = value;
}

function getStorageMemory(key) {
	if (g_storage[key]) {
		return g_storage[key];
	} else {
		return false;
	}
}

function removeStorageMemory() {
	g_storage = {};
}

function GetBuild() {
    return getStorageMemory('build');
}

// Perform logout and send a popup settings page
function logout_item_click() {
    if (getStorageMemory('is_auth')) {
        logout();
    } else {
        show_change_dlg("preferences.html");
    }
}

//Logout
function logout() {
	browser.storage.local.remove('url');
	removeStorageMemory();
	setDefault();
    show_change_dlg("preferences.html");
    SwitchIcon(2);
}

// Open url to update the card
function on_show_site_passwordstate(url) {
	var websites = getStorageMemory('websites');
    if (websites) {
        for (var i = 0; i < websites.length; i++) {
            if (url.indexOf(websites[i].URL) + 1) {
                browser.tabs.create({'url': getStorageMemory('url')+"pid="+websites[i].PasswordID});
                return;
            }
        }
    }
}


// send url of the current page in a popup, if he has a card
function get_show_site_passwordstate() {
    browser.tabs.query({currentWindow: true, active: true}, function(tabs){
    	var websites = getStorageMemory('websites');
        if (websites) {
            for (var i = 0; i < websites.length; i++) {
                if (tabs[0].url.indexOf(websites[i].URL) + 1) {
                    browser.tabs.sendMessage({name: "set_show_site_passwordstate", url: tabs[0].url},function (response) {});
                }
            }
        }
    });
}

// Get all selectors for specific website
function get_selectors_for_website(url) {
	var websites = getStorageMemory('websites');
    if (websites) {
        for (var i = 0; i < websites.length; i++) {
            if (url.indexOf(websites[i].URL) + 1) {
                return websites[i];
            }
        }
    }
}

//Save PasswordList
function set_g_password_list(data) {
    setStorageMemory("password_list", data);
}

// Get passwordlist by id
function get_password_list_for_id(id) {
	var password_list = getStorageMemory("password_list");
    for (var i = 0; i < password_list.length; i++) {
        if (password_list[i].PasswordListID == id) {
            return password_list[i].PasswordList;
        }
    }
}

//to update the data
function update_data(){
    if(getStorageMemory('is_auth')) {
        get_data_for_user(getStorageMemory("url") + g_get_password_list_requets, getStorageMemory("auth_key"), set_g_password_list);
        get_data_for_user(getStorageMemory("url") + g_websites_request, getStorageMemory("auth_key"), set_website_url);
        get_data_for_user(getStorageMemory("url") + g_ignored_urls_request, getStorageMemory("auth_key"), set_website_ignored_url);
        
    }
}

function isIdle() {
    if (getStorageMemory('AutoLogoutIdle') && getStorageMemory('AutoLogoutIdle') != "0") {
        var number = parseInt(getStorageMemory('AutoLogoutIdle')) * 60;
        browser.idle.queryState(number, function (state) {
            if (state == "idle") {
                logout_item_click();
            }
        });
    };
}

// Adds new card for user
function set_new_card_for_user(url, auth_key, card, callback) {
    if (card) {
        card.PasswordList = get_password_list_for_id(card.PasswordListID);
        $.ajax({
            url: url + g_add_new_password_request,
            data: { auth_key: auth_key, PasswordListID: card.PasswordListID, PasswordList: card.PasswordList, Title: card.Title, UserName: card.UserName, Description: card.Description, URL: card.URL, Password: card.Password, WebUser_ID: card.WebUser_ID, WebPassword_ID: card.WebPassword_ID },
            dataType: "json",
            type: "POST",
            success: function (data) {
                callback();
            }, 
            error: function (xhr, ajaxOptions, thrownError) {
            	isErrorCookie(xhr.responseText);
	        }
        });
    }
}

// If there is no card we are going to save it
// otherwise checking of there is new password then we have to update card
function set_pass_and_login(card, tabid) {
    if (card.login) {
    	var websites = getStorageMemory('websites');
        for (var i = 0; i < websites.length; i++) {
            if ((websites[i].UserName == card.login) && ((card.url.indexOf(websites[i].URL) + 1) || (card.url.indexOf(websites[i].Title) + 1))) {
                return;
            }
        }
    }
    var password_list = getStorageMemory("password_list");
    if (password_list && card) {
        setStorageMemory("card", card);
        save_password_list[tabid] = card;
		
       
        //setTimeout(function () {
             browser.tabs.sendMessage(tabid, {'name': 'set_overlay', 'card': card}, function(response) {});
         //}, 1000);
    }
}

function SwitchIcon(action) {
    if (action == 1) {
    	browser.browserAction.setIcon({path:browser.extension.getURL("/images/icon.png")})
    }
    else if (action == 2) {
    	browser.browserAction.setIcon({path:browser.extension.getURL("/images/icon_alert_red.png")})
    }
    else {
    	browser.browserAction.setIcon({path:browser.extension.getURL("/images/icon_alert.png")})
    }
}

function IssetPageInCards(url) {
    if(getStorageMemory('is_auth')) {
		var cards = getStorageMemory('cards') ? getStorageMemory('cards') : [];
		var isset = false;
        if(cards.length) {
        	for(var i in cards) {
				if (url.indexOf(cards[i].url) + 1) {
					SwitchIcon(3);
					show_change_dlg("cards.html");
					isset = true;
				};
			}
			if (!isset) {
				SwitchIcon(1);
	            show_change_dlg("popup.html");
	        }
		}
    }
}

// Send to popup the dialog for a site
function get_one_card_for_site(new_card) {	
	SwitchIcon(3);
    show_change_dlg("cards.html");
    var cards = getStorageMemory('cards') ? getStorageMemory('cards') : [];
    var isset = false;        
    if(cards.length) {            
        for(var i in cards){
            if (cards[i].url == new_card.url) {
                cards[i] = new_card;
                isset = true;
                break;
            }
        }            
    }
    if (!isset) {            
        cards.push(new_card);
    }
    setStorageMemory('cards', cards);
}


// Get password for id
function get_password_for_id(url, auth_key, id) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: url + g_get_password_request,
      data: { auth_key: auth_key, PasswordID: id },
      dataType: "json",
      type: "POST",
      success: function (data) {
        resolve(data);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        isErrorCookie(xhr.responseText);
        resolve("");
      }
    });
  });
}

// Get cards list for a site
function get_card_for_website(url) {
  return new Promise(function (resolve, reject) {
    var password_id = [];
    var cards = [];
    var element = {}
    var site = ""
    var websites = getStorageMemory('websites');
    if (websites) {
      for (var i = 0; i < websites.length; i++) {
        if (url.indexOf(websites[i].URL) + 1) {

          var protocol="";
          var host="";
          var userProtocol="";
          var userhost="";

          var urlRegex = /(https?:)?\/?\/?([www\.]?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~//]*)/
          var tabURL = urlRegex.exec(url);
          if(tabURL!=null){

            protocol = tabURL[1];
            host = tabURL[2];
            var userUrl = urlRegex.exec(websites[i].URL);
            userProtocol = userUrl[1];
            userHost = userUrl[2];


            if (((userProtocol && (userProtocol == protocol)) || !userProtocol) && (host == userHost)) {
              site = websites[i].URL;
              password_id.push(websites[i].PasswordID);
            }

          }
          else{

            var arr = url.split("/");
            if(arr!=null){

              protocol = arr[0];
              host = arr[2].split(':')[0];
              var userUrl = websites[i].URL.split("/");
              userProtocol = userUrl[0];
              userHost = userUrl[2].split(':')[0];
              if (((userProtocol && (userProtocol == protocol)) || !userProtocol) && (host == userHost)) {
                site = websites[i].URL;
                password_id.push(websites[i].PasswordID);
              }

            }
          }
        }
      }
    }

    element.url = site;

    if (password_id) {
      var passwordPromises = [];

      for (var i = 0; i < password_id.length; i++) {
        var getPasswordForId = get_password_for_id(getStorageMemory('url'), getStorageMemory('auth_key'), password_id[i]);

        passwordPromises.push(getPasswordForId);
      }

      Promise.all(passwordPromises).then(function (passwords) {
        passwords.forEach(function (password) {
          cards.push(password[0]);
        });

        element.cards = cards;

        resolve(element);
      });
    } else {
      element.cards = cards;

      resolve(element);
    }
  });
}

function get_card_for_website2(url) {
    var password_id = [];
    var cards = [];
    var element = {}
    var site = ""
    var websites = getStorageMemory('websites');
    if (websites) {
        for (var i = 0; i < websites.length; i++) {
            if (url.indexOf(websites[i].URL) + 1) {
                validateDomain(websites[i].URL);
                //alert(validURL);
                //if (validateDomain(websites[i].URL) == 'true')
                //{
                //    site = websites[i].URL;
                //    password_id.push(websites[i].PasswordID);
                //}            	
            }
        }
    }
    if (password_id) {
        for (var i = 0; i < password_id.length; i++) {
            get_password_for_id(getStorageMemory('url'), getStorageMemory('auth_key'), password_id[i]).then(
                function(data) {
                    cards.push(data[0]);
                }
            );
        }
    }
    element.url = site;
    element.cards = cards;
    return element;
}

// Send password to the page
function set_to_page_password(text) {
    browser.tabs.query({currentWindow: true, active: true}, function(tabs){
        browser.tabs.sendMessage(tabs[0].id, {'name': 'set_to_page_password', 'password': text}, function(response) {});
    });
}

// new password generation
function generate_password(url, auth_key) {
    if (auth_key)  {
        return new Promise(function (resolve, reject) {
          $.ajax({
            url: url + g_generate_password_request,
            data: { auth_key: auth_key },
            dataType: "json",
            type: "POST",
            success: function (data) {
              resolve(data[0].Password);
            },
            error: function (xhr, ajaxOptions, thrownError) {
              isErrorCookie(xhr.responseText);
              resolve("");
            }
          });
        });
    }
}

// add ignore domain
function add_ignore_domain(domain, url, auth_key) {
    $.ajax({
        url: url + g_add_ignored_urls_request,
        data: { auth_key: auth_key, URL: domain},
        dataType: "json",
        type: "POST",
        success: function (data) {
            update_data();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            isErrorCookie(xhr.responseText);
        }
    });
}

// Sets new popup dialog
function show_change_dlg(page) {
    browser.browserAction.setPopup({ popup: page });
}

// Create new tab with default url(from settings)
function my_password_state_item_click() {
    browser.tabs.create({'url': getStorageMemory('url') });
}

// Create new tab with default url(from settings)
function my_help_item_click() {
    browser.tabs.create({ 'url': getStorageMemory('url') + g_help_request });
}

// Save the list of sites to global context
function set_website_url(mass, elem) {
    var urls = [];
    for (var i = 0; i < mass.length; i++) {
        urls.push(mass[i]);
    }
    setStorageMemory('websites', urls);
}

function set_website_ignored_url(mass) {
    var urls = [];
    for (var i = 0; i < mass.length; i++) {
        urls.push(mass[i].URL);
    }
    setStorageMemory("websites_ignored", urls);
}

//Get data for user
function get_data_for_user(url, auth_key, callback) {
    if (auth_key)  {
        $.ajax({
            url: url,
            data: { auth_key: auth_key },
            dataType: "json",
            type: "POST",
            success: function (data) {
                callback(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
            	isErrorCookie(xhr.responseText);
	        }
        })
    }
}

function isErrorCookie(text) {
	if (text.indexOf("Session cookie is missing") > -1) {
		logout_item_click();
	}
}

function isWhiteList(url) {
	var websites_ignored = getStorageMemory("websites_ignored");
    for (var i = websites_ignored.length - 1; i >= 0; i--) {
        if (url.indexOf(websites_ignored[i]) != -1) {
            return true
        }
    };
    return false;
}

function getExtensionURL(url) {
    return url.substring(0, url.lastIndexOf('/') + 1);
}

function getBrowserExtensionURL(url) {
    return url.substring(url.lastIndexOf('/') + 1, url.length);
}

function copyTextToClipboard(text) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    body.removeChild(copyFrom);
}



// User authentification
function set_auth_key(url, flag) {
    if (!url) return;    
    var BrowserExtensionURL = getBrowserExtensionURL(url);
    send_url = getExtensionURL(url);
    $.ajax({
        url: send_url + g_auth_request,
        data: { BrowserExtensionURL: BrowserExtensionURL, BuildNo: getStorageMemory("apibuild") },
        dataType: "json",
        type: "POST",
        success: function (data) {
            if (data.auth_key) {
            	browser.storage.local.set({'url': url});
            	setStorageMemory('is_auth', true);
            	setStorageMemory('url', send_url);
            	setStorageMemory('auth_key', data.auth_key);
            	setStorageMemory('AutoLogoutAfterClose', data.AutoLogoutAfterClose);
            	setStorageMemory('AutoLogoutIdle', data.AutoLogoutIdle);
            	setStorageMemory('PreventSavingOfLogins', data.PreventSavingOfLogins);            	
                if (flag) {
                	if(getStorageMemory('AutoLogoutAfterClose') === 'True') {
						logout_item_click();
                        return;
					}
                }
                browser.browserAction.setPopup({popup:"popup.html"});
                update_data();
                SwitchIcon(1);
                setInterval(isIdle, 1000);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
        	setStorageMemory('is_auth', false);
            SwitchIcon(2);
            browser.storage.local.set({'url': null});
            var errorResponse = xhr.responseText;
            
            if (errorResponse.indexOf("Version mismatch") > -1)
                load_build_mismatch_error();
            else
                show_change_dlg("preferences.html");
        }
    });
}

//Change the icon to indicate an error and show the appropriate dialog
function load_build_mismatch_error() {
	SwitchIcon(2);    
    show_change_dlg("versionmismatch.html");
}

// Load user info from local storage
function load_user_info(callback) {
    browser.storage.local.get('url', function (result) {
        callback(result.url, true);
    });
}

function setDefault() {
	setStorageMemory('is_auth', false);
	setStorageMemory('build', '8215');
    setStorageMemory('apibuild', '7676');
}

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.name == 'on_my_password_state_item_click') {
        my_password_state_item_click();
    }
    if (request.name == 'on_my_help_item_click') {
        my_help_item_click();
    }
    if (request.name == 'on_logout_item_click') {
        logout_item_click();
    }
    if (request.name == 'on_popup_show') {
    	SwitchIcon(1);
        show_change_dlg("popup.html");
    }
    if (request.name == 'get_new_generate_password') {
        generate_password(getStorageMemory('url'), getStorageMemory('auth_key')).then(
            function(password) {
                sendResponse({ 'password':  password});
            }
        );
    }
    
    if (request.name == 'copy_to_clipboard_password') {
        copyTextToClipboard(request.password);        
    }

    if (request.name == 'set_to_page_password') {
        set_to_page_password(request.password);
    }
    if (request.name == 'get_card_for_website') {
        get_card_for_website(request.url).then(function (element) {
          if (element.cards.length > 0) {
            if (element.cards.length === 1) {
              sendResponse({'card': element.cards[0]});
            }
            else {
              get_one_card_for_site(element);
              sendResponse({'card': ""});
            }
          }
        });
    }
    if (request.name == 'get_cards_for_window') {
    	SwitchIcon(1); //Show original icon, and hide alert
        sendResponse({'cards': getStorageMemory("card")});
    }
    if (request.name == 'set_change_card_for_site') {
    	browser.tabs.query({currentWindow: true, active: true}, function(tabs){		    
	        var cards = getStorageMemory('cards') ? getStorageMemory('cards') : [];	        
	        if(cards.length) {
	        	for (var i = 0; i < cards.length; i++) {
            		if (tabs[0].url.indexOf(cards[i].url) + 1) {
            			for (var j = 0; j < cards[i].cards.length; j++) {
	            			if ( cards[i].cards[j].UserName == request.user) {
	                    		browser.tabs.sendMessage(tabs[0].id, {'name': 'set_to_page_card', 'card': cards[i].cards[j]}, function(response) {});
	                    		break;
	                    	}
	                    }
                    	break;
                    }
                }
            }
	    });
    }
    if (request.name == 'preload_set_pass_and_login') {
        if (getStorageMemory('is_auth')) {
            if (getStorageMemory('PreventSavingOfLogins') === "False" && !isWhiteList(sender.tab.url) ) {
                set_pass_and_login(request.card, sender.tab.id);
            }
        }
    }
    if (request.name == 'send_set_pass_and_login') {
    	var password_list = getStorageMemory("password_list");
        if (password_list.length) {
            setStorageMemory("card", save_password_list[sender.tab.id]);
            save_password_list[sender.tab.id] = false;
            browser.tabs.create({'url': browser.extension.getURL('create.html')});
        }
        else {
            browser.tabs.create({'url': browser.extension.getURL('nopasswordlists.html')});
        }
    }
    if (request.name == 'get_list_password') {
    	var password_list = getStorageMemory("password_list");
        sendResponse({'list': password_list});
    }
    if (request.name == 'get_card_for_create') {
        sendResponse({'card': getStorageMemory("card")});
    }
    if (request.name == 'set_new_card_for_user') {
        set_new_card_for_user(getStorageMemory('url'), getStorageMemory('auth_key'), request.card, update_data);
		browser.tabs.remove(sender.tab.id);
    }
    if (request.name == 'get_selectors_for_website') {
        var selector = get_selectors_for_website(request.url);
        if (selector) {
            sendResponse({ 'selector': selector });
        }
        else {
            selector = {};
            selector.WebPassword_ID = "";
            sendResponse({ 'selector': selector });
        }
    }
    if (request.name == 'get_show_site_passwordstate') {
       get_show_site_passwordstate();
    }
    if (request.name == 'on_show_site_passwordstate') {
        on_show_site_passwordstate(request.url);
    }
	if (request.name == 'is_overlay_for_tab') {
        
        if (save_password_list[sender.tab.id]) {
            
            sendResponse({ 'is_overlay': true });
        } else {
            
            sendResponse({ 'is_overlay': false });
        }
    }
    if (request.name == 'send_BrowserExtensionURL') {
        if (!getStorageMemory('is_auth')) {
            set_auth_key(request.value);
        }
    }
    if (request.name == 'delete_card_for_tab') {
        save_password_list[sender.tab.id] = false;
    }
    if (request.name == 'add_ignore_site') {
        add_ignore_domain(request.domain, getStorageMemory('url'), getStorageMemory('auth_key'));
    }

    return true;
});

browser.tabs.onActivated.addListener(function(activeInfo) {
	browser.tabs.query({currentWindow: true, active: true}, function(tabs){
		IssetPageInCards(tabs[0].url);        
    });
	return true;
});

browser.tabs.onUpdated.addListener(function(tab) {
    browser.tabs.query({currentWindow: true, active: true}, function(tabs){
		IssetPageInCards(tabs[0].url);        
    });
});

browser.tabs.onCreated.addListener(function(tab) {
    browser.tabs.query({currentWindow: true, active: true}, function(tabs){
		IssetPageInCards(tabs[0].url);        
    });
});

browser.windows.onRemoved.addListener(function(windowId) {
    if (getStorageMemory('AutoLogoutAfterClose') === "True") {
        logout_item_click();
    }
});

setDefault();
load_user_info(set_auth_key);
SwitchIcon(2);
setInterval(update_data, 60000);