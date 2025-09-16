document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 8;
    const squares = [];
    let score = 0;
    let squareSelected = null;

    const candyColors = [
        'url(images/1000006994.png)',
        'url(images/1000006995.png)',
        'url(images/1000006992.png)',
        'url(images/1000006993.png)',
        'url(images/1000006991.png)',
        'url(images/1000006990.png)'
    ];

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    squares.forEach(square => square.addEventListener('touchstart', touchStart));

    function touchStart() {
        if (!squareSelected) {
            squareSelected = this;
            this.classList.add('selected');
        } else {
            const squareIdBeingDragged = parseInt(squareSelected.id);
            const squareIdBeingReplaced = parseInt(this.id);
            const validMoves = [squareIdBeingDragged - 1, squareIdBeingDragged - width, squareIdBeingDragged + 1, squareIdBeingDragged + width];
            const validMove = validMoves.includes(squareIdBeingReplaced);

            if (validMove) {
                const colorBeingDragged = squareSelected.style.backgroundImage;
                const colorBeingReplaced = this.style.backgroundImage;
                this.style.backgroundImage = colorBeingDragged;
                squareSelected.style.backgroundImage = colorBeingReplaced;
                
                const matchFound = checkAndClearMatches();
                
                if (!matchFound) {
                    setTimeout(() => {
                        this.style.backgroundImage = colorBeingReplaced;
                        squareSelected.style.backgroundImage = colorBeingDragged;
                    }, 500);
                }
            }
            
            squareSelected.classList.remove('selected');
            squareSelected = null;
        }
    }
    
    function checkAndClearMatches() {
        let matchFound = false;
        if (checkRowForFour()) matchFound = true;
        if (checkColumnForFour()) matchFound = true;
        if (checkRowForThree()) matchFound = true;
        if (checkColumnForThree()) matchFound = true;
        return matchFound;
    }

    function moveIntoSquareBelow() {
        for (let i = 0; i < (width * width - width); i++) {
            if (squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = '';
            }
        }
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === '') {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
    }
    
    function checkRowForFour() {
        let matchFound = false;
        for (let i = 0; i < 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
            if (notValid.includes(i)) continue;

            if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                rowOfFour.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                matchFound = true;
            }
        }
        return matchFound;
    }

    function checkColumnForFour() {
        let matchFound = false;
        for (let i = 0; i < 39; i++) {
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                columnOfFour.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                matchFound = true;
            }
        }
        return matchFound;
    }

    function checkRowForThree() {
        let matchFound = false;
        for (let i = 0; i < 62; i++) {
            let rowOfThree = 
