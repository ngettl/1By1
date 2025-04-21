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

let leftMuchButton = document.getElementById("leftMuch");
let leftLittleButton = document.getElementById("leftLittle");
let equalButton = document.getElementById("equal");
let rightLittleButton = document.getElementById("rightLittle");
let rightMuchButton = document.getElementById("rightMuch");

let modBArr = [false, false, false];
let ratings = [];
let players = [];

let currentNum = 0;
let images = [];
let currentPair = [0, 1]; // Track current pair of images
let allImagePairs = []; // Track all image pairs shown

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
    if(ratings.length == 15){ // 15 comparisons
        leftMuchButton.disabled = true;
        leftLittleButton.disabled = true;
        equalButton.disabled = true;
        rightLittleButton.disabled = true;
        rightMuchButton.disabled = true;
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

// Event listeners for comparison buttons
leftMuchButton.addEventListener("click", function(){
    ratings[currentNum] = "left_much";
    currentNum++;
    updateButtons();
    updateCounter();
    updatePrevRating();
    checkFullFormCompletion();
    updateImages();
});

leftLittleButton.addEventListener("click", function(){
    ratings[currentNum] = "left_little";
    currentNum++;
    updateButtons();
    updateCounter();
    updatePrevRating();
    checkFullFormCompletion();
    updateImages();
});

equalButton.addEventListener("click", function(){
    ratings[currentNum] = "equal";
    currentNum++;
    updateButtons();
    updateCounter();
    updatePrevRating();
    checkFullFormCompletion();
    updateImages();
});

rightLittleButton.addEventListener("click", function(){
    ratings[currentNum] = "right_little";
    currentNum++;
    updateButtons();
    updateCounter();
    updatePrevRating();
    checkFullFormCompletion();
    updateImages();
});

rightMuchButton.addEventListener("click", function(){
    ratings[currentNum] = "right_much";
    currentNum++;
    updateButtons();
    updateCounter();
    updatePrevRating();
    checkFullFormCompletion();
    updateImages();
});

prevButton.addEventListener("click", function(){
    if (currentNum > 0) {
        currentNum--;
        while (ratings[currentNum] === undefined && currentNum > 0) {
            currentNum--;
        }
        if (ratings[currentNum] !== undefined) {
            currentRating.hidden = false;
            currentRating.innerHTML = `Previous Selection: ${ratings[currentNum]}`;
        }
    }
    updateButtons();
    updateCounter();
    updateImages();
});

nextButton.addEventListener("click", function(){
    if (currentNum < 15) { // 15 comparisons
        currentNum++;
    }
    updateButtons();
    updateCounter();
    updatePrevRating();
    updateImages();
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
    progressFraction.innerHTML = `Current Comparison: ${currentNum} /15`;
    let progressPercentage = Math.round((currentNum / 15) * 100);
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
        currentRating.innerHTML = `Previous Selection: ${ratings[currentNum-1]}`;
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
    const playerImage1 = document.getElementById("PlayerImage1");
    const playerImage2 = document.getElementById("PlayerImage2");

    // Fetch the JSON file for images
    fetch("https://bmicardratingscomparison.netlify.app/images.json")
        .then(response => response.json())
        .then(data => {
            images = getUniqueRandomImages(data.images, 30);
            if (images.length > 0) {
                updateImages();
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

// Function to update both images
function updateImages() {
    const playerImage1 = document.getElementById("PlayerImage1");
    const playerImage2 = document.getElementById("PlayerImage2");
    
    // Calculate the next pair of images to show
    currentPair = [currentNum * 2, currentNum * 2 + 1];
    
    // Store the current image pair
    if (currentNum < 15) { // Only store pairs for actual comparisons
        allImagePairs[currentNum] = [images[currentPair[0]], images[currentPair[1]]];
    }
    
    // Ensure there are images in the array and currentNum is within bounds
    if (images.length > 0 && currentPair[0] < images.length && currentPair[1] < images.length) {
        playerImage1.src = BASE_URL + "/" + images[currentPair[0]];
        playerImage2.src = BASE_URL + "/" + images[currentPair[1]];
    }
}

// Handle the login modal submission and transition
submitMod.addEventListener("click", function () {
    // Close the modal after submission
    var infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
    infoModal.hide();  // Hide the modal after submitting

    // Remove the login screen transition since it doesn't exist
    // document.getElementById("loginScreen").style.display = "none";
    // document.getElementById("mainApp").style.display = "block";
});

// Handle window close event
closeWindowB.addEventListener("click", function () {
    const now = new Date();
    const dateG = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    const timeG = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
    // Prepare data for Google Sheets
    const data = {
        firstName: first.value,
        lastName: second.value,
        email: email.value,
        date: dateG,
        time: timeG,
        ratings: ratings.join(','),
        imagePairs: allImagePairs.map(pair => pair.join('|')).join(',')
    };

    // Show loading state
    closeWindowB.disabled = true;
    closeWindowB.textContent = "Submitting...";

    // Send data to Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbySbQmLYBVDeuQwG8t45yxiwUECpEh4jExn-S10cKOLUqYZtHlwSyNl3fn7ZnaC_OSPcA/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'firstName': data.firstName,
            'lastName': data.lastName,
            'email': data.email,
            'date': data.date,
            'time': data.time,
            'ratings': data.ratings,
            'imagePairs': data.imagePairs
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        return response.text();
    })
    .then(text => {
        console.log('Raw response:', text);
        try {
            const data = JSON.parse(text);
            console.log('Parsed response:', data);
            alert('Thank you! Your responses have been recorded.');
            window.close();
        } catch (e) {
            console.log('Response text:', text);
            // Even if we can't parse the response, assume success if we got this far
            alert('Thank you! Your responses have been recorded.');
            window.close();
        }
    })
    .catch((error) => {
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        // Only show error message if it's not a CORS-related error
        if (error.message !== 'HTTP error! status: 0') {
            alert('There was an error submitting your responses. Please try again or contact the administrator.');
            closeWindowB.disabled = false;
            closeWindowB.textContent = "Submit Results";
        } else {
            // For CORS errors, assume the data was sent successfully
            alert('Thank you! Your responses have been recorded.');
            window.close();
        }
    });
});
