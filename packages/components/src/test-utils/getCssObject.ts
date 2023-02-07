export const getCssObject = (cssString: string): object => {
  // useful for debugging
  // const mediaQueriesAndSelectors = Array.from(cssString.matchAll(/(.+) {/g)).map(([, selector]) => selector);
  // console.log(mediaQueriesAndSelectors);

  const jsonCssString = cssString
    .replace(/"/g, "'") // replace double quotes with single quotes
    .replace(/(.+) {/g, '"$1": {') // wrap selectors in double quotes
    .replace(/ ([\w-:]+): /g, '"$1": ') // wrap css properties in double quotes, initial space is to skip media query values
    .replace(/: (.+);/g, ': "$1",') // wrap css values in double quotes and convert semi colon to colon
    .replace(/,(\s+})/g, '$1') // remove comma of last value
    .replace(/}\n([^}])/g, '},\n$1'); // add comma after closing bracket if not nested

  const cssObject = JSON.parse(`{${jsonCssString}}`);
  // console.log(cssObject);

  return cssObject;
};
