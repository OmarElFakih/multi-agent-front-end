import React from "react";
import { Bar } from "react-chartjs-2"
import {Chart as ChartJS} from "chart.js/auto"




function BarChart(props){
    ChartJS.defaults.backgroundColor = '#9BD0F5';
    return <Bar data={props.chartData} />;
}


export default BarChart