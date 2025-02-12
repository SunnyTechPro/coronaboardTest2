import React, { useState } from "react";
import { numberWithCommas, numberWithUnitFormatter } from '../../utils/formatter';
import { Echart } from '../echart';
import { colors } from "../../config";
import { Button, ButtonGroup, Card } from "react-bootstrap";

export function KoreaByAgeChart(props) {
    const { koreaByAgeChartData } = props;
    const [dataType, setDataType] = useState('confirmed');
    const chartOption = generateChartOption(koreaByAgeChartData, dataType);

    return (
        <Card>
            <Card.Body>
                <Echart
                    option={chartOption}
                />
                <ButtonGroup size="md">
                    <Button
                        variant="outline-primary"
                        active={dataType === 'confirmed'}
                        onClick={() => setDataType('confirmed')}
                    >
                        확진자
                    </Button>
                    <Button
                        variant="outline-primary"
                        active={dataType === 'death'}
                        onClick={() => setDataType('death')}
                    >
                        사망자
                    </Button>
                </ButtonGroup>
            </Card.Body>
        </Card>
    )
}

function generateChartOption(data, dataType) {
    const textByDataType = { confirmed: '확진자', death: '사망자' };
    const textByAge = {
        0: '0-9세',
        10: '10대',
        20: '20대',
        30: '30대',
        40: '40대',
        50: '50대',
        60: '60대',
        70: '70대',
        80: '80대 이상',
    }

    const ageKeys = Object.keys(data)
    const ageChartData = ageKeys.map((ageKey) => data[ageKey][dataType]);
    const total = ageChartData.reduce((acc, x) => acc + x, 0)

    const series = [
        {
            color: colors[dataType],
            type: 'bar',
            label: {
                show: true,
                position: 'inside',
                formatter: (obj) => {
                    const percent = ((obj.value / total) * 100).toFixed(1);
                    return `${obj.name} ${numberWithCommas(obj.value)}명 \n (${percent}%)`; 
                }
            },
            data: ageChartData,
        }
    ];

    return {
        animation: true,
        title: {
            text: '대한민국 연령별 확진자 현황',
            subtext: `총 ${textByDataType[dataType]} 수 ${numberWithCommas(total)}명`,
            left: 'center',
            top: '10px'
        },
        grid: {
            left: 40,
            right: 20,
            top: '60px',
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                rotate: 30,
                formatter: numberWithUnitFormatter,
            },
        },
        yAxis: {
            type: 'category',
            data: ageKeys.map((ageKey) => textByAge[ageKey]),
            axisLabel: {
                interval: 0,
                rotate: 30,
            },
        },
        series,
    }
}