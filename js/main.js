$(function(){

$(window).keyup(function(event) {
	console.log(event)
});

// "1"——"凸"字形，形态数组的第一个坐标数字约定为纵坐标，与tr绑定

var graphJson={
	'1': {
		'1': [
			[1,1], [2,0], [2,1], [2,2]
		],
		'2': [
			[0,0], [1,0], [1,1], [2,0]
		],
		'3': [
			[1,0], [1,1], [1,2], [2,1]
		],
		'4': [
			[0,1], [1,0], [1,1], [2,1]
		],
		'color': 'yellow'
	}
};

function Tetris(){

	this.size = [22, 15];	//游戏地图的size
	this.type = 1;		//方块形态
	this.count;		//按键控制变形，次数缓存


	this.createMap();
	this.createTetris();

}

Tetris.prototype = {

	createMap: function(  ){
		this.createTd( $('.map'), this.size[0], this.size[1]);

	},

	createTetris: function(){
		this.createTd( $('.tetris'), 3, 3);
		this.colorTetris();
	},

	createTd: function($obj, row, col){
		for (var i = 0; i < row; i++) {
			var tr = document.createElement('tr');
			for(var j = 0; j < col; j++){
				var td = document.createElement('td');
				tr.appendChild(td);
			}
			$obj.append(tr);
		}
	},

	colorTetris: function(){
		var array = graphJson[ this.type ][ this.getRandomNum( 1, 4 ) ];
console.log(array.length)
		for(var i = 0, len = array.length; i < len; i++ ){
			$('.tetris tr').eq( array[i][0] ).find('td').eq( array[i][1] ).addClass( graphJson[ this.type ]['color'] );

		}

	},

	getRandomNum: function(min, max){
		return Math.floor( Math.random() * ( max - min + 1 ) + min );
	},

};


var tetris = new Tetris();
// tetris.colorTetris();

});