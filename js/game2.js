$(document).ready(function(){
	var BOX_WIDTH = 28;
	var $map = $('#map');
	var $nextmap = $('#nextmap');
	var $score = $('#scorepanel .score');
	var $output = $('#output');
	var $controllerButton = $("#controlpanel button");
	var skip = 600;
	var iniskip = 600;
	var gamescore = 0;
	for(var i=0;i<10;i++) {
		for(var j=0;j<20;j++) {
			$('<div></div>')
				.addClass('backgroundbox')
				.css({left:i*BOX_WIDTH,top:j*BOX_WIDTH})
				.appendTo($map);
		}
	}
	var mapArray;
	function createMap() {
		return [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		];
	}
	var boxArray = [
		[
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,1,1,1,0],
			[0,0,0,0,0],
			[0,0,0,0,0]
		],
		[
			[0,0,0,0,0],
			[0,1,0,0,0],
			[0,1,1,1,0],
			[0,0,0,0,0],
			[0,0,0,0,0]
		],
		[
			[0,0,0,0,0],
			[0,0,1,1,0],
			[0,1,1,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0]
		],
		[
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0]
		],
		[
			[0,0,0,0,0],
			[0,1,1,0,0],
			[0,1,1,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0]
		],
		[
			[0,0,0,0,0],
			[0,1,1,0,0],
			[0,0,1,1,0],
			[0,0,0,0,0],
			[0,0,0,0,0]
		],
		[
			[0,0,0,0,0],
			[0,0,0,1,0],
			[0,1,1,1,0],
			[0,0,0,0,0],
			[0,0,0,0,0]
		],
		[
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,1,1,0],
			[0,0,1,0,0],
			[0,0,0,0,0]
		],
		[
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0]
		]
	];
	var level = [30,60,100,500,800,1200,1800,2500,3200,4500];
	var speed = [500,400,330,280,260,240,230,220,210,200];
	var gameStatus = false;   //游戏状态
	var gamePause = false;    //游戏暂停状态
	var downlandBoxStatus = false;   //方块下落状态，false表示现在没有方块下落，true表示现有方块下落
	var nextBoxStatus = false;  //是否有下一个方块
	var nextBox;   //下一个方块，这个是一个变量，内部存储着将要下落的广场数组
	var downloadBox;  //现在下落的方块数组
	var downlandBoxXY = {left:0,top:0};  //下落方块在总的地图map的坐标
	var pause;   //定时函数返回变量
	//下落面板，下落的方块是存储在下落面板中，下落面板放在地图map的上面
	var $downlandPanel = $('<div></div>') 
							.css({
								width : 140,
								height : 140,
								position : 'absolute',
								left : 0,
								top : 0
							}).hide().appendTo($map);  
	var $gameover = $('<div>Game over!!!</div>').addClass('overdiv').hide().appendTo($map);
	function createBox() {//创建单个方块，从14个方块数组中随时取一个，再从7种图片随时取一个
		var randomBox = Math.floor(Math.random()*9);
		var randomColor = Math.floor(Math.random()*7);
		var array = new Array();
		var index = 0;
		var copyBoxArray = new Array();
		for(var i=0;i<5;i++) {
			copyBoxArray[i] = new Array();
			for(var j=0;j<5;j++) {
				copyBoxArray[i][j] = boxArray[randomBox][i][j];
				if(boxArray[randomBox][i][j]==1) {
					array[index++] = $('<div></div>')
										.addClass('box'+randomColor)
										.addClass('boxs') 
										.css({left:j*BOX_WIDTH,top:i*BOX_WIDTH})
										.appendTo($nextmap);
				}
			}
		}
		return {boxIndex:randomBox,boxs:array,copyBoxArray:copyBoxArray};
	};
	var gameInit = function() {
		$map.find('.boxs').remove();
		$nextmap.find('.boxs').remove();
		$score.text("0");
		$gameover.hide();
		mapArray = createMap();
		gameStatus = true;
		gamePause = false;
		downlandBoxStatus = false;
		nextBoxStatus = false;
		gamescore = 0;
		skip = 600;
		iniskip = 600;
	};
	function boxStopController(copyBoxArray) {
		var boxs = copyBoxArray;
		for(var i=4;i>=0;i--) {
			for(var j=0;j<5;j++) {
				if(boxs[i][j]==1 
					&& mapArray[downlandBoxXY.top+i+1][downlandBoxXY.left+j]==1) {
					return true;
				}
			}
		}
		return false;
	};
	function boxLeftStopController(copyBoxArray) {
		var boxs = copyBoxArray;
		for(var j=0;j<5;j++) {
			for(var i=0;i<5;i++) {
				if(boxs[i][j]==1 
					&& mapArray[downlandBoxXY.top+i][downlandBoxXY.left+j-1]==1) {
					return true;		
				}
			}
		}
		return false;
	};
	function boxRightStopController(copyBoxArray) {
		var boxs = copyBoxArray;
		for(var j=0;j<5;j++) {
			for(var i=0;i<5;i++) {
				if(boxs[i][j]==1 
					&& mapArray[downlandBoxXY.top+i][downlandBoxXY.left+j+1]==1) {
					return true;		
				}
			}
		}
		return false;
	}
	var loadNumber = function(copyBoxArray) {
		var boxs = copyBoxArray;
		for(var i=0;i<5;i++) {
			for(j=0;j<5;j++) {
				if(boxs[i][j]==1) {
					mapArray[downlandBoxXY.top+i][downlandBoxXY.left+j] = 1;
				}
			}
		}
	};
	function covertArray(array) {
		var a = new Array();
		for(var i=0;i<5;i++) {
			a[i] = new Array();
			for(var j=0;j<5;j++) {
				a[i][j] = array[5-j-1][i];
			}
		}
		return a;
	}
	var controlBoxDownlandSpeed = function() {
		for(var i=0;i<level.length;i++) {
			if(gamescore>=level[i]) {
				skip = speed[i];		
				iniskip = speed[i];
			}
		}
	};
	var gameController = function() {
		if(!downlandBoxStatus) {
			if(!nextBoxStatus) {
				nextBox = createBox();
				nextBoxStatus = true;
			}
			downlandBox = nextBox;
			nextBoxStatus = false;
			var tempLength = downlandBox.boxs.length;
			for(var i=0;i<tempLength;i++) {
				$downlandPanel.append(downlandBox.boxs[i]);
			}
			$downlandPanel.css({left:2*BOX_WIDTH,top:-2*BOX_WIDTH}).show();
			downlandBoxXY.left = 4;
			downlandBoxXY.top = 0;
			downlandBoxStatus = true;
		}
		if(!nextBoxStatus) {
			nextBox = createBox();
			nextBoxStatus = true;
		}
		
		if(boxStopController(downlandBox.copyBoxArray)) {
			var tempLength = downlandBox.boxs.length;
			var tempPanelPosition = $downlandPanel.position();
			var panelLeft = tempPanelPosition.left;
			var panelTop = tempPanelPosition.top;
			for(var i=0;i<tempLength;i++) {
				var tempPosition = downlandBox.boxs[i].position();
				var tempLeft = tempPosition.left;
				var tempTop = tempPosition.top;
				downlandBox.boxs[i]
					.css({left:panelLeft+tempLeft,top:panelTop+tempTop})
					.addClass('row'+((panelTop+tempTop)/BOX_WIDTH+2))
					.appendTo($map);
			}
			loadNumber(downlandBox.copyBoxArray);
			var index = 21;
			var count =0;
			while(true) {
				var sum = 0;
				for(var i=2;i<=11;i++) {
					sum+=mapArray[index][i];
				}
				if(sum==0) {
					break;
				} else if(sum==10) {
					for(var i=2;i<=11;i++) {
						mapArray[index][i] = 0;
					}
					$map.find('.row'+index).remove();
					for(var n=index;n>=3;n--) {
						for(var m=2;m<=11;m++) {
							mapArray[n][m] = mapArray[n-1][m];
						}
						$map.find('.row'+(n-1))
							.css({top:(n-2)*BOX_WIDTH})
							.addClass('row'+n).removeClass('row'+(n-1));
					}
					for(m=2;m<=11;m++) {
						mapArray[2][m] = 0;
					}
					$map.find('.row2').remove();
					count++;
					gamescore+=10;
					$score.text(gamescore);
				} else {
					index--;
					if(index<2) {
						gameStatus = false;
						break;
					}
				}
			}
			if(count>0) {
				controlBoxDownlandSpeed();
			}
			downlandBoxStatus = false;
		}
		if(!gameStatus) {
			$gameover.show();
			$controllerButton.text("Start");
			return;
		}
		if(downlandBoxStatus) {
			var tempTop = $downlandPanel.position().top;
			$downlandPanel.css({top:tempTop+BOX_WIDTH});
			downlandBoxXY.top++;
		}
		
		pause = setTimeout(gameController, skip);
	};
	$controllerButton.click(function(){
		if(!gameStatus) {
			$controllerButton.text("Pause").trigger('blur');
			gameInit();
			gameController();
		} else {
			if(!gamePause) {
				$controllerButton.text("Start").trigger('blur');
				clearTimeout(pause);
				gamePause = true;
			} else {
				$controllerButton.text("Pause").trigger('blur');
				pause = setTimeout(gameController, skip);
				gamePause = false;
			}
		}
	});
	$(document).keydown(function(event){
		if(event.keyCode==37) {
			if(!boxLeftStopController(downlandBox.copyBoxArray)) {
				downlandBoxXY.left--;
				var tempLeft = $downlandPanel.position().left;
				$downlandPanel.css({left:tempLeft-BOX_WIDTH});
			}
			
		}
		if(event.keyCode==39) {
			if(!boxRightStopController(downlandBox.copyBoxArray)) {
				downlandBoxXY.left++;
				var tempLeft = $downlandPanel.position().left;
				$downlandPanel.css({left:tempLeft+BOX_WIDTH});
			}
		}
		if(event.keyCode==38) {
			if(downlandBox.boxIndex!=4) {
				var tempArray = covertArray(downlandBox.copyBoxArray);
				if(!boxStopController(tempArray)) {
					downlandBox.copyBoxArray = tempArray;
					for(var i=0;i<downlandBox.boxs.length;i++) {
						var tempPosition = downlandBox.boxs[i].position();
						var tempLeft = tempPosition.left;
						var tempTop = tempPosition.top;
						downlandBox.boxs[i].css({left:112-tempTop,top:tempLeft});
					}
				}
			}
		}
		
		if(event.keyCode==40) {
			skip = 50;
		}
		if(event.keyCode==32) {
			$controllerButton.trigger('click');
		}
	});
	$(document).keyup(function(event){
		if(event.keyCode==40) {
			skip = iniskip;
		}
	});
});