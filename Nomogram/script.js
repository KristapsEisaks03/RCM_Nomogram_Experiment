let linex1= 19.9, liney1=50,linex2 = 600, liney2 = 50;


function setup() {
    let canvas = createCanvas(700, 700);
    canvas.parent('canvasContainer');
    frameRate(30);
}



class NomoLine{
    constructor(x1,y1,x2,y2,sublinecount,valuemini,valuemax){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.sublinecount = sublinecount;
        this.valuemini = valuemini;
        this.valuemax = valuemax;
    }
    constructline(){
        const {x1, y1, y2,x2, sublinecount,valuemini,valuemax} = this; // destructuring this
        line(x1,y1,x2,y2) //creation of original line
        var nomoheight = y2-y1; //I think this is self explanatory xD
        var nomosubline = nomoheight/sublinecount; //grab the increments a subline needs to go up from
        this.sublinecount++; // this allows last subline to be created at the bottom of the nomoline
        let valueincrement = (valuemax-valuemini)/sublinecount;


        for (let i=0;i<this.sublinecount;i++){
            line(x1,(y1+(nomosubline*i)),x1+10,(y1+(nomosubline*i)));
            text((valueincrement*i+valuemini).toFixed(2),x1+15,(y1+(nomosubline*i)))
        }

    }

    intersect(x3, y3, x4, y4) {
        let den = (this.x1 - this.x2) * (y3 - y4) - (this.y1 - this.y2) * (x3 - x4);
        if (den == 0) {
            return;
        }
        let t = ((this.x1 - x3) * (y3 - y4) - (this.y1 - y3) * (x3 - x4)) / den;
        let u = -((this.x1 - this.x2) * (this.y1 - y3) - (this.y1 - this.y2) * (this.x1 - x3)) / den;
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

function draw() {
    background(220);
    // line(50, 50, 50, 300); // y-axis
    // line(250, 50, 250, 250); // x-axis

    // createNomoLine(20,20,20,300,5);
    var Nomo1 = new NomoLine(20,20,20,650,10,0.5,230);
    Nomo1.constructline();
    var Nomo2 = new NomoLine(600,20,600,650,10,1,200);
    Nomo2.constructline();
    var Nomo3 = new NomoLine(300,20,300,650,10,1,200);
    Nomo3.constructline();
    line(linex1, liney1, linex2, liney2);

    if (mouseIsPressed) {
        if(mouseX<=350){
            liney1 = mouseY;
        }else if (mouseX>350){
            liney2 = mouseY;
        }
    }

    let inter1 = Nomo1.intersect(linex1, liney1, linex2, liney2);
    let inter2 = Nomo2.intersect(linex1, liney1, linex2, liney2);
    let inter3 = Nomo3.intersect(linex1, liney1, linex2, liney2);
    
    if (inter1) {
        // fill('red');
        circle(inter1.x, inter1.y, 10);
        // console.log(`Intersection with Nomo1 at: (${inter1.x}, ${inter1.y}), Value: ${inter1.value}`);
        document.getElementById("output2").innerText = "Intersect left:"+inter1.value.toFixed(2);
    }
    
    if (inter2) {
        // fill('red');
        circle(inter2.x, inter2.y, 10);
        // console.log(`Intersection with Nomo2 at: (${inter2.x}, ${inter2.y}), Value: ${inter2.value}`);
        document.getElementById("output3").innerText = "Intersect right:"+inter2.value.toFixed(2);
    }

        
    if (inter3) {
        // fill('red');
        circle(inter3.x, inter3.y, 10);
        document.getElementById("output4").innerText = "Intersect middle:"+inter3.value.toFixed(2);
    }
}

function mouseMoved() {
    let outputP = select('#output');
    outputP.html(`x: ${mouseX}, y: ${mouseY}`);
}
