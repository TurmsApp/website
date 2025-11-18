import { Buffer } from "buffer";

const cborEncodeInt = (value: number): Buffer => {
  let majorType: number;
  if (value >= 0) {
    majorType = 0;
  } else {
    majorType = 1;
    value = -1 - value;
  }

  if (value < 24) {
    return Buffer.from([(majorType << 5) | value]);
  } else if (value <= 0xff) {
    return Buffer.from([(majorType << 5) | 24, value]);
  } else if (value <= 0xffff) {
    const buffer = Buffer.alloc(3);
    buffer[0] = (majorType << 5) | 25;
    buffer.writeUInt16BE(value, 1);
    return buffer;
  } else if (value <= 0xffffffff) {
    const buffer = Buffer.alloc(5);
    buffer[0] = (majorType << 5) | 26;
    buffer.writeUInt32BE(value, 1);
    return buffer;
  } else {
    throw new Error("Integer too large for simple 32-bit CBOR encoding");
  }
};

const cborEncodeBuffer = (buffer: Buffer): Buffer => {
  const majorType = 2;
  const length = buffer.length;

  let header: Buffer;
  if (length < 24) {
    header = Buffer.from([(majorType << 5) | length]);
  } else if (length <= 0xff) {
    header = Buffer.from([(majorType << 5) | 24, length]);
  } else if (length <= 0xffff) {
    header = Buffer.alloc(3);
    header[0] = (majorType << 5) | 25;
    header.writeUInt16BE(length, 1);
  } else if (length <= 0xffffffff) {
    header = Buffer.alloc(5);
    header[0] = (majorType << 5) | 26;
    header.writeUInt32BE(length, 1);
  } else {
    throw new Error("Buffer too large");
  }

  return Buffer.concat([header, buffer]);
};

export const cborEncodeMap = (map: Map<any, any>): Buffer => {
  const majorType = 5;
  const size = map.size;

  let header: Buffer;
  if (size < 24) {
    header = Buffer.from([(majorType << 5) | size]);
  } else {
    throw new Error("Map size too large for simple implementation");
  }

  const encodedElements: Buffer[] = [header];

  for (const [key, value] of map.entries()) {
    encodedElements.push(cborEncodeInt(key));

    if (typeof value === "number") {
      encodedElements.push(cborEncodeInt(value));
    } else if (value instanceof Buffer) {
      encodedElements.push(cborEncodeBuffer(value));
    } else {
      throw new Error(`Unsupported value type: ${typeof value}`);
    }
  }

  return Buffer.concat(encodedElements);
};
