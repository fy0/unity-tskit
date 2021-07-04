import { chunk, fill } from "lodash-es";

export function arrayWidth(arr) {
  return arr.length;
}

export function arrayHeight(arr) {
  if (arr.length == 0) return 0;
  return arr[0].length;
}

export function arraySetSize(arr, x: number, y: number) {
  if (arr.length == 0) {
    arr = chunk(fill(Array(x * y), 0), y);
  } else {
    const srcWidth = arrayWidth(arr);
    const srcHeight = arrayWidth(arr);

    // 对齐 x 行
    if (x < srcWidth) {
      arr.length = x;
    } else {
      const xRest = x - arr.length;
      const lst = chunk(fill(Array(xRest * y), 0), y);
      arr.push(...lst)
    }

    // 对齐y行
    if (y < srcHeight) {
      for (let i of arr) {
        i.length = y;
      }
    } else {
      for (let i of arr) {
        const yRest = (y - i.length);
        i.push(...fill(Array(yRest), 0));
      }
    }
  }
  return arr;
}
