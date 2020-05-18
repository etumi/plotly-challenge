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

//-----------------------------Plots----------------------------------------//
// Build the horizontal bar plot
function buildBarPlot() {
    d3.json("samples.json").then(function(data){
        var samples = data.samples;

        var inputValue = d3.select("#subjectID").property("value");
        // console.log(inputValue);

        // Get object of the selected id
        var selectedSampleData = samples.filter(obj => obj.id === inputValue);
        //console.log(selectedSampleData);

        // Sort dataset
        var sortedSample = selectedSampleData.sort((first, second) =>  second.sample_values - first.sample_values);
        sortedSample = sortedSample[0];
        
        // Select Top Ten OTUs
        sortedSample['sample_values'] = sortedSample['sample_values'].slice(0,10).reverse();
        sortedSample['otu_ids'] = sortedSample['otu_ids'].slice(0, 10).reverse();
        sortedSample['otu_labels'] = sortedSample['otu_labels'].slice(0, 10).reverse();

        // Add 'OTU' to otu_ids
        sortedSample['otu_ids_2'] = sortedSample['otu_ids'].map(id => `OTU ${id}`)

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

//d3.select("#subjectID").on("change", buildBarPlot);

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

//buildBubblePlot();
//-------------------------------------------------------------------------//

//--------------------------Demographics info-----------------------------//
var demoInfo = d3.select(".card-body");

function buildDemoInfo(){
    d3.json("samples.json").then(function(data){
        var metadata = data.metadata;
        //console.log(metadata);

        var inputValue = d3.select("#subjectID").property("value");
        //console.log(inputValue);

        // Get object of the selected id
        var selectedSampleData = metadata.filter(obj => obj.id === parseInt(inputValue));
        selectedSampleData = selectedSampleData[0];
        //console.log(selectedSampleData);

        demoInfo.html('');

        Object.entries(selectedSampleData).forEach(([key, value]) => {
            //console.log(key);
            //console.log(value);

            demoInfo.append("p")
                    .classed("card-text", true)
                    .text(`${key}: ${value}`);
        });


    });
};

buildDemoInfo();

//d3.select("#subjectID").on("change", updateDemoInfo);
//-------------------------------------------------------------------------//
//----------------------------Event Handler-------------------------------//

function updateDashInfo(){
    buildDemoInfo();
    buildBarPlot();
};

d3.select("#subjectID").on("change", updateDashInfo);