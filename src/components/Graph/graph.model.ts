import { BeeHiveDataModel } from '../../database/models';

const colors = ['#0099ff', '#00ff99', '#ff0099', '#ff9900'];
let counter = 0;

class GraphModel {
  data?: BeeHiveDataModel[];
  lines?: {
    key: string;
    color?: string;
    hide?: boolean;
  }[];
  xAxis?: string;
  startIndex?: number;
  endIndex?: number;

  constructor(props: GraphModel) {
    const lines = props.lines || [];
    lines.forEach((line) => {
      !line.color && (line.color = colors[counter++ % colors.length]);
      !line.hide && (line.hide = false);
    });

    return {
      data: props.data || [],
      lines,
      xAxis: props.xAxis || 'x',
      startIndex: props.startIndex || 0,
      endIndex: props.endIndex || (props.data ? props.data.length - 1 : 0),
    };
  }
}

export default GraphModel;
