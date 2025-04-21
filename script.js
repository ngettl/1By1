
let nextButton = document.getElementById("nextButton");
let prevButton = document.getElementById("prevButton");
let progressBar = document.getElementById("progressBar");
let closeMod = document.getElementById("closeModalB");
let submitMod = document.getElementById("submitModB");
let first = document.getElementById("firstName");
let second = document.getElementById("lastName");
let email = document.getElementById("email");
let progressFraction = document.getElementById("progressFraction");
let currentRating = document.getElementById("currentRating");
let info = document.getElementById("info");
let closeWindowB = document.getElementById("closeWindowB");

let r5 = document.getElementById("5");
let r4 = document.getElementById("4");
let r3 = document.getElementById("3");
let r2 = document.getElementById("2");
let r1 = document.getElementById("1");

let modBArr = [false, false, false];
let ratings = [];3
let players = [];

let currentNum = 0;
let images = [];

const BASE_URL = "https://bmicardratings.netlify.app/front_cards";

// Function to check if all fields are filled
function checkFormCompletion() {
    if (modBArr.every(val => val === true)) {
        submitMod.disabled = false;
        closeMod.disabled = false;
    } else {
        submitMod.disabled = true;
        closeMod.disabled = true;
    }
}

function checkFullFormCompletion(){
    if(ratings.length == 30){
        r1.disabled = true;
        r2.disabled = true;
        r3.disabled = true;
        r4.disabled = true;
        r5.disabled = true;
        prevButton.disabled = true;
        nextButton.disabled = true;
        info.disabled = true;
        var completionModal = new bootstrap.Modal(document.getElementById('completionModal'));
        completionModal.show();
    }
}

// Attach event listeners to input fields
first.addEventListener("input", function () {
    modBArr[0] = this.value.trim() !== "";
    checkFormCompletion();
});

second.addEventListener("input", function () {
    modBArr[1] = this.value.trim() !== "";
    checkFormCompletion();
});

email.addEventListener("input", function () {
    modBArr[2] = this.value.trim() !== "";
    checkFormCompletion();
});

// Event listeners for rating buttons
r5.addEventListener("click", function(){
    ratings[currentNum] = 5;
    currentNum++;
    updateButtons();
    updateCounter();
    updatePrevRating();
    checkFullFormCompletion();
    updateImage();
});
r4.addEventListener("click", function(){
    ratings[currentNum] = 4;
    currentNum++;
    updateButtons();
    updateCounter();
    updatePrevRating();
    checkFullFormCompletion();
    updateImage();
});
r3.addEventListener("click", function(){
    ratings[currentNum] = 3;
    currentNum++;
    updateButtons();
    updateCounter();
    updatePrevRating();
    checkFullFormCompletion();
    updateImage();
});
r2.addEventListener("click", function(){
    ratings[currentNum] = 2;
    currentNum++;
    updateButtons();
    updateCounter();
    updatePrevRating();
    checkFullFormCompletion();
    updateImage();
});
r1.addEventListener("click", function(){
    ratings[currentNum] = 1;
    currentNum++;
    updateButtons();
    updateCounter();
    updatePrevRating();
    checkFullFormCompletion();
    updateImage();
});

prevButton.addEventListener("click", function(){
    if (currentNum > 0) {
        currentNum--;
        while (ratings[currentNum] === undefined && currentNum > 0) {
            currentNum--;
        }
        if (ratings[currentNum] !== undefined) {
            currentRating.hidden = false;
            currentRating.innerHTML = `Selected Rating: ${ratings[currentNum]}`;
        }
    }
    updateButtons();
    updateCounter();
    updateImage();
});

nextButton.addEventListener("click", function(){
    if (currentNum < images.length - 1) {
        currentNum++;
    }
    updateButtons();
    updateCounter();
    updatePrevRating();
    updateImage();
});

// The logic for enabling/disabling buttons based on ratings and navigation
updateButtons = () => {
    // Disable "Previous" if no rating exists for the previous image
    if(ratings[currentNum - 1] == undefined){
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    // Enable "Next" if a rating exists for the current image, or if a rating exists for the previous image
    if(ratings[currentNum] != undefined){
        nextButton.disabled = false;
    } else {
        nextButton.disabled = true;
    }
};

// Update progress bar and display progress
updateCounter = () => {
    progressFraction.innerHTML = `Current Rating: ${currentNum} /30`;
    let progressPercentage = Math.round((currentNum / 30) * 100);
    progressBar.style = `width: ${progressPercentage}%`;

    // Ensure progress bar reaches 100% when all ratings are completed
    if (progressPercentage === 100) {
        progressBar.style = `width: 100%`;
    }
};

// Display previous rating
updatePrevRating = () => {
    if (ratings[currentNum - 1] !== undefined) {
        currentRating.hidden = false;
        currentRating.innerHTML = `Previous Rating: ${ratings[currentNum-1]}`;
    }
};

// Show modal on page load
document.addEventListener("DOMContentLoaded", function () {
    // Show the login modal
    var infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
    infoModal.show();
});

// Fetch images and handle image navigation
document.addEventListener("DOMContentLoaded", function () {
    const playerImage = document.getElementById("PlayerImage");

    // Fetch the JSON file for images
    fetch("https://bmicardratings.netlify.app/images.json")
        .then(response => response.json())
        .then(data => {
            images = getUniqueRandomImages(data.images, 30);
            if (images.length > 0) {
                playerImage.src = BASE_URL + "/" + images[currentNum];
            }
        })
        .catch(error => console.error("Error loading images:", error));

    // Function to get unique random images (ensures no duplicates per player)
    function getUniqueRandomImages(imageList, count) {
        let uniqueImages = {};
        let filteredImages = [];

        imageList.forEach(filename => {
            let playerName = filename.split("-")[0]; // Extract player identifier before '-'
            if (!uniqueImages[playerName]) {
                uniqueImages[playerName] = filename; // Store first occurrence
            }
        });

        filteredImages = Object.values(uniqueImages); // Get unique player images

        // Shuffle the array randomly
        filteredImages.sort(() => Math.random() - 0.5);

        return filteredImages.slice(0, count); // Select 30 random images
    }
});

// Function to update the image
function updateImage() {
    const playerImage = document.getElementById("PlayerImage");
    
    // Ensure there are images in the array and currentNum is within bounds
    if (images.length > 0 && currentNum >= 0 && currentNum < images.length) {
        playerImage.src = BASE_URL + "/" + images[currentNum];
    }
}

// Handle the login modal submission and transition
submitMod.addEventListener("click", function () {
    // Close the modal after submission
    var infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
    infoModal.hide();  // Hide the modal after submitting

    // Transition to next screen, if needed
    document.getElementById("loginScreen").style.display = "none"; // Hide the login screen
    document.getElementById("mainApp").style.display = "block"; // Show the main application screen
});

// Handle window close event
closeWindowB.addEventListener("click", function () {
    const now = new Date();
    const dateG = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    const timeG = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    closeWindowB.disabled = true;
    console.log(images);
    let data = {
        firstName: first.value.trim(),
        lastName: second.value.trim(),
        email: email.value.trim(),
        ratings: ratings, // Array of ratings
        players: images,// Array of image filenames in order
        time: timeG,
        date: dateG
    };

    console.log("Sending data to Google Sheets:", data); // Debug log

    fetch("https://script.google.com/macros/s/AKfycbw6cZkCgHjvW4HBMKFe6ge3tvMh0dcbIlVCWKT_hCzySnR-Cm8YhENHN-JSUSNyIQ/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(() => {
        console.log("Data sent to Google Sheets");
        window.close(); // Close the window after sending
    })
    .catch(error => console.error("Error sending data:", error));
});
