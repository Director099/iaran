'use strict';


function initialize() {
    var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: {lat: -34.397, lng: 150.644}
        });
    var geocoder = new google.maps.Geocoder();
    var bounds  = new google.maps.LatLngBounds();

    geocodeAddress(geocoder, map)

    function geocodeAddress(geocoder, resultsMap) {
        for(key in all_objects) {
          var obj = all_objects[key];
          var contentString = '<div id="content">'+
            '<div style="float:left;"><img style="max-width: 160px" src="' + obj.image + '"></div>' +
            '<div style="float:right; min-width: 100px; margin-left: 15px">' +
            '<p><b>' + obj.name + '</b></p>' +
            '<p>' + obj.roomsCount + '</p>' +
            '<p>' + obj.sleepCount + '</p>' +
            '<p>' + obj.price + '</p>' +
            '<a target="_blank" href="' + obj.link + '">' + obj.linkTrans + '</a>' +
            '</div>' +
            '</div>';
          geocoder.geocode({'address': obj.name}, function (results, status) {
            if (status === 'OK') {
              resultsMap.setCenter(results[0].geometry.location);
              var infowindow = new google.maps.InfoWindow({
                content: contentString
              });
              var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
              });
              marker.addListener('click', function() {
                infowindow.open(map, marker);
              });
              var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
              bounds.extend(loc);
              map.fitBounds(bounds);
              map.panToBounds(bounds);
              /*var markerCluster = new MarkerClusterer(map, markers, {
                imagePath: 'https://developers.googl.com/maps/documentation/javascript/examples/markerclusterer/m'
              });*/
              if (map.getZoom() > 20) {
                map.setZoom(18)
              }
            }
          });
        }
      }
}
google.maps.event.addDomListener(window, 'load', initialize);

$(function () {
    $.scrollUp({
        scrollText: '',
    });
});


$(function() {
  if (typeof now === 'undefined') return;
  $('[data-toggle="datepicker"]').datepicker({
    startDate: now,
    filter: function (date) {
      var d = reservedDates.find(function (item) {
        return item.format("mm/dd/yy") == date.format("mm/dd/yy")
      });
      if (d) {
        return false
      }
    }
  });
  $('[data-toggle="datepicker-search"]').datepicker({
    startDate: now,
  });
})


$('#phone').mask('+0 (000) 000-00-00');

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
  var allOpenPhoto = document.querySelector('#open-photo');
  var fancy = document.querySelector('.photos__main');
  if (allOpenPhoto) {
    allOpenPhoto.addEventListener('click', function () {
      fancy.click();
    })
  }
})();


$(function() {
  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }

  function getCsrfToken() {
    return Cookies.get('csrftoken');
  }
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", getCsrfToken());
      }
    }
  });
});


$(function () {
  $('#login-form').on('submit', function (e) {
    e.preventDefault();

    var rootElem = $(this);
    rootElem.find('[data$="_error"]').addClass('d-none');
    $.post($(this).attr('action'), $(this).serialize(), function (res) {
      window.location.reload();
    }).fail(function (error) {
      for(var key in error.responseJSON) {
        var errArr = error.responseJSON[key];
        rootElem.find('[data="' + key + '_error"]')
          .removeClass('d-none')
          .html(errArr.join('<br>'))
      }
    })
  });

  $('#register-form').on('submit', function (e) {
    e.preventDefault();

    var rootElem = $(this);
    rootElem.find('[data$="_error"]').addClass('d-none');
    $.post($(this).attr('action'), $(this).serialize(), function (res) {
      window.location.reload();
    }).fail(function (error) {
      for(var key in error.responseJSON) {
        var errArr = error.responseJSON[key];
        rootElem.find('[data="' + key + '_error"]')
          .removeClass('d-none')
          .html(errArr.join('<br>'))
      }
    })
  });
})





/// date format
var dateFormat = function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d:    d,
        dd:   pad(d),
        ddd:  dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m:    m + 1,
        mm:   pad(m + 1),
        mmm:  dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy:   String(y).slice(2),
        yyyy: y,
        h:    H % 12 || 12,
        hh:   pad(H % 12 || 12),
        H:    H,
        HH:   pad(H),
        M:    M,
        MM:   pad(M),
        s:    s,
        ss:   pad(s),
        l:    pad(L, 3),
        L:    pad(L > 99 ? Math.round(L / 10) : L),
        t:    H < 12 ? "a"  : "p",
        tt:   H < 12 ? "am" : "pm",
        T:    H < 12 ? "A"  : "P",
        TT:   H < 12 ? "AM" : "PM",
        Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
      };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();

// Some common format strings
dateFormat.masks = {
  "default":      "ddd mmm dd yyyy HH:MM:ss",
  shortDate:      "m/d/yy",
  mediumDate:     "mmm d, yyyy",
  longDate:       "mmmm d, yyyy",
  fullDate:       "dddd, mmmm d, yyyy",
  shortTime:      "h:MM TT",
  mediumTime:     "h:MM:ss TT",
  longTime:       "h:MM:ss TT Z",
  isoDate:        "yyyy-mm-dd",
  isoTime:        "HH:MM:ss",
  isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};

