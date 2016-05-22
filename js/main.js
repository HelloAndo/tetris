$(function(){

// $(window).keyup(function(event) {
// 	console.log(event)
// });

// "1"——"凸"字形，形态数组的第一个坐标数字约定为纵坐标，与tr绑定

var data={
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
		'size': [3,3],
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
		'size': [3,3],
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
		'size': [3,3],
		'width': '91px',
		'color': 'green'
	},
	'4': {
		'0': [
			[0,0], [1,0], [2,0], [2,1]
		],
		'1': [
			[0,0], [0,1], [0,2], [1,0]
		],
		'2': [
			[0,1], [0,2], [1,2], [2,2]
		],
		'3': [
			[1,2], [2,0], [2,1], [2,2]
		],
		'shapeNum': 4,
		'size': [3,3],
		'width': '91px',
		'color': 'purple'
	},
	'5': {
		'0': [
			[0,1], [1,1], [2,0], [2,1]
		],
		'1': [
			[0,0], [1,0], [1,1], [1,2]
		],
		'2': [
			[0,1], [0,2], [1,1], [2,1]
		],
		'3': [
			[1,0], [1,1], [1,2], [2,2]
		],
		'shapeNum': 4,
		'size': [3,3],
		'width': '91px',
		'color': 'blue'
	},
	'6': {
		'0': [
			[0,2], [1,2], [2,2], [3,2], [4,2]
		],
		'1': [
			[2,0], [2,1], [2,2], [2,3], [2,4]
		],
		'shapeNum': 2,
		'size': [5,5],
		'width': '151px',
		'color': 'pink'
	},
	'7': {
		'0': [
			[0,0], [0,1], [1,0], [1,1]
		],
		'shapeNum': 1,
		'size': [2,2],
		'width': '61px',
		'color': 'gray'
	}
};

function Tetris(){

	this.map ;
	this.mapSize = [22, 15];			//游戏地图的size
	// this.mapSize = [10, 6];	
	this.mapArray;					//地图信息数组，有方块的格子其值为1，反之为0

	this.$next;

	// 当前俄罗斯方块的参数
	this.$tetris;					//这一回合的方块对象,jQuery对象
	// this.$tetris.size;
	// this.$tetris.type;						//方块形态
	// this.$tetris.shape;						//创建时的初始形态数值
	this.shapeNum;
	this.colorArr;					//方块的颜色数组
	this.colorArrLen;				//方块的颜色的数组长度	
	this.colorClass;				//方块的颜色的类
	this.timer = null;				//方块自由降落计时器
	this.moveDelayTime = 1000;		//垂直移动默认的时间间隔

	// 初始化函数
	this.createMap();
	this.callTetris();

}

Tetris.prototype = {

	callTetris: function(){
		// 一局游戏开始的时候创建俄罗斯方块
		if( $('.infoBox').find('.next-tetris').length === 0 ){

			// this.$tetris.remove();
			this.$tetris = this.createTetrisAndReturn();
			this.$tetris.addClass('tetris').attr('id', 'tetris').prependTo( this.map );

		}else{
			// 一局游戏进行中的时候创建俄罗斯方块
			this.$tetris.remove();

			this.$tetris = this.$next ;
		this.$tetris.css({
			'width': data[ this.$tetris.type ][ 'width' ]
			// 'height': data[ this.$tetris.type ][ 'width' ]
		});
			this.$tetris.removeClass('next-tetris').attr('id', 'tetris').prependTo( this.map ); 
			// 检测是否碰撞了，是则结束
			if( this.isTouchLeft() || this.isTouchRight() || this.isTouchDown() ){
				// alert("Game Over !")
			}
		}
		// 更新元素数据
		this.colorArr = data[ this.$tetris.type ][ this.$tetris.shape ];
		this.colorArrLen = this.colorArr.length;
		this.shapeNum = data[ this.$tetris.type ][ 'shapeNum' ];
		this.$tetris.css( 'width', data[ this.$tetris.type ][ 'width' ] );
		this.manualCtrl();
		this.autoDrop();
		this.showNextTetris();
	},

	createTetrisAndReturn: function(){		
		var $obj,
			type,
			size,
			shapeNum;
		// 随机创建方块类型
		// type = this.getRandomNum(1,7);
		type = 6
		// 获取方块宽高
		size = data[ type ][ 'size' ];
		// 创建方块元素
		$obj = this.createSquareAndReturn( size[0], size[1] );
		$obj.type = type;
		// 随机创建方块形态
		shapeNum = data[ type ]['shapeNum'];
		$obj.shape = this.getRandomNum( 0, shapeNum - 1 );
		// 设定方块宽度，防止被相对定位元素.map困住
		// $obj.css( 'width', data[ type ][ 'width' ] + 'px' );
// console.log($obj.css('width'))
		// 方块上色，画法为画'0'的形态，再根据'shape'值进行旋转
		$obj.colorClass = data[ type ][ 'color' ] ;
		$obj.addClass( data[ type ][ 'color' ] );

		this.drawShape( $obj );
		return $obj;

	},

	createSquareAndReturn: function(row, col){
		var $obj = $('<div></div>');
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

	drawShape: function( $obj ){
		var $obj = $obj || this.$tetris ;
		$obj.css('transform', 'rotate(' + $obj.shape * 90 + 'deg)');
console.log($obj.position().left)

	},

	showNextTetris: function(){
		if( $('.next-tetris') ) $('.next-tetris').remove();
		this.$next = this.createTetrisAndReturn();
		this.$next.appendTo('.infoBox').addClass('next-tetris tetris ' + data[ this.$next.type ][ 'color' ] );
	},

	initMapArray: function(){
		this.mapArray = new Array();
		for(var i=0; i<this.mapSize[0]; i++){
			this.mapArray[i] = new Array();
			for(var j=0; j<this.mapSize[1]; j++){
				this.mapArray[i][j] = 0;
			}
		}

	},

	endRound: function(){
		// 结束自由落体
		clearInterval( this.timer );
		//不允许键盘控制
		$(window).off();		
		// 地图背景上色
		this.colorMap();
		// 检测满行消除
		this.examinLine();
		// 准备下一回合的俄罗斯方块
		this.callTetris();

	},

	autoDrop: function(){
		var that = this;
		this.timer = setInterval(function(){
			that.isTouchDown( 1 ) ? that.endRound() : that.$tetris.css({ top: '+=' + 30 + 'px' }) ;
		}, that.moveDelayTime);

	},

	createMap: function(  ){
		this.map = this.createSquareAndReturn( this.mapSize[0], this.mapSize[1] );
		this.map.addClass('map').prependTo( $('body') );
		this.map.children('div').addClass('mapDiv');
		this.initMapArray();
	},

	colorMap: function(){
// console.log(this.shape)
		var tetrisCol = this.$tetris.position().left / 30 ,
			tetrisRow = this.$tetris.position().top / 30 ;

		for(var i = 0; i < this.colorArrLen; i++ ){
			$('.mapDiv').eq( this.colorArr[i][0] + tetrisRow ).find('span').eq( this.colorArr[i][1] + tetrisCol ).addClass('colored ' +  data[ this.$tetris.type ][ 'color' ] )
																														.text(1);
			this.mapArray[ this.colorArr[i][0] + tetrisRow ][ this.colorArr[i][1] + tetrisCol ] = 1;
		}

	},

	examinLine: function(){

		var lineSum ,
			numArray ;
		for(var i = this.mapSize[0] - 1; i >= 0; i-- ){
			lineSum = 0 ;
			for(var j = 0; j < this.mapSize[1]; j++ ){
				lineSum += this.mapArray[i][j] ;
			}
			if( lineSum == this.mapSize[1] ){
				// numArray.push(i)
				this.map.children('.mapDiv').eq(i).find('span').removeClass( );
				this.map.prepend( this.map.children('.mapDiv').eq(i) );
				this.updateMapArray();
				i++;
			}
		}

	},

	updateMapArray: function(){

		for(var i = 0; i < this.mapSize[0]; i++ ){
			for(var j = 0; j < this.mapSize[1]; j++ ){
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
		// var colorArr ;
		$(window).keyup(function(event) {
			switch( event.which ){
				case 32:
					that.$tetris.shape++ ;
					console.log( that.$tetris.shape)
					that.$tetris.shape %= that.shapeNum ;
					that.colorArr = data[ that.$tetris.type ][ that.$tetris.shape ];
					if( that.isTouch() ){
						that.$tetris.shape += ( that.shapeNum - 1 ) ;
						that.$tetris.shape %= that.shapeNum ;
						that.colorArr = data[ that.$tetris.type ][ that.$tetris.shape ];
					}else{
						that.drawShape();	
					}		
					break;
				case 37:
					if( !that.isTouchLeft( -1 ) ){
						that.$tetris.css('left', '-=' + 30);
					}
					break;
				case 39:
					if( !that.isTouchRight( 1 ) ){
						that.$tetris.css('left', '+=' + 30);
					}
					break;
				case 40:
					if( !that.isTouchDown( 1 ) ){
						that.$tetris.css('top', '+=' + 30);
					}else{
						that.endRound();
					}
					break;
				default:
					break;
			}
		});

	},

	isTouch: function(){
		return ( !this.isTouchDown() && !this.isTouchLeft() && !this.isTouchRight() ) ? false : true ;
	},

	isTouchLeft: function( speed ){
		speed = speed || 0;

		var col = this.$tetris.position().left / 30 + speed ,
			row = this.$tetris.position().top / 30 ,
			col_map ,
			row_map ;
console.log(row)
		for(var i = 0; i < this.colorArrLen; i++ ){
			row_map = this.colorArr[i][0] + row ;
			col_map = this.colorArr[i][1] + col ;
console.log(row_map)
console.log(col_map)
			if( this.mapArray[ row_map ][ col_map ] == undefined || this.mapArray[ row_map ][ col_map ] == 1 ){
				return true;
			}
		}
		return false;
	},

	isTouchRight: function( speed ){
		speed = speed || 0;
		var col = this.$tetris.position().left / 30 + speed ,
			row = this.$tetris.position().top / 30 ,
			col_map ,
			row_map ;
		// if(col + 2 > this.mapSize[1] - 1 ){return true;}
		for(var i = 0; i < this.colorArrLen; i++ ){
			row_map = this.colorArr[i][0] + row ;
			col_map = this.colorArr[i][1] + col ;
			// if(col_map > this.mapSize[1] - 1 ){return true;}
			if( this.mapArray[ row_map ][ col_map ] == undefined || this.mapArray[ row_map ][ col_map ] == 1 ){
				return true;
			}
		}
		return false;
	},

	isTouchDown: function( speed ){
		speed = speed || 0;
// console.log(speed)
		var col = this.$tetris.position().left / 30 ,
			row = this.$tetris.position().top / 30 + speed,
			col_map ,
			row_map ;
// console.log(this.colorArr)
		for(var i = 0; i < this.colorArrLen; i++ ){
			row_map = this.colorArr[i][0] + row ;
			col_map = this.colorArr[i][1] + col ;
			if( row_map > this.mapSize[0] - 1 ){return true;}
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