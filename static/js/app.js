// Read in belly buttn biodiversity data 
function buildBarPlot() {
    d3.json("samples.json").then(function(data){
        // console.log(data);
        var data_samples = data.samples;
        console.log(data_samples);

        // Sort dataset
        var data_samples_copy = data_samples;
        console.log(data_samples_copy);
        var test = [data_samples[0]];
        console.log('test');
        console.log(test);
        //console.log(data.samples[0])
        var sortedSamples = test.sort((first, second) =>  second.sample_values - first.sample_values);
        sortedSamples = sortedSamples[0];
        console.log('sortedSamples');
        console.log(sortedSamples);

        
        sortedSamples['sample_values'] = sortedSamples['sample_values'].slice(0,10).reverse();
        sortedSamples['otu_ids'] = sortedSamples['otu_ids'].slice(0, 10).reverse();
        sortedSamples['otu_labels'] = sortedSamples['otu_labels'].slice(0, 10).reverse();
        console.log('sliced sortedSamples');
        console.log(sortedSamples);

        console.log("sample values");
        console.log(sortedSamples.sample_values);

        sortedSamples['otu_ids_2'] = sortedSamples['otu_ids'].map(id => `OTU ${id}`)
        console.log("otu_ids");
        console.log(sortedSamples.otu_ids_2);

        var trace = [{
            type: "bar",
            orientation: "h",
            x: sortedSamples.sample_values,
            y: sortedSamples.otu_ids_2,
            text: sortedSamples.otu_labels,
        }];

        var layout1 = {
            title: "Top 10 OTU's"
        };

        Plotly.newPlot("h-plot", trace, layout1);

    });
};

buildBarPlot();

function buildBubblePlot() {
    d3.json("samples.json").then(function(data){

        var data_samples = data.samples.slice(0,3);
        console.log(data_samples);

        var data = data_samples.map(sample => {
            
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

        console.log("data for bubble graphs");
        console.log(data);


        // var trace2 = [{
        //     mode: "markers",
        //     y: sortedSamples.sample_values,
        //     x: sortedSamples.otu_ids,
        //     text: sortedSamples.otu_labels,
        //     marker: {
        //         color: sortedSamples.otu_ids,
        //         size: sortedSamples.sample_values
        //     }
        // }];

        var layout2 = {
            xaxis: {title: "OTU ID"},
            showlegend: false
        };

        Plotly.newPlot("marker-plot", data, layout2);

    });
};

buildBubblePlot()