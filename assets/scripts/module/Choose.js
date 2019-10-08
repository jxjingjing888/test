var netConfig = require('NetConfig');
var netControl = require('NetControl');
var Game = require('Game');
cc.Class({
    extends: cc.Component,

    properties: {
		audioMng: cc.Node,
        totalNum1:cc.Node,
		totalNum2:cc.Node,
		totalNum3:cc.Node,
		diceNum:cc.Node,
	    selectDiceNum: 0,
        selectTotalNum: 0,
		rightBtn:cc.Node,
		rightBtn2:cc.Node,
		btnShowdown: cc.Node,
		zaiBtn:cc.Node,
		feiBtn:cc.Node,
		dicesDemo: {
            default: [],
            type: cc.Button
        },
		totalNumDemo: {
            default: [],
            type: cc.Node
        },
	    num : 0,
		dice : 0,
		zai  : false,
		zaiGou  : cc.Node,
		fei : false,
		feiGou : cc.Node,
		isFirst:false,
		zaiNum :false,
 	    feiNum : false,
		numBGM: {
            default: [],
            url: cc.AudioClip
        },
		diceBGM:{
			 default: [],
            url: cc.AudioClip
		},
		zaiBGM:{
			 default: null,
            url: cc.AudioClip
		},
		feiBGM:{
			 default: null,
            url: cc.AudioClip
		},
		totalNumPosArray:[cc.Vec2],
    },




onLoad : function () {
  this.selectTotalNumNode = null;
  this.playerActorRenderer = null;
  var self = this;



},

start: function () {
       cc.log("===============");
},


init:function(num,dice,zai,fei,myZai,myFei,isFirst,playerActorRenderer){
	this.num = num;
	this.dice = dice;
	this.zai = zai;
	this.fei = fei;
	this.isFirst = isFirst;
	this.diceNum.active = false;
	this.playerActorRenderer = playerActorRenderer;
	if(!this.isFirst){
		this.btnShowdown.active = true;
	}
	//第一页数据关闭
	var totalNum1Children = this.totalNum1.getChildren();
    for(var i=0; i< 5; i++ ){
        totalNum1Children[i].active=false;
    }
	

	if(zai){//斋
		this.zaiNum = true;
		this.feiBtn.active = true;
		this.zaiBtn.active = false;

        if(myFei){
            num = num * 2;
			if(dice == 6){
				num++ ;
			}
			this.zaiNum = false;
        }


    }else {
        if(myZai && !this.isFirst){
			if(num == 2){
				num = num;//如果只叫2个那就可以继续叫两个斋
			}else if((num % 2) === 0){
                num = parseInt(num / 2);
            }else {
                num = parseInt(num / 2) + 1;
            }
        }
    }



    var sindex = num-2;
    if(dice === 1){ sindex = num-1};

	var hasNext = (13  - sindex ) > 5;
	 var len = 5;
	if(hasNext){
		this.rightBtn.active = true;
	}else{
		this.rightBtn.active = false;//默认关闭
	}
    var len = hasNext ? 5: (13  - sindex) ;

  //var totalNum1Children = this.totalNum1.getChildren();
    for(var i=0; i< len; i++ ){
        var newNode = this.totalNumDemo[sindex+i];
        newNode.active = true;
        newNode.position = this.totalNumPosArray[i];
	   // var pos = totalNum1Children[i].position;
        totalNum1Children[i] = newNode;
	    // totalNum1Children[i].position = pos;
    }

	//有第二页
    if((13 - sindex) > 5){
		//

		var hasNext = (13  - sindex ) > 10;//有第三页
		if(hasNext){
			this.rightBtn2.active = true;
		}else{
			this.rightBtn2.active = false;//默认关闭
		}
		 len = hasNext ? 5: (13 -5 - sindex) ;

		//
		var totalNum2Children = this.totalNum2.getChildren();
        for(var i=0; i< len; i++ ){
            var newNode2 = this.totalNumDemo[sindex+5+i];
            newNode2.active = false;
			newNode2.position = this.totalNumPosArray[i];
           //var pos = totalNum2Children[i].position;
            totalNum2Children[i] = newNode2;
			// totalNum2Children[i].position = pos;
        }
		//有第三页
		if((13 - sindex) > 10){
			var totalNum3Children = this.totalNum3.getChildren();
			len = 13  - 10 - sindex;
			for(var i=0; i< len; i++ ){
				var newNode3 = this.totalNumDemo[sindex+10+i];
				newNode3.active = false;
				newNode3.position = this.totalNumPosArray[i];
			   //var pos = totalNum2Children[i].position;
				totalNum3Children[i] = newNode3;
				// totalNum2Children[i].position = pos;
			}
		
		 }else{
		 
		 }
		
    }


	

	this.totalNum1.active = true;
	this.totalNum2.active = false;
	this.totalNum3.active = false;
},//end INIT


	callPoints:function(event , customEventData){
		if(customEventData == 1){
			this.zaiNum = true;
		}
	   var data ={"num": this.selectTotalNum,"diceNum":customEventData,"zai":this.zaiNum,"fei":this.feiNum};
	   var sendString = JSON.stringify(data);

		netControl.send('callPoints', sendString);
		this.btnShowdown.active =false;
			clearInterval(Game.instance.interval);
		Game.instance.playerActorRenderer.resetCountdown();
		//var actorRenderer = Game.instance.otherPlayer.getComponent('ActorRenderer');
		//actorRenderer.startCountdown();
		Game.instance.otherPlayerActorRenderer.startCountdown();
		this.closeNode();

		 Game.instance.audioMng.playDiceAndNumBGM(this.selectTotalNum,customEventData,this.zaiNum,this.feiNum);  //播放点数声音
		//this.playDiceAndNumBGM(this.selectTotalNum,customEventData,this.zaiNum,this.feiNum);  //播放点数声音

		//
		 Game.instance.playerActorRenderer.updateCallPoint( this.selectTotalNum,customEventData,this.zaiNum,this.feiNum);
	},
	showDice:function(event,customEventData){
	 var node = event.target;
	 var button = node.getComponent(cc.Button);
	 if(this.selectTotalNumNode != null){
		this.selectTotalNumNode.interactable=true;
	 }
		this.selectTotalNum = customEventData;
		this.selectTotalNumNode = button;
		if((customEventData <= this.num && !this.zaiNum)
			|| (customEventData <= Math.ceil(this.num/2)  && this.zaiNum && !this.zai)
			|| (customEventData <= this.num *2  && this.feiNum)
			|| (customEventData <= this.num   && this.zaiNum && this.zai)
		){
			for(var i=0; i< this.dicesDemo.length; i++ ){
				var newIndex = this.dice -2;
				if(this.zaiNum && !this.zai && !this.fei){
					newIndex = this.dice -3;
				}
				if(this.zaiNum && this.fei){
					newIndex = this.dice -3;
				}
				 if(i <= newIndex){
					if(this.zai && this.feiNum && i == newIndex){

					}else{
						this.dicesDemo[i].interactable=false;
					}
					
					//newDiceNode.enableAutoGrayEffect=ture;
				}
				if(this.feiNum && i == 5){
					this.dicesDemo[i].interactable=false;
				}
				 
			}

		}else{

			for(var i=0; i< this.dicesDemo.length; i++ ){
					this.dicesDemo[i].interactable=true;
					//newDiceNode.enableAutoGrayEffect=ture;
				if(this.feiNum && i == 5){
					this.dicesDemo[i].interactable=false;
				}
				 
			}
		
		}

		this.diceNum.active = true;
		//把自己变灰
		button.interactable=false;

	},
	showTotalNum1:function(){
		 this.totalNum3.active = false;
		 this.totalNum2.active = false;
		 this.totalNum1.active = true; 
		cc.log("showTotalNum1");
	},

	showTotalNum2:function(){
		var totalNum2Children = this.totalNum2.getChildren();
		for (var i = 0; i < totalNum2Children.length; i++) {
			totalNum2Children[i].active =true;
		} 
		this.totalNum2.active = true;
		this.totalNum1.active = false;
		this.totalNum3.active = false;
		cc.log("showTotalNum2");

	},
	
	showTotalNum3:function(){
		var totalNum3Children = this.totalNum3.getChildren();
		for (var i = 0; i < totalNum3Children.length; i++) {
			totalNum3Children[i].active =true;
		} 
		this.totalNum3.active = true;
		this.totalNum1.active = false;
	    this.totalNum2.active = false;
		cc.log("showTotalNum3");

	},


	    // kai
    showDown: function () {
		netControl.send('showDown', '');
		Game.instance.playerActorRenderer.resetCountdown();

		

		
    },

	closeNode:function(){
		if(this.node){
			this.node.destroy();
		}
		
	},

	zaiUpdate:function(){
	 this.zaiNum = !this.zaiNum;
	 this.zaiGou.active = !this.zaiGou.active;

	 this.init(this.num,this.dice,this.zai,this.fei,this.zaiNum,false ,this.isFirst);
	},

	feiUpdate:function(){
	 this.feiNum = !this.feiNum;
	 this.feiGou.active = !this.feiGou.active;
	 this.init(this.num,this.dice,this.zai,this.fei,false,this.feiNum ,false);
	},







   



    start () {

    },

    // update (dt) {},
});
