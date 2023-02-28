const ImportAll = (r) =>
  r.keys().reduce((acc, curr) => {
    acc[curr.replace("./", "")] = r(curr);
    return acc;
  }, {});

export default ImportAll;
