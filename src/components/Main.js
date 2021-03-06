require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

var imageDatas = require('json!../data/imageDatas.json');

function genImageURL(imageDatasArr){
	for(var i = 0,j = imageDatasArr.length;i < j; i++){
		imageDatasArr[i].imageURL = require('../images/'+ imageDatasArr[i].fileName);
	}
	return imageDatasArr;
}
imageDatas = genImageURL(imageDatas);

/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

/*
 * 获取0-30之间的一个任意正负值
 */
function get30DegRandom(){
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

var ImgFigure = React.createClass({
    handleClick: function(e) {
    	if (this.props.arrange.isCenter) {
    		this.props.inverse();
    	} else {
    		this.props.center();
    	}
    	e.stopPropagation();
        e.preventDefault();
    },

	render:function(){
		var styleObj = {};

        // 如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }
        //如果图片旋转角度不为0，添加旋转角度
        if(this.props.arrange.rotate){
        	(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value){
        		styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        	}.bind(this));
        }

        // 如果是居中的图片， z-index设为11
        if (this.props.arrange.isCenter) {
          styleObj.zIndex = 11;
        }

       var imgFigureClassName = 'img-figure';
       if(this.props.arrange.isInverse){
        	imgFigureClassName = imgFigureClassName + ' img-is-inverse';
        }
		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL}
					alt={this.props.data.title}
				/>
				
				<figcaption >
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
                      <p>
                        {this.props.data.description}
                      </p>
                    </div>
				</figcaption>
			</figure>
		);
	}
});
var ControllerUnit = React.createClass({
	handleClick: function(e){
		if (this.props.arrange.isCenter) {
    		this.props.inverse();
    	} else {
    		this.props.center();
    	}
		e.preventDefault();
		e.stopPropagation();
	},
	render: function(){
		var styleObj = {};
		var className = 'controller-unit' ;
		if(this.props.arrange.isCenter){
        	className = className + ' isCenter';
        	if(this.props.arrange.isInverse){
        		className = className + ' isInverse';
        	}
		}
		return (<span className={className}  style={styleObj} onClick={this.handleClick}></span>);
	}
});
var Gallery123bearByReactApp = React.createClass({
	Constant:{
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{ //水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{ //垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}

	},
  	/*
  	 * 翻转图片
  	 * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
   	* @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
   	*/
 	 inverse: function (index) {
   	 	return function () {
      	var imgsArrangeArr = this.state.imgsArrangeArr;

     	 imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      	this.setState({
      	  imgsArrangeArr: imgsArrangeArr
     	 });
    	}.bind(this);
 	 },
	/*重新布局所有图片怎么*/
	rearrange: function(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),    // 取一个或者不取
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate : 0,
          isCenter : true
        };

        // 取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
              pos: {
                  top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                  left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
              },
              rotate: get30DegRandom(),
              isCenter:false
            };
        });
        // 布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            // 前半部分布局左边， 右半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
              pos: {
                  top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                  left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
              },
              rotate: get30DegRandom(),
              isCenter:false
            };

        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
	},
	/*
   * 利用arrange函数， 居中对应index的图片
   * @param index, 需要被居中的图片对应的图片信息数组的index值
   * @returns {Function}
   */
	center: function (index) {
	    return function () {
	      this.rearrange(index);
	    }.bind(this);
	},
	getInitialState: function(){
		return {
			imgsArrangeArr: [
				/*{
					pos:{
						left:'0',
						top:'0'
					},
					rotate : 0 ,//旋转角度
					isInverse: false,//图片正反面
					isCenter: false
				}*/
				
			]
		};
	},

	//组件加载以后，为每张图片计算其位置的范围
	componentDidMount: function(){
		//舞台的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			//scrollWidth是对象实际的宽度，不包含滚动条等宽度，不随对象显示大小而变化
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW/2),
			halfStageH = Math.ceil(stageH/2);

		// 拿到一个imageFigure的大小
    	var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
	        imgW = imgFigureDOM.scrollWidth,
	        imgH = imgFigureDOM.scrollHeight,
	        halfImgW = Math.ceil(imgW / 2),
	        halfImgH = Math.ceil(imgH / 2);

	    // 计算中心图片的位置点
	    this.Constant.centerPos = {
	        left: halfStageW - halfImgW,
	        top: halfStageH - halfImgH
	    };

	    // 计算左侧，右侧区域图片排布位置的取值范围,X轴在舞台的左侧边处，
	    //X的范围是图片左侧边的X的范围，Y记录的是图片顶部边的Y的范围
	    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
	    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
	    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
	    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
	    this.Constant.hPosRange.y[0] = -halfImgH;
	    this.Constant.hPosRange.y[1] = stageH - halfImgH;

	    // 计算上侧区域图片排布位置的取值范围  Y坐标在舞台上方，往下是Y轴的正方向
	    this.Constant.vPosRange.topY[0] = - halfImgH;
	    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
	    this.Constant.vPosRange.x[0] = halfStageW - imgW;
	    this.Constant.vPosRange.x[1] = halfStageW;

	    this.rearrange(0);
	},
	
	render: function(){
		var controllerUnits = [],
			 imgFigures = [];

		imageDatas.forEach(function(value,index){
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos:{
						left :0,
						top:0
					},
					rotate : 0,
					isInverse: false,
					isCenter: false
				};
			}
			/*给组件添加key属性是为了帮助react标记组件，以更快的对比组件变化前后的不同，提高运行速率*/
			imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index}
				arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)} />);
			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
		}.bind(this));
		/*.bind(this)将所在的reactComponent对象传到其绑定的方法中*/
		return (
	        <section className="stage" ref="stage">
	            <section className="img-sec">
	            	{imgFigures}
	            </section>
	            <nav className="controller-nav">
	            	{controllerUnits}
	            </nav>
	        </section>
	    );
	}

});



module.exports = Gallery123bearByReactApp;
