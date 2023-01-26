let tick = 0;
function setup() {
  createCanvas(600,600);
  frameRate(60);
  // put setup code here
}

function draw() {
  background(255);
  tick++;
  // put drawing code here
  translate(mouseX,mouseY);
  criticalBumpyText(tick, "Critical Hit", 32, 20, 5, 25, 180); //12 characters, 60 frames
  if (tick >= 60) {
  translate(0,50);
  criticalBumpyText(tick-60, "It's super effective!", 32, 20, 5, 25, 20);
  }
  if (tick >= 180) {tick = -1;}
  //21characters,
  //arcText("eggs bacon and ham and spam and valhalla and why am I even doing this anymore", 100, PI/8);
}
/*
//Draws a set of pixels recursively expanding from the center
//decorations=[length of pixel, r1,g1,b1,rstep,gstep,bstep, r2,g2,b2]
function drawPixelWave(boxLength, pixelLength, rgbaLower, rgbaStep, rgbaUpper) {
  if (pixelLength <= 0) {pixelLength = 1;}
  let pixCol = [0,0,0];
  for (let x = boxLength/pixelLength/-2; x < boxLength/pixelLength/2; x+=pixelLength) {
    for (let y = boxLength/pixelLength/-2; y < boxLength/pixelLength/2; y+=pixelLength) {
      push();
      translate(x*pixelLength,y*pixelLength);
      fill(numberStepArray(rgbaLower+rgbaStep*abs(x*y),rgbaLower, rgbaStep, rgbaUpper,[0,0,0,0],[255,255,255,255]));
      rect(pixelLength/-2, pixelLength/-2, pixelLength, pixelLength);
      pop();
    }
  }
}
function numberStepArray(arr, arrStep, arrLower, arrUpper, arrMin, arrMax) {
  let result = [];
  for (let x = 0; x < arr.length; x++) {
    append(result, numberStep(arr[x], arrStep[x], arrLower[x], arrUpper[x], arrMin[x], arrMax[x]));
  }
  return result;
}

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
*/
//incomplete
//takes input text and generates an arc of strings
function arcText(input, radius, angleSpacing, size = 32, overflowFactor = 0.5) {
  let startAngle = -(PI-(angleSpacing*(input.length-1)))/2;// ((angleSpacing*input.length) % (2*PI)) - PI/2;//2*PI - ((angleSpacing * (input.length)) % (2*PI));//angleSpacing * (input.length+1) / 2 +PI/2;
  let y = 1;
  //print((startAngle/PI)+"PI");
  push();
  textAlign(CENTER);
  textSize(size);
  rotate(startAngle);
  //line(0,0,-radius,0);
  //circle(-radius,0,10);

  for (let x = 0; x < input.length; x++) {
    if (x*angleSpacing >= (2*PI * y)) {
      y++;
      size = size * overflowFactor;
      textSize(size);
    }
    push();
    rotate(-angleSpacing*x);
    //line(0,0,-radius*pow(overflowFactor,(y-1)),0);
    //circle(-radius*pow(overflowFactor,(y-1)),0,10);
    translate(-radius*pow(overflowFactor,(y-1)),0);
    rotate(angleSpacing*x-startAngle);
    text(input[x],0,0);
    pop();
  }
  pop();
}

//Animated text
//Each character appears over time and then oscillates upwards before eventually settling.
//character time refers to the amount of time each character takes animating.
//character height refers to the maximum 'jump' when animating.
function criticalBumpyText(tick, input, size, spacing, charTime, charMaxHeight, delay) {
  textSize(size);

  tick = tick % (charTime * input.length + delay);
  let completedCharacters = floor(tick / charTime); //Number of characters completed
  let currentCharacter = tick - completedCharacters*charTime;//Time elapsed since last digit completed
  let height = currentCharacter*(currentCharacter-charTime) * charMaxHeight / (pow(charTime,2)/4);//(-charTime/2*(charTime/2-charTime));
  //-charMaxHeight*sqrt(pow(charTime)^2 - pow((currentCharacter-charTime/2),2));
  // charMaxHeight * 2*(currentCharacter-charTime/2)/charTime;//-charMaxHeight* sqrt(1-((currentCharacter-charTime/2)/charTime*2))^2;
  print(completedCharacters+'.'+currentCharacter+":"+height);
  push();
  for (let x = 0; x < completedCharacters; x++) {
    text(input[x],0,0);
    translate(spacing,0);
  }
  //text((input.substring(0,completedCharacters)),0,0);
  //translate(spacing*completedCharacters,height);
  translate(0,height);
  if (completedCharacters < input.length) {
    text(input[completedCharacters],0,0);
  }
  pop();
}
