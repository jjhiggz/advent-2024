import { z } from "zod";

const nArr = z.array(z.number());
const nMatrix = z.array(nArr);

const strArr = z.array(z.string());
const strMatrix = z.array(strArr);

export const Schemas = {
    nArr,
    nMatrix,
    strArr,
    strMatrix,
};
