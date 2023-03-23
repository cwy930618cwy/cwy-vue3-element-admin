const data = [
  {
    id: '1',
    name: '公告'
  },
  {
    id: '2',
    name: '预告'
  },
  {
    id: '3',
    name: '变更'
  },
  {
    id: '4',
    name: '结果'
  },
  {
    id: '5',
    name: '其他'
  }
];

export function getPartyTypeJSON() {
  return JSON.parse(JSON.stringify(data));
}
