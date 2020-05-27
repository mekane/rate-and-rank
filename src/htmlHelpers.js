function toCssClassName(string) {
    const noSpaces = string.replace(/\s|-/g, '_');
    return 'c' + noSpaces.replace(/[\W]/g, '');
}

module.exports = {
    toCssClassName
};