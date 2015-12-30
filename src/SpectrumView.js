var SpectrumView = (function (elementId, frequencyRange) {

    SpectrumView.version = "0.0.1";

    var containerWidth;
    var containerHeight;
    var graphBoundingBox;
    var snap;
    var highlights = [];

    function init(elementId) {
        var element, elementRef, snap;

        elementRef = '#' + elementId;
        element = $(elementRef);

        containerWidth = element.width();
        containerHeight = element.height();


        html = '<svg style="width: ' + element.width() + 'px; height: ' + element.height() + 'px;"/>';

        element.append(html);

        return Snap(elementRef + ' svg');
    }

    function drawSpectrum () {
        var snapPaper, frequencyRange;

        snapPaper = this.snap;
        if (!snapPaper) {
            snapPaper = snap;
        }

        frequencyRange = this.frequencyRange;
        if (!frequencyRange) {
             frequencyRange = frequencyRange;
        }


        snapPaper.rect(0,0, containerWidth, containerHeight).attr({
           'class': 'background',
           fill: 'white'
           });

        drawGraph(snapPaper, 40, 5, containerWidth, containerHeight - 10, frequencyRange);

    }

    function drawGraph (snap, x, y, width, height, range) {

        var markerXInterval = 100;
        var markerXCount = 10;

        displayFreqRange = range;
        middleLineY = height / 2;

        exponentAdjust = 0;
        var baseExp = Math.log10(range[0]);

    //     rangeLen = range[1] - range[0];
        if (range[0] === 0) {
             rangeLen = Math.log10(range[1]) - (-3);
             exponentAdjust = -3;
        } else {
             rangeLen = Math.log10(range[1]) - Math.log10(range[0]);
        }
//         console.log(rangeLen);

    //     rangeLen = range[1] - range[0];
        markerXInterval = width / markerXCount;

        var prevFrequencyTextBox, prevWavelengthTextBox;

        prevValue = -1

        graphBoundingBox = { x: x, y: y, width: width, height: height};

        highlightVisibleBand(snap, { x: x, y: y, width: width, height: height});

//         for (i=0; i<labelledBands.length; i++) {
//             highlight(snap, labelledBands[i].lf, labelledBands[i].uf, 'rgba(0,0,0,0.1)', undefined, labelledBands[i].text, 'labelledRange');
//         }

        var filter = undefined;//snap.filter(Snap.filter.invert(0.5));

        for (xOffset=0; xOffset <= width; xOffset++) {

             exponent = ((xOffset/width) * rangeLen) + baseExp;
             frequency = Math.pow(10,exponent + exponentAdjust);

             if (xOffset % markerXInterval === 0) {
             //if (exponent % 0.25 === 0) {
                  lineLen = 5;

                  frequencyLine = y + 25;
                  lineLen = 10;

                  var val = frequency + '';
                  var str =  Math.round(frequency, 2) + '';

                  str = Math.round(Math.log10(val),2);
                  str = SpectrumViewUtils.valueToMagnitude( frequency, 'Hz', 2);
                  //str = '10e' + Math.log10(frequency).toFixed(2);

                  text = snap.text((x + xOffset), frequencyLine - (lineLen + 5), str).attr({
                         'font-size': 10,
                         filter: filter
                     });
                  text.attr('x', (x + xOffset) - text.getBBox().width / 2);

                  if (text.getBBox().x < 0) {
                     text.remove();
                  } else if (prevFrequencyTextBox &&
                      (prevFrequencyTextBox.x + prevFrequencyTextBox.width) > text.getBBox().x) {
                      text.remove();
                  } else {
                     prevFrequencyTextBox = text.getBBox();
                     //lineLen = 10;
                  }

                  line = snap.line((x + xOffset), frequencyLine, (x + xOffset), frequencyLine - lineLen).attr({
                    'stroke': 'black',
                    'stroke-width': '1px'
                  });

            }
    //          console.log( frequencyToWavelength(frequency), Math.log10(frequencyToWavelength(frequency)), valueToMagnitude(frequencyToWavelength(frequency), 'm', 2) );

           if ((xOffset + (markerXInterval/2)) % markerXInterval === 0) {
    console.log(  Math.log10(SpectrumViewMath.frequencyToWavelength(frequency)) );
//               if (  parseFloat(Math.log10(SpectrumViewMath.frequencyToWavelength(frequency)).toFixed(2)) % 1 === 0 ) {
                  var str = SpectrumViewUtils.valueToMagnitude(
                       SpectrumViewMath.frequencyToWavelength(frequency), 'm', 2);

                  //str = '10e' + Math.log10(SpectrumViewMath.frequencyToWavelength(frequency)).toFixed(2);

                  wavelengthLine = height - 20;
                  lineLen = 10;

                  text = snap.text((x + xOffset), wavelengthLine + lineLen + 15, str).attr({
                         'font-size': 10
                     });
                  text.attr('x', (x + xOffset) - text.getBBox().width / 2);

                  if (text.getBBox().x < 0) {
                     text.remove();
                  } else if (prevWavelengthTextBox &&
                      (prevWavelengthTextBox.x + prevWavelengthTextBox.width) > text.getBBox().x) {
                      text.remove();
                  } else {
                     prevWavelengthTextBox = text.getBBox();
                     lineLen = 10;
                  }

                  line = snap.line((x + xOffset), wavelengthLine, (x + xOffset), wavelengthLine + lineLen).attr({
                    'stroke': 'black',
                    'stroke-width': '1px'
                  });
            }

    //         if (frequencyToWavelength(
            prevValue = (xOffset/width) * rangeLen;
        }


    }

    function highlightDisplayedRange(startFreq, endFreq) {
        highlight(snap, startFreq, endFreq, 'rgba(240,240,100,0.5)', '', 'selected range', 'regulatedspectrum', 'filteredRangeRect',

        {
                x: graphBoundingBox.x,
                y: graphBoundingBox.y + 26,
                width: graphBoundingBox.width,
                height: graphBoundingBox.height - 52
             });
    }


    function highlightVisibleBand(snap, boundingRect) {
        var gradient, start, end, x1, x2;

        start = 4.0 * Math.pow(10, 14);
        end = 7.9 * Math.pow(10, 14);

        gradient = snap.gradient('l(0, 0, 1, 0)red-orange-yellow-green-blue-indigo-violet');
        highlight(snap, start, end, gradient, '', 'visible spectrum', undefined, undefined, boundingRect);
    }


    function highlight(snap, startFreq, endFreq, color, text, title, cssClass, elementId, boundingBox) {
        var textElem, height, width, text, x1, x2, scale, rect;
        var leftOffset = 0;

// console.log(boundingBox, graphBoundingBox, displayFreqRange);
        if (!boundingBox) {
            boundingBox = graphBoundingBox;
        }

        if ( startFreq > displayFreqRange[1] || endFreq < displayFreqRange[0] ) {
            return;
        }


        if ( endFreq < startFreq ) {
            if (rect) {
                rect.hide();
            }
            return;
        }

        if (startFreq < displayFreqRange[0]) {
            startFreq = displayFreqRange[0];
        }

        if (endFreq > displayFreqRange[1]) {
            endFreq = displayFreqRange[1];
        }

        scale = boundingBox.width / (Math.log10(displayFreqRange[1]) - Math.log10(displayFreqRange[0]));
    //     scale = containerWidth / (displayFreqRange[1] - displayFreqRange[0]);

        x1 = (Math.log10(startFreq)) - (Math.log10(displayFreqRange[0]));
        x1 = (x1 * scale) + boundingBox.x;


        x2 = (Math.log10(endFreq)) - (Math.log10(displayFreqRange[0]));
        x2 = (x2 * scale) + boundingBox.x;


        height = boundingBox.height;

        width = (x2 - x1);

        if (Snap.select('#'+elementId)) {
             Snap.select('#'+elementId).attr({
                x: x1,
                y: boundingBox.y,
                width: width,
                height: height
             });
        } else {
       //  console.log(x1, boundingBox.y, width, height, startFreq, endFreq, boundingBox.x, scale);
            rect = snap.rect(x1, boundingBox.y, width, height);

            rect.attr("fill", color);
            rect.attr("stroke", color);
            rect.attr('title', title);

            if (cssClass && cssClass.trim().length > 0) {
                rect.addClass(cssClass);
            }

            if (elementId && elementId.trim().length > 0) {
                rect.attr('id',elementId);
            }

            if (title) {
                rect.append(Snap.parse('<title>' + title + '</title>'));
            }
        }




        return rect;
    }

    function addImagePattern(imageId, imageUrl, boundingRect) {
        if (!boundingRect) {
            boundingRect = {
               x: 0,
               y: 0,
               width: '100%',
               height: '100%'
            };
        }

        snap.image(imageUrl, boundingRect.x, boundingRect.y, boundingRect.width, boundingRect.height).toPattern()
           .attr({
           'id': imageId
           }).toDefs();
    }


    function changeDisplayedRange(frequencyRangeHz) {
    console.log('--', this.frequencyRange);
        frequencyRange = frequencyRangeHz;
        this.frequencyRange = frequencyRangeHz;
        this.snap.clear();
        console.log('11', this.snap, snap);
        this.drawSpectrum(this.snap);
 //        addImagePattern('pattern1', 'http://images6.alphacoders.com/362/362142.jpg');
//         this.addImagePattern('pattern2', 'img/background1.png');
    }

    this.frequencyRange = frequencyRange;

    snap = init(elementId);


//     addImagePattern('pattern1', 'http://images6.alphacoders.com/362/362142.jpg');
//     addImagePattern('pattern2', 'img/background1.png');

    // snap.image('http://images6.alphacoders.com/362/362142.jpg',0,0,'100%','100%').toPattern()
//        .attr({
//        'id': 'pattern1'
//        }).toDefs();

//     snap.image('http://static.tumblr.com/c92d81ec0f80b635611321e1ff5bfcb9/ttjoexs/wQdnr5awy/tumblr_static_8n4rhpkmu9wk84gk04s44cow4.png',0,0,'100%','100%').toPattern()
//        .attr({
//        'id': 'pattern2'
//        }).toDefs();


    // <pattern id="image" x="0%" y="0%" height="100%" width="100%"
//              viewBox="0 0 512 512">
//       <image x="0%" y="0%" width="512" height="512" xlink:href="https://cdn3.iconfinder.com/data/icons/people-professions/512/Baby-512.png"></image>
//     </pattern>

    SpectrumView.prototype.highlightDisplayedRange = highlightDisplayedRange;
    SpectrumView.prototype.snap = snap;
    SpectrumView.prototype.containerWidth = 900;
    SpectrumView.prototype.containerHeight = 90;
    SpectrumView.prototype.frequencyRange = frequencyRange;
    SpectrumView.prototype.drawSpectrum = drawSpectrum;
    SpectrumView.prototype.changeRange = changeDisplayedRange;
    SpectrumView.prototype.addImagePattern = addImagePattern;

    var inset = 10;
    SpectrumView.prototype.graphBoundingBox = { x: 0 + inset, y: 0 + inset, width: containerWidth + (inset * 2), height: containerHeight + (inset * 2)}

    SpectrumView.prototype.drawSpectrum();


    return SpectrumView.prototype;
});