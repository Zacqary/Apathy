var fpsElement = document.getElementById("fps");
var gpuElement = document.getElementById("gpu");
var dataElement = document.getElementById("dataTransfers");
var batchElement = document.getElementById("batchCount");
var minElement = document.getElementById("minBatch");
var maxElement = document.getElementById("maxBatch");
var avgElement = document.getElementById("avgBatch");

var lastFPS = "";
var lastGPU = "";
var lastData = "";
var lastBatch = "";
var lastMin = "";
var lastMax = "";
var lastAvg = "";

var nextUpdate = 0;
function displayPerformance(draw2D, graphicsDevice)
{
    currentTime = TurbulenzEngine.time;
    if (currentTime > nextUpdate)
    {
        nextUpdate = (currentTime + 0.1);

        var data = draw2D.performanceData;

        var fpsText = (graphicsDevice.fps).toFixed(2) + " fps";
        var gpuText = (data.gpuMemoryUsage / 1024).toFixed(2) + " KiB";
        var dataText  = (data.dataTransfers).toString();
        var batchText = (data.batchCount).toString();
        var minText = (data.batchCount === 0) ? "" : (data.minBatchSize + " sprites");
        var maxText = (data.batchCount === 0) ? "" : (data.maxBatchSize + " sprites");
        var avgText = (data.batchCount === 0) ? "" : (Math.round(data.avgBatchSize) + " sprites");

        if (fpsText !== lastFPS)
        {
            lastFPS = fpsText;
            fpsElement.innerHTML = fpsText;
        }
        if (gpuText !== lastGPU)
        {
            lastGPU = gpuText;
            gpuElement.innerHTML = gpuText;
        }

        if (dataText !== lastData)
        {
            lastData = dataText;
            dataElement.innerHTML = dataText;
        }
        if (batchText !== lastBatch)
        {
            lastBatch = batchText;
            batchElement.innerHTML = batchText;
        }
        if (minText !== lastMin)
        {
            lastMin = minText;
            minElement.innerHTML = minText;
        }
        if (maxText !== lastMax)
        {
            lastMax = maxText;
            maxElement.innerHTML = maxText;
        }
        if (avgText !== lastAvg)
        {
            lastAvg = avgText;
            avgElement.innerHTML = avgText;
        }
    }
}
