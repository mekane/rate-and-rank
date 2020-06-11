function toCssClassName(string) {
    const noSpaces = string.replace(/\s|-/g, '_');
    return 'col' + noSpaces.replace(/[\W]/g, '');
}

module.exports = {
    toCssClassName
};