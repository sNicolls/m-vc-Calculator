//THE OBJECT THAT DOES THE MATH///
function CalcModel(parent){
    this.parent = parent;


    //HANDLES ALL ORDER OF OPERATIONS INSTANCES//
    this.ordersOperations = function(inputArray){
        var pemdas = [];
        if(inputArray.indexOf('x') > -1){
            var index = inputArray.indexOf('x');
            pemdas = inputArray.splice(index - 1, 3);
            pemdas = this.evaluateEquation(pemdas);
            inputArray.splice(index - 1, 0, pemdas);
        }else if(inputArray.indexOf('/') > -1){
            var index = inputArray.indexOf('/');
            pemdas = inputArray.splice(index - 1, 3);
            pemdas = this.evaluateEquation(pemdas);
            inputArray.splice(index - 1, 0, pemdas);
        }
        this.prepareEquation(inputArray)

    };

    //GETS INPUT FROM THE VIEW AND FORMATS IT FOR MATHEMATICAL EVALUATION//
    this.prepareEquation = function(inputArray) {
        if(inputArray.length === 1){
            parent.viewControl.displayResults(inputArray)
            console.log(inputArray)
        }
        else if(inputArray.indexOf('x') > -1 || inputArray.indexOf('/') > -1){
            this.ordersOperations(inputArray)
        }else{
            this.evaluateEquation(inputArray)
        }
    };



    //EVALUATES EQUATIONS SENT TO IT BY THE PREPARE EQUATION FUNCITON//
    this.evaluateEquation = function(inputArray){
        var result = null;
        var firstNum = Math.round((parseFloat(inputArray[0])) * 100) / 100;
        var operator = inputArray[1];
        var secondNum = null;

        if(inputArray.length < 3){
            secondNum = firstNum;
        }else{
            secondNum = Math.round((parseFloat(inputArray[inputArray.length - 1])) * 100) / 100;
        }
        //DOES THE MATH YO//
        switch (operator) {
            case "+" :
                result = firstNum + secondNum;
                break;
            case "-" :
                result = firstNum - secondNum;
                break;
            case "x" :
                result = firstNum * secondNum;
                return result;
            case "/" :
                result = firstNum / secondNum;
                return result;
        }
        result.toString();
        inputArray.splice(0, 3, result);
        this.prepareEquation(inputArray);
        return result;
    }
}


//AN OBJECT THAT HANDLES BUTTONS, AND INPUT//
function ViewControl(parent) {
    this.parent = parent;
    var hasSentEquation = false;
    var inputs = [''];
    var lastOpPressed = null;
    var lastNumPressed = null;
    var hasCleared = false;

    //CALLED ON LOAD, AND INITIALIZES THE CLICK HANDLERS//
    this.init = function() {
        this.assignClickHandlers();
    };
    //TRIGGERED ON INITIALIZATION TO APPLY THE DESIRED CLICK HANDLERS//
    this.assignClickHandlers = function() {
        $(".num_btn").bind("click", this.handleNumbers);
        $(".operator_btn").bind("click", this.handleOperators);
        $(".equals_btn").bind("click", this.sendEquation);
        $("#c_btn").bind("click", this.clearData);
        $("#ce_btn").bind("click", this.clearEntry);
    };
    //TRIGGERED BY A NUMBER onClick, ADDS NUMBERS TO THE INPUT STRING//
    this.handleNumbers = function() {
        this.numPressed = $(this).text();
        lastNumPressed = this.numPressed;
        if(hasSentEquation === true){

            hasSentEquation = false;
            inputs = [this.numPressed]
        } else if (this.numPressed === '.' && inputs[inputs.length - 1].indexOf(".") > -1){
        } else if (isNaN(inputs[inputs.length - 1]) === false || inputs[inputs.length - 1] === "."){
            inputs[inputs.length - 1] += this.numPressed;
        } else if (inputs[0] === '-') {
            inputs[0] += this.numPressed;
        } else {
            inputs.push(this.numPressed)
        }
        parent.viewControl.displayData(this.numPressed);
        console.log(inputs);
    };
    //TRIGGERED BY AN OPERATOR onClick, ADDS OPERATORS TO THE INPUT STRING AND CONTROLS THEM//
    this.handleOperators = function() {
        hasSentEquation = false;
        this.opPressed = $(this).text();
        lastOpPressed = this.opPressed;
        if(inputs.length >= 3 && this.opPressed !== 'x' && this.opPressed !== '/'){
            inputs[0] === (toString(parent.calcModel.prepareEquation(inputs)));
        }if (inputs[0] === '' && this.opPressed === '-') {
            inputs[0] = this.opPressed;
        } else if (isNaN(inputs[inputs.length - 1]) && inputs[0] === '-') {
            inputs[0] = '';
        } else if (isNaN(inputs[inputs.length - 1])) {
            inputs[inputs.length - 1] = this.opPressed;
        } else if(inputs[0] === ''){
            return;
        } else {
            inputs.push(this.opPressed);
        }
        parent.viewControl.displayData(this.opPressed);
        console.log(inputs)
    };
    //TRIGGERED BY THE "=" onClick, SENDS INPUT DATA TO THE MATH OBJ//
    this.sendEquation = function() {
        hasSentEquation = true;
        hasCleared = false;
        if (inputs.length === 1 && lastOpPressed !== null) {
            inputs.push(lastOpPressed, lastNumPressed)
        }else if(inputs.length === 1){
            parent.viewControl.displayData(inputs)
        }
        if(inputs.length === 2){
            inputs[0] = parent.calcModel.evaluateEquation(inputs);
            console.log("inputs:   ", inputs[0], inputs[1])
        }else{
            parent.calcModel.prepareEquation(inputs);
        }
    };
    //CLEARS INPUT AND RESETS THE CALCULATOR//
    this.clearData = function () {
        inputs = [''];
        $("#calc_screen").text("");
        console.log(inputs)
    };
    this.clearEntry = function(){
        if(hasCleared === false) {
            inputs.splice(inputs.length - 1, 1);
            $("#niche_display").text("0");
            console.log(inputs);
        }
        hasCleared = true;
        console.log(inputs)
    };
    //DISPLAYS INPUT DATA IN THE RIGHT HAND SIDE DIV ON THE CALC SCREEN//
    this.displayData = function(){
        $("#calc_screen").text(inputs[inputs.length - 1]);
    };

    //DISPLAYS EVALUATED DATA IN THE LEFT HAND DIV ON THE CALC SCREEN//
    this.displayResults = function(input){
        $("#calc_screen").text(input);
    };

    this.init();
}


//CREATES CONTROLLER OBJECT FOR THE MATH OBJECT AND VIEW OBJECT//
function ParentObject(){
    this.calcModel = new CalcModel(this);
    this.viewControl = new ViewControl(this);
}


//INITIALIZE THE EVERYTHING///
$(document).ready(function(){
    var missionControl = new ParentObject();
})