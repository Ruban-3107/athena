export function getPercentage(partialValue, totalValue) {
  if (partialValue === 0 || totalValue === 0) {
    return 0;
  }
  return Math.ceil((100 * partialValue) / totalValue);
}

export function getFilteredbyStatus(array, status) {
  const filteredArray = array.filter((x) => x.status === status);
  return filteredArray;
}

export function getSortedByPosition(array) {
  return array.sort((a, b) => a.position - b.position);
}

export function getFilteredbyMultipleStatus(array, filterStatus) {
  // const filteredArray = array.filter((x) => x.status == filterStatus);
  const filteredArray = array.filter((x) => filterStatus?.includes(x.status));
  return filteredArray;
}
