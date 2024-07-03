import React, { useEffect, useState } from "react";
import { convertToMonthDay, numberWithUnitFormatter } from '../../utils/formatter';
import { Echart } from '../echart';
import { Card } from "react-bootstrap";
import { colors } from '../../config';

export function KoreaTestChart(props) {
    const { koreaTestChartData } = props;
    const chartOption = generateChartOption(koreaTestChartData);
 
    return (
        <Card>
            <Card.Body>
                <Echart
                    option={chartOption}
                />
            </Card.Body>
        </Card>
    );
}

function generateChartOption(data) {
    const series = [
        {
            name: '검사중',
            type: 'bar',
            data: data.testing,
            color: colors.testing,
            stack: 'barData',
        },
        {
            name: '누적음성',
            type: 'bar',
            data: data.negative,
            color: colors.negative,
            stack: 'barData',
        },
        {
            name: '누적확진',
            type: 'bar',
            data: data.confirmed,
            color: colors.confirmed,
            stack: 'barData',
        },
        {
            name: '누적확진율',
            type: 'line',
            data: data.confirmedRate.map((x) => (x * 100).toFixed(2)),
            color: colors.released,
            yAxisIndex: 1,
        },
    ];

    /*
     * @description: Refactoring
     * 1. 횡스크롤 생성으로 인한 text 잘림현상 해결
     *     title에 top요소 추가
     */
    return {
        animation: false,
        title: {
            text: '대한민국 검사 현황',
            left: 'center',
            top: '20px',
        },
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            top: 70,
            left: 55,
            right: 35,
            bottom: 100, 
        },
        legend: {
            data: series.map((x) => x.name),
            bottom: 50,
        },
        xAxis: {
            data: data.date.map(convertToMonthDay),
        },
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    roatete: 30,
                    formatter: numberWithUnitFormatter,
                },
            },
            {
                right: 10,
                type: 'value',
                max: (value) => {
                    return Math.round(value.max) + 1;
                },
                axisLabel: {
                    formatter: (value) => {
                        return value + '%';
                    },
                },
            },
        ],
        dataZoom: [
            {
                type: 'slider',
                show: true,
                start: 30,
                end: 100, 
            },
        ],
        series,
    }
}