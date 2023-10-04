let isCarsMoving = false;
let carInterval;
let lastSpawnTime = 0;
const roadElement = document.getElementById('road_horizontal');
const entrance_west = document.getElementById('entrance_west');
const entrance_east = document.getElementById('entrance_east');
const stage = document.getElementById('stage');
const road = document.getElementById('intersection_point');
const intersection_point = document.getElementById('intersection_point');

// The appropriate percentages of elements in the stage
const stageLength = stage.offsetHeight; // Get the length of the stage element
const carWidth = 14.28571429;
const carHeight = 0.495*carWidth; // 0.495 to maintain aspect ratio
const start_straightway = 184+100;
const end_straightway = start_straightway+200;
const start_vertical_straightway = start_straightway + 230;
const end_vertical_straightway = end_straightway + 400;
const intersectionLength = 139;

function animateCar(car, translationX,translationY,rotation,initialX,initialY, time) 
{
  const keyframes = 
  [
    { transform: `translateX(${initialX}%) translateY(${initialY}%) rotate(${rotation})` },  // Initial position
    { transform: `translateX(${translationX}%) translateY(${translationY}%) rotate(${rotation})` } // Dynamic translation value
  ];
  
  const options = {
    duration: time,  // Animation duration in milliseconds
    iterations: 1,  // Number of times to play the animation
    fill: 'forwards'  // Keeps the element in its final state after the animation
  };

  car.animate(keyframes, options);
}

function spawnCar() 
{
  const currentTime = Date.now();
  if (currentTime - lastSpawnTime >= 8000)  // Milliseconds
  {
    // Car properties
    const car = document.createElement('img');
    car.src = 'purple_car.png';
    car.className = 'car';
    const carAnimationDuration = 3000; // seconds
    car.style.height = `${carHeight}%`; 
    car.style.position = 'absolute';
    car.style.width = `${carWidth}%`;
    car.style.zIndex = '3';
    
    // Randomly selects an entrance/exit
    const directions = ['north', 'south', 'east', 'west'];

    const randomEntranceDirection = directions[Math.floor(Math.random() * directions.length)];
    const remainingDirections = directions.filter(direction => direction !== randomEntranceDirection);

    const randomExitDirection = remainingDirections[Math.floor(Math.random() * remainingDirections.length)];

    const randomEntrance = `entrance_${randomEntranceDirection}`;
    const randomExit = `exit_${randomExitDirection}`;
    const entranceElement = document.getElementById(randomEntrance);
    const exitElement = document.getElementById(randomExit);

    // Get the position of the chosen entrance relative to the window
    const entranceRect = entranceElement.getBoundingClientRect();
    const exitRect = exitElement.getBoundingClientRect();
    
    //console.log(randomEntrance);
    //console.log(randomExit);

    let translationX = [];
    let translationY = [];
    let rotations = [];
    let initialX = [];
    let initialY = [];

    // Handle car movements
    switch (randomEntrance) 
    {
      case 'entrance_west':  
        // Sets the car position relative to the chosen entrance
        car.style.left = '-15%';
        car.style.top = '52.5%' ; 
          
        rotations.push('0deg');
        initialX.push('0');
        initialY.push('0');
        translationX.push(`${start_straightway}`);
        translationY.push(`0`);
      // The new starting coordinates for the animation
        switch (randomExit) 
        {
            case 'exit_east':
              // Intersection
              rotations.push('0deg');
              initialX.push(`${start_straightway}`);
              initialY.push('0');
              translationX.push(`${start_straightway+intersectionLength}`);
              translationY.push(`0`);

              // Exit
              rotations.push('0deg');
              initialX.push(`${start_straightway+intersectionLength}`);
              initialY.push('0');
              translationX.push(`${start_straightway+intersectionLength+end_straightway}`);
              translationY.push(`0`);
              break;
            case 'exit_north':
              // Intersection
              rotations.push('0deg');
              initialX.push(`${start_straightway}`);
              initialY.push('0');
              translationX.push(`${start_straightway+intersectionLength}`);
              translationY.push(`0`);

    
              rotations.push('270deg');
              initialX.push(`${start_straightway+intersectionLength}`);
              initialY.push('0');
              translationX.push(`${start_straightway+intersectionLength*9/8}`);
              translationY.push(`-${intersectionLength}`);
              
              // Exit
              rotations.push('270deg');
              initialX.push(`${start_straightway+intersectionLength}`);
              initialY.push(`-${intersectionLength}`);
              translationX.push(`${start_straightway+intersectionLength*9/8}`);
              translationY.push(`-${intersectionLength+end_vertical_straightway}`);
              break;
            case 'exit_south':
              // Intersection   
              rotations.push('0deg');
              initialX.push(`${start_straightway}`);
              initialY.push('0');
              translationX.push(`${start_straightway+intersectionLength/2}`);
              translationY.push(`0`);

              // Exit
              rotations.push('90deg');
              initialX.push(`${start_straightway+intersectionLength/2+15}`);
              initialY.push('0');
              translationX.push(`${start_straightway+intersectionLength/2+15}`);
              translationY.push(`${end_vertical_straightway}`);
              break;
            default:
                console.log('Unknown Exit Error');
                break;
        }
        
        break;
          
      case 'entrance_east':  
        // Sets the car position relative to the chosen entrance
        car.style.left = '100%';
        car.style.top = '42.5%' ; 
        
        rotations.push('180deg');
        initialX.push('0');
        initialY.push('0');
        translationX.push(`-${start_straightway}`);
        translationY.push(`0`);
        // The new starting coordinates for the animation
        switch (randomExit) 
        {
            case 'exit_west':
              // Intersection
              rotations.push('180deg');
              initialX.push(`-${start_straightway}`);
              initialY.push('0');
              translationX.push(`-${start_straightway+intersectionLength}`);
              translationY.push(`0`);

              // Exit
              rotations.push('180deg');
              initialX.push(`-${start_straightway+intersectionLength}`);
              initialY.push('0');
              translationX.push(`-${start_straightway+intersectionLength+end_straightway}`);
              translationY.push(`0`);
              break;
            case 'exit_north':
              // Intersection
              rotations.push('180deg');
              initialX.push(`-${start_straightway}`);
              initialY.push('0');
              translationX.push(`-${start_straightway+intersectionLength/2}`);
              translationY.push(`0`);

              // Exit
              rotations.push('270deg');
              initialX.push(`-${start_straightway+intersectionLength/2 + 10}`);
              initialY.push(`-${0}`);
              translationX.push(`-${start_straightway+intersectionLength/2 + 10}`);
              translationY.push(`-${intersectionLength+end_vertical_straightway}`);
              break;
            case 'exit_south':
              // Intersection
              rotations.push('180deg');
              initialX.push(`-${start_straightway}`);
              initialY.push('0');
              translationX.push(`-${start_straightway+intersectionLength}`);
              translationY.push(`0`);

              rotations.push('90deg');
              initialX.push(`-${start_straightway+intersectionLength}`);
              initialY.push('0');
              translationX.push(`-${start_straightway+intersectionLength*9/8}`);
              translationY.push(`${intersectionLength/2}`);
              
              // Exit
              rotations.push('90deg');
              initialX.push(`-${start_straightway+intersectionLength*9/8}`);
              initialY.push(`${intersectionLength/2}`);
              translationX.push(`-${start_straightway+intersectionLength*9/8}`);
              translationY.push(`${intersectionLength+end_vertical_straightway}`);
              break;
            default:
                console.log('Unknown Exit Error');
                break;
        }
        break;   
      
      case 'entrance_north':    
          // Sets the car position relative to the chosen entrance
          car.style.left = '37.5%';
          car.style.top = '-7%' ; 
          
          rotations.push('90deg');
          initialX.push('0');
          initialY.push('0');
          translationX.push(`0`);
          translationY.push(`${start_vertical_straightway}`);
        

        switch (randomExit) 
        {
          case 'exit_west':
            // Intersection
            rotations.push('90deg');
            initialX.push(`0`);
            initialY.push(`${start_vertical_straightway}`);
            translationX.push(`0`);
            translationY.push(`${start_vertical_straightway+intersectionLength}`);

            // Exit
            rotations.push('180deg');
            initialX.push(`0`);
            initialY.push(`${start_vertical_straightway+intersectionLength + 20}`);
            translationX.push(`-${end_straightway}`);
            translationY.push(`${start_vertical_straightway+intersectionLength + 20}`);
            break;
          case 'exit_east':
            // Intersection
            rotations.push('90deg');
            initialX.push(`0`);
            initialY.push(`${start_vertical_straightway}`);
            translationX.push(`0`);
            translationY.push(`${start_vertical_straightway+intersectionLength*2}`);

            // Exit
            rotations.push('0deg');
            initialX.push(`0`);
            initialY.push(`${start_vertical_straightway+intersectionLength*2 + 30}`);
            translationX.push(`${end_straightway + 200}`);
            translationY.push(`${start_vertical_straightway+intersectionLength*2 + 30}`);
            break;
          case 'exit_south':
            // Intersection
            rotations.push('90deg');
            initialX.push(`0`);
            initialY.push(`${start_vertical_straightway}`);
            translationX.push(`0`);
            translationY.push(`${start_vertical_straightway+intersectionLength*2}`);

            // Exit
            rotations.push('90deg');
            initialX.push(`0`);
            initialY.push(`${start_vertical_straightway+intersectionLength*2}`);
            translationX.push(`0`);
            translationY.push(`${start_vertical_straightway+intersectionLength*2 + end_vertical_straightway}`);
            break;
          default:
            console.log('Unknown Exit Error');
            break;
          
        }
        
        break;
      
      case 'entrance_south':    
        // Sets the car position relative to the chosen entrance
        car.style.left = '47.5%';
        car.style.top = '100%' ; 
        
        rotations.push('270deg');
        initialX.push('0');
        initialY.push('0');
        translationX.push(`0`);
        translationY.push(`-${start_vertical_straightway}`);
        

        switch (randomExit) 
        {
          case 'exit_west':
            // Intersection
            rotations.push('270deg');
            initialX.push(`0`);
            initialY.push(`-${start_vertical_straightway}`);
            translationX.push(`0`);
            translationY.push(`-${start_vertical_straightway+intersectionLength*2}`);

            // Exit
            rotations.push('180deg');
            initialX.push(`0`);
            initialY.push(`-${start_vertical_straightway+intersectionLength*2 + 30}`);
            translationX.push(`-${end_straightway}`);
            translationY.push(`-${start_vertical_straightway+intersectionLength*2 + 30}`);
            break;
          case 'exit_east':
            // Intersection
            rotations.push('270deg');
            initialX.push(`0`);
            initialY.push(`-${start_vertical_straightway}`);
            translationX.push(`0`);
            translationY.push(`-${start_vertical_straightway+intersectionLength}`);

            // Exit
            rotations.push('0deg');
            initialX.push(`0`);
            initialY.push(`-${start_vertical_straightway+intersectionLength + 30}`);
            translationX.push(`${end_straightway}`);
            translationY.push(`-${start_vertical_straightway+intersectionLength + 30}`);
            break;
          case 'exit_north':
            // Intersection
            rotations.push('270deg');
            initialX.push(`0`);
            initialY.push(`-${start_vertical_straightway}`);
            translationX.push(`0`);
            translationY.push(`-${start_vertical_straightway+intersectionLength*2}`);

            // Exit
            rotations.push('270deg');
            initialX.push(`0`);
            initialY.push(`-${start_vertical_straightway+intersectionLength*2}`);
            translationX.push(`0`);
            translationY.push(`-${start_vertical_straightway+intersectionLength*2 + end_vertical_straightway}`);
            break;
          default:
            console.log('Unknown Exit Error');
            break;
        }
        
        break;
      
      default:
        console.log('Unknown Entrance Error');
        break;
    }
     
    let delay = 0;  // Initial delay
    let time = [];
    for (let i = 0; i < translationX.length; i++) 
    {
      // Temporary will add more modular code later
      if (i == 0 || i == translationX.length-1)
        time.push(3000);
      else
        time.push(1000);

      setTimeout(() => {
        animateCar(car,translationX[i],translationY[i],rotations[i],initialX[i],initialY[i],time[i]);
      }, delay); // A delay to let the other animation finish first
      if (i == 0)
        delay += 5000; // Stopping delay
      else 
        delay += time[i];
    }
      
    // Appends the car to the stage container
    stage.appendChild(car);

    // Listens for the animation end timer to remove the car
    setTimeout(() => {
      car.remove(); // Remove the car
    }, delay);

    // Updates the last spawn time
    lastSpawnTime = currentTime; 
  }
}

const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', () => {
    if (!isCarsMoving) 
    {
      carInterval = setInterval(spawnCar, 2000); // Starts after 2 seconds
      isCarsMoving = true;
    } 
    else 
    {
      clearInterval(carInterval);
      carInterval = setInterval(spawnCar, 2000); // Starts after 2 seconds
      isCarsMoving = true;
    }
  });

// Got to fix this button
const pauseButton = document.getElementById('pauseButton');
  pauseButton.addEventListener('click', () => {
    clearInterval(carInterval);
    isCarsMoving = false;
  });

const endButton = document.getElementById('endButton');
  endButton.addEventListener('click', () => {
    const cars = document.querySelectorAll('.car');
    cars.forEach((car) => car.remove());
    clearInterval(carInterval);

  });


