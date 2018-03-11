var bar1;
analysisResult = null;
moveId = 0;

var analysePosition = function(){
    ENGINE.startAnalysis(GAME.fen());
};

var showAnalysisResult = function(analysis){
    
    //Set globals
    moveId = 0;
    analysisResult = analysis;
    bestMove = analysis.bestMove;

    //Clear board 
    clearBoard();

    //Update view
    updateScoreBar(analysis.cp);
    paintBestMoveOnBoard(bestMove);
    $("#analysisBox").val(analysis.moveList);

};

var updateScoreBar = function(cp){
    var turn = GAME.turn();
    if(turn==="b") cp=cp*(-1);
    score = 50 + (cp/10);    
    if(score<0) score = 0;
    bar1.set(score);
};

var nextMove = function(){
    moveList = analysisResult.moveList;
    if(moveList){
        move = moveList[moveId];
        source = move.substring(0,2);
        target = move.substring(2,4); 
        moveId++;
        clearBoard();
        playMove(source, target);
    };
};

var backMove = function(){
    if(analysisResult.moveList){
        GAME.undo();
        clearBoard();
        BOARD.position(GAME.fen());
        moveId--;
    };
};

var showMoveList = function(){

}


