export default function stackProcessing(data, keys) {
  console.log('stackProcessing', data);

  const obj = {};
  data.forEach((e) => {
    const time = +e['funded_month'];
    const region = e['company_region'];
    if (keys.includes(region)) {
      if (!obj[time]) {
        obj[time] = {};
      }
      if (obj[time][region] !== undefined) {
        obj[time][region] += e['raised_amount_usd'];
      } else {
        obj[time][region] = 0;
      }
    }
  });

  const objKeys = Object.keys(obj);
  objKeys.forEach((key) => {
    obj[key]['time'] = parseInt(key);
  });

  const arr = [];
  objKeys.forEach((key) => {
    arr.push(obj[key]);
  });

  return arr;
}
