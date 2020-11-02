d3.csv('rounds.csv', d3.autoType).then((data) => {
  console.log('rounds.csv', data);

  const obj = {};
  data.forEach((element) => {
    const year = element['funded_year'];
    if (!year) return;
    if (obj[year] === undefined) {
      obj[year] = {};
    }
    const fundType = element['funding_round_type'];
    if (!obj[year][fundType]) {
      obj[year][fundType] = 0;
    }
    obj[year][fundType] += 1;
  });

  console.log('obj', obj);
  const keys = Object.keys(obj);
  console.log('keys', keys);

  /*
  0: "company_market"
1: "company_country_code"
2: "company_region"
3: "funding_round_type"
4: "funded_at"
5: "funded_month"
6: "funded_year"
7: " raised_amount_usd "
  */
});
