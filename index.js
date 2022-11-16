//selecting all required elements
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const welcome = document.querySelector(".welcome");

// if startQuiz button clicked
start_btn.onclick = ()=>{
    info_box.classList.add("activate"); //show info box
}

// if exitQuiz button clicked
exit_btn.onclick = ()=>{
    info_box.classList.remove("activate"); //hide info box
}

let timeValue =  10;
let que_count = 0;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

// if continueQuiz button clicked
continue_btn.onclick = ()=>{
    info_box.classList.remove("activate");
    quiz_box.classList.add("activeQuiz");
    showQues(que_count);
    quesCounter(que_count+1);
    startTimer(timeValue);
    startTimerLine(widthValue);
}

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if restartQuiz button clicked
restart_quiz.onclick = ()=>{
    quiz_box.classList.add("activeQuiz");
    result_box.classList.remove("activeResult");
    timeValue = 10; 
    que_count = 0;
    userScore = 0;
    widthValue = 0;
    showQues(que_count);
    quesCounter(que_count+1);
    clearInterval(counter);
    clearInterval(counterLine);
    startTimer(timeValue);
    startTimerLine(widthValue);
    next_btn.classList.remove("show");
}

// if quitQuiz button clicked
quit_quiz.onclick = ()=>{
    window.location.reload(); //reload the current window
    welcome.classList.remove("welcometext");
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Ques button clicked
next_btn.onclick = ()=>{
    if(que_count < questions.length - 1){
        que_count++;
        showQues(que_count);
        quesCounter(que_count+1);
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(timeValue);
        startTimerLine(widthValue);
        next_btn.classList.remove("show");
    }else{
        clearInterval(counter);
        clearInterval(counterLine);
        showResult();
    }
}

// getting questions and options from array
function showQues(index){
    const que_text = document.querySelector(".que_text");

    //Getting Question and its options
    let que_tag = '<span>'+ questions[index].numb + ". " + questions[index].question +'</span>';
    let option_tag = '<div class="option">'+ questions[index].options[0] +'</div>'
    + '<div class="option">'+ questions[index].options[1] +'</div>'
    + '<div class="option">'+ questions[index].options[2] +'</div>'
    + '<div class="option">'+ questions[index].options[3] +'</div>';

    que_text.innerHTML = que_tag; //Showing ques in que_text;
    option_list.innerHTML = option_tag; //Showing option in option_list
    
    const option = option_list.querySelectorAll(".option");

    // set onclick attribute to all available options
    for(i=0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
    welcome.classList.add("welcometext");
}
// creating the new div tags for icons on selecting option
let tickIconTag = '<div class="tick" > &#10004; </div>';
let crossIconTag = '<div class="cross"> &#10006;</div>';

//On clicking option, this function is called
function optionSelected(selected){
    clearInterval(counter);
    clearInterval(counterLine); 

    let userAns = selected.textContent; //getting user selected option
    let correctAns = questions[que_count].answer; //getting correct answer from array
    const allOptions = option_list.children.length; //getting all option items
    
    if(userAns == correctAns){
        userScore += 1;
        selected.classList.add("correct");
        selected.insertAdjacentHTML("beforeend", tickIconTag);
    }
    else{
        selected.classList.add("incorrect");
        selected.insertAdjacentHTML("beforeend", crossIconTag);
        autoSelect(allOptions, correctAns);
    }
    disableOptions(allOptions);
    next_btn.classList.add("show"); //show the next button if user selected any option
}

//AutoSelect options if selected ans is wrong or if time runs out.
function autoSelect(allOptions, correctAns) {
    for(i=0; i < allOptions; i++){
        if(option_list.children[i].textContent == correctAns){ 
            option_list.children[i].classList.add("correct");
            option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
        }
    }
}

// Disable all options after selecting a option
function disableOptions(allOptions) {
    for(i=0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled");
    }
}

function showResult(){
    info_box.classList.remove("activate");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text");
    let scoreTag;
    if (userScore > 3){ 
        scoreTag = '<span>Congrats!, You got <p>'+ userScore +'</p> out of <p>'+ questions.length +'</p></span>';
    }
    else if(userScore > 1){
        scoreTag = '<span>Nice , You got <p>'+ userScore +'</p> out of <p>'+ questions.length +'</p></span>'; 
    }
    else{
        scoreTag = '<span>Practice Again , You got only <p>'+ userScore +'</p> out of <p>'+ questions.length +'</p></span>';
    }
    scoreText.innerHTML = scoreTag;
}

function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--;
        if(time < 9){
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero;
        }
        if(time < 0){
            clearInterval(counter);
            const allOptions = option_list.children.length;
            let correctAns = questions[que_count].answer;
            
            autoSelect(allOptions, correctAns);
            disableOptions(allOptions);

            next_btn.classList.add("show");
        }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 20);
    function timer(){
        time += 1; //upgrading time value with 1
        time_line.style.width = time + "px"; //increasing width of time_line with px by time value
    }
}

function quesCounter(ques_num){
    let totalQueCounTag = '<span><p>'+ ques_num +'</p> of <p>'+ questions.length +'</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;
}