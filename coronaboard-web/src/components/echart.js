import React, { useEffect, useRef } from "react";
import * as echarts from 'echarts';
import { css } from '@emotion/react';

/*
 * @description: Refactoring
 * 1. css 공통 부분 추출
 * 2. 개별 화면에서 Echart 수정 부분이 있으면 덮어쓴다.
 *    개별화면에 수정사항 발생시 wrapperCss= jsx양식 object로 요소 선언한다.{{}}
 * 3. 원본의 정렬 및 화면 잘림 수정, 
 *     Card.Body: 
 *         왼쪽정렬 -> 중앙정렬
 *         화면 작아졌을 때 화면이 잘림 -> 횡스크롤 생성
 */
const commonWrapperCss = css`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  overflow-x: auto;
`;

export function Echart(props) {
    const { wrapperCss, option } = props;
    const chartRef = useRef(null);
    
    const finalWrapperCss = wrapperCss ? { ...commonWrapperCss, ...css(wrapperCss) } : commonWrapperCss;

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);
        chartInstance.setOption(option);
        
        return () => {
            chartInstance.dispose();
        };
    }, [option]);

    return <div css={finalWrapperCss} ref={chartRef} />;
}