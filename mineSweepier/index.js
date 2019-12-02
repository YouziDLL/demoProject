function Mine(tr, td, mineNum) {
    this.tr = tr;//行数
    this.td = td;//列数
    this.mineNum = mineNum;

    this.squares = [];//存储所有方块的信息，二维数组
    this.tds = [];//存储所有单元格的Dom
    this.surplusMine = mineNum;//剩余雷的数量
    this.allRight = false;//右键标记的小红旗是否全是雷。用来判断用户游戏成功

    this.parent = document.querySelector('.gameBox');
}

Mine.prototype.randomNum = function () {
    var square = new Array(this.tr * this.td);
    for (let i = 0; i < square.length; i++) {
        square[i] = i;
    }
    square.sort(function () {
        return 0.5 - Math.random();
    });
    return square.slice(0, this.mineNum);
};
Mine.prototype.init = function () {
    // this.randomNum();
    var rn = this.randomNum();
    var n = 0;//用来找到格子对应的索引
    for (let i = 0; i < this.tr; i++) {
        this.squares[i] = [];
        for (let j = 0; j < this.td; j++) {
            //this.squares[i][j];
            if (rn.indexOf(++n) != -1) {
                this.squares[i][j] = {type: 'mine', x: j, y: i};
            } else {
                this.squares[i][j] = {type: 'number', x: j, y: i, value: 0};
            }
        }
    }
    this.parent.oncontextmenu = function () {
        return false;
    };
    // console.log(this.squares);
    this.updateNum();
    this.createDom();

    this.mineNumDom = document.querySelector('.mineNum');
    this.mineNumDom.innerHTML = this.surplusMine;
};

Mine.prototype.createDom = function () {
    //创建表格
    var self = this;
    var table = document.createElement('table');

    for (let i = 0; i < this.tr; i++) {
        var domTr = document.createElement('tr');
        this.tds[i] = [];

        for (let j = 0; j < this.td; j++) {
            var domTd = document.createElement('td');

            domTd.pos = [i, j];
            domTd.onmousedown = function (e) {
                self.play(event, this);
            };
            this.tds[i][j] = domTd;
            //domTd.innerHTML='0';
            // if (this.squares[i][j].type == 'mine') {
            //     domTd.className = 'mine';
            // }
            // if (this.squares[i][j].type == 'number') {
            //     domTd.innerHTML = this.squares[i][j].value;
            // }

            domTr.appendChild(domTd);
        }
        table.appendChild(domTr);
    }
    this.parent.innerHTML='';
    this.parent.appendChild(table);
};

Mine.prototype.getAround = function (square) {
    var x = square.x;
    var y = square.y;
    var result = [];

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i < 0 || j < 0 || i > this.td - 1 || j > this.tr - 1 || (i == x && j == y) || this.squares[j][i].type == 'mine') {
                continue;
            }
            result.push([j, i]);
        }
    }
    return result;
};

Mine.prototype.updateNum = function () {
    for (let i = 0; i < this.tr; i++) {
        for (let j = 0; j < this.td; j++) {
            //只更新雷周围的数字
            if (this.squares[i][j].type == 'number') {
                continue;
            }
            var num = this.getAround(this.squares[i][j]);

            for (let k = 0; k < num.length; k++) {
                this.squares[num[k][0]][num[k][1]].value += 1;
            }
        }
    }
};

Mine.prototype.play = function (ev, obj) {
    var self = this;
    if (ev.which == 1 && obj.className != 'flag') {
//点击的是左键
        var curSquare = this.squares[obj.pos[0]][obj.pos[1]];
        var cl = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
        if (curSquare.type == 'number') {
            obj.innerHTML = curSquare.value;
            obj.className = cl[curSquare.value];
            if (curSquare.value == 0) {
                obj.innerHTML = '';

                function getAllZero(square) {
                    var around = self.getAround(square);
                    for (let i = 0; i < around.length; i++) {
                        var x = around[i][0];
                        var y = around[i][1];

                        self.tds[x][y].className = cl[self.squares[x][y].value];
                        if (self.squares[x][y].value == 0) {
                            if (!self.tds[x][y].check) {
                                //用于判断这个格子是否被找过。
                                self.tds[x][y].check = true;
                                getAllZero(self.squares[x][y]);
                            }
                        } else {
                            self.tds[x][y].innerHTML = self.squares[x][y].value;
                        }
                    }
                }

                getAllZero(curSquare);
            }
        } else {
            this.gameOver(obj);
            setTimeout(function () {
                alert('游戏失败');
                self.init();
            },1000);
        }
    }
    if (ev.which == 3) {
        if (obj.className && obj.className != 'flag') {
            return;
        }
        obj.className = obj.className == 'flag' ? '' : 'flag';

        if (this.squares[obj.pos[0]][obj.pos[1]].type == 'mine') {
            this.allRight = true;
        } else {
            this.allRight = false;
        }
        if (obj.className == 'flag') {
            this.mineNumDom.innerHTML = --this.surplusMine;
        } else {
            this.mineNumDom.innerHTML = ++this.surplusMine;
        }
        if (this.surplusMine == 0) {
            if (this.allRight) {
                alert('恭喜你，游戏通过！');
                this.init();
            } else {
                alert('游戏失败');
                this.gameOver();
                this.init();
            }
        }
    }
};

Mine.prototype.gameOver = function (clikeTd) {
    for (let i = 0; i < this.tr; i++) {
        for (let j = 0; j < this.td; j++) {
            if (this.squares[i][j].type == 'mine') {
                this.tds[i][j].className = 'mine';
            }
            this.tds[i][j].onmousedown = null;
        }
    }
    if (clikeTd) {
        clikeTd.style.backgroundColor = '#f00';
    }
};

var btns = document.querySelectorAll('.level button');
var mine = null;
var ln = 0;
var arr=[[9,9,10],[16,16,40],[28,28,99]];

for (let i = 0; i < btns.length-1; i++) {
    btns[i].onclick = function () {
        btns[ln].className='';
        this.className='active';
        mine = new Mine(...arr[i]);
        mine.init();
        ln=i;
    }
}

btns[0].onclick();
btns[3].onclick = function () {
    mine.init();
}

// var mine = new Mine(28, 28, 99);
// mine.init();
