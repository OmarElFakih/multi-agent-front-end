export function createDateString(dateObj){
    let day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate(); 
 
    let month = dateObj.getMonth() + 1 < 10 ? "0" + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;

    let year = dateObj.getFullYear();

    let dateString = day + "-" + month + "-" + year;

    return dateString
}


export function createHourString(dateObj){
    return dateObj.getHours() + ":" + dateObj.getMinutes()

}