import _ from "lodash";

//搜索删除对象中一些参数
export const searchDeleteParams = (params = {}) => {
    let objDeep = _.cloneDeep(params);
    for (let i in objDeep) {
        const item = objDeep[i];
        const isItemArr = Array.isArray(item);
        if (
            item === "" ||
            item === null ||
            item === -1 ||
            (isItemArr && !item.length) ||
            (isItemArr && item.length === 1 && (item[0] === -1 || item[0] === "全部" || item[0] === "全国"))
        ) {
            delete objDeep[i];
        }
    }
    return objDeep;
};
/**·
 * 导出Excel
 * @param name 文件名
 * @param data 二进制流
 */
export function exprotExcal(dowLoadFileName, result) {
    const blob = new Blob([result]);
    const fileName = dowLoadFileName + ".xlsx";
    // 判断浏览器
    let brower = "";
    if (navigator.userAgent.indexOf("Edge") > -1) {
        brower = "Edge";
    }

    if ("download" in document.createElement("a")) {
        // 非IE下载
        if (brower === "Edge") {
            (navigator as any).msSaveBlob(blob, fileName);
            return;
        }
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        // 释放URL 对象
        document.body.removeChild(elink);
    } else {
        // IE10+下载
        (navigator as any).msSaveBlob(blob, fileName);
    }
}

/**·
 * 导出PDF
 */
export function exprotPDF(dowLoadFileName, URL) {
    const fileName = dowLoadFileName;
    const elink = document.createElement("a");
    elink.download = fileName;
    elink.style.display = "none";
    elink.target = "_blank";
    elink.href = URL;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
}
