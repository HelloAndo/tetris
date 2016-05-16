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
			[0,0], [0,1], [0,2], [1,1]
		],
		'3': [
			[0,2], [1,1], [1,2], [2,2]
		],
		'shapeNum': 4,
		'width': '91px',
		'color': 'yellow'
	},
	'2': {
		'0': [
			[1,1], [1,2], [2,0], [2,1]
		],
		'1': [
			[0,0], [1,0], [1,1], [2,1]
		],
		'shapeNum': 2,
		'width': '91px',
		'color': 'red'
	},
	'3': {
		'0': [
			[1,0], [1,1], [2,1], [2,2]
		],
		'1': [
			[0,1], [1,0], [1,1], [2,0]
		],
		'shapeNum': 2,
		'width': '91px',
		'color': 'green'
	}
};

function Tetris(){

	this.map = $('.map');
	this.size = [22, 15];			//游戏地图的size
	// this.size = [10, 6];	
	this.mapArray;					//地图信息数组，有方块的格子其值为1，反之为0

	// 当前俄罗斯方块的参数
	this.tetris;					//这一回合的方块对象,jQuery对象
	this.type;						//方块形态
	this.shape;						//创建时的初始形态数值
	this.shapeNum;
	this.timer = null;				//方块自由降落计时器
	this.colorClass;				//方块的颜色的类
	this.speed;						//水平方向的速度，左为-1，右为1
	this.moveDelayTime = 1000;		//垂直移动默认的时间间隔
	this.colorArray;				//方块的颜色数组
	this.colorArrayLen;				//方块的颜色的数组长度

	// 初始化函数
	this.createMap();
	this.createTetris();
	this.manualCtrl();

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

	nextTetris: function(){

		$(window).off();
		this.colorMap();
		this.examinLine();

		$('.tetris').remove();
		this.createTetris();			

		if( !this.isTouchLeft() && !this.isTouchRight() && !this.isTouchDown() ){
			this.manualCtrl();
		}else{
			// alert("Game Over !")
		}
		
	},

	createMap: function(  ){
		this.createSquare( $('.map'), this.size[0], this.size[1]);
		$('.map').find('div').addClass('mapDiv');
		$('.map').find('.tetris').removeClass('mapDiv');
		this.initMapArray();
	},

	createTetris: function(){
		this.tetris = $('<div class="tetris"></div>');
		this.tetris = this.createSquare( this.tetris, 3, 3);			//创建.tetris的子元素并返回$('.tetris')
		$('.map').prepend( this.tetris );

		this.type = this.getRandomNum( 1, 3 );
		this.shapeNum = graphJson[ this.type ]['shapeNum'] ;
		this.shape = this.getRandomNum( 0,this.shapeNum-1 );
		this.tetris.css('width', graphJson[ this.type ]['width'] );
		
		this.colorClass = graphJson[ this.type ]['color'] ;
		this.tetris.addClass('colored ' + this.colorClass);							//随机创建$('.tetris')的形态
		this.colorArray = graphJson[ this.type ][0] ;	
		this.colorArrayLen = this.colorArray.length ;					//颜色数组的长度

		for(var i = 0; i < this.colorArrayLen; i++ ){
			this.tetris.find('div').eq( this.colorArray[i][0] ).find('span').eq( this.colorArray[i][1] ).addClass('colored ' +  this.colorClass );
		}
		// this.tetris.css('transform', 'rotate(' + this.shape * 90 + 'deg)');
// console.log(this.shape)
		this.drawShape();
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

	drawShape: function(){

		this.colorArray = graphJson[ this.type ][ this.shape ] ;
		if( !this.isTouchDown() && !this.isTouchLeft() && !this.isTouchRight() ){
			this.tetris.css('transform', 'rotate(' + this.shape * 90 + 'deg)');
		}else{
			this.shape += ( this.shapeNum - 1 ) ;
			this.shape %= this.shapeNum ;
			this.colorArray = graphJson[ this.type ][ this.shape ] ;
		}
		

	},

	colorMap: function(){
// console.log(this.shape)
		var tetrisCol = this.tetris.position().left / 30 ,
			tetrisRow = this.tetris.position().top / 30 ;

		for(var i = 0; i < this.colorArrayLen; i++ ){
			$('.mapDiv').eq( this.colorArray[i][0] + tetrisRow ).find('span').eq( this.colorArray[i][1] + tetrisCol ).addClass('colored ' +  this.colorClass )
																														.text(1);
			this.mapArray[ this.colorArray[i][0] + tetrisRow ][ this.colorArray[i][1] + tetrisCol ] = 1;
		}

	},

	examinLine: function(){

		var lineSum ,
			numArray ;
		for(var i = this.size[0] - 1; i >= 0; i-- ){
			lineSum = 0 ;
			for(var j = 0; j < this.size[1]; j++ ){
				lineSum += this.mapArray[i][j] ;
			}
			if( lineSum == this.size[1] ){
				// numArray.push(i)
				this.map.children('.mapDiv').eq(i).find('span').removeClass( );
				this.map.prepend( this.map.children('.mapDiv').eq(i) );
				this.updateMapArray();
				i++;
			}
		}

	},

	updateMapArray: function(){

		for(var i = 0; i < this.size[0]; i++ ){
			for(var j = 0; j < this.size[1]; j++ ){
				if( $('.mapDiv').eq(i).children('span').eq(j).hasClass( 'colored' ) ){
					this.mapArray[i][j] = 1 ;
				}else{
					this.mapArray[i][j] = 0 ;
				}
			}
		}

	},

	manualCtrl: function(){
		var that = this;
		var colorArray ;
		$(window).keyup(function(event) {
			switch( event.which ){
				case 32:
					that.shape++ ;
					that.shape %= that.shapeNum ;
					that.drawShape();
					break;
				case 37:
					if( !that.isTouchLeft( -1 ) ){
						that.tetris.css('left', '-=' + 30);
					}
					break;
				case 39:
					if( !that.isTouchRight( 1 ) ){
						that.tetris.css('left', '+=' + 30);
					}
					break;
				case 40:
					if( !that.isTouchDown( 1 ) ){
						that.tetris.css('top', '+=' + 30);
					}else{
						clearInterval( that.timer );
						that.nextTetris();
					}
					break;
				default:
					break;
			}
		});

	},

	autoDrop: function(){
		var that = this;
		this.timer = setInterval(function(){
			that.isTouchDown( 1 ) ? ( clearInterval( that.timer ), that.nextTetris() ) : that.tetris.css({top: '+=' + 30}) ;
		}, that.moveDelayTime);

	},

	isTouchLeft: function( speed ){
		speed = speed || 0;

		var col = this.tetris.position().left / 30 + speed ,
			row = this.tetris.position().top / 30 ,
			col_map ,
			row_map ;

		for(var i = 0; i < this.colorArrayLen; i++ ){
			row_map = this.colorArray[i][0] + row ;
			col_map = this.colorArray[i][1] + col ;
			if( this.mapArray[ row_map ][ col_map ] == undefined || this.mapArray[ row_map ][ col_map ] == 1 ){
				return true;
			}
		}
		return false;
	},

	isTouchRight: function( speed ){
		speed = speed || 0;
		var col = this.tetris.position().left / 30 + speed ,
			row = this.tetris.position().top / 30 ,
			col_map ,
			row_map ;
		// if(col + 2 > this.size[1] - 1 ){return true;}
		for(var i = 0; i < this.colorArrayLen; i++ ){
			row_map = this.colorArray[i][0] + row ;
			col_map = this.colorArray[i][1] + col ;
			// if(col_map > this.size[1] - 1 ){return true;}
			if( this.mapArray[ row_map ][ col_map ] == undefined || this.mapArray[ row_map ][ col_map ] == 1 ){
				return true;
			}
		}
		return false;
	},

	isTouchDown: function( speed ){
		speed = speed || 0;
// console.log(speed)
		var col = this.tetris.position().left / 30 ,
			row = this.tetris.position().top / 30 + speed,
			col_map ,
			row_map ;

		for(var i = 0; i < this.colorArrayLen; i++ ){
			row_map = this.colorArray[i][0] + row ;
			col_map = this.colorArray[i][1] + col ;
			if( row_map > this.size[0] - 1 ){return true;}
			if( this.mapArray[ row_map ][ col_map ] == 1 ){
				return true;
			}
		}
		return false;
		
	},

	getRandomNum: function(min, max){
		return Math.floor( Math.random() * ( max - min + 1 ) + min );
	}

};


var tetris = new Tetris();


});