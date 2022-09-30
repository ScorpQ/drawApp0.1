    // preparing pen and canvas
    const canvas = document.getElementById("myCanvas");
    const toolBtns = document.querySelectorAll(".tool");
    const fillColor = document.getElementById("fill-color");
    const sizeSlider = document.getElementById("size-slider");
    const colorBtns = document.querySelectorAll(".colors .option");
    const colorPicker = document.getElementById("color-picker");
    const clearCanvas = document.querySelector(".clear-canvas");
    const saveCanvas = document.querySelector(".save-canvas");
    let pen = canvas.getContext("2d");

    // values for drawings
    let isDrawing = false;
    let brushWidth = 5;
    let brushColor;
    let selectedTool = "brush";
    let prevMouseX, prevMouseY;
    let snapshot;

    // drawing funcs
    window.addEventListener("load", ()=>{
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        pen.fillStyle = "#F0F8FF";
        pen.fillRect(0, 0, canvas.width, canvas.height);
    }); 
    const startDrawing = (e) => {
        isDrawing = true;
        pen.strokeStyle= brushColor;
        pen.lineWidth = sizeSlider.value;
        //for rectangle
        prevMouseX = e.offsetX;
        prevMouseY = e.offsetY;
        snapshot = pen.getImageData(0, 0, canvas.width, canvas.height);// ! CONFUSING
    }
    const drawing = (e) => {
        if(!isDrawing) return;
        pen.putImageData(snapshot, 0, 0); // ! CONFUSING    
        if(selectedTool === "brush"){
            pen.lineTo(e.offsetX, e.offsetY);
            pen.stroke();
        }
        else if(selectedTool === "rectangle"){
            drawRect(e);
        }
        else if(selectedTool === "circle"){
            drawCircle(e);
        }
        else if(selectedTool === "triangle"){
            drawTriangle(e);
        }
        else if(selectedTool === "eraser"){
            drawVoid(e);
        }
    }
    const stopDrawing = () => {
        isDrawing = false;
        pen.beginPath();
    }
    /* *******************************************************************  */
    
    // drawing tool funcs
    const drawRect = (e) =>{
        pen.beginPath();
        pen.fillStyle = brushColor;
        if(!fillColor.checked){
            return pen.strokeRect(prevMouseX, prevMouseY, e.offsetX-prevMouseX, e.offsetY-prevMouseY);
        }
            pen.fillRect(prevMouseX, prevMouseY, e.offsetX-prevMouseX, e.offsetY-prevMouseY);
    }
    const drawCircle = (e) => {
        pen.beginPath();
        pen.fillStyle = brushColor;
        pen.arc(prevMouseX,prevMouseY,Math.sqrt(Math.pow(e.offsetX-prevMouseX,2)+Math.pow(e.offsetY-prevMouseY,2)), 0, 2 * Math.PI);
        if(!fillColor.checked)
            return pen.stroke();
        else
            return pen.fill();
    }
    const drawTriangle = (e) => {
        pen.beginPath();
        pen.fillStyle = brushColor;
        pen.moveTo(prevMouseX, prevMouseY);
        pen.lineTo(e.offsetX, e.offsetY);// left line
        pen.lineTo(prevMouseX*2 - e.offsetX, e.offsetY);// bottom line
        pen.closePath();
        pen.stroke();
        if(fillColor.checked)
            pen.fill();
    }
    const drawVoid = (e) => {
        pen.strokeStyle = "#F0F8FF";
        pen.lineTo(e.offsetX, e.offsetY);
        pen.stroke();
    }
    toolBtns.forEach((btn) =>{
        btn.addEventListener("click", () => {
            document.querySelector(".option.active").classList.remove("active");
            selectedTool=btn.id;
            btn.classList.add("active");
            //console.log(selectedTool);
        })
    });
    colorBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelector(".option.selected").classList.remove("selected");
            btn.classList.add("selected");
            brushColor = window.getComputedStyle(btn).getPropertyValue('background-color');
            //console.log(brushColor);
        });} 
    );
    /* *******************************************************************  */

    // events...
    colorPicker.addEventListener("change", () => {
        colorPicker.parentElement.style.backgroundColor=colorPicker.value;
        brushColor = colorPicker.value;
    });
    clearCanvas.addEventListener("click",() => {
        pen.clearRect(0, 0, canvas.width, canvas.height);
    });
    saveCanvas.addEventListener("click", () => {
        var link = document.createElement('a');
        link.download = `${Date.now()}.jpg`;
        link.href = document.getElementById('myCanvas').toDataURL()
        link.click();
    }); 
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mouseup", stopDrawing);