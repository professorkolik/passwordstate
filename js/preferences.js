document.addEventListener('DOMContentLoaded', function () {
  	document.querySelector('#build').appendChild( document.createTextNode( browser.extension.getBackgroundPage().GetBuild() ) );  
});
