/* Module: ImportAll
 *  Description: This module is used to import all files matching a certain pattern using
 *  Webpack's require.context.
 *  It uses the reduce method to create an object containing all the imported files,
 *  with the file name as the key
 *  and the imported file as the value.
 *  Parameter: r - a Webpack require.context object containing the file pattern to be matched
*/

const ImportAll = (r) =>
  r.keys().reduce((acc, curr) => {
    acc[curr.replace("./", "")] = r(curr);
    return acc;
  }, {});

export default ImportAll;
