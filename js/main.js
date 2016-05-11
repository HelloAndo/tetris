$(function(){

$(window).keyup(function(event) {
	console.log(event)
});

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
	this.colorClass;
	this.mapArray;		//地图信息数组，有方块的格子其值为1，反之为0
	this.speed;			//水平方向的速度，左为-1，右为1
	this.moveDelayTime = 200;		//垂直移动默认的时间间隔
	this.colorArray;				//$('.tetris')颜色数组
	this.colorArrayLen;				//颜色数组长度
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

	},

	createMap: function(  ){
		this.createSquare( $('.map'), this.size[0], this.size[1]);
		$('.map').find('div').addClass('mapDiv');
		$('.map').find('.tetris').removeClass('mapDiv');
		this.initMapArray();
	},

	createTetris: function(){
		this.tetris = this.createSquare( $('.tetris'), 3, 3);		//创建.tetris的子元素并返回$('.tetris')
		this.shape = this.getRandomNum( 0, 3 );						//随机创建$('.tetris')的形态
		this.colorArrayLen = graphJson[ this.type ][ this.shape ] ;	//颜色数组的长度
		this.colorTetris( graphJson[ this.type ][ this.shape ] );	//根据$('.tetris')的形态绘画颜色
		this.autoDrop();  											//初始化方块自由落体

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
		this.colorClass = graphJson[ this.type ]['color'] ;
		$('.tetris span').removeClass();
		for(var i = 0, len = colorArray.length; i < len; i++ ){
			$('.tetris>div').eq( colorArray[i][0] ).find('span').eq( colorArray[i][1] ).addClass( this.colorClass );

		}

	},

	colorMap: function(){

		var tetrisCol = this.tetris.position().left / 30 ,
			tetrisRow = this.tetris.position().top / 30 ,
			colorArray = graphJson[ this.type ][ this.shape ] ;
		for(var i = 0, len = colorArray.length; i < len; i++ ){
			$('.mapDiv').eq( colorArray[i][0] + tetrisRow ).find('span').eq( colorArray[i][1] + tetrisCol ).addClass( this.colorClass );
			this.mapArray[ colorArray[i][0] + tetrisRow ][ colorArray[i][1] + tetrisCol ] = 1;
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

	changeSpeed: function(){

		$(window).keyup(function(event) {
			switch( event.which ){
				case 37:
					
			}
		});

	},

	autoDrop: function(){
		var that = this;
		this.timer = setInterval(function(){
			that.isTouch() ? ( clearInterval( that.timer ), that.colorMap() ) : that.tetris.css({top: '+=' + 30}) ;
		}, that.moveDelayTime);

	},

	isTouchLeft: function(){
		var col = this.tetris.position().left / 30 - 1 ,
			row = this.tetris.position().top / 30 ,
			col_map ,
			row_map ;
		if(col < 0){return true;}
		for(var i = 0; i < this.colorArrayLen; i++ ){
			row_map = this.colorArray[i][0] + row ;
			col_map = this.colorArray[i][1] + col ;
			if( this.mapArray[ col_map ][ row_map ] == 1 ){
				return true;
			}
		}
		return false;
	},

	isTouchRight: function(){
		var col = this.tetris.position().left / 30 + 3 ,
			row = this.tetris.position().top / 30 ,
			col_map ,
			row_map ;
		if(col > this.size[1] - 1 ){return true;}
		for(var i = 0; i < this.colorArrayLen; i++ ){
			row_map = this.colorArray[i][0] + row ;
			col_map = this.colorArray[i][1] + col ;
			if( this.mapArray[ col_map ][ row_map ] == 1 ){
				return true;
			}
		}
		return false;
	},

	isTouchDown: function(){
		var col = this.tetris.position().left / 30 ,
			row = this.tetris.position().top / 30 + 1;

		if( row + 2 > this.size[0] - 1 ){
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