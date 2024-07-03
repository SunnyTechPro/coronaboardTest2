import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Chart } from 'react-google-charts';

export default function GoogleGeoChart() {
    // const data = [
    //     ["Country", "Confirmed"],
    //     ["United States", 34321093],
    //     ["India", 29506328],
    //     ["Brazil", 17413996],
    //     ["France", 5740665],
    //     ["Turkey", 5330447],
    // ];

    const data = [
        ["City", "City", "확진자", "사망자"],
        ["KR-11", "서울", 47695, 507],
        ["KR-26", "부산", 6034, 124],
        ["KR-27", "대구", 10517, 222],
    ];

    const options = {
        colorAxis: { minValue: 0, maxValue: 50000, colors: ['skyblue', 'purple'] },
        region: 'KR',
        resolution: 'provinces',
    }

    return (
        <Container>
            <Chart 
                chartType="GeoChart"
                width="100%"
                height="100%"
                data={data}
                options={options}
            />
        </Container>
    )
}