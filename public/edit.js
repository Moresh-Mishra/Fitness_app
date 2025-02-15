//this function is for number only
function numberonly(input)
{   
    var num = /[^0-9]/gi;//field which is allowed in that particular input field
    input.value=input.value.replace(num,"");//replaces characters other than number with a space or blank 
    //short hand but above one is easy to understand
    //input.value = value.replace(/[^0-9]/g, '');

    //if the phone section is empty
    if (number == ""){
        number_text.innerHTML = "";
    }
}

function alphabetonly(input)
{
    var alpha = /[^a-zA-z]/gi;// gi is a flags that tells the function to look for match over the entire string (will otherwise break at the first match), this is the "g" flag. And the "i" flag tells it to match case insensitively.
    input.value=input.value.replace(alpha,"");    // Remove any non-alphabetic characters
    //short hand
    //input.value = value.replace(/[^a-zA-Z]/g, '');
}

//BMI calculation
function calculateBMI() {
    let weight = document.getElementById("weight").value;
    let heightCm = document.getElementById("height").value;

    if (weight && heightCm && heightCm > 0) {
        let heightM = heightCm / 100; // Convert cm to meters
        let bmi = weight / (heightM * heightM);
        bmi = bmi.toFixed(2); // Round to 2 decimal places

        let message = "";
        if (bmi < 18.5) {
            message = "Underweight 🥦";
        } else if (bmi >= 18.5 && bmi < 24.9) {
            message = "Normal Weight ✅";
        } else if (bmi >= 25 && bmi < 29.9) {
            message = "Overweight ⚠️";
        } else {
            message = "Obese 🚨";
        }

        document.getElementById("result").innerText = `${bmi} (${message})`;
    } else {
        document.getElementById("result").innerText = "--";
    }
}