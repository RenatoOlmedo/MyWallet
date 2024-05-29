import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ props }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const labels = props.map(item => item.Month);
        const result = props.map(item => item.Result);

        const ctx = chartRef.current.getContext('2d');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Lucro',
                    data: result,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [props]);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Desempenho no Período (R$)</h5>
                <canvas ref={chartRef} style={{ maxWidth: '100%', maxHeight: '300px' }}></canvas>
            </div>
        </div>
    );
};

export default BarChart;
