function setup() {
  // put setup code here
}

function draw() {
  // put drawing code here
}

class Tile {
  constructor(length, type, health, decorations=[]) {
    this.length = length;
    this.type = type;
    this.health = health;
    this.decorations = decorations; //An array of various decoration settings.
    this.status = normal;

    this.time = 0;
  }

  draw() {
    switch(type) {
      case 'pixelWave':
      default:
        this.drawPixelWave(this.length, this.decorations[0],
          [this.decorations[1], this.decorations[2], this.decorations[3], this.decorations[4]],
          [this.decorations[5], this.decorations[6], this.decorations[7], this.decorations[8]],
          [this.decorations[9], this.decorations[10],this.decorations[11],this.decorations[13]]);
        break;
    }
  }



  setType(type) {
    this.type = type; //Health, heart, damaged,
  }

  setHealth(num) {
    this.health = num;
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

//csv later
class PlayerGrid {
  constructor(length, width, centerX, centerY, deadzones) {
    this.grid = [];
    for (let x = 0; x < length; x++) {
      append(this.grid, []);
      for (let y = 0; y < )
      append(this.grid[x], new tile('health'))
    }
  }
}
