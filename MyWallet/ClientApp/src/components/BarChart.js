import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ props }) => {
    const chartRef = useRef(null);
    const myChartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const labels = props.map(item => item.month);
            const result = props.map(item => item.result);
            const ctx = chartRef.current.getContext('2d');

            // Destruir o gráfico anterior, se existir
            if (myChartRef.current) {
                myChartRef.current.destroy();
            }

            // Criar novo gráfico
            myChartRef.current = new Chart(ctx, {
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
        }
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
