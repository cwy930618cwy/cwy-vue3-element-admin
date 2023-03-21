let data = [
    {
        id: 1,
        name: "有合同周期",
        children: [
            { id: 1, name: "1年以下" },
            { id: 2, name: "1年" },
            { id: 3, name: "2年" },
            { id: 4, name: "3年" },
            { id: 5, name: "5年" },
            { id: 6, name: "5年以上" },
        ],
    },
    {
        id: 2,
        name: "无合同周期",
        children: [],
    },
];

export function getPurchaseJSON() {
    return JSON.parse(JSON.stringify(data));
}
