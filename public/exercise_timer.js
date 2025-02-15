let videos = [
    {
        videoPath: "./gifs/ladkajumpingjacks.mp4", // Path to the video file
        heading:"JUMPING JACKS",
        instruction1: "Watch the video carefully.",
        instruction2: "Focus on the key concepts.",
        instruction3: "Take notes while watching.",
        set: 0, // Set identifier
        rep:0,
        tminutes: 0, // Total minutes for the video
        tseconds: 10, // Total seconds for the video
    },
    {
        videoPath: "./gifs/male_biceps_vid.mp4",
        heading:"Dumblee Biceps",
        instruction1: "Observe the experiment.",
        instruction2: "Understand the procedure.",
        instruction3: "Analyze the results.",
        set: 3,
        rep:12,
        tminutes: 0,
        tseconds: 0,
    },
    {
        videoPath: "./gifs/male_rug_vid.mp4",
        heading:"RUG",
        instruction1: "Listen to the explanation.",
        instruction2: "Pay attention to the examples.",
        instruction3: "Try to relate the concepts to real life.",
        set: 2,
        rep:12,
        tminutes: 0,
        tseconds: 0,
    },
    {
        videoPath: "./gifs/male_shoulders_vid.mp4",
        heading:"SHOULDER",
        instruction1: "Identify the main points.",
        instruction2: "Pause and reflect if needed.",
        instruction3: "Summarize the content after watching.",
        set: 3,
        rep:10,
        tminutes: 1,
        tseconds: 0,
    },
    {
        videoPath: "./gifs/male_triceps_vid.mp4",
        heading:"TRICEPS",
        instruction1: "Observe the problem-solving steps.",
        instruction2: "Try solving a similar problem.",
        instruction3: "Check your understanding with examples.",
        set: 3,
        rep:12,
        tminutes: 0,
        tseconds: 0,
    }
];

//freeze for stopping time
let timersFrozen = false;
exercisedone = 0;

//counter for uselesstimer


//prev next buttons
let prevbtn = document.querySelector(".prevbtn");
let nextbtn = document.querySelector(".nextbtn"); 

//logic for next vedio
function NextVideo() {
    if (currentIndex < videos.length - 1) {
        currentIndex++;
    } 
    clearInterval(timerp);
    updateVideo();
    processVideos();//displaying propercontainers
}

// Event listener for "Next" button
nextbtn.addEventListener("click", NextVideo);

//logic for previous vedio
function prevVideo() {
    if (currentIndex > 0) {
        currentIndex--; 
    } 
    clearInterval(timerp);
    updateVideo();
    processVideos();//displaying proper containers
}

prevbtn.addEventListener("click", prevVideo);



//upar ke dash vala section
let dashcontainer = document.getElementById("dash-container"); //for exercise counter display on the top
let dashElements = []; // Store the <hr> elements for later reference
// Loop through the videos array and create elements
videos.forEach((vedio, index) => {
    let hr = document.createElement("hr");
    dashcontainer.appendChild(hr);
    hr.classList.add("dash");
    
    dashElements.push(hr);

    hr.addEventListener("click", function() {
        currentIndex = index;
        clearInterval(timerp);
        updateVideo(); 
        processVideos();
    });
});



//gif and names update
let gifBox = document.querySelectorAll(".gif-box");
let currentIndex = 0; // Track the current video index
let nextexercisename = document.querySelectorAll(".next-exercise-name");//exercise name store karne ke liye
let repsinfo = document.querySelector(".repsinfo");//reps info store karne ke liye
let asking = document.querySelector(".asking");//ready to go vala words hatane ke liye
let timep = document.querySelector(".time");//progress bar ka timer display
let instructionmaincontainer = document.querySelector(".instruction-main-container"); //instructiondisplay ka dibba
let donefortheday = document.getElementById("donefortheday");

function updateVideo() {
    let currentVideo = videos[currentIndex]; 

    console.log(currentIndex);

    if (gifBox.length > 0) {
        gifBox.forEach(gifBox => {
    gifBox.innerHTML = `
        <video class="full-screen-video" src="${currentVideo.videoPath}" autoplay loop muted playsinline></video>
         `;
      });
    }

    //updating instructions for each exercise
    let instructionList = document.querySelector(".instructionlist"); 
    instructionList.innerHTML = ""; 
    for (let i = 1; i <= 3; i++) {
        let instructionText = currentVideo[`instruction${i}`]; 

        if (instructionText) { 
            let li = document.createElement("li");
            li.textContent = instructionText; 
            instructionList.appendChild(li); 
        }
    }

    //updating exercise name
    nextexercisename.forEach(element => {
        element.innerHTML = currentVideo.heading;
    });
    
    repsinfo.innerHTML = `${currentVideo.set} x ${currentVideo.rep}`;//updating reps

    dashElements.forEach((dash, index) => {
        if (index <= currentIndex) {
            dash.classList.add("active");
        } else {
            dash.classList.remove("active"); 
        }
    });
    
    // Handle "Previous" button visibility
    prevbtn.style.display = (currentIndex === 0) ? 'none' : "inline-block";

    // Handle "Next" button visibility
    nextbtn.style.display = (currentIndex === videos.length - 1) ? 'none' : "inline-block";

    
 
}

updateVideo();//this is called only once for the first vedio display// yeh hona chahiye


//taking containers for reference
//progress bar
let mainprogressbarcontainer = document.querySelector(".main-progress-container");



//buttons vala sction for rep exercises
let mainbuttoncontainer = document.querySelector(".main-button-container");


//check kar raha hai ki progress bar display karu ki button ko
function processVideos() {
    // if (currentIndex >= videos.length) return; // Stop when all videos are processed

    let video = videos[currentIndex];

    if (video.set !== 0) {
        mainbuttoncontainer.style.display = 'flex';
        mainprogressbarcontainer.style.display = 'none';
        repsinfo.style.display = 'flex';
        timep.style.display = 'none';
        donebtn.style.display ='flex';
        donefortheday.style.display = 'none'; 
    
        if(currentIndex === videos.length - 1) 
        {
            donebtn.style.display ='none';
            donefortheday.style.display = 'flex';
        }
         
    
    } else {
       mainprogressbarcontainer.style.display = 'flex';
       mainbuttoncontainer.style.display = 'none'; 
       repsinfo.style.display = 'none';
       timep.style.display = 'flex';
       startprogressbar(0,video.tminutes, video.tseconds); 
    }

}

//first time timer for getting ready
let exercisecontainer = document.querySelector(".exercise-container"); 
const semicircle = document.querySelectorAll('.semi-circle');
let timer = document.querySelector(`.timer`);
let maintimercontainer = document.querySelector(".main-timer-container"); 

let firsttime =0;

const hr = 0;
const min = 0;
const sec = 5;//initializing time

let setTime = (hr * 3600000) +(min * 60000) + (sec * 1000);

let lastPausedSeconds = sec; // Store last displayed value
let futureTimecd = Date.now() + setTime;
let timerLoop;

function countDownTimer() {

    dashcontainer.style.display = 'none';
    prevbtn.style.display = 'none';
    nextbtn.style.display = 'none';
    // exercisecontainer.style.display = 'flex';
    
    // If the timer is frozen, skip the rest of the function
    if (timersFrozen) return;

    timerLoop = setInterval(() => {
    const currentTime = Date.now();
   
  

    const remainingTime = futureTimecd - currentTime;
    const angle = (remainingTime / setTime) * 360;
    
    lastPausedSeconds = Math.floor((remainingTime / 1000) % 60); // Store last displayed time
    timer.innerHTML = `<div>${lastPausedSeconds}</div>`;

    //progress indicator
    if (angle > 180) {
        semicircle[2].style.display = 'none';
        semicircle[0].style.transform = 'rotate(180deg)';
        semicircle[1].style.transform = `rotate(${angle}deg)`; // Corrected syntax
    } else {
        semicircle[2].style.display = 'block';
        semicircle[0].style.transform = `rotate(${angle}deg)`; // Corrected syntax
        semicircle[1].style.transform = `rotate(${angle}deg)`; // Corrected syntax
    }

    // 5 sec condition
    // if(remainingTime <= 5000){
    //     semicircle[0].style.backgroundColor = 'red';
    //     semicircle[1].style.backgroundColor = 'red';
    //     timer.style.color = 'red';
    // }

    //end
    if (remainingTime < 0){
        clearInterval(timerLoop);
        semicircle[0].style.display = 'none';
        semicircle[1].style.display = 'none';
        semicircle[2].style.display = 'none';
    
        timer.innerHTML= `
        <div>0</div>
        `;

        maintimercontainer.style.display ='none';//once timer runs out then yeh timer vapis nai dikhna chahiye
        asking.style.display = 'none';//once timer runs out then yeh timer vapis nai dikhna chahiye
        dashcontainer.style.display = 'flex';//once timer runs out then yeh dikhna chahiye
        nextbtn.style.display = 'flex';//once timer runs out then yeh button dikhna chahiye
        firsttime =1;
        processVideos();
    }
 
 });//iss bracket ke andar 1000 likha then har 1 sec baad yeh function call hoga
    
}

countDownTimer();//call once only
 
//progressbar ke chize
//progress bar

let progressBar = document.getElementById("progress-bar");
let pauseBtn = document.getElementById("pause-btn");
let futureTimep;
let setTimep;
let timerp;
let lastPausedSecondsp = 0; // Store the last time before pausing not using yet

function startprogressbar(hours, minutes, seconds) {
    const hoursMs = hours * 3600000;
    const minutesMs = minutes * 60000;
    const secondsMs = seconds * 1000;
    
    setTimep = hoursMs + minutesMs + secondsMs;
    futureTimep = Date.now() + setTimep;

    // Reset progress bar to 0% before starting
    progressBar.style.width = "0%";
    
    // Start the progress bar update
    timerp = requestAnimationFrame(updateProgressBar);
}

function updateProgressBar() {
    if (timersFrozen) return; // Stop if paused or stopped

    let currentVideo = videos[currentIndex];
     
    timep.innerHTML = `
        <div>${currentVideo.tminutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</div>
        <div class="colonp">:</div>
        <div>${currentVideo.tseconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</div>
        `;


    timerp = setInterval(() => {
        
        const currentTime = Date.now();
        const remainingTime = Math.max(0, futureTimep - currentTime); // Ensure no negative values
        const percent = ((setTimep - remainingTime) / setTimep) * 100;

        const mins = Math.floor((remainingTime / (1000 * 60)) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        const secs = Math.floor((remainingTime / 1000) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });


        if (remainingTime > 0) {
            
            progressBar.style.width = `${percent}%`;
            // timep.innerHTML = `
            // <div>${mins}</div>
            // <div class="colonp">:</div>
            // <div>${secs}</div>
            // `;
            setTimeout(() => {
                timep.innerHTML = `
                    <div>${mins}</div>
                    <div class="colonp">:</div>
                    <div>${secs}</div>
                `;
            }, 1000); // Delays update by 1 second
        } 
        else  {
            progressBar.style.width = "100%"; // Ensure full width at end
            timep.innerHTML = `
            <div>00</div>
            <div class="colonp">:</div>
            <div>00</div>
            `;
            console.log("khatam ho gaya");
            clearInterval(timerp);
            // resttimetimer();
            setTimeout(resttimetimer, 1000); // Delays function call by 1 second
        }
    },1000); // Update every second
}


//now for rep exercises
let donebtn = document.querySelector(".donebtn");

donebtn.addEventListener("click", function() {
    // Call the function you want when the button is clicked
    resttimetimer();  
});



//restime 
let futureTimerest; // Future time to track when the timer should end
let timerInterval; // Variable to store the interval ID
let samay = document.querySelector('.samay'); // Assuming you have an element with class 'samay' for displaying the time
let resttimemaincontainer = document.querySelector('.resttime-main-container'); // Assuming the container for the timer
let addTimeBtn = document.getElementById('add20sec'); // Button to add 30 seconds

function resttimetimer() {
    resttimemaincontainer.style.display = 'flex';
    exercisecontainer.style.display = 'none';
    
    exercisedone++;
    console.log("exercisedone = " + exercisedone);

    if (currentIndex < videos.length - 1) {
        currentIndex++;
        updateVideo();
    } 
    
    //  currentIndex++;
    //  updateVideo();

    futureTimerest = Date.now() + 1 * 60 * 1000; // 1 minutes in millisecond

    // Update the timer every second
    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const remainingTime = futureTimerest - currentTime; // Time left in milliseconds

        // If time is up, stop the interval and reset the display
        if (remainingTime <= 0) {
            samay.innerHTML = `
                <div>00</div>
                <div class="colonp">:</div>
                <div>00</div>
            `;
            skip();
        } else {
            // Calculate minutes and seconds
            const minutes = Math.floor(remainingTime / 60000).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
            const seconds = Math.floor((remainingTime % 60000) / 1000).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

            // Update the timer display
            samay.innerHTML = `
                <div>${minutes}</div>
                <div class="colonp">:</div>
                <div>${seconds}</div>
            `;
        }
    }, 1000); // Update every second
}


//adding 20 seconds to the resrt time
addTimeBtn.addEventListener('click', () => {
    futureTimerest += 30 * 1000; // Add 30 seconds (30000 milliseconds) to the future timer
});


let skipbtn = document.getElementById("skip");

skipbtn.addEventListener("click", function() {
    // Call the function you want when the button is clicked
    skip();  // Replace 'yourFunctionName' with the actual function name
});

function skip() {
    resttimemaincontainer.style.display = 'none';
    exercisecontainer.style.display = 'flex';

    clearInterval(timerInterval);//clear restimetimer
    processVideos();

}

// Freeze/Unfreeze the timer
function toggleFreezeTimer() {
    timersFrozen = !timersFrozen; 
    if (timersFrozen) {
        instructionmaincontainer.style.display = 'flex';
    } else {
        instructionmaincontainer.style.display = 'none';
        if(firsttime === 0){
            return;
        }else{
            clearInterval(timep);    
            processVideos();
        }
    }
}

// button to freeze/unfreeze the timer
document.querySelectorAll(".close").forEach(button => {
    button.addEventListener("click", toggleFreezeTimer);
});

document.querySelectorAll(".controls").forEach(button => {
    button.addEventListener("click", toggleFreezeTimer);
});




//final message
donefortheday.addEventListener('click', () => {
    exercisedone++;
    showFinalMessage();  // Call calculateScore when submit button is clicked
});

let finalMessage = document.getElementById("final-message");
let finalMessage2 = document.getElementById("final-message2");
let finalmarks_container = document.getElementById("finalmarks-container");

// Function to display the final message based on the score
const showFinalMessage = () => {
    
    // Display the final marks container

    exercisecontainer.style.display = "none";
    // resttimemaincontainer.style.display = "none"; // Hide the quiz section
    finalmarks_container.style.display = "flex"; // display the result section

   // Set the message based on the score
    if (exercisedone >= 5) {
      finalMessage.innerHTML = `Great job! You've completed the whole workout.`;
      finalMessage2.innerHTML =` You did ${exercisedone} exercises. Keep it up!`;
    } else if (exercisedone >= 3) {
      finalMessage.innerHTML = `Good effort! You did ${exercisedone} exercises.`;
      finalMessage2.innerHTML =`Don't worry, keep it up!`;
    } else{
      finalMessage.innerHTML = `Oops! You did only ${exercisedone} exercises.`;
      finalMessage2.innerHTML = `Push yourself and surpass your limits`;
    }
    
};