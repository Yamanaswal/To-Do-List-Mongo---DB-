
//Passing Function.
module.exports.getCurrentDate = getCurrentDate;

function getCurrentDate() {
    const todayDate = new Date();
    return todayDate.toLocaleDateString("en-US", {weekday: 'long', month: 'long', day: 'numeric'});
}


//shortcut using anonymous function. using export variable.
exports.getCurrentDayOfWeek = function () {
    const todayDate = new Date();
    return  todayDate.toLocaleDateString("en-US", {weekday: 'long'});
}