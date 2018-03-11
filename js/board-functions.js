var playMove = function(source, target){
    
    // see if the move is legal
    var move = GAME.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    
    // illegal move
    if (move === null)
        return 'snapback';
    
    BOARD.position(GAME.fen());
};

var paintBestMoveOnBoard = function(move) {
    yellowSquare(move.from);
    yellowSquare(move.to);
};

var onMouseoutSquare = function (square, piece) {
    removeGreySquares();
};

var onSnapEnd = function () {
    BOARD.position(GAME.fen());
};

var backOneMove = function () {
    GAME.undo();
    BOARD.position(GAME.fen());
};

var analizePosition = function(){
    bestMove(GAME.fen());
};

var yellowSquare = function (square) {
    var squareEl = $('#board .square-' + square);
    var background = '#e9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
       background = '#e96969';
    }
    squareEl.css('background', background);
};

var greySquare = function (square) {
    var squareEl = $('#board .square-' + square);
    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }
    squareEl.css('background', background);
};

var onMouseoverSquare = function (square, piece) {
    
    if(bestMove) {
        paintBestMoveOnBoard();
    }
    // get list of possible moves for this square
    var moves = GAME.moves({
        square: square,
        verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0)
        return;

    // highlight the square they moused over
    greySquare(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var clearBoard = function(){
    removeGreySquares();
};

var removeGreySquares = function () {
    $('#board .square-55d63').css('background', '');
};

var onDragStart = function (source, piece) {
    // do not pick up pieces if the game is over
    // or if it's not that side's turn
    if (GAME.game_over() === true ||
            (GAME.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (GAME.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
};

var onDrop = function (source, target) {
      
    removeGreySquares();

    // see if the move is legal
    var move = GAME.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null)
        return 'snapback';
  
    bestMove = null;
};

var BOARD_CONFIG = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
