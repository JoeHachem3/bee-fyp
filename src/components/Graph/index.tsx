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

const Graph = (props: GraphModel) => {
  props = new GraphModel(props);

  const toggleVisibility = (dataKey: string) => {
    const lines = props.lines.slice();
    const line = lines.find((line) => line.key === dataKey);
    line.hide = !line.hide;
    props = { ...props, lines };
  };

  return (
    <div className={classes.graph}>
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
    </div>
  );
};

export default Graph;
