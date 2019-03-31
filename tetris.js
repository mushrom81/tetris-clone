
let board = [
    document.getElementById("board1"),
    document.getElementById("board2"),
    document.getElementById("board3"),
    document.getElementById("board4"),
    document.getElementById("board5"),
    document.getElementById("board6"),
    document.getElementById("board7"),
    document.getElementById("board8"),
    document.getElementById("board9"),
    document.getElementById("board10"),
    document.getElementById("board11"),
    document.getElementById("board12"),
    document.getElementById("board13"),
    document.getElementById("board14"),
    document.getElementById("board15"),
    document.getElementById("board16"),
    document.getElementById("board17"),
    document.getElementById("board18"),
    document.getElementById("board19"),
    document.getElementById("board20")
];

let scoreNextPiece = document.getElementById("board0");
let gameOverIndicator = document.getElementById("board21");

let smallScreen = false; // Toggles small screen
let e = "▕" // Empty space character
let o = "█" // Block character
let l = "▒" // block preview character
let pieceX = 4;
let pieceY = 20;
let rotation = 0;
let nextPiece = 1 + Math.floor(Math.random() * 7);
let piece = 1 + Math.floor(Math.random() * 7);
let gameOver = false;
let score = 0;
let lines = 0; // Number of lines completed, used to determine level
let level = 0; // Current level, used to determine piece speed
let downPressedThisTick = false;
let placedBlocks = []; // Immovable blocks
let fallingBlock = []; // Current falling Block
let previewBlock = []; // Preview of where block will land
for (let i = 0; i < 220; i++) { // Filling arrays with zeroes
    placedBlocks.push(0);
    fallingBlock.push(0);
    previewBlock.push(0);
}

function rc() { // Rotates the piece clockwise
    rotation += 1;
    if (rotation >= 4) {rotation = 0}
    updateBlock();
}

function rcc() { // Rotates the piece counter-clockwise
    rotation -= 1;
    if (rotation <= -1) {rotation = 3}
    updateBlock();
}

function tryLeftAndRight() { // Trys to place the rotated block to the left and right of where it is
    pieceX -= 1;
    updateBlock();
    if (pieceIsEnveloped() || pieceIsWrapping()) {
        pieceX += 2;
        updateBlock();
        if (pieceIsEnveloped() || pieceIsWrapping()) {
            pieceX -= 3;
            updateBlock();
            if (pieceIsEnveloped() || pieceIsWrapping()) {
                pieceX += 4;
                updateBlock();
                if (pieceIsEnveloped() || pieceIsWrapping()) {
                    pieceX -= 2;
                    updateBlock();
                    return false;
                }
            }
        }
    }
    return true;
}

document.onkeydown = function(e) { // Keypress handlers
    e = e || window.event;
    switch (e.key) {
        case "o":
            rc();
            if (pieceIsEnveloped() || pieceIsWrapping()) {
                if (!(tryLeftAndRight())) {
                    rcc();
                }
            }
        break;
        case "k":
            rcc();
            if (pieceIsEnveloped() || pieceIsWrapping()) {
                if (!(tryLeftAndRight())) {
                    rc();
                }
            }
        break;
        case "w":
            fallingBlock = previewBlock.slice();
            solidifyPiece();
            deleteRows();
        break;
        case "a":
            pieceX -= 1;
            updateBlock();
            if (pieceIsEnveloped() || pieceIsWrapping()) {pieceX += 1}
        break;
        case "s":
            if (!(pieceIsGrounded(fallingBlock))) {pieceY -= 1}
            downPressedThisTick = true;
        break;
        case "d":
            pieceX += 1;
            updateBlock();
            if (pieceIsEnveloped() || pieceIsWrapping()) {pieceX -= 1}
        break;
        case "t":
            smallScreen = !(smallScreen);
        break;
    }
    updateBlock();
    display();
}

function display() { // Updates the board view
    if (smallScreen) smalldisplay();
    else bigdisplay();
}

function smalldisplay() { // Small board view
    updatePreview();
    let line;
    let twoxtwo;
    for (let i = 0; i < 20; i++) {
        board[i].innerHTML = "";
    }
    for (let y = 2; y < 22; y += 2) {
        line = ["▕"]
        for (let x = 0; x < 10; x += 2) {
            twoxtwo = [
                placedBlocks[x + (10 * y)] + fallingBlock[x + (10 * y)],
                placedBlocks[x + (10 * y) + 1] + fallingBlock[x + (10 * y) + 1],
                placedBlocks[x + (10 * y) + 10] + fallingBlock[x + (10 * y) + 10],
                placedBlocks[x + (10 * y) + 11] + fallingBlock[x + (10 * y) + 11],
            ];
            for (let i = 0; i < 4; i++) {
                if (twoxtwo[i] > 0) {
                    twoxtwo[i] = 1;
                }
            }
            if (twoxtwo.join("") == "0000") {
                line.push(e);
            }
            else if (twoxtwo.join("") == "1000") {
                line.push("▘");
            }
            else if (twoxtwo.join("") == "0100") {
                line.push("▝");
            }
            else if (twoxtwo.join("") == "1100") {
                line.push("▀");
            }
            else if (twoxtwo.join("") == "0010") {
                line.push("▖");
            }
            else if (twoxtwo.join("") == "1010") {
                line.push("▌");             
            }
            else if (twoxtwo.join("") == "0110") {
                line.push("▞");              
            }
            else if (twoxtwo.join("") == "1110") {
                line.push("▛");               
            }
            else if (twoxtwo.join("") == "0001") {
                line.push("▗");                
            }
            else if (twoxtwo.join("") == "1001") {
                line.push("▚");
            }
            else if (twoxtwo.join("") == "0101") {
                line.push("▐");
            }
            else if (twoxtwo.join("") == "1101") {
                line.push("▜");
            }
            else if (twoxtwo.join("") == "0011") {
                line.push("▄");
            }
            else if (twoxtwo.join("") == "1011") {
                line.push("▙");
            }
            else if (twoxtwo.join("") == "0111") {
                line.push("▟");
            }
            else if (twoxtwo.join("") == "1111") {
                line.push(o);                
            }
        }
        line = line.join("");
        board[y - 2].innerHTML = line;
    }
    updateIndicators();
}

function bigdisplay() { // Big board view
    updatePreview();
    let line;
    for (let y = 2; y < 22; y++) {
        line = ["▕"];
        for (let x = 0; x < 10; x++) {
            if (placedBlocks[x + (10 * y)] + fallingBlock[x + (10 * y)] > 0) {
                line.push(o);
            }
            else if (previewBlock[x + (10 * y)] > 0) {
                line.push(l);
            }
            else {
                line.push(e);
            }
        }
        line = line.join("");
        board[y - 2].innerHTML = line;
    }
    updateIndicators();
}

function deleteRows() { // Deletes all complete rows and updates score and level
    let rows = 0;
    let rowFull;
    for (y = 2; y < 22; y++) {
            rowFull = true;
        for (x = 0; x < 10; x++) {
            if (placedBlocks[x + (10 * y)] == 0) {rowFull = false}
        }
        if (rowFull) {
            rows += 1;
            deleteRow(y);
        }
    }
    switch (rows) {
        case 1:
            score += 40;
        break;
        case 2:
            score += 100;
        break;
        case 3:
            score += 300;
        break;
        case 4:
            score += 1200;
        break;
    }
    if (((lines % 10) + rows) >= 10 && lines != 0) {
        level++;
        if (level > 9) { level = 9; }
    }
    lines += rows;
    updateIndicators();
}

function deleteRow(row) { // Deletes the given row and drops all of the blocks above it down one
    for (i = 0; i< 10; i++) {
        placedBlocks[i + (row * 10)] = 0
    }
    while (row > 0) {
        row -= 1;
        for (i = 0; i< 10; i++) {
            placedBlocks[i + ((row + 1) * 10)] = placedBlocks[i + (row * 10)];
        }
    }
    for (i = 0; i< 10; i++) {
        placedBlocks[i] = 0;
    }
}

function pieceIsWrapping() { // checks if the current piece is wrapping
    for (i = 9; i < 220; i += 10) {
        if (fallingBlock[i] == 1 && fallingBlock[i + 1] == 1) {
            return true;
        }
    }
    if (pieceX > 9 || pieceX < 0) {return true}
    return false;
}

let blockVals = ["&nbsp;&nbsp;",
    "▄▄", // 1 = I
    "▆", // 2 = O   *Needs no rotation
    "▜▘", // 3 = T
    "▜▖", // 4 = Z
    "▀▌", // 5 = J
    "▛▘", // 6 = L
    "▟▘"  // 7 = S
];

function updateBlock() { // calls loadBlock with the default values
    loadBlock(pieceX, pieceY,piece, rotation);
}

function loadBlock(x, y, block, rotation) { // Loads a polyomio into fallingBlock
    y = 20 - y;
    fallingBlock = [];
    for (let i = 0; i < 220; i++) {
        fallingBlock.push(0);
    }
    let accessVar;
    let coordArray = [[0,0],false,false,false];
    let temp;
    switch (block) {
        case 1:
            coordArray[1] = [1,0];
            coordArray[2] = [2,0];
            coordArray[3] = [-1,0];
        break;
        case 2:
            rotation = 0;
            coordArray[1] = [0,-1];
            coordArray[2] = [1,0];
            coordArray[3] = [1,-1];
        break;
        case 3:
            coordArray[1] = [-1,0];
            coordArray[2] = [0,-1];
            coordArray[3] = [1,0];
        break;
        case 4:
            coordArray[1] = [-1,0];
            coordArray[2] = [0,-1];
            coordArray[3] = [1,-1];
        break;
        case 5:
            coordArray[1] = [-1,0];
            coordArray[2] = [1,-1];
            coordArray[3] = [1,0];
        break;
        case 6:
            coordArray[1] = [1,0];
            coordArray[2] = [-1,-1];
            coordArray[3] = [-1,0];
        break;
        case 7:
            coordArray[1] = [1,0];
            coordArray[2] = [0,-1];
            coordArray[3] = [-1,-1];
        break;
        default:
            return;
        break;
    }
    coordArray.forEach(function(coords) {
        switch (rotation) {
            case 1:
                temp = coords[0];
                coords[0] = coords[1];
                coords[1] = 0 - temp;
            break;
            case 2:
                coords[0] = 0 - coords[0];
                coords[1] = 0 - coords[1];
            break;
            case 3:
                temp = coords[0];
                coords[0] = 0 - coords[1];
                coords[1] = temp;
            break;
        }
        coords[1] = 0 - coords[1];
        accessVar = x + 10 + coords[0] + ((y + coords[1]) * 10);
        fallingBlock[accessVar] = 1
    });
}

function updatePreview() { // Updates the preview piece
    previewBlock = fallingBlock.slice();
    for (let t = 0; t < 20; t++) {
        if (!pieceIsGrounded(previewBlock)) {
            let oldArray = previewBlock.slice();
            for (let i = 219; i > -1; i -= 1) {
                if (oldArray[i] == 1) {
                    previewBlock[i] = 0;
                    previewBlock[i + 10] = 1;
                }
            }
        }
    }
}

function solidifyPiece() { // Solidifies the current piece if it is on the ground, ends game if piece at top    
    if (pieceIsGrounded(fallingBlock)) {
        for (let i = 0; i < 220; i++) {
            if (fallingBlock[i] == 1) {
                placedBlocks[i] = 1;
                fallingBlock[i] = 0;
            }
        }
        pieceX = 4;
        pieceY = 20;
        rotation = 0;
        piece = nextPiece;
        nextPiece = 1 + Math.floor(Math.random() * 7);
        updateBlock();
        if (pieceIsGrounded(fallingBlock) || pieceIsEnveloped()) {
            gameOver = true;
            for (let i = 0; i < 220; i++) {
                if (fallingBlock[i] == 1) {
                    placedBlocks[i] = 1;
                    fallingBlock[i] = 0;
                }
            }
        }
        pieceY = 19;
        if (gameOver) {
            piece = 0;
            nextPiece = 0;
        }
        updateBlock();
        return true;
    }
    return false;
}

function pieceIsGrounded(blockArray) { // Checks if the falling piece / preview piece is grounded
    for (let i = 0; i < 220; i++) {
        if (blockArray[i] == 1 && (placedBlocks[i + 10] == 1 || i + 10 > 219))     {
            return true;
        }
    }
    return false;
}

function pieceIsEnveloped() { // Checks if the falling piece is inveloped by any placed blocks
    for (let i = 0; i < 220; i++) {
        if (placedBlocks[i] == 1 && fallingBlock[i] == 1)     {
            return true;
        }
    }
    if (fallingBlock.length > 220) { return true; }
    return false;
}

function updateIndicators() { // Updates the indicators at the top and side
    let pieceIndicator = blockVals[nextPiece];
    scoreNextPiece.innerHTML ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Score:&nbsp;" + score;
    board[4].innerHTML += "&nbsp;&nbsp;Lines:&nbsp;" + lines;
    if (smallScreen) board[8].innerHTML += "&nbsp;&nbsp;Next:"
    else board[9].innerHTML += "&nbsp;&nbsp;Next:"
    board[10].innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + pieceIndicator;
    board[14].innerHTML += "&nbsp;&nbsp;Level:&nbsp;" + level
}

function fallLoop() { // Drops the piece every interval
    updateBlock();
    if (solidifyPiece()) {deleteRows()}
    else if (downPressedThisTick) {
        downPressedThisTick = false;
    }
    else {
        pieceY -= 1;
    }
    updateBlock();
    if (gameOver) {
        gameOverIndicator.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;Game Over!"
    }
    display();
    setTimeout(fallLoop, 800 - (level * 80));
}
fallLoop();
