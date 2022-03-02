function getParams() {
    var userWidth = document.getElementById("widthIn").value;
    var userHeight = document.getElementById("heightIn").value;
    var userBombCount = document.getElementById("bombCountIn").value;
    
    userWidth = userWidth.match(/\d+/);
    userHeight = userHeight.match(/\d+/);
    userBombCount = userBombCount.match(/\d+/);
    
    const width = userWidth ? +userWidth[0] : 5;
    const height = userHeight ? +userHeight[0] : 5;
    const bombCount = userBombCount ? +userBombCount[0] : 5;
    
    return {width, height, bombCount};
}



function generateBombField(params) {
    var matrix = [];
    
    for (var i = 0; i < params.height; i++) {
        matrix.push([])
        for (var j = 0; j < params.width; j++) {
            matrix[i].push(0);
        }
    }
    
    //making a matrix to help keep bombs from spawning on top of each other
    //it makes a map of all of the possable bomb locations then picks a random point on that map. It puts a bomb on that place then removes it from the map so that it cannot be picked again.
    var areas = matrix.map((row, i) => row.map((_, j) => [j, i]));
    
    //fill the matrix with random bombs
    for (var i = 0; i < params.bombCount; i++) {
        var areaY = Math.floor(Math.random() * areas.length);
        var areaX = Math.floor(Math.random() * areas[areaY].length);
        
        var bombY = areas[areaY][areaX][1];
        var bombX = areas[areaY][areaX][0];
        
        matrix[bombY][bombX] = 1;
        
        areas[areaY].splice(areaX, 1);
        if (areas[areaY].length == 0) areas.splice(areaY, 1);
    }
    
    return matrix;
}



function generateNumberField(bombField) {
    var searchAreas = [
        [-1,-1],[-1, 0],[-1, 1],
        [ 0,-1],        [ 0, 1],
        [ 1,-1],[ 1, 0],[ 1, 1]
    ];
    
    return bombField.map((row, i) => {
        return row.map((val, j) => {
            return searchAreas.filter(([vert,hor], k) => {
                return bombField[i + vert] && bombField[i + vert][j + hor];
            }).length;
        });
    });
}



function generateGameField(bombs, numbers) {
    return bombs.map((row,i) => row.map((val,j) => {
        return !val ? numbers[i][j] ? numbers[i][j] : "&nbsp;" : "<span style=\"color:red\">*</span>" 
    }));
}



//Here are two functions for setting the display elements
function displayMatrix(matrix, id) {
    const result = matrix.map((val, index) => val.toString() + "<br>").toString().replaceAll(",", "");
    //pretty print matrix
    //for (var i = 0; i < matrix.length; i++) {
    //    result += matrix[i].toString() + "<br>";
    //}
    
    document.getElementById(id).innerHTML = result;
}



function displayParams(params) {
    document.getElementById("gameProperties").innerHTML = (
        "Height: " + params.height.toString() + "<br>" +
        "Width: " + params.width.toString() + "<br>" +
        "Bomb Count: " + params.bombCount.toString() + "<br>" +
        "Percentage bombs: " + (params.bombCount / (params.height * params.width) * 100).toFixed(1).toString() + "%"
    );
}



function doIt() {
    const params = getParams();
    
    const bombField = generateBombField(params);
    const numberField = generateNumberField(bombField);
    const gameField = generateGameField(bombField, numberField);
    
    displayParams(params);
    
    displayMatrix(bombField, "bombField");
    displayMatrix(numberField, "numberField");
    displayMatrix(gameField, "gameField");
}
