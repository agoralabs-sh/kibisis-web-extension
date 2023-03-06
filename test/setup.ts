// @ts-nocheck
import 'mockzilla-webextension';
import { TextEncoder, TextDecoder } from 'util';

global.__ENV__ = 'development';
global.__VERSION__ = 'v1.0.0';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
