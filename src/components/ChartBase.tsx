import { PatternLines } from '@visx/pattern';
import {
  AnimatedAnnotation,
  AnimatedAreaSeries,
  AnimatedAxis,
  AnnotationLineSubject,
  darkTheme,
  DataContext,
  Tooltip,
  XYChart,
} from '@visx/xychart';
import { useContext, useRef } from 'react';
import type { ChartBaseProps, DataPoint } from '../types';

const chartTheme = { ...darkTheme, colors: ['#fff'] };

const xAccessor = (d: DataPoint) => d[0];
const yAccessor = (d: DataPoint) => d[1];

export function ChartBase({
  data,
  xAxisLabel,
  yAxisLabel,
  xFormatter,
  yFormatter,
  annotateDataPoint,
  ariaLabel,
}: ChartBaseProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel || `Chart showing ${yAxisLabel} by ${xAxisLabel}`}
    >
      <XYChart
        theme={chartTheme}
        xScale={{ type: 'band' }}
        yScale={{ type: 'linear' }}
        margin={{ top: 20, right: 20, bottom: 50, left: 80 }}
        accessibilityLabel={ariaLabel || `${yAxisLabel} by ${xAxisLabel}`}
      >
      <CustomChartBackground />
      <AnimatedAxis
        orientation="left"
        label={yAxisLabel}
        labelOffset={40}
        numTicks={3}
        tickFormat={yFormatter}
      />
      <CustomBottomAxis label={xAxisLabel} tickFormat={xFormatter} />
      <AnimatedAreaSeries
        dataKey="default"
        data={data}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        strokeWidth={2}
        fillOpacity={0.4}
      />
      <Tooltip<DataPoint>
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        renderTooltip={({ tooltipData }) =>
          tooltipData?.nearestDatum && (
            <>
              <div>
                {xAxisLabel}: {xFormatter(tooltipData.nearestDatum.datum[0])}
              </div>
              <div>
                {yAxisLabel}: {yFormatter(tooltipData.nearestDatum.datum[1])}
              </div>
            </>
          )
        }
      />
      {annotateDataPoint && (
        <AnimatedAnnotation dataKey="default" datum={annotateDataPoint}>
          <AnnotationLineSubject orientation="vertical" />
        </AnimatedAnnotation>
      )}
    </XYChart>
    </div>
  );
}

function CustomBottomAxis({
  label,
  tickFormat,
}: {
  label: string;
  tickFormat: (x: number) => string;
}) {
  const { innerWidth } = useContext(DataContext);

  // early return values not available in context
  if (!innerWidth) return null;

  return (
    <AnimatedAxis
      orientation="bottom"
      label={label}
      numTicks={(innerWidth ?? 0) > 700 ? 6 : 3}
      tickFormat={tickFormat}
    />
  );
}

function CustomChartBackground() {
  const { theme, margin, width, height, innerWidth } = useContext(DataContext);

  const patternId = useRef(`${Math.random()}`);

  // early return values not available in context
  if (!width || !height || !margin || !theme || !innerWidth) return null;

  return (
    <>
      <PatternLines
        id={patternId.current}
        width={24}
        height={24}
        orientation={['diagonal']}
        stroke={theme?.gridStyles?.stroke}
        strokeWidth={1}
      />
      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={height - margin.top - margin.bottom}
        fill={`url(#${patternId.current})`}
        fillOpacity={0.3}
      />
    </>
  );
}
