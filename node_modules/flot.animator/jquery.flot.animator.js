/* jQuery Flot Animator version 1.0.

Flot Animator is a free jQuery Plugin that will add fluid animations to Flot charts.

Copyright (c) 2012-2013 Chtiwi Malek
http://www.codicode.com/art/jquery_flot_animator.aspx

Licensed under Creative Commons Attribution 3.0 Unported License.
*/

$.extend({
  plotAnimator: function (chart, data,g){
    
    var serie = 0;
    for (var i = 0; i < data.length; i++)
    {
      if (data[i].animator)
      {
        serie = i;
      }
    }
    
    function pInit(arr){
	  var x = [];
      x.push([arr[0][0], Math.max.apply(Math, arr.map(function(i) { return i[1];}))]);
      x.push([arr[0][0], null]);
      x.push([arr[0][0], Math.min.apply(Math, arr.map(function(i) { return i[1];}))]);
      for(var i = 0; i < arr.length; i++) {
          x.push([arr[i][0], null]);
      }
      data[serie].data = x;
      return $.plot(chart, data, g);
    }
    
    var d0 = data[serie];
    var oData = d0.data;
    
    var plot = pInit(oData);
    
    var isLines = (data[serie].lines)?true:false;
    var steps = (data[serie].animator && data[serie].animator.steps) || 135;
    var duration = (data[serie].animator && data[serie].animator.duration) || 1000;
    var start = (data[serie].animator && data[serie].animator.start) || 0;
    var dir = (data[serie].animator && data[serie].animator.direction) || "right";
    function stepData()
    {
      var Si = oData[0][0];
      var Fi = oData[oData.length-1][0];
      var Pas = (Fi-Si)/steps;
      
      var d2 = [];      
      d2.push(oData[0]);
      var nPointPos = 1;
      lPoint = oData[0];
      nPoint = oData[nPointPos];
      for (var i = Si+Pas; i < Fi+Pas; i += Pas)
      {
        if (i>Fi) {i=Fi;}
        $("#m2").html(i);
        while (i > nPoint[0])
        {
          lPoint = nPoint;
          nPoint = oData[nPointPos++];
        }
        if (i == nPoint[0])
        {
          d2.push([i,nPoint[1]]);
          lPoint = nPoint;
          nPoint = oData[nPointPos++];
        }
        else
        {
          var a = ((nPoint[1]-lPoint[1]) / ((nPoint[0]-lPoint[0])));
          curV = (a * i) + (lPoint[1] - (a * lPoint[0]));
          d2.push([i,curV]);
        }
      }
      return d2;
    }
    
    var step=0;
    var sData = stepData();
    function plotData()
    {
      var d3=[];
      step++;
      
      switch(dir)
      {
        case 'right':
          d3 = sData.slice(0, step);
          break;
        case 'left':
          d3 = sData.slice(-1*step);
          break
          case 'center':
          d3 = sData.slice((sData.length/2)-(step/2),(sData.length/2)+(step/2));
          break;
      }
      
      if (!isLines)
      {
        inV = d3[0][0];
      	laV = d3[d3.length-1][0];
        d3=[];
        for (var i = 0; i < oData.length; i++)
      	{
          if (oData[i][0]>=inV && oData[i][0]<=laV)
          {
            d3.push(oData[i]);
          }
      	}
      }
      
      data[serie].data = (step<steps)?d3:oData;
      plot.setData(data);
      plot.draw();
      if (step<steps)
      {
        setTimeout(plotData, duration/steps);
      }
      else
      {
        chart.trigger( "animatorComplete" );
      }
    }
    
    setTimeout(plotData,start);
    return plot;
  }
});
