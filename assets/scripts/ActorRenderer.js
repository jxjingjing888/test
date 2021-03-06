var Game = require('Game');
var Types = require('Types');
var Utils = require('Utils');
var nativeLoader = require('nativeLoader');
var ActorPlayingState = Types.ActorPlayingState;

cc.Class({
    extends: cc.Component,

    properties: {
        playerInfo: cc.Node,
        stakeOnTable: cc.Node,
        cardPrefab: cc.Prefab,
        anchorCards: cc.Node,
        labelPlayerName: cc.Label,
        labelTotalStake: cc.Label,
        spPlayerPhoto: cc.Sprite,
        callCounter: cc.ProgressBar,
        labelStakeOnTable: cc.Label,
        diceDemo: {
            default: [],
            type: cc.Sprite
        },
        labelReadyState: cc.Label,
		labelCallPoint: cc.Label,
		labelCallPoint2: cc.Label,
		callPoint:cc.Node,
        spCardInfo: cc.Sprite,
        animFX: cc.Node,
        cardSpace: 0,
		diceSprite: cc.Sprite,
		talkBG: cc.Node,
		talkLabel: cc.Label,
		faceList: {
            default: [],
            type: cc.Node
        },
    },

    onLoad: function () {
		this.startCountdown();
    },

    init: function ( playerInfo,playerInfoPos,turnDuration) {


        // nodes
        this.isCounting = false;
        this.counterTimer = 0;
		this.turnDuration = turnDuration;

        this.playerInfo.position = playerInfoPos;
        this.labelPlayerName.string = playerInfo.realName;
		this.labelReadyState.string='';
		this.labelCallPoint.string='';
        //this.spPlayerPhoto.spriteFrame = Game.instance.assetMng.playerPhotos[0];
		
		//var url = playerInfo.img;
       // nativeLoader.loadNative(playerInfo.userId, url, (spriteFrame)=>{
        //    this.spPlayerPhoto.spriteFrame = spriteFrame;
       // });
	   var url = playerInfo.img;
	   //cc.loader.load(url, function (err, texture) {
        //var sprite  = new cc.SpriteFrame(texture);
        //this.spPlayerPhoto.spriteFrame = sprite;
		//});
		
		this.loadImg(this.spPlayerPhoto,url);




    },
	
	loadImg: function(container,url){
		if(url){
			if("http".substring(0, 4) == "http"){
				url = url + '?fix=mock.jpg';
			}
			cc.loader.load(url, function (err, texture) {
				if(!err){
							var sprite  = new cc.SpriteFrame(texture);
				container.spriteFrame = sprite;	
				}

			});
		}
	},


    update: function (dt) {
        if (this.isCounting) {
            this.callCounter.progress = this.counterTimer/this.turnDuration;
            this.counterTimer += dt;
            if (this.counterTimer >= this.turnDuration) {
                this.isCounting = false;
                this.callCounter.progress = 1;
            }
        }
    },



    updateReadyState: function (data) {
       this.labelReadyState.string = data;
    },
	
	 updateCallPoint: function (num,dice,zai,fei) {
	   this.callPoint.active = true;
       this.labelCallPoint.string = num+'个';
	   if(fei){
		   this.labelCallPoint2.string = '飞';
	   }else if(zai){
		   this.labelCallPoint2.string = '斋';
	   }else{
		    this.labelCallPoint2.string = '';
	   }
	  // var newDice = this.diceDemo[dice - 1];
	  // newDice.position = this.diceSprite.position;
	   this.diceSprite.spriteFrame = this.diceDemo[dice - 1].spriteFrame;

	   
    },

	hideUserCallPoint:function(){
		this.callPoint.active = false;
	},

    showTalk:function(content){
		var len = content.length;
		this.talkBG.width = 32 * len;
		this.talkBG.active = true;
		this.talkLabel.string = content;

		setTimeout(()=>{
		this.talkBG.active = false;
		
		},4000);

	},

	 showFaceTalk:function(id){
	   
	    for(var i=0;i<4;i++){
			if((i+1)==id){
				this.faceList[i].active = true;;
			}else{
			   this.faceList[i].active = false;;
			}
			 
		}

		setTimeout(()=>{
			  for(var i=0;i<4;i++){
				 this.faceList[i].active = false;;
				 
			}
		},4000);

	},
 

    startCountdown: function() {
        if (this.callCounter) {
            this.isCounting = true;
            this.counterTimer = 0;
        }
    },

    resetCountdown: function() {
        if (this.callCounter) {
            this.isCounting = false;
            this.counterTimer = 0;
            this.callCounter.progress = 0;
        }
    },


    onDeal: function (card, show) {
        var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        this.anchorCards.addChild(newCard.node);
        newCard.init(card);
        newCard.reveal(show);

        var startPos = cc.v2(0, 0);
        var index = this.actor.cards.length - 1;
        var endPos = cc.v2(this.cardSpace * index, 0);
        newCard.node.setPosition(startPos);
        this._updatePointPos(endPos.x);

        var moveAction = cc.moveTo(0.5, endPos);
        var callback = cc.callFunc(this._onDealEnd, this);
        newCard.node.runAction(cc.sequence(moveAction, callback));
    },

    _onDealEnd: function(target) {
        this.resetCountdown();
        if(this.actor.state === ActorPlayingState.Normal) {
            this.startCountdown();
        }
        this.updatePoint();
        // this._updatePointPos(pointX);
    },

    onReset: function () {


        this.anchorCards.removeAllChildren();

        this._resetChips();
    },

    onRevealHoldCard: function () {
        var card = cc.find('cardPrefab', this.anchorCards).getComponent('Card');
        card.reveal(true);
        this.updateState();
    },

    updatePoint: function () {

   
    },

	showUserInfo: function () {

   
    },

    _updatePointPos: function (xPos) {
        // cc.log(this.name + ' card info pos: ' + xPos);
        //this.cardInfo.setPosition(xPos + 50, 0);
    },

    showStakeChips: function(stake) {
        
    },



    updateState: function () {
   
    },
});
