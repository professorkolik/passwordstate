// Creates an element for card's selection
function set_cards_for_select(cards) {
    var website = document.querySelector("#web_site");
    var div = document.querySelector("#select");
    var select = document.createElement('select');
    select.setAttribute('id', 'select_value');
    select.style.width = '180px';
    for (var i = 0; i < cards.length; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', cards[i].UserName );
        option.appendChild( document.createTextNode( cards[i].UserName ) );
        select.appendChild(option);
    }
    //div.innerHTML = select.outerHTML;
	div.appendChild(select);
}

// Send checked card to a site
function prim_click(e) {
    var user = document.querySelector('#select_value').value;
    browser.runtime.sendMessage({ 'name': 'set_change_card_for_site', 'user': user }, function (response) { });
    window.close();
}

// shows main popup
function backrow_click() {
    browser.runtime.sendMessage({ 'name': 'on_popup_show' });
    window.close();
}

// trim a string and add ellipsis
function TrimLength(text, maxLength) {
    var shortURL = text.substring(0, maxLength) + '...';
    return shortURL;
}

browser.tabs.query({currentWindow: true, active: true}, function(tabs){
    var cards = browser.extension.getBackgroundPage().getStorageMemory('cards') ? browser.extension.getBackgroundPage().getStorageMemory('cards') : [];
    if(cards.length) {
        for(var i in cards){
            if (tabs[0].url.indexOf(cards[i].url) + 1) {
                set_cards_for_select(cards[i].cards);
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var prim = document.querySelector('#prim');
    var backrow = document.querySelector('#backrow');
    backrow.addEventListener('click', backrow_click);
    prim.addEventListener('click', prim_click);
});