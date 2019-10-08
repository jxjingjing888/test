cc.Class({
    extends: cc.Component,

    properties: {
        typeName: 'yinXiao',
        openNode: cc.Toggle,
        closeNode: cc.Toggle,
        maskNode: cc.Node,
        handleNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
		//this.audioMng = AudioMng.getComponent('AudioMng');
        var value = cc.sys.localStorage.getItem(this.typeName);
		if(value == 0){
			this.closeNode.isChecked = true;
		   this.openNode.isChecked = false;
			
		}else{
			this.closeNode.isChecked = false;
		 this.openNode.isChecked = true;

		
		}
        //this.setValue(value, true);
    },

    setValue: function (value, includeHandle) {   // includeHandle表示是否要对控制点进行操作
        this.value = value;
		cc.sys.localStorage.setItem(this.typeName, value);
    },

    onClickOpenNodeToClose: function () {
        this.setValue(0, true);
		//AudioMng.pauseMusic();
		cc.audioEngine.setEffectsVolume(0);
		cc.audioEngine.pauseMusic();
		
    },

    onClickCloseNodeToOpen: function () {
        this.setValue(1, true);
		cc.audioEngine.setEffectsVolume(1);
		cc.audioEngine.resumeMusic();
		
    },

		close:function(){
		 this.node.destroy();
	},
 
});
