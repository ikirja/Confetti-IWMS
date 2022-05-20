export const paginateArray = function (array, pageSize, pageNumber) {
  if (!Array.isArray(array)) array = [];
  if (!pageSize || pageSize < 10) pageSize = 10;
  if (!pageNumber || pageNumber < 1) pageNumber = 1;
  
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export const paginateInfo = function (array, pageSize, pageNumber) {
  if (!Array.isArray(array)) array = [];
  if (!pageSize || pageSize < 10) pageSize = 10;
  if (!pageNumber || pageNumber < 1) pageNumber = 1;

  const start = (pageSize * pageNumber) - (pageSize - 1);
  const end = pageSize * pageNumber;

  return {
    from: start,
    to: end <= array.length ? end : array.length,
    total: array.length
  }
}

export const getTotalPages = function (array, pageSize) {
  if (!pageSize || pageSize < 10) pageSize = 10;

  return Math.ceil(array.length / pageSize);
}

export const pagination = function (totalPages, currentPage, positionOfEllipsis) {
  if (!currentPage || currentPage < 1) currentPage = 1;
  if (!positionOfEllipsis) positionOfEllipsis = 0;

  let newArray = [];
  let maxPages = (Number(totalPages) < Number(currentPage)) ? Number(totalPages) : Number(currentPage);
  let minPages = (Number(currentPage) < 1) ? 1 : Number(currentPage);
  let pageAddition = maxPages + Number(positionOfEllipsis);
  let pageSubtraction = minPages - Number(positionOfEllipsis);

  if (Number(positionOfEllipsis) === 0) {
    for (let i = 1; i <= Number(totalPages); i++) {
      newArray.push(String(i));
    }
  } else {
    if (minPages > 1) {
      for (let i = pageSubtraction; i < minPages; i++) {
        newArray.push(String(i));
      }
    }
    for (let i = maxPages; i <= pageAddition; i++) {
      newArray.push(String(i));
    }
  }

  let filterNegative = newArray.filter(function (num) { return Number(num) > 0; });
  let filterMax = filterNegative.filter(function (num) { return Number(num) <= Number(totalPages); });

  if (pageAddition < Number(totalPages) && Number(positionOfEllipsis) !== 0) filterMax.push('...');
  if (pageSubtraction > 1 && Number(positionOfEllipsis) !== 0) filterMax.unshift('...');
  
  return filterMax;
}

export const searchInArray = function (array, searchString) {
  if (!searchString || searchString.length === 0) return [];

  let filterArray = Array.from(array).filter(function (item) {
    if (isNaN(item) === false && Number(item) === Number(searchString)) {
      return true;
    }
    else if (typeof item === 'string' && item.toLowerCase().includes(searchString.toLowerCase())) {
      return true;
    }
    else if (typeof item === 'object' && item !== null) {
      for (let _i = 0, _a = Object.keys(item); _i < _a.length; _i++) {
        let key = _a[_i];
        if (isNaN(item[key]) === false && Number(item[key]) === Number(searchString)) {
          return true;
        }
        else if (typeof item[key] === 'string' && item[key].toLowerCase().includes(searchString.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  });

  return filterArray;
}

export const searchInArrayWithProductObj = function (array, searchString) {
  if (!searchString || searchString.length === 0) return [];

  let filterArray = searchInArray(array, searchString);

  let filterArrayProductObj = Array.from(array).filter(function (item) {
    if (isNaN(item.product) === false && Number(item.product) === Number(searchString)) {
      return true;
    }
    else if (typeof item.product === 'string' && item.product.toLowerCase().includes(searchString.toLowerCase())) {
      return true;
    }
    else if (typeof item.product === 'object' && item.product !== null) {
      for (let _i = 0, _a = Object.keys(item.product); _i < _a.length; _i++) {
        let key = _a[_i];
        if (isNaN(item.product[key]) === false && Number(item.product[key]) === Number(searchString)) {
          return true;
        }
        else if (typeof item.product[key] === 'string' && item.product[key].toLowerCase().includes(searchString.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  });

  const newArray = [ ...filterArray, ...filterArrayProductObj ];

  return newArray.reduce((acc, current) => {
    const isInArray = acc.find(item => item._id.toString() === current._id.toString());

    if (!isInArray) {
      return [ ...acc, ...[current] ];
    } else {
      return acc;
    }
  }, []);
}