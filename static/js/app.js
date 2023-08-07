 // Use the D3 library to read in samples.json from the URL
 const url ="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(({ names }) => {
 names.forEach((id) => {
   d3.select("select").append("option").text(id);
 });
 optionChanged();
});

const optionChanged = () => {
 let selectedValue = d3.select("select").property("value");

 d3.json(url).then(({ metadata, samples }) => {
   let meta = metadata.filter((s) => s.id == selectedValue)[0];
   let sample = samples.filter((obj) => obj.id == selectedValue)[0];

   d3.select(".panel-body").html("");
   Object.entries(meta).forEach(([key, val]) => {
     d3.select(".panel-body").append("h4").text(`${key.toUpperCase()}: ${val}`);
   });

   // Call the functions to update the charts with the new sample data
   createHorizontalBarChart(sample);
   createBubbleChart(sample);

   // Extract the washing frequency value from the metadata
   let washingFrequency = parseFloat(meta.wfreq);
   updateGaugeChart(washingFrequency);
 });
};

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
const createHorizontalBarChart = (sample) => {

   let top10SampleValues = sample.sample_values.slice(0, 10).reverse();
   let top10OTUids = sample.otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();
   let top10OTULabels = sample.otu_labels.slice(0, 10).reverse();

   let traceBar = {
     x: top10SampleValues,
     y: top10OTUids,
     text: top10OTULabels,
     type: "bar",
     orientation: "h",
   };

   let layoutBar = {
     title: `Top 10 OTUs ${sample.id}`,
     xaxis: { title: "Sample Values" },
     yaxis: { title: "OTU Id" },
   };

   let dataBar = [traceBar];

   Plotly.newPlot("bar", dataBar, layoutBar);
 };

 // Create a bubble chart that displays each sample.

 const createBubbleChart = (sample) => {
   let traceBubble = {
     x: sample.otu_ids,
     y: sample.sample_values,
     text: sample.otu_labels,
     mode: "markers",
     marker: {
       size: sample.sample_values,
       color: sample.otu_ids,
       colorscale: "Earth",
     },
   };

   let layoutBubble = {
     title: `Bubble Chart ${sample.id}`,
     xaxis: { title: "OTU IDs" },
     yaxis: { title: "Sample Values" },
   };

   let dataBubble = [traceBubble];

   Plotly.newPlot("bubble", dataBubble, layoutBubble);
 };

 // Create Gauge chart
 const updateGaugeChart = (washingFrequency) => {
    // Check if washingFrequency is a valid number, otherwise set it to 0
    const frequency = parseFloat(washingFrequency);
    const validFrequency = isNaN(frequency) ? 0 : frequency;
  
    // Calculate the angle for the gauge chart
   const level = validFrequency * 20;
   const degrees = 180 - level;
   const radius = 0.5;
   const radians = (degrees * Math.PI) / 180;
   const x = radius * Math.cos(radians);
   const y = radius * Math.sin(radians);
   let mainPath = "M -.0 -0.05 L .0 0.05 L ";
   let pathX = String(x);
   let space = " ";
   let pathY = String(y);
   let pathEnd = " Z";
   let path = mainPath.concat(pathX, space, pathY, pathEnd);

   // Create the gauge chart trace
   const traceGauge = [
     {
       type: "scatter",
       x: [0],
       y: [0],
       marker: { size: 12, color: "850000" },
       showlegend: false,
       name: "Freq",
       text: level,
       hoverinfo: "text+name"
     },
     {
       values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
       rotation: 90,
       text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
       textinfo: "text",
       textposition: "inside",
       marker: {
         colors: [
           "rgba(0, 105, 11, .5)",
           "rgba(10, 120, 22, .5)",
           "rgba(14, 127, 0, .5)",
           "rgba(110, 154, 22, .5)",
           "rgba(170, 202, 42, .5)",
           "rgba(202, 209, 95, .5)",
           "rgba(210, 206, 145, .5)",
           "rgba(232, 226, 202, .5)",
           "rgba(240, 230, 215, .5)",
           "rgba(255, 255, 255, 0)"
         ]
       },
       labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
       hoverinfo: "label",
       hole: 0.5,
       type: "pie",
       showlegend: false
     }
   ];
   // Create the layout for the gauge chart
   const layoutGauge = {
       title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
       
       height: 500,
       width: 500,
       
       xaxis: {
         zeroline: false,
         showticklabels: false,
         showgrid: false,
         range: [-1, 1],
       },
       yaxis: {
         zeroline: false,
         showticklabels: false,
         showgrid: false,
         range: [-1, 1],
       },
       shapes: [
         {
           type: "path",
           path: path,
           fillcolor: "850000",
           line: {
             color: "850000",
           },
         },
       ],
     };
     const GAUGE = document.getElementById("gauge");
     // Plot the gauge chart
     Plotly.newPlot(GAUGE, traceGauge, layoutGauge);
   };