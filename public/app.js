const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar(){
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')

  closeAllSubMenus()
}

function toggleSubMenu(button){

  if(!button.nextElementSibling.classList.contains('show')){
    closeAllSubMenus()
  }

  button.nextElementSibling.classList.toggle('show')
  button.classList.toggle('rotate')

  if(sidebar.classList.contains('close')){
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
  }
}

function closeAllSubMenus(){
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}

//this function is for number only
function numberonly(input)
{   
    var num = /[^0-9]/gi;//field which is allowed in that particular input field
    input.value=input.value.replace(num,"");//replaces characters other than number with a space or blank 
    //short hand but above one is easy to understand

    var number = document.getElementById("number").value;
    var number_text = document.getElementById("verify_number");
    var numlength = number.length;
    let a = 10;

    if(numlength != (a) && numlength != 0)
    {
        number_text.innerHTML = "Please Enter 10 digit Phone-Number"
        number_text.style.color = "#ff0000";
    }
    else{
        number_text.innerHTML ="Valid 10 digit Phone-Number"
        number_text.style.color = "#00ff00";
    }
    //if the phone section is empty
    if (number == ""){
        number_text.innerHTML = "";
    }
}

//this function for alphabets only
function alphabetonly(input)
{
    var alpha = /[^a-zA-z]/gi;// gi is a flags that tells the function to look for match over the entire string (will otherwise break at the first match), this is the "g" flag. And the "i" flag tells it to match case insensitively.
    input.value=input.value.replace(alpha,"");    // Remove any non-alphabetic characters
    //short hand
}

//this function is to verify email
function verifyemail(){
    var email = document.getElementById("email").value;
    var text = document.getElementById("verify_email");
    var pattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (email.match(pattern))
    {
        text.innerHTML = "Your Email Address is valid";
        text.style.color = "#00ff00";
    }
    else{
        text.innerHTML = "Please enter valid Email Address";
        text.style.color = "#ff0000";
    }
    //if the email section is empty
    if (email== "") {
        text.innerHTML = "";      
    }
}

// Get current day of the week (0-6, where 0 is Sunday)
const currentDay = new Date().getDay();
// Array of card IDs corresponding to each day
const workoutCards = [
    'sunday-card', 'monday-card', 'tuesday-card', 'wednesday-card',
    'thursday-card', 'friday-card', 'saturday-card'
];

// Highlight the current day's card
const todayCardId = workoutCards[currentDay];
document.getElementById(todayCardId).classList.add('highlight');

function handleClick(workout) {
    let card = document.getElementById("monday-card");
    let nameAttr = card.getAttribute("name"); // Get the 'name' attribute
    console.log("Workout for:", nameAttr);
     window.location.href = `option.html?name=${nameAttr}`;
}
function handle_Click(workout) {
    let card = document.getElementById("tuesday-card");
    let nameAttr = card.getAttribute("name"); // Get the 'name' attribute
    console.log("Workout for:", nameAttr);
     window.location.href = `option.html?name=${nameAttr}`;
}

 async function logout(){
    document.cookie= "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    try{
        const response= await fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(!response.ok){
            throw new Error(`Error in loging out ${response.statusText}`);
        }
    }catch(err){
        console.log(err);
    }
    window.location.href= "/login";
}





