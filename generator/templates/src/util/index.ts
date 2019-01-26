/* tslint:disable:no-console */
import { curry, pipe, map, keys } from "lodash/fp";
import { head, tail, mapKeys, findKey, mapValues } from "lodash";
import Papa from "papaparse/papaparse.js";
import fs from "fs";
const stringify = require("csv-stringify");

/**
 * 美化命令行终端日志输出
 */
export const log = {
  suc: (_: any, ...args: any[]) => {
    console.log(`%c ${_}`, "color: #86d850;font-size:12px;font-weight:bold;", ...args);
  },
  info: (_: any, ...args: any[]) => {
    console.log(`%c ${_}`, "color: #27a8f2;font-size:12px;font-weight:bold;", ...args);
  },
  err: (_: any, ...args: any[]) => {
    console.log(`%c ${_}`, "color: red;font-size:12px;font-weight:bold;", ...args);
  },
};

/**
 * 在指定目录下查找某扩展名的文件
 * @param {String} path 需要查找的目录
 * @param {String} ext  文件扩展名
 * @return {Array} 无扩展名的文件名数组
 */
export function getFilesByExtentionInDir({ path = "", ext = "" }): string[] {
  let files = fs.readdirSync(path, "utf8");
  return files.reduce((res: string[], file) => {
    // FIXME extension name issue
    const match = newFunction();
    const replace = new RegExp(`.${ext}`);
    if (file.match(match)) {
      res.push(file.replace(replace, ""));
    }
    return res;
  }, []);

  function newFunction() {
    return new RegExp(`.*${ext}$`);
  }
}

const getFilesFp = curry(getFilesByExtentionInDir);

/**
 * 返回过滤并排序后的数组items
 * @filterKey: 过滤器，用来模糊查询一个数组中的每个对象的每个字段
 *  1. 对数组items，使用filter方法，获取每一个item
 *  2. 对每一个item，使用Object.keys方法，获取键值组成的数组
 *  3. 对键值数组，使用some方法，迭代每个键名
 *  4. 对每个键名，代入到item对象，获取每个键值。
 *  5. 对每一个键值，使用indexOf方法，根据filterkey返回符合条件的数据
 *
 * @sortKey:   用来排序的排序器
 */
export const baseFilter = (sortKey: string) => (filterKey: string) => (items: any[]): any[] => {
  var filter = filterKey && filterKey.toLowerCase();
  var order = 1;
  var data = items;
  data = lazyFilter(filter)(data);
  data = lazySorter(sortKey)(order)(data);
  return data;
};

/**
 * 对数组中每个对象，用某一个键名称进行排序
 * @param {String} sortKey 排序键名称
 * @param {Array} data 数据
 * @param {Number} order 排序方向
 */
export const lazySorter = (sortKey: string) => (order: number) => (data: any[]) => {
  return data.slice().sort(compareObjectValues(sortKey)(order));
};

/**
 * 比较对象中，每个键对应值的大小
 * @param key 排序键
 * @param order 排序方向
 * @return 通用比较函数
 */

export const compareObjectValues = (key: string) => (order: number) => {
  return (a, b) => comparePairs(a[key])(b[key])(order);
};

/**
 * 快速排序
 * 前数大于后数，为正。后数大于前数，为负。
 * 前数等于后数，为平。
 * @param a  前一元素
 * @param b  后一元素
 * @param order  顺序为1， 逆序为-1
 * @return number 0|1|-1
 */
export const comparePairs = a => b => (order: number): number => {
  const notEqualCompare = a > b ? 1 : -1;
  const equalCompare = a === b ? 0 : notEqualCompare;
  return equalCompare * order;
};

/**
 * 过滤  查找  转换
 * @param filter
 * @param data
 */
export const lazyFilter = (filter: string) => (data: any[]) => {
  return data.reduce((list: any[], item: any) => {
    Object.keys(item).some(key => {
      if (checkStringMatch(item[key])(filter)) {
        list.push(item);
        return true;
      }
    });
    return list;
  }, []);
};

export const checkStringMatch = (test: string) => (filter: string): boolean => {
  return (
    String(test)
      .toLowerCase()
      .indexOf(filter) > -1
  );
};
/**
 * 讲对象的键值转化为数组
 * @param item Object with keys and values
 */
export const ObjectKeysToArray = (item: any): any[] => {
  return Object.keys(item);
};

/**
 * 将部分数据键值转化为数组
 * @param item Object with keys and values
 */
export const limitedObjectKeysToArray = (item: any): any[] => {
  return Object.keys(item).reduce((list: any[], key: string, index: number) => {
    if (index > 8) return;
    list.push({ text: key, value: key });
    return list;
  }, []);
};

/**
 * 将 CSV 文件分割为头和体
 */
export const splitCSVHeaderBody = (content: string): { header: string; body: string[] } => {
  return pipe(
    (content: string) => content.split("\n"),
    (lines: string[]) => ({ header: head(lines), body: tail(lines) }),
  )(content);
};

/**
 * 操作 JSON 对象。
 * 转译列标题，不适用lodash辅助函数。
 * 将数组中的元素对象的键名称进行翻译，结合i18n可以进行导入导出。
 * @param data 原始数组, [{ name: "xxx"},...]
 * @param keysDef json对象，包含标题行翻译 { name: "姓名"}
 * @param reverse 如果反向查找,在json文件中通过键值查找键名
 * @return result 新数组, { "姓名": "xxx"}
 */
export const translateHeadersLegancy = (data: any[], keysDef: any, reverse?: boolean): any[] => {
  let result = [];
  data.forEach(item => {
    let newItem = {};
    keys(item).map(key => {
      let newKey: string;
      if (reverse) {
        newKey = Object.keys(keysDef).filter(k => keysDef[k] === key)[0];
      } else {
        newKey = keysDef[key];
      }
      newItem[newKey] = item[key];
    });
    result.push(newItem);
  });
  return result;
};

/**
 * 操作 JSON 对象。
 * 转译列标题，使用lodash辅助函数。
 * 应用场景是将数组中的元素对象的键名称进行翻译，结合i18n可以进行导入导出。
 * @param data 原始数组, [{ name: "zip"},...]
 * @param keysDef json对象，包含标题行翻译 { name: "姓名"}
 * @param reverse 如果反向, 不转译
 * @return result 新数组, { "姓名": "zip"}
 * @example
 * import * as keysDef from "@/locales/cn.json"
 * const keysDef = JSON.parse(fs.readFileSync("cn.json").toString())
 */
export const translateHeaders = ({ data = [], keysDef = {}, reverse = false }): any[] => {
  if (reverse) {
    return data;
  } else {
    return data.reduce((list: any[], item) => {
      let newItem = mapKeys(item, (_: string, k: string) => keysDef[k]);
      list.push(newItem);
      return list;
    }, []);
  }
};
/**
 * 操作 JSON 对象。
 * 转[对象类]键值为[字符串]键值。应用场景为翻译每一行数据。
 * 如果值为对象的, 使用其 name 字段作为新值，避免在导出CSV中出现JSON格式。
 * NOTE 实现方法1. forEach methods
 * let result = [];
 * data.forEach(item => {
 *   let newItem = mapValues(item, preferValueAsString);
 *   result.push(newItem);
 * });
 * return result;
 * NOTE 实现方法2. reduce methods
 */
export const translateBody = ({ data = [], onlyKeepStringValue = true }): any[] => {
  if (onlyKeepStringValue) {
    return data.reduce((list, item) => {
      let newItem = mapValues(item, preferValueAsString);
      list.push(newItem);
      return list;
    }, []);
  } else {
    return data;
  }
};

/**
 * 操作 CSV 物理文件。
 * 更改 CSV 文件的列标题，主要面向 CSV 物理文件进行操作，比逐项操作 JSON 对象性能更高。
 * @param content string to parse
 * @param fieldDefs object with i18n translation
 * @result string
 * @example
 * let re = changeCSVHeader("\'name\',\'age\'\n\'xxx\',\'yyy\'")({
 *   name: "姓名",
 *   age: "年龄"
 * })
 */
export const changeCSVHeader = ({ header = "", keysDef = {}, reverse = false }): string => {
  if (reverse) {
    return pipe(
      (header: string) => header.split(","),
      map(fieldName => {
        fieldName = fieldName.replace(/(\\|\n|'|")/g, "");
        return findKey(keysDef, value => value === fieldName).toString();
      }),
      (fieldNames: string[]) => fieldNames.join(","),
    )(header);
  } else {
    return pipe(
      (header: string) => header.split(","),
      map(fieldName => {
        fieldName = fieldName.replace(/(\\|\n|'|")/g, "");
        return keysDef[fieldName.toString()];
      }),
      (fieldNames: string[]) => fieldNames.join(","),
    )(header);
  }
};

/**
 * 操作 CSV 物理文件。
 * 更改 CSV 文件的列标题, 保留数据没行格式不变
 * @param content string to parse
 * @param fieldDefs object with i18n translation
 * @result string
 */
export const changeHeaderOfCSV = ({ targetFilePath = "", keysDef = {}, reverse = false }) => {
  // 1. 读取文件为字符串
  let content = fs.readFileSync(targetFilePath, "utf8");
  // 2. 分别获取第一行为列标题，其他为数据行
  let { header, body } = splitCSVHeaderBody(content);
  // 3. 翻译第一行，如果reverse为真，进行反向翻译。
  let newHeader = changeCSVHeader({ header, keysDef, reverse });
  // 3. 写入第一行为列标题
  console.log(`原有列标题如下:\n${header}`);
  console.log(`新的列标题如下:\n${newHeader}`);
  console.log(`清空原有数据，写入新的列标题`);
  fs.writeFileSync(targetFilePath, newHeader, { encoding: "utf-8", flag: "w" });
  fs.writeFileSync(targetFilePath, "\n", { encoding: "utf-8", flag: "a" });
  // 4. 写入其他数据行
  const data = body.join("\n");
  console.log(`添加新的数据行`);
  fs.writeFileSync(targetFilePath, data, { encoding: "utf-8", flag: "a" });
  console.log(`成功更新CSV文件的列标题！`);
};

/**
 * 生成CSV文件的函数
 * 步骤如下:
 * 1. 使用csv-stringify转数组为字符串，并进行必要字符串转换
 *    如果输入数据不是数组，转化为数组
 *    如果需要，进行列标题转译
 *    如果需要，转[对象类]键值为[字符串]键值
 * 2. 保存字符串到指定文件
 * 3. windows下如有文档编码显示错误，可在目录下设置schema.ini文件
 * @param {Array} data 需要到处的数据
 * @param {String} targetFilePath 目标文件地址
 * @param {Object} keysDef
 * @param {Boolean} needTranslateHeader
 * @param {Boolean} onlyKeepStringValue
 */
export const GenerateCSV = ({
  data = [],
  targetFilePath = "",
  keysDef = {},
  needTranslateHeader = true,
  onlyKeepStringValue = true,
}) => {
  if (!Array.isArray(data)) {
    data = [data];
  }
  // 进行列标题转译
  if (needTranslateHeader) {
    data = translateHeaders({ data, keysDef, reverse: false });
  }
  // 转对象类键值为字符串键值
  if (onlyKeepStringValue) {
    data = translateBody({ data, onlyKeepStringValue: true });
  }
  // 进行输出
  stringify(
    data,
    {
      delimiter: ",",
      header: true,
      quoted: false,
    },
    (_err: string, output: any) => {
      _err && console.log(_err);
      console.log("Data to be written:");
      console.log(output);
      fs.writeFileSync(targetFilePath, output, "utf8");
      console.log(`Data written to ${targetFilePath}`);
    },
  );
};

/**
 * 使用文件控件上传文件对象
 * @param {String|Object} file 文件对象
 * @param {String|Object} needTranslate 需要转移列标题
 * @param {String|Object} keysDef? 标题定义json文件
 * @return {Promise} 成功将返回一个results对象，其data属性为真正的数据数组
 **/
export const ImportCSV = async ({ file = {}, keysDef = {} }): Promise<any> => {
  return new Promise((resolve, _) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(result: any) {
        resolve(result.data);
      },
    });
  });
};

// String Helpers
export const capitalizeFirstLetter = (message: string) => {
  return message.charAt(0).toUpperCase() + message.slice(1).toLowerCase();
};

export const uncapitalizeFirstLetter = (message: string) => {
  return message.charAt(0).toLowerCase() + message.slice(1).toLowerCase();
};

export const kebab = (message: string) => {
  return (message || "").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

export const randomElement = (arr = []) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const slugify = (words: string) => {
  return pipe(
    (words: string) => words.split(" "),
    map(word => word.toLowerCase()),
    (words: string[]) => words.join("-"),
  )(words);
};

export const surround = (words: string) => {
  return words.replace(/^(w+)$/, '"$1"');
};

/**
 * 返回文件名，不含目录和扩展名
 * @param filename 文件名
 */
export const fileShortName = (filename: string) => {
  return filename.replace(/^\.\//, "").replace(/\.\w+$/, "");
};

/**
 * 返回文件名，不含目录和扩展名
 * @param filename 文件名
 */
export const matchFileName = (filename: string) => {
  // 确定键名符合要求
  const matched = filename.match(/([A-Za-z0-9-_]+)\./i);
  if (matched && matched.length > 1) return matched[1];
};

/**
 * 值为对象的, 使用其 name 字段作为新值
 */
export const preferValueAsString = (value: any) => {
  return typeof value === "object" ? value["name"] : value;
};
