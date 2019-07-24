import { Progress } from 'antd';
import AntProgress from './style';
import WithDirection from '../../hoc/with-direction';

const WDProgress = AntProgress(Progress);
const isoProgress = WithDirection(WDProgress);

export default isoProgress;
