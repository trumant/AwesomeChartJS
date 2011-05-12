/*
*   Copyright 2011 Georgios Migdos
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

Array.prototype.numericSortReverse = function(data){
    this.sort(function(a, b){
        return data[b] - data[a];
    });
}

function AwesomeChart(canvasElementId){
    var canvas = document.getElementById(canvasElementId);
    var that = this;
    
    this.ctx = canvas.getContext('2d');
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    
    this.numberOfDecimals = 0;
    
    this.proportionalSizes = true;
    this.widthSizeFactor = this.width/400;
    this.heightSizeFactor = this.height/400;
    
    this.chartType = 'bar';
    this.randomColors = false;
    
    this.marginTop = 10;
    this.marginBottom = 10;
    this.marginLeft = 10;
    this.marginRight = 10;
    
    this.labelMargin = 10;
    this.dataValueMargin = 20;
    this.titleMargin = 10;
    this.yAxisLabelMargin = 5;
    
    this.data = new Array();
    this.labels = new Array();
    this.colors = new Array();
    this.title = null;
    
    // for stacked col charts
    this.axisLabels = new Array();
    
    this.backgroundFillStyle = 'rgba(255,255,255,0)';
    this.borderStrokeStyle = 'rgba(255,255,255,0)';
    this.borderWidth = 1.0;
    
    this.labelFillStyle = 'rgb(220, 36, 0)';
    this.labelFont = 'sans-serif';
    this.labelFontHeight = 12;
    this.labelFontStyle = '';
    this.labelCtxStyle = this.labelFontStyle + ' ' + this.labelFontHeight + 'px ' + this.labelFont;
    
    this.dataValueFillStyle = '#333';
    this.dataValueFont = 'sans-serif';
    this.dataValueFontHeight = 15;
    this.dataValueFontStyle = '';
    this.dataCtxStyle = this.dataValueFontStyle + ' ' + this.dataValueFontHeight + 'px ' + this.dataValueFont;
    
    this.titleFillStyle = '#333';
    this.titleFont = 'sans-serif';
    this.titleFontHeight = 16;
    this.titleFontStyle = 'bold';
    this.titleCtxStyle = this.titleFontStyle + ' ' + this.titleFontHeight + 'px ' + this.titleFont;
    
    this.yAxisLabelFillStyle = '#333';
    this.yAxisLabelFont = 'sans-serif';
    this.yAxisLabelFontHeight = 10;
    this.yAxisLabelFontStyle = '';
    
    var lingrad = this.ctx.createLinearGradient(0,0,0,this.height);
    lingrad.addColorStop(0.2, '#fdfdfd');
    lingrad.addColorStop(0.8, '#ededed');
    
    this.chartBackgroundFillStyle = lingrad;
    this.chartBorderStrokeStyle = '#999';
    this.chartBorderLineWidth = 1;
    this.chartHorizontalLineStrokeStyle = '#999';
    this.chartHorizontalLineWidth = 1;
    this.chartVerticalLineStrokeStyle = '#999';
    this.chartVerticalLineWidth = 1;
    
    this.chartMarkerSize = 5;
    
    this.chartPointRadius = 4;
    this.chartPointFillStyle = 'rgb(150, 36, 0)';
    
    this.chartLineStrokeStyle = 'rgba(150, 36, 0, 0.5)';
    this.chartLineWidth = 2;
    
    this.barFillStyle = 'rgb(220, 36, 0)';
    this.barStrokeStyle = '#fff';
    this.barBorderWidth = 2.0;
    this.barShadowColor = 'rgba(0, 0, 0, 0.5)';
    this.barShadowBlur = 5;
    this.barShadowOffsetX = 3.0;
    this.barShadowOffsetY = 0.0;
    
    this.barHGap = 20;
    this.barVGap = 20;
    
    this.explosionOffset = 20;

    this.pieFillStyle = 'rgb(220, 36, 0)';
    this.pieStrokeStyle = '#fff';
    this.pieBorderWidth = 2.0;
    this.pieShadowColor = 'rgba(0, 0, 0, 0.5)';
    this.pieShadowBlur = 5;
    this.pieShadowOffsetX = 3.0;
    this.pieShadowOffsetY = 0.0;
    
    this.pieStart = 0;
    this.pieTotal = null;
    
    this.generateRandomColor = function(){
        var rgb = new Array();
        for(var i=0; i<3; i++){
            rgb.push(Math.ceil(Math.random()*150 + 50));
        }
        return 'rgb('+rgb.join(",")+')';
    }
    
    
    this.draw = function(){
        var context = this.ctx;
        this.chartData = new ChartData(this.data);
        
        context.lineCap = 'round';
        var minFactor = Math.min(this.widthSizeFactor, this.heightSizeFactor);
        
        if(this.proportionalSizes){            
            this.labelMargin = this.labelMargin * this.heightSizeFactor;
            this.dataValueMargin = this.dataValueMargin * this.heightSizeFactor;
            this.titleMargin = this.titleMargin * this.heightSizeFactor;
            this.yAxisLabelMargin = this.yAxisLabelMargin * this.heightSizeFactor;
            
            this.labelFontHeight = this.labelFontHeight * minFactor;
            this.dataValueFontHeight = this.dataValueFontHeight * minFactor;
            this.titleFontHeight = this.titleFontHeight * minFactor;
            this.yAxisLabelFontHeight = this.yAxisLabelFontHeight * minFactor;
            
            this.barHGap = this.barHGap * this.widthSizeFactor;
            this.barVGap = this.barHGap * this.heightSizeFactor;
            this.explosionOffset = this.explosionOffset * minFactor;
        }
        
        if(this.randomColors){
            for(var i=0; i<this.data.length; i++){
                if(!this.colors[i]){
                    this.colors[i] = this.generateRandomColor();
                }
            }
        }
        
        if(this.chartType == "pie"){
             this.drawPieChart(false);
        }else if( (this.chartType == "ring") || (this.chartType == "doughnut")){
             this.drawPieChart(true);
        }else if(this.chartType == "exploded pie"){
             this.drawExplodedPieChart();
        }else if(this.chartType == "horizontal bars"){
            this.drawVerticalBarChart();
        }else if(this.chartType == "pareto"){
            this.drawParetoChart();
        }else if (this.chartType == "stacked column"){
            this.drawStackedColumnChart();
        }else if (this.chartType == "line") {
            this.drawLineChart();
        }else{
            this.drawBarChart();
        }
        
        
        if(this.title){
            //Draw the title:
            context.font = this.titleCtxStyle;
            context.fillStyle = this.titleFillStyle;
            context.textAlign = 'center';
            context.textBaseline = 'bottom';
            context.fillText(this.title, this.width/2, this.marginTop+this.titleFontHeight, this.width-10);
        }
        
        //Draw the outer border:
        context.lineWidth = this.borderWidth;
        context.strokeStyle = this.borderStrokeStyle;
        context.strokeRect(0, 0, this.width, this.height);
        
        context.globalCompositeOperation = 'destination-over';
            
        //Fill the background:
        context.fillStyle = this.backgroundFillStyle;
        context.fillRect(0, 0, this.width, this.height);
            
        context.globalCompositeOperation = 'source-over';
    }
    
    
    this.drawBarChart = function(){
        var context = this.ctx;
        
        //Calculate bar size:
        var n = this.data.length;
        
        var barWidth = (this.width - this.marginLeft
            - this.marginRight - (n-1) * this.barHGap) / n;
                            
        var barMaxTopY = this.marginTop + this.labelMargin + this.labelFontHeight + this.dataValueMargin + this.dataValueFontHeight;
        
        var barMinTopY = this.height - this.marginBottom;
        
        if(this.title){
            barMaxTopY += this.titleFontHeight + this.titleMargin;
        }
        
        var barBottomY = this.height - this.marginBottom;
        
        if(this.chartData.min<0){
        
            barMinTopY = this.height - this.marginBottom - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight;
            
            barBottomY =  barMinTopY + ((this.height - this.marginBottom -  barMaxTopY - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight) * this.chartData.min) / (Math.abs(this.chartData.min)+this.chartData.max);
            
        }
        
        var maxBarHeight = Math.max(Math.abs(barBottomY - barMaxTopY), Math.abs(barBottomY - barMinTopY));
        var maxBarAbsData = Math.max(Math.abs(this.chartData.min), Math.abs(this.chartData.max));
        
        var x = this.marginLeft;
        var y = barBottomY;
        var barHeight = 0;
                
        var di = 0;
        for(var i=0; i<this.data.length; i++){
            di = this.data[i];
            
            barHeight = di * maxBarHeight / maxBarAbsData;
            
            var fill;
            var labelFill;
            if(this.colors[i]){
                fill = this.colors[i];
                labelFill = fill;
            }else{
                fill = this.barFillStyle;
                labelFill = this.labelFillStyle;
            }
            
            drawRectangle(fill, x, y, barHeight, barWidth);

            //Draw the label:
            context.fillStyle = labelFill;
            context.font = this.labelCtxStyle;
            context.textAlign = 'center';
            if(this.labels[i]){
                if(di>=0){
                    context.textBaseline = 'bottom';
                    context.fillText(this.labels[i], x + barWidth/2, barBottomY - barHeight - this.labelMargin, barWidth);
                }else{
                    context.textBaseline = 'top';
                    context.fillText(this.labels[i], x + barWidth/2, barBottomY - barHeight + this.labelMargin, barWidth);
                }
            }
            
            //Draw the data value:
            context.font = this.dataCtxStyle;
            context.fillStyle = this.dataValueFillStyle;
            context.textAlign = 'center';
            if(di>=0){
                context.textBaseline = 'bottom';
                context.fillText(di, x + barWidth/2, barBottomY - barHeight - this.labelMargin - this.dataValueMargin, barWidth);
            }else{
                context.textBaseline = 'top';
                context.fillText(di, x + barWidth/2, barBottomY - barHeight + this.labelMargin + this.dataValueMargin, barWidth);
            }
            
            //Update x:
            x = x + barWidth + this.barHGap;
        }
    }
    
    
    this.drawVerticalBarChart = function(){
        var context = this.ctx;

        context.save();
        context.translate(this.width/2, this.height/2);
        context.rotate(Math.PI/2);
        context.translate(-this.width/2, -this.height/2);
        
        //Calculate bar size:
        var n = this.data.length;
        
        if(this.title){
            this.marginLeft += this.titleFontHeight + this.titleMargin;
        }
        
        var barWidth = (this.width - this.marginLeft
            - this.marginRight - (n-1) * this.barHGap) / n;

        var maxLabelWidth = maxTextWidth(this.labels, this.labelCtxStyle);
        var maxDataValueWidth = maxTextWidth(this.data, this.dataCtxStyle);
        
        var barMaxTopY = this.marginTop + Math.max( (this.labelMargin + maxLabelWidth), (this.dataValueMargin + maxDataValueWidth) );
        
        var barMinTopY = this.height - this.marginBottom;
        
        var barBottomY = this.height - this.marginBottom;
        
        if(this.chartData.min < 0){
        
            barMinTopY = this.height - this.marginBottom - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight;
            
            barBottomY =  barMinTopY + ((this.height - this.marginBottom -  barMaxTopY - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight) * this.chartData.min) / (Math.abs(this.chartData.min)+this.chartData.max);
        }
        
        
        var maxBarHeight = Math.max(Math.abs(barBottomY - barMaxTopY), Math.abs(barBottomY - barMinTopY));
        var maxBarAbsData = Math.max(Math.abs(this.chartData.min), Math.abs(this.chartData.max));
        
        var x = this.marginLeft;
        var y = barBottomY;
        var barHeight = 0;
                
        var di = 0;
        for(var i=0; i<this.data.length; i++){
            di = this.data[i];
            
            barHeight = di * maxBarHeight / maxBarAbsData;
            
            //Draw the bar:
            var fill;
            var labelFill;
            if(this.colors[i]){
                fill = this.colors[i];
                labelFill = fill;
            }else{
                fill = this.barFillStyle;
                labelFill = this.labelFillStyle;
            }
            drawRectangle(fill, x, y, barHeight, barWidth);
                        
            //Draw the label:
            context.font = this.labelCtxStyle;
            context.fillStyle = labelFill;
            
            context.save();
            context.translate(x + barWidth/2 , barBottomY - barHeight);
            context.rotate(-Math.PI/2);
            context.textBaseline = 'top';
            if(this.labels[i]){
                if(di>=0){
                    context.textAlign = 'left';
                    context.fillText(this.labels[i], this.labelMargin, 0);
                }else{
                    context.textAlign = 'right';
                    context.fillText(this.labels[i], -this.labelMargin, 0);
                }
            }

            //Draw the data value:
            context.font = this.dataCtxStyle;
            context.fillStyle = this.dataValueFillStyle;
            context.textBaseline = 'bottom';
            if(di>=0){
                context.textAlign = 'left';
                context.fillText(di, this.labelMargin, 0);
            }else{
                context.textAlign = 'right';
                context.fillText(di, -this.labelMargin, 0);
            }

            context.restore();
            
            //Update x:
            x = x + barWidth + this.barHGap;
        }
        context.restore();
    }

    this.drawPieChart = function(ring){
        var context = this.ctx;
        context.lineWidth = this.pieBorderWidth;

        var dataSum = 0;
        if(this.pieTotal == null){
            var len = this.data.length;
            for (var i = 0; i < len; i++){
                dataSum += this.data[i];
                if(this.data[i]<0){
                    return;
                }
            }
        }else{
            dataSum = this.pieTotal;
        }

        var pieAreaWidth = this.width - this.marginLeft - this.marginRight;
        var pieAreaHeight = this.height - this.marginTop - this.marginBottom;
        
        if(this.title){
            pieAreaHeight = pieAreaHeight - this.titleFontHeight - this.titleMargin;
        }
        
        var centerX = this.width / 2;
        var centerY = this.marginTop + (pieAreaHeight / 2);
        
        if(this.title){
            centerY += this.titleFontHeight + this.titleMargin;
        }

        var doublePI = 2 * Math.PI;
        var radius = (Math.min( pieAreaWidth, pieAreaHeight) / 2);
        
        var maxLabelWidth = maxTextWidth(this.labels, this.labelCtxStyle);
        radius = radius - maxLabelWidth - this.labelMargin;
        
        var startAngle = this.pieStart* doublePI / dataSum;
        var currentAngle = startAngle;
        var endAngle = 0;
        var incAngleBy = 0;
        
        for(var i=0; i<this.data.length; i++){
            context.beginPath();
            incAngleBy = this.data[i] * doublePI / dataSum;
            endAngle = currentAngle + incAngleBy;

            
            context.moveTo(centerX, centerY);
            context.arc(centerX, centerY, radius, currentAngle, endAngle, false);
            context.lineTo(centerX, centerY);

            currentAngle = endAngle;
            
            if(this.colors[i]){
                context.fillStyle = this.colors[i];
            }else{
                context.fillStyle = this.pieFillStyle;
            }
            context.fill();
            
            context.strokeStyle = this.pieStrokeStyle;
            context.stroke();
        }
        
        
        //Draw the outer shadow:
        
        context.save();
        
        context.shadowOffsetX = this.pieShadowOffsetX;
        context.shadowOffsetY = this.pieShadowOffsetY;
        
        context.translate(centerX, centerY);
        //context.rotate(this.pieStart* doublePI / dataSum);
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, radius, startAngle, endAngle, false);
        
        
        context.shadowBlur = this.pieShadowBlur;
        context.shadowColor = this.pieShadowColor;
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = 'rgba(0,0,0,1.0)';
        context.fill();

        context.restore();

        //Ring-charts:
                
        if(ring){
        
            
        
            // "cut" the central part:
            
            context.save();
            
            var ringCenterRadius = radius/2;
            context.beginPath();
            context.moveTo(centerX+ringCenterRadius, centerY);
            context.arc(centerX, centerY, ringCenterRadius, 0, doublePI, false);
            
            context.globalCompositeOperation = 'destination-out';
            context.fillStyle = '#000';
            context.fill();
            
            context.restore();
            
            // draw the ring's inner shadow below the ring:
            context.save();
        
            context.shadowOffsetX = this.pieShadowOffsetX;
            context.shadowOffsetY = this.pieShadowOffsetY;
            
            context.translate(centerX, centerY);
            context.beginPath();
            context.arc(0, 0, ringCenterRadius, startAngle, endAngle, false);
            
            
            context.shadowBlur = this.pieShadowBlur;
            context.shadowColor = this.pieShadowColor;
            context.globalCompositeOperation = 'destination-over';
            context.strokeStyle = this.pieStrokeStyle;
            context.stroke();

            context.restore();
                    
        }
        
        
        // draw the labels:
        
        var currentAngle = this.pieStart* doublePI / dataSum;
        var endAngle = 0;
        var incAngleBy = 0;
        
        context.beginPath();
        

        for(var i=0; i<this.data.length; i++){
            context.save();
            incAngleBy = this.data[i] * doublePI / dataSum;
            endAngle = currentAngle + incAngleBy;
            
            var mAngle = currentAngle +  incAngleBy/2;
            context.translate(centerX, centerY);
            context.rotate(mAngle);
            
            context.font = this.labelCtxStyle;
            if(this.colors[i]){
                context.fillStyle = this.colors[i];
            }else{
                context.fillStyle = this.labelFillStyle;
            }
            context.textAlign = 'start';
            if(this.labels[i]){
                if( (currentAngle>Math.PI/2) && (currentAngle<=3*(Math.PI/2)) ){
                    var translateXBy = radius + this.labelMargin + context.measureText(this.labels[i]).width / 2;
                    context.translate(translateXBy, 0);
                    context.rotate(Math.PI);
                    context.translate(-translateXBy, 0);
                }
                context.textBaseline = 'middle';
                context.fillText(this.labels[i], radius+this.labelMargin, 0);
            }
            
            context.restore();
            currentAngle = endAngle;
        }
    }
    
    
    this.drawExplodedPieChart = function(){
        var context = this.ctx;
        context.lineWidth = this.pieBorderWidth;

        var dataSum = 0;
        if(this.pieTotal == null){
            var len = this.data.length;
            for (var i = 0; i < len; i++){
                dataSum += this.data[i];
                if(this.data[i]<0){
                    return;
                }
            }
        }else{
            dataSum = this.pieTotal;
        }

        var pieAreaWidth = this.width - this.marginLeft - this.marginRight;
        var pieAreaHeight = this.height - this.marginTop - this.marginBottom;
        
        if(this.title!=null){
            pieAreaHeight = pieAreaHeight - this.titleFontHeight - this.titleMargin;
        }
        
        var centerX = this.width / 2;
        var centerY = this.marginTop + (pieAreaHeight / 2);
        
        if(this.title){
            centerY += this.titleFontHeight + this.titleMargin;
        }

        var doublePI = 2 * Math.PI;
        var radius = (Math.min( pieAreaWidth, pieAreaHeight) / 2);
        
        var maxLabelWidth = maxTextWidth(this.labels, this.labelCtxStyle);
        radius = radius - maxLabelWidth - this.labelMargin;
        
        var currentAngle = this.pieStart* doublePI / dataSum;
        var endAngle = 0;
        var incAngleBy = 0;
        var halfAngle = incAngleBy/2;
        
        for(var i=0; i<this.data.length; i++){
            
            context.save();
            incAngleBy = this.data[i] * doublePI / dataSum;
            endAngle = currentAngle + incAngleBy;
            
            context.translate(centerX, centerY);
            context.rotate(currentAngle);
         
            context.rotate(incAngleBy/2);
            context.translate(this.explosionOffset,0);
            context.rotate(-incAngleBy/2);
            
            context.beginPath();
            context.moveTo(0,0);
            context.arc(0, 0, radius, 0, incAngleBy, false);
            context.lineTo(0, 0);
            
            context.save();
        
            context.shadowOffsetX = this.pieShadowOffsetX;
            context.shadowOffsetY = this.pieShadowOffsetY;
            context.shadowBlur = this.pieShadowBlur;
            context.shadowColor = this.pieShadowColor;

            if(this.colors[i]){
                context.fillStyle = this.colors[i];
            }else{
                context.fillStyle = this.pieFillStyle;
            }
            context.fill();

            context.restore();

            context.strokeStyle = this.pieStrokeStyle;
            context.stroke();
            
            
            // Draw the label:
            
            context.rotate(incAngleBy/2);
            
            context.font = this.labelCtxStyle;
            if(this.colors[i]){
                context.fillStyle = this.colors[i];
            }else{
                context.fillStyle = this.labelFillStyle;
            }
            context.textAlign = 'start';
            if(this.labels[i]){
                if( (currentAngle>Math.PI/2) && (currentAngle<=3*(Math.PI/2)) ){
                    var translateXBy = radius + this.labelMargin + context.measureText(this.labels[i]).width / 2;
                    context.translate(translateXBy, 0);
                    context.rotate(Math.PI);
                    context.translate(-translateXBy, 0);
                }
                context.textBaseline = 'middle';
                context.fillText(this.labels[i], radius+this.labelMargin, 0);
            }
            
            // Restore the context:
            context.restore();
            currentAngle = endAngle;
        }
    }
    
    
    
    this.drawParetoChart = function(){
        var context = this.ctx;
        
        var n = this.data.length;
        
        var indices = new Array();
        for (var i = 0; i < this.data.length; i++){
            indices.push(i);
        }
        
        indices.numericSortReverse(this.data);
        
        var maxData = this.data[indices[0]];
        var minData = this.data[indices[indices.length-1]];
        
        var dataSum = 0;
        for (var i = 0; i < this.data.length; i++){
            dataSum += this.data[indices[i]];
            if(this.data[indices[i]]<0){
                return;
            }
        }
        dataSum = dataSum.toFixed(this.numberOfDecimals);
        
        var yAxisValues = new Array();
        yAxisValues.push(0);
        for (var i = 1; i < 10; i++){
            yAxisValues.push((dataSum * i/10).toFixed(this.numberOfDecimals));
        }
        yAxisValues.push(dataSum);
        
        // Find the widest Y-axis value's width:
        context.font = this.yAxisLabelFontStyle + ' ' + this.yAxisLabelFontHeight + 'px '+ this.yAxisLabelFont;
        var maxYAxisLabelWidth = 0;
        var yAxisLabelWidth = 0;
        for(var i=0; i<yAxisValues.length; i++){
            yAxisLabelWidth = context.measureText(yAxisValues[i]).width;
            if(yAxisLabelWidth>maxYAxisLabelWidth){
                maxYAxisLabelWidth = yAxisLabelWidth;
            }
        }
        
        var perCentMaxWidth = context.measureText("100%").width;
        
        // Calculate the chart size and position:
        var chartWidth = this.width - this.marginLeft - this.marginRight - 2*this.chartMarkerSize - maxYAxisLabelWidth - perCentMaxWidth - 2*this.yAxisLabelMargin;
        var chartHeight = this.height - this.marginTop - this.marginBottom;
        
        var chartTopLeftX = this.marginLeft + this.chartMarkerSize + maxYAxisLabelWidth + this.yAxisLabelMargin;
        var chartTopLeftY = this.marginTop;
        
        
        if(this.title){
            chartHeight -= this.titleFontHeight + this.titleMargin;
            chartTopLeftY += this.titleFontHeight + this.titleMargin;
        }
        // new call
        context.save();
        drawBackground(0, dataSum, chartTopLeftX, chartTopLeftY, chartWidth, chartHeight);
        
        // Draw the bars:
        
        context.save();
        
        context.translate(0, chartHeight);
        
        var barWidth = (chartWidth-2*this.barHGap) / n;
        var barHeight = 0;
        
        var halfBarWidth = barWidth/2;
        
        var y = 0;
        var x = this.barHGap;
        var x1 = x;
        var y1 = 0;
        var x2 = 0;
        var y2 = 0;
        
        for(var i=0; i<this.data.length; i++){
            
            barHeight = this.data[indices[i]] * chartHeight / dataSum;
            
            //Draw the bar:
            
            if(this.colors[i]){
                context.fillStyle = this.colors[i];
            }else{
                context.fillStyle = this.barFillStyle;
            }
            context.strokeStyle = this.barStrokeStyle;
            context.lineWidth = this.barBorderWidth;
            
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, y - barHeight);
            context.lineTo(x + barWidth, y - barHeight);
            context.lineTo(x + barWidth, y);

            context.save();
            context.shadowOffsetX = this.barShadowOffsetX;
            context.shadowOffsetY = this.barShadowOffsetY;
            context.shadowBlur = this.barShadowBlur;
            context.shadowColor = this.barShadowColor;
            
            context.fill();
            context.restore();
            context.stroke();
            
            
            // Draw the line:
            
            x2 = x1;
            y2 = y1;
            x1 = x + barWidth;
            y1 -= barHeight;
            if(i==this.data.length - 1){
                y1 = -chartHeight;
            }
            
            context.strokeStyle = this.chartLineStrokeStyle;
            context.lineWidth = this.chartLineWidth;
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
                        
            
            // Draw the label:
            
            context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
            if(this.colors[i]){
                context.fillStyle = this.colors[i];
            }else{
                context.fillStyle = this.labelFillStyle;
            }
            context.textAlign = 'center';
            if(this.labels[indices[i]]){
                if(this.data[indices[i]]>=0){
                    context.textBaseline = 'bottom';
                    context.fillText(this.labels[indices[i]], x + halfBarWidth, - barHeight - this.labelMargin, barWidth);
                }else{
                    context.textBaseline = 'top';
                    context.fillText(this.labels[indices[i]], x + halfBarWidth, - barHeight + this.labelMargin, barWidth);
                }
            }
            
            // Draw the data value:
            
            context.font = this.dataValueFontStyle + ' ' + this.dataValueFontHeight + 'px '+ this.dataValueFont;
            context.fillStyle = this.dataValueFillStyle;
            context.textAlign = 'center';
            if(this.data[indices[i]]>=0){
                context.textBaseline = 'bottom';
                context.fillText(this.data[indices[i]], x + halfBarWidth, - barHeight - this.labelMargin - this.dataValueMargin, barWidth);
            }else{
                context.textBaseline = 'top';
                context.fillText(this.data[indices[i]], x + halfBarWidth, - barHeight + this.labelMargin + this.dataValueMargin, barWidth);
            }
            
            // Update x:
            x = x + barWidth;
        }
        
        // Draw the points:
        
        x = this.barHGap;
        x1 = x;
        y1 = 0;
        x2 = 0;
        y2 = 0;
        
        context.fillStyle = this.chartPointFillStyle;
        context.beginPath();
        context.arc(x1, y1, this.chartPointRadius, 0, 2*Math.PI, false);
        context.fill();
        
        for(var i=0; i<this.data.length; i++){
            barHeight = this.data[indices[i]] * chartHeight / dataSum;
            x2 = x1;
            y2 = y1;
            x1 = x + barWidth;
            y1 -= barHeight;
            if(i==this.data.length - 1){
                y1 = -chartHeight;
            }
            
            context.fillStyle = this.chartPointFillStyle;
            context.beginPath();
            context.arc(x1, y1, this.chartPointRadius, 0, 2*Math.PI, false);
            context.fill();
            x = x + barWidth;
        }
        
        context.restore();
        
        // Draw the chart's border:
        context.lineWidth = this.chartBorderLineWidth;
        context.strokeStyle = this.chartBorderStrokeStyle;
        context.strokeRect(0,0,chartWidth,chartHeight);
        
        context.restore();
    }
    
    this.drawStackedColumnChart = function(){
        var context = this.ctx;
        var numCols = this.data.length;
		
        var colWidth = (this.width - this.marginLeft
            - this.marginRight - (numCols-1) * this.barHGap) / numCols;
                            
        var colMaxTopY = this.marginTop + this.dataValueMargin + this.dataValueFontHeight;
        
        var colMinTopY = this.height - this.marginBottom;
        
        if(this.title){
            colMaxTopY += this.titleFontHeight + this.titleMargin;
        }
        
        var colBottomY = this.height - this.marginBottom;
        
        if(this.chartData.min < 0){
            colMinTopY = this.height - this.marginBottom - this.dataValueMargin - this.dataValueFontHeight;
            colBottomY =  colMinTopY + (
				(this.height - this.marginBottom -  colMaxTopY - this.dataValueMargin - this.dataValueFontHeight) * 
					minData) / (Math.abs(this.chartData.min) + this.chartData.max);
        }
        
        var maxColHeight = Math.max(Math.abs(colBottomY - colMaxTopY), Math.abs(colBottomY - colMinTopY));
        var maxColAbsData = Math.max(Math.abs(this.chartData.min), Math.abs(this.chartData.max));
        
        var x = this.marginLeft;
        var y = colBottomY;
        var barHeight = 0;
                
        for(var i=0; i<this.data.length; i++){
            var colData = this.data[i];
            var totalColHeight = 0;
            for(var k=0; k<colData.length; k++){
                var segHeight = colData[k];
                
                totalColHeight = this.chartData.totals[i] * maxColHeight / maxColAbsData;
                var thisSegHeight = totalColHeight * (segHeight / this.chartData.totals[i]);

                //Draw the column segments:
                drawRectangle(this.colors[k], x, y, thisSegHeight, colWidth);
                
                y = y - thisSegHeight;
            }
            
            //Draw the data value for the stacked column total
            context.font = this.dataCtxStyle;
            context.fillStyle = this.dataValueFillStyle;
            context.textAlign = 'center';
            if(this.chartData.totals[i] >= 0){
                context.textBaseline = 'bottom';
                context.fillText(
                    this.chartData.totals[i].toFixed(this.numberOfDecimals), 
                    x + colWidth/2, 
                    colBottomY - totalColHeight - this.dataValueMargin, 
                    colWidth);
            }else{
                context.textBaseline = 'top';
                context.fillText(
                    this.chartData.totals[i].toFixed(this.numberOfDecimals), 
                    x + colWidth/2, 
                    colBottomY - totalColHeight + this.dataValueMargin, 
                    colWidth);
            }

            x = x + colWidth + this.barHGap;
            y = colBottomY;
        }
    }
    

    this.drawLineChart = function(){

        var context = this.ctx;
        var numCols = this.data.length;
        
        var maxData = this.chartData.max;
        var minData = this.chartData.min;
        
        var yAxisValues = new Array();
        var yValueStep = ((maxData - minData) / 8);
        
        context.save();
        
        var yAxisMin = minData - yValueStep;
        var yAxisMax = minData + 9 * yValueStep;

        // Find the widest Y-axis value's width:
        context.font = this.labelCtxStyle;
        var yAxisLabelWidth = Math.max(context.measureText(roundDigit((yAxisMax - yAxisMin)/10, yAxisMin)).width, context.measureText(roundDigit((yAxisMax - yAxisMin)/10, yAxisMax)).width);
        
        // Calculate the chart size and position:
        var chartWidth = this.width - this.marginLeft - this.marginRight - this.chartMarkerSize - yAxisLabelWidth - this.yAxisLabelMargin;
        var chartHeight = this.height - this.marginTop - this.marginBottom;
        
        var chartTopLeftX = this.marginLeft + this.chartMarkerSize + yAxisLabelWidth + this.yAxisLabelMargin;
        var chartTopLeftY = this.marginTop;
        
        if(this.title){
            chartHeight -= this.titleFontHeight + this.titleMargin;
            chartTopLeftY += this.titleFontHeight + this.titleMargin;
        }

        var yStep = chartHeight / 10;
        drawBackground(yAxisMin, yAxisMax, chartTopLeftX, chartTopLeftY, chartWidth, chartHeight);
        
        //
        // Draw data
        //
        var xStep = parseInt(chartWidth / (this.data.length));
        var yPerUnitValue = yStep / yValueStep;
        var x1 = 0;
        var y1 = 0;
        var x2 = parseInt(-xStep/2);
        var y2 = 0;
        
        for(var i=0; i<this.data.length; i++){
            x1 = x2;
            y1 = y2;
            x2 += xStep;
            y2 = parseInt((yAxisMax - this.data[i]) * yPerUnitValue);
            if (i > 0) {
                context.save();
                context.shadowOffsetX = this.barShadowOffsetX;
                context.shadowOffsetY = this.barShadowOffsetY;
                context.shadowBlur = this.barShadowBlur;
                context.shadowColor = this.barShadowColor;

                context.strokeStyle = this.chartLineStrokeStyle;
                context.lineWidth = this.chartLineWidth;
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
                
                context.restore();
            }
            // Draw the points;
            context.fillStyle = this.chartPointFillStyle;
            context.beginPath();
            context.arc(x2, y2, this.chartPointRadius, 0, 2*Math.PI, false);
            context.fill();
            context.stroke();
            
            // Draw the data label:
            context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
            if(this.colors[i]){
                context.fillStyle = this.colors[i];
            }else{
                context.fillStyle = this.labelFillStyle;
            }
            context.textAlign = 'center';
            if(this.labels[i]){
                if(this.data[i]>=0){
                    context.textBaseline = 'bottom';
                    context.fillText(this.labels[i], x2, y2 - this.labelMargin, xStep);
                }else{
                    context.textBaseline = 'top';
                    context.fillText(this.labels[i], x2, y2 + this.labelMargin, xStep);
                }
            }
            
            // Draw the data value:
            context.font = this.dataFontStyle + ' ' + this.dataFontHeight + 'px ' + this.dataFont;
            context.fillStyle = this.dataValueFillStyle;
            context.textAlign = 'center';
            if(this.data[i]>=0){
                context.textBaseline = 'bottom';
                context.fillText(this.data[i], x2, y2 - this.labelMargin - this.dataValueMargin, xStep);
            }else{
                context.textBaseline = 'top';
                context.fillText(this.data[i], x2, y2 + this.labelMargin + this.dataValueMargin, xStep);
            }
            
        }
        
        // Draw the chart's border:
        context.lineWidth = this.chartBorderLineWidth;
        context.strokeStyle = this.chartBorderStrokeStyle;
        context.strokeRect(0,0,chartWidth,chartHeight);

        context.restore();
    }
    
    function maxTextWidth(text, fontStyle) {
        that.ctx.font = fontStyle;
        var maxWidth = 0;
        var textWidth = 0;
        for(var i=0; i < text.length; i++){
            textWidth = that.ctx.measureText(text[i]).width;
            if(textWidth > maxWidth){
                maxWidth = textWidth;
            }
        }
        return maxWidth;
    }
    
    function drawRectangle(fill, x, y, height, width) {
        that.ctx.fillStyle = fill;
        that.ctx.strokeStyle = that.barStrokeStyle;
        that.ctx.lineWidth = that.barBorderWidth;
        
        that.ctx.beginPath();
        that.ctx.moveTo(x, y);
        that.ctx.lineTo(x, y - height);
        that.ctx.lineTo(x + width, y - height);
        that.ctx.lineTo(x + width, y);

        that.ctx.save();
        that.ctx.shadowOffsetX = that.barShadowOffsetX;
        that.ctx.shadowOffsetY = that.barShadowOffsetY;
        that.ctx.shadowBlur = that.barShadowBlur;
        that.ctx.shadowColor = that.barShadowColor;
        
        that.ctx.fill();
        that.ctx.restore();
        that.ctx.stroke();
    }
    
    function roundDigit(base, target) {
	      var digit = Math.round(Math.log(base) / Math.LN10);
        var rounded = Math.round(target / Math.pow(10, digit - 1)) * Math.pow(10, digit - 1);
        if (digit < 1) {
            rounded = rounded.toFixed( -1*(digit - 1));
        }
        return rounded;
    }
    
    function drawBackground(minDataVal, maxDataVal, chartTopLeftX, chartTopLeftY, chartWidth, chartHeight) {
        var context = that.ctx;
        minDataVal = 1 * minDataVal;
        maxDataVal = 1 * maxDataVal;
        
        context.translate(chartTopLeftX, chartTopLeftY);
        
        context.fillStyle = that.chartBackgroundFillStyle;
        context.fillRect(0,0,chartWidth,chartHeight);

        // build the y axis labels
        var yAxisValues = new Array();
        var diffOfMaxMin = maxDataVal - minDataVal;

        for (var i = 0; i <= 10; i++) {
            yAxisValues.push(roundDigit(diffOfMaxMin/10, minDataVal + diffOfMaxMin * i/10));
        }
        
        // Draw the markers, horizontal lines, and axis' labels:
        var yStep = chartHeight / 10;
        var lineY = 0;
        
        context.lineWidth = that.chartHorizontalLineWidth;
        context.font = that.yAxisLabelFontStyle + ' ' + that.yAxisLabelFontHeight + 'px '+ that.yAxisLabelFont;
        
        for(var i=0; i<=10; i++){
            lineY = i*yStep;
            
            if( i>0 && i<10){
            
                context.strokeStyle = that.chartHorizontalLineStrokeStyle;
                context.beginPath();
                context.moveTo(0,lineY);
                context.lineTo(chartWidth,lineY);
                context.stroke();
            }
            
            context.strokeStyle = that.chartBorderStrokeStyle;
            context.beginPath();
            context.moveTo(-that.chartMarkerSize,lineY);
            context.lineTo(0,lineY);
            context.stroke();
            
            if (that.chartType == "pareto") {
                context.beginPath();
                context.moveTo(chartWidth,lineY);
                context.lineTo(chartWidth+that.chartMarkerSize,lineY);
                context.stroke();
            }
                
            context.fillStyle = that.yAxisLabelFillStyle;
            // label the left Y axis
            context.textAlign = 'right';
            context.textBaseline = 'middle';
            context.fillText(yAxisValues[10-i], -that.chartMarkerSize-that.yAxisLabelMargin, lineY);
            if (that.chartType == "pareto") {
                // label the right Y axis
                context.textAlign = 'left';
                context.fillText( ((10-i)*10)+'%', chartWidth+that.chartMarkerSize+that.yAxisLabelMargin, lineY);
            }
        }
    }
}

function ChartData(data) {
    this.totals = new Array();
    this.max = 0;
    this.min = 0;
    this.sum = 0;
    
    for (var i = 0; i < data.length; i++) {
        var total = 0;
        if (typeof(data[0]) == 'object') {
            var theData = data[i];
	          for (var j = 0; j < theData.length; j++) {
		            total += theData[j];
	          }
	          this.totals.push(total);
	          if (this.max == 0 || total > this.max) {
	              this.max = total;
		        }
            if (this.min == 0 || total < this.min) {
		            this.min = total;
		        }
        } else {
	          this.sum += data[i];
	      }
        if (this.max < data[i]) {
	          this.max = data[i];
        }
	      if (this.min > data[i]) {
            this.min = data[i];
        }
    }		
}

