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

        var layout = {
            title: "Top 10 OTU's"
        };

        Plotly.newPlot("h-plot", trace, layout);

    });
};

buildBarPlot();

// function buildBubblePlot() {
//     d3.json("samples.json").then(function(data){
//         var trace2 = [{
//             mode: "markers",
//             y: sortedSamples.sample_values,
//             x: sortedSamples.otu_ids,
//             text: sortedSamples.otu_labels,
//             marker: {
//                 color: sortedSamples.otu_ids,
//                 size: sortedSamples.sample_values
//             }
//         }];

//         var layout2 = {
//             xaxis: {title: "OTU ID"}
//         };

//         Plotly.newPlot("marker-plot", trace2, layout2);

//     });
// };

// buildBubblePlot()