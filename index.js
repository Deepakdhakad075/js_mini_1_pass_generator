const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const SymbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generatBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const Symbols = "!@#$%^&*()[]-_+P'?/>.<,~`";
// defaut
let password = "";
let passwordLength = 10;
let checkCount = 1;

handleSlider();
// functions->
// 1 set password length
 function handleSlider (){
inputSlider.value = passwordLength;
lengthDisplay.innerText=passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100 / (max-min)) + '% 100%';
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRndInteger(min,max){
   return Math.floor(Math.random() * (max-min)) +min ;
}
function generateRndNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
     return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol(){
      const randnum = getRndInteger(0, Symbols.length);
      return Symbols.charAt(randnum);
       
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
       if(upperCaseCheck.checked) hasUpper = true;
       if(lowerCaseCheck.checked) hasLower = true;
       if(numbersCheck.checked) hasNum = true;
       if(SymbolsCheck.checked) hasSym = true;

       if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        //setIndicator("");
        indicator.style.backgroundColor = '#0f0';
        indicator.style.boxShadow = '0px 0px 12px 1px #0f0';
        //alert('strong password');

       }
       else if( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        //setIndicator("");
        indicator.style.backgroundColor = '#ff0';
        indicator.style.boxShadow = '0px 0px 12px 1px #ff0';
        //alert('loose password');
       }
       else{
        //setIndicator("");
        indicator.style.backgroundColor = '#f00';
        indicator.style.boxShadow = '0px 0px 12px 1px #f00';
       // alert('weak password');
       }

      
}
// async function copyContent(){
//     try{
//         await navigator.clipboard.writeText(passwordDisplay.value);//return promises
//         copyMsg.innerText = "copied";
//     }
//     catch(e){
//     copyMsg.innerText = "failed"
//     }
//     copyMsg.classList.add("active");
//     setTimeout(()=>{
//         copyMsg.classList.remove("active");
//     },2000);
     
// }
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
        copyMsg.innerText = "";
        console.log('remove Class');
    },2000);

}
// function shufflePassword(){
//     //fisher yates method
//   for(let i = arrray.length -1; i>0; i--){
//     const j =Math.floor(Math.random()*(i+1));
//     const temp = array[i];
//     array[i] = array[j];
//     array[j] = temp;
//   }
//   let str = "";
//   array.forEach((el)=>(str += el));
//   return str;
// }
function shufflePassword() {
    const passwordArray = Array.from(password); // Convert password to an array
    // Fisher-Yates method
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = passwordArray[i];
        passwordArray[i] = passwordArray[j];
        passwordArray[j] = temp;
    }
    let str = passwordArray.join(''); // Convert the shuffled array back to a string
    return str;
}

// checkbox conditions
  function handleCheckBoxChange(){
    checkCount =0;
    allCheckBox.forEach((checkBox) => {
        if(checkBox.checked){
            checkCount++;
        }
        });
        //special funtion
        if(passwordLength<checkCount){
            passwordLength=checkCount;
            handleSlider();
        }
    }
    
    allCheckBox.forEach( (checkbox) => {
        checkbox.addEventListener('change', handleCheckBoxChange);
    })

  inputSlider.addEventListener('input' , (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})
  copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})
// generate password


generatBtn.addEventListener('click', ()=>{

    //none of the checkbox are selected
    if(checkCount<=0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //find new password
    //remove password
    password = "";
     

    let funcArr = [];
    if(upperCaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowerCaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRndNumber);
    }
    if(SymbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compalsary addition
    for(let i = 0; i<funcArr.length ; i++ ){
        password += funcArr[i]();
    }
      //remaining addition
      for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0 , funcArr.length);
      password +=funcArr[randIndex]();
    }
    //shuffle the passsword
        password = shufflePassword(Array.from(password));
    //show in UI
       passwordDisplay.value = password;
       calcStrength();

       //calculate strength
})