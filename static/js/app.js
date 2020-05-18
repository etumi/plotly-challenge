//Populate drop down menu with Sample ID numbers
function buildDropdown() {
    d3.json("samples.json").then(function(data){
        var samples = data.samples;

        var selector = d3.select("#subjectID")
        //console.log(selector);

        samples.forEach(sample => {
            selector.append("option").text(sample.id);
        });     
    });
};

buildDropdown();

// Read in belly buttn biodiversity data 
function buildBarPlot() {
    //var inputValue = d3.select("#subjectID").property("value");
    //console.log(`dropdown value ${inputValue}`);

    d3.json("samples.json").then(function(data){
        var samples = data.samples;

        var inputValue = d3.select("#subjectID").property("value");
        console.log(`dropdown value ${inputValue}`);

        // console.log("master dataset");
        // console.log(data);

        var selectedSampleData = samples.filter(obj => obj.id === inputValue);

        console.log(selectedSampleData);
        
        //console.log("samples dict from big data source")
        //console.log(samples);

        // Sort dataset
        var sortedSample = selectedSampleData.sort((first, second) =>  second.sample_values - first.sample_values);
        sortedSample = sortedSample[0];
        //console.log('sortedSample');
        //console.log(sortedSample);
        
        sortedSample['sample_values'] = sortedSample['sample_values'].slice(0,10).reverse();
        sortedSample['otu_ids'] = sortedSample['otu_ids'].slice(0, 10).reverse();
        sortedSample['otu_labels'] = sortedSample['otu_labels'].slice(0, 10).reverse();
        //console.log('sliced sortedSample');
        //console.log(sortedSample);

        //console.log("sample values");
        //console.log(sortedSample.sample_values);

        sortedSample['otu_ids_2'] = sortedSample['otu_ids'].map(id => `OTU ${id}`)
        //console.log("otu_ids");
        //console.log(sortedSample.otu_ids_2);

        var trace = [{
            type: "bar",
            orientation: "h",
            x: sortedSample.sample_values,
            y: sortedSample.otu_ids_2,
            text: sortedSample.otu_labels,
        }];

        var layout1 = {
            title: `Sample ${inputValue}'s Top 10 OTU's`
        };

        Plotly.newPlot("h-plot", trace, layout1);
    });
};

buildBarPlot();


function buildBubblePlot() {
    d3.json("samples.json").then(function(data){

        var samples = data.samples.slice(0,3);
        //console.log(samples);

        var data = samples.map(sample => {
            
            var trace = {
                mode: "markers",
                y: sample.sample_values,
                x: sample.otu_ids,
                text: sample.otu_labels,
                marker: {
                    color: sample.otu_ids,
                    size: sample.sample_values,
                    sizeref: 2
                    //sizeref: 2.0 * Math.max(sample.sample_values) / (2**2),
                    //sizemode: 'area'
                }
            };

            return trace;
        });

        var layout2 = {
            xaxis: {title: "OTU ID"},
            showlegend: false
        };

        Plotly.newPlot("marker-plot", data, layout2);

    });
};

buildBubblePlot();

d3.select("#subjectID").on("change", buildBarPlot);