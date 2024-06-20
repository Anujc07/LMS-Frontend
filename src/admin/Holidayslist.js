import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

function Holidayslist() {

    useEffect(() => {
        // Line Chart
        const lineChartCanvas = document.getElementById('lineChart');
        const lineChartColors = ['rgba(0, 123, 255, 0.2)', 'rgba(0, 123, 255, 1)', 'rgba(40, 167, 69, 0.2)', 'rgba(40, 167, 69, 1)']; // Example colors
        if (lineChartCanvas) {
            // Check if a chart already exists and destroy it
            if (lineChartCanvas.chart) {
                lineChartCanvas.chart.destroy();
            }
            const lineChartCtx = lineChartCanvas.getContext('2d');
            lineChartCanvas.chart = new Chart(lineChartCtx, {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: 'Line Chart Data',
                        backgroundColor: lineChartColors[0],
                        borderColor: lineChartColors[1],
                        borderWidth: 1,
                        data: [20, 89, 80, 81, 56, 55, 40],
                    }]
                },
                options: {
                    // Add your options here
                }
            });
        }
    
        // Bar Chart
        // Repeat the same process for the bar chart...
    
    }, []);
    

    return (
        <div className="row">
            <div className="col-xl-6">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title mb-0">Line Chart</h4>
                    </div>
                    <div className="card-body">
                        <canvas id="lineChart" className="chartjs-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Holidayslist;
