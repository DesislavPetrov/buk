let map;

let currentSearchLatitude;
let currentSearchedLongitude;

var circlesArray = [];

var defaultCountrySelectionText = "";
var currentCoordinates = [];

var markers = [];

var selectAllFirstValues = true;
var selectAllSecondValues = true;

var allPointsAmount = 0;

// first modal - toggle filter

$(".welcome-close-button").on("click", function () {
  $("div.visible-filter-box").removeClass("visible-filter-box");
});
// end first modal - toggle filter

var townsArray = [];

$(document).ready(function () {
  $("#country-select").change(function () {
    var selectedOptionValue = $(this).val();

    loadMap(selectedOptionValue);
    markers = [];
    $("#points-list > ul").empty();
    townsArray = [];
    $("#list3 ul.items").empty();
  });
});

const zoomLevel = 13;

var currentInfoWindow;

loadMap("Indonesia");

function loadMap(selectedCountry) {
  $.getJSON(
    "https://sheets.googleapis.com/v4/spreadsheets/1ZXy3VUbybRzCLL7cPdyqn_UgBg7CkUhtfboTnvAGBm0/values/Data!A2:M3000?majorDimension=ROWS&key=AIzaSyDNr4bkVsmi4tcvKLN0bHxhslY3va9eslo",
    function (response) {
      var mapOptions = {
        zoom: zoomLevel,
        styles: (mapOptions = [
          {
            featureType: "administrative",
            elementType: "all",
            stylers: [
              {
                visibility: "on",
              },
              {
                hue: "#ff0000",
              },
            ],
          },
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#444444",
              },
            ],
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [
              {
                color: "#eaeaee",
              },
            ],
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [
              {
                saturation: -100,
              },
              {
                lightness: 45,
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "all",
            stylers: [
              {
                visibility: "simplified",
              },
            ],
          },
          {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: [
              {
                color: "#1170af",
              },
              {
                visibility: "on",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [
              {
                visibility: "on",
              },
            ],
          },
        ]),
      };

      map = new google.maps.Map(document.getElementById("map", mapOptions), {
        zoom: zoomLevel,
        center: new google.maps.LatLng(-8.6436307, 115.1347901),
        mapTypeId: "roadmap",
        options: mapOptions,
        // fullscreenControl: false,
        disableDefaultUI: true,
        zoomControl: true,
      });

      if (selectedCountry === "Indonesia") {
        map.setCenter({ lat: -8.6436307, lng: 115.1347901 });
        map.setZoom(13);
      } else {
        map.setCenter({ lat: 53.38445566132039, lng: -1.4668404899920338 });
        map.setZoom(6);
      }

      var infoWindow = new google.maps.InfoWindow(); //static infoWindow for all your markers

      /* start adding custom control button for dispalying the filters */
      // Create your custom button
      const controlButton = document.createElement("button");
      controlButton.textContent = "Show Filters"; // Customize the button label

      // Add an event listener to the button
      controlButton.addEventListener("click", () => {
        $("div.toggle-filter-box").addClass("visible-filter-box");
      });

      // Add the button to the top center of the map
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlButton);

      // Set CSS for the control.
      controlButton.style.backgroundColor = "#fff";
      controlButton.style.border = "2px solid #fff";
      controlButton.style.borderRadius = "3px";
      controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      controlButton.style.color = "rgb(25,25,25)";
      controlButton.style.cursor = "pointer";
      controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
      controlButton.style.fontSize = "16px";
      controlButton.style.lineHeight = "34px";
      controlButton.style.margin = "11px 0 22px";
      controlButton.style.padding = "0 5px";
      controlButton.style.textAlign = "center";
      controlButton.title = "Show filters";
      controlButton.type = "button";

      // create second custom button
      const controlButtonTwo = document.createElement("button");
      // controlButtonTwo.textContent = "Show Filters"; // Customize the button label
      // controlButtonTwo.style.backgroundImage = "url(transfer-arrows-icon.png)";

      var isSidebarVisible = true;
      // Add an event listener to the button
      controlButtonTwo.addEventListener("click", () => {
        if ($(document).width() > 838) {
          if (isSidebarVisible) {
            $("#sidebar").css("width", "0");
            $("#map").css("width", "100%");
            $("#map").css("left", "0");
            isSidebarVisible = false;
          } else {
            $("#sidebar").css("width", "30%");
            $("#map").css("width", "70%");
            $("#map").css("left", "30%");
            isSidebarVisible = true;
          }
        } else {
          if (isSidebarVisible) {
            $("#sidebar").css("top", "0");
            $("#sidebar").css("height", "0");
            $("#map").css("height", "100%");
            isSidebarVisible = false;
          } else {
            $("#sidebar").css("top", "70%");
            $("#sidebar").css("height", "30%");
            $("#map").css("height", "70%");
            isSidebarVisible = true;
          }
        }
      });

      // Add the button to the top center of the map
      map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(
        controlButtonTwo
      );

      controlButtonTwo.id = "control-button-two";

      // Set CSS for the control.
      controlButtonTwo.style.backgroundColor = "#fff";
      controlButtonTwo.style.border = "2px solid #fff";
      controlButtonTwo.style.borderRadius = "3px";
      controlButtonTwo.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      controlButtonTwo.style.color = "rgb(25,25,25)";
      controlButtonTwo.style.cursor = "pointer";
      controlButtonTwo.style.fontFamily = "Roboto,Arial,sans-serif";
      controlButtonTwo.style.fontSize = "16px";
      controlButtonTwo.style.lineHeight = "34px";
      controlButtonTwo.style.margin = "11px 0 22px";
      controlButtonTwo.style.padding = "0 5px";
      controlButtonTwo.style.textAlign = "center";
      controlButtonTwo.title = "Toggle sidebar";
      controlButtonTwo.type = "button";

      response.values.forEach((element) => {
        if (element[3] === selectedCountry) {
          var id = element[0];
          var onlineName = element[1];
          var country = element[3];
          var address = element[4];

          var latitude = element[5];
          var longitude = element[6];

          var bedroomNumbers = element[7];
          var propertyType = element[8];
          var town = element[9];
          var price = element[10];
          var propertyUrl = element[11];
          var photo = element[12];

          var firstFilterVisibility = true;
          var secondFilterVisibility = true;
          var thirdFilterVisibility = true;
          var fourthFilterVisibility = true;

          var icon = {
            // url: category + ".svg", // url
            url: "https://images.squarespace-cdn.com/content/5f7f057b95eacf2e9c59bddd/62d50ae8-3611-46de-afd0-a9eb00b37a38/marker.png", // url
            scaledSize: new google.maps.Size(22, 30), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0), // anchor
          };

          // start first filter
          var firstFilterValue = element[7];
          var firstFilterCheckboxValue = firstFilterValue
            .toLowerCase()
            .replace(/\s/g, "");
          firstFilterCheckboxValue = firstFilterCheckboxValue
            .replaceAll(",", "-")
            .replaceAll("/", "-");
          firstFilterCheckboxValue = "first-" + firstFilterCheckboxValue;
          // end first filter

          // start second filter
          var secondFilterValue = element[8];
          var secondFilterCheckboxValue = secondFilterValue
            .toLowerCase()
            .replace(/\s/g, "");
          secondFilterCheckboxValue = secondFilterCheckboxValue
            .replaceAll(",", "-")
            .replaceAll("/", "-");
          secondFilterCheckboxValue = "second-" + secondFilterCheckboxValue;
          // end second filter

          // start third filter
          var thirdFilterValue = element[9];
          var thirdFilterCheckboxValue = thirdFilterValue
            .toLowerCase()
            .replace(/\s/g, "");
          thirdFilterCheckboxValue = thirdFilterCheckboxValue
            .replaceAll(",", "-")
            .replaceAll("/", "-");
          thirdFilterCheckboxValue = "third-" + thirdFilterCheckboxValue;
          // end third filter

          townsArray.push({
            townId: id,
            thirdFilterCheckboxValue: thirdFilterCheckboxValue,
            townName: town,
          });

          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            latitude: latitude,
            longitude: longitude,
            map: map,
            icon: icon,
            id: id,
            onlineName: onlineName,
            address: address,
            bedroomNumbers: bedroomNumbers,
            propertyType: propertyType,
            town: town,
            price: price,
            propertyUrl: propertyUrl,
            photo: photo,
            firstFilterCheckboxValue: firstFilterCheckboxValue,
            secondFilterCheckboxValue: secondFilterCheckboxValue,
            thirdFilterCheckboxValue: thirdFilterCheckboxValue,
            firstFilterVisibility: firstFilterVisibility,
            secondFilterVisibility: secondFilterVisibility,
            thirdFilterVisibility: thirdFilterVisibility,
            fourthFilterVisibility: fourthFilterVisibility,
          });

          // $(marker).attr(
          //   "data-first-type",
          //   "first-" + firstFilterCheckboxValue
          // );
          // $(marker).attr(
          //   "data-second-type",
          //   "first-" + secondFilterCheckboxValue
          // );

          allPointsAmount++;

          markers.push(marker);

          var infoWindow = new google.maps.InfoWindow(); //static infoWindow for all your markers
          // var currentInfoWindow;

          // var currentInfoWindow;

          marker.addListener(
            "click",
            (function (marker) {
              return function () {
                if (currentInfoWindow) {
                  currentInfoWindow.close();
                }
                // map.setZoom(7);
                // map.setCenter(marker.getPosition());
                // infoWindow.open(map, marker);
                // currentInfoWindow = infoWindow;

                infoWindow.setContent(
                  "<span class='popup-name'>" +
                    onlineName +
                    "</span><p class='popup-details'>Bedroom Numbers: " +
                    bedroomNumbers +
                    "</p><p class='popup-details'>Property Type: " +
                    propertyType +
                    "</p><p class='popup-details'>Price: " +
                    formatter.format(price) +
                    "</p><img class='popup-image' src='" +
                    photo +
                    "'><p class='popup-button'><a target='_blank' class='phone-call-button' href='" +
                    propertyUrl +
                    "'>View Property</a></p>"
                );

                if (currentInfoWindow) {
                  currentInfoWindow.close();
                }
                // map.setZoom(10);
                // map.setCenter(clickedMarker.getPosition());
                infoWindow.open(map, marker);
                currentInfoWindow = infoWindow;
              };
            })(marker)
          );

          // Add a marker clusterer to manage the markers.

          google.maps.event.addListener(map, "click", function (event) {
            infoWindow.close();
          });
        }
      });

      generatePointsdetailsList(markers);

      searchByName(markers);

      $("li").hover(function () {
        $("li").css("cursor", "pointer");
      });
      $("li").click(function () {
        var currentId = $(this).attr("id");
        var clickedMarker = markers[currentId - 1];

        infoWindow.setContent(
          "<span class='popup-name'>" +
            clickedMarker.onlineName +
            "</span><img class='popup-image' src='" +
            clickedMarker.photo +
            "'><p class='popup-button'><a target='_blank' class='phone-call-button' href='" +
            clickedMarker.propertyUrl +
            "'>View Property</a></p>"
        );

        // var currentInfoWindow;
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        // map.setZoom(10);
        // map.setCenter(clickedMarker.getPosition());
        infoWindow.open(map, clickedMarker);
        currentInfoWindow = infoWindow;
      });

      /////////first filter///////////
      $("input[type='checkbox'][name='filter-by-first-type-input']").click(
        function () {
          var currentlyDisplayedMarkers = [];
          var selectedCheckboxValue = $(this).attr("value");


          // var currentCountry = $(this).val();
          if ($(this).is(":checked")) {
            if (selectedCheckboxValue === "all-first-values") {
              $("input.first-input").prop("checked", true);
            }

            for (var i = 0; i < markers.length; i++) {
              if (
                markers[i].firstFilterCheckboxValue === selectedCheckboxValue ||
                selectedCheckboxValue === "all-first-values"
              ) {
                markers[i].firstFilterVisibility = true;
                if (
                  markers[i].secondFilterVisibility &&
                  markers[i].thirdFilterVisibility &&
                  markers[i].fourthFilterVisibility
                ) {
                  markers[i].setVisible(true);
                  $("li#" + markers[i].id).css("display", "block");
                  currentlyDisplayedMarkers.push(markers[i]);
                }
              }
              // else {
              //   if (markers[i].getVisible()) {
              //     currentlyDisplayedMarkers.push(markers[i]);
              //   }
              // }
            }
          } else {
            if (selectedCheckboxValue === "all-first-values") {
              $("input.first-input").prop("checked", false);
            }

            for (var i = 0; i < markers.length; i++) {
              if (
                markers[i].firstFilterCheckboxValue === selectedCheckboxValue ||
                selectedCheckboxValue === "all-first-values"
              ) {
                markers[i].setVisible(false);
                $("li#" + markers[i].id).css("display", "none");
                markers[i].firstFilterVisibility = false;
              }
              // else {
              //   if (markers[i].getVisible()) {
              //     currentlyDisplayedMarkers.push(markers[i]);
              //   }
              // }
            }
          }
        }
      );

      //////////second filter////////////

      $("input[type='checkbox'][name='filter-by-second-type-input']").click(
        function () {
          var currentlyDisplayedMarkers = [];
          var selectedCheckboxValue = $(this).attr("value");
        

          // var currentCountry = $(this).val();
      
          if ($(this).is(":checked")) {
            if (selectedCheckboxValue === "all-second-values") {
              $("input.second-input").prop("checked", true);
            }

            // if(selectedCheckboxValue = "all-second-values"){
            //   for (var i = 0; i < markers.length; i++){
            //     markers[i].secondFilterVisibility = true;
            //   }
            // }
            for (var i = 0; i < markers.length; i++) {
              if (
                markers[i].secondFilterCheckboxValue ===
                  selectedCheckboxValue ||
                selectedCheckboxValue === "all-second-values"
              ) {
                markers[i].secondFilterVisibility = true;
                if (
                  markers[i].firstFilterVisibility &&
                  markers[i].thirdFilterVisibility &&
                  markers[i].fourthFilterVisibility
                ) {
                  markers[i].setVisible(true);
                  $("li#" + markers[i].id).css("display", "block");
                  currentlyDisplayedMarkers.push(markers[i]);
                }
              }
              // else {
              //   if (markers[i].getVisible()) {
              //     currentlyDisplayedMarkers.push(markers[i]);
              //   }
              // }
            }
          } else {
            if (selectedCheckboxValue === "all-second-values") {
              $("input.second-input").prop("checked", false);
            }

            for (var i = 0; i < markers.length; i++) {
              if (
                markers[i].secondFilterCheckboxValue ===
                  selectedCheckboxValue ||
                selectedCheckboxValue === "all-second-values"
              ) {
                markers[i].setVisible(false);
                $("li#" + markers[i].id).css("display", "none");
                markers[i].secondFilterVisibility = false;
              }
              // else {
              //   if (markers[i].getVisible()) {
              //     currentlyDisplayedMarkers.push(markers[i]);
              //   }
              // }
            }
          }
        }
      );
      ///////////////////////////

      // start unique alphabetically array with objects

      var townsArrayUnique = Object.values(
        townsArray.reduce((acc, obj) => ({ ...acc, [obj.townName]: obj }), {})
      );

      $("#list3 ul.items").append(
        '<li><input class="third-input" name="filter-by-third-type-input" id="all-third-values" type="checkbox" value="all-third-values" checked /><label for="all-third-values">Select All</label></li>'
      );

      townsArrayUnique.forEach((currentTownElement) =>
        $("#list3 ul.items").append(
          '<li><input name="filter-by-third-type-input" class="third-input" id="' +
            currentTownElement.thirdFilterCheckboxValue +
            '" type="checkbox" value="' +
            currentTownElement.thirdFilterCheckboxValue +
            '" checked /><label for="' +
            currentTownElement.thirdFilterCheckboxValue +
            '">' +
            currentTownElement.townName +
            "</label></li>"
        )
      );
      // end unique alphabetically array with objects

      //////////third filter////////////

      $("input[type='checkbox'][name='filter-by-third-type-input']").click(
        function () {
          var currentlyDisplayedMarkers = [];
          var selectedCheckboxValue = $(this).attr("value");

   

          if ($(this).is(":checked")) {
            if (selectedCheckboxValue === "all-third-values") {
              $("input.third-input").prop("checked", true);
            }

     

            for (var i = 0; i < markers.length; i++) {
            
              if (
                markers[i].thirdFilterCheckboxValue === selectedCheckboxValue ||
                selectedCheckboxValue === "all-third-values"
              ) {
                markers[i].thirdFilterVisibility = true;
                if (
                  markers[i].firstFilterVisibility &&
                  markers[i].secondFilterVisibility &&
                  markers[i].fourthFilterVisibility
                ) {
                  markers[i].setVisible(true);
                  $("li#" + markers[i].id).css("display", "block");
                  currentlyDisplayedMarkers.push(markers[i]);
                }
              }
            }
          } else {
            if (selectedCheckboxValue === "all-third-values") {
              $("input.third-input").prop("checked", false);
            }

            for (var i = 0; i < markers.length; i++) {
              if (
                markers[i].thirdFilterCheckboxValue === selectedCheckboxValue ||
                selectedCheckboxValue === "all-third-values"
              ) {
                markers[i].setVisible(false);
                $("li#" + markers[i].id).css("display", "none");
                markers[i].thirdFilterVisibility = false;
              }
            }
          }
        }
      );
      ///////////////////////////

      // start fourth filter - price range filter

      // for (var i = 0; i < markers.length; i++) {
        let minValue = document.getElementById("min-value");
        let maxValue = document.getElementById("max-value");

        function validateRange(minPrice, maxPrice) {
            if (minPrice > maxPrice) {
                let tempValue = maxPrice;
                maxPrice = minPrice;
                minPrice = tempValue;
            }

            minValue.innerHTML = formatter.format(minPrice);
            maxValue.innerHTML = formatter.format(maxPrice);
        }

        const inputElements = document.querySelectorAll("input.price-input");

        inputElements.forEach((element) => {
            element.addEventListener("input", () => {
                let minPrice = parseInt(inputElements[0].value);
                let maxPrice = parseInt(inputElements[1].value);

                if (minPrice > maxPrice) {
                    if (element.classList.contains('min-price')) {
                        inputElements[1].value = minPrice;
                        maxPrice = minPrice;
                    } else {
                        inputElements[0].value = maxPrice;
                        minPrice = maxPrice;
                    }
                }

                validateRange(minPrice, maxPrice);

                var currentlyDisplayedMarkers = [];
                for (var i = 0; i < markers.length; i++) {
                    if (
                        minPrice <= parseInt(markers[i].price) &&
                        maxPrice >= parseInt(markers[i].price)
                    ) {
                        markers[i].fourthFilterVisibility = true;

                        if (
                            markers[i].firstFilterVisibility &&
                            markers[i].secondFilterVisibility &&
                            markers[i].thirdFilterVisibility
                        ) {
                            currentlyDisplayedMarkers.push(markers[i]);
                            markers[i].setVisible(true);
                            $("li#" + markers[i].id).css("display", "block");
                        }
                    } else {
                        markers[i].fourthFilterVisibility = false;
                        markers[i].setVisible(false);
                        $("li#" + markers[i].id).css("display", "none");
                    }
                }
            });
        });

       // Create our number formatter.
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

        // Initialize display values
        validateRange(parseInt(inputElements[0].value), parseInt(inputElements[1].value));
    
      // }

      // end price range filter
      // end fourth filter
    }
  );
}

// window.initMap = initMap;
// window.eqfeed_callback = eqfeed_callback;

function generatePointsdetailsList(currentlyDisplayedMarkers) {
  $("#points-list > ul").empty();
  currentlyDisplayedMarkers.forEach((currentlyDisplayedMarker) =>
    $("#points-list > ul").append(
      "<li id='" +
        currentlyDisplayedMarker.id +
        "'><div class='list-item-details'><p><a target='_blank' class='phone-call-button' href='" +
        currentlyDisplayedMarker.propertyUrl +
        "'>" +
        currentlyDisplayedMarker.onlineName +
        "</a></p></div></li>"
    )
  );
}

//////////////// open/close dropdown menu for first type filter
var checkList = document.getElementById("list1");
checkList.getElementsByClassName("anchor")[0].onclick = function (evt) {
  if (checkList.classList.contains("visible"))
    checkList.classList.remove("visible");
  else checkList.classList.add("visible");
};
//////////////

//////////// open/close dropdown menu for second type filter
var checkListTwo = document.getElementById("list2");
checkListTwo.getElementsByClassName("anchor")[0].onclick = function (evt) {
  if (checkListTwo.classList.contains("visible"))
    checkListTwo.classList.remove("visible");
  else checkListTwo.classList.add("visible");
};
////////////////

//////////// open/close dropdown menu for third type filter
var checkListThree = document.getElementById("list3");
checkListThree.getElementsByClassName("anchor")[0].onclick = function (evt) {
  if (checkListThree.classList.contains("visible"))
    checkListThree.classList.remove("visible");
  else checkListThree.classList.add("visible");
};
////////////////



function searchByName(data) {
  //creates a listener for when you press a key
  window.onkeyup = keyup;
  //creates a global Javascript variable
  var inputTextValue;
  function keyup(e) {
    //setting your input text to the global Javascript Variable for every key press
    inputTextValue = e.target.value;
    //listens for you to press the ENTER key, at which point your web address will change to the one you have input in the search box
    if (e.keyCode == 13) {
      // window.location = "http://www.myurl.com/search/" + inputTextValue;
      $(".mapboxgl-popup").remove();

      // search for point by name
      var positiveArray = data.filter(function (value) {
        return (
          value["onlineName"].toLowerCase() === inputTextValue.toLowerCase()
        );
      });


      var infoWindow = new google.maps.InfoWindow();

      positiveArray[0].addListener(
        "click",
        (function (value) {
          return function () {
            if (currentInfoWindow) {
              currentInfoWindow.close();
            }

            infoWindow.setContent(
              "<span class='popup-name'>" +
                positiveArray[0].onlineName +
                "</span><img class='popup-image' src='" +
                positiveArray[0].photo +
                "'><p class='popup-button'><a target='_blank' class='phone-call-button' href='" +
                positiveArray[0].propertyUrl +
                "'>View Property</a></p>"
            );

            if (currentInfoWindow) {
              currentInfoWindow.close();
            }
            infoWindow.open(map, positiveArray[0]);
            currentInfoWindow = infoWindow;
          };
        })(positiveArray[0])
      );

      // Add a marker clusterer to manage the markers.

      google.maps.event.trigger(positiveArray[0], "click");

      google.maps.event.addListener(map, "click", function (event) {
        infoWindow.close();
      });

      map.setCenter({
        lat: parseFloat(positiveArray[0].latitude),
        lng: parseFloat(positiveArray[0].longitude),
      });
      map.setZoom(18);
    }
  }
  // end listener when you press a key
}

$("div.gmnoprint").last().parent().wrap('<div id="newPos">Desi</div>');
