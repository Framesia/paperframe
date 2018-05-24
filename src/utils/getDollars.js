function getDollars(data) {
  const pendingPayout = data.pending_payout_value.split(" ")[0] * 1;
  if (pendingPayout) {
    return parseFloat(pendingPayout).toFixed(2);
  } else {
    const authorPayout = data.total_payout_value.split(" ")[0] * 1;
    const curatorPayout = data.curator_payout_value.split(" ")[0] * 1;
    return parseFloat(authorPayout + curatorPayout).toFixed(2);
  }
}

export default getDollars;
