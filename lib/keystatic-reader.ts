import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config';

// Create a reader instance for reading Keystatic content
export const reader = createReader(process.cwd(), keystaticConfig);
