Document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 8;
    const squares = [];
    let score = 0;
    let squareSelected = null;

    const candyColors = [
        'url(images/red-candy.png)',
        'url(images/yellow-candy.png)',
        'url(images/orange-candy.png)',
        'url(images/purple-candy.png)',
        'url(images/green-candy.png)',
        'url(images/blue-candy.png)'
    ];

    //create your board
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

    // Touch events for mobile devices
    squares.forEach(square => square.addEventListener('touchstart', touchStart));

    function touchStart() {
        if (!squareSelected) {
            squareSelected = this;
            squareSelected.classList.add('selected'); // Optional: Add visual feedback for selected square
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
                
                // Immediately check for matches after a valid move
                const matchFound = checkAndClearMatches();
                
                // If no match is found, swap back the candies
                if (!matchFound) {
                    setTimeout(() => {
                        this.style.backgroundImage = colorBeingReplaced;
                        squareSelected.style.backgroundImage = colorBeingDragged;
                    }, 500); // Wait a bit before swapping back
                }
                
            } else {
                // Invalid move, reset selection
                squareSelected.classList.remove('selected');
                squareSelected = null;
            }

            // After a move (valid or invalid), reset selection
            if (squareSelected) {
                squareSelected.classList.remove('selected');
                squareSelected = null;
            }
        }
    }
    
    // Check and clear matches, returns true if a match was found
    function checkAndClearMatches() {
        let matchFound = false;
        if (checkRowForFour()) matchFound = true;
        if (checkColumnForFour()) matchFound = true;
        if (checkRowForThree()) matchFound = true;
        if (checkColumnForThree()) matchFound = true;
        return matchFound;
    }

    //drop candies once some have been cleared
    function moveIntoSquareBelow() {
        for (i = 0; i <= 55; i++) { // Loop tot de 5e rij (index 55)
            if (squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = '';
            }
        }
        // Vul de bovenste rij met nieuwe snoepjes
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === '') {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
    }
    
    // De check-functies zijn nu aangepast om true/false terug te geven
    function checkRowForFour() {
        let matchFound = false;
        for (i = 0; i < 60; i++) {
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
        for (i = 0; i < 39; i++) {
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
        for (i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
            if (notValid.includes(i)) continue;

            if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                matchFound = true;
            }
        }
        return matchFound;
    }

    function checkColumnForThree() {
        let matchFound = false;
        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                matchFound = true;
            }
        }
        return matchFound;
    }

    window.setInterval(function() {
        moveIntoSquareBelow();
        checkAndClearMatches();
    }, 100);
});
