var ctx = $("canvas")[0].getContext("2d"),
    rowCnt = 20,
    colCnt = 20,
    cellSize = 16,
    cur = {
        x: 0,
        y: 0
    },
    dirX = 0,
    dirY = 0,
    lastT = new Date,
    speed = 50,
    timer;
// Create bg

function drawCell(x, y) {
    ctx.fillStyle = '#396';
    ctx.fillRect(0, 0, colCnt * cellSize, rowCnt * cellSize);
    ctx.fillStyle = '#9f9';
    ctx.fillRect(x, y, cellSize, cellSize);
}

$('body').keydown(function(e) {
    if (e.which == 37) {
        dirX = -1;
        dirY = 0;
    } else if (e.which == 38) {
        dirX = 0;
        dirY = -1;
    } else if (e.which == 39) {
        dirX = 1;
        dirY = 0;
    } else {
        dirX = 0;
        dirY = 1;
    }
});


timer = setInterval(function() {
    var now = new Date,
        offset = (now - lastT) / 100 * speed;
    lastT = now;
    cur.x += offset * dirX;
    cur.y += offset * dirY;

    if (cur.x < 0) cur.x = colCnt * cellSize + cur.x;
    if (cur.x > colCnt * cellSize) cur.x = cur.x - colCnt * cellSize;
    if (cur.y < 0) cur.y = rowCnt * cellSize + cur.y;
    if (cur.y > rowCnt * cellSize) cur.y = cur.y - rowCnt * cellSize;
    
    drawCell(cur.x, cur.y)
}, 16);




var snake;
var canvas = document.getElementById("snake_canvas");

$(function() {
    snake = new SnakeGame(canvas);
    snake.init();
    snake.startAnimation();
});

function SnakeGame(canvas) {

    this.name = "SnakeGame";
    this.canvas = canvas;
    this.pw = 640;
    this.ph = 480;

    this.playGround = new SnakePlayGround(40, 30, 16);
    this.body = new SnakeBody(20, 15, 16);

    this.lastUpdateTime = -1;

    this.head = {
        x: this.pw / 2,
        y: this.ph / 2
    };

    this.init = function() {
        canvas.width = this.pw;
        canvas.height = this.ph;
        this.context = canvas.getContext("2d");
    };

    document.onkeydown = function(e) {
        var e = window.event || e;
        var code = e.keyCode;
        if (code == 37) {
            snake.body.updateDirection(1);
        }
        else if (code == 38) {
            snake.body.updateDirection(2);
        }
        else if (code == 39) {
            snake.body.updateDirection(3);
        }
        else if (code == 40) {
            snake.body.updateDirection(4);
        }
    }

    this.startAnimation = function() {
        this.lastUpdateTime = new Date().getTime();
        this.animloop();

        this.drawBG(1);
        //this.playGround.draw(this.context);
        this.body.draw(this.context);
    }

    this.animloop = function() {
        requestAnimFrame(snake.animloop);
        snake.render();
    };

    this.render = function() {
        var t = new Date().getTime();
        if (this.body.updatePosition(t - this.lastUpdateTime)) {
            this.drawBG(.1);
            //this.playGround.draw(this.context);
            this.body.draw(this.context);
        }
        this.lastUpdateTime = t;
    };

    this.drawBG = function(ga) {
        log('draw bg');
        this.context.globalAlpha = ga;
        this.context.fillStyle = 'rgb(0,0,0)';
        this.context.fillRect(0, 0, this.pw, this.ph);
    };
}


function SnakeBody(x, y, cellW, mapW, mapH) {

    this.name = "SnakeBody";
    this.vx = x;
    this.vy = y;
    this.cw = cellW;
    this.mapW = mapW;
    this.mapH = mapH;

    this.speed = 30; // cell/sec
    this.lastTurn = null;
    this.nextTurn = null;
    this.directions = [];
    this.moveDistance = 0;

    this.updateDirection = function(newDir) {
        if (!this.lastTurn) {
            this.lastTurn = {
                d: newDir,
                dist: 0,
                x: this.vx,
                y: this.vy,
                dx: newDir == 1 ? -1 : newDir == 3 ? 1 : 0,
                dy: newDir == 2 ? -1 : newDir == 4 ? 1 : 0
            };
            this.directions.push(this.lastTurn);
        }
        else {
            var d = this.lastTurn.d;
            if (d != newDir && d + 2 != newDir && d - 2 != newDir) {
                var newTurnPos = this.getFutureTurnPos();
                this.nextTurn = {
                    d: newDir,
                    dist: Math.ceil(this.moveDistance),
                    x: newTurnPos[0],
                    y: newTurnPos[1],
                    dx: newDir == 1 ? -1 : newDir == 3 ? 1 : 0,
                    dy: newDir == 2 ? -1 : newDir == 4 ? 1 : 0
                }
            }
        }
    }

    this.getFutureTurnPos = function() {
        var t = this.lastTurn;
        var cDist = Math.ceil(this.moveDistance - t.dist);
        var cx = t.x + (cDist * t.dx);
        var cy = t.y + (cDist * t.dy);
        return [cx, cy];
    }

    this.getCurPos = function(newDist, lastTurn) {
        var cDist = newDist - lastTurn.dist;
        var cx = lastTurn.x + (cDist * lastTurn.dx);
        var cy = lastTurn.y + (cDist * lastTurn.dy);
        
        if (cx > mapW)
        {
            
        }
        else if (cx < 0)
        {
            
        }
        else if (cy > mapH)
        {
            
        }
        else if (cy < 0)
        {
            
        }
        
        return [cx, cy];
    }

    this.updatePosition = function(t) {

        if (!this.lastTurn) return false;

        var nt = this.nextTurn;
        var newDist = this.moveDistance + (t / 1000) * this.speed;
        this.moveDistance = newDist;

        //
        // update direction
        if (nt && Math.floor(newDist) >= nt.dist) {
            this.directions.push(nt);
            this.nextTurn = null;
            this.lastTurn = nt;
        }
        //
        // update visible position
        var newPos = this.getCurPos(newDist, this.lastTurn);
        var vx = Math.round(newPos[0]);
        var vy = Math.round(newPos[1]);
        if (vx != this.vx || vy != this.vy) {
            this.vx = vx;
            this.vy = vy;
            return true;
        }
        return false;
    }

    this.draw = function(c) {
        log('draw sanake');
        c.globalAlpha = 1;
        c.fillStyle = 'rgb(64,128,64)';
        c.beginPath();
        var cw = this.cw;
        var hcw = cw / 2;
        c.arc(this.vx * cw + hcw, this.vy * cw + hcw, hcw - 1, 0, Math.PI * 2, true);
        c.closePath();
        c.fill();
    }
}


function SnakePlayGround(mapW, mapH, cellW) {

    this.name = "SnakePlayGround";
    this.mw = mapW;
    this.mh = mapH;
    this.cw = cellW;

    this.draw = function(c) {

        c.fillStyle = 'rgb(0,0,0)';
        c.fillRect(0, 0, this.mw, this.mh);

        c.fillStyle = 'rgb(8, 8, 8)';
        var cw = this.cw;
        for (var i = 0, il = this.mw; i < il; i++) {
            for (var j = 0, jl = this.mh; j < jl; j++) {
                c.fillRect(i * cw + 1, j * cw + 1, cw - 2, cw - 2);
            }
        }
    }
}

function log(text) {
    console.log(text);
}

