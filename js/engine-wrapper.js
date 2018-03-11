var analysisResult = '';

var matchBestMove = function (line){
    var match = line.match(/bestmove\s([a-h][1-8][a-h][1-8])(n|N|b|B|r|R|q|Q)?/);
    return match;
};

var parseBestMove = function (bestMoveLine) {
    var bestMove = bestMoveLine[1];
    return {
        from: bestMove.substring(0, 2),
        to: bestMove.substring(2, 4),
        promotion: 'q'
    };
};

var parseCP = function(line){
    var match = line.match(/(cp (-)?\d+(\.\d)*)/i);  
    if(match){
        return match[0].substring(2);
    }
};

var parseMoveList = function(line){
    if(line.match(/pv/)){
        var match = line.match(/([a-h][1-8][a-h][1-8])/g);  
       return match;
    };
};

var parseInfoLine = function(line) {
    var match_info = line.match(/(info)/i);  
    var match_depth = line.match(/(depth)/i); 
    if(match_info && match_depth){
        return line.substring(5);
    }
};

function ChessEngine(enginePath) {
 
    this.newGame = function () {
        this.engine.postMessage("uci");
        this.engine.postMessage("ucinewgame");       
    };

    this.onResponse = function (event){

        bestMoveMatched = matchBestMove(event.data);
        
        if(parseInfoLine(event.data)){
            analysisResult = parseInfoLine(event.data);
        }
        
        if(parseCP(event.data)){
            cp = parseCP(event.data);
        }
        
        if(parseMoveList(event.data)){
            moveList = parseMoveList(event.data);
        }
        
        if(bestMoveMatched){
          bestMove = parseBestMove(bestMoveMatched);
          ret = {
            completeAnalysis: analysisResult,
            bestMove: bestMove,
            cp: cp,
            moveList: moveList
          };
          showAnalysisResult(ret);
        };
    };
    
    this.startAnalysis = function (fenPosition){
        message = 'position fen ' + fenPosition;
        this.engine.postMessage(message);
        this.engine.postMessage('go movetime 1000');
    };

    this.engine = new Worker(enginePath);
    this.engine.onmessage = this.onResponse;    
};


