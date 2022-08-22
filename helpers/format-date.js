
const formatDate = (dateToFormat) => {

    if (typeof (dateToFormat) !== 'number') {
        return `${dateToFormat.toDateString()} ${dateToFormat.toLocaleTimeString()}`
    }
    const date = new Date(dateToFormat * 1000);

    return `${date.toDateString()} ${date.toLocaleTimeString()}`

}

module.exports = formatDate;