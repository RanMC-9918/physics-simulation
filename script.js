class active {
  constructor() {
    this.x = 100;
    this.y = 100;
    this.velX = 25;
    this.velY = 1;
    this.accX = 0;
    this.accY = 2;
    this.radius = 20;
    this.color = 255;
  }

  tick() {
    this.velX += this.accX;
    this.velY += this.accY;
    this.x += this.velX;
    this.y += this.velY;
    // console.log(this.velY);
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }
  getColor() {
    return this.color;
  }
  getRadius() {
    return this.radius;
  }

  reflectX(x, cor) {
    this.velX *= -x;
    this.x += cor;
    this.tick();
  }

  reflectY(x, cor) {
    this.velY *= -x;
    this.y += cor;
    this.tick();
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }
}

class passive {
  constructor() {
    this.x = 500;
    this.y = 500;
    this.width = 500;
    this.height = 50;
    this.color = 100;
  }

  tick() {}

  getPosition() {
    return { x: this.x, y: this.y };
  }
  getColor() {
    return this.color;
  }
  getDimensions() {
    return { width: this.width, height: this.height };
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }
}

let activeArray = [new active()];
let passiveArray = [new passive()];
let elasticity = [0.6];

let main = document.querySelector("main");

function setup() {
  createCanvas(
    main.getBoundingClientRect().width,
    main.getBoundingClientRect().height
  );
  background(20);
}

function draw() {
  background(20);
  // Add passive objects here
  for (let i = 0; i < activeArray.length; i++) {
    fill(activeArray[i].getColor());
    ellipse(
      activeArray[i].getPosition().x,
      activeArray[i].getPosition().y,
      activeArray[i].getRadius()
    );
    for (let j = 0; j < passiveArray.length; j++) {
      collide(activeArray[i], passiveArray[j], elasticity[i]);
    }
    activeArray[i].tick();
  }

  for (let i = 0; i < passiveArray.length; i++) {
    fill(passiveArray[i].getColor());
    rect(
      passiveArray[i].getPosition().x,
      passiveArray[i].getPosition().y,
      passiveArray[i].getDimensions().width,
      passiveArray[i].getDimensions().height
    );
  }
}

let addActive = document.getElementById("addActive");
let addPassive = document.getElementById("addPassive");

addActive.onclick = () => {
  activeArray.push(new active());
  elasticity.push(0.8);
  updateList();
};

addPassive.onclick = () => {
  passiveArray.push(new passive());
  updateList();
};

function collide(active, passive, elasticity) {
  if (
    active.getPosition().x + active.getRadius() > passive.getPosition().x &&
    active.getPosition().x + active.getRadius() <
      passive.getPosition().x + passive.getDimensions().width &&
    active.getPosition().y + active.getRadius() * 2 > passive.getPosition().y &&
    active.getPosition().y <
      passive.getPosition().y + passive.getDimensions().height
  ) {
    console.log("Y-collosion");
    active.reflectY(elasticity, active.getPosition().y - passive.getPosition().y );
  } else if (
    active.getPosition().x + active.getRadius() * 2 > passive.getPosition().x &&
    active.getPosition().x <
      passive.getPosition().x + passive.getDimensions().width &&
    active.getPosition().y + active.getRadius() > passive.getPosition().y &&
    active.getPosition().y + active.getRadius() <
      passive.getPosition().y + passive.getDimensions().height
  ) {
    console.log("X-collosion");
    active.reflectX(elasticity, active.getPosition().x - passive.getPosition().x);
  }
}

let offset = { x: 0, y: 0 };
let focus;

function mousePressed(){
  for (let i = 0; i < passiveArray.length; i++) {
    console.log(passiveArray[i].getPosition());
    if (
      mouseX > passiveArray[i].getPosition().x &&
      mouseX <
        passiveArray[i].getPosition().x +
          passiveArray[i].getDimensions().width &&
      mouseY > passiveArray[i].getPosition().y &&
      mouseY <
        passiveArray[i].getPosition().y + passiveArray[i].getDimensions().height
    ) {
      console.log(offset.x);
      offset = { x: mouseX, y: mouseY };
      focus = passiveArray[i];
      displayProperties(passiveArray[i]);
    }
  }
}

function mouseDragged() {
  if (focus) {
    focus.move(mouseX - offset.x, mouseY - offset.y);
  }
  offset = { x: mouseX, y: mouseY };
}

function mouseReleased() {
  offset = { x: 0, y: 0 };
  focus = null;
}

let list = document.getElementById("list");
updateList();

function updateList() {
  list.innerHTML = "";

  for (let i = 0; i < passiveArray.length; i++) {
    let li = document.createElement("li");
    li.innerText = `Passive ${i + 1}`;
    li.onclick = () => {
      displayProperties(passiveArray[i]);
    };
    list.appendChild(li);
  }

  list.onmouseover = () => {
    for (let i = 0; i < activeArray.length; i++) {
      let li = document.createElement("li");
      li.innerText = `Active ${i + 1}`;
      li.onclick = () => {
        displayProperties(activeArray[i]);
      };
      list.appendChild(li);
    }
  };
}

list.onmouseout = () => {
  updateList();
};

let properties = document.getElementById("properties");
function displayProperties(obj) {
  properties.innerHTML = "";
  for (let key in obj) {
    if (typeof obj.key === "function") continue;
    let li = document.createElement("li");
    li.innerText = `${key}: ${obj[key]}`;
    li.onmouseover = () => { 
      if(li.children.length == 0){
        let inp = document.createElement("input");
        inp.value = obj[key];
        inp.type = "range";
        inp.min = 0;
        inp.max = obj[key]*3;
        inp.oninput = () => {
          offset = {x: 0, y: 0};
          console.log("changed");
          obj[key] = (int)(inp.value);
        };
        li.innerText = key + ": ";
        li.appendChild(inp);
      }
    };
    properties.appendChild(li);
  }
}