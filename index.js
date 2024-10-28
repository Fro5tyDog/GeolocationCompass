// Start by fetching the player's position and updating the arrow direction repeatedly
async function startCompass() {
    try {
        // Fetch the player's position once
        const playerPosition = await getPlayerPosition();

        // Start updating the arrow direction
        updateArrowUI(playerPosition, 1.30864, 103.84955);
        requestAnimationFrame(startCompass);
    } catch (error) {
        console.error("Error fetching player position:", error);
    }
}

function getPlayerPosition(){
    return new Promise((resolve, reject) => {
        try{
             if(navigator.geolocation){

                const options = {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                  };
                  
                  function success(pos) {
                    const position = pos.coords;
                  
                    console.log("Your current position is:");
                    console.log(`Latitude : ${position.latitude}`);
                    console.log(`Longitude: ${position.longitude}`);
                    console.log(`More or less ${position.accuracy} meters.`);

                    const playerPos = {
                        lat: position.latitude, 
                        lng: position.longitude
                    };
                    resolve(playerPos);
                  }
                  
                  function error(err) {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                    reject(err);
                  }

                  navigator.geolocation.getCurrentPosition(success, error, options);
                  
             } else {
                console.error("Geolocation is not supported by this browser.");
                reject(false);
             }
        } 
        catch(error){
            reject(error);
        }   
    })
}


function updateArrowUI(playerPosition, modelLat, modelLng) {
    // Calculate the bearing and update the arrow rotation

    // Point from here (Gare du Nord, Paris)
    var phoneLatitude = playerPosition.lat;
    var phoneLongitude = playerPosition.lng;

    // Point to here (Musée du Louvre, Place du Carrousel, Paris, France)
    var destinationLatitude =  modelLat;
    var destinationLongitude = modelLng;

    // const rotationAngle = calculateBearing(playerPosition, modelPos);
    var arrowAngle = bearing(phoneLatitude, phoneLongitude, destinationLatitude, destinationLongitude);

    // Apply the rotation to the arrow
    // const arrow = document.querySelector(".arrow");
    // arrow.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg)`;

    var element = document.querySelector('.arrow');
    element.style['transform'] = 'rotate(' + arrowAngle + 'deg)';

    // var info = document.querySelector(".h1");
    // info.innerHTML = "Longitude = " + phoneLongitude + "<br/>Latitude = " + phoneLatitude + "<br/>Arrow angle = " + arrowAngle;
    
}

// function calculateArrowRotation() {
//     // Point from here (Arc de Triomph, Paris)
//     // var phoneLatitude = 48.873934;
//     // var phoneLongitude = 2.2949;

//     // Point from here (Gare du Nord, Paris)
//     // var phoneLatitude = 48.87977;
//     // var phoneLongitude = 2.355752;

//     // // Point to here (Musée du Louvre, Place du Carrousel, Paris, France)
//     // var destinationLatitude =  48.861519;
//     // var destinationLongitude = 2.3345495;

//     var arrowAngle = bearing(phoneLatitude, phoneLongitude, destinationLatitude, destinationLongitude);

//     var element = document.getElementById('arrow');
//     element.style['transform'] = 'rotate(' + arrowAngle + 'deg)';

//     var info = document.getElementById("info");
//     info.innerHTML = "Longitude = " + phoneLongitude + "<br/>Latitude = " + phoneLatitude + "<br/>Arrow angle = " + arrowAngle;
// }

function bearing(lat1,lng1,lat2,lng2) {
    var dLon = toRad(lng2-lng1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var rad = Math.atan2(y, x);
    var brng = toDeg(rad);
    return (brng + 360) % 360;
}

function toRad(deg) {
     return deg * Math.PI / 180;
}

function toDeg(rad) {
    return rad * 180 / Math.PI;
}    

// Initialize the compass rotation
startCompass();

