const searchUserFootballer =  (array, name) => {
    let value = 0;
    array.forEach((item) => {if (item.footballer.name == name) value = item.amount})
    return value;
}

export {searchUserFootballer};
