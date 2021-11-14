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

import classes from './graph.module.css';
import { useEffect, useState } from 'react';

const Graph = (props: GraphModel) => {
  const [propState, setPropState] = useState<GraphModel>(new GraphModel({}));

  useEffect(() => {
    setPropState(new GraphModel(props));
  }, [props]);
  const toggleVisibility = (dataKey: string) => {
    const lines = propState.lines.slice();
    const line = lines.find((line) => line.key === dataKey);
    line.hide = !line.hide;
    setPropState({ ...propState, lines });
  };

  return (
    <div className={classes.graph}>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          width={500}
          height={500}
          data={[...propState.data]}
          margin={{ right: 32 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey={propState.xAxis} />
          <YAxis />
          <Tooltip />
          <Legend onClick={(e) => toggleVisibility(e.dataKey)} />
          {propState.lines.map((line) => (
            <Line
              key={line.key}
              type='monotone'
              dataKey={line.key}
              stroke={line.color}
              hide={line.hide}
            />
          ))}
          <Brush
            startIndex={propState.startIndex}
            endIndex={propState.endIndex}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
