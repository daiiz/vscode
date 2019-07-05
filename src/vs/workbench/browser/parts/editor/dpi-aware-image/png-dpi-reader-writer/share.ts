/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const toBin = (value, digits) => value.toString(2).padStart(digits, '0');

export const toHex = (value, digits) => value.toString(16).padStart(digits, '0');

export function isPng(byteArray, ptr) {
	const pngSignature = '89 50 4E 47 0D 0A 1A 0A';
	const signature = readBytes(byteArray, ptr, 8).map(v => toHex(v, 2));
	return signature.join(' ').toUpperCase() === pngSignature;
}

export function readBytes(byteArray, ptr, byteLength) {
	const { pos } = ptr;
	const res = byteArray.slice(pos, pos + byteLength);
	ptr.pos += byteLength;
	return Array.from(res);
}

export function readIHDR(byteArray, ptr) {
	// https://tools.ietf.org/html/rfc2083#page-15
	// Length, ChunkType
	ptr.pos += (4 + 4);
	let width = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8));
	width = parseInt(width.join(''), 2);
	let height = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8));
	height = parseInt(height.join(''), 2);
	// Bit depth, Color type, Compression method, Filter method, nterlace method, CRC
	ptr.pos += (1 + 1 + 1 + 1 + 1 + 4);
	return { width, height };
}

export function getCharCodes(str) {
	return str.split('').map(c => c.charCodeAt(0)).join(' ');
}