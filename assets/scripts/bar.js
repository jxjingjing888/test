// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

		speed: 10,

		powerbar: {

			type: cc.ProgressBar,

			default: null

		}

	},


		onLoad: function () {

		this._pingpong = true;

		this.powerbar.progress = 0;

		},


		update: function (dt) {

		this._updateProgressBar(this.powerbar, dt);

		},


		_updateProgressBar: function(progressBar, dt){

			var progress = progressBar.progress;

			if(progress < 1.0 && this._pingpong){

			progress += dt * this.speed;

		}

		else {

		progress=0;

		/*progress -= dt * this.speed;

		this._pingpong = progress <= 0;*/

		}

		progressBar.progress = progress;

		}



    // update (dt) {},
});
