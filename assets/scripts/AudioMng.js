var AudioMng = cc.Class({
    extends: cc.Component,

    properties: {
        winAudio: {
            default: null,
            url: cc.AudioClip
        },

        loseAudio: {
            default: null,
            url: cc.AudioClip
        },

        buttonAudio: {
            default: null,
            url: cc.AudioClip
        },

        bgm: {
            default: null,
            url: cc.AudioClip
        },
		yao:{
			default: null,
            url: cc.AudioClip
		},
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
	    talkBGM:{
			 default: [],
            url: cc.AudioClip
		},


    },
	onLoad: function () {
		 this.yinXiao = cc.sys.localStorage.getItem('yinXiao');
	},

	_playSFX: function(clip) {
		if(this.yinXiao != '0'){
			 cc.audioEngine.playEffect( clip, false );
		}
       
    },

    playMusic: function() {
		if(this.yinXiao != '0'){
			cc.audioEngine.playMusic( this.bgm, true );
		}
    },

    pauseMusic: function() {
		if(this.yinXiao != '0'){
			cc.audioEngine.pauseMusic();
		}
    },

    resumeMusic: function() {
		if(yinXiao != '0'){
			cc.audioEngine.resumeMusic();
		}
    },

    playWin: function() {
		if(this.yinXiao != '0'){
			this._playSFX(this.winAudio);
		}
    },

    playLose: function() {
		if(this.yinXiao != '0'){
			this._playSFX(this.loseAudio);
		}
    },

    playButton: function() {
		if(this.yinXiao != '0'){
			this._playSFX(this.buttonAudio);
		}
    },
	playYao: function() {
		if(this.yinXiao != '0'){
			this._playSFX(this.yao);
		}
    },
	playDiceBGM:function(diceNum){
		if(this.yinXiao != '0'){
			this._playSFX(this.diceBGM[diceNum-1]);
		}
	},
	playNumBGM:function(num){
		if(this.yinXiao != '0'){
			this._playSFX(this.numBGM[num-1]);
		}
	},
	playZaiBGM:function(){
		if(this.yinXiao != '0'){
			this._playSFX(this.zaiBGM);
		}
	},
	playFeiBGM:function(){
		if(this.yinXiao != '0'){
			this._playSFX(this.feiBGM);
		}
	},
	playDiceAndNumBGM( num,diceNum,zai,fei){
		if(this.yinXiao != '0'){
			var id = cc.audioEngine.playEffect( this.numBGM[num-1], false );
			cc.audioEngine.setFinishCallback(id, () => {
			var	 lid = cc.audioEngine.playEffect( this.diceBGM[diceNum-1], false );

				 cc.audioEngine.setFinishCallback(lid, () => {
					if(zai){
						cc.audioEngine.playEffect( this.zaiBGM, false );
					}else if(fei ){
						cc.audioEngine.playEffect( this.feiBGM, false );
					}

					
				});
				
			});
		}

	

	
	},//end palyDiceAndNumBGM

  	playTalkBGM:function(num){
		if(this.yinXiao != '0'){
			this._playSFX(this.talkBGM[num]);
		}
	},




});
