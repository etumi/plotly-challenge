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
            textfont: {family: "Cambria"},
            marker: {color: sortedSample.otu_ids}
        }];

        var layout1 = {
            title: `Sample ${inputValue}'s Top 10 OTU's`,
            font: {family: "Cambria"}
        };

        Plotly.newPlot("h-plot", trace, layout1);
    });
};

buildBarPlot();

//d3.select("#subjectID").on("change", buildBarPlot);
// Build the bubble plot
function buildBubblePlot() {
    d3.json("samples.json").then(function(data){

        var samples = data.samples;

        var inputValue = d3.select("#subjectID").property("value");
        // console.log(inputValue);

        // Get object of the selected id
        var selectedSampleData = samples.filter(obj => obj.id === inputValue);
        console.log(selectedSampleData);

        var data = selectedSampleData.map(sample => {
            
            var trace = {
                mode: "markers",
                y: sample.sample_values,
                x: sample.otu_ids,
                text: sample.otu_labels,
                marker: {
                    color: sample.otu_ids,
                    size: sample.sample_values,
                    sizeref: 0.1,
                    //sizeref: 0.1 * Math.max(sample.sample_values) / (50**2),
                    sizemode: 'area'
                },
                textfont: {family: "Cambria"}
            };

            return trace;
        });

        console.log(data);

        var layout2 = {
            xaxis: {title: "OTU ID"},
            showlegend: false,
            title : `All OTUs for Sample ${inputValue}`,
            font: {family: "Cambria"}
        };

        Plotly.newPlot("bubble-plot", data, layout2);

    });
};

buildBubblePlot();

// build the gauge plot
function buildGuagePlot(){
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            //value: 3,
            title: { text: "Belly Button Washing Frequency",
                    align: "center",
                    font: {family: "Cambria"}
            },
            type: "indicator",
            mode: "gauge",
            text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
            gauge: {
                axis: { range: [0, 9]
                        // tickmode: "auto",
                        // tickvalue: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                        // ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
                        // ticks: "inside",
                        // ticklen: "2px",
                        // tickwidth: "2px",
                        // tickcolor: "#444",
                        // tickfont: {family: "Cambria"}
                        //nticks: 9
                },
                bordercolor: "f8f8ff",
                steps: [
                { range: [0, 1], color: "red", name: "0-1", "0-1": {enabled: true}},
                { range: [1, 2], color: "gray", name: "1-2"},
                { range: [2, 3], color: "blue", name: "2-3"},
                { range: [3, 4], color: "pink", name: "3-4"},
                { range: [4, 5], color: "yellow", name: "4-5"},
                { range: [5, 6], color: "purple", name: "5-6"},
                { range: [6, 7], color: "coral", name: "6-7"},
                { range: [7, 8], color: "lightgray", name: "7-8"},
                { range: [8, 9], color: "violet", name: "8-9"}
                ],
                threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 3
                }
            }
        }
    ];

    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    
    Plotly.newPlot('gauge-plot', data, layout);
};

// buildGuagePlot();


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
    buildBubblePlot();
};

d3.select("#subjectID").on("change", updateDashInfo);