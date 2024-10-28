// Start updating the compass
function startCompass() {
    // Start the recursive animation loop
    function updateCompass() {
        getPlayerPosition()
            .then(playerPosition => {
                // Target model's latitude and longitude
                const modelLat = 1.308649149724571;
                const modelLng = 103.8495541458054;
                
                // Update arrow UI with the latest player position and model position
                updateArrowUI(playerPosition, modelLat, modelLng);

                // Schedule the next update
                requestAnimationFrame(updateCompass);
            })
            .catch(error => {
                console.error("Error fetching player position:", error);
            });
    }

    // Start the loop
    updateCompass();
}

function getPlayerPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const playerPos = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    resolve(playerPos);
                },
                (err) => {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                    reject(err);
                },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            reject(new Error("Geolocation unsupported"));
        }
    });
}

function updateArrowUI(playerPosition, modelLat, modelLng) {
    // Calculate the bearing angle to rotate the arrow
    const modelPos = { lat: modelLat, lng: modelLng };
    const rotationAngle = calculateBearing(playerPosition, modelPos);

    // Apply the rotation to the arrow
    const arrow = document.querySelector(".arrow");
    arrow.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg)`;
}

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

// Initialize the compass rotation
startCompass();
