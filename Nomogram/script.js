// Define initial line coordinates
let linex1= 19.9, liney1=50,linex2 = 600, liney2 = 50;

// The setup function is called once when the program starts. It's used to define initial environment properties.
function setup() {
    // Create a canvas 700x700 pixels
    let canvas = createCanvas(700, 700);
    // Parent this canvas to HTML element with id 'canvasContainer'
    canvas.parent('canvasContainer');
    // Set the frame rate to 30 FPS
    frameRate(30);
}

// Define a class for a nomogram line
class NomoLine{
    // Constructor for the class takes in start and end coordinates, number of sublines, and min and max values for the line
    constructor(x1,y1,x2,y2,sublinecount,valuemini,valuemax){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.sublinecount = sublinecount;
        this.valuemini = valuemini;
        this.valuemax = valuemax;
    }

    // Method to construct the line and its sublines
    constructline(){
        // Destructure this to get properties
        const {x1, y1, y2,x2, sublinecount,valuemini,valuemax} = this;
        // Draw the main line
        line(x1,y1,x2,y2);
        // Calculate the height of the nomogram line
        var nomoheight = y2-y1;
        // Calculate the increment for each subline
        var nomosubline = nomoheight/sublinecount;
        // Increment sublinecount to allow last subline to be created at the bottom of the nomoline
        this.sublinecount++;
        // Calculate the value increment for each subline
        let valueincrement = (valuemax-valuemini)/sublinecount;

        // Loop to create each subline and its associated text
        for (let i=0;i<this.sublinecount;i++){
            // Draw the subline
            line(x1,(y1+(nomosubline*i)),x1+10,(y1+(nomosubline*i)));
            // Draw the text for the subline
            text((valueincrement*i+valuemini).toFixed(2),x1+15,(y1+(nomosubline*i)))
        }
    }

    // Method to calculate intersection of this line with another line defined by (x3,y3) and (x4,y4)
    intersect(x3, y3, x4, y4) {
        // Calculate the denominator of the intersection formula
        let den = (this.x1 - this.x2) * (y3 - y4) - (this.y1 - this.y2) * (x3 - x4);
        // If lines are parallel (denominator is 0), return
        if (den == 0) {
            return;
        }
        // Calculate the t and u parameters for the intersection point
        let t = ((this.x1 - x3) * (y3 - y4) - (this.y1 - y3) * (x3 - x4)) / den;
        let u = -((this.x1 - this.x2) * (this.y1 - y3) - (this.y1 - this.y2) * (this.x1 - x3)) / den;
        // If intersection point is within the line segments, calculate and return the intersection point
        if (t > 0 && t < 1 && u > 0) {
            let pt = createVector();
            pt.x = this.x1 + t * (this.x2 - this.x1);
            pt.y = this.y1 + t * (this.y2 - this.y1);
            pt.value = this.valuemini + (pt.y - this.y1) / (this.y2 - this.y1) * (this.valuemax - this.valuemini);
            return pt;
        } else {
            return;
        }
    }
}

// The draw function is called repeatedly and is used to update the display window.
function draw() {
    // Set the background color
    background(220);
    // Create three nomogram lines
    var Nomo1 = new NomoLine(20,20,20,650,10,0.5,230);
    Nomo1.constructline();
    var Nomo2 = new NomoLine(600,20,600,650,10,1,200);
    Nomo2.constructline();
    var Nomo3 = new NomoLine(300,20,300,650,10,1,200);
    Nomo3.constructline();
    // Draw a line between the defined points
    line(linex1, liney1, linex2, liney2);

    // If the mouse is pressed, update the y-coordinate of the line end based on the mouse position
    if (mouseIsPressed) {
        if(mouseX<=350){
            liney1 = mouseY;
        }else if (mouseX>350){
            liney2 = mouseY;
        }
    }

    // Calculate the intersection points of the line with the three nomogram lines
    let inter1 = Nomo1.intersect(linex1, liney1, linex2, liney2);
    let inter2 = Nomo2.intersect(linex1, liney1, linex2, liney2);
    let inter3 = Nomo3.intersect(linex1, liney1, linex2, liney2);
    
    // If intersection points exist, draw a circle at the intersection and update the corresponding HTML element with the intersection value
    if (inter1) {
        circle(inter1.x, inter1.y, 10);
        document.getElementById("output2").innerText = "Intersect left:"+inter1.value.toFixed(2);
    }
    
    if (inter2) {
        circle(inter2.x, inter2.y, 10);
        document.getElementById("output3").innerText = "Intersect right:"+inter2.value.toFixed(2);
    }

    if (inter3) {
        circle(inter3.x, inter3.y, 10);
        document.getElementById("output4").innerText = "Intersect middle:"+inter3.value.toFixed(2);
    }
}

// Function to update the HTML element with id 'output' with the current mouse position whenever the mouse is moved
function mouseMoved() {
    let outputP = select('#output');
    outputP.html(`x: ${mouseX}, y: ${mouseY}`);
}
