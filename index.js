const playerPosition = getPlayerPosition();
updateArrowUI(playerPosition, 1.308649149724571, 103.8495541458054,); 

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
    // Update arrow rotation

    const modelPos = {
        lat: modelLat,  // adjust if necessary based on your data structure
        lng: modelLng
    };
    const rotationAngle = calculateBearing(playerPosition, modelPos);
    const arrow = document.querySelector(".arrow");
    // rotationAngle += 1; // Increment the rotation angle
    arrow.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg)`;

    // Keep the rotation between 0 and 360 degrees
    // if (rotationAngle >= 360) {
    //     rotationAngle = 0; // Reset to 0 after a full rotation
    // }

    // Call the function recursively on each animation frame
    requestAnimationFrame(updateArrowUI);
}

// functions to calcuate angle the arrow should rotate.
function calculateBearing(playerPos, modelPos) {
    const lat1 = toRadians(playerPos.lat);
    const lat2 = toRadians(modelPos.lat);
    const deltaLon = toRadians(modelPos.lng - playerPos.lng);

    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - 
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
    const bearing = Math.atan2(y, x);
    
    // Convert from radians to degrees and normalize between 0-360
    return (toDegrees(bearing) + 360) % 360;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}