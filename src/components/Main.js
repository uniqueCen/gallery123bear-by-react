require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

var imageDatas = require('json!../data/imageDatas.json');

function genImageURL(imageDatasArr){
	for(var i = 0,j = imageDatasArr.length;i < j; i++){
		var singleImgData = imageDatasArr[i];
		singleImgData.imageURL = require('../images/'+ singleImgData.fileName);
		imageDatasArr[i] = singleImgData;
	}
	return imageDatasArr;
}
imageDatas = genImageURL(imageDatas);

var ImgFigure = React.createClass({
	render: function(){
		return (
			<figure className="img-figure">
				<img src={this.props.data.imageURL}
					alt={this.props.data.title}
				/>
				<figcaption>
					<h2>{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
});
var Gallery123bearByReactApp = React.createClass({
	render: function(){
		var controllerUnits = [],
			 imgFigures = [];

		imageDatas.forEach(function(value){
			imgFigures.push(<ImgFigure data={value} />);
		}.bind(this));
		return (
	        <section className="stage" ref="stage">
	            <section className="img-sec">
	            	{imgFigures}
	            </section>
	            <nav className="controller-nav">
	            </nav>
	        </section>
	    );
	}

});



module.exports = Gallery123bearByReactApp;
