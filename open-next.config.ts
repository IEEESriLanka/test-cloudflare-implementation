
const config = {
  default: {
    buildCommand: "npm run build:native",
  },
  commands: {
    build: {
      // This is passed to the build function. 
      // We need to define buildCommand inside 'default' usually, 
      // but let's check standard OpenNext config structure. 
      // Based on docs, it's usually:
      // export default { default: { ... } };
    }
  }
};

export default {
  default: {
    buildCommand: "npm run build:native",
  },
};
