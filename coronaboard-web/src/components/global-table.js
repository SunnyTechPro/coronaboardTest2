import React, { useState } from "react";
import { css } from '@emotion/react';
import { Chart } from 'react-google-charts';
import { formatDiffForTable, numberWithCommas } from '../utils/formatter';
import { Button } from 'react-bootstrap';

function compareConfirmed(x, y) {
    if (x.confirmed > y.confirmed) {
        return -1;
    } else if (x.confirmed < y.confirmed) {
        return 1;
    }
    return 0;
}

function generateDiffText(value, valuePrev, colorClassName) {
    return {
        v: value,
        f: `${numberWithCommas(value)}
            <br>
            <span class="diff ${colorClassName}>
                ${formatDiffForTable(value, valuePrev)}
            </span>
           `,
    };
}

export function GlobalTable(props) {
    const { countryByCc, globalStats } = props;

    const [isShowAll, setIsShowAll] = useState(false);
    const [additionalCount, setAdditionalCount] = useState(0);

    const globalStatsSorted = globalStats.sort(compareConfirmed);
    const rows = globalStatsSorted.map((x) => {
        const country = countryByCc[x.cc];
        const countryName = country.title_ko + country.flag;
        const deathRateText = 
            x.death === 0 ? '-' : ((x.death / x.confirmed) * 100).toFixed(1);

        return [
            {
                v: x.cc,
                f: countryName,
            },
            generateDiffText(x.confirmed, x.confirmedPrev, 'red'),
            generateDiffText(x.death, x.deathPrev, 'red'),
            generateDiffText(x.released, x.releasedPrev, 'green'),
            {
                v: x.death / x.confirmed,
                f: deathRateText,
            }
        ];
    });
    const header = [
        { type: "string", label: "국가" },
        { type: "number", label: "확진자" },
        { type: "number", label: "사망자" },
        { type: "number", label: "격리해제" },
        { type: "number", label: "치명(%)" },
    ]

    const tableData = [
        header, 
        ...(
            isShowAll ? rows : rows.slice(0, 20 + additionalCount)
        )
    ];

    /*
     * @description: Refactoring
     * 1. 버튼 추가: 기존 코드에서는 전체보기 버튼만 지원하여 기능 추가함
     *     20개 더보기: 클릭시 20개 국가를 더 보여준다
     *     20개 국가 접기: 클릭시 20개 국가를 덜 보여준다
     *     최소화: 초기값을 보여준다.
     */
    const showMore = () => setAdditionalCount(additionalCount + 20);
    const showLess = () => setAdditionalCount(additionalCount >= 40 ? additionalCount - 20 : 0);
    const showAll = () => {
        setIsShowAll(true);
        setAdditionalCount(0);
    };
    const minimize = () => {
        setIsShowAll(false);
        setAdditionalCount(0);
    };

    return (
        <div
            css={css`
                max-width: 640px;
                margin: 20px auto;
                
                .diff.green {
                    color: green;
                }

                .diff.red {
                    color: red;
                }

                .google-visualization-table-tr-head th {
                    background-image: none;
                    background-color: #f8f9fa;
                    padding: 14px 4px;
                    border-bottom: 2px solid #dee2e6;
                }

                .google-visualization-table-td {
                    vertical-align: top;
                }

                button {
                    display: block;
                    width: 100%;
                    margin-top: 8px;
                    border-radius: 0;
                }
            `}
        >
            <Chart
                chartType="Table"
                loader={ <div>로딩 중</div> }
                data={ tableData }
                options={{
                    showRowNumber: true,
                    width: '100%',
                    height: '100%',
                    allowHtml: true,
                    cssClassNames: {},
                }}
            />
           <>
                { !isShowAll ? (
                    <div className="d-flex justify-content-center">
                        <Button
                            css={css`
                                margin-right: 20px;
                            `}
                            variant="outline-primary"
                            onClick={showMore}
                        >
                            20국가 더보기
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={showAll}
                        >
                            전체 보기
                        </Button>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="danger"
                            onClick={minimize}
                        >
                            최소화
                        </Button>
                    </div>
                )}

                { additionalCount > 0 && !isShowAll && (
                    <div className="d-flex justify-content-center mt-2">
                        <Button
                            css={css`
                                margin-right: 20px;
                            `}
                            variant="warning"
                            onClick={showLess}
                        >
                            20개 국가 접기
                        </Button>
                        <Button
                            variant="danger"
                            onClick={minimize}
                        >
                            최소화
                        </Button>
                    </div>
                )}
            </>
        </div>
    )
} 

