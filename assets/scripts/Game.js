var ui = require('uicreator');
var netConfig = require('NetConfig');
var netControl = require('NetControl');

var Game = cc.Class({
    extends: cc.Component,

    properties: {
        playerAnchors: {
            default: [],
            type: cc.Node
        },
		dicesDemo: {
            default: [],
            type: cc.Sprite
        },
		totalNumDemo: {
            default: [],
            type: cc.Node
        },

        playerPrefab: cc.Prefab,
		resultPrefab: cc.Prefab,
		choosePrefab: cc.Prefab,
        inGameUI: cc.Node,
        assetMng: cc.Node,
        audioMng: cc.Node,
        totalMoney:cc.Label,
        chongzhiBtn: cc.Node,
	    roomNumLabel: cc.Label,
		roomTypeNameLabel: cc.Label,
	    selectDiceNum: 0,
        selectTotalNum: 0,
		nextLeaveGou:cc.Node,//下局离开
		turnDuration:0,//倒计时时间
		chatPanel: cc.Node,
    },

    statics: {
        instance: null
    },

    // use this for initialization
    onLoad: function () {
        Game.instance = this;
        this.inGameUI = this.inGameUI.getComponent('InGameUI');
        this.assetMng = this.assetMng.getComponent('AssetMng');
        this.audioMng = this.audioMng.getComponent('AudioMng');
       // this.betUI = this.betUI.getComponent('Bet');
        this.inGameUI.init(this.betDuration);
		 var roomId = netConfig.userData.roomId;
		 this.roomNumLabel.string = roomId;
		 this.roomTypeNameLabel.string= netConfig.userData.roomTypeName+':'+netConfig.userData.roomMoney;
		 this.totalMoney.string = netConfig.userData.money;
        //this.betUI.init();
        //
        
       	this.player = null;
	    this.otherPlayer = null;
	    this.ohterPlayerDice = null;
		this.selectNode = null;
	    //this.createPlayers();

		this.gameState = 'none';
		this.isMyTurn = false;

		//this.totalNum1.active = false;
		//this.totalNum2.active = false;
		//this.diceNum.active = false;

		this.playerActorRenderer = null;
		this.otherPlayerActorRenderer = null;

		this.userYaoRenderer = null;
		this.userYaoOtherRenderer = null;
		this.waiting = null;

		this.talkList = [
             '一点小钱拿去喝茶吧。',
            '不要吵了专心玩游戏吧。',
            '不要走决战到天亮呐！',
            '你是妹妹还是哥哥？',
            '时间就是金钱我的朋友！'
        ];

	   
	   //监听事件
	   netControl._callBack = this.onMessage.bind(this);
        netControl.send('getUserInfo', ''); 
		//拉取其他用户信息
		netControl.send('getOhterPlayerInfo', '');
	   
    },

		




    createPlayers: function () {
		 var playerNode = cc.instantiate(this.playerPrefab);
		 this.player = playerNode;
            var anchor = this.playerAnchors[0];
			//cc.director.getScene().getChildByName('Canvas').addChild(playerNode);
            anchor.addChild(playerNode);
            playerNode.position = cc.v2(0, 0);
				
            var playerInfoPos = cc.find('anchorPlayerInfo', anchor).getPosition();
            this.playerActorRenderer = playerNode.getComponent('ActorRenderer');
            this.playerActorRenderer.init(netConfig.userData, playerInfoPos,this.turnDuration);
           

    },


    //
    start: function () {
       // this.fsm.toBet();
        this.audioMng.playButton();
    },

	forceOut:function(){
		netControl.send('userLeaveRoom', '');
		cc.director.loadScene('menu');
		netConfig.userData.roomId = null;
		netConfig.userData.roomTypeName = null;
		clearInterval(this.interval);

		if(this.waiting != null){
				this.waiting.close();
				this.waiting=null;
		}
        
	},

    quitToMenu: function () {
		if(this.gameState == 'play'){
			ui.outConfirmPanel();
		}else{
		 this.forceOut();
		}
       
		if(this.waiting != null){
				this.waiting.close();
				this.waiting=null;
		}

    },


	


    quitToMenu2: function () {//下局离场
		netConfig.userData.roomId = null;
		netConfig.userData.roomTypeName = null;
		clearInterval(this.interval);
		netControl.send('userLeaveRoom', '');
		this.scheduleOnce(function() {
		     cc.director.loadScene('menu');
		}, 0.5);
       
	   if(this.waiting != null){
				this.waiting.close();
				this.waiting=null;
		}
		
    },

	quitToMenu3: function () {//用户登录失效了或者被挤掉了
		netConfig.userData.roomId = null;
		netConfig.userData.roomTypeName = null;
		clearInterval(this.interval);
		if(this.waiting != null){
				this.waiting.close();
				this.waiting=null;
		}
		netControl.send('userLeaveRoom', '');
		this.scheduleOnce(function() {
		     cc.director.loadScene('menu',function(){
			    cc.sys.openURL('/lwgame/f/portal/login.html');
			 });
		}, 0.5);
       
		
    },

 



	zhunbei:function(){
		   netControl.send('userReady', '');
		    this.inGameUI.hideReady();
			//var actorRenderer = this.player.getComponent('ActorRenderer');
			this.playerActorRenderer.updateReadyState('已准备');
			this.playerActorRenderer.hideUserCallPoint();//隐藏叫点
			if(this.selectNode){
				   this.selectNode.closeNode();
			 }
			//去掉对方的骰子
			if(this.ohterPlayerDice){
				this.ohterPlayerDice.destoryNode();
			}

			if(this.otherPlayerActorRenderer){
				this.otherPlayerActorRenderer.hideUserCallPoint();//去掉用户的叫点

			}else{
			  
			}

			if(this.otherPlayer ==null || this.otherPlayer.active == false){
				this.createWating();
			}
			
	},


	

	showDice:function(event,customEventData){
		//this.diceNum.active = true;
		this.selectTotalNum = customEventData;
	},
	showTotalNum1:function(){
		// this.totalNum2.active = false;
		// this.totalNum1.active = true; 
	},

	showTotalNum2:function(){
		this.totalNum2.active = true;
		var totalNum2Children = this.totalNum2.getChildren();
		for (var i = 0; i < totalNum2Children.length; i++) {
			totalNum2Children[i].active =true;
		} 
		this.totalNum1.active = false;

	},
	chongzhi:function(){
		cc.sys.openURL('/lwgame/f/mobile/drechange');
	},
	
	

   onMessage:function(msg){		
	   console.log("game.js收到消息:"+msg.data);
		var data = JSON.parse(msg.data);
		
		if (data.status == false) {     
			ui.createScreenMsg(data.data);
            return;
	    }
		else if(data.type == 'heartbeat'){
			if(data.data == 'null'){
			 netConfig.userData.roomId = null;
			 netConfig.userData.roomTypeName = null;
			 cc.director.loadScene('menu');
			}
		   
		}else if (data.type == 'createNewRoom') {
           netConfig.userData.roomId = data.data.roomNum;
			netConfig.userData.roomTypeName = data.data.roomTypeName;
            cc.director.loadScene('table');//end load scene
        }else if(data.type == 'getUserInfo'){
			netConfig.userData.userId = data.data.userId;
			netConfig.userData.realName = data.data.realName;
			netConfig.userData.img = data.data.img;
			netConfig.userData.money = data.data.money;
			 this.totalMoney.string = data.data.money;
			//更新下用户信息
			 this.createPlayers();
		}else if(data.type == 'userJoinRoom'){//加载对手
			if(this.waiting != null){
				this.waiting.close();
			}
			 
		 var playerNode = cc.instantiate(this.playerPrefab);
            var anchor = this.playerAnchors[1];
            //cc.director.getScene().getChildByName('Canvas').addChild(playerNode);
            anchor.addChild(playerNode);
            playerNode.position = cc.v2(0, 0);
			
			this.otherPlayer = playerNode;
			
            var playerInfoPos = cc.find('anchorPlayerInfo', anchor).getPosition();
            this.otherPlayerActorRenderer = playerNode.getComponent('ActorRenderer');
            this.otherPlayerActorRenderer.init(data.data, playerInfoPos,this.turnDuration);
			
		}else if(data.type == "getOhterPlayerInfo"){
			if(data.data == null){
				return false;
			}
			
			var playerNode = cc.instantiate(this.playerPrefab);
            var anchor = this.playerAnchors[1];
            //cc.director.getScene().getChildByName('Canvas').addChild(playerNode);
            anchor.addChild(playerNode);
            playerNode.position = cc.v2(0, 0);
			
			this.otherPlayer = playerNode;
			
            var playerInfoPos = cc.find('anchorPlayerInfo', anchor).getPosition();
            this.otherPlayerActorRenderer = playerNode.getComponent('ActorRenderer');
            this.otherPlayerActorRenderer.init(data.data, playerInfoPos,this.turnDuration);
			
		}else if(data.type == 'userReady'){
			 this.otherPlayerActorRenderer.updateReadyState("已准备");
			
		}else if(data.type == 'talk'){
			this.handle_talk(data.data);
		}else if(data.type == 'callPoints'){//首次叫点数
			//this.createSelectBtn(2,0);
			this.createSelectNumPanel(2,0,false,false,false,false,true);
			//this.totalNum1.active = true;
			this.playerActorRenderer.startCountdown();//倒计时开始
			this._controlTime("isFirst");
			
		}else if(data.type == "callPointsReady"){//对手叫点了
			this.isMyTurn = true;
			this.createSelectNumPanel(data.data.num,data.data.diceNum,data.data.zai,data.data.fei,false,false,false);
			//this.createSelectBtn();
			//this.totalNum1.active = true;
			//this.inGameUI.showShowdownBtn();
			//
			if(data.data){
			 var actorRenderer = this.otherPlayer.getComponent('ActorRenderer');
			 //this.audioMng.playNumBGM(data.data.num);

			this.audioMng.playDiceAndNumBGM(data.data.num,data.data.diceNum,data.data.zai,data.data.fei);
			

			 actorRenderer.updateCallPoint(data.data.num,data.data.diceNum,data.data.zai,data.data.fei);
			 this.playerActorRenderer.startCountdown();//倒计时开始
			 actorRenderer.resetCountdown();
			}
			//能叫的点数的业务逻辑
			//this.countTime();//自己倒计时

			this._controlTime("");
		
		}else if(data.type == "userTimeOut"){
			this.audioMng.playDiceAndNumBGM(data.data.num,data.data.diceNum,data.data.zai,data.data.fei);
			this.playerActorRenderer.updateCallPoint(data.data.num,data.data.diceNum,data.data.zai,data.data.fei);
		
		}else if(data.type == 'gameStart'){
			cc.log('net:receive:before: ' + data.data);
			this.audioMng.playYao();
			var dices = data.data;
			var anchor = this.playerAnchors[0];
			
			//this.userYaoRenderer.playYao();
			this.createPlayerDices(dices,anchor,this.dicesDemo);

			//去掉自己的骰子
			if(this.playerDice){
				this.playerDice.destoryNode();
			}

			//摇一摇动画效果
			if(this.userYaoRenderer != null){
				this.userYaoRenderer.playYao();
			}else{
				this.createrYyyPanel(anchor);
			}
			

			

			//去掉已准备字样
			//var actorRenderer = this.otherPlayer.getComponent('ActorRenderer');
			this.otherPlayerActorRenderer.updateReadyState('');
			 // actorRenderer.hideUserCallPoint();//隐藏叫点
			//this.playerActorRenderer = this.player.getComponent('ActorRenderer');
			this.playerActorRenderer.updateReadyState('');

			//摇一摇动画效果
			if(this.userYaoOtherRenderer != null){
				this.userYaoOtherRenderer.playYao();
			}else{
				this.createrYyyOtherPanel(this.otherPlayer);
			}
			 
			
			this.gameState = 'play';

			
		}else if(data.type == 'userLeaveRoom'){
			this.otherPlayer.active = false;
			this.waiting = null;//继续要显示匹配

		}else if(data.type == 'showDown'){
			//var resultPrefab = cc.instantiate(this.resultPrefab);
			//var resultPanel = resultPrefab.getComponent('ResultPanel');
			//显示结果
			if(data.data.status){
				//resultPanel.initPanel(true,'全场共有'+data.data.totalNum+'个'+data.data.diceNum);
				ui.createResultPanel(true,'全场共有'+data.data.totalNum+'个'+data.data.diceNum);
				this.audioMng.playWin();
			}else{
			    //resultPanel.initPanel(true,'全场共有'+data.data.totalNum+'个'+data.data.diceNum);
				ui.createResultPanel(false,'全场共有'+data.data.totalNum+'个'+data.data.diceNum);
				this.audioMng.playLose();
			}
					
			this.userYaoOtherRenderer.playYaoMove();
			//展示对方的骰子
			var dices = data.data.playerDices;
			var anchor = this.playerAnchors[1];
			this.createUseDices(dices,anchor,this.dicesDemo);
			
			 this.inGameUI.showBtnStart();
			 if(this.selectNode){
				   this.selectNode.closeNode();
			 }
			 this.gameState = 'over';
			 //下局立场处理
			 if(this.nextLeaveGou.active){
				this.quitToMenu2();//end load scene
				
				

			 }
			 this.playerActorRenderer.resetCountdown();//结束定时器
			 clearInterval(this.interval);//结束定时器
			
			//结束定时器
			 this.otherPlayerActorRenderer.resetCountdown();//结束定时器
			 

		}else if(data.type == 'forceShowDown'){//对手强退了
			//显示结果


			ui.createResultPanel(true,'对方逃跑了！');
			this.audioMng.playWin();

			 this.inGameUI.showBtnStart();
			 if(this.selectNode){
				 this.selectNode.closeNode();
			 }
			 this.gameState = 'over';
			  
		}else if(data.type == 'userInfoChange'){//用户信息变更了，扣钱，赢钱了
			 this.totalMoney.string = data.data.money;
			 netConfig.userData.money = data.data.money;
		}else if(data.type == 'logout'){
			ui.createScreenMsg(data.data);
			this.quitToMenu3();
			
		}else if(data.type == 'notEnoughBalance'){
			netConfig.userData.roomId = null; 
		   netConfig.userData.roomTypeName = null;
			netControl.send('userLeaveRoom', '');
			cc.director.loadScene('menu');
			
		   
		}else if(data.type == 'userNotInRoom'){
			netConfig.userData.roomId = null;
			 netConfig.userData.roomTypeName = null;
			cc.director.loadScene('menu');
		   
		}
		
		
	},


createrYyyOtherPanel : function (anchor) {
      cc.loader.loadRes("prefabs/yyyOtherPrefab", (err, prefab)=>{
        if (!err) {
            var yao = cc.instantiate(prefab);
			this.userYaoOtherRenderer = yao.getComponent('yaoyiyaoOther');
			 
			this.userYaoOtherRenderer.playYao();
			 anchor.addChild(yao);
            
        }
    });
},


createrYyyPanel : function (anchor) {
      cc.loader.loadRes("prefabs/yyyPrefab", (err, prefab)=>{
        if (!err) {
            var yao = cc.instantiate(prefab);
			this.userYaoRenderer = yao.getComponent('yaoyiyao');
			 
			this.userYaoRenderer.playYao();
			 anchor.addChild(yao);
            
        }
    });
},


createUseDices : function (dices,anchor,diceDemo) {
		cc.loader.loadRes("prefabs/dicePrefab", (err, prefab)=>{
        if (!err) {
             var dice= cc.instantiate(prefab);
			 this.ohterPlayerDice = dice.getComponent('dice');
			 this.ohterPlayerDice.init(dices,diceDemo);
			 this.ohterPlayerDice.showDice();
			 anchor.addChild(dice);

			
            
        }
    });
},//end createUserDices




createPlayerDices : function (dices,anchor,diceDemo) {
		cc.loader.loadRes("prefabs/dicePrefab", (err, prefab)=>{
        if (!err) {
             var dice= cc.instantiate(prefab);
			 this.playerDice = dice.getComponent('dice');
			 this.playerDice.init(dices,diceDemo);
			 anchor.addChild(dice);


			
			
            
        }
    });
},//end createUserDices

createSelectNumPanel:function (num,dice,zai,fei,myZai,myFei,isFirst) {
      cc.loader.loadRes("prefabs/choosePrefab", (err, prefab)=>{
        if (!err) {
            var choose = cc.instantiate(prefab);
			this.selectNode = choose.getComponent('Choose');
			this.selectNode.init(num,dice,zai,fei,myZai,myFei,isFirst);
			cc.director.getScene().getChildByName('Canvas').addChild(choose);
	
            
        }
    });
},


createWating:function () {
      cc.loader.loadRes("prefabs/matchWait", (err, prefab)=>{
        if (!err) {
            var waiting = cc.instantiate(prefab);
			this.waiting = waiting.getComponent('matchWait');
			cc.director.getScene().getChildByName('Canvas').addChild(waiting);
	
            
        }
    });
},

playDiceBGM:function(audioMng){
	this.audioMng.playDiceBGM(data.data.diceNum)
},

nextLeaveGouBtn:function(){
	this.nextLeaveGou.active = !this.nextLeaveGou.active;
},




    _controlTime (data) {
        clearInterval(this.interval);
        this.time = 20;
        this.interval = setInterval(function() {
            this.time--;
            if (this.time <= 0) {
				netControl.send('userTimeOut', data);
				if(this.selectNode){
					 this.selectNode.closeNode();
				}

				this.playerActorRenderer.resetCountdown();//结束定时器
				this.otherPlayerActorRenderer.startCountdown();//结束定时器

                clearInterval(this.interval);
                this.interval = null;

            }
        }.bind(this), 1000);
    },

	showTalk:function(){
	 this.chatPanel.active = !this.chatPanel.active;
	},

   handle_talk: function (data) {
        if (data.talkType == 'face') {  // 聊天表情
            this.otherPlayerActorRenderer.showFaceTalk(data.message);
        } else if (data.talkType == 'normal') { // 一般聊天
           this.otherPlayerActorRenderer.showTalk(data.message);
        } else if(data.talkType == 'fixed'){
			this.otherPlayerActorRenderer.showTalk(this.talkList[data.message]);
			this.audioMng.playTalkBGM(data.message);
		}
    },






  


});
