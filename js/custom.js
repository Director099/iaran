'use strict';

$(function () {
    $.scrollUp({
        scrollText: '',
    });
});

$('[data-toggle="datepicker"]').datepicker();

$('#phone').mask('0 (000) 000 - 00 - 00');

var btnMap = $("#btn-map");
var reservation = $("#btn-reservation");

function scrollClick(event) {
  event.click(function () {
    var elementClick = $(this).attr("href")
    var destination = $(elementClick).offset().top;
    jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, 800);
    return false;
  });
}

scrollClick(btnMap);
scrollClick(reservation);

(function() {

  var btnCollapse = document.querySelectorAll('.recall__open');

  btnCollapse.forEach(function(i) {
    i.addEventListener('click', function() {
      var parentElement = i.offsetParent.querySelector('.recall__collapse');
      i.classList.toggle('active');
      parentElement.style.height = parentElement.scrollHeight + 15 + 'px';

      if(!i.classList.contains('active')) {
        parentElement.style.height = '65px';
      }
    })
  })

})();
