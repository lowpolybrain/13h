const patterns = {
  lib: './lib',
};

export const replacePatterns = (path) => path.replace(/\$(\w+)/g, (f, a) => patterns[a]);
