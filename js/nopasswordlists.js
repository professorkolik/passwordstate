function close_window() {
	browser.runtime.sendMessage({'name': 'on_popup_show'}, function(response) {});
    window.close();
}

window.onload = function () {
    var close = document.querySelector('#close');
    close.addEventListener('click', close_window);
};