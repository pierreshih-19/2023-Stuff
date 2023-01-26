let canvasLength = 750;
let canvasWidth = 750;
let num;
let numStep;
let numLower;
let numUpper;
let numMin;
let numMax;
let lowerRelative;
let upperRelative;
let scale;

function setup() {
  createCanvas(canvasLength,canvasWidth);
  textSize(64);
  frameRate(1);
  num = 24;
  numStep = 10;
  numLower = 25;
  numUpper = 75;
  numMin = 0;
  numMax = 100;

  scale = 5;

  lowerRelative = (numLower-numMin) / (numMax-numMin) * numMax;
  upperRelative = (numUpper-numMin) / (numMax-numMin) * numMax;
}

function draw() {
  drawMovingSlider();
}

function drawMovingSlider() {
  background(255,192,255);
  translate(100,200);
  line(numMin*scale, -50, numMin*scale, 50);
  line(numMin*scale,   0, numMax*scale,  0);
  line(numMax*scale, -50, numMax*scale, 50);
  line(lowerRelative*scale, -25, lowerRelative*scale, 25);
  line(upperRelative*scale, -25, upperRelative*scale, 25);
  circle((num-numMin)*scale,0,20);

  numStep = (mouseX-(canvasLength/2))/(canvasLength/2)*scale;
  num = numberStep(num, numStep, numLower, numUpper, numMin, numMax);
  print("Num = " + num + ", NumStep = " + numStep);
  //print("Num Step = " + numStep); //works
}

//Takes six arrays as parameters
//First array is current iteration of array values
//Second array is the step size of eeach entry
//Third and fourth arrays are the soft bounds of entry values
//Fifth and Sixth arrays are the hard bounds of entry values
//If the entry is between the soft bounds, it will act as upper and lower bounds and loop across
//Otherwise it will loop around the hard bounds and reach the soft bounds and loop across them
//Example 1: numberStep(55,10,30,60,x,y) -> 55+5 = 60, loop to 30, 30+5 = 35
//Example 2: numberStep(10,-50,25,75,0,100) -> 10-10 = 0, loop to 100, 100-25 = 75, loop to 25, 25-15 = 10
function numberStepArray(arr, arrStep, arrLower, arrUpper, arrMin, arrMax) {
  let result = [];
  for (let x = 0; x < arr.length; x++) {
    append(result, numberStep(arr[x], arrStep[x], arrLower[x], arrUpper[x], arrMin[x], arrMax[x]));
  }
  return result;
}

//Takes six parameters and returns a number which steps up from the first parameter, with the intent of resetting when
//exiting the intended range or when
function numberStep(num, numStep, numLower, numUpper, numMin, numMax) {
  print('Before: ' + num);
  try {
    if (numMin >= numMax || numLower >= numUpper || numMin > numLower || numUpper > numMax) {
      throw 'range invalid';
    }
    if (num < numMin || num > numMax) {
      throw 'entry not within hard range';
    }
    if (numStep == 0) {
      throw 'zero change'
    }
  }
  catch (err) {
    print(err);
    return num;
  }
  //Scenario 1: num is between soft bounds. Simple iteration of logic to loop through soft bounds until stopping.
  if ((numLower < num && num < numUpper)  ||
     (num == numLower && numStep > 0)     ||
     (num == numUpper && numStep < 0))    {
    return numberStepBasic(num, numStep, numLower, numUpper);
  }
  //Scenario 2: num is between hard bounds but not between soft bounds.
  else {
    let temp = numMax - numUpper + numLower - numMin;
    numStep = (numStep % temp);// * posNegSign(numStep); //trim fat;
    //Things get tricky here. We effectively need to crease the soft bound range,
    //If the entry is greater than the upper soft bound subtract the soft bound range from the entry,
    //act like the soft bound doesn't exist, and then repeat scenario 1 as if the upper hard bound has the soft bound range subtracted.
    //If the resulting number is past the lower soft bound, add the soft bound range and return the result.
    temp = numUpper - numLower;
    if (num > numUpper) {num -= temp};
    num = numberStepBasic(num, numStep, numMin, numMax-temp);
    if (num > numLower) {num += temp;}
    return num;
  }
}

function numberStepBasic(num, numStep, numLower, numUpper) {
  print("Before Basic: " + num);
  try {
    if (numLower >= numUpper) {
      throw 'range invalid Basic';
    }
    if (num < numLower || num > numUpper) {
      throw 'entry not within hard range Basic';
    }
    if (numStep == 0) {
      throw 'zero change Basic'
    }
  }
  catch (err) {
    print(err);
    return num;
  }
  let temp = numUpper - numLower;
  numStep = (numStep % temp);// * posNegSign(numStep); //trim fat;
  num += numStep;
  if (num > numUpper) {num -= temp;}
  if (num < numLower) {num += temp;}
  return num;
}

function posNegSign(num) {
  if (num >= 0) {return 1;}
  return -1;
}
