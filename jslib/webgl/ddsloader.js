/* This file was generated from TypeScript source tslib/webgl/ddsloader.ts */

// Copyright (c) 2011-2012 Turbulenz Limited
/*global TurbulenzEngine*/
/*global Uint8Array*/
/*global Uint16Array*/
/*global window*/
"use strict";

//
// DDSLoader
//
function DDSLoader() {
    return this;
}
DDSLoader.prototype = {
    version: 1,
    DDSF_CAPS: // surface description flags
    1,
    DDSF_HEIGHT: 2,
    DDSF_WIDTH: 4,
    DDSF_PITCH: 8,
    DDSF_PIXELFORMAT: 4096,
    DDSF_MIPMAPCOUNT: 131072,
    DDSF_LINEARSIZE: 524288,
    DDSF_DEPTH: 8388608,
    DDSF_ALPHAPIXELS: // pixel format flags
    1,
    DDSF_FOURCC: 4,
    DDSF_RGB: 64,
    DDSF_RGBA: 65,
    DDSF_COMPLEX: // dwCaps1 flags
    8,
    DDSF_TEXTURE: 4096,
    DDSF_MIPMAP: 4194304,
    DDSF_CUBEMAP: // dwCaps2 flags
    512,
    DDSF_CUBEMAP_POSITIVEX: 1024,
    DDSF_CUBEMAP_NEGATIVEX: 2048,
    DDSF_CUBEMAP_POSITIVEY: 4096,
    DDSF_CUBEMAP_NEGATIVEY: 8192,
    DDSF_CUBEMAP_POSITIVEZ: 16384,
    DDSF_CUBEMAP_NEGATIVEZ: 32768,
    DDSF_CUBEMAP_ALL_FACES: 64512,
    DDSF_VOLUME: 2097152,
    FOURCC_UNKNOWN: // compressed texture types
    0,
    FOURCC_R8G8B8: 20,
    FOURCC_A8R8G8B8: 21,
    FOURCC_X8R8G8B8: 22,
    FOURCC_R5G6B5: 23,
    FOURCC_X1R5G5B5: 24,
    FOURCC_A1R5G5B5: 25,
    FOURCC_A4R4G4B4: 26,
    FOURCC_R3G3B2: 27,
    FOURCC_A8: 28,
    FOURCC_A8R3G3B2: 29,
    FOURCC_X4R4G4B4: 30,
    FOURCC_A2B10G10R10: 31,
    FOURCC_A8B8G8R8: 32,
    FOURCC_X8B8G8R8: 33,
    FOURCC_G16R16: 34,
    FOURCC_A2R10G10B10: 35,
    FOURCC_A16B16G16R16: 36,
    FOURCC_L8: 50,
    FOURCC_A8L8: 51,
    FOURCC_A4L4: 52,
    FOURCC_DXT1: 827611204,
    FOURCC_DXT2: //(MAKEFOURCC('D','X','T','1'))
    844388420,
    FOURCC_DXT3: //(MAKEFOURCC('D','X','T','1'))
    861165636,
    FOURCC_DXT4: //(MAKEFOURCC('D','X','T','3'))
    877942852,
    FOURCC_DXT5: //(MAKEFOURCC('D','X','T','3'))
    894720068,
    FOURCC_D16_LOCKABLE: //(MAKEFOURCC('D','X','T','5'))
    70,
    FOURCC_D32: 71,
    FOURCC_D24X8: 77,
    FOURCC_D16: 80,
    FOURCC_D32F_LOCKABLE: 82,
    FOURCC_L16: 81,
    FOURCC_R16F: // Floating point surface formats
    // s10e5 formats (16-bits per channel)
    111,
    FOURCC_G16R16F: 112,
    FOURCC_A16B16G16R16F: 113,
    FOURCC_R32F: // IEEE s23e8 formats (32-bits per channel)
    114,
    FOURCC_G32R32F: 115,
    FOURCC_A32B32G32R32F: 116,
    BGRPIXELFORMAT_B5G6R5: 1,
    BGRPIXELFORMAT_B8G8R8A8: 2,
    BGRPIXELFORMAT_B8G8R8: 3,
    processBytes: function processBytesFn(bytes) {
        if(!this.isValidHeader(bytes)) {
            return;
        }
        // Skip signature
        var offset = 4;
        var header = this.parseHeader(bytes, offset);
        offset += 31 * 4;
        this.width = header.dwWidth;
        this.height = header.dwHeight;
        /*jshint bitwise: false*/
        if((header.dwCaps2 & this.DDSF_VOLUME) && (header.dwDepth > 0)) {
            this.depth = header.dwDepth;
        } else {
            this.depth = 1;
        }
        if(header.dwFlags & this.DDSF_MIPMAPCOUNT) {
            this.numLevels = header.dwMipMapCount;
        } else {
            this.numLevels = 1;
        }
        if(header.dwCaps2 & this.DDSF_CUBEMAP) {
            var numFaces = 0;
            numFaces += ((header.dwCaps2 & this.DDSF_CUBEMAP_POSITIVEX) ? 1 : 0);
            numFaces += ((header.dwCaps2 & this.DDSF_CUBEMAP_NEGATIVEX) ? 1 : 0);
            numFaces += ((header.dwCaps2 & this.DDSF_CUBEMAP_POSITIVEY) ? 1 : 0);
            numFaces += ((header.dwCaps2 & this.DDSF_CUBEMAP_NEGATIVEY) ? 1 : 0);
            numFaces += ((header.dwCaps2 & this.DDSF_CUBEMAP_POSITIVEZ) ? 1 : 0);
            numFaces += ((header.dwCaps2 & this.DDSF_CUBEMAP_NEGATIVEZ) ? 1 : 0);
            if(numFaces !== 6 || this.width !== this.height) {
                return;
            }
            this.numFaces = numFaces;
        } else {
            this.numFaces = 1;
        }
        var compressed = false;
        var bpe = 0;
        // figure out what the image format is
        var gd = this.gd;
        if(header.ddspf.dwFlags & this.DDSF_FOURCC) {
            switch(header.ddspf.dwFourCC) {
                case this.FOURCC_DXT1:
                    this.format = gd.PIXELFORMAT_DXT1;
                    bpe = 8;
                    compressed = true;
                    break;
                case this.FOURCC_DXT2:
                case this.FOURCC_DXT3:
                    this.format = gd.PIXELFORMAT_DXT3;
                    bpe = 16;
                    compressed = true;
                    break;
                case this.FOURCC_DXT4:
                case this.FOURCC_DXT5:
                case this.FOURCC_RXGB:
                    this.format = gd.PIXELFORMAT_DXT5;
                    bpe = 16;
                    compressed = true;
                    break;
                case this.FOURCC_R8G8B8:
                    this.bgrFormat = this.BGRPIXELFORMAT_B8G8R8;
                    bpe = 3;
                    break;
                case this.FOURCC_A8R8G8B8:
                    this.bgrFormat = this.BGRPIXELFORMAT_B8G8R8A8;
                    bpe = 4;
                    break;
                case this.FOURCC_R5G6B5:
                    this.bgrFormat = this.BGRPIXELFORMAT_B5G6R5;
                    bpe = 2;
                    break;
                case this.FOURCC_A8:
                    this.format = gd.PIXELFORMAT_A8;
                    bpe = 1;
                    break;
                case this.FOURCC_A8B8G8R8:
                    this.format = gd.PIXELFORMAT_R8G8B8A8;
                    bpe = 4;
                    break;
                case this.FOURCC_L8:
                    this.format = gd.PIXELFORMAT_L8;
                    bpe = 1;
                    break;
                case this.FOURCC_A8L8:
                    this.format = gd.PIXELFORMAT_L8A8;
                    bpe = 2;
                    break;
                    //these are unsupported for now
                                    case this.FOURCC_UNKNOWN:
                case this.FOURCC_ATI1:
                case this.FOURCC_ATI2:
                case this.FOURCC_X8R8G8B8:
                case this.FOURCC_X8B8G8R8:
                case this.FOURCC_A2B10G10R10:
                case this.FOURCC_A2R10G10B10:
                case this.FOURCC_A16B16G16R16:
                case this.FOURCC_R16F:
                case this.FOURCC_A16B16G16R16F:
                case this.FOURCC_R32F:
                case this.FOURCC_A32B32G32R32F:
                case this.FOURCC_L16:
                case this.FOURCC_X1R5G5B5:
                case this.FOURCC_A1R5G5B5:
                case this.FOURCC_A4R4G4B4:
                case this.FOURCC_R3G3B2:
                case this.FOURCC_A8R3G3B2:
                case this.FOURCC_X4R4G4B4:
                case this.FOURCC_A4L4:
                case this.FOURCC_D16_LOCKABLE:
                case this.FOURCC_D32:
                case this.FOURCC_D24X8:
                case this.FOURCC_D16:
                case this.FOURCC_D32F_LOCKABLE:
                case this.FOURCC_G16R16:
                case this.FOURCC_G16R16F:
                case this.FOURCC_G32R32F:
                    break;
                default:
                    return;
            }
        } else if(header.ddspf.dwFlags === this.DDSF_RGBA && header.ddspf.dwRGBBitCount === 32) {
            if(header.ddspf.dwRBitMask === 255 && header.ddspf.dwGBitMask === 65280 && header.ddspf.dwBBitMask === 16711680 && header.ddspf.dwABitMask === 4278190080) {
                this.format = gd.PIXELFORMAT_R8G8B8A8;
            } else {
                this.bgrFormat = this.BGRPIXELFORMAT_B8G8R8A8;
            }
            bpe = 4;
        } else if(header.ddspf.dwFlags === this.DDSF_RGB && header.ddspf.dwRGBBitCount === 32) {
            if(header.ddspf.dwRBitMask === 255 && header.ddspf.dwGBitMask === 65280 && header.ddspf.dwBBitMask === 16711680) {
                this.format = gd.PIXELFORMAT_R8G8B8A8;
            } else {
                this.bgrFormat = this.BGRPIXELFORMAT_B8G8R8A8;
            }
            bpe = 4;
        } else if(header.ddspf.dwFlags === this.DDSF_RGB && header.ddspf.dwRGBBitCount === 24) {
            if(header.ddspf.dwRBitMask === 255 && header.ddspf.dwGBitMask === 65280 && header.ddspf.dwBBitMask === 16711680) {
                this.format = gd.PIXELFORMAT_R8G8B8;
            } else {
                this.bgrFormat = this.BGRPIXELFORMAT_B8G8R8;
            }
            bpe = 3;
        } else if(header.ddspf.dwFlags === this.DDSF_RGB && header.ddspf.dwRGBBitCount === 16) {
            if(header.ddspf.dwRBitMask === 63488 && header.ddspf.dwGBitMask === 2016 && header.ddspf.dwBBitMask === 31) {
                this.format = gd.PIXELFORMAT_R5G6B5;
            } else {
                this.bgrFormat = this.BGRPIXELFORMAT_B5G6R5;
            }
            bpe = 2;
        } else if(header.ddspf.dwRGBBitCount === 8) {
            this.format = gd.PIXELFORMAT_L8;
            bpe = 1;
        } else {
            return;
        }
        var size = 0;
        for(var face = 0; face < this.numFaces; face += 1) {
            var w = this.width, h = this.height, d = this.depth;
            for(var level = 0; level < this.numLevels; level += 1) {
                var ew = (compressed ? Math.floor((w + 3) / 4) : w);
                var eh = (compressed ? Math.floor((h + 3) / 4) : h);
                size += (ew * eh * d * bpe);
                w = (w > 1 ? (w >> 1) : 1);
                h = (h > 1 ? (h >> 1) : 1);
                d = (d > 1 ? (d >> 1) : 1);
            }
        }
        /*jshint bitwise: true*/
        if(bytes.length < (offset + size)) {
            return;
        }
        this.bytesPerPixel = bpe;
        var data = bytes.subarray(offset);
        bytes = null;
        var swapBytes = false;
        switch(this.bgrFormat) {
            case this.BGRPIXELFORMAT_B8G8R8:
                this.format = gd.PIXELFORMAT_R8G8B8;
                swapBytes = true;
                break;
            case this.BGRPIXELFORMAT_B8G8R8A8:
                this.format = gd.PIXELFORMAT_R8G8B8A8;
                swapBytes = true;
                break;
            case this.BGRPIXELFORMAT_B5G6R5:
                this.format = gd.PIXELFORMAT_R5G6B5;
                swapBytes = true;
                break;
            default:
                break;
        }
        if(swapBytes) {
            data = this.convertBGR2RGB(data);
        }
        if(this.format === gd.PIXELFORMAT_DXT1) {
            if(!gd.isSupported('TEXTURE_DXT1')) {
                data = this.convertDXT1ToRGBA(data);
            }
        } else if(this.format === gd.PIXELFORMAT_DXT3) {
            if(!gd.isSupported('TEXTURE_DXT3')) {
                data = this.convertDXT3ToRGBA(data);
            }
        } else if(this.format === gd.PIXELFORMAT_DXT5) {
            if(!gd.isSupported('TEXTURE_DXT5')) {
                data = this.convertDXT5ToRGBA(data);
            }
        }
        this.data = data;
    },
    parseHeader: function parseHeaderFn(bytes, offset) {
        function readUInt32() {
            var value = ((bytes[offset]) + (bytes[offset + 1] * 256) + (bytes[offset + 2] * 65536) + (bytes[offset + 3] * 16777216));
            offset += 4;
            return value;
        }
        function parsePixelFormatHeader() {
            return {
                dwSize: readUInt32(),
                dwFlags: readUInt32(),
                dwFourCC: readUInt32(),
                dwRGBBitCount: readUInt32(),
                dwRBitMask: readUInt32(),
                dwGBitMask: readUInt32(),
                dwBBitMask: readUInt32(),
                dwABitMask: readUInt32()
            };
        }
        var header = {
            dwSize: readUInt32(),
            dwFlags: readUInt32(),
            dwHeight: readUInt32(),
            dwWidth: readUInt32(),
            dwPitchOrLinearSize: readUInt32(),
            dwDepth: readUInt32(),
            dwMipMapCount: readUInt32(),
            dwReserved1: [
                readUInt32(), 
                readUInt32(), 
                readUInt32(), 
                readUInt32(), 
                readUInt32(), 
                readUInt32(), 
                readUInt32(), 
                readUInt32(), 
                readUInt32(), 
                readUInt32(), 
                readUInt32()
            ],
            ddspf: parsePixelFormatHeader(),
            dwCaps1: readUInt32(),
            dwCaps2: readUInt32(),
            dwReserved2: [
                readUInt32(), 
                readUInt32(), 
                readUInt32()
            ]
        };
        return header;
    },
    isValidHeader: function isValidHeaderFn(bytes) {
        return (68 === bytes[0] && 68 === bytes[1] && 83 === bytes[2] && 32 === bytes[3]);
    },
    convertBGR2RGB: function convertBGR2RGBFn(data) {
        // Rearrange the colors from BGR to RGB
        var bytesPerPixel = this.bytesPerPixel;
        var width = this.width;
        var height = this.height;
        var numLevels = this.numLevels;
        var numFaces = this.numFaces;
        var numPixels = 0;
        for(var level = 0; level < numLevels; level += 1) {
            numPixels += (width * height);
            width = (width > 1 ? Math.floor(width / 2) : 1);
            height = (height > 1 ? Math.floor(height / 2) : 1);
        }
        var size = (numPixels * bytesPerPixel * numFaces);
        var offset = 0;
        if(bytesPerPixel === 3 || bytesPerPixel === 4) {
            do {
                var tmp = data[offset];
                data[offset] = data[offset + 2];
                data[offset + 2] = tmp;
                offset += bytesPerPixel;
            }while(offset < size);
        } else if(bytesPerPixel === 2) {
            var dst = new Uint16Array(numPixels * numFaces);
            var src = 0, dest = 0;
            var r, g, b;
            /*jshint bitwise: false*/
            var mask5bit = ((1 << 5) - 1);
            var midMask6bit = (((1 << 6) - 1) << 5);
            do {
                var value = ((data[src + 1] << 8) | data[src]);
                src += 2;
                r = (value & mask5bit) << 11;
                g = (value & midMask6bit);
                b = ((value >> 11) & mask5bit);
                dst[dest] = r | g | b;
                dest += 1;
            }while(offset < size);
            /*jshint bitwise: true*/
            return dst;
        }
        return data;
    },
    decode565: function decode565Fn(value, color) {
        /*jshint bitwise: false*/
        color[0] = ((value >> 11) & 31) * (255 / 31);
        color[1] = ((value >> 5) & 63) * (255 / 63);
        color[2] = ((value) & 31) * (255 / 31);
        color[3] = 255;
        /*jshint bitwise: true*/
        return color;
    },
    decodeColor: function decodeColorFn(data, src, isDXT1, out, scratchpad) {
        /*jshint bitwise: false*/
        var cache = scratchpad.cache;
        var decode565 = DDSLoader.prototype.decode565;
        var col0 = ((data[src + 1] << 8) | data[src]);
        src += 2;
        var col1 = ((data[src + 1] << 8) | data[src]);
        src += 2;
        var c0, c1, c2, c3, i;
        if(col0 !== col1) {
            c0 = decode565(col0, cache[0]);
            c1 = decode565(col1, cache[1]);
            c2 = cache[2];
            c3 = cache[3];
            if(!isDXT1 || col0 > col1) {
                for(i = 0; i < 3; i += 1) {
                    var c0i = c0[i];
                    var c1i = c1[i];
                    c2[i] = ((((c0i * 2) + c1i) / 3) | 0);
                    c3[i] = (((c0i + (c1i * 2)) / 3) | 0);
                }
                c2[3] = 255;
                c3[3] = 255;
            } else {
                for(i = 0; i < 3; i += 1) {
                    c2[i] = ((c0[i] + c1[i]) >> 1);
                    c3[i] = 0;
                }
                c2[3] = 255;
                c3[3] = 0;
            }
        } else {
            c0 = decode565(col0, cache[0]);
            c1 = c0;
            c2 = c0;
            c3 = cache[1];
            for(i = 0; i < 4; i += 1) {
                c3[i] = 0;
            }
        }
        var c = scratchpad.colorArray;
        c[0] = c0;
        c[1] = c1;
        c[2] = c2;
        c[3] = c3;
        // ((1 << 2) - 1) === 3;
                var row, dest, color;
        if(isDXT1) {
            for(i = 0; i < 4; i += 1) {
                row = data[src + i];
                dest = out[i];
                dest[0] = c[(row) & 3];
                dest[1] = c[(row >> 2) & 3];
                dest[2] = c[(row >> 4) & 3];
                dest[3] = c[(row >> 6) & 3];
            }
        } else {
            for(i = 0; i < 4; i += 1) {
                row = data[src + i];
                dest = out[i];
                color = c[(row) & 3];
                dest[0][0] = color[0];
                dest[0][1] = color[1];
                dest[0][2] = color[2];
                dest[0][3] = color[3];
                color = c[(row >> 2) & 3];
                dest[1][0] = color[0];
                dest[1][1] = color[1];
                dest[1][2] = color[2];
                dest[1][3] = color[3];
                color = c[(row >> 4) & 3];
                dest[2][0] = color[0];
                dest[2][1] = color[1];
                dest[2][2] = color[2];
                dest[2][3] = color[3];
                color = c[(row >> 6) & 3];
                dest[3][0] = color[0];
                dest[3][1] = color[1];
                dest[3][2] = color[2];
                dest[3][3] = color[3];
            }
        }
        /*jshint bitwise: true*/
            },
    decodeDXT3Alpha: function decodeDXT3AlphaFn(data, src, out) {
        /*jshint bitwise: false*/
        // ((1 << 4) - 1) === 15;
        for(var i = 0; i < 4; i += 1) {
            var row = ((data[src + 1] << 8) | data[src]);
            src += 2;
            var dest = out[i];
            if(row) {
                dest[0][3] = ((row) & 15) * (255 / 15);
                dest[1][3] = ((row >> 4) & 15) * (255 / 15);
                dest[2][3] = ((row >> 8) & 15) * (255 / 15);
                dest[3][3] = ((row >> 12) & 15) * (255 / 15);
            } else {
                dest[0][3] = 0;
                dest[1][3] = 0;
                dest[2][3] = 0;
                dest[3][3] = 0;
            }
        }
        /*jshint bitwise: true*/
            },
    decodeDXT5Alpha: function decodeDXT5AlphaFn(data, src, out, scratchpad) {
        var a0 = data[src];
        src += 1;
        var a1 = data[src];
        src += 1;
        /*jshint bitwise: false*/
        var a = scratchpad.alphaArray;
        a[0] = a0;
        a[1] = a1;
        if(a0 > a1) {
            a[2] = ((((a0 * 6) + (a1 * 1)) / 7) | 0);
            a[3] = ((((a0 * 5) + (a1 * 2)) / 7) | 0);
            a[4] = ((((a0 * 4) + (a1 * 3)) / 7) | 0);
            a[5] = ((((a0 * 3) + (a1 * 4)) / 7) | 0);
            a[6] = ((((a0 * 2) + (a1 * 5)) / 7) | 0);
            a[7] = ((((a0 * 1) + (a1 * 6)) / 7) | 0);
        } else if(a0 < a1) {
            a[2] = ((((a0 * 4) + (a1 * 1)) / 5) | 0);
            a[3] = ((((a0 * 3) + (a1 * 2)) / 5) | 0);
            a[4] = ((((a0 * 2) + (a1 * 3)) / 5) | 0);
            a[5] = ((((a0 * 1) + (a1 * 4)) / 5) | 0);
            a[6] = 0;
            a[7] = 255;
        } else//if (a0 === a1)
         {
            a[2] = a0;
            a[3] = a0;
            a[4] = a0;
            a[5] = a0;
            a[6] = 0;
            a[7] = 255;
        }
        // ((1 << 3) - 1) === 7
        var dest;
        for(var i = 0; i < 2; i += 1) {
            var value = (data[src] | (data[src + 1] << 8) | (data[src + 2] << 16));
            src += 3;
            dest = out[(i * 2)];
            dest[0][3] = a[(value) & 7];
            dest[1][3] = a[(value >> 3) & 7];
            dest[2][3] = a[(value >> 6) & 7];
            dest[3][3] = a[(value >> 9) & 7];
            dest = out[(i * 2) + 1];
            dest[0][3] = a[(value >> 12) & 7];
            dest[1][3] = a[(value >> 15) & 7];
            dest[2][3] = a[(value >> 18) & 7];
            dest[3][3] = a[(value >> 21) & 7];
        }
        /*jshint bitwise: true*/
            },
    convertDXT1ToRGBA: function convertDXT1ToRGBAFn(data) {
        var decodeColor = this.decodeColor;
        var scratchpad = {
            cache: [
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4)
            ],
            colorArray: new Array(4)
        };
        data = this.convertToRGBA(data, function decodeDXT1(data, src, out) {
            decodeColor(data, src, true, out, scratchpad);
        }, 8);
        this.format = this.gd.PIXELFORMAT_R8G8B8A8;
        return data;
    },
    convertDXT3ToRGBA: function convertDXT3ToRGBAFn(data) {
        var decodeColor = this.decodeColor;
        var decodeDXT3Alpha = this.decodeDXT3Alpha;
        var scratchpad = {
            cache: [
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4)
            ],
            colorArray: new Array(4)
        };
        data = this.convertToRGBA(data, function decodeDXT3(data, src, out) {
            decodeColor(data, (src + 8), false, out, scratchpad);
            decodeDXT3Alpha(data, src, out);
        }, 16);
        this.format = this.gd.PIXELFORMAT_R8G8B8A8;
        return data;
    },
    convertDXT5ToRGBA: function convertDXT5ToRGBAFn(data) {
        var decodeColor = this.decodeColor;
        var decodeDXT5Alpha = this.decodeDXT5Alpha;
        var scratchpad = {
            cache: [
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4)
            ],
            colorArray: new Array(4),
            alphaArray: new Uint8Array(8)
        };
        data = this.convertToRGBA(data, function decodeDXT5(data, src, out) {
            decodeColor(data, (src + 8), false, out, scratchpad);
            decodeDXT5Alpha(data, src, out, scratchpad);
        }, 16);
        this.format = this.gd.PIXELFORMAT_R8G8B8A8;
        return data;
    },
    convertToRGBA: function convertToRGBAFn(data, decode, srcStride) {
        //var bpp = 4;
        var level;
        var width = this.width;
        var height = this.height;
        var numLevels = this.numLevels;
        var numFaces = this.numFaces;
        /*jshint bitwise: false*/
        var numPixels = 0;
        for(level = 0; level < numLevels; level += 1) {
            numPixels += (width * height);
            width = (width > 1 ? (width >> 1) : 1);
            height = (height > 1 ? (height >> 1) : 1);
        }
        var dst = new Uint8Array(numPixels * 4 * numFaces);
        var src = 0, dest = 0;
        var color = [
            [
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4)
            ], 
            [
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4)
            ], 
            [
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4)
            ], 
            [
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4), 
                new Uint8Array(4)
            ]
        ];
        for(var face = 0; face < numFaces; face += 1) {
            width = this.width;
            height = this.height;
            for(var n = 0; n < numLevels; n += 1) {
                var numColumns = (width > 4 ? 4 : width);
                var numLines = (height > 4 ? 4 : height);
                var heightInBlocks = ((height + 3) >> 2);
                var widthInBlocks = ((width + 3) >> 2);
                var desinationStride = (width * 4);
                var desinationLineStride = (numColumns * 4);
                var desinationBlockStride = (desinationStride * (numLines - 1));
                for(var y = 0; y < heightInBlocks; y += 1) {
                    for(var x = 0; x < widthInBlocks; x += 1) {
                        decode(data, src, color);
                        var destLine = dest;
                        for(var line = 0; line < numLines; line += 1) {
                            var colorLine = color[line];
                            var destRGBA = destLine;
                            for(var i = 0; i < numColumns; i += 1) {
                                var rgba = colorLine[i];
                                dst[destRGBA] = rgba[0];
                                dst[destRGBA + 1] = rgba[1];
                                dst[destRGBA + 2] = rgba[2];
                                dst[destRGBA + 3] = rgba[3];
                                destRGBA += 4;
                            }
                            destLine += desinationStride;
                        }
                        src += srcStride;
                        dest += desinationLineStride;
                    }
                    dest += desinationBlockStride;
                }
                width = (width > 1 ? (width >> 1) : 1);
                height = (height > 1 ? (height >> 1) : 1);
            }
        }
        /*jshint bitwise: true*/
        return dst;
    }
};
// Constructor function
DDSLoader.create = function ddsLoaderFn(params) {
    var loader = new DDSLoader();
    loader.gd = params.gd;
    loader.onload = params.onload;
    loader.onerror = params.onerror;
    /*jshint bitwise: false*/
    function MAKEFOURCC(c0, c1, c2, c3) {
        return (c0.charCodeAt(0) + (c1.charCodeAt(0) * 256) + (c2.charCodeAt(0) * 65536) + (c3.charCodeAt(0) * 16777216));
    }
    /*jshint bitwise: true*/
    loader.FOURCC_ATI1 = MAKEFOURCC('A', 'T', 'I', '1');
    loader.FOURCC_ATI2 = MAKEFOURCC('A', 'T', 'I', '2');
    loader.FOURCC_RXGB = MAKEFOURCC('R', 'X', 'G', 'B');
    var src = params.src;
    if(src) {
        loader.src = src;
        var xhr;
        if(window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else if(window.ActiveXObject) {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        } else {
            if(params.onerror) {
                params.onerror("No XMLHTTPRequest object could be created");
            }
            return null;
        }
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4) {
                if(!TurbulenzEngine || !TurbulenzEngine.isUnloading()) {
                    var xhrStatus = xhr.status;
                    var xhrStatusText = xhr.status !== 0 && xhr.statusText || 'No connection';
                    // Sometimes the browser sets status to 200 OK when the connection is closed
                    // before the message is sent (weird!).
                    // In order to address this we fail any completely empty responses.
                    // Hopefully, nobody will get a valid response with no headers and no body!
                    if(xhr.getAllResponseHeaders() === "" && xhr.responseText === "" && xhrStatus === 200 && xhrStatusText === 'OK') {
                        loader.onload('', 0);
                        return;
                    }
                    if(xhrStatus === 200 || xhrStatus === 0) {
                        var buffer;
                        if(xhr.responseType === "arraybuffer") {
                            buffer = xhr.response;
                        } else if(xhr.mozResponseArrayBuffer) {
                            buffer = xhr.mozResponseArrayBuffer;
                        } else//if (xhr.responseText !== null)
                         {
                            /*jshint bitwise: false*/
                            var text = xhr.responseText;
                            var numChars = text.length;
                            buffer = [];
                            buffer.length = numChars;
                            for(var i = 0; i < numChars; i += 1) {
                                buffer[i] = (text.charCodeAt(i) & 255);
                            }
                            /*jshint bitwise: true*/
                                                    }
                        // Fix for loading from file
                        if(xhrStatus === 0 && window.location.protocol === "file:") {
                            xhrStatus = 200;
                        }
                        loader.processBytes(new Uint8Array(buffer));
                        if(loader.data) {
                            if(loader.onload) {
                                loader.onload(loader.data, loader.width, loader.height, loader.format, loader.numLevels, (loader.numFaces > 1), loader.depth, xhrStatus);
                            }
                        } else {
                            if(loader.onerror) {
                                loader.onerror();
                            }
                        }
                    } else {
                        if(loader.onerror) {
                            loader.onerror();
                        }
                    }
                }
                // break circular reference
                xhr.onreadystatechange = null;
                xhr = null;
            }
        };
        xhr.open("GET", params.src, true);
        if(xhr.hasOwnProperty && xhr.hasOwnProperty("responseType")) {
            xhr.responseType = "arraybuffer";
        } else if(xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        } else {
            xhr.setRequestHeader("Content-Type", "text/plain; charset=x-user-defined");
        }
        xhr.send(null);
    } else {
        loader.processBytes((params.data));
        if(loader.data) {
            if(loader.onload) {
                loader.onload(loader.data, loader.width, loader.height, loader.format, loader.numLevels, (loader.numFaces > 1), loader.depth);
            }
        } else {
            if(loader.onerror) {
                loader.onerror();
            }
        }
    }
    return loader;
};
