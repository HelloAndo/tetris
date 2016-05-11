$(function(){

// $(window).keyup(function(event) {
// 	console.log(event)
// });

// "1"——"凸"字形，形态数组的第一个坐标数字约定为纵坐标，与tr绑定

var graphJson={
	'1': {
		'0': [
			[1,1], [2,0], [2,1], [2,2]
		],
		'1': [
			[0,0], [1,0], [1,1], [2,0]
		],
		'2': [
			[1,0], [1,1], [1,2], [2,1]
		],
		'3': [
			[0,1], [1,0], [1,1], [2,1]
		],
		'color': 'yellow'
	}
};

function Tetris(){

	this.size = [22, 15];	//游戏地图的size
	this.tetris;		//这一回合的方块对象,jQuery对象
	this.type = 1;		//方块形态
	this.timer = null;		//方块自由降落计时器
	this.shape;		//创建时的初始形态数值
	this.mapArray;		//地图信息数组，有方块的格子其值为1，反之为0
	this.moveDelayTime = 500;		//垂直移动默认的时间间隔

	this.createMap();
	this.createTetris();

}

Tetris.prototype = {

	initMapArray: function(){
		this.mapArray = new Array();
		for(var i=0; i<this.size[0]; i++){
			this.mapArray[i] = new Array();
			for(var j=0; j<this.size[1]; j++){
				this.mapArray[i][j] = 0;
			}
		}
// console.log(this.mapArray);
	},

	createMap: function(  ){
		this.createSquare( $('.map'), this.size[0], this.size[1]);
		this.initMapArray();
	},

	createTetris: function(){
		this.tetris = this.createSquare( $('.tetris'), 3, 3);		//创建.tetris的子元素并返回$('.tetris')
		this.shape = this.getRandomNum( 0, 3 )						//随机创建$('.tetris')的形态
		this.colorTetris( graphJson[ this.type ][ this.shape ] );	//根据$('.tetris')的形态绘画颜色
		this.autoDrop();  											//初始化方块自由落体
// console.log(this.tetris.position().left)
	},

	createSquare: function($obj, row, col){
		for (var i = 0; i < row; i++) {
			var div = document.createElement('div');
			for(var j = 0; j < col; j++){
				var span = document.createElement('span');
				div.appendChild(span);
			}
			$obj.append(div);
		}
		return $obj ;
	},

	colorTetris: function( colorArray ){

		$('.tetris span').removeClass();
		for(var i = 0, len = colorArray.length; i < len; i++ ){
			$('.tetris>div').eq( colorArray[i][0] ).find('span').eq( colorArray[i][1] ).addClass( graphJson[ this.type ]['color'] );

		}

	},

	//键盘控制$('.tetris')形态改变，调用colorTetris
	changeShape: function(){
		var that = this ,
			colorArray ;
		// this.     = 0;
		$(window).keyup(function(event) {
			if( event.which == 32 ){
				that.shape++;
// console.log(event.which)
				colorArray = graphJson[ that.type ][ that.shape % 4 ];
				that.colorTetris( colorArray );
			}
		});
	},

	autoDrop: function(){
		var that = this;
		this.timer = setInterval(function(){
			that.isTouch() ? clearInterval( that.timer ) : that.tetris.css({top: '+=' + 30}) ;
		}, that.moveDelayTime);
	},

	isTouch: function(){
		var flag,
			col = this.tetris.position().left / 30 ,
			row = this.tetris.position().top / 30 + 1;
// console.log(col)
// console.log(row)
		if( col < 0 || col > this.size[1] - 3 || row > this.size[0] - 3 ){
			return true;
		}else{
			return this.mapArray[row][col] == 1 || undefined ? true : false ;
		}
		
	},

	getRandomNum: function(min, max){
		return Math.floor( Math.random() * ( max - min + 1 ) + min );
	}

};


var tetris = new Tetris();
tetris.changeShape();

});