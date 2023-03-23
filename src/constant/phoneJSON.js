const data = [
  {
    id: '1',
    name: '有招标联系电话'
  },
  {
    id: '2',
    name: '有中标联系电话'
  }
];

export function getPartyTypeJSON() {
  return JSON.parse(JSON.stringify(data));
}
