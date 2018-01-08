require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

var imageDatas = require('../data/imageDatas.json');

function genImageURL(imageDatasArr){
	for(var i = 0,j = imageDatasArr.length;i < j; i++){
		imageDatasArr[i].imageURL = require('../images/'+imageDatasArr[i].fileName);
	}
	return imageDatasArr;
}
imageDatas = genImageURL(imageDatas);

var Gallery123bearByReactApp = React.createClass({
	render: function(){
		return (
			<section classsName="stage">
				<section classsName="img-sec">
				</section>
				<nav classsName="controller-nav">
				</nav>
			</section>
		);
	}

});

React.render(<Gallery123bearByReactApp/>,document.getElementById('content'));
