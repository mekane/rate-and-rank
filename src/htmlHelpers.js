/**
 * Pure functions that help with converting from DataGrid names to html space
 */

function cssSafeString(string) {
    const noSpaces = string.replace(/\s|-/g, '_');
    return noSpaces.replace(/[\W]/g, '');
}

function toCssClassName(string) {
    return 'col' + cssSafeString(string);
}

module.exports = {
    cssSafeString,
    toCssClassName
};