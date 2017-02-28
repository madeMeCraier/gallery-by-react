require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

var imageDatas = require('../data/imageDatas.json');

imageDatas = (function getImageURL(imageDatasArr){

  for(var i=0,j=imageDatasArr.length;i<j;i++){
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas)

class ControllerUnit extends React.Component{

  constructor(props){
    super(props);
  }

  handleClick = (e) => {

    if(this.props.arrange.isCenter){
      this.props.inverse()
    }else{
      this.props.center()
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    let controllerUnitClass = "controller-unit";

    if(this.props.arrange.isCenter){
      controllerUnitClass += " is-center";

      if(this.props.arrange.isInverse){
        controllerUnitClass +=" is-inverse";
      }
    }

    return (
      <span className={controllerUnitClass} onClick={this.handleClick}>
      </span>
    )
  }
}

var ImgFigure = React.createClass({

  componentDidMount(){
    this.DOM = this.refs.figure
  },

  handleClick(e){

    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center()
    }


    e.stopPropagation();
    e.preventDefault();
  },


  render:function () {

    let styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度由值且不为0，添加旋转角度
    if(this.props.arrange.rotate){
      (['Moz','ms','Webkit','']).forEach(function(value){
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if(this.props.arrange.zIndex){
      styleObj["zIndex"] = this.props.arrange.zIndex;
    }

    let imgFigureClassName = "img-figure";

    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return(
      <figure ref="figure" className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>

              {this.props.data.desc}

          </div>
        </figcaption>
      </figure>
    )
  }
})


class AppComponent extends React.Component {

  Constant = {
    centerPos:{
      left:0,
      right:0
    },
    hPosRange:{//水平方向的取值范围
      leftSecX:[0,0],
      rightSecX:[0,0],
      y:[0,0]
    },
    vPosRange:{//垂直方向的取值范围
      x:[0,0],
      topY:[0,0]
    }
  }

  //获取区间内的一个随机值
  getRangeRandom(low,high){
    return Math.ceil(Math.random()*(high-low) + low);
  }

  get30DegRandom(){
    return ((Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30));
  }

  /*
  * 翻转图片
  * @param index 输入当前被执行inverse操作的图片的index值
  * @return{Function} 这是一个闭包函数，其中return一个真正待被执行的函数
  * */
  inverse(index){
    return function(){
      let imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr:imgsArrangeArr
      })

    }.bind(this)
  }


  /*
  *   利用rearrange方法，重新布局排布图片
  * */
  center(index){
    return function(){
      this.rearrange(index)
    }.bind(this)
  }



  /*
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   * */
  rearrange(centerIndex){


    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRigthSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = 3,

      topImgSpliceIndex,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);


    //首先居中centerIndex图片
    imgsArrangeCenterArr[0] = {
      pos:centerPos,
      rotate:0,
      isCenter:true,
      zIndex:101
    }

    //取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value,index) => {

      imgsArrangeTopArr[index] = {
        pos : {
          top:this.getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:this.getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        rotate:this.get30DegRandom(),
        isCenter:false,
        zIndex:0
      }

    })


    //布局左右两侧的图片
    for(let i = 0,j = imgsArrangeArr.length,k=j/2;i<j;i++){
      let hPosRangeLORX = null;

      //前半部分布局左边，后边部分布局右边
      if(i<k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else{
        hPosRangeLORX = hPosRangeRigthSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate:this.get30DegRandom(),
        isCenter:false,
        zIndex:0
      }

    }

    if(imgsArrangeTopArr){
      for(var i = 0;i<topImgNum;i++){
        imgsArrangeArr.splice(topImgSpliceIndex + i,0,imgsArrangeTopArr[i]);
      }
    }

    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr:imgsArrangeArr
    });

  }

  constructor(props){
    super(props);
    this.state = {
      imgsArrangeArr:[
        {
          pos:{
            left:'0',
            top:'0'
          },
          rotate:0, //旋转角度
          isInverse:false, //图片正反面
          isCenter:false,
          zIndex:0
        }
      ]
    }
  }


  componentDidMount(){

    //首先拿到舞台的大小
    let stageDOM = this.refs.stage,
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW/2),
      halfStageH = Math.ceil(stageH/2);

    //拿到一个imgFigure的大小
    let imgFigureDOM =  this.refs.imgFigure0,
      imgW = imgFigureDOM.DOM.scrollWidth,
      imgH = imgFigureDOM.DOM.scrollHeight,
      halfImgW = Math.ceil(imgW/2),
      halfImgH = Math.ceil(imgH/2);


    //计算中心图片的位置点
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    }

    //计算左侧右侧图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW -imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  }

  render() {

    var contorllerUnits = [],
      imgFigure = [];

    imageDatas.forEach(function (value,index) {

      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false,
          zIndex:0,
        }
      }

      imgFigure.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}
                                inverse={this.inverse(index)} center={this.center(index)}/>)
      contorllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)

    }.bind(this))

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigure}
        </section>
        <nav className="controller-nav">
          {contorllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
