const fileInput = document.getElementById('fileInput')
const displayImage = document.getElementById('displayImage')
const ctx = displayImage.getContext('2d')
const resetBtn = document.getElementById('resetPoly')
const finishBtn = document.getElementById('finishPoly')


fileInput.onchange = function(e){
  e.preventDefault()
  const reader = new FileReader();
  reader.readAsDataURL(this.files[0]);

  reader.addEventListener("load", () => {
    const uploadedImageSrc = reader.result;
    const image = new Image()
    image.src = uploadedImageSrc

    image.onload = function(){
      displayImage.width = `${this.width}`;
      displayImage.height = `${this.height}`;
      displayImage.style.backgroundImage = `url(${uploadedImageSrc})`;
    }
  });
}

resetBtn.onclick = function(e){
  e.preventDefault()
  resetPoly()
}
finishBtn.onclick = function(e){
  e.preventDefault()
  finishPoly()
}

const dotRadius = 6
const strokeStyle = 'black'
const fillStyle = 'black'
const strokeWidth = 3
let resultPolygonCoords = null

displayImage.onclick = function(e){
  //первый клик открывает path
  drawPoly(e.layerX - e.target.offsetLeft, e.layerY - e.target.offsetTop)
}

function drawPoly(x, y){
  // create a new path
  if (!resultPolygonCoords){
    resultPolygonCoords = []
    ctx.beginPath()
  } 
  drawPath(x, y)
}

function resetPoly(){
  //удалить все точки и линии из массива, очистить холст
  ctx.clearRect(0, 0, displayImage.width, displayImage.height)
  resultPolygonCoords = null

}

function finishPoly(){
  //соединить последнюю точку с первой линией
  drawLine(
    resultPolygonCoords[resultPolygonCoords.length - 1][0], 
    resultPolygonCoords[resultPolygonCoords.length - 1][1], 
    resultPolygonCoords[0][0],
    resultPolygonCoords[0][1]
  )
  //close path
  //вывести массив точек на экран или в консоль.
  let result = []
  resultPolygonCoords.forEach(coord => {
    result.push(...coord)
  });
  console.log(result)
}


function drawPath(x, y){
  if (resultPolygonCoords[resultPolygonCoords.length - 1]){
    drawLine(resultPolygonCoords[resultPolygonCoords.length - 1][0], resultPolygonCoords[resultPolygonCoords.length - 1][1], x, y)
    drawDot(x, y);
  } else {
    drawDot(x, y);
  }

  resultPolygonCoords.push([x, y])
}

function drawDot(x, y){
  ctx.beginPath()
  ctx.moveTo(x, y);
  ctx.arc(x, y, dotRadius, 0, 2*Math.PI)
  ctx.fill()
  ctx.fillStyle = fillStyle
  ctx.closePath()
}

function drawLine(prevX, prevY, x, y){
  ctx.beginPath()
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(x, y)
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = strokeWidth
  ctx.stroke()
  ctx.closePath()
}