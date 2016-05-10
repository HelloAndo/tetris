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
	this.initShape;		//创建时的初始形态数值



	this.createMap();
	this.createTetris();

}

Tetris.prototype = {

	createMap: function(  ){
		this.createSquare( $('.map'), this.size[0], this.size[1]);

	},

	createTetris: function(){
		this.tetris = this.createSquare( $('.tetris'), 3, 3);
console.log(this.tetris)
		this.initShape = this.getRandomNum( 0, 3 )
		this.colorTetris( graphJson[ this.type ][ this.initShape ] );
		// this.autoDrop();
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

	changeShape: function(){
		var that = this ,
			colorArray ;
		this.initShape = 0;
		$(window).keyup(function(event) {
			if( event.which == 32 ){
				that.initShape++;
// console.log(event.which)
				colorArray = graphJson[ that.type ][ that.initShape % 4 ];
				that.colorTetris( colorArray );
			}
		});
	},

	autoDrop: function(){
		var that = this;
		this.timer = setInterval(function(){
			that.tetris.css({top: '+=' + 30});
			
		}, 1000);
	},

	getRandomNum: function(min, max){
		return Math.floor( Math.random() * ( max - min + 1 ) + min );
	}

};


var tetris = new Tetris();
tetris.changeShape();

});