$(function(){
    function pageLoad(){
        $('.widget').widgster();
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});