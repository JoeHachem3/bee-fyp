import GraphModel from './graph.model';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { Typography } from '@mui/material';

import classes from './graph.module.css';
import { useState } from 'react';

const Graph = (props: GraphModel) => {
  props = new GraphModel(props);
  const [lines, setLines] = useState<typeof props.lines>(props.lines);

  const toggleVisibility = (dataKey: string) => {
    const tmpLines = lines.slice();
    const line = tmpLines.find((line) => line.key === dataKey);
    line.hide = !line.hide;
    setLines(tmpLines);
    props = { ...props, lines };
  };

  return (
    <div className={classes.graph}>
      {lines?.length ? (
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            width={500}
            height={500}
            data={[...props.data]}
            margin={{ right: 32 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={props.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend onClick={(e) => toggleVisibility(e.dataKey)} />
            {props.lines.map((line) => (
              <Line
                key={line.key}
                type='monotone'
                dataKey={line.key}
                stroke={line.color}
                hide={line.hide}
              />
            ))}
            <Brush startIndex={props.startIndex} endIndex={props.endIndex} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography color={'var(--color-text)'} variant='h6' component='h6'>
          No Data Available at the Moment.
        </Typography>
      )}
    </div>
  );
};

export default Graph;
