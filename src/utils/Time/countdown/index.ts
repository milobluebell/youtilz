import moment from 'moment';
import { uniTime, formattedCountdown } from './../aux';
import _ from 'lodash';

/**
* 
* @func   倒计时 (两个指定时间)
* @param  $startAt*  number(unix_time) 倒计时开始的时间
* @param  $endAt*    number(unix_time) 倒计时结束的时间
* @param  formatter  string
* @return            string
*/
// @desc 指定的是小于这个时间(s)的时候的展示格式
export const formatMap = {
  // 1小时以内
  [`${60 * 60}s`]: '{m}:{s}',
  // 24h以内
  [`${60 * 60 * 24}s`]: '{h}:{m}:{s}',
  // 大于24h，且小于72h
  [`${60 * 60 * 72}s`]: '{d}:{h}:{m}:{s}',
}
const countdown = ($startAt: number, $endAt: number, formatter?: string | object) => {
  const configuredFormat = (typeof formatter === 'string' ? { [`0s`]: formatter } : formatter) || formatMap;
  const startAt = moment(uniTime($startAt)), endAt = moment(uniTime($endAt));
  if (startAt.isSameOrBefore(endAt)) {
    const gutter = endAt.diff(startAt);
    const mapKeysNums = _.sortBy(Object.keys(configuredFormat).map(item => {
      const boundaryTime = parseInt(item.replace(/[^0-9]/g, ''));
      return boundaryTime;
    }));
    let rangeIndex = _.findIndex(mapKeysNums, item => (item * 1000 >= gutter));
    const keyFlag = `${rangeIndex > -1 ? mapKeysNums[rangeIndex] : mapKeysNums[mapKeysNums.length - 1]}s`;
    const theFormat = configuredFormat[keyFlag];
    return formattedCountdown(gutter, theFormat);
  } else throw new Error('start time should be earlier, but end time was');
}

export default countdown;