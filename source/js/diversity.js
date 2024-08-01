
function Get(name) {
    return localStorage ? localStorage.getItem(name) : Cookies.get(name);
}

function Set(name, value) {
    if (localStorage)
        localStorage.setItem(name, value);
    else {
        var date = new Date();
        // 默认有效期 30天 
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        Cookies.set(name, value, { expires: date });
    }
}

function Remove(name) {
    if (localStorage)
        localStorage.removeItem(name)
    else
        Cookies.remove(name);
}